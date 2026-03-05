

# Correção: Café Paulistano e Troca com Vendedor

## Problema 1: Café Paulistano inútil

O café seta `skipNextTimeAdvance = true`, mas na linha 6262 o próprio `useItem` faz `result.advanceTime = result.success` (= true). O `Game.execute()` então verifica `skipNextTimeAdvance`, consome o flag, e pula o avanço de tempo **da própria ação de usar o café**. Ou seja, o café gasta o efeito em si mesmo — a próxima ação real avança o tempo normalmente.

**Correção**: No handler do café, retornar `advanceTime: false` explicitamente, e no `useItem` respeitar isso — se o handler já definiu `advanceTime`, não sobrescrever com `result.success`. Assim o café não avança tempo ao ser usado E a próxima ação também não avança (via `skipNextTimeAdvance`).

Alternativa mais simples: no `useItem`, checar `if (result.advanceTime === undefined) result.advanceTime = result.success`. Isso permite que handlers controlem individualmente.

## Problema 2: Troca com Vendedor confusa

Atualmente o jogador escolhe qual item **dele** dar, mas recebe um item **aleatório** do vendedor. Isso é frustrante e não intuitivo.

**Correção**: Refazer o modal para um sistema de troca em 2 passos:
1. Jogador clica no item do vendedor que **quer**
2. Modal mostra seus itens para escolher qual dar em troca
3. Troca é feita com ambos os itens escolhidos

Isso dá controle total ao jogador.

## Mudanças técnicas

- **Linha ~6262**: Mudar para `if (result.advanceTime === undefined) result.advanceTime = result.success;`
- **VendorTrade** (~9043-9089): Refazer modal com 2 etapas — selecionar item do vendedor, depois selecionar item do jogador. Variável `VendorTrade.selectedVendorItem` para guardar a seleção.
- ~40 linhas modificadas no total

