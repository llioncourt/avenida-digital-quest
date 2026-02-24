

## Correcao do Bug: NPCs Mortos Ainda Atacam

### Causa raiz

O metodo `isTargetedForKill` verifica a fila (`this.queue`) do `CombatModal`, mas o problema e que o item ja foi **removido** da fila antes da verificacao acontecer.

O fluxo e:
1. Jogador ataca -> `CombatModal.enqueue()` adiciona o combate na fila
2. `enqueue` chama `processNext()` que faz `this.queue.shift()` — **remove o item da fila**
3. `processAction` chama `Events.advanceTime()` -> `processNPCAttacks()`
4. `isTargetedForKill` verifica a fila, mas ela ja esta vazia

### Correcao

Alem de verificar `this.queue`, o metodo `isTargetedForKill` precisa tambem verificar o combate atual em `this.pendingCombat` (que e onde o item vai parar apos o `shift`).

**Arquivo:** `public/avenida-paulista.html`

Alterar `isTargetedForKill` para:

```javascript
isTargetedForKill: function(charId) {
  // Verificar combate atual (já removido da fila pelo shift)
  if (this.pendingCombat && 
      this.pendingCombat.result.targetId === charId && 
      this.pendingCombat.result.killed) {
    return true;
  }
  // Verificar fila restante
  return this.queue.some(function(item) {
    return item.combatResult.targetId === charId && item.combatResult.killed;
  });
}
```

Isso cobre ambos os casos: o combate que ja esta sendo exibido no modal (`pendingCombat`) e qualquer outro que ainda esteja na fila.

