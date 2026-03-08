

# Relatório de Refatoração: Avenida Paulista HTML Engine

## Resumo

O arquivo `avenida-paulista.html` possui **10.113 linhas** em um único arquivo monolítico. Apesar de funcional, o crescimento orgânico criou inconsistências, código duplicado e fragilidades. Abaixo está um relatório completo com os problemas encontrados e as correções propostas, organizados por prioridade.

---

## 1. BUGS E PROBLEMAS DE SEGURANÇA (Prioridade Crítica)

### 1.1 Variável `delay` não declarada em `showResult` (linha ~6806)
No `CombatModal.showResult`, `delay` é usada antes de ser definida na linha 6806 (`delay += 300`), mas a variável `delay` só é declarada na linha 6817. O `extraMessage` usa `delay` de escopo externo inexistente.

**Fix:** Mover a referência a `delay` para após a declaração ou declarar `var delay = 0` antes do bloco de `extraMessage`.

### 1.2 Morte na asa delta no céu não seta `gameOver = true`
Em `dropItem` (linha ~6200), quando o jogador larga a asa delta no céu, `player.hp = 0` e `player.isAlive = false`, mas `GameState.gameOver` não é setado como `true`. Isso é o mesmo padrão do bug da Antena que já corrigimos. O regen pode ressuscitar o jogador.

**Fix:** Adicionar `GameState.gameOver = true` na morte por soltar asa delta no ar.

### 1.3 `innerHTML` com strings geradas pelo usuário (XSS potencial)
Várias partes usam `innerHTML` com dados do jogo (nomes de itens, descrições). Embora os dados venham de constantes internas, o padrão é frágil para futuras extensões. Os modais de comércio (`VendorTrade`) usam interpolação de IDs em `onclick` handlers inline.

**Fix (futuro):** Usar `textContent` ou DOM APIs para dados dinâmicos. Para esta fase, catalogar como dívida técnica.

---

## 2. CÓDIGO DUPLICADO (Prioridade Alta)

### 2.1 `visitedRooms` inicializado em 3+ lugares
A checagem `if (!GameState.visitedRooms) GameState.visitedRooms = new Set()` aparece em pelo menos 3 locais: `moveTo` normal (linha 6079), salto com asa delta (linha 6021), e salto com guarda-chuva (linha 6010). `visitedRooms` já é inicializado em `Game.init()` (linha 9032).

**Fix:** Remover todas as checagens `if (!GameState.visitedRooms)` defensivas.

### 2.2 Lógica de salto da Antena triplicada (linhas 5975-6032)
O bloco `hasDeadlyJump` tem 3 caminhos (morte, guarda-chuva, asa delta) que cada um repete: setar localização, setar player.location, adicionar a visitedRooms, tocar som. Deveria ser extraído para um helper.

**Fix:** Criar uma função `Actions._setPlayerLocation(roomId)` que centraliza: `GameState.playerLocation = roomId; GameState.characters.player.location = roomId; GameState.visitedRooms.add(roomId); Journal.recordRoom(roomId);`.

### 2.3 Follow logic duplicada em 4 locais
A lógica `c.followingPlayer = true; c.followTurnsLeft = GameState.karma >= 30 ? 5 : ...` está repetida em: `moveTo` (linha 6131), `processNPCMovement` (linhas 7229 e 7305), e deveria ser uma única função.

**Fix:** Criar `Rules.activateFollow(charId)` que encapsula toda a lógica de follow.

### 2.4 MusicSystem e createMidiPlayer duplicam `playNote`
`MusicSystem.playNote` (linha 4935) e o `playNote` dentro de `createMidiPlayer` (linha 4795) são praticamente idênticos com parâmetros ligeiramente diferentes. O MusicSystem deveria ser instanciado com `createMidiPlayer` como os demais.

**Fix:** Refatorar `MusicSystem` para usar `createMidiPlayer` com config de loop/toggle.

---

## 3. INCONSISTÊNCIAS ESTRUTURAIS (Prioridade Média)

### 3.1 Mix de `const`/`var`/`let` e arrow functions vs function()
O código mistura livremente estilos ES5 (`var`, `function(){}`) com ES6 (`const`, `let`, `=>`). Exemplo: `RandomEvents` usa `function()`, enquanto `Actions` usa `=>`. Isso é inconsistente mas funcional.

**Fix:** Padronizar para ES6 (`const`/`let`, arrow functions) em todo o arquivo. Fazer em fases para evitar regressões.

### 3.2 `GameState` acumula propriedades não declaradas
Propriedades como `GameState.energy`, `GameState.craftMode`, `GameState.craftSelection`, `GameState.nightModeActive`, `GameState.fogActive`, `GameState.environmentTraps`, `GameState.roomTraps`, `GameState.skipNextTimeAdvance`, `GameState._explosionInProgress` não estão declaradas no objeto `GameState` original (linha 5077). São adicionadas ad-hoc em `Game.init()` ou durante o jogo.

**Fix:** Declarar TODAS as propriedades no objeto `GameState` original com valores default. Isso serve como documentação e previne erros.

### 3.3 `@keyframes screen-shake` definido 2 vezes
A animação `screen-shake` aparece nas linhas 333-341 e novamente nas linhas 1787-1798 com valores diferentes. O segundo sobrescreve o primeiro.

**Fix:** Remover a primeira definição (linhas 333-341).

### 3.4 `@keyframes bomb-pulse` definido 2 vezes
Aparece nas linhas 1115-1118 e novamente nas linhas 1978-1981 com valores diferentes.

**Fix:** Unificar, manter apenas uma versão.

### 3.5 `@keyframes rain-fall` definido 2 vezes
Linhas 649-651 (partículas) e 1752-1755 (overlay). A segunda sobrescreve a primeira, potencialmente quebrando as partículas de chuva.

**Fix:** Renomear uma delas (ex: `rain-fall-particle` vs `rain-fall-overlay`).

---

## 4. ORGANIZAÇÃO E MANUTENIBILIDADE (Prioridade Média)

### 4.1 Ordem dos módulos não é lógica
A ordem atual mistura dados, efeitos visuais, som, estado e lógica:
```text
DADOS → ScreenEffects → GlitchEffect → RandomEvents → SoundSystem → MIDI → GameState → Utils → NPC_PHRASES → Rules → Karma → ItemUseHandlers → Actions → CombatModal → Events → Log → Modals → Render → MinimapController → Game → Achievements → Journal → VendorTrade → WorldSanity → IntroSystem → Event Listeners
```

**Fix proposto:**
```text
1. DADOS (ROOMS, ITEMS, CHARACTERS, MAGIC_WORDS, RANDOM_EVENTS, CRAFTING_RECIPES, NPC_PHRASES)
2. UTILS
3. GAME STATE
4. SISTEMAS CORE (Rules, Karma, Events, Actions, WorldSanity)
5. SISTEMAS UI (Log, Modals, Render, CombatModal, BombIndicator)
6. SISTEMAS AUDIO (SoundSystem, MusicSystem, MIDI players)
7. SISTEMAS VISUAIS (ScreenEffects, GlitchEffect, AmbientParticles, RandomEvents visuals)
8. SISTEMAS DE CONTEÚDO (Journal, Achievements, VendorTrade, IntroSystem)
9. CONTROLLER (Game, MinimapController)
10. EVENT LISTENERS
```

### 4.2 Funções muito longas
- `Actions.moveTo`: ~180 linhas (linhas 5957-6141) — deveria ser dividida
- `Events.advanceTime`: ~100 linhas — muita lógica inline
- `Render.updateMinimap`: ~150 linhas — mistura lógica e DOM

### 4.3 Magic numbers espalhados
- `17 * 60` (hora inicial) aparece em vários lugares
- `20 * 60` e `21 * 60` (horários noturnos)
- `40` (cura do kit), `10` (dano do tropeço), `5` (dano da chuva)
- Todos deveriam ser constantes nomeadas em um bloco `GAME_CONSTANTS`.

---

## 5. PERFORMANCE (Prioridade Baixa)

### 5.1 `Object.values()` chamado repetidamente a cada turno
`processAutoCombat`, `processNPCMovement`, `advanceTime` todos fazem `Object.values(GameState.characters)` múltiplas vezes por turno. Com poucos NPCs isso é irrelevante, mas é um padrão ruim.

**Fix:** Cachear `Object.values(GameState.characters)` no início de `advanceTime`.

### 5.2 `WorldSanity.enforce()` roda a cada turno
Verifica todos os personagens e itens contra restrições de voo. Necessário como safety net, mas poderia ser otimizado para rodar apenas quando há mudanças de localização.

**Fix:** Manter como está (safety net), mas adicionar early-return se nenhuma mudança ocorreu.

---

## 6. PLANO DE EXECUÇÃO (Faseado)

### Fase 1 — Bugs e segurança (sem risco de regressão)
1. Fix `delay` não declarada em `showResult`
2. Fix morte por asa delta sem `gameOver = true`
3. Declarar todas as propriedades em `GameState`
4. Remover `@keyframes` e `visitedRooms` duplicados
5. Renomear `rain-fall` duplicado

### Fase 2 — Eliminação de duplicação
6. Criar `Actions._setPlayerLocation(roomId)` e usar na Antena e em `moveTo` normal
7. Criar `Rules.activateFollow(charId)`
8. Refatorar `MusicSystem` para reutilizar `createMidiPlayer`

### Fase 3 — Organização
9. Criar bloco `GAME_CONSTANTS` com magic numbers
10. Reorganizar seções do arquivo (mover blocos, sem alterar lógica)
11. Padronizar `const`/`let` (remover `var`)

### Fase 4 — Qualidade de vida
12. Quebrar `Actions.moveTo` em subfunções
13. Documentar cada módulo com JSDoc simples

---

## IMPORTANTE

Todas as alterações propostas são **idempotentes** — podem ser aplicadas independentemente sem quebrar funcionalidades existentes. Nenhuma funcionalidade será removida. A refatoração é conservadora e focada em corrigir bugs reais, eliminar duplicação, e preparar a base para novas features.

Recomendo executar as **Fases 1 e 2** agora (bugs + duplicação), e as Fases 3 e 4 em um momento separado.

