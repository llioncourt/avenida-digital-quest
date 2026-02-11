

# Sistema de Eventos Ambientais Aleatorios

## O que muda

Uma nova entidade chamada **RandomEvents** gerencia eventos ambientais que ocorrem organicamente durante o jogo: chuva, trovoes, sirenes, uivos de vento, latidos distantes, etc. Cada evento tem propriedades ricas e alguns dependem de outros (trovoes so acontecem se estiver chovendo).

## Estrutura de um Evento

Cada evento e um objeto com as seguintes propriedades:

```text
id            - identificador unico
name          - nome do evento
sound         - funcao que toca o som (Web Audio API)
text          - array de frases descritivas para o Log
duration      - numero de turnos que dura (0 = imediato/1 turno)
visualEffect  - funcao de efeito visual (flash, overlay, etc)
parent        - id do evento pai (null se independente)
children      - array de ids de eventos filhos
chance        - probabilidade por turno (0-1)
gameEffect    - placeholder para efeitos no mundo (null por enquanto)
category      - tipo: 'weather', 'urban', 'supernatural'
```

## Eventos Propostos

| ID | Nome | Duracao | Parent | Efeito Visual | Som | Categoria |
|----|------|---------|--------|---------------|-----|-----------|
| `rain` | Chuva | 8-15 turnos | null | Overlay de gotinhas CSS (animacao) | Ruido branco filtrado (passa-baixa) | weather |
| `thunder` | Trovao | imediato | `rain` | Flash branco intenso + shake da tela | Ruido grave com decay longo | weather |
| `lightning` | Relampago | imediato | `rain` | Flash rapido azul/branco | Estalo agudo curto | weather |
| `siren` | Sirene | 3-5 turnos | null | Nenhum | Oscilador com frequencia subindo e descendo | urban |
| `wind_howl` | Uivo de Vento | 2-4 turnos | null | Nenhum | Ruido filtrado com LFO | weather |
| `distant_dogs` | Caes Distantes | imediato | null | Nenhum | Osciladores agudos curtos em sequencia | urban |
| `crow` | Corvos | imediato | null | Nenhum | Ruido agudo curto | urban |
| `earthquake` | Tremor | imediato | null | Shake da tela (CSS transform) | Ruido grave curto | supernatural |
| `whispers` | Sussurros | 2-3 turnos | null | Leve escurecimento da tela | Ruido muito baixo filtrado | supernatural |
| `fog` | Neblina | 6-10 turnos | null | Overlay semi-transparente esbranquicado | Nenhum | weather |

## Detalhes Tecnicos

### Constante RANDOM_EVENTS

Define todos os eventos com suas propriedades:

```javascript
const RANDOM_EVENTS = {
  rain: {
    id: 'rain',
    name: 'Chuva',
    text: [
      '🌧️ Uma chuva forte começa a cair sobre a Avenida Paulista...',
      '🌧️ Gotas grossas de chuva batem contra os prédios...',
      '🌧️ A chuva se intensifica, embaçando a visão...'
    ],
    endText: ['A chuva vai parando aos poucos...', 'As nuvens se dissipam lentamente.'],
    duration: { min: 8, max: 15 },
    parent: null,
    children: ['thunder', 'lightning'],
    chance: 0.08,
    category: 'weather',
    // sound, visualEffect, gameEffect definidos nas funcoes
  },
  thunder: {
    id: 'thunder',
    name: 'Trovão',
    text: ['⚡ BOOM! Um trovão ensurdecedor ecoa pela cidade!', '⚡ O céu estremece com um trovão poderoso!'],
    duration: 0,
    parent: 'rain',
    children: [],
    chance: 0.3, // 30% por turno ENQUANTO chove
    category: 'weather',
  },
  // ... etc para cada evento
};
```

### Objeto RandomEvents (nova entidade)

```javascript
const RandomEvents = {
  activeEvents: {},  // { eventId: { turnsLeft: N, startedAt: time } }

  // Chamado a cada turno em Events.advanceTime()
  process: function() {
    // 1. Decrementar turnos de eventos ativos
    // 2. Remover eventos que expiraram (com mensagem de fim)
    // 3. Tentar disparar novos eventos (chance por turno)
    // 4. Processar filhos de eventos ativos
  },

  startEvent: function(eventId) {
    // Ativar evento, calcular duracao, tocar som, mostrar texto, aplicar visual
  },

  endEvent: function(eventId) {
    // Remover overlay visual, mostrar texto de fim
  },

  isActive: function(eventId) {
    return !!this.activeEvents[eventId];
  },

  // Sons sintetizados
  sounds: {
    rain: function() { /* ruido branco com filtro passa-baixa continuo */ },
    thunder: function() { /* ruido grave com envelope longo */ },
    siren: function() { /* oscilador com LFO na frequencia */ },
    windHowl: function() { /* ruido filtrado com modulacao */ },
    distantDogs: function() { /* sequencia de osciladores agudos */ },
    crow: function() { /* ruido agudo curto */ },
    lightning: function() { /* estalo */ },
    earthquake: function() { /* rumble grave */ },
    whispers: function() { /* ruido muito baixo */ },
  },

  // Efeitos visuais
  visuals: {
    rainOverlay: function(active) {
      // Criar/remover overlay CSS com animacao de gotas
    },
    thunderFlash: function() {
      // Flash branco forte + screen shake
      ScreenEffects.flash('rgba(255, 255, 255, 0.8)');
      // Shake via CSS transform no game-container
    },
    screenShake: function() {
      // Aplicar transform translate aleatorio por ~300ms
    },
    fogOverlay: function(active) {
      // Overlay esbranquicado semi-transparente
    },
    darken: function(active) {
      // Leve escurecimento
    }
  }
};
```

### CSS - Overlays visuais

```css
/* Overlay de chuva */
#rain-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  background: linear-gradient(transparent 0%, rgba(100, 130, 180, 0.1) 100%);
  opacity: 0;
  transition: opacity 1s ease;
}
#rain-overlay.active {
  opacity: 1;
}
/* Gotas de chuva via CSS animation */
#rain-overlay.active::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: /* linhas verticais finas animadas */;
  animation: rain-fall 0.3s linear infinite;
}

@keyframes rain-fall { ... }
@keyframes screen-shake { ... }

/* Overlay de neblina */
#fog-overlay { ... }

/* Screen shake */
.screen-shake {
  animation: screen-shake 0.3s ease-out;
}
```

### Integracao com Events.advanceTime()

Adicionar `RandomEvents.process()` na lista de processamento de cada turno:

```javascript
advanceTime: function() {
  GameState.time += 5;
  // ... codigo existente ...
  this.processNPCAttacks();
  this.processAllyAttacks();
  RandomEvents.process();  // NOVO
  // ...
}
```

### Reset no Game.init()

Limpar `RandomEvents.activeEvents = {}` e remover overlays visuais ao iniciar novo jogo.

### Placeholder de gameEffect

Cada evento tera uma propriedade `gameEffect: null` que futuramente pode conter funcoes como:
- Chuva: reduzir visibilidade, apagar fogo
- Neblina: NPCs se movem menos
- Tremor: chance de itens cairem do inventario

Por agora ficam como `null`, prontos para expansao.

## Ordem de implementacao

1. CSS dos overlays (chuva, neblina, shake)
2. HTML dos overlays (divs fixas)
3. Constante `RANDOM_EVENTS` com todos os eventos
4. Objeto `RandomEvents` com toda a logica
5. Sons sintetizados para cada evento
6. Integracao no `Events.advanceTime()`
7. Reset no `Game.init()`

## Arquivo modificado

- `public/avenida-paulista.html` (unico arquivo - tudo inline)

