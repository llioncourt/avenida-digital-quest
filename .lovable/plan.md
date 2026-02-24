

# Musica de Combate Embutida + Sincronizacao com Animacao

## Resumo

Criar um `CombatMusicSystem` com o MIDI embutido em Base64 (igual ao `MusicSystem`), usando timbre agressivo. A animacao de digitacao dos cards sera **sincronizada** com a duracao da musica: a ultima linha aparece exatamente quando a musica termina.

## Mudancas

### 1. Constante COMBAT_MIDI_BASE64

Converter o arquivo `Samplab_untitled.mid` para Base64 e embutir como constante no HTML, ao lado da constante `MIDI_BASE64` existente (linha ~2881).

```javascript
const COMBAT_MIDI_BASE64 = "...base64 do midi de combate...";
```

### 2. Objeto CombatMusicSystem

Criado logo apos o `MusicSystem`, seguindo o mesmo padrao:
- Parser MIDI identico (header, tracks, varlen, etc.)
- Sintese via Web Audio API
- **Timbre agressivo**: sawtooth + square (em vez de triangle + sine do MusicSystem)
- **SEM loop**: toca uma vez so e para
- Carregamento via Base64 embutido (funciona offline)
- Expoe `this.duration` apos parsear, para que o CombatModal saiba quanto tempo a musica dura

```javascript
const CombatMusicSystem = {
  isPlaying: false,
  isLoaded: false,
  volume: 0.12,
  notes: [],
  duration: 0,        // <-- duracao total em segundos
  scheduledOscs: [],
  
  init: function() { this.loadMIDI(); },
  loadMIDI: function() { /* parse Base64, mesmo codigo do MusicSystem */ },
  playNote: function(note, startTime, duration, velocity) {
    // sawtooth (principal) + square (harmonico) = timbre combativo
  },
  scheduleNotes: function() { /* agenda notas, SEM loop */ },
  start: function() { /* inicia reproducao unica */ },
  stop: function() { /* para osciladores */ }
};
```

### 3. Sincronizacao: Animacao atrelada a duracao da musica

O ponto chave: em `CombatModal.showStats()`, em vez de usar delays fixos (250ms por linha), calcular os delays com base na duracao da musica de combate.

```text
Duracao da musica = CombatMusicSystem.duration (ex: 8.5 segundos)
Total de linhas = linhas do atacante + linhas do defensor
Delay por linha = (duracao * 1000) / (total de linhas + 2)
                  (+2 para os titulos e margem final)
```

Assim:
- Musica comeca quando o modal abre
- Cada linha aparece em intervalo calculado
- Ultima linha aparece quando a musica esta acabando
- Botao CONFIRMAR aparece logo apos a musica terminar

Se `CombatMusicSystem` nao estiver carregado (fallback), usa os delays fixos originais (250ms).

### 4. Integracao com CombatModal

**`CombatModal.open()`** (linha ~4063):
```javascript
// Apos parar MusicSystem:
CombatMusicSystem.start();
```

**`CombatModal.showStats()`** (linha ~4083):
```javascript
// Calcular delay dinamico:
var musicDuration = CombatMusicSystem.isLoaded ? CombatMusicSystem.duration : 0;
var totalItems = attackerLines.length + defenderLines.length;
var lineDelay = musicDuration > 0 ? (musicDuration * 1000) / (totalItems + 2) : 250;
// Usar lineDelay em vez do 250 fixo
```

**`CombatModal.confirm()` fase 1** (linha ~4202):
```javascript
CombatMusicSystem.stop(); // para musica antes do impacto
SoundSystem.playCombatImpact();
```

**`CombatModal.close()`** (linha ~4262):
```javascript
CombatMusicSystem.stop(); // seguranca
```

**`CombatModal.reset()`** (linha ~4286):
```javascript
CombatMusicSystem.stop(); // seguranca
```

### 5. Inicializacao

Em `Game.init()`, adicionar:
```javascript
CombatMusicSystem.init();
```

## Ordem de Implementacao

1. Converter MIDI para Base64 e adicionar constante `COMBAT_MIDI_BASE64`
2. Criar `CombatMusicSystem` com parser, timbre agressivo e reproducao unica
3. Modificar `CombatModal.showStats()` para calcular delays sincronizados
4. Integrar start/stop nos pontos do CombatModal
5. Inicializar em `Game.init()`

## Arquivo Modificado

- `public/avenida-paulista.html` (unico arquivo - tudo inline, MIDI embutido em Base64)

