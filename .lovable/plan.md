

# Ajuste visual do card de Stats

## Problema
O `.stat-value` tem `background: var(--bg-primary)` (#0a0a0f — preto puro), criando caixas pretas feias atrás de cada valor. O header já tem um fundo escuro (gradiente de `--bg-secondary` para `--bg-tertiary`), então o background preto é redundante e destoante.

Além disso, o grid do `#stats` (3 colunas × 2 linhas) não tem posicionamento definido para os novos stats de karma e bruxa, que foram adicionados sem grid placement.

## Mudanças

### 1. Remover background preto do `.stat-value` (linha ~160-167)
- Remover `background: var(--bg-primary)` e o `border-radius`
- Manter padding mínimo para espaçamento

### 2. Reorganizar o grid para 3 colunas × 3 linhas
Layout proposto (alinhado à imagem de referência):

```text
Linha 1:  ❤️ HP        ⚖️ Peso      🕐 Hora
Linha 2:  ⚡ Energia    😐 Karma     (vazio)
Linha 3:  (vazio)       🔮 Bruxa     (vazio)
```

- `.stat-hp`: col 1, row 1
- `.stat-energy`: col 1, row 2  
- `.stat-weight`: col 2, row 1
- `.stat-karma`: col 2, row 2
- `.stat-time`: col 3, row 1
- `.stat-witch`: col 2, row 3

### 3. Ajuste mobile correspondente (linha ~1417-1426)
Remover background preto também na media query mobile.

