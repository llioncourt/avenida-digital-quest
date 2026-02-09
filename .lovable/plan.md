
# Reorganizar Layout: Header Compacto e Mapa Alinhado ao Topo

## Visao Geral
Remover o titulo do jogo do header, compactar os status alinhados a esquerda, e fazer o mapa comecar no mesmo nivel do topo do header -- ocupando mais espaco vertical. O inventario continua com altura fixa para nao comprimir o mapa.

## Representacao ASCII do Layout Proposto

```text
+=========================+===========================+
| 🕐 17:00 ❤️ 100 ⚖️ 0   |  🗺️ MAPA                 |
| 🔮 ○○○○  🔊 🎵         |  .......................  |
+-------------------------+  .......................  |
|                         |  .......................  |
|  📜 Log                 |  .......................  |
|  ....................   |  .......................  |
|  ....................   |  .......................  |
|                         |  .......................  |
|  📍 Sala atual          |  .......................  |
|  ....................   |                           |
|  ....................   |  🎒 Inventário             |
|  📦 Itens  👥 Personag. |  item1, item2... ▼        |
+=========================+===========================+
```

A coluna direita (mapa + inventario) comeca no mesmo nivel que o header, e o header so ocupa a coluna esquerda. O mapa ganha mais espaco vertical.

## Mudancas Tecnicas

**Arquivo**: `public/avenida-paulista.html`

### 1. Reestruturar o HTML do layout

Mover o `#header` para dentro do `#game-panel` (coluna esquerda), em vez de estar acima de `#main-content`. Assim o `#right-sidebar` comeca no topo absoluto da area de conteudo.

**Antes:**
```
#game-container
  #header (titulo + stats) -- largura total
  #main-content
    #game-panel (log + sala)
    #right-sidebar (mapa + inventario)
```

**Depois:**
```
#game-container
  #main-content
    #game-panel
      #header (apenas stats, sem titulo) -- so na coluna esquerda
      #log-panel
      #location-panel
    #right-sidebar (mapa + inventario) -- comeca do topo
```

### 2. CSS do Header

- Remover `#game-title` (o h1 com "AVENIDA PAULISTA")
- `#header`: remover `justify-content: space-between`, usar `justify-content: flex-start` para alinhar stats a esquerda
- Reduzir padding para `0.5rem 1rem` (mais compacto)
- `#stats`: reduzir `gap` para `1rem` e `font-size` para `0.85rem`

### 3. CSS do Right Sidebar

- Manter `#right-sidebar` como esta, mas agora sem header acima ele ocupa toda a altura do `#main-content`
- `#inventory-panel`: manter `max-height: 180px` e `flex-shrink: 0` para nao comprimir o mapa
- `#minimap-container`: manter `flex: 1` para preencher o restante

### 4. CSS do Game Panel

- `#game-panel`: manter `flex: 1` e `flex-direction: column`
- O header agora e um filho do game-panel, com `flex-shrink: 0`

### 5. Responsivo

- No media query `max-width: 800px`: o header volta a ficar em largura total (acima de tudo) quando em mobile, ou manter dentro do game-panel que ja estara em coluna

Resultado: o mapa ocupa mais espaco vertical, o header fica compacto com stats a esquerda, e o inventario com altura fixa nao empurra o mapa.
