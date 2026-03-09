

## Ajuste: Espaçamento nome/descrição + nomes grandes

### Mudanças em `public/avenida-paulista.html`

**CSS (linhas 1436-1464)**:

1. **Mais espaço entre nome e descrição**: Aumentar `bottom` do `.char-name-overlay` de `52px` para `62px`
2. **Nomes grandes cabem sem ellipsis e sem quebra**: Reduzir `font-size` dinamicamente com `font-size: clamp(0.9rem, 3.5vw, 1.4rem)` e adicionar `white-space: nowrap; overflow: hidden; text-overflow: clip; font-size-adjust: auto;` — usar `fit-content` approach com CSS `scale` via `width: 100%; display: block; overflow: visible; white-space: nowrap;` e aplicar um truque de auto-scale usando `transform: scaleX()` via JS inline no template, ou mais simplesmente usar `font-size: min(1.4rem, calc(16px * 12 / var(--name-len)))` — a abordagem mais limpa é usar `container` query ou simplesmente um `font-size` menor com `clamp`

Abordagem final mais simples e robusta: usar `white-space: nowrap` + reduzir font-size para caber via CSS `clamp` baseado na largura do container.

**Alterações concretas**:

- `.char-name-overlay`: `bottom: 62px`, `font-size: clamp(0.85rem, 4cqw, 1.4rem)`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: clip`, e adicionar `container-type: inline-size` no `.char-card-portrait`
- `.char-card-desc`: manter `bottom: 8px` (o gap aumenta pelo nome subir)

