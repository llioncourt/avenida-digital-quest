

# Bug: maxWeight chegando a 60kg com mochila (deveria ser 40kg)

## Diagnóstico

O jogador começa com `maxWeight: 20`. A mochila deveria levar a 40kg, mas o screenshot mostra 60kg.

O problema é que o código faz `maxWeight += 20` sem verificar se o bônus já foi aplicado. Existem **3 locais** que adicionam +20:

1. **pickupItem** (linha 6669): `maxWeight += 20`
2. **executeTrade** receber mochila (linha 9940): `maxWeight += 20`

Se por qualquer cenário o bônus for aplicado mais de uma vez (ex: bug de timing, estado inconsistente), ele se acumula sem limite.

## Solução

Substituir `maxWeight += 20` por uma lógica que define o valor absoluto: se tem mochila, maxWeight = 40; se não tem, maxWeight = 20. Isso é idempotente e evita acúmulo.

### Alterações em `public/avenida-paulista.html`

**Criar uma função auxiliar** `recalcMaxWeight()`:
```js
// Em Rules ou Utils
recalcMaxWeight: function() {
  var base = 20;
  if (GameState.playerInventory.includes('mochila')) base += 20;
  GameState.characters.player.maxWeight = base;
}
```

**pickupItem** (linha 6668-6671): Substituir o `+= 20` por chamada a `recalcMaxWeight()`.

**dropItem** (linha 6730-6731): Substituir o `-= 20` por chamada a `recalcMaxWeight()`.

**executeTrade - dar mochila** (linha 9928-9929): Substituir por `recalcMaxWeight()`.

**executeTrade - receber mochila** (linha 9939-9940): Substituir por `recalcMaxWeight()`.

Isso garante que o maxWeight nunca ultrapasse 40kg independente de quantas vezes o código rode.

