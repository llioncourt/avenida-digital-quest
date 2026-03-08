

# Sistema de Karma + Atacar Aliados/Neutros

## 1. Permitir atacar aliados e neutros (transformando-os em inimigos)

### Em `Actions.attack` (linha ~6269-6275)
Remover os bloqueios de aliados e neutros. Substituir por logica que transforma o alvo em inimigo antes de processar o combate:

```javascript
// Se alvo é aliado ou neutro, transforma em hostil
if (target.isAlly) {
  target.isAlly = false;
  target.followingPlayer = false;
  target.followTurnsLeft = 0;
  Log.add('😡 ' + target.name + ' se voltou contra você!', 'danger');
  Karma.change(-15, 'Atacou aliado ' + target.name);
}
if (target.isNeutral) {
  target.isNeutral = false;
  target.aggression = 0.8;
  Log.add('😡 ' + target.name + ' agora é seu inimigo!', 'danger');
  Karma.change(-20, 'Atacou neutro ' + target.name);
}
```

### Em `Modals.showCharacter` (linha ~8849)
Mostrar botao "Atacar" para todos (aliados e neutros tambem), nao apenas `!char.isAlly`. Para aliados/neutros, usar estilo de aviso (cor diferente) e label "⚠️ Atacar" para indicar consequencia.

## 2. Sistema de Karma

### A. Novo campo em GameState (linha ~5051)
Adicionar `karma: 0` ao GameState e ao reset em `Game.init`.

### B. Objeto `Karma` (~25 linhas, novo bloco)
- `change(amount, reason)`: clamp -100 a +100, log com emoji, atualiza UI
- `getTitle()`: retorna titulo baseado no valor (Santo/Heroi/Pragmatico/Mercenario/Vilao)
- `getEmoji()`: retorna emoji do alinhamento atual

### C. Pontos de karma (inserir chamadas nos locais existentes)

| Acao | Karma | Local |
|------|-------|-------|
| Atacar aliado | -15 | `Actions.attack` |
| Atacar neutro (vendedor) | -20 | `Actions.attack` |
| Matar inimigo | -5 | callback do attack (~6327) |
| Hipnotizar inimigo | +10 | `Actions.hipnodisco` (~5658) |
| Converter Demonio | +15 | `Actions.speak` (~6367) |
| Pacificar com Violao | +5/NPC | `Actions.violao` (~5756) |
| Conjunto Musical | +5/NPC | `Actions.conjunto_musical` (~5858) |
| Trocar com Vendedor | +3 | `VendorTrade.confirmTrade` |
| Craftar item | +2 | crafting callback |

### D. Badge de karma na interface
Adicionar ao painel de status (perto do HP) um indicador emoji + valor.

### E. Titulo no Game Over (linha ~8797)
Nova linha no `summaryStats` com o titulo moral do jogador.

### F. Efeitos gameplay
- **Vendedor** (em `VendorTrade.showStep1`): karma <= -20 = recusa trocar; karma >= 20 = item bonus
- **Aliados seguem**: karma >= 30 = 5 turnos; karma <= -30 = 1 turno (em `Rules.moveFollowingAllies` e ativacao de follow)

### G. Duas conquistas novas em `Achievements.definitions`
- "Karma+" (terminar com karma >= 50)
- "Vilao" (terminar com karma <= -50)

## Estimativa
~100 linhas novas + ~15 linhas modificadas.

