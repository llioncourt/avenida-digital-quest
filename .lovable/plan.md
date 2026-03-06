

# Fix: Dropar itens excedentes ao largar a Mochila

## Problema

Ao largar a mochila, o `maxWeight` volta para 20kg, mas os itens permanecem no inventário. O jogador fica com peso acima do limite (ex: 40/20).

## Solução

Após reduzir o `maxWeight`, verificar se o peso atual excede o novo limite. Se sim, dropar automaticamente os itens mais recentes (últimos do array `playerInventory`) até o peso ficar dentro do limite — dando a impressão de que estavam "dentro" da mochila.

### Alteração em `dropItem` (linhas ~6568-6572)

Após o bloco que reduz `maxWeight`, adicionar lógica:

1. Calcular peso atual com `Rules.getInventoryWeight()`
2. Enquanto peso > `maxWeight`, remover o último item do inventário (excluindo a própria mochila que já foi removida)
3. Colocar cada item dropado na mesma sala (`item.location = GameState.playerLocation`)
4. Logar cada item dropado: `"🎒 {ITEM} caiu da mochila!"`

### Detalhe importante

- Iterar de trás pra frente no `playerInventory` (itens mais recentes primeiro)
- A mochila tem `weight: 0`, então não interfere no cálculo
- Itens com `hasWax` (peso 0 pela cera) não serão dropados naturalmente pois não contribuem pro excesso

