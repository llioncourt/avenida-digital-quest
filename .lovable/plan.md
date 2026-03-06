
## Plano: Refatorações Adicionais (CONCLUÍDO)

### Implementado:
1. **Unificação NPC/Ally attacks** → `processAutoCombat()` substitui `processNPCAttacks` + `processAllyAttacks`
2. **`Rules.moveFollowingAllies(roomId)`** → elimina duplicação em `moveTo` e `mapa_antigo`
3. **`Rules.discoverItemsInRoom()`** → elimina 3 blocos idênticos
4. **`Rules.damagePlayer(amount, message)`** → centraliza ~7 checks de morte
5. **`Events.maybeAdvanceTime()`** → consolida lógica de café/skip
6. **Mouse/touch unificados no minimap** → `_startDrag`, `_moveDrag`, `_endDrag`
7. **`Rules.isRoomVisible(roomId)`** → elimina 3 checks duplicados no minimap
