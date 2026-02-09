

# Fix: Icones de Som e Musica na Mesma Linha

**Arquivo**: `public/avenida-paulista.html`

## Problema

Os botoes `#sound-toggle` e `#music-toggle` (linhas 1221-1236) estao soltos dentro de `#stats`, que tem `flex-wrap: wrap` (linha 72). Em telas menores, eles quebram para linhas separadas.

## Solucao

Envolver os dois `<button>` em um `<div>` wrapper com estilos inline que forcam ambos a ficarem na mesma linha:

```html
<div style="display:flex; gap:0.3rem; flex-shrink:0; margin-left:auto;">
  <button id="sound-toggle" ...>🔊</button>
  <button id="music-toggle" ...>🎵</button>
</div>
```

Isso agrupa os dois botoes como um unico item flex dentro de `#stats`, impedindo que se separem ao fazer wrap.

Nenhuma outra mudanca necessaria.
