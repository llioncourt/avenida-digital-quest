

## Bug Fix: Jogo não inicia no modo offline

### Diagnóstico

No `StartScreen.start()` (linha 11937), o fluxo é:
1. Clique no texto pulsante → mostra spinner
2. `ImagePreloader.preloadAll()` inicia (paralelo)
3. Se online, aguarda MP3 cache; se offline, pula
4. **`await imageLoad`** (linha 11956) — bloqueia até TODAS as imagens resolverem

O problema: offline, `new Image(); img.src = url` pode não disparar `onerror` em todos os navegadores/imagens, fazendo com que `Promise.allSettled` nunca resolva. O spinner fica preso para sempre.

### Solução

Duas mudanças em `public/avenida-paulista.html`:

**1. Adicionar timeout individual a cada imagem no `ImagePreloader.preloadAll()`** (linha ~11921)

Envolver cada promise de imagem com um `setTimeout` de 5 segundos como fallback. Se a imagem não carregar nem falhar em 5s, resolve forçadamente:

```js
return new Promise(function(resolve) {
  var done = false;
  var img = new Image();
  img.onload = img.onerror = function() { if (!done) { done = true; resolve(); } };
  img.src = src;
  setTimeout(function() { if (!done) { done = true; resolve(); } }, 5000);
});
```

**2. Pular preload de imagens quando offline** (linha ~11946)

Quando `!navigator.onLine`, não faz sentido tentar pré-carregar imagens do servidor. Pular completamente o `ImagePreloader.preloadAll()`:

```js
var imageLoad = navigator.onLine ? ImagePreloader.preloadAll() : Promise.resolve();
```

A segunda solução é mais limpa e eficiente — o preload só faz sentido online. Mas implementar ambas garante robustez caso o navegador perca conexão durante o carregamento.

