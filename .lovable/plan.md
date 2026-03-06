

# Refatoracao Profunda do `avenida-paulista.html`

## Diagnostico

O arquivo tem **10.195 linhas**. A maior oportunidade de reducao sem risco esta nos **6 sistemas de musica** (linhas 4491-5635), que somam **~1.145 linhas** de codigo quase identico. Cada um repete:

- Parser MIDI identico (~60 linhas cada)
- `scheduleNotes` identico (~10 linhas cada)
- `start` / `stop` identicos (~15 linhas cada)

A unica diferenca entre eles sao: dados Base64, volume, e parametros do `playNote` (tipos de oscilador, frequencias, ADSR).

## Plano

### 1. Criar factory `createMidiPlayer` (~120 linhas)

Uma funcao que recebe config e retorna um objeto player completo:

```javascript
function createMidiPlayer(config) {
  // config: { base64, volume, osc1Type, osc2Type, freqMult,
  //           gain1, gain2, attack, decay, sustain, release,
  //           loop, name }
  return {
    isPlaying: false, isLoaded: false,
    volume: config.volume,
    notes: [], duration: 0, scheduledOscs: [],
    // loadMIDI, playNote, scheduleNotes, start, stop
    // tudo parametrizado pelo config
  };
}
```

### 2. Substituir os 5 sistemas repetidos por chamadas a factory (~30 linhas)

```javascript
var CombatMusicSystem = createMidiPlayer({
  base64: COMBAT_MIDI_BASE64, volume: 0.12,
  osc1Type: 'sawtooth', osc2Type: 'square', freqMult: 2,
  gain1: 0.6, gain2: 0.2,
  attack: 0.005, decay: 0.08, sustain: 0.5, release: 0.1,
  name: 'CombatMusicSystem'
});

var DefeatMusicSystem = createMidiPlayer({ ... });
var VictoryMusicSystem = createMidiPlayer({ ... });
var ClickMusicSystem = createMidiPlayer({ ... });
var GameOverMusicSystem = createMidiPlayer({ ... });
```

### 3. MusicSystem (principal) como caso especial

O `MusicSystem` tem funcionalidade extra (loop, playbackSpeed, toggle, updateButton, playDefeatMusic, playVictoryMusic). Sera criado via factory + extensao com os metodos adicionais.

### 4. O que NAO sera alterado

- **CSS** (linhas 1-2175): sem mudancas
- **HTML**: sem mudancas
- **Toda logica de jogo** (GameState, Actions, Rules, Events, Render, etc): sem mudancas
- **SoundSystem**: sem mudancas (cada metodo de som e unico, nao ha duplicacao significativa)
- **Todas as referencias externas** (`CombatMusicSystem.start()`, `.stop()`, `.init()`, `.duration`, `.isLoaded`): mantidas identicas

### Resultado esperado

- **~1.145 linhas** dos 6 music systems → **~200 linhas** (factory + instancias)
- **~950 linhas eliminadas** sem perda de funcionalidade
- Arquivo final: **~9.250 linhas** (reducao de ~9%)
- Zero mudanca de comportamento — mesmos nomes de objetos, mesmos metodos, mesmos parametros de audio

