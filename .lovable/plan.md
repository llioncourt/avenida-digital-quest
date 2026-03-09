

## Diagnóstico

O problema é simples: `_addMp3Layer` salva `originalStart` e `originalStop`, mas **não salva `originalPause`** (o MIDI player nem tem `pause`). Quando o combate abre:

1. `MusicSystem.pause()` é chamado (linha 7265)
2. O novo `pause()` só pausa o `audio` HTML se `_mp3Active === true`
3. Se a exploração está tocando via **MIDI fallback** (`_mp3Active = false`), o `pause()` não faz nada com o MIDI — só seta `isPlaying = false`
4. O MIDI continua tocando → duas músicas ao mesmo tempo

O MIDI original não tem método `pause()` (só `stop()`), então a versão antiga resolvia isso chamando `stop()` no else. Mas agora o `pause()` adicionado pelo `_addMp3Layer` intercepta e não para o MIDI.

## Fix

**Arquivo:** `public/avenida-paulista.html` — apenas a função `pause` dentro de `_addMp3Layer` (linhas 5623-5629)

Adicionar fallback para parar o MIDI quando MP3 não está ativo:

```js
player.pause = function() {
  if (audio && player._mp3Active) {
    audio.pause();
    // NÃO reseta currentTime — permite retomar
  } else {
    // MIDI fallback: MIDI não tem pause, então stop
    originalStop();
  }
  player.isPlaying = false;
};
```

**Uma linha adicionada.** Nada mais muda.

