

## Background da Sala Corrente atrás de todo o Jogo

### O que será feito
Adicionar a imagem da sala atual como background de todo o `#game-container`, atrás de todos os cards/panels. A imagem acompanha a troca de sala, com transição suave.

### Alterações em `public/avenida-paulista.html`

**1. CSS — Estilizar o background global (~15 linhas)**

Tornar `#game-container` `position: relative` e criar uma classe `.game-room-bg` idêntica à `.room-bg` mas cobrindo o container inteiro, com opacidade mais baixa (~0.15) e blur leve para não competir com os cards:

```css
#game-container {
  position: relative;  /* adicionar */
}
.game-room-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  filter: blur(2px);
  pointer-events: none;
  transition: opacity 0.8s ease;
  z-index: 0;
}
.game-room-bg.loaded {
  opacity: 0.12;
}
#game-container > *:not(.game-room-bg) {
  position: relative;
  z-index: 1;
}
```

**2. JS — Atualizar background ao trocar de sala (~15 linhas)**

No `Renderer.updateLocation()`, após atualizar o `#location-panel`, também atualizar (ou criar) um div `.game-room-bg` dentro de `#game-container` com a mesma imagem da sala corrente. Reutiliza a mesma lógica de load com `new Image()`.

