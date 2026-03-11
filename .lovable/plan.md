

### ✅ Fase 11 — Glassmorphism expandido + Controle de transparência

- Glassmorphism aplicado em: `#modal`, `.inventory-item`, `.combat-card`
- `GlassControl.set()` atualiza todos os elementos dinamicamente
- Slider padrão em 0 (totalmente opaco); usuário ajusta em tempo real
- Cobre modals de personagem, item, combate e itens do inventário


### ✅ Fase 10 — Sala Pai/Filha + Modal de Explosão Cinematográfico + Room Backgrounds

- `childRooms` / `parentRoom` nas definições de sala (MASP→Teto/Subsolo, Colégio→Antena)
- Explosão no pai propaga para filhas (affectedRooms array)
- `Modals.showExplosion(roomId, title, content)` com imagem de fundo, shake, glow
- `.room-bg` no `#location-panel` com opacity 0.15, nomenclatura `rooms/{roomId}.webp`

### ✅ Fase 9 — Fix MP3 + MIDI tocando juntas

- `_mp3AudioElements` Map pré-cria Audio elements no `preloadAll()` (síncrono)
- `start()` tornado síncrono: usa Audio pré-criado em vez de `await Mp3Cache.load()`
- `originalStop()` chamado antes de `audio.play()` para parar MIDI
- Fallback: listener `{ once: true }` no click retenta preload se Map vazio
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

### ✅ Fase 5 — Sistema Híbrido MP3 + MIDI com Cache Offline

- Objeto `MP3_TRACKS` mapeando estados → URLs locais:
  - `exploration: 'AVP Theme.mp3'`
  - `gameover: 'AVP Game Over.mp3'`
  - `combat`, `defeat`, `victory`: placeholders vazios
- Cache API (`caches.open('avp-music-v1')`) para persistir MP3s offline após primeiro carregamento
- Wrapper `_addMp3Layer` em cada player MIDI — sobrescreve `start()`/`stop()`:
  - MP3 disponível (cache ou rede) → toca via `<audio>`
  - Sem MP3 → fallback automático para MIDI
- Integração de volume com `musicGain` existente (sliders continuam funcionando)
- Tudo autocontido no HTML

### ✅ Fase 6 — Alucinações da Paulista (Sistema de Sanidade Mental)

- Namespace `Hallucinations` com ~160 linhas
- 3 níveis baseados em HP% + Energy: Leve (1), Moderado (2), Severo (3)
- Nível 1: frases surreais na descrição da sala + CSS wobble/blur
- Nível 2: NPCs fantasmas + itens fantasmas (não interagíveis)
- Nível 3: saídas falsas + log mentiroso (15% chance por turno)
- Interceptação em pickupItem, moveTo, showCharacter para phantoms
- Cura: notificação ao usar item de cura/comida que reduza o nível
- Invalidação de renderSig inclui nível de alucinação
- CSS: `.hallucination-text`, `.phantom-item`, `.phantom-npc`, `@keyframes hallucinate-wobble`

### ✅ Fase 7 — Buff do Café Paulistano

- Substituído `skipNextTimeAdvance` por `caffeinatedTurns` (3 turnos)
- Efeitos do estado "Cafeinado":
  - ⏳ Tempo congelado por 3 turnos
  - ⚡ +20 energia imediata
  - 🗡️ +2 ataque temporário (em `Rules.getPlayerAttackPower`)
  - 🧠 Anti-alucinação (bloqueia `Hallucinations.getLevel()`)
- Mensagens de feedback a cada turno e ao expirar
- Energético Paulista também ativa 1 turno de cafeína

### ✅ Fase 8 — Portrait com Degradê Full-Card

- `.combat-portrait` agora `position: absolute; inset: 0` cobrindo o card inteiro
- `mask-image` com gradiente (0.45→0.15→transparent) dissolve a imagem suavemente
- Conteúdo do card usa `z-index: 1` via seletor `> *:not(.combat-portrait)`
- Placeholder agora é gradiente sutil sem texto/ícone
- Animação `portrait-reveal` com scale 1.08→1 para efeito cinematográfico
