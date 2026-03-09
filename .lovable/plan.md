

## Bug: Cards de combate "pulam" quando botão confirmar aparece/some

**Causa raiz:** O overlay usa `display: flex; flex-direction: column; align-items: center; gap: 2rem`. O botão `#combat-confirm-btn` alterna entre `display: none` e `display: block`. Quando aparece, o flex recalcula o layout e empurra os cards pra cima; quando some, eles descem.

**Fix:** Substituir `display: none/block` por `visibility: hidden/visible` + `opacity` no botão, para que ele sempre ocupe espaço no layout mas fique invisível quando inativo.

**Arquivo:** `public/avenida-paulista.html`

**Mudança 1 — CSS** (linha 2215-2217): Trocar `display: none` por `visibility: hidden; opacity: 0`:

```css
#combat-confirm-btn {
  visibility: hidden;
  opacity: 0;
  /* ... resto igual */
}
```

**Mudança 2 — JS**: Em todas as ocorrências onde se faz `style.display = 'block'` ou `style.display = 'none'` no botão, trocar por `style.visibility` + `style.opacity`:

- `= 'none'` → `visibility = 'hidden'; opacity = '0'`
- `= 'block'` → `visibility = 'visible'; opacity = '1'`

Isso mantém o botão sempre no flow, os cards ficam fixos, e a animação `combat-blink` continua funcionando normalmente quando visível.

