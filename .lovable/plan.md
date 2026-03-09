

## Análise: A risada da bruxa NÃO será afetada

A risada da bruxa (linhas 9689-9698) e os outros efeitos da bruxa (chanting, summon) usam `Mp3Cache.load()` **diretamente** — são chamadas async independentes dentro de `setTimeout` ou IIFEs. Eles **não passam** pelo `player.start` do `_addMp3Layer`.

O plano de remover `async` do `player.start` afeta **apenas** os players de música (exploration, combat, gameover, etc.) que passam pelo `_addMp3Layer`. Os efeitos da bruxa continuam funcionando exatamente como antes porque:

1. `witchWin` — está dentro de um `setTimeout` (já não tem user gesture de qualquer forma)
2. `witchChanting` — async IIFE standalone
3. `witchSummon` — async IIFE standalone

**Nenhum deles usa `player.start`.** São todos `new Audio(blobUrl).play()` direto.

## Plano ajustado

**Arquivo:** `public/avenida-paulista.html`

**Única mudança** — linhas 5575-5621, função `player.start` dentro de `_addMp3Layer`:

```js
player.start = function() {
  if (audio && !audio.paused && player._mp3Active) return;

  // Busca síncrona do cache em memória (Map interno do Mp3Cache)
  if (!blobUrl) {
    blobUrl = Mp3Cache._cache ? Mp3Cache._cache.get(url) : null;
  }

  if (blobUrl) {
    if (!audio) {
      audio = new Audio(blobUrl);
      audio.loop = loop;
    }
    if (MusicSystem.musicGain) {
      audio.volume = MusicSystem.musicGain.gain.value;
    } else {
      audio.volume = MusicSystem.volume || 1.0;
    }
    if (stoppedManually || audio.ended) audio.currentTime = 0;
    stoppedManually = false;
    player._mp3Active = true;
    player.isPlaying = true;
    audio.play().then(() => {
      console.log('[Mp3Layer] ▶ Playback started:', trackKey);
      if (player.updateButton) player.updateButton();
    }).catch(err => {
      console.warn('[Mp3Layer] Fallback MIDI:', err);
      player._mp3Active = false;
      originalStart();
    });
  } else {
    // MP3 não carregou ainda → MIDI agora, carrega em background
    player._mp3Active = false;
    Mp3Cache.load(url).then(b => { blobUrl = b; });
    originalStart();
  }
};
```

**Também necessário:** expor o Map interno do `Mp3Cache` como `Mp3Cache._cache` (se ainda não exposto) para que a busca síncrona funcione.

### O que NÃO muda
- `witchWin`, `witchChanting`, `witchSummon` — intocados
- `preloadAll()` — intocado
- `stop()`, `pause()` — intocados
- `Mp3Cache.load()` — intocado (continua async para quem precisa)
- Paths dos MP3s — intocados

