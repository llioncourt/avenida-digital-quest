

# Plano: Correções Finais + Explosão com Modal

## Problemas Identificados

1. **Livro não está sumindo ao ser usado**: A função `Actions.useItem()` retorna `consumed: true` mas **ninguém processa esse campo** para remover o item do inventário
2. **Tela inicial não saiu**: Não existe mais uma "tela inicial" separada - mas o sistema está funcionando corretamente com o intro Star Wars. Preciso confirmar se o usuário quer remover alguma coisa específica
3. **Text crawl não começa do início**: O CSS atual usa `bottom: 0` e começa de baixo, mas a animação com `translateY(0)` não posiciona o texto abaixo da tela visível. O texto deveria começar **fora da tela** (abaixo) e subir
4. **Novo pedido**: Flash + modal de resumo quando bomba explodir

---

## Correções Técnicas

### 1. Livro Sumindo ao Ser Usado

**Problema**: A função `Actions.useItem()` retorna o resultado com `consumed: true`, mas esse campo não é processado para remover o item.

**Solução**: Modificar `Actions.useItem()` para processar o campo `consumed`:

```javascript
// Em Actions.useItem() - após linha 2781
useItem: function(itemId, targetItemId) {
  // ... código existente ...
  
  const result = handler(targetItemId);
  
  // NOVO: Se consumed for true, remover do inventário
  if (result.consumed) {
    const idx = GameState.playerInventory.indexOf(itemId);
    if (idx !== -1) {
      GameState.playerInventory.splice(idx, 1);
    }
  }
  
  result.advanceTime = result.success;
  return result;
}
```

### 2. Text Crawl Começando do Início (Fora da Tela)

**Problema**: O texto não começa fora da tela. Com `bottom: 0` e `transform: rotateX(45deg) translateY(0)`, o texto já está visível desde o início.

**Solução**: O texto deve começar **abaixo** da tela visível, e a animação deve movê-lo para cima:

```css
#intro-crawl {
  position: absolute;
  width: 90%;
  left: 5%;
  top: 100%; /* Começar ABAIXO da viewport */
  transform-style: preserve-3d;
  transform: rotateX(45deg);
  transform-origin: 50% 0%; /* Origem no topo do elemento */
  animation: star-wars-crawl 60s linear forwards;
  /* ... resto igual ... */
}

@keyframes star-wars-crawl {
  0% { 
    top: 100%; /* Começa fora (abaixo) */
    opacity: 1;
  }
  100% { 
    top: -200%; /* Vai para cima até sumir */
    opacity: 1;
  }
}
```

### 3. Explosão da Bomba: Flash + Modal de Resumo

**Localização**: `Events.processBombTimer()` (linhas 2907-2951)

**Alterações**:
1. Coletar informações de itens e personagens **antes** de destruí-los
2. Adicionar flash visual (usar `ScreenEffects.flash()` com cor laranja)
3. Mostrar modal com resumo do que havia na sala

```javascript
processBombTimer: function() {
  if (!GameState.armedBomb) return;
  
  GameState.armedBomb.turnsLeft--;
  
  if (GameState.armedBomb.turnsLeft > 0) {
    SoundSystem.playBombTick();
    Log.add(`⏱️ BOMBA: ${GameState.armedBomb.turnsLeft} turno(s)...`, 'warning');
    return;
  }
  
  // EXPLOSÃO!
  const bombLocation = GameState.armedBomb.location;
  const roomName = GameState.rooms[bombLocation].name;
  
  // NOVO: Coletar o que havia na sala ANTES de destruir
  const itemsInRoom = Object.values(GameState.items)
    .filter(item => item.location === bombLocation && !item.isDestroyed)
    .map(item => item.name);
  
  const charsInRoom = Object.values(GameState.characters)
    .filter(char => char.location === bombLocation && char.isAlive && char.id !== 'player')
    .map(char => char.name);
  
  const victims = [];
  
  // Matar todos...
  Object.values(GameState.characters).forEach(char => {
    if (char.location === bombLocation && char.isAlive) {
      char.hp = 0;
      char.isAlive = false;
      victims.push(char.name);
    }
  });
  
  // Destruir itens...
  Object.values(GameState.items).forEach(item => {
    if (item.location === bombLocation) {
      item.location = null;
      item.isDestroyed = true;
    }
  });
  
  GameState.armedBomb = null;
  
  // Som e FLASH
  SoundSystem.playExplosion();
  ScreenEffects.flash('rgba(255, 150, 50, 0.7)'); // Flash laranja
  
  // Log
  if (victims.length > 0) {
    Log.add(`💥 BOOM!!! Explosão em ${roomName}! Vítimas: ${victims.join(', ')}!`, 'danger');
  } else {
    Log.add(`💥 BOOM!!! Explosão em ${roomName}!`, 'danger');
  }
  
  // NOVO: Modal de resumo do que foi destruído
  if (itemsInRoom.length > 0 || charsInRoom.length > 0) {
    const itemsList = itemsInRoom.length > 0 
      ? `<p><strong>📦 Itens destruídos:</strong> ${itemsInRoom.join(', ')}</p>` 
      : '';
    const charsList = charsInRoom.length > 0 
      ? `<p><strong>👥 Personagens atingidos:</strong> ${charsInRoom.join(', ')}</p>` 
      : '';
    
    const content = `
      <p>A bomba explodiu em <strong>${roomName}</strong>!</p>
      ${itemsList}
      ${charsList}
      <button class="btn" onclick="Modals.hide()">Fechar</button>
    `;
    
    // Mostrar após um pequeno delay para o flash
    setTimeout(() => {
      Modals.show('💥 EXPLOSÃO!', content);
    }, 200);
  }
}
```

---

## Arquivo a Modificar

| Arquivo | Alterações |
|---------|------------|
| `public/avenida-paulista.html` | 3 correções |

---

## Ordem de Implementação

1. Corrigir `Actions.useItem()` para processar `consumed`
2. Corrigir CSS do text crawl para começar fora da tela
3. Modificar `Events.processBombTimer()` para flash + modal de resumo

