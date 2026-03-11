

## Problema
O nome e a descrição estão posicionados com `position: absolute` e valores fixos de `bottom`. Isso causa distância excessiva quando a descrição é curta, e overlap quando é longa.

## Solução
Trocar o posicionamento absoluto fixo por um container flex ancorado no fundo da imagem. Assim nome e descrição ficam sempre juntos, ajustando-se automaticamente ao tamanho do texto.

### Alteração em `public/avenida-paulista.html`

**CSS — Substituir posicionamento fixo por flex container (~20 linhas)**

Envolver nome e descrição num container `.item-text-overlay` posicionado no fundo da imagem:

```css
#item-modal-content .item-card-image .item-text-overlay {
  position: absolute;
  bottom: 8px;
  left: 16px;
  right: 16px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

#item-modal-content .item-card-image .item-name-overlay {
  /* remover position:absolute, bottom, left, right */
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-gold);
  text-shadow: 0 2px 12px rgba(0,0,0,0.8);
  letter-spacing: 0.08em;
}

#item-modal-content .item-card-image .item-desc-overlay {
  /* remover position:absolute, bottom, left, right */
  color: rgba(255,255,255,0.7);
  font-size: 0.72rem;
  line-height: 1.4;
  text-shadow: 0 1px 4px rgba(0,0,0,0.9);
}
```

**JS — Envolver spans no container (~3 linhas)**

Na construção do HTML do modal (~linha 10391), trocar:
```html
<span class="item-name-overlay">...</span>
<span class="item-desc-overlay">...</span>
```
por:
```html
<div class="item-text-overlay">
  <span class="item-name-overlay">...</span>
  <span class="item-desc-overlay">...</span>
</div>
```

Resultado: nome e descrição ficam sempre colados, ancorados no fundo da imagem, ajustando-se automaticamente ao comprimento do texto.

