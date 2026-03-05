

# Correção: Lanterna + Subsolo do MASP

## Problema 1: Sala secreta inacessível

O minimapa esconde o `subsolo_masp` até ser visitado (linhas 7676, 7696, 7745), mas como o jogador se move apenas pelo minimapa, ele **nunca consegue clicar na sala** para visitá-la. É um paradoxo: precisa visitar para ver, mas precisa ver para visitar.

A lanterna deveria revelar a sala no minimapa quando o jogador está no MASP com lanterna + noite.

## Problema 2: Recompensa fraca

A Relíquia Paulistana dá +10 ATK e +10 DEF com peso 0 — que é bom, mas o jogador precisa lanterna + esperar até 20h. A recompensa pode ser melhorada para justificar o esforço.

## Solução

### A. Revelar subsolo no minimapa com lanterna

Nas 3 verificações de `subsolo_masp` no minimapa (linhas 7676, 7696, 7745), mudar a condição de "visitado" para "visitado **OU** (jogador está no MASP + tem lanterna + é noite)":

```javascript
// De:
if (roomId === 'subsolo_masp' && !GameState.visitedRooms.has(roomId)) return;

// Para:
if (roomId === 'subsolo_masp' && !GameState.visitedRooms.has(roomId)) {
  var canReveal = GameState.playerLocation === 'masp' 
    && GameState.playerInventory.includes('lanterna') 
    && GameState.time >= 20 * 60;
  if (!canReveal) return;
}
```

Aplicar nos 3 locais: conexões (7676), conexões de saída (7696) e salas (7745).

### B. Feedback visual no minimapa

Quando revelado pela lanterna (não visitado ainda), dar um efeito visual especial na sala no minimapa — um brilho pulsante dourado/misterioso para indicar que é secreta:

```javascript
// Após criar roomEl para subsolo_masp revelado mas não visitado
if (roomId === 'subsolo_masp' && !GameState.visitedRooms.has(roomId)) {
  roomEl.classList.add('secret-revealed');
}
```

CSS:
```css
.map-room.secret-revealed {
  animation: secret-pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(224, 160, 32, 0.6);
}
```

### C. Melhorar a Relíquia (opcional)

Adicionar um efeito extra à Relíquia: regenerar 1 HP por turno enquanto estiver no inventário. Isso dá uma vantagem passiva contínua que justifica a busca.

No `processNPCMovement` ou no ciclo de turno, adicionar:
```javascript
if (GameState.playerInventory.includes('reliquia') && player.hp < player.maxHp) {
  player.hp = Math.min(player.hp + 1, player.maxHp);
}
```

E atualizar a descrição da Relíquia para mencionar a regeneração.

## Resumo de mudanças

1. **3 condicionais** no minimapa para revelar subsolo com lanterna+noite (~9 linhas)
2. **CSS** para efeito visual de sala secreta revelada (~5 linhas)
3. **~3 linhas** para regeneração passiva da Relíquia + atualizar descrição

