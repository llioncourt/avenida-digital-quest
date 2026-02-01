
# Plano: Corrigir Navegacao por Toque no Minimapa (Mobile)

## Problema Identificado

O clique para navegar no minimapa funciona no desktop, mas **nao funciona no mobile** porque:

1. No `handleMouseUp`, existe logica para detectar "clique rapido" (delta < 5px) e chamar `Game.move()`
2. No `handleTouchEnd`, essa logica **nao existe** - o codigo apenas limpa o estado do drag

### Codigo Desktop (Funciona)
```javascript
handleMouseUp: function(e) {
  // Se quase nao moveu, considerar como clique
  const deltaX = Math.abs(e.clientX - this.startX);
  const deltaY = Math.abs(e.clientY - this.startY);
  if (deltaX < 5 && deltaY < 5) {
    if (roomEl.classList.contains('valid-exit')) {
      Game.move(this.dragTarget);  // <- NAVEGA!
    }
  }
}
```

### Codigo Mobile (Nao Funciona)
```javascript
handleTouchEnd: function(e) {
  // Apenas limpa o estado, NAO verifica tap para navegar
  if (this.dragType === 'node') {
    roomEl.classList.remove('dragging');
    this.savePositions();
  }
  // <- FALTA A LOGICA DE TAP!
}
```

---

## Solucao

Adicionar a mesma logica de deteccao de "tap" no `handleTouchEnd`, verificando se o toque inicial e final estao muito proximos (< 10px para touch, que e menos preciso que mouse).

### Codigo Corrigido

```javascript
handleTouchEnd: function(e) {
  this.lastPinchDistance = null;
  
  if (this.isDragging) {
    const viewport = document.getElementById('minimap-viewport');
    
    if (this.dragType === 'node') {
      const roomEl = document.querySelector(`[data-room-id="${this.dragTarget}"]`);
      if (roomEl) {
        roomEl.classList.remove('dragging');
        
        // NOVO: Verificar se foi um tap (toque rapido sem arrastar)
        // Usar changedTouches para obter a posicao final do toque
        if (e.changedTouches && e.changedTouches.length > 0) {
          const touch = e.changedTouches[0];
          const deltaX = Math.abs(touch.clientX - this.startX);
          const deltaY = Math.abs(touch.clientY - this.startY);
          
          // Se moveu menos de 10px, considerar como tap (navegar)
          if (deltaX < 10 && deltaY < 10) {
            if (roomEl.classList.contains('valid-exit')) {
              Game.move(this.dragTarget);
            }
          }
        }
      }
      this.savePositions();
    }
    
    if (viewport) {
      viewport.classList.remove('dragging');
      viewport.classList.remove('dragging-node');
    }
    
    this.isDragging = false;
    this.dragType = null;
    this.dragTarget = null;
  }
}
```

---

## Alteracao Necessaria

| Arquivo | Linhas | Alteracao |
|---------|--------|-----------|
| `public/avenida-paulista.html` | 3631-3654 | Adicionar deteccao de tap no `handleTouchEnd` |

---

## Por que 10px e nao 5px?

Touch e menos preciso que mouse - o dedo do usuario pode "tremer" um pouco mais. Usar 10px garante que toques rapidos sejam detectados corretamente, mesmo com pequena imprecisao.

---

## Resultado Esperado

1. Usuario abre o jogo no celular
2. Toca numa sala adjacente (azul) no minimapa
3. O jogo detecta que foi um tap (nao um drag)
4. `Game.move()` e chamado e o jogador navega para a sala
