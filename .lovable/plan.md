

# Refatoracao Adicional do `avenida-paulista.html`

## Bug Critico (deve ser corrigido primeiro)

Existem 2 referencias a `GameUI.updateScrollIndicators()` (linhas 7277 e 9417), mas `GameUI` nao existe — a funcao esta em `Render.updateScrollIndicators()`. Isso causa `ReferenceError` que trava o jogo. Correcao: trocar `GameUI` por `Render` nos 2 locais.

---

## Refatoracoes

### 1. Extrair `Rules.damagePlayer(amount)`

O padrao `player.hp -= X; if (player.hp <= 0) { player.hp = 0; player.isAlive = false; }` aparece em **7 locais** (tropeco noturno L5778, armadilha L5814, gas residual L5833, chuva L6636, exaustao L6645, tropeco noturno2 L6675, callback NPC L7130).

Criar funcao centralizada e substituir nos 7 locais. Cada local perde ~3 linhas do check duplicado.

**Linhas salvas:** ~18

---

### 2. Extrair `Rules.discoverItemsInRoom()`

O bloco identico de 4 linhas aparece em **3 locais** (L8433, L8559, L8591):
```javascript
Object.values(GameState.items).forEach(function(item) {
  if (item.location === GameState.playerLocation && !item.isDestroyed && !item.isAnimated) {
    GameState.discoveredItems.add(item.id);
  }
});
```

Criar funcao e substituir por chamada de 1 linha nos 3 locais.

**Linhas salvas:** ~8

---

### 3. Extrair `Rules.moveFollowingAllies(roomId)`

O bloco identico de 8 linhas aparece em **2 locais** (L5590 e L5845):
```javascript
Object.values(GameState.characters).forEach(function(c) {
  if (c.id !== 'player' && c.isAlly && c.followingPlayer && c.followTurnsLeft > 0) {
    c.location = roomId;
    c.followTurnsLeft--;
    if (c.followTurnsLeft <= 0) { ... }
  }
});
```

Criar funcao e substituir por chamada de 1 linha nos 2 locais.

**Linhas salvas:** ~8

---

### 4. Extrair `Events.maybeAdvanceTime()`

O bloco identico de 5 linhas aparece em **2 locais** em `processAction` (L8551 e L8574):
```javascript
if (GameState.skipNextTimeAdvance) {
  GameState.skipNextTimeAdvance = false;
  Log.add('☕ O efeito do CAFÉ fez o tempo não avançar!', 'success');
} else { Events.advanceTime(); }
```

**Linhas salvas:** ~5

---

### 5. Extrair `Render.isRoomVisible(roomId)`

O check de visibilidade do `subsolo_masp` aparece em **4 locais** no minimap (L7604, L7627, L7679, L7701), cada um com 3 linhas identicas verificando `visitedRooms`, `playerLocation === 'masp'`, `nightVision`, e `time >= 20*60`.

**Linhas salvas:** ~12

---

### 6. Unificar mouse/touch no MinimapController

`handleMouseDown` (L7909-7931, 23 linhas) e `handleTouchStart` single-touch (L8055-8076, 22 linhas) compartilham ~80% da logica. Idem para `handleMouseMove`/`handleTouchMove` (pan+node drag) e `handleMouseUp`/`handleTouchEnd` (click detection + cleanup).

Extrair `_startDrag(x, y, roomEl)`, `_moveDrag(x, y)`, `_endDrag(x, y, threshold)` como funcoes internas. Os handlers ficam como wrappers que extraem coordenadas. Touch mantem logica extra de pinch zoom.

**Linhas salvas:** ~55

---

### 7. Unificar `processNPCAttacks` + `processAllyAttacks`

`processNPCAttacks` (L7056-7143, 88 linhas) e `processAllyAttacks` (L7146-7247, 102 linhas) compartilham a estrutura: iterar chars, filtrar, escolher golpe, calcular dano, montar attackerData/defenderData/combatResult, enqueue no CombatModal.

Criar `processAutoCombat()` com dois modos (NPC→player e ally→enemy). As diferencas (gas mask check, ally prioriza bruxa, ally sem modal quando fora da sala) ficam como branches dentro da funcao unificada.

**Linhas salvas:** ~75

---

## Resumo

```text
┌──────────────────────────────────┬───────────────┬────────┐
│ Mudanca                          │ Linhas salvas │ Risco  │
├──────────────────────────────────┼───────────────┼────────┤
│ Fix GameUI → Render (bug)        │       0       │ Zero   │
│ Rules.damagePlayer()             │     ~18       │ Baixo  │
│ Rules.discoverItemsInRoom()      │      ~8       │ Baixo  │
│ Rules.moveFollowingAllies()      │      ~8       │ Baixo  │
│ Events.maybeAdvanceTime()        │      ~5       │ Baixo  │
│ Render.isRoomVisible()           │     ~12       │ Baixo  │
│ Unificar mouse/touch minimap     │     ~55       │ Medio  │
│ Unificar NPC/Ally attacks        │     ~75       │ Medio  │
├──────────────────────────────────┼───────────────┼────────┤
│ TOTAL                            │    ~181       │        │
└──────────────────────────────────┴───────────────┴────────┘
```

Arquivo atual: **~9.429 linhas** → Estimado apos: **~9.248 linhas** (reducao de ~2%).

O ganho principal e em **manutencao**: cada padrao duplicado e um bug em potencial. Com funcoes centralizadas, correcoes futuras precisam ser feitas em 1 lugar so.

## O que NAO muda

- CSS, HTML, estrutura visual
- Sistemas de musica (ja refatorados)
- Dados de itens/personagens
- Combate modal, crafting, trade, achievements
- Comportamento do jogo — zero mudanca funcional

## Ordem de implementacao

1. Fix `GameUI` (critico — destravar o jogo)
2. Helpers simples de baixo risco: `damagePlayer`, `discoverItemsInRoom`, `moveFollowingAllies`, `maybeAdvanceTime`, `isRoomVisible`
3. Unificar mouse/touch no minimap
4. Unificar combat processing

