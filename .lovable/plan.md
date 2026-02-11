

# Temas Visuais Dinamicos e NPCs Mais Interativos

## Resumo

Cinco melhorias visuais e de gameplay para o `public/avenida-paulista.html`:

1. **Tema de sala destruida** - Interface muda para tons avermelhados/cinzentos quando o jogador esta em uma sala com `isRuined = true`
2. **Tema do ceu** - Interface muda para tons azuis/etéreos quando o jogador esta em sala com `requiresFlight = true`
3. **Tema de bomba ativa** - Interface muda para tons alaranjados/tensos quando existe uma `armedBomb` na sala atual do jogador
4. **Flash branco ao ser atacado** - Tela pisca branco quando o jogador recebe dano de um NPC
5. **NPCs mais interativos** - NPCs falam frases aleatorias ao se mover, ao encontrar o jogador, e ao atacar

---

## Detalhes Tecnicos

### 1-3. Temas de cor dinamicos

**Abordagem**: Usar classes CSS no `#game-container` que sobrescrevem as variaveis CSS (`:root` custom properties). A cada `Render.update()`, verificar o estado da sala atual e aplicar/remover a classe correspondente.

**CSS - novas classes de tema:**

```css
/* Sala destruida - tons avermelhados/cinzentos */
#game-container.theme-ruins {
  --bg-primary: #1a0a0a;
  --bg-secondary: #201010;
  --bg-tertiary: #2a1515;
  --text-primary: #d0b0b0;
  --text-secondary: #907070;
  --border-color: #3a2020;
  --accent-gold: #a06040;
}

/* Ceu - tons azuis claros */
#game-container.theme-sky {
  --bg-primary: #0a0f1a;
  --bg-secondary: #101825;
  --bg-tertiary: #152030;
  --text-primary: #c0d8f0;
  --text-secondary: #7090b0;
  --border-color: #203050;
  --accent-gold: #60a0d0;
}

/* Bomba ativa na sala - tons alaranjados tensos */
#game-container.theme-bomb {
  --bg-primary: #1a100a;
  --bg-secondary: #201810;
  --bg-tertiary: #2a2015;
  --text-primary: #f0d0a0;
  --text-secondary: #b08050;
  --border-color: #3a2a10;
  --accent-gold: #e08020;
}
```

**JS - em `Render.update()`**, adicionar chamada a nova funcao `updateTheme()`:

```javascript
updateTheme: function() {
  const container = document.getElementById('game-container');
  container.classList.remove('theme-ruins', 'theme-sky', 'theme-bomb');

  const room = GameState.rooms[GameState.playerLocation];

  // Prioridade: bomba > ruinas > ceu
  if (GameState.armedBomb && GameState.armedBomb.location === GameState.playerLocation) {
    container.classList.add('theme-bomb');
  } else if (room.isRuined) {
    container.classList.add('theme-ruins');
  } else if (room.requiresFlight) {
    container.classList.add('theme-sky');
  }
}
```

Adicionar `transition: all 0.5s ease` no `#game-container` para transicao suave entre temas.

### 4. Flash branco ao ser atacado

Ja existe o sistema `ScreenEffects.flash()`. Basta chamar com cor branca quando o jogador recebe dano.

**Em `processNPCAttacks`**, apos `SoundSystem.playHit()` (linha ~3486), adicionar:

```javascript
ScreenEffects.flash('rgba(255, 255, 255, 0.6)');
```

### 5. NPCs mais interativos

Adicionar um sistema de frases aleatorias para NPCs. Tres momentos de interacao:

**a) Ao se mover** - NPCs falam ao mudar de sala (dentro de `processNPCMovement`):

```javascript
// Apos char.location = Utils.randomChoice(validExits);
if (Utils.random() < 0.3) {
  const phrases = NPC_PHRASES[char.id];
  if (phrases && phrases.move) {
    Log.add(`💬 ${char.name}: "${Utils.randomChoice(phrases.move)}"`, 'info');
  }
}
```

**b) Ao encontrar o jogador** - Quando NPC chega na mesma sala ou jogador entra na sala do NPC:

```javascript
// Em Render.update ou processAction, ao detectar NPCs na sala
```

**c) Ao atacar** - Fala antes de atacar (em `processNPCAttacks`):

```javascript
// Antes de aplicar dano
if (Utils.random() < 0.5) {
  const phrases = NPC_PHRASES[char.id];
  if (phrases && phrases.attack) {
    Log.add(`💬 ${char.name}: "${Utils.randomChoice(phrases.attack)}"`, 'info');
  }
}
```

**Constante de frases por NPC:**

```javascript
const NPC_PHRASES = {
  feiticeiro: {
    move: ['Os astros me guiam...', 'Preciso encontrar meus ingredientes.', 'O vento sussurra segredos.'],
    attack: ['Sinta o poder arcano!', 'Você nao deveria estar aqui!', 'As trevas te consomem!'],
    encounter: ['Hmm, um visitante...', 'Cuidado por onde anda, mortal.', 'Voce busca poder? Ou destruicao?']
  },
  aguia: {
    move: ['*bate as asas majestosamente*', '*planeia sobre os predios*'],
    attack: ['*mergulha com garras afiadas*', '*grita agudamente*'],
    encounter: ['*observa voce com olhos penetrantes*', '*pia ameacadoramente*']
  },
  bombardeador: {
    move: ['Hehe... mais um lugar para explodir!', 'Onde armamos a proxima?', 'BOOM BOOM!'],
    attack: ['Experimenta esse gas!', 'HORA DA EXPLOSAO!', 'Ninguem escapa das minhas bombas!'],
    encounter: ['Ah, mais um alvo...', 'Veio querer brincar com fogo?', 'Voce ta no raio da explosao!']
  },
  bruxa: {
    attack: ['As trevas te CONSOMEM!', 'Sinta a furia do portal!', 'MORRA, mortal insignificante!'],
    encounter: ['Voce ousa me desafiar?', 'O portal esta quase aberto...', 'Voce chegou tarde demais!']
  },
  demonio: {
    move: ['*um rugido ecoou pela cidade*', '*chamas brotam das sombras*'],
    attack: ['ARRRGH!', '*cospe fogo infernal*', 'Sua alma e MINHA!'],
    encounter: ['*os olhos brilham em vermelho sangue*', '*o chao treme sob seus pes*']
  },
  coruja: {
    move: ['*voa silenciosamente*', '*pia suavemente na noite*'],
    encounter: ['*pisca os olhos sabios para voce*', '*pousa no seu ombro brevemente*']
  },
  cachorro: {
    move: ['*abana o rabo e trota alegremente*', '*fareja o chao curioso*'],
    encounter: ['*late alegremente ao te ver!*', '*abana o rabo com forca*', '*lambe sua mao*']
  }
};
```

**Encontros**: Em `Render.update()` ou `processAction`, ao mover, verificar NPCs na nova sala e disparar frase de `encounter` (com cooldown para nao spammar - por exemplo, so falar se o jogador acabou de entrar na sala).

### Arquivos modificados

- `public/avenida-paulista.html` (unico arquivo)

### Ordem de implementacao

1. CSS dos 3 temas de cor
2. Funcao `updateTheme()` no `Render`
3. Flash branco no `processNPCAttacks`
4. Constante `NPC_PHRASES`
5. Frases nos 3 pontos de interacao (mover, encontrar, atacar)

