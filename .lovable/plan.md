

# Scrollbar Vertical Dentro da Lista de Salas

## Problema
A scrollbar esta no container externo (`.mapa-antigo-scroll`) em vez de dentro de cada secao de salas. O usuario quer scroll dentro da lista de salas de cada secao (ex: dentro de "Eixo Paulista"), como destacado na imagem.

## Correcao

Adicionar `max-height` e `overflow-y: auto` ao `.mapa-section-rooms` (a div que contem os botoes de sala dentro de cada secao), com os mesmos estilos de scrollbar dourada. Remover o `max-height` do `.mapa-antigo-scroll` externo para que o modal mostre todas as secoes normalmente.

**CSS a alterar:**

1. `.mapa-antigo-scroll` — remover `max-height: 60vh` (deixar o container externo sem limite)
2. `.mapa-section-rooms` — adicionar `max-height: 35vh`, `overflow-y: auto`, e scrollbar webkit styling

Assim cada secao com muitas salas tera sua propria scrollbar interna, enquanto secoes pequenas (como Inferior com 1 sala) ficam sem scroll.

