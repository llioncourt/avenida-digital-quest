

# Remover Seção de Saídas da Interface

## Objetivo
Remover o bloco de "Saídas" (exits) do painel de jogo, já que o minimapa interativo torna essa informação redundante.

## Mudança

**Arquivo**: `public/avenida-paulista.html`

Localizar e remover a renderização da seção de saídas dentro da função que atualiza a UI da sala atual. Isso inclui:

- O título "Saídas" e os botões de navegação por texto que listam as salas conectadas
- Qualquer container/div dedicado a exibir as saídas

Será necessário identificar o trecho exato no código que gera esse bloco de saídas e removê-lo (ou comentá-lo), sem afetar o restante da interface.

## Escopo
- Apenas remoção visual do bloco de saídas
- Nenhuma outra alteração na interface ou lógica do jogo

