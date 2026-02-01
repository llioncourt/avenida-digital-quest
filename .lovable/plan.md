

# Plano: Minimapa Interativo com Drag & Drop, Pan e Zoom

## Funcionalidades Solicitadas

1. **Drag & Drop de Nodes**: Arrastar salas individuais para reposicionar no mapa
2. **Pan (Arrastar Mapa)**: Arrastar no espaço vazio para mover toda a visualização
3. **Zoom**: Scroll do mouse (ou pinch no mobile) para zoom in/out

---

## Arquitetura da Solucao

### Novo Sistema: `MinimapController`

Criar um objeto controlador que gerencia:
- Estado do viewport (offsetX, offsetY, zoom)
- Drag state (isDragging, dragTarget, startPos)
- Posicoes customizadas das salas

```javascript
const MinimapController = {
  // Estado do viewport
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 2,
  
  // Estado do drag
  isDragging: false,
  dragType: null, // 'node' ou 'pan'
  dragTarget: null,
  startX: 0,
  startY: 0,
  
  // Posicoes customizadas (salvas no localStorage)
  customPositions: {},
  
  init: function() { ... },
  handleMouseDown: function(e) { ... },
  handleMouseMove: function(e) { ... },
  handleMouseUp: function(e) { ... },
  handleWheel: function(e) { ... },
  handleTouchStart: function(e) { ... },
  handleTouchMove: function(e) { ... },
  handleTouchEnd: function(e) { ... },
  
  // Persistencia
  savePositions: function() { ... },
  loadPositions: function() { ... },
  resetPositions: function() { ... }
};
```

---

## Implementacao Detalhada

### 1. Estrutura HTML do Minimapa

Envolver o container do mapa em um viewport para controle de transformacao:

```html
<div id="minimap-viewport" style="overflow: hidden; width: 100%; height: calc(100% - 50px);">
  <div id="minimap" style="transform-origin: 0 0;">
    <!-- rooms e connections renderizados aqui -->
  </div>
</div>
```

### 2. CSS para Interacao

```css
#minimap-viewport {
  overflow: hidden;
  cursor: grab;
  touch-action: none; /* Desabilitar scroll nativo para pinch */
}

#minimap-viewport.dragging {
  cursor: grabbing;
}

.map-room.draggable {
  cursor: move;
}

.map-room.dragging {
  opacity: 0.8;
  z-index: 100;
}
```

### 3. Event Listeners

| Evento | Acao |
|--------|------|
| `mousedown` no node | Iniciar drag do node |
| `mousedown` no vazio | Iniciar pan do mapa |
| `mousemove` | Atualizar posicao (drag ou pan) |
| `mouseup` | Finalizar drag/pan |
| `wheel` | Zoom in/out |
| `touchstart` (2 dedos) | Iniciar pinch zoom |
| `touchmove` (2 dedos) | Calcular zoom |

### 4. Logica de Drag Node

```javascript
handleNodeDrag: function(e, roomId) {
  const rect = container.getBoundingClientRect();
  const x = (e.clientX - rect.left - this.offsetX) / this.zoom;
  const y = (e.clientY - rect.top - this.offsetY) / this.zoom;
  
  // Converter para porcentagem
  this.customPositions[roomId] = {
    x: (x / width) * 100,
    y: (y / height) * 100
  };
  
  Render.updateMinimap();
}
```

### 5. Logica de Pan

```javascript
handlePan: function(e) {
  const deltaX = e.clientX - this.startX;
  const deltaY = e.clientY - this.startY;
  
  this.offsetX += deltaX;
  this.offsetY += deltaY;
  
  this.startX = e.clientX;
  this.startY = e.clientY;
  
  this.applyTransform();
}

applyTransform: function() {
  const minimap = document.getElementById('minimap');
  minimap.style.transform = 
    `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoom})`;
}
```

### 6. Logica de Zoom

```javascript
handleWheel: function(e) {
  e.preventDefault();
  
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom + delta));
  
  // Zoom no ponto do cursor
  const rect = container.getBoundingClientRect();
  const cursorX = e.clientX - rect.left;
  const cursorY = e.clientY - rect.top;
  
  // Ajustar offset para zoom centrado no cursor
  const zoomRatio = newZoom / this.zoom;
  this.offsetX = cursorX - (cursorX - this.offsetX) * zoomRatio;
  this.offsetY = cursorY - (cursorY - this.offsetY) * zoomRatio;
  
  this.zoom = newZoom;
  this.applyTransform();
}
```

### 7. Pinch Zoom (Mobile)

```javascript
handleTouchMove: function(e) {
  if (e.touches.length === 2) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    if (this.lastPinchDistance) {
      const delta = (currentDistance - this.lastPinchDistance) * 0.01;
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom + delta));
      this.applyTransform();
    }
    
    this.lastPinchDistance = currentDistance;
  }
}
```

### 8. Persistencia no LocalStorage

```javascript
savePositions: function() {
  localStorage.setItem('avp_minimap_positions', JSON.stringify(this.customPositions));
  localStorage.setItem('avp_minimap_viewport', JSON.stringify({
    offsetX: this.offsetX,
    offsetY: this.offsetY,
    zoom: this.zoom
  }));
}

loadPositions: function() {
  const saved = localStorage.getItem('avp_minimap_positions');
  if (saved) this.customPositions = JSON.parse(saved);
  
  const viewport = localStorage.getItem('avp_minimap_viewport');
  if (viewport) {
    const v = JSON.parse(viewport);
    this.offsetX = v.offsetX;
    this.offsetY = v.offsetY;
    this.zoom = v.zoom;
  }
}
```

---

## Modificacoes no Render.updateMinimap

```javascript
updateMinimap: function() {
  // ... codigo existente ...
  
  // Usar posicao customizada se existir
  Object.entries(GameState.rooms).forEach(([roomId, room]) => {
    let pos = roomPositions[roomId];
    
    // Override com posicao customizada
    if (MinimapController.customPositions[roomId]) {
      const custom = MinimapController.customPositions[roomId];
      pos = {
        x: custom.x * (width / 100),
        y: custom.y * (height / 100)
      };
    }
    
    // Adicionar data-room-id para identificar no drag
    roomEl.setAttribute('data-room-id', roomId);
    roomEl.classList.add('draggable');
    
    // ... resto do codigo ...
  });
}
```

---

## Botao de Reset

Adicionar botao para resetar posicoes ao padrao:

```html
<button id="minimap-reset" onclick="MinimapController.resetPositions()" 
        title="Resetar posições do mapa" 
        style="position: absolute; top: 5px; right: 5px; ..."">
  ↺
</button>
```

---

## Alteracoes no Codigo

| Local | Alteracao |
|-------|-----------|
| CSS (linhas 350-560) | Adicionar estilos para drag, pan e cursor |
| HTML (minimap section) | Envolver em viewport, adicionar botao reset |
| JavaScript | Criar `MinimapController` (novo objeto) |
| `Render.updateMinimap` | Usar posicoes customizadas, adicionar data-attributes |
| `Game.init` | Inicializar `MinimapController` |

---

## Resultado Esperado

1. Nodes arrastáveis individualmente para personalizar layout
2. Arrastar no espaço vazio move todo o mapa
3. Scroll do mouse faz zoom in/out centrado no cursor
4. Pinch no mobile faz zoom suave
5. Posicoes salvas no localStorage
6. Botao para resetar ao layout original

