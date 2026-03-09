

## Atualização do MP3_TRACKS

Alterar a linha 5115 de `public/avenida-paulista.html`:

```js
// De:
defeat: '',    // placeholder

// Para:
defeat: 'AVP Combat Defeat.mp3',
```

Isso ativa a trilha MP3 de derrota no sistema híbrido, com cache offline e fallback MIDI automático.

