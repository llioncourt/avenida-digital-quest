

## Aplicar glassmorphism na área de texto do log

### Problema
O `#log-panel` (card externo) tem glassmorphism, mas o `#log-container` (área de texto interna com scroll) usa `background: var(--bg-primary)` que é uma cor sólida opaca (`#0a0a0f`), bloqueando completamente o efeito de transparência.

### Correção
Na linha 245, trocar o background do `#log-container` de sólido para semi-transparente:

```css
/* De: */
background: var(--bg-primary);

/* Para: */
background: rgba(10, 10, 15, 0.4);
```

Isso permite que o blur e a transparência do card pai passem através da área de texto, mantendo legibilidade do texto de log.

