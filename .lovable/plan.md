
# Marcador de Bomba no Mapa e Ruinas apos Explosao

## O que muda

### 1. Marcador de bomba no minimapa
Quando o Bombardeador armar uma bomba, a sala onde ela esta aparecera com um indicador visual no minimapa -- um icone de bomba pulsante.

### 2. Sala vira ruina apos explosao
Cada sala ganhara dois novos atributos: `ruinName` e `ruinDescription`. Apos a explosao, a sala muda permanentemente de nome e descricao para refletir a destruicao.

## Detalhes Tecnicos

**Arquivo**: `public/avenida-paulista.html`

### A. Novos atributos em ROOMS_DATA
Adicionar `ruinName` e `ruinDescription` a cada sala. Exemplos:

- **Tunel**: "Tunel Desmoronado" / "O tunel colapsou com a explosao. Escombros e poeira impedem a visao..."
- **MASP**: "Ruinas do MASP" / "Os icônicos pilares vermelhos estao retorcidos..."
- **Rua Augusta**: "Rua Augusta Devastada" / "Os grafites coloridos foram cobertos por cinzas..."
- (e assim por diante para todas as 15 salas)

### B. Marcador de bomba no minimapa
No metodo `Render.updateMinimap()`, ao desenhar cada sala, verificar se `GameState.armedBomb` existe e se `armedBomb.location === roomId`. Se sim, adicionar a classe CSS `has-bomb` ao elemento da sala.

CSS novo:
```css
.map-room.has-bomb::after {
  content: '💣';
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 0.6rem;
  animation: pulse 1s infinite;
}
```

### C. Explosao transforma sala em ruina
No metodo `processBombTimer()`, apos a explosao (linha ~3056), adicionar logica para mudar nome e descricao da sala:

```javascript
const room = GameState.rooms[bombLocation];
if (room.ruinName) {
  room.name = room.ruinName;
  room.description = room.ruinDescription;
  room.isRuined = true;
}
```

### D. Legenda do mapa
Adicionar entrada na legenda do minimapa para o marcador de bomba.

### Resultado
- Jogador ve no mapa exatamente onde a bomba esta armada (icone pulsante)
- Apos a explosao, a sala muda de nome e descricao permanentemente, dando peso narrativo ao evento
