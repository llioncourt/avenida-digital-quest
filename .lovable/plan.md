
# Plano: Correção de Bugs Críticos (Validação Completa)

## Bugs Identificados na Análise

| # | Bug | Gravidade | Causa Raiz |
|---|-----|-----------|------------|
| 1 | Text crawl não "entra" (sem efeito 3D) | Média | Animação de `top` não preserva o `transform` durante a transição |
| 2 | Bombardeador colocando bomba no Céu | Alta | Personagens iniciando em salas que requerem voo |
| 3 | Itens iniciando no Céu da Cidade | Alta | `availableRooms` não filtra salas especiais |
| 4 | Largar Asa Delta no céu não mata o jogador | Alta | `dropItem()` não verifica morte por queda |
| 5 | Personagens sem voo iniciando no Céu | Alta | `setupPositions()` não respeita `canFly` |

---

## Correções Técnicas

### 1. Corrigir Efeito 3D do Text Crawl

O problema é que animar `top` não preserva a perspectiva 3D. Precisamos:
- Usar `translateY` dentro do `transform` na animação
- Configurar o container com perspective correta

```css
#intro-container {
  position: fixed;
  inset: 0;
  background: black;
  z-index: 10000;
  overflow: hidden;
  perspective: 300px;
  perspective-origin: 50% 100%;
}

#intro-crawl {
  position: absolute;
  width: 90%;
  left: 5%;
  bottom: 0;
  transform-style: preserve-3d;
  transform: rotateX(25deg) translateY(100%);
  transform-origin: 50% 100%;
  animation: star-wars-crawl 60s linear forwards;
  text-align: center;
  color: var(--accent-gold);
  font-size: 1.8rem;
  line-height: 1.8;
}

@keyframes star-wars-crawl {
  0% { 
    transform: rotateX(25deg) translateY(100%);
    opacity: 1;
  }
  100% { 
    transform: rotateX(25deg) translateY(-300%);
    opacity: 1;
  }
}
```

### 2. Filtrar Salas na Inicialização (Itens e Personagens)

No `setupPositions()`, criar duas listas:
- `groundRooms`: salas que NÃO requerem voo
- `allRooms`: todas as salas (para personagens que voam)

```javascript
setupPositions: function() {
  // Salas que não requerem voo (para itens e personagens terrestres)
  const groundRooms = Object.keys(GameState.rooms).filter(r => 
    r !== 'teto_masp' && 
    GameState.rooms[r].requiresFlight !== true
  );
  
  // Posições fixas
  GameState.characters.player.location = 'masp';
  GameState.playerLocation = 'masp';
  GameState.characters.bruxa.location = 'teto_masp';
  GameState.characters.feiticeiro.location = 'tunel';
  GameState.characters.demonio.location = null;
  GameState.characters.demonio.isSummoned = false;
  
  // LIVRO sempre na LIVRARIA
  GameState.items.livro.location = 'livraria';
  
  // Randomizar personagens respeitando canFly
  ['aguia', 'bombardeador', 'coruja', 'cachorro'].forEach(charId => {
    const char = GameState.characters[charId];
    // Se pode voar, pode ir em qualquer sala; se não, só groundRooms
    const validRooms = char.canFly ? Object.keys(GameState.rooms).filter(r => r !== 'teto_masp') : groundRooms;
    char.location = Utils.randomChoice(validRooms);
  });
  
  // Randomizar itens (SEMPRE em groundRooms - itens não voam!)
  const itemsToPlace = Object.keys(GameState.items).filter(i => i !== 'livro' && i !== 'bomba');
  itemsToPlace.forEach(itemId => {
    GameState.items[itemId].location = Utils.randomChoice(groundRooms);
  });
  
  // Bomba começa sem localização
  GameState.items.bomba.location = null;
  GameState.items.bomba.isDestroyed = false;
}
```

### 3. Morte ao Largar Asa Delta no Céu

No `dropItem()`, adicionar verificação especial:

```javascript
dropItem: function(itemId) {
  if (GameState.gameOver) return { success: false, message: 'O jogo acabou!' };
  
  const idx = GameState.playerInventory.indexOf(itemId);
  if (idx === -1) {
    return { success: false, message: 'Você não tem este item!' };
  }
  
  const room = GameState.rooms[GameState.playerLocation];
  const item = GameState.items[itemId];
  
  // MORTE: Largar asa delta enquanto está voando no céu!
  if (itemId === 'asa_delta' && room.requiresFlight) {
    GameState.playerInventory.splice(idx, 1);
    item.location = null; // Asa delta também cai
    
    // Jogador morre!
    const player = GameState.characters.player;
    player.hp = 0;
    player.isAlive = false;
    
    return {
      success: true,
      message: 'Você solta a ASA DELTA... e imediatamente começa a cair! Sem nada para te sustentar, você despenca até o chão. VOCÊ MORREU!',
      advanceTime: true
    };
  }
  
  // Se a sala não permite itens, o item é destruído!
  if (room.mayHaveItems === false) {
    GameState.playerInventory.splice(idx, 1);
    item.location = null;
    return {
      success: true,
      message: `Você solta ${item.name}... e ele despenca do céu! O item foi destruído ao atingir o solo lá embaixo!`,
      advanceTime: true
    };
  }
  
  GameState.playerInventory.splice(idx, 1);
  item.location = GameState.playerLocation;
  
  return {
    success: true,
    message: `Você largou ${item.name}.`,
    advanceTime: true
  };
}
```

### 4. Bombardeador Não Pode Armar Bomba em Sala que Requer Voo

Adicionar verificação em `processBombardeadorBombs()`:

```javascript
processBombardeadorBombs: function() {
  const bombardeador = GameState.characters.bombardeador;
  if (!bombardeador.isAlive || bombardeador.isAlly) return;
  if (!bombardeador.canCreateBombs) return;
  
  // Não armar bomba se estiver em sala que requer voo (bug safety)
  const currentRoom = GameState.rooms[bombardeador.location];
  if (currentRoom && currentRoom.requiresFlight) return;
  
  // ... resto do código igual ...
}
```

---

## Arquivo a Modificar

| Arquivo | Alterações |
|---------|------------|
| `public/avenida-paulista.html` | 4 correções |

---

## Ordem de Implementação

1. Corrigir `setupPositions()` - filtrar salas por `requiresFlight` e `canFly`
2. Corrigir `dropItem()` - morte ao largar asa delta no céu
3. Corrigir `processBombardeadorBombs()` - verificação de segurança
4. Corrigir CSS do text crawl - usar `translateY` na animação com perspectiva

---

## Validação Pós-Implementação

Após as correções, verificar:
- [ ] Itens NUNCA aparecem no Céu da Cidade no início
- [ ] Bombardeador e Cachorro NUNCA aparecem no Céu da Cidade
- [ ] Águia e Coruja PODEM aparecer no Céu (eles voam)
- [ ] Largar Asa Delta no céu = morte imediata
- [ ] Text crawl tem efeito de "entrar na tela" com perspectiva 3D
- [ ] Bomba só é armada em salas terrestres
