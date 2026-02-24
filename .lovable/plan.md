

## Correcao de 2 Bugs: Escudo vs Demonio e Ordem de Morte

### Bug 1: Demonio convertido nao ataca a Bruxa quando escudo esta ativo

**Causa**: Na linha 6139 de `processAllyAttacks`, a Bruxa e filtrada fora da lista de inimigos quando `!GameState.forceShieldDown` (escudo ativo). O escudo deveria bloquear apenas o **acesso fisico do jogador** ao teto do MASP, nao os ataques dos aliados que ja estao na sala.

**Correcao**: Remover a restricao do escudo do filtro de `enemiesInRoom` dentro de `processAllyAttacks`. O Demonio ja esta na sala da Bruxa (foi invocado la), entao ele deve poder ataca-la independente do estado do escudo.

Especificamente, trocar:
```
!(c.id === 'bruxa' && !GameState.forceShieldDown)
```
por nenhuma restricao (remover essa linha do filtro).

O escudo continua bloqueando o acesso do jogador ao teto via MASP (logica em `Rules.move`), mas aliados que ja estao na sala atacam normalmente.

### Bug 2: NPCs mortos ainda atacam o jogador

**Causa**: O sistema de combate usa uma fila (queue). Quando o jogador ataca e mata um NPC, o dano so e aplicado no `applyCallback` (quando o modal e confirmado). Porem, `processNPCAttacks` roda no mesmo turno e ve o NPC ainda vivo porque o callback nao executou ainda.

**Correcao**: Em `processNPCAttacks`, antes de enfileirar o ataque do NPC, verificar se ja existe um combate na fila que vai matar esse NPC. Se o `combatResult.killed === true` e o `targetId` corresponde ao NPC, pular o ataque dele.

Criar uma funcao auxiliar no `CombatModal`:
```javascript
isTargetedForKill: function(charId) {
  return this.queue.some(function(item) {
    return item.combatResult.targetId === charId && item.combatResult.killed;
  });
}
```

E no loop de `processNPCAttacks`, adicionar logo apos os checks iniciais:
```javascript
if (CombatModal.isTargetedForKill(char.id)) return;
```

### Resumo tecnico

**Arquivo:** `public/avenida-paulista.html`

1. `processAllyAttacks` (linha ~6139) -- remover filtro `!(c.id === 'bruxa' && !GameState.forceShieldDown)` do array de inimigos
2. `CombatModal` -- adicionar metodo `isTargetedForKill(charId)` que verifica a fila
3. `processNPCAttacks` (linha ~6046) -- adicionar check `if (CombatModal.isTargetedForKill(char.id)) return;` apos `if (!char.isAlive) return;`

