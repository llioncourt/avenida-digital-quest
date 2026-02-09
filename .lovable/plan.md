

# Ajuste de Layout + Titulo do Log

## Duas mudancas combinadas

**Arquivo**: `public/avenida-paulista.html`

### 1. Novo Layout dos Paineis

Reorganizar a estrutura HTML e CSS para o layout:

```text
┌──────────────────────┬──────────────────────┐
│  Avenida Paulista    │                      │
│  (Log)               │    Minimapa          │
├──────────┬───────────┤                      │
│ Game     │ Inventario├──────────────────────┤
│ Card     │           │  Status              │
│          │           │  (HP / Tempo / Peso) │
└──────────┴───────────┴──────────────────────┘
```

**Estrutura HTML:**
- `#main-content` com duas colunas: `#left-column` e `#right-sidebar`
- `#left-column`: `#log-panel` (topo) + `#left-bottom` (Game Card e Inventario lado a lado)
- `#right-sidebar`: `#minimap-container` (topo) + `#header` status (embaixo)

**Movimentacoes:**
- `#header` (status) sai do `#game-panel` e vai para o final do `#right-sidebar`
- `#inventory-panel` sai do `#right-sidebar` e vai para `#left-bottom`, ao lado do `#location-panel`

**CSS principal:**
- `#main-content`: flex row, gap 1rem
- `#left-column`: flex column, flex 1
- `#left-bottom`: flex row, gap 1rem, flex 1
- `#right-sidebar`: flex column, largura fixa ~320px
- `#inventory-panel`: remover max-height de 180px
- Responsivo (mobile): tudo empilha verticalmente

### 2. Titulo do Log: "Avenida Paulista"

Na linha 1139 do HTML, trocar:

```html
<h3 class="section-title">📜 Log</h3>
```

Por:

```html
<h3 class="section-title">Avenida Paulista</h3>
```

Remove o icone de pergaminho e a palavra "Log", substituindo por "Avenida Paulista" como titulo do card.

