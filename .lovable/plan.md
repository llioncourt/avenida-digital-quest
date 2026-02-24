

## Plano: Efeitos Epicos do Hipnodisco + Correcao do HP na Queue de Combate

### Parte 1: Tres efeitos sonoros e visuais para o Hipnodisco

**Arquivo:** `public/avenida-paulista.html`

#### 1A. Efeito "Feiticeiro desativa escudo" (epico, luz + som)

**Som:** `SoundSystem.playHypnoShield()` -- sequencia sintetizada com sweep ascendente, ondas pulsantes simulando energia sendo drenada, e uma explosao final de frequencias graves indicando o escudo quebrando. Duracao ~3s.

**Visual:** Flash ciano pulsante (3 pulsos rapidos) seguido de um flash branco final. Usar `ScreenEffects.flash` em sequencia com `setTimeout`.

**Local:** Dentro de `Actions.itemActions.hipnodisco`, no bloco `if (targetId === 'feiticeiro')`, apos `consumeHipnodisco()` (linha ~5030).

#### 1B. Efeito "Dar vida a objeto" (som de "ooohhh" sintetico + luz)

**Som:** `SoundSystem.playHypnoAnimate()` -- coro sintetico usando multiplos osciladores com frequencias harmonicas (tipo vozes fazendo "ooohhh"), com filtro passa-baixa modulado para dar sensacao de admiracao. Crescendo e depois fade. Duracao ~2.5s.

**Visual:** Flash verde-esmeralda pulsante, simulando energia vital sendo transferida.

**Local:** Dentro do bloco `if (item && item.location === playerRoom && !item.isAnimated)` (linha ~5061), apos `consumeHipnodisco()`.

#### 1C. Efeito "Hipnotizar inimigo" (som hipnotico + luz)

**Som:** `SoundSystem.playHypnoEnemy()` -- espiral sonora descendente com osciladores detuned criando efeito de tontura/hipnose. Tremolo rapido. Duracao ~2s.

**Visual:** Flash roxo/magenta pulsante, evocando controle mental.

**Local:** Dentro do bloco do inimigo (linha ~5050), apos `enemy.isAlly = true`.

### Parte 2: Correcao do HP na Queue de Combate

**Problema:** Quando o jogador ataca a Bruxa (100 HP, tira 10 = fica 90), o contra-ataque dela ainda mostra 100 HP no modal porque o `defenderData` e construido com `char.hp` no momento do enqueue, antes do `applyCallback` rodar.

**Causa raiz:** O `attackerData` e `defenderData` sao snapshots criados no momento do enqueue, mas o dano so e aplicado no `applyCallback` (quando o jogador confirma). O proximo combate na fila ja foi construido com os valores antigos.

**Correcao:** No `CombatModal.processNext()`, antes de chamar `this.open()`, atualizar os dados de HP do atacante e do defensor para refletir o estado atual do `GameState`:

```javascript
processNext: function() {
  if (this.queue.length === 0) {
    // Resume music...
    return;
  }
  var next = this.queue.shift();
  
  // Atualizar HP para refletir estado atual
  // (combates anteriores na fila ja podem ter alterado o HP)
  var attackerId = next.combatResult.playerIsAttacker ? 'player' : next.combatResult.targetId;
  // Para o atacante NPC: buscar HP atual
  if (!next.combatResult.playerIsAttacker) {
    var atkChar = null;
    // Encontrar o atacante pelo nome no GameState
    Object.values(GameState.characters).forEach(function(c) {
      if (next.attackerData.name.includes(c.name.toUpperCase())) {
        atkChar = c;
      }
    });
    if (atkChar) {
      next.attackerData.hp = atkChar.hp;
    }
  } else {
    // Jogador atacando: atualizar HP do jogador
    next.attackerData.hp = GameState.characters.player.hp;
  }
  // Atualizar HP do defensor
  if (next.combatResult.targetId === 'player') {
    next.defenderData.hp = GameState.characters.player.hp;
    next.combatResult.remainingHp = Math.max(0, GameState.characters.player.hp - next.combatResult.damage);
    next.combatResult.killed = GameState.characters.player.hp - next.combatResult.damage <= 0;
  } else {
    var defChar = GameState.characters[next.combatResult.targetId];
    if (defChar) {
      next.defenderData.hp = defChar.hp;
      next.combatResult.remainingHp = Math.max(0, defChar.hp - next.combatResult.damage);
      next.combatResult.killed = defChar.hp - next.combatResult.damage <= 0;
    }
  }
  
  this.open(next.attackerData, next.defenderData, next.combatResult, next.applyCallback);
}
```

Tambem e necessario guardar o ID do atacante no `combatResult` para facilitar a busca. Adicionar `attackerId` ao `combatResult` tanto em `Actions.attack` quanto em `processNPCAttacks` e `processAllyAttacks`.

**Alternativa mais simples e robusta:** Guardar `attackerId` no `combatResult` em todos os pontos de enqueue. Entao no `processNext`, usar esse ID diretamente:

- Em `Actions.attack` (linha ~5341): adicionar `attackerId: 'player'`
- Em `processNPCAttacks` (linha ~6112): adicionar `attackerId: char.id`
- Em `processAllyAttacks`: adicionar `attackerId: ally.id`

E no `processNext`:
```javascript
var atkChar = GameState.characters[next.combatResult.attackerId];
if (atkChar) next.attackerData.hp = atkChar.hp;
var defId = next.combatResult.targetId;
var defChar = GameState.characters[defId];
if (defChar) {
  next.defenderData.hp = defChar.hp;
  next.combatResult.remainingHp = Math.max(0, defChar.hp - next.combatResult.damage);
  next.combatResult.killed = defChar.hp - next.combatResult.damage <= 0;
}
```

Isso garante que cada modal mostra o HP **atualizado** no momento em que e exibido, sem quebrar a dinamica sequencial de confirmacao.

### Resumo de alteracoes

1. **SoundSystem:** 3 novos metodos (`playHypnoShield`, `playHypnoAnimate`, `playHypnoEnemy`)
2. **Actions.itemActions.hipnodisco:** Chamar os novos sons e flashes nos 3 casos de uso
3. **combatResult:** Adicionar campo `attackerId` em 3 locais de enqueue
4. **CombatModal.processNext:** Atualizar HP do atacante e defensor antes de abrir o modal

