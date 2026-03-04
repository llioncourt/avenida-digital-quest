

## Plano: Corrigir aliados seguindo para sempre

### Problema

Quando os 3 turnos de follow acabam, o aliado ainda está na mesma sala que o jogador (acabou de segui-lo até lá). No próximo movimento, o código em `Actions.move` (linha ~5398) detecta um aliado na sala com `!c.followingPlayer` e reativa o follow imediatamente. Isso cria um loop infinito de follow.

### Correção

Adicionar um flag `followCooldown` que é setado quando o follow expira. Esse flag impede a reativação enquanto o aliado estiver na mesma sala. Só é limpo quando o aliado e o jogador estiverem em salas diferentes.

**1. Quando o follow expira** (linha ~5390 e qualquer outro local que sete `followingPlayer = false`):
```javascript
c.followingPlayer = false;
c.followCooldown = true; // impede reativação imediata
```

**2. Nas verificações de ativação do follow** (linhas ~5398 e ~6274), adicionar `!c.followCooldown`:
```javascript
if (c.id !== 'player' && c.isAlly && c.isAlive && c.location === roomId && !c.followingPlayer && !c.followCooldown) {
```

**3. Limpar o cooldown em `processNPCMovement`** quando o aliado não está na mesma sala que o jogador (antes do bloco de movimento, linha ~6226):
```javascript
if (char.isAlly && char.followCooldown && char.location !== GameState.playerLocation) {
  char.followCooldown = false;
}
```

Isso garante que o aliado só volta a seguir o jogador após ter se separado dele naturalmente (por movimento aleatório) e reencontrado depois.

