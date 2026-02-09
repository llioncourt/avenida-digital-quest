

# Tres Ajustes Visuais

**Arquivo**: `public/avenida-paulista.html`

## 1. Inventario: trocar texto dos verbos por icones

Os botoes de acao dos itens ("Usar", "Largar") serao substituidos por icones com tooltip, evitando que o card estoure.

**Mudancas no `renderInventory()` (~linha 3517-3526):**
- `Usar` vira icone `✋` (ou similar) com `title="Usar"`
- `Largar` vira icone `📤` com `title="Largar"`
- Botoes menores com padding reduzido e fonte maior para o emoji ficar legivel

**CSS ajustado para `.btn-small`:**
- Padding compacto (~0.2rem 0.4rem), sem texto longo
- Garante que `.inventory-actions` use `flex-shrink: 0` para nao comprimir os botoes
- `.inventory-item` recebe `overflow: hidden` e `min-width: 0` para o nome truncar com ellipsis em vez de explodir o card

## 2. Status: icones de musica e som sempre na mesma linha

Os botoes `#sound-toggle` e `#music-toggle` (~linhas 1210-1215) serao agrupados num wrapper flex para nunca quebrarem linha.

**Mudancas:**
- Envolver os dois `<button>` em `<div style="display:flex; gap:0.3rem; flex-shrink:0; margin-left:auto;">`
- Isso garante que mesmo em telas estreitas, os dois icones fiquem lado a lado

## 3. Titulo "Avenida Paulista" com destaque moderno

Novo estilo CSS para `#log-panel .section-title`:
- `font-size: 1.1rem`
- `letter-spacing: 3px`
- `text-transform: uppercase`
- Gradiente dourado no texto (`background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-dim))` com `-webkit-background-clip: text` e `-webkit-text-fill-color: transparent`)
- `border-bottom: 2px solid var(--accent-gold-dim)`

