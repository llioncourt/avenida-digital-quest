
# Plano: Sistema de Som com Web Audio API Pura

## Visao Geral

Implementar um sistema de audio completo usando apenas Web Audio API nativa do navegador, sem arquivos externos. Todos os sons serao sintetizados programaticamente usando osciladores e geradores de ruido.

---

## Arquitetura do Sistema

```text
+------------------+
|   SoundSystem    |
+------------------+
| - audioCtx       |
| - masterVolume   |
| - enabled        |
+------------------+
        |
        v
+------------------+     +------------------+     +------------------+
|   playAttack()   |     |   playHit()      |     |   playMove()     |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|   OscillatorNode |     |   OscillatorNode |     |   OscillatorNode |
|   + GainNode     |     |   + GainNode     |     |   + GainNode     |
+------------------+     +------------------+     +------------------+
```

---

## Sons a Implementar

| Evento | Tipo de Som | Descricao Tecnica |
|--------|-------------|-------------------|
| Atacar | "Swoosh" | Onda sawtooth com frequencia descendente (400Hz -> 100Hz) |
| Receber Dano | "Thud" | Onda sine baixa (80Hz) com decay rapido + ruido |
| Derrotar Inimigo | "Victory Ping" | Arpejo ascendente de 3 notas |
| Morrer | "Game Over" | Onda descendente lenta com tremolo |
| Mover | "Footstep" | Click curto (ruido filtrado) |
| Pegar Item | "Pickup" | Onda sine ascendente rapida (300Hz -> 600Hz) |
| Usar Item | "Magic" | Onda triangle com vibrato |
| Explosao | "Boom" | Ruido branco + sine baixa (50Hz) com decay longo |
| Aliado Ataca | "Ally Hit" | Similar ao ataque mas mais agudo |
| Curar | "Heal" | Arpejo de 4 notas ascendentes suaves |
| Vitoria | "Fanfare" | Melodia curta triunfante |
| Bruxa Fala | "Dark Magic" | Onda square grave com modulacao |

---

## Implementacao Tecnica

### 1. Objeto SoundSystem (novo codigo)

Adicionar no inicio da secao `<script>`, apos a declaracao de variaveis:

```javascript
const SoundSystem = {
  audioCtx: null,
  enabled: true,
  masterVolume: 0.3,
  
  init: function() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  },
  
  resume: function() {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },
  
  // Criar oscilador basico
  createOsc: function(type, freq, duration, volume = 0.3) {
    if (!this.enabled || !this.audioCtx) return null;
    this.resume();
    
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume * this.masterVolume;
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    return { osc, gain, ctx: this.audioCtx };
  },
  
  // Criar ruido branco
  createNoise: function(duration, volume = 0.2) {
    if (!this.enabled || !this.audioCtx) return null;
    this.resume();
    
    const bufferSize = this.audioCtx.sampleRate * duration;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioCtx.createBufferSource();
    const gain = this.audioCtx.createGain();
    noise.buffer = buffer;
    gain.gain.value = volume * this.masterVolume;
    
    noise.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    return { noise, gain, ctx: this.audioCtx };
  },
  
  // === SONS DO JOGO ===
  
  playAttack: function() {
    const { osc, gain, ctx } = this.createOsc('sawtooth', 400, 0.15) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    osc.frequency.linearRampToValueAtTime(100, now + 0.15);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  },
  
  playHit: function() {
    // Ruido de impacto
    const noise = this.createNoise(0.1, 0.3);
    if (noise) {
      const now = noise.ctx.currentTime;
      noise.gain.gain.linearRampToValueAtTime(0, now + 0.1);
      noise.noise.start(now);
      noise.noise.stop(now + 0.1);
    }
    
    // Tom grave
    const { osc, gain, ctx } = this.createOsc('sine', 80, 0.2, 0.4) || {};
    if (osc) {
      const now = ctx.currentTime;
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  },
  
  playDeath: function() {
    const { osc, gain, ctx } = this.createOsc('sine', 400, 1.0, 0.3) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    osc.frequency.linearRampToValueAtTime(50, now + 1.0);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);
    
    osc.start(now);
    osc.stop(now + 1.0);
  },
  
  playMove: function() {
    const noise = this.createNoise(0.05, 0.1);
    if (!noise) return;
    
    const now = noise.ctx.currentTime;
    noise.gain.gain.linearRampToValueAtTime(0, now + 0.05);
    noise.noise.start(now);
    noise.noise.stop(now + 0.05);
  },
  
  playPickup: function() {
    const { osc, gain, ctx } = this.createOsc('sine', 300, 0.15) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    osc.frequency.linearRampToValueAtTime(600, now + 0.1);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    
    osc.start(now);
    osc.stop(now + 0.15);
  },
  
  playUseItem: function() {
    const { osc, gain, ctx } = this.createOsc('triangle', 400, 0.3) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    // Vibrato
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 15;
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    
    lfo.start(now);
    osc.start(now);
    lfo.stop(now + 0.3);
    osc.stop(now + 0.3);
  },
  
  playExplosion: function() {
    // Ruido de explosao
    const noise = this.createNoise(0.8, 0.5);
    if (noise) {
      const now = noise.ctx.currentTime;
      noise.gain.gain.linearRampToValueAtTime(0, now + 0.8);
      noise.noise.start(now);
      noise.noise.stop(now + 0.8);
    }
    
    // Baixo grave
    const { osc, gain, ctx } = this.createOsc('sine', 60, 0.5, 0.5) || {};
    if (osc) {
      const now = ctx.currentTime;
      osc.frequency.linearRampToValueAtTime(20, now + 0.5);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  },
  
  playHeal: function() {
    const notes = [400, 500, 600, 800];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const { osc, gain, ctx } = this.createOsc('sine', freq, 0.2) || {};
        if (osc) {
          const now = ctx.currentTime;
          gain.gain.linearRampToValueAtTime(0, now + 0.2);
          osc.start(now);
          osc.stop(now + 0.2);
        }
      }, i * 80);
    });
  },
  
  playVictory: function() {
    const melody = [523, 659, 784, 1047]; // C5, E5, G5, C6
    melody.forEach((freq, i) => {
      setTimeout(() => {
        const { osc, gain, ctx } = this.createOsc('square', freq, 0.3, 0.2) || {};
        if (osc) {
          const now = ctx.currentTime;
          gain.gain.linearRampToValueAtTime(0, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      }, i * 150);
    });
  },
  
  playEnemyDefeat: function() {
    const notes = [600, 800, 1000];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const { osc, gain, ctx } = this.createOsc('triangle', freq, 0.15) || {};
        if (osc) {
          const now = ctx.currentTime;
          gain.gain.linearRampToValueAtTime(0, now + 0.15);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      }, i * 60);
    });
  },
  
  playDarkMagic: function() {
    const { osc, gain, ctx } = this.createOsc('square', 100, 0.5, 0.2) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.25);
    osc.frequency.linearRampToValueAtTime(80, now + 0.5);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    
    osc.start(now);
    osc.stop(now + 0.5);
  },
  
  playBombTick: function() {
    const { osc, gain, ctx } = this.createOsc('sine', 800, 0.05, 0.3) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    gain.gain.linearRampToValueAtTime(0, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  },
  
  playError: function() {
    const { osc, gain, ctx } = this.createOsc('square', 200, 0.2, 0.2) || {};
    if (!osc) return;
    
    const now = ctx.currentTime;
    osc.frequency.linearRampToValueAtTime(100, now + 0.2);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
};
```

### 2. Inicializar no Game.init()

Adicionar no inicio de `Game.init()`:

```javascript
SoundSystem.init();
```

### 3. Adicionar sons nos eventos

| Arquivo | Local | Som |
|---------|-------|-----|
| `Actions.attack()` | Apos calcular dano | `SoundSystem.playAttack()` |
| `Actions.attack()` | Se `!target.isAlive` | `SoundSystem.playEnemyDefeat()` |
| `Actions.moveTo()` | Apos mover | `SoundSystem.playMove()` |
| `Actions.pickupItem()` | Apos pegar | `SoundSystem.playPickup()` |
| `ItemEffects.kit_saude()` | Apos curar | `SoundSystem.playHeal()` |
| `Events.processNPCAttacks()` | Apos dano ao player | `SoundSystem.playHit()` |
| `Events.processBombTimer()` | Se `turnsLeft > 0` | `SoundSystem.playBombTick()` |
| `Events.processBombTimer()` | Na explosao | `SoundSystem.playExplosion()` |
| `Events.processWitchWord()` | Ao falar palavra | `SoundSystem.playDarkMagic()` |
| `Rules.checkGameOver()` | Se player morto | `SoundSystem.playDeath()` |
| `Rules.checkGameOver()` | Se vitoria | `SoundSystem.playVictory()` |

### 4. Botao de mute no header (opcional)

Adicionar no CSS um botao pequeno e no HTML um toggle:

```html
<button id="sound-toggle" onclick="SoundSystem.enabled = !SoundSystem.enabled; this.textContent = SoundSystem.enabled ? '🔊' : '🔇';">
  🔊
</button>
```

---

## Resumo das Alteracoes

| Local | Alteracao |
|-------|-----------|
| Apos variaveis globais | Adicionar objeto `SoundSystem` completo |
| `Game.init()` | Adicionar `SoundSystem.init()` |
| `Actions.attack()` | 2 chamadas de som |
| `Actions.moveTo()` | 1 chamada de som |
| `Actions.pickupItem()` | 1 chamada de som |
| `ItemEffects.kit_saude()` | 1 chamada de som |
| `Events.processNPCAttacks()` | 1 chamada de som |
| `Events.processBombTimer()` | 2 chamadas de som |
| `Events.processWitchWord()` | 1 chamada de som |
| `Rules.checkGameOver()` | 2 chamadas de som |
| Header HTML | Botao de mute |

---

## Resultado Esperado

1. Sons sintetizados tocam em tempo real durante o jogo
2. Nenhum arquivo externo necessario
3. Botao para ligar/desligar sons
4. Feedback auditivo para todas as acoes principais
5. Sons distintos para cada tipo de evento
