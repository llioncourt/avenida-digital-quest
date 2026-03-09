

## Café Paulistano — De Inútil a Essencial

### Problema atual
O Café só pula **1 avanço de tempo** (5 minutos in-game). Isso é quase imperceptível — o jogador nem sente o efeito.

### Solução: Buff multi-efeito temporário (3 turnos)

Ao tomar o Café, o jogador ganha um **estado "Cafeinado"** que dura **3 turnos** com os seguintes efeitos:

| Efeito | Descrição |
|--------|-----------|
| ⏳ Tempo congelado | Nenhuma ação avança o relógio por 3 turnos |
| ⚡ Energia +20 | Restaura 20 de energia imediatamente |
| 🗡️ Ataque +2 | Bônus de ataque temporário durante o efeito |
| 🏃 Sem custo de movimento | Mover entre salas não gasta energia |
| 🧠 Anti-alucinação | Bloqueia alucinações durante o efeito |

### Alterações em `public/avenida-paulista.html`

**1. GameState** — adicionar `caffeinatedTurns: 0` ao estado inicial

**2. Item use `cafe`** — em vez de só `skipNextTimeAdvance = true`:
- Setar `GameState.caffeinatedTurns = 3`
- Restaurar +20 energia
- Flash dourado + mensagem épica

**3. `Events.maybeAdvanceTime()`** — verificar `caffeinatedTurns > 0`: se sim, decrementar e pular o avanço de tempo (em vez do boolean one-shot atual)

**4. `moveTo`** — se cafeinado, não gastar energia no movimento

**5. Combate** — se cafeinado, aplicar +2 ataque temporário no cálculo

**6. `Hallucinations.getLevel()`** — retornar 0 se cafeinado

**7. Notificações** — mensagem a cada turno: "☕ Cafeína: X turnos restantes" e ao acabar: "☕ O efeito do café passou... você sente o cansaço voltar."

**8. Remover** o campo `skipNextTimeAdvance` que fica obsoleto (substituído por `caffeinatedTurns`)

### Escopo
- ~30 linhas de JS alteradas/adicionadas
- Tudo autocontido no HTML
- O item continua single-use, mas agora vale a pena usá-lo estrategicamente

