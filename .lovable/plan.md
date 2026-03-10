

## Corrigir: Som do botão confirmar deve usar o slider de FX

### Problema
O `ClickMusicSystem` (som do botão confirmar) conecta ao `MusicSystem.musicGain` (slider de música 🎵), mas deveria conectar ao `SoundSystem.masterGain` (slider de FX 🔊), pois é um efeito sonoro de UI.

### Causa raiz
Na função `createMidiPlayer`, linha 5494, todos os MIDI players conectam ao mesmo destino:
```javascript
masterGain.connect(MusicSystem.musicGain || ctx.destination);
```
Isso é correto para CombatMusicSystem, DefeatMusicSystem, VictoryMusicSystem e GameOverMusicSystem (são músicas), mas errado para ClickMusicSystem (é efeito sonoro).

### Solução
Adicionar uma opção `isSfx` ao config do `createMidiPlayer`. Quando `isSfx: true`, conectar ao `SoundSystem.masterGain` em vez de `MusicSystem.musicGain`.

**1. Linha 5494 — `playNote` em `createMidiPlayer`:**
```javascript
masterGain.connect(
  config.isSfx
    ? (SoundSystem.masterGain || ctx.destination)
    : (MusicSystem.musicGain || ctx.destination)
);
```

**2. Linha 5561 — config do ClickMusicSystem:** Adicionar `isSfx: true`:
```javascript
var ClickMusicSystem = createMidiPlayer({
  base64: CLICK_MIDI_BASE64, volume: 0.7, name: 'ClickMusicSystem',
  osc1Type: 'square', osc2Type: 'triangle', freqMult: 1,
  gain1: 0.42, gain2: 0.175, attack: 0.003, decay: 0.05, sustain: 0.3, release: 0.08,
  isSfx: true
});
```

### Arquivo
`public/avenida-paulista.html` (2 edições pontuais)

