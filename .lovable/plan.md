

## Título roxo quando online

Alterar a animação do título "Avenida Paulista" (`.modern-pulse-title`) para usar roxo/branco quando online, mantendo amarelo/branco quando offline.

### Alterações em `public/avenida-paulista.html`

**1. Adicionar classe CSS `.modern-pulse-title.online` (~linha 553, após o bloco `.modern-pulse-title`)**

```css
.modern-pulse-title.online {
  background: linear-gradient(270deg, #9b59b6, #fff, #9b59b6, #6c3483);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 15px rgba(155, 89, 182, 0.2);
}
```

**2. No início do jogo (após `Mp3Cache.preloadAll()` ou no init), adicionar detecção online/offline (~linha 5285)**

```js
// Indicador online no título
function updateTitleOnlineStatus() {
  const title = document.querySelector('.modern-pulse-title');
  if (title) {
    if (navigator.onLine) {
      title.classList.add('online');
    } else {
      title.classList.remove('online');
    }
  }
}
updateTitleOnlineStatus();
window.addEventListener('online', updateTitleOnlineStatus);
window.addEventListener('offline', updateTitleOnlineStatus);
```

Isso detecta automaticamente mudanças de conectividade e alterna as cores em tempo real.

