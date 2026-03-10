

## Aplicar background no inventário igual ao card de localização

### O que fazer
Replicar o padrão `.room-bg` do `#location-panel` no `#inventory-panel`, usando a imagem estática `bg_inv.webp`.

### Edições em `public/avenida-paulista.html`

**1. CSS (~após linha 899)** — Adicionar regras de background para o inventário:
```css
#inventory-panel {
  position: relative; /* adicionar */
  overflow: hidden;   /* já existe */
}
.inv-bg {
  position: absolute;
  inset: 0;
  background: url('/rooms/bg_inv.webp') center top / cover no-repeat;
  opacity: 0.35;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, transparent 95%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, transparent 95%);
  pointer-events: none;
  z-index: 0;
}
#inventory-panel > *:not(.inv-bg) {
  position: relative;
  z-index: 1;
}
```

**2. HTML (~linha 2843)** — Adicionar o div `.inv-bg` como primeiro filho do `#inventory-panel`:
```html
<div class="panel" id="inventory-panel">
  <div class="inv-bg"></div>
  <!-- resto existente -->
```

**3. `.inventory-item` CSS** — Remover o `background: linear-gradient(135deg, ...)` hardcoded e usar `background: rgba(0,0,0,0.4)` para os itens ficarem semi-transparentes sobre o fundo, mantendo legibilidade.

### Resultado
- Fundo com `bg_inv.webp` a 35% de opacidade com fade gradual (idêntico ao location-panel)
- Basta trocar o arquivo `public/rooms/bg_inv.webp` para mudar a imagem
- Itens semi-transparentes sobre o fundo

