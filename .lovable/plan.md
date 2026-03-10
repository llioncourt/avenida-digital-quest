

## Bug: Música tema continua tocando durante combate

### Causa raiz

Dois problemas:

1. **MP3 async resolve depois do pause**: Quando `CombatDialog.open()` chama `MusicSystem.pause()`, o MP3 pode ainda estar carregando no `.then()`. O `pause()` vê `_mp3Active = false` e só para o MIDI. Depois, o `.then()` resolve, cria um novo `Audio()`, e começa a tocar — sem ninguém para pará-lo.

2. **Audio anterior nunca é limpo**: Cada chamada a `start()` cria um `new Audio()` sem parar o anterior. A variável `audio` é sobrescrita, mas o objeto antigo continua tocando.

### Fix

**Arquivo:** `public/avenida-paulista.html`, função `_addMp3Layer` (linhas 5584-5677)

**1. Adicionar flag `_stopped` para cancelar `.then()` pendentes:**

```js
player.start = function() {
  // Parar audio anterior
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  player._mp3Active = false;
  player._stopped = false;  // Reset flag
  
  // ... resto da lógica existente ...
  
  Mp3Cache.ensureTrack(trackKey).then(function(blobUrl) {
    if (!blobUrl) return;
    if (!player.isPlaying || player._stopped) return;  // Checar flag
    
    // Parar audio anterior de novo (safety)
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    audio = new Audio(blobUrl);
    // ... resto ...
  });
};
```

**2. `pause()` e `stop()` setam a flag E param ambos MIDI e MP3:**

```js
player.pause = function() {
  player._stopped = true;  // Cancela .then() pendente
  if (audio) {
    audio.pause();
  }
  // Sempre parar MIDI também (pode estar tocando como fallback)
  originalStop();
  player._mp3Active = false;
  player.isPlaying = false;
};

player.stop = function() {
  player._stopped = true;  // Cancela .then() pendente
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  player._mp3Active = false;
  player.isPlaying = false;
  originalStop();  // Sempre para MIDI
};
```

A mudança chave é:
- `_stopped` flag impede o `.then()` de criar Audio depois de um pause/stop
- `pause()`/`stop()` **sempre** param tanto o Audio quanto o MIDI (antes só parava um ou outro)
- Audio anterior é explicitamente parado antes de criar um novo

