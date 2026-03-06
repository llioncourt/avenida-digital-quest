

# Fix: Tooltip do clima cortado pelo overflow do log

## Problema
O tooltip dos ícones de clima usa `position: absolute`, ficando dentro do container do log que tem `overflow: hidden`. Mesmo problema que tivemos com a bomba.

## Solução
Aplicar a mesma abordagem da bomba: usar `position: fixed` e mover o tooltip para o `document.body` via JavaScript no hover.

### Alterações em `public/avenida-paulista.html`

**CSS**: Mudar `.weather-tooltip` de `position: absolute` para `position: fixed`, remover `top/left/transform`. Remover a regra `.weather-indicator:hover .weather-tooltip`.

**HTML**: Remover os `<span class="weather-tooltip">` de dentro dos `.weather-indicator`. Criar um único `<div id="weather-tooltip-content">` no body com estilo fixed.

**JS**: No `DOMContentLoaded`, para cada weather indicator, adicionar `mouseenter`/`mouseleave` que:
1. Calcula posição com `getBoundingClientRect()`
2. Define o texto do tooltip baseado no id do elemento (rain→"Está chovendo", wind→"Vento forte", fog→"Neblina densa")
3. Posiciona o tooltip fixo abaixo do ícone
4. Mostra/esconde o tooltip

Mesma técnica já usada no tooltip da bomba — um único elemento tooltip reutilizável posicionado via JS.

