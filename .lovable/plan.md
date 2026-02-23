

# Modal de Combate Cinematografico

## O que muda

Toda vez que ocorre um combate (jogador atacando inimigo, NPC atacando jogador, ou aliado atacando inimigo na mesma sala do jogador), aparece um modal exclusivo no estilo "confronto" com dois cards lado a lado: atacante a esquerda, defensor a direita. O modal pausa a musica, nao pode ser fechado sem completar o fluxo, e usa animacao de "digitando" para revelar informacoes progressivamente.

## Fluxo do Modal

```text
1. Modal abre -> Musica pausa
2. Card do ATACANTE aparece (animacao de digitando):
   - Nome do personagem (titulo)
   - HP atual/max
   - Poder de Ataque (base + itens detalhados)
3. Card do DEFENSOR aparece (animacao de digitando):
   - Nome do personagem (titulo)
   - HP atual/max
   - Poder de Defesa (base + itens detalhados)
4. Botao "CONFIRMAR" aparece piscando (cores alternadas)
5. Jogador clica CONFIRMAR -> som impactante
6. Resultado do dano aparece no card do defensor (animacao digitando):
   - Dano causado
   - HP restante ou "DERROTADO!"
7. Segundo botao "CONFIRMAR" aparece piscando
8. Jogador clica segundo CONFIRMAR -> som impactante -> modal fecha -> musica retoma
```

## Detalhes Tecnicos

### CSS do Modal de Combate

Novo modal separado do modal generico existente para nao interferir:

```css
#combat-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 200; /* acima de tudo */
  justify-content: center;
  align-items: center;
}

#combat-modal-overlay.active {
  display: flex;
}

#combat-modal {
  display: flex;
  gap: 2rem;
  align-items: stretch;
  max-width: 700px;
  width: 95%;
}

.combat-card {
  flex: 1;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius);
  padding: 1.5rem;
  min-width: 200px;
}

.combat-card.attacker {
  border-color: var(--accent-red);
  box-shadow: 0 0 20px rgba(201, 64, 64, 0.3);
}

.combat-card.defender {
  border-color: var(--accent-blue);
  box-shadow: 0 0 20px rgba(64, 128, 192, 0.3);
}

/* Animacao de digitando */
.combat-line {
  opacity: 0;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.combat-line.visible {
  opacity: 1;
  animation: combat-type-in 0.3s ease-out;
}

@keyframes combat-type-in {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Botao piscando com cores alternadas */
.combat-confirm-btn {
  /* animacao de piscar alternando cores */
  animation: combat-blink 0.6s ease-in-out infinite alternate;
}

@keyframes combat-blink {
  0% { background: var(--accent-red); color: white; }
  100% { background: var(--accent-gold); color: black; }
}
```

### HTML

Adicionar ao body, logo apos os overlays existentes:

```html
<div id="combat-modal-overlay">
  <div id="combat-modal">
    <div id="combat-card-attacker" class="combat-card attacker"></div>
    <div id="combat-card-defender" class="combat-card defender"></div>
  </div>
  <div id="combat-confirm-container" style="position: absolute; bottom: 15%; width: 100%; text-align: center;">
    <button id="combat-confirm-btn" class="btn combat-confirm-btn" style="display: none;"></button>
  </div>
</div>
```

### Objeto CombatModal

Nova entidade JavaScript que gerencia todo o fluxo:

```javascript
const CombatModal = {
  isOpen: false,
  phase: 0, // 0=mostrando stats, 1=aguardando confirm1, 2=mostrando resultado, 3=aguardando confirm2
  pendingCombat: null, // dados do combate pendente
  typeTimers: [], // timers da animacao de digitacao

  // Abrir modal de combate
  open: function(attackerData, defenderData, combatResult) {
    this.isOpen = true;
    this.phase = 0;
    this.pendingCombat = { attacker: attackerData, defender: defenderData, result: combatResult };
    
    MusicSystem.stop(); // Pausar musica
    document.getElementById('combat-modal-overlay').classList.add('active');
    
    this.showStats();
  },

  // Mostrar stats com animacao de digitando
  showStats: function() {
    // Construir linhas do atacante e defensor
    // Revelar cada linha com delay progressivo (200-300ms entre linhas)
    // Ao terminar, mostrar botao CONFIRMAR piscando
  },

  // Processar clique no confirmar
  confirm: function() {
    SoundSystem.playCombatImpact(); // som impactante
    
    if (this.phase === 1) {
      // Mostrar resultado do dano no card do defensor
      this.phase = 2;
      this.showResult();
    } else if (this.phase === 3) {
      // Fechar modal
      this.close();
    }
  },

  // Mostrar resultado do combate
  showResult: function() {
    // Adicionar linhas de resultado no card do defensor com animacao
    // Mostrar segundo botao CONFIRMAR
  },

  // Fechar modal
  close: function() {
    this.isOpen = false;
    document.getElementById('combat-modal-overlay').classList.remove('active');
    MusicSystem.start(); // Retomar musica
    this.typeTimers.forEach(t => clearTimeout(t));
    this.typeTimers = [];
  }
};
```

### Som de Impacto

Adicionar novo som no SoundSystem:

```javascript
playCombatImpact: function() {
  // Som grave e pesado: ruido branco curto + oscilador grave
  // Tipo "BOOM" de confirmacao dramatica
}
```

### Integracao com o Combate Existente

Modificar **tres pontos** do codigo:

**1. `Actions.attack()` (jogador ataca inimigo):**
Em vez de aplicar dano diretamente e retornar resultado, coletar os dados e abrir o CombatModal. O dano so e aplicado APOS o primeiro CONFIRMAR (ou pode ser pre-calculado e mostrado no modal).

Abordagem escolhida: **Pre-calcular o dano**, abrir o modal com todos os dados, e aplicar o dano somente quando o jogador confirma o resultado. Isso mantem a dramaticidade.

```javascript
attack: function(characterId) {
  // ... validacoes existentes ...
  const attackPower = Rules.getPlayerAttackPower();
  const damage = Math.max(1, attackPower - target.defensePower);
  
  // Preparar dados para o modal
  const attackerData = {
    name: 'JOGADOR',
    hp: player.hp, maxHp: player.maxHp,
    attackPower: player.attackPower,
    itemBonus: attackPower - player.attackPower,
    totalAttack: attackPower
  };
  const defenderData = {
    name: target.name,
    hp: target.hp, maxHp: target.maxHp,
    defensePower: target.defensePower,
    totalDefense: target.defensePower
  };
  const combatResult = { damage, targetId: characterId, killed: target.hp - damage <= 0 };
  
  CombatModal.open(attackerData, defenderData, combatResult);
  // Retornar sem aplicar dano ainda - CombatModal.confirm() aplicara
  return { success: true, message: '', advanceTime: true, combatModal: true };
}
```

**2. `Events.processNPCAttacks()` (NPC ataca jogador):**
Quando um NPC ataca o jogador na mesma sala, abrir o CombatModal mostrando o NPC como atacante e o jogador como defensor.

Como podem haver multiplos NPCs atacando, enfileirar os combates (queue). Cada combate abre seu modal, e so ao fechar o anterior o proximo abre.

**3. `Events.processAllyAttacks()` (aliado ataca inimigo):**
Se o jogador esta na mesma sala, mostrar o CombatModal. Se nao esta, aplicar dano normalmente sem modal.

### Fila de Combates

Para lidar com multiplos combates no mesmo turno (NPCs + aliados):

```javascript
CombatModal.queue = [];

CombatModal.enqueue = function(attackerData, defenderData, combatResult, applyCallback) {
  this.queue.push({ attackerData, defenderData, combatResult, applyCallback });
  if (!this.isOpen) {
    this.processNext();
  }
};

CombatModal.processNext = function() {
  if (this.queue.length === 0) {
    MusicSystem.start(); // Retomar musica so apos todos os combates
    return;
  }
  const next = this.queue.shift();
  this.open(next.attackerData, next.defenderData, next.combatResult, next.applyCallback);
};
```

### Detalhes dos Cards

**Card Atacante (esquerda):**
```text
[NOME DO ATACANTE]
---
HP: 100/100
---
Ataque Base: 10
Itens: +5 (Espada)
TOTAL: 15
```

**Card Defensor (direita):**
```text
[NOME DO DEFENSOR]
---
HP: 50/50
---
Defesa Base: 6
Itens: +3 (Escudo)
TOTAL: 9
```

**Resultado (aparece no card defensor apos primeiro confirmar):**
```text
---
DANO RECEBIDO: 6
HP RESTANTE: 44/50
(ou "DERROTADO!" se morreu)
```

### Calculo de Bonus de Itens

Para mostrar quais itens contribuem para ataque/defesa:

```javascript
// Atacante (jogador): listar itens com attackPower > 0
// Defensor (jogador): listar itens com defensePower > 0
// NPCs: mostrar apenas o valor base (nao tem itens)
```

### O que processAction precisa fazer

O `Game.processAction` precisa saber que quando `result.combatModal === true`, nao deve processar a mensagem normalmente - o CombatModal cuida de tudo.

## Ordem de Implementacao

1. CSS do combat modal (overlay, cards, animacoes, botao piscante)
2. HTML do combat modal (overlay + cards + botao)
3. Som `playCombatImpact` no SoundSystem
4. Objeto `CombatModal` com toda a logica (open, showStats, confirm, showResult, close, queue)
5. Modificar `Actions.attack()` para usar CombatModal
6. Modificar `Events.processNPCAttacks()` para usar CombatModal
7. Modificar `Events.processAllyAttacks()` para usar CombatModal (quando jogador presente)
8. Ajustar `Game.processAction()` para tratar `combatModal: true`
9. Reset no `Game.init()`

## Arquivo Modificado

- `public/avenida-paulista.html` (unico arquivo - tudo inline)

