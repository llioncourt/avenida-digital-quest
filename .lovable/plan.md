

# Plano: Implementar 8 Sistemas de Jogo

## Resumo

Implementar os 8 sistemas propostos no arquivo `public/avenida-paulista.html`: Conquistas, Sala Secreta, Fome/Energia, Vendedor Ambulante, Clima Mecanico, Armadilhas Ambientais, Modo Noturno e Diario.

---

## 1. Sistema de Conquistas (Achievements)

- Criar objeto `Achievements` com lista de conquistas e verificacao automatica
- Conquistas: Pacifista, Speedrunner, Colecionador, Diplomata, Sobrevivente, Explorador (visitou todas as salas)
- Salvar em `localStorage` (`avp_achievements`)
- Verificar conquistas em `showGameOver` e exibir medalhas douradas/cinzas no modal de vitoria
- Botao na tela inicial para ver conquistas ja obtidas

## 2. Sala Secreta — Subsolo do MASP

- Adicionar sala `subsolo_masp` em `ROOMS_DATA` com conexao bidirecional ao `masp`
- Condicao de acesso: ter `lanterna` no inventario E `GameState.time >= 20*60`
- Item unico: `reliquia` (ataque +10, defesa +10, peso 0)
- Em `Actions.moveTo`, checar condicoes ao tentar entrar; se nao atender, mensagem de dica
- Adicionar a sala e item nos dados iniciais

## 3. Sistema de Fome / Energia

- Adicionar `GameState.energy = 100` no init
- Em `Events.advanceTime`, decrementar 2 por turno; se 0, -3 HP com mensagem
- 3 novos itens consumiveis: `coxinha` (+30), `acai` (+50), `pastel` (+20) — todos `isUsable: true, singleUse: true`
- Em `Actions.useItem`, tratar recuperacao de energia
- Exibir barra de energia no HUD (ao lado do HP)
- Adicionar no `Render.updateStats`

## 4. NPC Vendedor Ambulante

- Novo personagem `vendedor` em `CHARACTERS_DATA`: neutro (`isAlly: false`), nao atacavel (`isNeutral: true`), se move aleatoriamente
- Flag `isNeutral` verificada em `processNPCAttacks` (nao ataca) e `Actions.attack` (nao pode ser atacado)
- Em `updateLocation`, quando vendedor esta na sala, mostrar botao "Trocar Item"
- Modal de troca: jogador escolhe item seu, recebe item aleatorio do vendedor (pool de itens basicos)
- Vendedor carrega 3 itens aleatorios do pool; troca 1:1

## 5. Clima com Efeitos Mecanicos

Alterar `gameEffect` dos eventos existentes e processar em `RandomEvents.startEvent` / no loop de `Events.advanceTime`:

- **Neblina (`fog`)**: NPCs inimigos nao aparecem no minimapa (flag `GameState.fogActive`); checar no `updateMinimap`
- **Vento (`wind_howl`)**: Se jogador tem `asa_delta`, 20% chance de ser empurrado para sala adjacente aleatoria
- **Terremoto (`earthquake`)**: 20% chance de derrubar 1 item aleatorio do inventario na sala atual
- **Sussurros (`whispers`)**: Revela localizacao da Bruxa no log ("Os sussurros apontam para...")

## 6. Armadilhas Ambientais

- Em `Game.init`/`setupPositions`, sortear 3 salas com armadilhas: `pisoQuebrado` (tunel, -10 HP 25%), `fioTropeco` (rua_augusta, derruba item), `gasResidual` (shopping, -5 HP sem mascara)
- Armazenar em `GameState.environmentTraps = { roomId: { type, triggered: false } }`
- Em `Actions.moveTo`, ao entrar em sala com armadilha nao-triggered, aplicar efeito e marcar `triggered: true`
- Mensagem tematica para cada tipo

## 7. Modo Noturno Progressivo

- Em `Events.advanceTime`, apos 21:00:
  - Bruxa ganha +2 ataque por hora apos 21:00
  - Inimigos ganham +0.05 aggression por hora
- Sem lanterna apos 21:00: 15% chance de tropecao (-5 HP) ao mover
- Alterar CSS theme: adicionar classe `theme-night` ao container quando `time >= 21*60`

## 8. Diario do Jogador (Journal)

- Objeto `Journal` com categorias: Salas, NPCs, Itens, Lore
- Registrar automaticamente primeira visita a sala, primeiro encontro com NPC, primeiro uso de item especial
- Adicionar fragmentos de lore em salas especificas (cinema, livraria, masp, etc.)
- Botao "Diario" na UI (proximo ao minimapa) que abre modal com abas
- Persistir em `localStorage` (`avp_journal`)

---

## Detalhes Tecnicos

**Novos dados:**
- 1 sala nova (`subsolo_masp`) em `ROOMS_DATA`
- 4 itens novos (`reliquia`, `coxinha`, `acai`, `pastel`) em `ITEMS_DATA`
- 1 personagem novo (`vendedor`) em `CHARACTERS_DATA`
- CSS para barra de energia, theme-night, botao diario

**Pontos de integracao:**
- `Events.advanceTime`: energia, noturno, clima mecanico
- `Actions.moveTo`: armadilhas, sala secreta, tropecao noturno, vento
- `Render.updateMinimap`: neblina esconde NPCs
- `Render.updateStats`: barra de energia
- `Render.updateLocation`: botao vendedor
- `Modals.showGameOver`: conquistas
- `RandomEvents.startEvent/endEvent`: flags de clima ativo
- `Game.init`: reset de todos os novos estados

**Estimativa:** ~400-500 linhas de codigo novo distribuidas pelo arquivo.

