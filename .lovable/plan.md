

## "Alucinações da Paulista" — Sistema de Sanidade Mental

Quando a energia ou HP ficam muito baixos, o jogador começa a **alucinar**: o jogo mente para ele. Salas ganham descrições distorcidas, NPCs fantasmas aparecem e somem, itens falsos surgem no chão, e o log exibe mensagens que não são reais. Quanto pior o estado, mais o jogo te engana.

### Como funciona

**3 Níveis de Distorção** (baseado em HP + Energy combinados):

| Nível | Condição | Efeitos |
|-------|----------|---------|
| Leve | HP < 30% ou Energy < 20 | Descrições de sala ganham frases surreais aleatórias no final |
| Moderado | HP < 20% E Energy < 15 | NPCs fantasmas aparecem na sala (não interagíveis), itens falsos no chão |
| Severo | HP < 10% E Energy < 10 | Saídas falsas aparecem (levam a lugar nenhum), mensagens de log inventadas, nomes de NPCs trocados |

### Exemplos concretos

- **Sala distorcida**: "Você está no MASP. *As paredes parecem respirar. Tem certeza que o chão é sólido?*"
- **NPC fantasma**: "🌫️ Uma figura sombria chamada **Homem de Terno** te observa do canto." (não existe)
- **Item falso**: "Chave Dourada" aparece no inventário da sala, mas ao tentar pegar: "Você estica a mão... e ela atravessa o objeto. Era só uma miragem."
- **Saída falsa**: "Portão Secreto" aparece como opção de movimento, mas ao clicar: "Você caminha em direção ao portão... e bate numa parede. Não há portão algum."
- **Log mentiroso**: "🗡️ O Bombardeador te atacou! -15 HP" (não aconteceu de verdade)

### Alterações em `public/avenida-paulista.html`

**1. Novo namespace `Hallucinations`** (~80 linhas)
- `getLevel()` — calcula nível (0-3) baseado em HP% e Energy
- `distortRoomDescription(desc)` — adiciona frases surreais ao final
- `getPhantomNPCs(roomId)` — retorna 0-2 NPCs falsos para exibir
- `getPhantomItems(roomId)` — retorna 0-1 itens falsos
- `getPhantomExits()` — retorna 0-1 saídas falsas
- `maybeFakeLog()` — 15% chance de injetar mensagem falsa no log a cada turno
- `isHallucinating()` — boolean rápido

**2. Integração em `Events.advanceTime()`** — chamar `Hallucinations.maybeFakeLog()` no final do turno

**3. Integração no render de sala** — ao montar descrição/NPCs/itens/saídas da sala, passar pelo filtro de `Hallucinations` para injetar conteúdo falso

**4. Interceptar `Actions.pickItem`** — se item é fantasma, exibir mensagem de miragem em vez de pegar

**5. Interceptar movimento** — se saída é fantasma, exibir mensagem e não mover

**6. CSS** — classe `.hallucination-text` com leve ondulação/distorção visual (CSS `filter: blur(0.5px)` + animação sutil) para dar pista subliminar ao jogador atento

**7. Cura** — qualquer item de comida ou cura reduz o nível imediatamente. Mensagem: "🧠 Sua mente clareia... as sombras recuam."

### Escopo
- ~100-120 linhas JS + ~10 linhas CSS
- Tudo autocontido no HTML
- Não altera mecânicas existentes, apenas adiciona camada de ilusão sobre a UI
- Jogadores atentos podem perceber o padrão e aprender a desconfiar quando estão fracos

