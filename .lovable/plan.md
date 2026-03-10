

## Loading screen durante carregamento dos MP3s

### Problema
Ao clicar no título, a `start-screen` é removida imediatamente e o `await Mp3Cache.ensureAllCritical()` roda com a UI principal vazia visível ao fundo.

### Fix

**Arquivo:** `public/avenida-paulista.html`

**1. Não remover start-screen imediatamente** — trocar o conteúdo dela para uma tela preta com spinner:

```js
start: async function() {
  var screen = document.getElementById('start-screen');
  // Troca conteúdo por loading spinner
  screen.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">' +
    '<div style="width:48px;height:48px;border:4px solid #FFD70044;border-top-color:#FFD700;border-radius:50%;animation:spin 1s linear infinite;"></div>' +
    '<p style="color:#FFD700;font-family:\'Press Start 2P\',monospace;font-size:0.8rem;">Carregando...</p></div>';
  
  if (navigator.onLine) {
    await Mp3Cache.ensureAllCritical();
  }
  screen.remove(); // Remove só depois de carregar
  IntroSystem.init();
}
```

**2. CSS** — adicionar `@keyframes spin` (se não existir):
```css
@keyframes spin { to { transform: rotate(360deg); } }
```

A tela preta do `start-screen` já tem `position:fixed; inset:0; z-index:10000; background:#000`, então cobre tudo perfeitamente. Só trocamos o `<h1>` por um spinner e movemos o `screen.remove()` para depois do await.

