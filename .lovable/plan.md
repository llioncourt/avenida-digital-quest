

# Fix: Itens Craftados Aparecendo no Mundo

## Problema
Na funcao `setupPositions` (linha 8990-8997), o filtro de itens a posicionar no mapa exclui apenas `livro`, `bomba`, `reliquia` e comidas. Os itens craftados (espada_encantada, escudo_grafitado, detector, conjunto_musical, energetico, traje_protetor) nao sao excluidos, entao recebem uma localizacao aleatoria e aparecem no mundo como itens normais.

## Correcao

Alterar o filtro em `setupPositions` (linha 8991-8993) para tambem excluir itens com `isCrafted: true`:

```javascript
const itemsToPlace = Object.keys(GameState.items).filter(i =>
  i !== 'livro' && i !== 'bomba' && i !== 'reliquia' &&
  i !== 'coxinha' && i !== 'acai' && i !== 'pastel' &&
  !GameState.items[i].isCrafted
);
```

Isso garante que itens craftados so existam no jogo apos serem criados pelo sistema de crafting. Uma unica linha adicionada resolve o problema.

