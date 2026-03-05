

# Correção: Energia invisível no HUD

## Problema
O `#stats` container tem `overflow: hidden` e `flex-wrap: nowrap`, e com 4 stats (tempo, HP, peso, energia) o último é cortado quando não há espaço suficiente.

## Solução
- Reduzir o `gap` entre stats de `1rem` para `0.6rem`
- Adicionar `flex-shrink: 0` em cada `.stat` para não comprimir
- Ou alternativamente, usar `justify-content: space-between` no `#stats` para distribuir igualmente
- Garantir que o `#energy-display` tenha a cor dourada correta (`#e0a020`)
- Formato: `⚡ 100/100`

Mudança de ~5 linhas no CSS do `#stats` no arquivo `public/avenida-paulista.html`.

