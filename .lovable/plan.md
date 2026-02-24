

# Musica de Derrota (Dano) Embutida + Sincronizacao com Animacao de Resultado

## Resumo

Criar um `DefeatMusicSystem` seguindo o mesmo padrao do `CombatMusicSystem`, usando o MIDI `Samplab_defeat.mid` embutido em Base64. Essa musica toca durante a fase de revelacao do dano (apos o primeiro CONFIRMAR), e a animacao das linhas de resultado e sincronizada com a duracao da musica.

## Mudancas

### 1. Constante DEFEAT_MIDI_BASE64

Converter o arquivo `Samplab_defeat.mid` para Base64 e embutir como constante no HTML, logo apos a constante `COMBAT_MIDI_BASE64` (linha ~3141).

```javascript
const DEFEAT_MIDI_BASE64 = "...base64 do midi de derrota...";
```

### 2. Objeto DefeatMusicSystem

Criado logo apos o `CombatMusicSystem` (linha ~3313), seguindo o mesmo padrao exato:
- Parser MIDI identico (header, tracks, varlen, etc.)
- Sintese via Web Audio API
- **Timbre sombrio**: triangle + sine com frequencia mais grave (mais "triste/pesado" que o combate)
- **SEM loop**: toca uma vez so e para
- Carregamento via Base64 embutido (funciona offline)
- Expoe `this.duration` apos parsear

```javascript
const DefeatMusicSystem = {
  isPlaying: false,
  isLoaded: false,
  volume: 0.12,
  notes: [],
  duration: 0,
  scheduledOscs: [],
  
  init: function() { this.loadMIDI(); },
  loadMIDI: function() { /* parse Base64, mesmo codigo */ },
  playNote: function(note, startTime, duration, velocity) {
    // Timbre sombrio: triangle (principal) + sine sub-bass
  },
  scheduleNotes: function() { /* agenda notas, SEM loop */ },
  start: function() { /* inicia reproducao unica */ },
  stop: function() { /* para osciladores */ }
};
```

### 3. Sincronizacao: Animacao de resultado atrelada a duracao da musica

Em `CombatModal.showResult()` (linha ~4405), em vez de usar delays fixos de 300ms por linha, calcular os delays com base na duracao da musica de derrota:

```text
Duracao da musica = DefeatMusicSystem.duration (ex: 5 segundos)
Total de linhas de resultado = 3-4 (separador + dano + HP/derrotado + extraMessage)
Delay por linha = (duracao * 1000) / (total de linhas + 1)
                  (+1 para margem antes do botao confirmar)
```

Assim:
- Musica de derrota comeca quando o primeiro CONFIRMAR e clicado
- Cada linha de resultado aparece em intervalo calculado
- Ultima linha aparece quando a musica esta acabando
- Botao CONFIRMAR aparece logo apos a musica terminar

Se `DefeatMusicSystem` nao estiver carregado (fallback), usa os delays fixos originais (300ms).

### 4. Integracao com CombatModal

**`CombatModal.confirm()` fase 1** (linha ~4387):
```javascript
if (this.phase === 1) {
  CombatMusicSystem.stop(); // para musica de combate (ja existe)
  SoundSystem.playCombatImpact(); // boom (ja existe)
  DefeatMusicSystem.start(); // ADICIONAR: inicia musica de derrota
  // ... resto existente ...
  this.showResult();
}
```

**`CombatModal.showResult()`** (linha ~4405):
```javascript
// Calcular delay dinamico baseado na duracao da musica de derrota:
var musicDuration = DefeatMusicSystem.isLoaded ? DefeatMusicSystem.duration : 0;
var totalItems = resultLines.length + 1; // +1 para margem
var lineDelay = musicDuration > 0 ? (musicDuration * 1000) / totalItems : 300;
// Usar lineDelay em vez do 300 fixo
```

**`CombatModal.confirm()` fase 3 / close** (linha ~4400):
```javascript
// Parar musica de derrota ao fechar
DefeatMusicSystem.stop();
```

**`CombatModal.close()`** (linha ~4451):
```javascript
DefeatMusicSystem.stop(); // seguranca
```

**`CombatModal.reset()`** (linha ~4476):
```javascript
DefeatMusicSystem.stop(); // seguranca
```

### 5. Inicializacao

Em `Game.init()`, adicionar:
```javascript
DefeatMusicSystem.init();
```

## Ordem de Implementacao

1. Converter MIDI para Base64 e adicionar constante `DEFEAT_MIDI_BASE64`
2. Criar `DefeatMusicSystem` com parser, timbre sombrio e reproducao unica
3. Modificar `CombatModal.confirm()` fase 1 para iniciar DefeatMusicSystem
4. Modificar `CombatModal.showResult()` para calcular delays sincronizados
5. Adicionar stops de seguranca em close/reset
6. Inicializar em `Game.init()`

## Arquivo Modificado

- `public/avenida-paulista.html` (unico arquivo - tudo inline, MIDI embutido em Base64)

