

## Tres Ajustes: Game Over, Golpes e Demonio

### 1. Botao "Jogar Novamente" so aparece apos a musica

O botao sera criado com `display: none` e um `setTimeout` vai mostra-lo apos `GameOverMusicSystem.duration` segundos (a duracao exata da MIDI). Isso cria um efeito cinematografico onde o jogador absorve o momento antes de poder reiniciar.

**Arquivo:** `public/avenida-paulista.html`
- Em `Modals.showGameOver()`, adicionar `style="display:none"` ao botao "Jogar Novamente"
- Adicionar um `setTimeout` que mostra o botao apos `GameOverMusicSystem.duration * 1000` ms

### 2. Remover prefixo "Golpe: " dos nomes de golpes

No modal de combate, onde aparece "Golpe: Garras Afiadas (20)", vai passar a mostrar apenas "Garras Afiadas (20)" — mais limpo e o icone ja indica se e ataque ou defesa.

**Arquivo:** `public/avenida-paulista.html`
- Linha do atacante: trocar `'⚔️ Golpe: ' + atk.moveName` por `'⚔️ ' + atk.moveName`
- Linha do defensor: trocar `'🛡️ Golpe: ' + def.moveName` por `'🛡️ ' + def.moveName`

### 3. Demonio convertido ataca a Bruxa

A logica de aliados ja permite atacar a Bruxa quando o escudo esta desativado. Porem, o Demonio pode vagar para outra sala (30% de chance por turno de mover). Para garantir que ele ataque a Bruxa:

- Impedir que o Demonio convertido saia da sala da Bruxa enquanto ela estiver viva (remover ele do sistema de movimentacao aleatoria quando `isAlly && bruxa.isAlive`)
- Aumentar a prioridade: quando o Demonio convertido esta na mesma sala da Bruxa e o escudo esta desativado, ele SEMPRE a ataca (ignora o check de `aggression` contra a Bruxa especificamente)

Isso garante que converter o Demonio tenha um impacto estrategico real no combate contra a Bruxa.

### Resumo tecnico das alteracoes

Todas em `public/avenida-paulista.html`:

1. `Modals.showGameOver` -- botao com `display:none` + `setTimeout` para revelar
2. `CombatModal` render -- remover string "Golpe: " das duas linhas (ataque e defesa)
3. `Rules.processMovement` -- skip do Demonio convertido enquanto Bruxa vive
4. `Rules.processAllyAttacks` -- Demonio convertido ignora `aggression` ao atacar a Bruxa
