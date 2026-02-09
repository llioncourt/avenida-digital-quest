
# Alinhar a Base do Inventário com o Game Panel

## Problema
O card do inventário na coluna direita termina acima da base do card principal (game-panel) à esquerda. As duas colunas não estão com a mesma altura.

## Solução
Garantir que o flexbox do `#main-content` estique ambas as colunas igualmente, e que o sidebar ocupe toda a altura disponível corretamente.

## Mudanças Técnicas

**Arquivo**: `public/avenida-paulista.html`

1. **`#main-content`**: Adicionar `align-items: stretch` (explícito, para garantir)
2. **`#right-sidebar`**: Trocar `height: 100%` por `min-height: 0` -- deixar o flexbox do pai controlar a altura, em vez de forçar 100%
3. **`#inventory-panel`**: Se necessário, ajustar para que o inventário cresça até preencher o espaço -- em vez de `max-height: 200px`, usar algo como `flex: 0 0 auto` com `min-height` para quando tiver poucos itens, e deixar o mapa (`flex: 1`) absorver o restante

Isso fará com que a coluna direita tenha exatamente a mesma altura da coluna esquerda, e o inventário ficará ancorado na base, alinhado com o final do game-panel.
