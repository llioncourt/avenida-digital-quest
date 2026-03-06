

# Oportunidades de Refatoracao Adicionais

Apos analisar todo o arquivo (9.429 linhas), aqui estao as areas com maior potencial de melhoria, ordenadas por impacto.

---

## 1. Unificar `processNPCAttacks` e `processAllyAttacks` (~80 linhas salvas)

Essas duas funcoes (linhas 7055-7247) sao quase identicas: ambas iteram personagens, verificam se estao vivos/na sala, escolhem golpe aleatorio, calculam dano, e fazem enqueue no CombatModal. A unica diferenca e quem ataca quem.

**Solucao:** Criar `processCombatFor(filterFn, targetFilterFn)` parametrizado, ou um unico `processAutoCombat()` que trata ambos os casos.

---

## 2. Extrair logica de "mover aliados seguidores" para funcao reutilizavel (~20 linhas salvas)

O bloco que move aliados em modo follow aparece em **3 locais**:
- `Actions.moveTo` (linha 5845)
- `ItemUseHandlers.mapa_antigo` (linha 5590)
- Potencialmente outros itens de teletransporte

**Solucao:** Criar `Rules.moveFollowingAllies(roomId)` chamado nos 3 locais.

---

## 3. Consolidar "descobrir itens na sala" (~10 linhas salvas)

O bloco que descobre itens na sala atual (`Object.values(GameState.items).forEach(...)` com `discoveredItems.add`) aparece **3 vezes** em `processAction` (linhas 8559, 8591) e `Game.init` (linha 8433).

**Solucao:** Criar `Rules.discoverItemsInRoom()`.

---

## 4. Consolidar checks de morte do jogador (~15 linhas salvas)

O padrao `if (player.hp <= 0) { player.hp = 0; player.isAlive = false; }` aparece em **7+ locais** (chuva, energia, tropeço noturno, armadilhas, etc).

**Solucao:** Criar `Rules.damagePlayer(amount, message)` que aplica dano, faz o check de morte, e loga automaticamente.

---

## 5. Dados duplicados em `processAction` (~15 linhas salvas)

O bloco de `skipNextTimeAdvance` + `advanceTime` e repetido identicamente para o caso normal e o caso `combatModal` (linhas 8550-8556 e 8573-8580).

**Solucao:** Extrair para `Events.maybeAdvanceTime()`.

---

## 6. MinimapController: mouse e touch duplicados (~60 linhas salvas)

`handleMouseDown`/`handleTouchStart`, `handleMouseMove`/`handleTouchMove`, e `handleMouseUp`/`handleTouchEnd` compartilham ~80% da logica. A unica diferenca e `e.clientX` vs `e.touches[0].clientX`.

**Solucao:** Extrair a logica comum para `_startDrag(x, y, roomEl)`, `_moveDrag(x, y)`, `_endDrag(x, y)` e chamar dos handlers de mouse/touch.

---

## 7. Render.updateMinimap: 3 blocos de "ocultar subsolo_masp" (~12 linhas salvas)

O check `roomId === 'subsolo_masp' && !GameState.visitedRooms.has(roomId)` com `canReveal` aparece **3 vezes** no updateMinimap (linhas 7604, 7627, 7679).

**Solucao:** Criar `isRoomVisible(roomId)` e usar nos 3 locais.

---

## Resumo

| Refatoracao | Linhas salvas | Risco |
|---|---|---|
| Unificar NPC/Ally attacks | ~80 | Medio |
| Extrair moveFollowingAllies | ~20 | Baixo |
| Extrair discoverItemsInRoom | ~10 | Baixo |
| Extrair damagePlayer | ~15 | Baixo |
| Extrair maybeAdvanceTime | ~15 | Baixo |
| Unificar mouse/touch minimap | ~60 | Medio |
| Extrair isRoomVisible | ~12 | Baixo |
| **Total** | **~212** | |

Arquivo final estimado: ~9.200 linhas (reducao de ~2.5%).

O ganho principal nao e em linhas, mas em **manutencao**: cada padrao repetido e um bug em potencial (corrigir em um lugar e esquecer nos outros). Com essas funcoes auxiliares, a logica fica centralizada.

