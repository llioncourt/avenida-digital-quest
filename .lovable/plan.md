# Musica de Vitoria (Ataque do Jogador) Embutida + Sincronizacao

## Resumo

Criar um `VictoryMusicSystem` seguindo o mesmo padrao exato do `DefeatMusicSystem`, usando o MIDI `Samplab_combate_victory.mid` embutido em Base64. Essa musica toca durante a revelacao do dano **quando o jogador (ou aliado) ataca**, enquanto a `DefeatMusicSystem` continua tocando quando o jogador (ou aliado) e atacado.

## Mudancas

### 1. Constante VICTORY_MIDI_BASE64

Converter o arquivo `Samplab_combate_victory.mid` para Base64 e embutir como constante no HTML, logo apos a constante `DEFEAT_MIDI_BASE64`.

```javascript
const VICTORY_MIDI_BASE64 = "...base64 do midi de vitoria...";
```

### 2. Objeto VictoryMusicSystem

Criado logo apos o `DefeatMusicSystem` (linha ~3491), seguindo o mesmo padrao exato:

- Parser MIDI identico
- Sintese via Web Audio API
- **Timbre triunfante**: square (principal) + sawtooth (harmonico brilhante) - mais energetico/heroico
- **SEM loop**: toca uma vez so e para
- Carregamento via Base64 embutido (funciona offline)
- Expoe `this.duration` apos parsear

### 3. Flag playerIsAttacker no combatResult

Adicionar campo `playerIsAttacker` ao `combatResult` em cada ponto de enqueue:

- `**Actions.attack()` (jogador ataca)**: `playerIsAttacker: true`
- `**Events.processNPCAttacks()` (NPC ataca jogador)**: `playerIsAttacker: false`
- `**Events.processAllyAttacks()` (aliado ataca inimigo)**: `playerIsAttacker: true` (aliado esta do lado do jogador)

### 4. Logica de selecao de musica em CombatModal.confirm() fase 1

Modificar a fase 1 do confirm para escolher qual musica tocar baseado na flag:

```javascript
if (this.phase === 1) {
  CombatMusicSystem.stop();
  SoundSystem.playCombatImpact();
  
  // Escolher musica baseado em quem ataca
  if (this.pendingCombat.result.playerIsAttacker) {
    VictoryMusicSystem.start();
  } else {
    DefeatMusicSystem.start();
  }
  // ... resto existente ...
}
```

### 5. Sincronizacao em showResult()

Modificar `showResult()` para usar a duracao da musica correta:

```javascript
var isPlayerAttacking = this.pendingCombat.result.playerIsAttacker;
var activeMusic = isPlayerAttacking ? VictoryMusicSystem : DefeatMusicSystem;
var musicDuration = activeMusic.isLoaded ? activeMusic.duration : 0;
var totalItems = resultLines.length + 1;
var lineDelay = musicDuration > 0 ? (musicDuration * 1000) / totalItems : 300;
```

### 6. Stops de seguranca

Adicionar `VictoryMusicSystem.stop()` em:

- `CombatModal.close()`
- `CombatModal.reset()`

### 7. Inicializacao

Em `Game.init()`, adicionar:

```javascript
VictoryMusicSystem.init();
```

## Timbre do VictoryMusicSystem

Diferente dos outros dois sistemas:

- **MusicSystem** (fundo): triangle + sine = suave, ambiente
- **CombatMusicSystem** (abertura combate): sawtooth + square = agressivo
- **DefeatMusicSystem** (jogador leva dano): triangle + sine grave = sombrio
- **VictoryMusicSystem** (jogador causa dano): square + sawtooth brilhante = triunfante, heroico

```javascript
playNote: function(note, startTime, duration, velocity) {
  // Timbre triunfante: square (principal) + sawtooth harmonico
  osc1.type = 'square';
  osc1.frequency.value = freq;
  osc2.type = 'sawtooth';
  osc2.frequency.value = freq * 2; // oitava acima para brilho
  gain1.gain.value = 0.6;
  gain2.gain.value = 0.15; // harmonico sutil
}
```

## Ordem de Implementacao

1. Converter MIDI para Base64 e adicionar constante `VICTORY_MIDI_BASE64`
2. Criar `VictoryMusicSystem` com parser, timbre triunfante e reproducao unica
3. Adicionar `playerIsAttacker` aos tres pontos de enqueue (attack, processNPCAttacks, processAllyAttacks)
4. Modificar `CombatModal.confirm()` fase 1 para escolher VictoryMusicSystem ou DefeatMusicSystem
5. Modificar `CombatModal.showResult()` para sincronizar com a musica ativa
6. Adicionar stops de seguranca em close/reset
7. Inicializar em `Game.init()`

## Arquivo Modificado

- `public/avenida-paulista.html` (unico arquivo - tudo inline, MIDI embutido em Base64)