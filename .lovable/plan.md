

## Diagnóstico

Dois problemas distintos:

### 1. Exploração MP3 nunca toca
O `start()` síncrono funciona assim: se o blob não está no cache → toca MIDI e carrega MP3 em background. Mas **nunca faz a troca** de MIDI para MP3 depois que o blob fica pronto. O `start()` da exploração só é chamado uma vez (no início do jogo). Se `preloadAll()` não terminou antes desse momento, o MIDI toca e o MP3 carregado em background é ignorado até o próximo `start()` (só após um combate).

### 2. Intro MP3 não toca
O código da intro faz `await Mp3Cache.load(...)` dentro de um async IIFE no click handler. Se `preloadAll()` já completou, o `load()` retorna do Map instantaneamente (sem delay real no await) e o browser ainda aceita o gesto. Se não completou, o `await fetch()` quebra a cadeia do user gesture → `audio.play()` bloqueado.

## Fix — arquivo `public/avenida-paulista.html`

### Mudança 1: Auto-switch MIDI→MP3 no fallback (linhas 5614-5620)

Quando o blob carrega em background, parar o MIDI e iniciar o MP3 automaticamente:

```js
} else {
  // MP3 não carregou ainda → MIDI agora, carrega em background
  player._mp3Active = false;
  console.log('[Mp3Layer] Not preloaded yet, using MIDI:', trackKey);
  Mp3Cache.load(url).then(b => {
    blobUrl = b;
    // Auto-switch: se ainda está tocando (MIDI), trocar para MP3
    if (b && player.isPlaying) {
      originalStop();
      if (!audio) {
        audio = new Audio(blobUrl);
        audio.loop = loop;
      }
      if (MusicSystem.musicGain) {
        audio.volume = MusicSystem.musicGain.gain.value;
      } else {
        audio.volume = MusicSystem.volume || 1.0;
      }
      player._mp3Active = true;
      audio.play().then(() => {
        console.log('[Mp3Layer] ▶ Auto-switched to MP3:', trackKey);
        if (player.updateButton) player.updateButton();
      }).catch(() => {
        // Browser bloqueou (sem gesto) — manter MIDI
        player._mp3Active = false;
        originalStart();
      });
    }
  });
  originalStart();
}
```

### Mudança 2: Intro — check síncrono do cache antes do await (linhas 10995-11006)

```js
(async () => {
  console.log('[IntroSystem] Loading intro music...');
  // Check síncrono primeiro (preserva user gesture se já cacheado)
  let blobUrl = _mp3BlobCache.get(MP3_TRACKS.introCrawl) || null;
  if (!blobUrl) {
    blobUrl = await Mp3Cache.load(MP3_TRACKS.introCrawl);
  }
  console.log('[IntroSystem] blobUrl:', blobUrl);
  if (blobUrl) {
    IntroSystem._introAudio = new Audio(blobUrl);
    IntroSystem._introAudio.volume = 0.8;
    IntroSystem._introAudio.play().catch(e => console.error('[IntroSystem] Play error:', e));
  } else {
    console.warn('[IntroSystem] Failed to load intro music');
  }
})();
```

### O que NÃO muda
- `preloadAll()`, `Mp3Cache.load()`, `stop()`, `pause()` — intocados
- Efeitos da bruxa — intocados
- Paths dos MP3s — intocados

