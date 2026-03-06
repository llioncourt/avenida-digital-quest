

# Organizar Modal da Cera Mágica + Transição Especial do Teto do MASP

## 1. Organizar o modal da Cera Mágica

O modal atual usa `button-group` com `flex-wrap`, resultando em layout desalinhado. Vou reorganizar com um grid CSS dedicado:

- Adicionar classe `.item-select-grid` com `display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem`
- Botões ocupam largura total dentro de cada coluna, ficando uniformes
- Se houver número ímpar, o último item centraliza com `justify-self: center` ou ocupa a linha inteira
- Substituir o `div.button-group` no `openItemSelectModal` por `div.item-select-grid`
- Estilizar o botão "Cancelar" centralizado abaixo, com margem superior

## 2. Animação especial para o Teto do MASP

Transição épica ao entrar no `teto_masp` — local do boss fight:

- **CSS**: Criar `@keyframes teto-masp-enter` — flash branco/dourado rápido + shake sutil + fade-in dramático
- **JS**: No `Game.move()`, detectar `roomId === 'teto_masp'` e aplicar animação especial:
  - Delay maior (300ms em vez de 160ms)
  - Flash overlay branco que pulsa e desaparece
  - Screen shake leve (2-3 ciclos de translateX alternado)
  - Glow mais intenso no nome da sala (vermelho/roxo em vez de dourado)

### Alterações

**Arquivo**: `public/avenida-paulista.html`

**CSS** (~15 linhas):
- `.item-select-grid` — grid 2 colunas para o modal
- `@keyframes teto-flash` — flash branco/dourado overlay
- `@keyframes screen-shake` — tremor horizontal
- `.teto-masp-glow` — glow vermelho/roxo no nome

**JS**:
- `openItemSelectModal`: trocar `button-group` por `item-select-grid`
- `Game.move()`: branch especial quando `roomId === 'teto_masp'` com timing e efeitos diferentes

