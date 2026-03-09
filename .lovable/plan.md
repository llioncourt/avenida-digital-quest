

## Tocar "AVP Witch Win.mp3" no Game Over por portal da bruxa

Exatamente o plano anterior, confirmando: sem fallback para efeito synth, sem erro. Se offline e sem cache, simplesmente não toca nada extra (a música de game over já está tocando normalmente).

### Alterações em `public/avenida-paulista.html`

**1. Adicionar track ao `MP3_TRACKS` (~linha 5118)**
```js
witchSummon: 'AVP Witch Summon.mp3',
witchWin: 'AVP Witch Win.mp3'
```

**2. Em `showGameOver`, após `GameOverMusicSystem.start()`**

```js
// Se game over por portal da bruxa, tocar AVP Witch Win junto
if (GameState.witchWords >= 4) {
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
}
```

O `try/catch` externo + `.catch(() => {})` no `play()` garantem zero erros em qualquer cenário (offline, sem cache, bloqueio de autoplay). 2 pontos de edição.

