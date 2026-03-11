

## Problema
O nome do item (`bottom: 32px`) e a descrição (`bottom: 8px`) estão muito próximos no card do modal. Com apenas 24px de espaçamento, descrições longas fazem overflow sobre o nome.

## Solução
Subir o nome do item para dar mais espaço vertical à descrição.

### Alteração em `public/avenida-paulista.html`

**CSS — Ajuste de posicionamento (~1 linha)**
Modificar o `.item-name-overlay` (linha ~1851):
```css
#item-modal-content .item-card-image .item-name-overlay {
  position: absolute;
  bottom: 56px;  /* alterado de 32px para 56px */
  left: 16px;
  right: 16px;
  z-index: 2;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-gold);
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
  letter-spacing: 0.08em;
}
```

Isso aumenta o espaço entre nome e descrição de 24px para 48px, evitando overlap em descrições maiores.

