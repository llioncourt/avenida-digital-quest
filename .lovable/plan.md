

# Bug: Bomba nao mata jogador e modal de explosao nao aparece

## Causa Raiz

Quando a bomba explode com o jogador na sala, o `checkGameOver()` mostra o modal de game over, mas logo depois (200ms) o `processBombTimer` chama `Modals.show()` com o resumo da explosao, sobrescrevendo o modal de game over. Resultado: nenhum modal fica visivel.

## Correcao

**Arquivo**: `public/avenida-paulista.html`

### A. Modal de explosao com botao "Continuar"

O modal de resumo da explosao sempre aparece primeiro, com um botao "Continuar". Quando o jogador clica:
- Se ele morreu na explosao: fecha o modal de resumo e mostra o modal de game over
- Se ele sobreviveu: simplesmente fecha o modal

### B. Mensagem de morte no modal

Quando o jogador esta na sala da bomba, o modal inclui uma mensagem destacada:

```
💀 VOCE FOI ATINGIDO PELA EXPLOSAO!
```

### C. Sequencia corrigida no processBombTimer

```javascript
// 1. Processar destruicao (itens, personagens, dano ao jogador)
// ... logica existente ...

// 2. Transformar sala em ruina
const room = GameState.rooms[bombLocation];
if (room.ruinName) {
  room.name = room.ruinName;
  room.description = room.ruinDescription;
  room.isRuined = true;
}

// 3. Montar conteudo do modal
let content = '...lista de vitimas e itens...';
if (playerInRoom) {
  content = '<p style="color:#ff4444;font-size:1.2rem;font-weight:bold;">💀 VOCÊ FOI ATINGIDO PELA EXPLOSÃO!</p>' + content;
}

// 4. Adicionar botao "Continuar" ao conteudo
const playerDied = playerInRoom && !GameState.characters.player.isAlive;
content += '<button class="modal-btn" onclick="Game.closeExplosionModal(' + playerDied + ')">Continuar</button>';

// 5. Mostrar modal de resumo (sem fechar automaticamente)
Modals.show('💥 EXPLOSÃO!', content);
```

### D. Nova funcao Game.closeExplosionModal

```javascript
closeExplosionModal: function(playerDied) {
  Modals.hide();
  if (playerDied) {
    Game.checkGameOver();
  }
}
```

### E. Nao chamar checkGameOver automaticamente durante a explosao

Adiar/impedir o checkGameOver que roda automaticamente apos o dano da bomba, para que o modal de resumo da explosao apareca primeiro e o jogador tenha controle sobre quando prosseguir.

### Resultado
- Jogador na sala da bomba: ve o modal "EXPLOSAO!" com mensagem de morte, vitimas e itens. Clica "Continuar" e ve o modal de game over
- Jogador fora da sala: ve o modal de resumo com vitimas e itens. Clica "Continuar" e segue jogando
- Sem timers, sem corrida de modais -- o jogador controla o ritmo

