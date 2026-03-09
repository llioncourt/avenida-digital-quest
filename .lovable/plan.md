

## Fix: Botão "Converter" estourando o card

O problema é que os botões têm `flex: 1` (linha 1593) forçando todos a ocuparem espaço igual, mas com 3 botões no espaço de 50% do card, o texto "✨ Converter" estoura.

### Mudança em `public/avenida-paulista.html`

**CSS (linhas 1587-1595)** — Remover `flex: 1` e `min-width: 0` dos botões. Usar `flex-wrap: wrap` já existente para permitir que quebrem naturalmente, e reduzir o padding para caber melhor:

```css
#character-modal-content .char-card-actions .btn {
  margin: 0;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.75rem;
  backdrop-filter: blur(4px);
  white-space: nowrap;
}
```

Isso mantém o design visual dos botões mas permite que caibam sem estourar, usando tamanho natural do texto.

