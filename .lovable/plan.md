

## Redesign: Character Card - Layout Horizontal

```text
┌────────────┬─────────────────┐
│     HOSTIL │                 │
│            │ VIDA  44/50 ═══ │
│  PORTRAIT  │ ATK 20 │ DEF 6  │
│  (full)    │                 │
│  Nome      │ [Atacar] [Fechar]│
│  Descrição │                 │
└────────────┴─────────────────┘
```

### Mudanças em `public/avenida-paulista.html`

**CSS (~lines 1386-1570)** - Substituir estilos do `.char-card`:

- `.char-card` → `display: flex; flex-direction: row; min-height: 320px;`
- `.char-card-portrait` → `width: 50%; position: relative;` com imagem `object-fit: cover` 100%
- `.char-status-badge` → `position: absolute; top: 12px; right: 12px;` **DENTRO** do `.char-card-portrait`
- `.char-name-overlay` → `position: absolute; bottom: 40px;` sobre a imagem
- `.char-card-desc` → `position: absolute; bottom: 12px;` sobre a imagem, fonte menor
- `.char-card-body` → `width: 50%; display: flex; flex-direction: column; justify-content: center;` contém apenas stats + botões
- Responsivo mobile (`<= 500px`) → layout vertical empilhado

**HTML template (~lines 9701-9746)** - Reestruturar:

- Mover `.char-status-badge` para DENTRO de `.char-card-portrait` (top-right sobre a imagem)
- Mover nome e descrição para DENTRO de `.char-card-portrait` (bottom, sobre a imagem com gradient)
- `.char-card-body` contém apenas: stats grid + botões de ação

