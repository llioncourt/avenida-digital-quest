

## Plano: Italico no Combate + Log de Saida de NPCs + Aliados Seguem o Jogador

### 1. Italico na janela de combate

**Problema:** O modal de combate usa `div.textContent = line.text` (linhas ~5794, 5807, 5948), que renderiza tudo como texto puro. O `*texto*` nunca vira `<em>`.

**Correcao:** Trocar `textContent` por `innerHTML` com a mesma regex ja usada no Log:

```javascript
div.innerHTML = line.text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
```

Aplicar em 3 locais dentro de `CombatModal`:
- Linha ~5794: linhas do atacante
- Linha ~5807: linhas do defensor
- Linha ~5948: linhas de resultado

### 2. Log quando NPC sai da sala do jogador

**Problema:** Quando um NPC esta na mesma sala que o jogador e se move para outro lugar, nao ha mensagem no log.

**Correcao:** Em `processNPCMovement` (linha ~6223), apos `char.location = Utils.randomChoice(validExits)`, adicionar verificacao: se `prevLocation === GameState.playerLocation` e `char.location !== GameState.playerLocation`, logar para onde o NPC foi.

```javascript
// NPC sai da sala do jogador
if (prevLocation === GameState.playerLocation && char.location !== GameState.playerLocation) {
  var destRoom = GameState.rooms[char.location];
  var icon = char.isAlly ? '🤝' : '⚔️';
  Log.add(icon + ' ' + char.name + ' foi para ' + destRoom.name + '.', 'info');
}
```

Inserir logo apos a linha `char.location = Utils.randomChoice(validExits)` (linha ~6225), antes do bloco de frases de movimento.

### 3. Aliados seguem o jogador temporariamente

**Mecanica:** Quando o jogador encontra um aliado (entra na mesma sala ou o aliado entra na sala do jogador), o aliado entra em modo "seguindo" por 3 turnos. Durante esse periodo, quando o jogador se move, o aliado se move junto. Apos os 3 turnos, o aliado volta ao comportamento normal de movimento aleatorio.

**Implementacao:**

**3A.** Adicionar campo `followingPlayer` e `followTurnsLeft` ao estado dos aliados. Nao precisa ser nos dados iniciais — setar dinamicamente.

**3B.** Em `processNPCMovement`, quando o NPC encontra o jogador (ja tem o bloco na linha ~6236) ou quando o jogador entra numa sala com aliado: ativar o modo seguir.

```javascript
// Ativar follow quando aliado encontra o jogador
if (char.isAlly && char.location === GameState.playerLocation) {
  if (!char.followingPlayer) {
    char.followingPlayer = true;
    char.followTurnsLeft = 3;
    Log.add('🤝 ' + char.name + ' decide te acompanhar por um tempo!', 'info');
  }
}
```

**3C.** Em `processNPCMovement`, aliados em modo "seguindo" nao se movem aleatoriamente — eles ficam parados (o movimento deles sera tratado quando o jogador se move).

```javascript
// Aliado seguindo o jogador não se move sozinho
if (char.isAlly && char.followingPlayer && char.followTurnsLeft > 0) return;
```

**3D.** Em `Actions.move` (quando o jogador se move), mover aliados que estao seguindo junto:

```javascript
// Mover aliados que estão seguindo
Object.values(GameState.characters).forEach(function(c) {
  if (c.id !== 'player' && c.isAlly && c.followingPlayer && c.followTurnsLeft > 0) {
    c.location = roomId; // mesma sala que o jogador
    c.followTurnsLeft--;
    if (c.followTurnsLeft <= 0) {
      c.followingPlayer = false;
      Log.add('🤝 ' + c.name + ' decide seguir seu próprio caminho.', 'info');
    }
  }
});
```

**3E.** Tambem ativar o follow quando o jogador entra numa sala com aliado (em `Actions.move`, apos mudar `GameState.playerLocation`):

```javascript
// Verificar aliados na nova sala
Object.values(GameState.characters).forEach(function(c) {
  if (c.id !== 'player' && c.isAlly && c.isAlive && c.location === roomId && !c.followingPlayer) {
    c.followingPlayer = true;
    c.followTurnsLeft = 3;
    Log.add('🤝 ' + c.name + ' decide te acompanhar por um tempo!', 'info');
  }
});
```

### Resumo

1. **3 linhas** trocando `textContent` por `innerHTML` com regex no CombatModal
2. **~5 linhas** adicionando log de saida de NPC da sala do jogador em `processNPCMovement`
3. **~25 linhas** implementando sistema de aliado seguir jogador temporariamente (3 turnos) em `processNPCMovement` e `Actions.move`

