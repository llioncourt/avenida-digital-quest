

# Mover Icones de Audio para o Card de Log

**Arquivo**: `public/avenida-paulista.html`

## O que sera feito

Os botoes de musica (🎵) e efeitos sonoros (🔊) serao movidos do card de status (#header) para o canto superior direito do card de log (#log-panel), conforme indicado na imagem de referencia.

## Mudancas

### 1. HTML: Mover botoes para o log-panel (~linha 1163-1165)

Transformar o titulo do log-panel em um container flex com o titulo a esquerda e os botoes de audio a direita:

```html
<div id="log-panel">
  <div style="display:flex; align-items:center; justify-content:space-between;">
    <h3 class="section-title" style="margin:0; border:none; padding:0;">Avenida Paulista</h3>
    <div style="display:flex; gap:0.3rem; flex-shrink:0;">
      <button id="sound-toggle" ...>🔊</button>
      <button id="music-toggle" ...>🎵</button>
    </div>
  </div>
  <div id="log-container" ...></div>
</div>
```

### 2. HTML: Remover botoes do card de status (~linha 1237-1244)

Remover o wrapper flex e os dois botoes de audio que estao atualmente dentro do `#header`.

### 3. Nenhuma outra mudanca

Nenhum CSS, JS ou logica do jogo sera alterado. Os IDs `sound-toggle` e `music-toggle` permanecem os mesmos, entao o JS existente continua funcionando.

