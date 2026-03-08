

## Refatoração Completa (Fases 1-4)

### ✅ Fase 1 — Bugs e segurança
- Fix `delay` não declarada em `showResult`
- Fix morte por asa delta sem `gameOver = true` + karma
- `@keyframes` duplicados removidos (screen-shake, bomb-pulse)
- `rain-fall` renomeado: `rain-fall-particle` e `rain-fall-overlay`
- Checagens defensivas `visitedRooms` removidas
- 13 propriedades não declaradas adicionadas ao GameState

### ✅ Fase 2 — Eliminação de duplicação
- `Actions._setPlayerLocation(roomId)` — centraliza localização
- `Rules.activateFollow(charId)` — centraliza follow com karma
- `MusicSystem` refatorado com `createMidiPlayer` como base

### ✅ Fase 3 — Organização
- `GAME_CONSTANTS` criado com ~25 constantes nomeadas
- Magic numbers substituídos em GameState, moveTo, advanceTime, processNPCMovement, Game.init
- Nota: reorganização de seções e var→const/let adiados (risco alto em arquivo monolítico)

### ✅ Fase 4 — Qualidade de vida
- `Actions.moveTo` quebrado em 3 subfunções: `_handleDeadlyJump`, `_checkMoveRestrictions`, `_processRoomEntry`
- JSDoc adicionado em 10 módulos: ScreenEffects, GlitchEffect, RandomEvents, SoundSystem, createMidiPlayer, GameState, Utils, Rules, Karma, Actions
