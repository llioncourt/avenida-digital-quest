

# Animações de Transição para Mudança de Sala

## Objetivo

Adicionar animações visuais suaves quando o jogador muda de sala, dando feedback cinematográfico à navegação.

## O que será animado

1. **Fade-out/Fade-in do painel de localização** (`#location-panel`) — ao mudar de sala, o conteúdo faz fade-out rápido, atualiza, e faz fade-in
2. **Slide dos itens e personagens** — os botões de itens e personagens entram com um leve slide-up escalonado (staggered)
3. **Flash sutil no nome da sala** — o `#location-name` pulsa brevemente ao mudar

## Implementação Técnica

### 1. CSS: Adicionar keyframes e classes de animação

```css
/* Transição de sala */
#location-panel.room-transition-out {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}
#location-panel.room-transition-in {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

/* Nome da sala brilha ao entrar */
@keyframes room-name-glow {
  0% { text-shadow: 0 0 0 transparent; }
  50% { text-shadow: 0 0 12px var(--accent-gold); }
  100% { text-shadow: 0 0 0 transparent; }
}
.room-name-glow { animation: room-name-glow 0.6s ease; }

/* Itens e personagens entram com stagger */
@keyframes slide-up-fade {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.btn-item, .btn-character {
  animation: slide-up-fade 0.25s ease backwards;
}
```

Cada botão de item/personagem recebe um `animation-delay` incremental via inline style no render (0ms, 50ms, 100ms...).

### 2. JavaScript: Modificar `Game.move()` para animar

Na função `Game.move()` (linha ~9147), em vez de chamar `Render.update()` diretamente:

1. Adicionar classe `room-transition-out` ao `#location-panel`
2. Após 150ms (via `setTimeout`), chamar `Render.update()` e trocar para classe `room-transition-in`
3. Adicionar classe `room-name-glow` ao `#location-name` (removida após 600ms)

### 3. Stagger nos botões renderizados

Em `Render.updateItems()` e `Render.updateCharacters()`, adicionar `style="animation-delay: ${index * 50}ms"` a cada botão gerado.

## Resumo das alterações

- **1 arquivo**: `public/avenida-paulista.html`
- **CSS**: ~20 linhas novas de keyframes e classes
- **JS**: ~15 linhas modificadas em `Game.move()`, `Render.updateItems()` e `Render.updateCharacters()`

