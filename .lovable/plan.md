

# Fix: Tooltip da bomba cortado pelo overflow do log-panel

## Problema raiz

O `#log-panel` tem `overflow: hidden`. O tooltip da bomba é filho do botão dentro desse painel, então qualquer conteúdo que extrapole os limites do painel é cortado — independente do `z-index`.

## Solução

Mudar o `.bomb-tooltip` para `position: fixed` e calcular sua posição via JS no hover, em vez de depender de `position: absolute` dentro do container com overflow.

### Alterações em `public/avenida-paulista.html`

**CSS** (~3 linhas alteradas):
- `.bomb-tooltip`: trocar `position: absolute; top: 110%; right: 0;` por `position: fixed;` (sem top/right fixos — serão definidos via JS)

**JS** (~10 linhas):
- No `mouseenter` do `#bomb-indicator-btn`, calcular `getBoundingClientRect()` do botão e posicionar o tooltip com `style.top` e `style.left` fixos na viewport
- No `mouseleave`, esconder o tooltip

