

# Fix: Minimap desaparecendo em mobile/tablet

## Problema
Em telas ≤800px, `#main-content` vira coluna vertical. O log, game card e inventário ocupam todo o espaço, empurrando o `#right-sidebar` (stats + minimapa) para fora da viewport. Como `#game-container` tem `height: 100vh` sem scroll, o minimapa fica invisível.

## Solução
Permitir scroll vertical no mobile e reorganizar a ordem dos elementos para que o minimapa fique visível e acessível.

### Mudanças no CSS (media query ≤800px):

1. **`#game-container`**: trocar `height: 100vh` por `min-height: 100vh` e adicionar `overflow-y: auto` para permitir scroll
2. **`#main-content`**: remover `flex: 1` e `min-height: 0` no mobile — usar `flex: 0 0 auto` para que o conteúdo determine a altura
3. **`#right-sidebar`**: usar `order: -1` para colocar stats + minimapa **antes** do conteúdo principal (assim o jogador vê o mapa primeiro)
4. **`#minimap-container`**: garantir altura mínima de 200px e remover `flex: 1` no mobile (usar altura fixa)
5. **`#log-panel`**: manter `max-height: 200px` já existente

### Layout mobile resultante (de cima para baixo):
```text
┌─────────────────────┐
│  Stats (HP, etc.)   │
├─────────────────────┤
│  Minimapa (200px)   │
├─────────────────────┤
│  Log Panel (200px)  │
├─────────────────────┤
│  Game Card          │
├─────────────────────┤
│  Inventário         │
└─────────────────────┘
     (scrollável)
```

### Detalhes técnicos:
- Na media query `@media (max-width: 800px)`:
  - `#game-container { height: auto; min-height: 100vh; overflow-y: auto; }`
  - `#main-content { flex: 0 0 auto; }`
  - `#right-sidebar { order: -1; }`
  - `#minimap-container { flex: 0 0 auto; min-height: 200px; max-height: 250px; }`
  - `#minimap-viewport { min-height: 150px; }`

~6 linhas adicionadas/modificadas na media query existente.

