

## Bug: Intro MP3 toca concorrentemente com MIDI do tema ao pular rápido

### Causa raiz

Fluxo do bug:
1. Clique no título → `IntroSystem.init()` → tenta carregar intro MP3 via `Mp3Cache.load()` (async)
2. Usuário clica "PULAR" imediatamente → `complete()` executa, seta `_introAudio = null`, inicia `MusicSystem.init()` (MIDI do tema)
3. A Promise do `Mp3Cache.load` resolve **depois** → callback na linha 11029 cria um `new Audio`, seta `_introAudio`, e chama `.play()` — mas ninguém mais vai parar esse áudio porque `complete()` já rodou

### Fix

**Arquivo:** `public/avenida-paulista.html`, linha 11029-11037

Adicionar checagem `if (IntroSystem.isComplete) return;` no início do callback `.then()`:

```js
Mp3Cache.load(MP3_TRACKS.introCrawl).then(function(b) {
  if (IntroSystem.isComplete) return;  // ← adicionar
  if (b) {
    IntroSystem._introAudio = new Audio(b);
    IntroSystem._introAudio.volume = 0.8;
    IntroSystem._introAudio.play().catch(function(e) {
      console.error('[IntroSystem] Fallback play error:', e);
    });
  }
});
```

Uma linha adicionada. Zero risco de side effects.

