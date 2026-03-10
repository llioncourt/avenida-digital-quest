

## Bug: "Você não pode ir para lá daqui!" aleatório

### Causa raiz

O `Game.move()` tem um `setTimeout` de 160ms para animação de transição (linha 10065). Durante esse delay, se o jogador clicar rapidamente em duas salas no minimapa:

1. Click 1 → valida exit no minimapa ✓ → agenda `Actions.moveTo(salaA)` em 160ms
2. Click 2 → valida exit no minimapa ✓ → agenda `Actions.moveTo(salaB)` em 160ms
3. setTimeout 1 dispara → `moveTo(salaA)` → jogador vai para salaA ✓
4. setTimeout 2 dispara → `moveTo(salaB)` → mas agora o jogador está em salaA, e salaB **não é exit de salaA** → "Você não pode ir para lá daqui!"

O minimapa valida os exits no momento do clique, mas o `moveTo` valida novamente no momento da execução (160ms depois), quando o estado já mudou.

### Fix

**1. Guardar `prevRoom` e verificar dentro do setTimeout** — se o jogador já se moveu, cancelar:

Na função `Game.move()` (linha 10065), dentro do setTimeout, antes de chamar `Actions.moveTo()`:

```js
setTimeout(function() {
  // Se o jogador já se moveu durante a animação, cancelar
  if (GameState.playerLocation !== prevRoom) {
    panel.classList.remove('room-transition-out');
    return;
  }
  self.processAction(Actions.moveTo(roomId));
  // ... resto do código
}, delay);
```

Isso é uma mudança de 3 linhas que resolve o bug na raiz sem alterar nenhuma outra lógica.

