

# Icones de Itens no Minimapa

## O que muda

Ao entrar em uma sala que tem itens, esses itens ficam "descobertos" e passam a aparecer no minimapa com um icone (similar ao icone da bomba). O icone permanece visivel enquanto o item estiver naquela sala. Se o jogador pegar o item, usar e consumir, ou se o item for destruido, o icone some. Se o jogador largar o item em outra sala, o icone aparece na nova sala.

## Como funciona

1. **Novo estado no GameState**: um Set chamado `discoveredItems` que guarda os IDs dos itens que o jogador ja viu (entrou na sala onde estavam).

2. **Descoberta automatica**: toda vez que o jogador entra em uma sala (`updateGameCard` ou `move`), os itens presentes naquela sala sao adicionados ao `discoveredItems`.

3. **Icones no minimapa**: no `updateMinimap`, apos desenhar as salas, verifica quais itens descobertos ainda estao no mundo (tem `location` valido, nao estao destruidos, nao estao no inventario). Para cada um, adiciona um indicador visual na sala correspondente.

4. **Emojis por item**: cada item tera um emoji associado para o minimapa:
   - Espada: "⚔️", Escudo: "🛡️", Kit Saude: "🩹", Kit Bomba: "🔧"
   - Livro: "📖", Asa Delta: "🪂", Cera Magica: "🕯️", Seta Mortal: "🏹"
   - Mascara Gas: "😷", Hipnodisco: "💿", Bomba: "💣" (ja existente)

5. **Legenda atualizada**: adicionar um item "📦 Item" na legenda do minimapa.

6. **Reset**: limpar `discoveredItems` ao iniciar novo jogo.

## Detalhes Tecnicos

### GameState - novo campo

```javascript
discoveredItems: new Set()
```

Resetado no `Game.init()`.

### Descoberta - no fluxo de entrada na sala

Apos o jogador se mover ou ao iniciar o jogo, chamar uma funcao que verifica itens na sala atual e adiciona ao Set:

```javascript
// Em Rules ou Actions, apos mover
Object.values(GameState.items).forEach(item => {
  if (item.location === GameState.playerLocation && !item.isDestroyed) {
    GameState.discoveredItems.add(item.id);
  }
});
```

### CSS - novo estilo para itens no mapa

Adicionar uma classe `has-item` com um pseudo-elemento ou elementos filhos para mostrar os emojis dos itens. Como uma sala pode ter multiplos itens, a abordagem sera inserir spans filhos dentro do elemento da sala (diferente da bomba que usa `::after`).

```css
.map-room .item-indicator {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5rem;
  z-index: 25;
  white-space: nowrap;
  pointer-events: none;
}
```

### updateMinimap - adicionar indicadores de itens

Dentro do loop de salas, apos verificar bomba armada, adicionar logica para itens descobertos:

```javascript
// Itens descobertos nesta sala
const roomItems = Object.values(GameState.items).filter(
  item => GameState.discoveredItems.has(item.id) &&
          item.location === roomId &&
          !item.isDestroyed &&
          !GameState.playerInventory.includes(item.id)
);
if (roomItems.length > 0) {
  const indicator = document.createElement('span');
  indicator.className = 'item-indicator';
  indicator.textContent = roomItems.map(i => ITEM_ICONS[i.id]).join('');
  roomEl.appendChild(indicator);
}
```

### Mapa de emojis - constante

```javascript
const ITEM_ICONS = {
  espada: '⚔️', escudo: '🛡️', kit_saude: '🩹',
  kit_bomba: '🔧', livro: '📖', asa_delta: '🪂',
  cera_magica: '🕯️', seta_mortal: '🏹',
  mascara_gas: '😷', hipnodisco: '💿', bomba: '💣'
};
```

### Legenda do minimapa

Adicionar entrada na legenda:

```html
<div class="legend-item"><span style="font-size:0.6rem">📦</span>Item</div>
```

### Pontos de atencao

- Itens largados no ceu ja sao destruidos pela logica existente (`item.location = null`), entao o icone some automaticamente.
- A bomba armada ja tem seu proprio sistema de icone (`has-bomb`), entao a bomba so apareceria como item se estiver no chao sem estar armada.
- O `discoveredItems` Set precisa ser limpo no `Game.init()`.
- Itens animados pelo Hipnodisco (`item.isAnimated = true`) nao devem aparecer como itens no mapa.

### Arquivos modificados

- `public/avenida-paulista.html` (unico arquivo - tudo inline)
