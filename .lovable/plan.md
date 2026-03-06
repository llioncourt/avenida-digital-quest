

# Refatoracao: Dados Flexiveis para Itens e Personagens

## Objetivo

Substituir dezenas de checks hardcoded por ID (`itemId === 'mochila'`, `char.id === 'bruxa'`, `includes('lanterna')`) por propriedades nos dados dos itens e personagens, tornando o engine generico e facilitando adicionar novos itens/NPCs sem mexer na logica.

## 1. Sistema de Efeitos Passivos nos Itens (~20 checks eliminados)

Adicionar propriedade `passiveEffects` nos dados dos itens em `ITEMS_DATA`:

```javascript
mascara_gas:  { ..., passiveEffects: ['gasImmunity'] },
lanterna:     { ..., passiveEffects: ['nightVision', 'revealAdjacent'] },
guarda_chuva: { ..., passiveEffects: ['rainProtection', 'safeJump'] },
asa_delta:    { ..., passiveEffects: ['flight', 'windVulnerable'] },
mochila:      { ..., passiveEffects: ['weightBonus'] },
reliquia:     { ..., passiveEffects: ['regen'] },
traje_protetor: { ..., passiveEffects: ['gasImmunity', 'rainProtection', 'safeJump'] },
detector:     { ..., passiveEffects: ['revealAdjacent', 'revealTraps'] }
```

Criar `Rules.hasEffect(effectName)`:

```javascript
hasEffect: function(effect) {
  return GameState.playerInventory.some(function(id) {
    var item = GameState.items[id];
    return item && item.passiveEffects && item.passiveEffects.includes(effect);
  });
}
```

Substituir todos os `includes('mascara_gas')` por `Rules.hasEffect('gasImmunity')`, `includes('lanterna')` por `Rules.hasEffect('nightVision')`, etc. Isso ja elimina ~15 checks espalhados e torna o Traje Protetor automaticamente funcional sem checks especiais.

## 2. Regras de Movimento dos NPCs nos Dados (~8 checks eliminados)

Adicionar propriedades declarativas em `CHARACTERS_DATA`:

```javascript
feiticeiro: { ..., movementLock: { until: 1080 } },        // preso ate 18:00
bruxa:      { ..., movementLock: { always: true } },        // nunca se move
demonio:    { ..., movementLock: { untilSummoned: true } }  // so move se invocado
```

Em `processNPCMovement`, substituir os 4 checks por ID por:

```javascript
if (char.movementLock) {
  if (char.movementLock.always) return;
  if (char.movementLock.until && GameState.time < char.movementLock.until) return;
  if (char.movementLock.untilSummoned && !char.isSummoned) return;
}
```

O check do demonio convertido ficar na sala da bruxa (`char.id === 'demonio' && char.isAlly && bruxa.isAlive`) pode virar uma propriedade `guardsTarget: 'bruxa'` — fica na sala do alvo enquanto ele estiver vivo.

## 3. Hooks de Combate nos Personagens (~5 checks eliminados)

Adicionar propriedades de evento nos dados:

```javascript
bruxa:       { ..., onFirstHit: 'summonDemon' },
bombardeador:{ ..., onDeath: 'glitchEffect' }
```

Em `applyCallback` do combate, substituir:

```javascript
// Antes: if (t.id === 'bombardeador') GlitchEffect.trigger(3000);
if (t.onDeath === 'glitchEffect') GlitchEffect.trigger(3000);

// Antes: if (t.id === 'bruxa' && t.isAlive && !GameState.demonSummoned) { ... }
if (t.onFirstHit === 'summonDemon' && t.isAlive && !GameState.demonSummoned) { ... }
```

## 4. Consolidar Handlers de Comida (~15 linhas eliminadas)

Os 3 handlers (coxinha/acai/pastel) sao identicos — so muda o `energyRestore` e emoji/texto. Como os itens ja tem `energyRestore` nos dados, criar um handler generico:

```javascript
// Handler generico para comida — detectado pelo campo energyRestore no item
function foodHandler(itemId) {
  var item = GameState.items[itemId];
  var restore = item.energyRestore;
  GameState.energy = Math.min(100, GameState.energy + restore);
  SoundSystem.playUseItem();
  return { success: true, message: '🍽️ Voce consumiu ' + item.name + '! +' + restore + ' energia!', consumed: true };
}
```

E no `useItem`, antes de buscar handler especifico, checar se o item tem `energyRestore`.

## 5. Propriedade `onPickup`/`onDrop` nos Itens (~10 linhas simplificadas)

Em vez de `if (itemId === 'mochila')` no pickup/drop, adicionar:

```javascript
mochila: { ..., onPickup: 'recalcWeight', onDrop: 'recalcWeight' }
```

E no pickup/drop:

```javascript
if (item.onPickup === 'recalcWeight') {
  Rules.recalcMaxWeight();
  Log.add('🎒 Capacidade: ' + GameState.characters.player.maxWeight + 'kg!', 'success');
}
```

## Resumo de Impacto

| Area | Checks eliminados | Linhas salvas |
|------|-------------------|---------------|
| Efeitos passivos | ~15 `includes()` | ~10 |
| Movimento NPC | ~8 `char.id ===` | ~15 |
| Hooks combate | ~5 `target.id ===` | ~8 |
| Comida generica | 3 handlers duplicados | ~15 |
| onPickup/onDrop | ~4 `itemId ===` | ~8 |
| **Total** | **~35 checks** | **~56 linhas** |

A reducao de linhas nao e gigante, mas o ganho real e em **flexibilidade**: adicionar um novo item com protecao contra gas, por exemplo, basta colocar `passiveEffects: ['gasImmunity']` nos dados — zero mudanca na logica.

## O que NAO sera alterado

- CSS, HTML, estrutura visual
- Sistema de musica (ja refatorado)
- Crafting, trade, achievements
- Logica de combate modal
- Render/Minimap

