
# Substituir Som do Confirmar por MIDI Embutido (ClickMusicSystem)

## Resumo

Substituir o som procedural `SoundSystem.playCombatImpact()` (noise burst + oscilladores) por um novo `ClickMusicSystem` que toca o MIDI `Samplab_click.mid` embutido em Base64, seguindo o padrao exato dos outros sistemas (DefeatMusicSystem, VictoryMusicSystem).

## Mudancas no arquivo `public/avenida-paulista.html`

### 1. Constante CLICK_MIDI_BASE64

Converter o arquivo `Samplab_click.mid` para Base64 e adicionar como constante logo apos `VICTORY_MIDI_BASE64` (linha ~3145).

```javascript
const CLICK_MIDI_BASE64 = "...base64 do midi...";
```

### 2. Objeto ClickMusicSystem

Criado logo apos o `VictoryMusicSystem` (linha ~3600+), seguindo o mesmo padrao exato:

- Parser MIDI identico (header, tracks, varlen, note on/off)
- Sintese via Web Audio API
- **Timbre percussivo/impactante**: square (principal) + triangle (corpo) -- curto e marcante, como um "click" de confirmacao
- **SEM loop**: toca uma vez so e para
- Carregamento via Base64 embutido (funciona offline)
- Expoe `this.duration` apos parsear

```javascript
const ClickMusicSystem = {
  isPlaying: false,
  isLoaded: false,
  volume: 0.15,
  notes: [],
  duration: 0,
  scheduledOscs: [],

  init: function() { this.loadMIDI(); },
  loadMIDI: function() { /* parse CLICK_MIDI_BASE64, mesmo codigo */ },
  playNote: function(note, startTime, duration, velocity) {
    // Timbre percussivo: square (principal) + triangle (corpo)
    osc1.type = 'square';
    osc2.type = 'triangle';
    osc2.frequency.value = freq; // mesma oitava
  },
  scheduleNotes: function() { /* agenda notas, SEM loop */ },
  start: function() { /* inicia reproducao unica */ },
  stop: function() { /* para osciladores */ }
};
```

### 3. Substituir chamada em CombatModal.confirm()

Na linha ~4746, trocar:

```javascript
// ANTES:
SoundSystem.playCombatImpact();

// DEPOIS:
ClickMusicSystem.start();
```

### 4. Stops de seguranca

Adicionar `ClickMusicSystem.stop()` em:
- `CombatModal.close()`
- `CombatModal.reset()`

### 5. Inicializacao

Em `Game.init()`, adicionar:
```javascript
ClickMusicSystem.init();
```

## Timbre do ClickMusicSystem

- **MusicSystem** (fundo): triangle + sine = suave, ambiente
- **CombatMusicSystem** (abertura combate): sawtooth + square = agressivo
- **DefeatMusicSystem** (jogador leva dano): triangle + sine grave = sombrio
- **VictoryMusicSystem** (jogador causa dano): square + sawtooth brilhante = triunfante
- **ClickMusicSystem** (botao confirmar): square + triangle = percussivo, marcante

## Ordem de Implementacao

1. Converter MIDI para Base64 e adicionar constante `CLICK_MIDI_BASE64`
2. Criar `ClickMusicSystem` com parser, timbre percussivo e reproducao unica
3. Substituir `SoundSystem.playCombatImpact()` por `ClickMusicSystem.start()` em `CombatModal.confirm()`
4. Adicionar stops de seguranca em close/reset
5. Inicializar em `Game.init()`

## Arquivo Modificado

- `public/avenida-paulista.html` (unico arquivo - tudo inline, MIDI embutido em Base64)
