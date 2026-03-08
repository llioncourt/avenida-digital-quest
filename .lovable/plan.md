

# Fix: Modal de Game Over fecha ao clicar fora

## Problema

O listener na linha 9971 fecha o modal ao clicar no overlay, sem verificar se é o modal de game over. Isso faz o jogo ficar travado porque não há como reabrir o modal.

## Solução

Adicionar uma verificação de `GameState.gameOver` no listener do overlay. Se o jogo acabou, não permitir fechar o modal clicando fora.

**Linha 9972** — adicionar `&& !GameState.gameOver` à condição:

```javascript
if (e.target === this && !this.classList.contains('mapa-exclusive') && !GameState.gameOver) {
```

Arquivo: apenas `public/avenida-paulista.html`, 1 linha alterada.

