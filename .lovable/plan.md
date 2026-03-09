

## Risada da bruxa: sem som na 4ª palavra + delay de metade da música

### Alterações em `public/avenida-paulista.html`

**1. Silenciar som na 4ª palavra (~linha 7414)**

Envolver o bloco de áudio do chanting com condição: só tocar se `witchWords < 4` (após o incremento na linha 7408, a 4ª palavra resulta em `witchWords === 4`).

```js
// Linha 7414 — trocar de incondicional para condicional
if (GameState.witchWords < 4) {
  (async () => {
    // ... código existente do witchChanting MP3 + fallback ...
  })();
}
```

**2. Atrasar risada para metade da música de game over (~linha 9167)**

Usar `GameOverMusicSystem.duration` (já usado na linha 9233) para calcular metade da duração e atrasar a risada com `setTimeout`.

```js
if (GameState.witchWords >= 4) {
  const halfDuration = ((GameOverMusicSystem.duration || 10) / 2) * 1000;
  setTimeout(() => {
    (async () => {
      try {
        const blobUrl = await Mp3Cache.load(MP3_TRACKS.witchWin);
        if (blobUrl) {
          const a = new Audio(blobUrl);
          if (MusicSystem.musicGain) a.volume = MusicSystem.musicGain.gain.value;
          a.play().catch(() => {});
        }
      } catch(e) {}
    })();
  }, halfDuration);
}
```

2 pontos de edição, zero risco de quebra.

