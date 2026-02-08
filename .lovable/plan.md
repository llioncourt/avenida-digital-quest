
# Plano: Melhorias no Avenida Paulista (Revisado Final)

## Resumo das 5 Alterações

1. **Atributo `mayHaveItems` nas salas** - itens largados no Céu da Cidade são destruídos (caem)
2. **Efeito visual de piscada** quando a Bruxa fala palavras mágicas  
3. **Novo layout: Log em destaque + Mapa na lateral direita (altura total)**
4. **Livro desaparece após uso** + opção "Converter" para o Demônio
5. **Animação estilo Star Wars** com texto puro processado pela função

---

## Detalhes Técnicos

### 1. Atributo `mayHaveItems` nas Salas (Item Cai do Céu)

**Alterações em ROOMS_DATA**:
- Adicionar `mayHaveItems: false` para `ceu_cidade`

**Alterações em Actions.dropItem()**:
```javascript
dropItem: function(itemId) {
  const room = GameState.rooms[GameState.playerLocation];
  const item = GameState.items[itemId];
  
  // Se a sala não permite itens, o item é destruído!
  if (room.mayHaveItems === false) {
    GameState.playerInventory.splice(idx, 1);
    item.location = null; // Destruído
    return {
      success: true,
      message: `Você solta ${item.name}... e ele despenca do céu! O item foi destruído ao atingir o solo lá embaixo!`,
      advanceTime: true
    };
  }
  
  // Comportamento normal...
}
```

---

### 2. Efeito Visual de Piscada (Bruxa)

**Novo CSS**:
```css
#screen-flash {
  position: fixed;
  inset: 0;
  background: rgba(128, 64, 160, 0.5);
  pointer-events: none;
  z-index: 9999;
  animation: witch-flash 0.4s ease-out forwards;
}

@keyframes witch-flash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
```

**Novo objeto ScreenEffects**:
```javascript
const ScreenEffects = {
  flash: function(color = 'rgba(128, 64, 160, 0.5)') {
    const flash = document.createElement('div');
    flash.id = 'screen-flash';
    flash.style.background = color;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);
  }
};
```

**Em Events.processWitchWord()**: Adicionar `ScreenEffects.flash()` junto com `SoundSystem.playDarkMagic()`

---

### 3. Novo Layout: Mapa Lateral Direita (Altura Total)

**Nova estrutura**:
```text
┌─────────────────────┬─────────────────────┐
│ LOG (destaque)      │                     │
├─────────────────────┤      MAPA           │
│ SALA                │   (lateral toda)    │
│                     │                     │
├─────────────────────┤                     │
│ INVENTÁRIO          │                     │
└─────────────────────┴─────────────────────┘
```

**Alterações HTML**:
```html
<main id="main-content">
  <!-- PAINEL ESQUERDO -->
  <div id="game-panel">
    <!-- LOG no topo em destaque -->
    <div class="panel" id="log-panel">
      <h3 class="section-title">📜 Log</h3>
      <div id="log-container"></div>
    </div>
    
    <!-- Sala atual -->
    <div class="panel" id="location-panel">...</div>
    
    <!-- Inventário -->
    <div class="panel" id="inventory-panel">...</div>
  </div>
  
  <!-- MAPA LATERAL DIREITA -->
  <aside id="minimap-container">
    <div id="minimap-header">...</div>
    <div id="minimap-viewport">...</div>
    <div class="map-legend">...</div>
  </aside>
</main>
```

**Remoções**:
- Remover o `<div id="action-buttons">` que contém o botão "Falar" (linhas 1009-1011)

**Alterações CSS**:
```css
#main-content {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

#game-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

#log-panel {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid var(--accent-blue);
  max-height: 150px;
  flex-shrink: 0;
}

#minimap-container {
  flex: 1;
  min-width: 350px;
  height: 100%;
}
```

---

### 4. Livro Desaparece + Opção Converter Demônio

**Adicionar ao GameState**:
```javascript
hasReadMagicBook: false,
```

**Modificar ItemUseHandlers.livro()**:
```javascript
livro: function() {
  GameState.hasReadMagicBook = true;
  return {
    success: true,
    message: `Você lê o livro antigo... Entre os encantamentos, você encontra a palavra mágica: "${GameState.demonMagicWord}". O livro se desfaz em pó mágico.`,
    consumed: true  // Remove do inventário
  };
}
```

**Modificar Modals.showCharacter()**:
- Quando `charId === 'demonio'` E `GameState.hasReadMagicBook === true` E `!char.isAlly`
- Adicionar botão "✨ Converter" que executa `Game.speak(GameState.demonMagicWord)`

---

### 5. Animação Star Wars (Texto Puro)

**HTML simplificado**:
```html
<div id="intro-container">
  <div id="intro-stars"></div>
  <button id="intro-skip" onclick="IntroSystem.skip()">PULAR ▶</button>
  <div id="intro-crawl"></div>
</div>
```

**Texto da história como string pura (fácil edição)**:
```javascript
const IntroSystem = {
  // ========================================
  // HISTÓRIA - EDITE O TEXTO ABAIXO:
  // ========================================
  storyText: `
AVENIDA PAULISTA

Há muito tempo, nas ruas movimentadas de São Paulo...

Uma terrível BRUXA tomou posse do MASP, o icônico museu de arte da Avenida Paulista.

Com seus poderes arcanos, ela pretende pronunciar QUATRO PALAVRAS MÁGICAS para abrir um portal dimensional e invocar forças das trevas sobre a cidade.

Criaturas sobrenaturais agora vagam pelas ruas. Um DEMÔNIO foi avistado nas sombras. O FEITICEIRO se esconde no Túnel aguardando o anoitecer.

Mas nem tudo está perdido. Aliados improváveis podem ser encontrados - uma CORUJA sábia, um fiel CACHORRO CARAMELO, e outros heróis urbanos.

Artefatos místicos estão espalhados pela cidade. Uma ESPADA lendária. Um ESCUDO ancestral. E um LIVRO que contém o segredo para converter as forças do mal.

Você é a última esperança. Explore a cidade, reúna aliados, encontre armas e derrote a Bruxa antes que ela complete seu ritual...

O destino de São Paulo está em suas mãos.
  `,
  // ========================================
  
  formatStory: function() {
    const lines = this.storyText.trim().split('\n\n');
    let html = '';
    
    lines.forEach((paragraph, index) => {
      if (index === 0) {
        html += `<h1 class="crawl-title">${paragraph}</h1>`;
      } else if (index === lines.length - 1) {
        html += `<p class="crawl-final">${paragraph}</p>`;
      } else {
        html += `<p>${paragraph}</p>`;
      }
    });
    
    return html;
  },
  
  init: function() {
    const intro = document.getElementById('intro-container');
    if (!intro) {
      Game.init();
      return;
    }
    
    document.getElementById('intro-crawl').innerHTML = this.formatStory();
    MusicSystem.init();
    MusicSystem.setSpeed(0.7);
    
    const crawl = document.getElementById('intro-crawl');
    crawl.addEventListener('animationend', () => this.complete());
  },
  
  skip: function() {
    document.getElementById('intro-container')?.remove();
    MusicSystem.setSpeed(1.0);
    Game.init();
  },
  
  complete: function() {
    this.skip();
  }
};
```

**CSS para o efeito Star Wars**:
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

#intro-stars {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(1px 1px at 20% 30%, white, transparent),
    radial-gradient(1px 1px at 40% 70%, white, transparent),
    radial-gradient(1px 1px at 60% 20%, white, transparent),
    radial-gradient(1px 1px at 80% 60%, white, transparent);
  background-size: 200px 200px;
  opacity: 0.3;
}

#intro-skip {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 10001;
  background: transparent;
  border: 1px solid var(--accent-gold);
  color: var(--accent-gold);
  padding: 0.5rem 1rem;
  cursor: pointer;
}

#intro-crawl {
  position: absolute;
  width: 80%;
  left: 10%;
  top: 100%;
  transform: rotateX(25deg);
  transform-origin: 50% 0;
  animation: star-wars-crawl 60s linear forwards;
  text-align: center;
  color: var(--accent-gold);
  font-size: 1.5rem;
  line-height: 2;
}

.crawl-title {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.crawl-final {
  font-size: 2rem;
  margin-top: 3rem;
}

@keyframes star-wars-crawl {
  0% { top: 100%; }
  100% { top: -300%; }
}
```

**MusicSystem.setSpeed()**:
```javascript
setSpeed: function(speed) {
  this.playbackSpeed = speed || 1.0;
}
```

**Inicialização**:
```javascript
document.addEventListener('DOMContentLoaded', () => {
  IntroSystem.init();
});
```

---

## Arquivo Modificado

| Arquivo | Alteracao |
|---------|-----------|
| `public/avenida-paulista.html` | Todas as 5 funcionalidades |

---

## Ordem de Implementacao

1. Atributo `mayHaveItems` + destruicao de item no ceu
2. Flag `hasReadMagicBook` e logica do Livro (consumed)
3. Opcao Converter no modal do Demonio
4. Efeito de piscada da Bruxa (ScreenEffects)
5. Novo layout (Log topo + Mapa lateral direita) + remover botao Falar
6. Animacao Star Wars com texto puro
