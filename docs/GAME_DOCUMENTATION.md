# 🎮 Avenida Paulista - Documentação Técnica Completa

> **Remake moderno do clássico jogo de MSX**  
> Um adventure de texto single-page, totalmente autocontido em HTML puro.

---

## 📖 Sumário

1. [Conceito do Jogo](#-conceito-do-jogo)
2. [Salas (ROOMS_DATA)](#-salas-rooms_data)
3. [Itens (ITEMS_DATA)](#-itens-items_data)
4. [Personagens (CHARACTERS_DATA)](#-personagens-characters_data)
5. [Estado do Jogo (GameState)](#-estado-do-jogo-gamestate)
6. [Sistemas do Jogo](#-sistemas-do-jogo)
7. [Mecânicas Especiais](#-mecânicas-especiais)
8. [Interface e UI](#-interface-e-ui)
9. [Sistemas de Áudio](#-sistemas-de-áudio)
10. [Efeitos Visuais](#-efeitos-visuais)

---

## 🎯 Conceito do Jogo

### Sinopse

Uma **Bruxa maligna** se instalou no topo do MASP e está realizando um ritual para abrir um portal dimensional. O jogador deve explorar a Avenida Paulista, coletar itens, formar alianças e derrotar a Bruxa antes que ela complete o ritual.

### Objetivo Principal

**Derrotar a Bruxa** antes que ela pronuncie 4 palavras mágicas (abrindo o portal).

### Inspiração

Remake do jogo **"Avenida Paulista"** original para MSX, adaptado para navegadores modernos com gráficos em ASCII-art e interface interativa.

### Diretrizes Técnicas

- ✅ HTML, CSS e JavaScript puros (sem frameworks)
- ✅ Totalmente autocontido em um único arquivo HTML
- ✅ Sem dependências externas ou CDNs
- ✅ APIs nativas do navegador (Web Audio API, localStorage)

---

## 🗺️ Salas (ROOMS_DATA)

O mapa do jogo representa a região da Avenida Paulista em São Paulo.

### Tabela de Salas

| ID | Nome | Descrição | requiresFlight | Atributos Especiais |
|----|------|-----------|----------------|---------------------|
| `tunel` | Túnel | Túnel escuro sob a Av. Paulista | `false` | - |
| `nove_julho_norte` | Nove de Julho Norte | Parte norte da Av. 9 de Julho | `false` | - |
| `nove_julho_sul` | Nove de Julho Sul | Trecho sul da 9 de Julho | `false` | - |
| `avenida_brigadeiro` | Av. Brigadeiro | Avenida larga e arborizada | `false` | - |
| `avenida_santos` | Av. Santos | Rua comercial | `false` | - |
| `rua_augusta` | Rua Augusta | Famosa rua da vida noturna | `false` | - |
| `shopping` | Shopping | Shopping center moderno | `false` | - |
| `avenida_paulista_oeste` | Av. Paulista Oeste | Trecho oeste da Paulista | `false` | - |
| `avenida_paulista_leste` | Av. Paulista Leste | Trecho leste da Paulista | `false` | - |
| `masp` | MASP | Museu de Arte de São Paulo | `false` | 🏠 **Ponto inicial do jogador** |
| `distrito_italiano` | Distrito Italiano | Bairro italiano | `false` | - |
| `teto_masp` | Teto do MASP | Topo do MASP | `false` | 🧙 **Sala da Bruxa**, protegido por escudo de força |
| `colegio` | Colégio | Antigo colégio | `false` | - |
| `livraria` | Livraria | Livraria antiga | `false` | 📚 **Localização fixa do LIVRO** |
| `antena` | Antena | Torre de antena | `false` | ⚠️ `hasDeadlyJump: true` |
| `ceu_cidade` | Céu da Cidade | Flutua sobre São Paulo | **`true`** | ☁️ `mayHaveItems: false` |
| `cinema` | Cinema | Cinema antigo | `false` | - |

### Mapa de Conexões (ASCII)

```
                    ┌─────────────┐
                    │  LIVRARIA   │
                    └──────┬──────┘
                           │
┌─────────┐    ┌───────────┴───────────┐    ┌─────────────┐
│ 9 JULHO │────│   DISTRITO ITALIANO   │────│ AV.BRIGADEIRO│
│  NORTE  │    └───────────────────────┘    └──────┬──────┘
└────┬────┘                                        │
     │         ┌─────────────────────────┐         │
     ├─────────│         MASP            │─────────┤
     │         │    (Ponto Inicial)      │         │
     │         └────────────┬────────────┘         │
     │                      │                      │
┌────┴────┐    ┌────────────┴────────────┐    ┌────┴────────┐
│  TÚNEL  │    │    TETO DO MASP 🔒      │    │ AV.PAULISTA │
│         │    │    (Escudo de Força)    │    │    LESTE    │
└────┬────┘    └─────────────────────────┘    └──────┬──────┘
     │                      ▲                        │
┌────┴────┐            ┌────┴────┐            ┌──────┴──────┐
│ 9 JULHO │            │  CÉU DA │            │   COLÉGIO   │
│   SUL   │────────────│  CIDADE │            └──────┬──────┘
└────┬────┘            │   ✈️    │                   │
     │                 └────┬────┘            ┌──────┴──────┐
┌────┴────┐                 │                 │   ANTENA    │
│AV.SANTOS│─────────────────┤                 │     ⚠️      │
└────┬────┘                 │                 └─────────────┘
     │                      │
┌────┴────┐    ┌────────────┘
│   RUA   │────┤
│ AUGUSTA │    │
└────┬────┘    │
     │         │
┌────┴────┐    │         ┌─────────────┐
│ SHOPPING│    └─────────│ AV.PAULISTA │
│         │──────────────│    OESTE    │
└─────────┘              └─────────────┘
     │
┌────┴────┐
│ CINEMA  │
└─────────┘
```

### Atributos Especiais de Salas

| Atributo | Descrição | Salas Afetadas |
|----------|-----------|----------------|
| `requiresFlight` | Requer ASA DELTA para acessar | `ceu_cidade` |
| `hasDeadlyJump` | Pular sem asa delta = morte instantânea | `antena` |
| `mayHaveItems` | Se `false`, itens largados são destruídos | `ceu_cidade` |

---

## 🎒 Itens (ITEMS_DATA)

### Tabela Completa de Itens

| ID | Nome | Ataque | Defesa | Peso | canFly | isUsable | singleUse |
|----|------|--------|--------|------|--------|----------|-----------|
| `espada` | ESPADA | 15 | 2 | 8 | ❌ | ❌ | ❌ |
| `escudo` | ESCUDO | 0 | 12 | 10 | ❌ | ❌ | ❌ |
| `kit_saude` | KIT SAÚDE | 0 | 0 | 3 | ❌ | ✅ | ❌ |
| `kit_bomba` | KIT BOMBA | 0 | 0 | 3 | ❌ | ✅ | ❌ |
| `livro` | LIVRO | 0 | 0 | 2 | ❌ | ✅ | ✅ |
| `asa_delta` | ASA DELTA | 0 | 0 | 12 | ✅ | ❌ | ❌ |
| `cera_magica` | CERA MÁGICA | 0 | 0 | 1 | ❌ | ✅ | ✅ |
| `seta_mortal` | SETA MORTAL | 40 | 0 | 1 | ❌ | ✅ | ✅ |
| `mascara_gas` | MÁSCARA GÁS | 0 | 5 | 2 | ❌ | ❌ | ❌ |
| `hipnodisco` | HIPNODISCO | 0 | 0 | 2 | ❌ | ✅ | ✅ |
| `bomba` | BOMBA | 0 | 0 | 6 | ❌ | ✅ | ✅ |

### Descrições Detalhadas

#### ⚔️ Equipamentos de Combate

| Item | Descrição | Efeito |
|------|-----------|--------|
| **ESPADA** | Espada de aço toledano | +15 Ataque, +2 Defesa |
| **ESCUDO** | Escudo resistente com emblemas | +12 Defesa |
| **MÁSCARA GÁS** | Protege contra gases | +5 Defesa, anula dano extra do Bombardeador |

#### 💊 Itens Consumíveis/Usáveis

| Item | Descrição | Efeito | Reutilizável |
|------|-----------|--------|--------------|
| **KIT SAÚDE** | Kit de primeiros socorros | Cura 40 HP | ✅ Sim |
| **KIT BOMBA** | Kit de desarmamento | Desarma bombas ativas | ✅ Sim |
| **LIVRO** | Livro antigo de encantamentos | Revela a palavra mágica do Demônio | ❌ Uso único |
| **CERA MÁGICA** | Cera encantada | Zera o peso de um item permanentemente | ❌ Uso único |
| **SETA MORTAL** | Seta envenenada | Causa 40 de dano em um inimigo | ❌ Uso único |

#### 🎯 Itens Especiais

| Item | Descrição | Funções |
|------|-----------|---------|
| **ASA DELTA** | Asa delta leve | Permite acessar salas com `requiresFlight: true` |
| **HIPNODISCO** | Disco hipnótico | 3 funções: hipnotizar inimigo, dar vida a item, remover escudo |
| **BOMBA** | Bomba poderosa | Criada pelo Bombardeador, timer 10-20 turnos, mata TODOS na sala |

---

## 👥 Personagens (CHARACTERS_DATA)

### Tabela de Personagens

| ID | Nome | HP | Ataque | Defesa | canFly | isAlly |
|----|------|-----|--------|--------|--------|--------|
| `player` | JOGADOR | 100 | 10 | 5 | ❌ | ✅ |
| `feiticeiro` | FEITICEIRO | 60 | 12 | 8 | ❌ | ❌ |
| `aguia` | ÁGUIA | 45 | 18 | 4 | ✅ | ❌ |
| `bombardeador` | BOMBARDEADOR | 50 | 20 | 6 | ❌ | ❌ |
| `bruxa` | BRUXA | 120 | 25 | 15 | ✅ | ❌ |
| `demonio` | DEMÔNIO | 80 | 35 | 20 | ✅ | ❌ |
| `coruja` | CORUJA | 35 | 10 | 5 | ✅ | ✅ |
| `cachorro` | CACHORRO | 40 | 12 | 3 | ❌ | ✅ |

### Atributos Especiais por Personagem

#### 🧑 JOGADOR
```javascript
{
  maxWeight: 50,           // Capacidade máxima de peso
  startLocation: 'masp',   // Posição inicial
  isControllable: true     // Controlável pelo usuário
}
```

#### 🧙 FEITICEIRO
```javascript
{
  startLocation: 'tunel',
  prisonedUntil: '18:00',  // Preso no Túnel até 18:00
  canRemoveShield: true    // Pode remover escudo de força se hipnotizado
}
```

#### 🦅 ÁGUIA
```javascript
{
  canFly: true,            // Pode estar em salas de voo
  attacksFromAir: true     // Ataca do ar
}
```

#### 💣 BOMBARDEADOR
```javascript
{
  usesGas: true,           // Usa ataques de gás
  canCreateBombs: true,    // Pode criar e armar bombas
  bombCooldown: 60,        // Cooldown entre bombas (minutos)
  glitchOnDeath: true      // Efeito glitch ao morrer
}
```

#### 🧹 BRUXA (Boss Final)
```javascript
{
  lastBoss: true,
  immuneToHypnosis: true,  // Não pode ser hipnotizada
  fixedLocation: 'teto_masp',
  rituralWords: 4          // Palavras para completar ritual
}
```

#### 😈 DEMÔNIO
```javascript
{
  isSummoned: false,       // Invocado quando Bruxa é atacada
  immuneToHypnosis: true,  // Não pode ser hipnotizado
  canBeConverted: true     // Pode ser convertido com palavra mágica
}
```

#### 🦉 CORUJA & 🐕 CACHORRO (Aliados)
```javascript
// Coruja
{ canFly: true, isAlly: true, naturalAlly: true }

// Cachorro  
{ canFly: false, isAlly: true, naturalAlly: true }
```

---

## 🎲 Estado do Jogo (GameState)

### Estrutura Completa

```javascript
const GameState = {
  // === Tempo ===
  time: 17 * 60,              // Minutos desde meia-noite (início: 17:00)
  
  // === Jogador ===
  playerLocation: 'masp',     // ID da sala atual
  playerInventory: [],        // IDs dos itens no inventário
  playerHP: 100,              // Pontos de vida atuais
  playerDefenseBonus: 0,      // Bônus temporário de defesa
  playerDefenseBonusTurns: 0, // Turnos restantes do bônus
  
  // === Bruxa/Ritual ===
  witchWords: 0,              // Palavras mágicas pronunciadas (0-4)
  witchWordCooldown: 0,       // Cooldown entre palavras (minutos)
  
  // === Demônio ===
  demonSummoned: false,       // Se o demônio foi invocado
  hasReadMagicBook: false,    // Se o jogador leu o livro
  demonMagicWord: '',         // Palavra para converter o demônio
  
  // === Escudo de Força ===
  forceShieldDown: false,     // Se o escudo foi removido
  
  // === Bombas ===
  armedBomb: null,            // { location: string, turnsLeft: number } ou null
  
  // === Fim de Jogo ===
  gameOver: false,
  victory: false
};
```

### Diagrama de Estados

```
                    ┌─────────────┐
                    │   INÍCIO    │
                    │  (17:00)    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
            ┌──────►│   JOGANDO   │◄──────┐
            │       └──────┬──────┘       │
            │              │              │
            │    ┌─────────┼─────────┐    │
            │    │         │         │    │
            │    ▼         ▼         ▼    │
        ┌───┴────┐   ┌─────────┐   ┌──────┴──┐
        │ Player │   │ Witch   │   │  Bruxa  │
        │ HP ≤ 0 │   │Words ≥ 4│   │ HP ≤ 0  │
        └───┬────┘   └────┬────┘   └────┬────┘
            │             │             │
            ▼             ▼             ▼
        ┌───────┐   ┌─────────┐   ┌─────────┐
        │DERROTA│   │ DERROTA │   │ VITÓRIA │
        └───────┘   └─────────┘   └─────────┘
```

---

## ⚙️ Sistemas do Jogo

### 7.1 Sistema de Tempo

| Aspecto | Valor |
|---------|-------|
| Hora de início | 17:00 (1020 minutos) |
| Tempo por ação | 5 minutos |
| Fim do jogo | Morte, ritual completo, ou vitória |

```javascript
function advanceTime() {
  GameState.time += 5;
  processWitchRitual();
  processBombTimers();
  processAllyAttacks();
  worldSanityCheck();
}
```

### 7.2 Sistema de Combate

#### Fórmula de Dano

```javascript
function calculateDamage(attacker, defender) {
  const attackPower = getAttackPower(attacker);
  const defensePower = getDefensePower(defender);
  return Math.max(1, attackPower - defensePower);
}
```

#### Cálculo de Poderes

```javascript
// Poder de Ataque
function getAttackPower(character) {
  let power = character.baseAttack;
  if (character === player) {
    power += inventory.reduce((sum, item) => sum + item.attackPower, 0);
  }
  return power;
}

// Poder de Defesa
function getDefensePower(character) {
  let power = character.baseDefense;
  if (character === player) {
    power += inventory.reduce((sum, item) => sum + item.defensePower, 0);
    power += GameState.playerDefenseBonus;
  }
  return power;
}
```

### 7.3 Condições de Fim

| Condição | Resultado | Trigger |
|----------|-----------|---------|
| `playerHP ≤ 0` | **DERROTA** | Combate, explosão, queda |
| `witchWords ≥ 4` | **DERROTA** | Ritual completo |
| `witchHP ≤ 0` | **VITÓRIA** | Bruxa derrotada |

### 7.4 Sistema de Peso

```javascript
const MAX_WEIGHT = 50; // kg

function canPickupItem(item) {
  const currentWeight = inventory.reduce((sum, i) => sum + i.weight, 0);
  return currentWeight + item.weight <= MAX_WEIGHT;
}

// Cera Mágica zera peso permanentemente
function applyMagicWax(item) {
  item.weight = 0;
  removeFromInventory('cera_magica');
}
```

### 7.5 Sistema de Voo

```javascript
function canAccessRoom(room) {
  if (room.requiresFlight) {
    return playerHasItem('asa_delta');
  }
  return true;
}

// Antena: pular sem asa delta = morte
function jumpFromAntenna() {
  if (!playerHasItem('asa_delta')) {
    playerDeath('Você caiu da antena e morreu!');
    return;
  }
  moveToRoom('ceu_cidade');
}
```

### 7.6 World Sanity (Validação Contínua)

Sistema que valida e corrige o estado do jogo a cada turno:

```javascript
function worldSanityCheck() {
  // 1. Teleportar personagens terrestres para fora do ar
  characters.forEach(char => {
    if (!char.canFly && isAerialRoom(char.location)) {
      teleportToGround(char);
    }
  });
  
  // 2. Destruir itens no céu
  items.forEach(item => {
    if (item.location === 'ceu_cidade' && !item.inInventory) {
      destroyItem(item);
      log(`${item.name} caiu e foi destruído!`);
    }
  });
  
  // 3. Desarmar bombas no ar
  if (GameState.armedBomb?.location === 'ceu_cidade') {
    GameState.armedBomb = null;
    log('A bomba caiu do céu e foi desarmada!');
  }
}
```

---

## 🔮 Mecânicas Especiais

### 8.1 Escudo de Força

```
┌─────────────────────────────────────────┐
│           TETO DO MASP                  │
│         ┌───────────────┐               │
│         │    BRUXA 🧹   │               │
│         └───────────────┘               │
│                                         │
│  ════════════════════════════════════   │◄── Escudo de Força
│         (Bloqueio Invisível)            │
└─────────────────────────────────────────┘
         ▲                    ▲
         │                    │
    BLOQUEADO            PERMITIDO
    (via MASP)         (via Céu da Cidade)
```

**Regras:**
- Bloqueia acesso ao Teto do MASP vindo do MASP (a pé)
- Removido usando HIPNODISCO no Feiticeiro
- NÃO bloqueia acesso vindo do Céu da Cidade (voo)

### 8.2 Invocação do Demônio

```javascript
function attackWitch() {
  if (!GameState.demonSummoned) {
    GameState.demonSummoned = true;
    spawnDemon('teto_masp');
    log('A Bruxa invoca o DEMÔNIO para protegê-la!');
  }
  // ... continua ataque
}

function convertDemon() {
  if (GameState.hasReadMagicBook) {
    demon.isAlly = true;
    log(`Você pronuncia "${GameState.demonMagicWord}" e o Demônio se torna seu aliado!`);
  }
}
```

### 8.3 Sistema de Bombas

```javascript
const BOMB_CONFIG = {
  cooldown: 60,        // minutos entre bombas
  minTimer: 10,        // turnos mínimos
  maxTimer: 20,        // turnos máximos
  createChance: 0.05   // 5% chance por turno
};

function processBombTimer() {
  if (!GameState.armedBomb) return;
  
  GameState.armedBomb.turnsLeft--;
  
  if (GameState.armedBomb.turnsLeft <= 3) {
    playSound('bombTick');
  }
  
  if (GameState.armedBomb.turnsLeft <= 0) {
    explodeBomb(GameState.armedBomb.location);
  }
}

function explodeBomb(location) {
  // Mata TODOS na sala
  getCharactersInRoom(location).forEach(char => {
    char.hp = 0;
    log(`${char.name} foi eliminado pela explosão!`);
  });
  
  // Destrói todos os itens
  getItemsInRoom(location).forEach(item => {
    destroyItem(item);
  });
  
  ScreenEffects.flash('rgba(255, 150, 50, 0.7)');
  playSound('explosion');
  showExplosionModal();
}
```

### 8.4 Ataques de Aliados

```javascript
function processAllyAttacks() {
  getAllies().forEach(ally => {
    if (Math.random() < 0.5) { // 50% de chance
      const enemies = getEnemiesInRoom(ally.location);
      
      // Não atacam a Bruxa se escudo ativo
      const validTargets = enemies.filter(e => 
        !(e.id === 'bruxa' && !GameState.forceShieldDown)
      );
      
      if (validTargets.length > 0) {
        const target = randomChoice(validTargets);
        attack(ally, target);
      }
    }
  });
}
```

### 8.5 Hipnodisco (Item Especial)

```javascript
function useHypnodisk(target) {
  // Função 1: Hipnotizar inimigo
  if (target.type === 'enemy' && !target.immuneToHypnosis) {
    target.isAlly = true;
    log(`${target.name} foi hipnotizado e agora é seu aliado!`);
  }
  
  // Função 2: Dar vida a item
  if (target.type === 'item') {
    const newAlly = createAllyFromItem(target);
    log(`${target.name} ganhou vida e é seu aliado!`);
  }
  
  // Função 3: Remover escudo (no Feiticeiro)
  if (target.id === 'feiticeiro') {
    GameState.forceShieldDown = true;
    log('O Feiticeiro remove o escudo de força do MASP!');
  }
  
  removeFromInventory('hipnodisco');
}
```

### 8.6 Imunidade à Hipnose

| Personagem | immuneToHypnosis | Motivo |
|------------|------------------|--------|
| BRUXA | `true` | Boss final, não pode ser trivializado |
| DEMÔNIO | `true` | Só pode ser convertido com palavra mágica |
| Outros | `false` | Podem ser hipnotizados normalmente |

**Validação em Profundidade:**
```javascript
// Dupla verificação para segurança
function getHypnotizableTargets() {
  return enemies.filter(e => !e.immuneToHypnosis);
}

function executeHypnosis(target) {
  if (target.immuneToHypnosis) {
    log('Este alvo é imune à hipnose!');
    return false;
  }
  // ... executa hipnose
}
```

---

## 🖥️ Interface e UI

### 9.1 Layout Principal

```
┌─────────────────────────────────────────────────────────────────┐
│ ⏰ 17:45  │  ❤️ HP: 85/100  │  ⚖️ 23/50 kg  │  🧹 ██░░  │ 🔊 🎵 │
├─────────────────────────────────┬───────────────────────────────┤
│                                 │                               │
│         📜 LOG DE EVENTOS       │                               │
│   ┌───────────────────────┐     │                               │
│   │ Você pegou a ESPADA   │     │         🗺️ MINIMAPA          │
│   │ O Bombardeador ataca! │     │                               │
│   │ Você se move para...  │     │      ┌───┐   ┌───┐           │
│   └───────────────────────┘     │      │ L │───│ D │           │
│                                 │      └───┘   └─┬─┘           │
│         📍 SALA ATUAL           │               │               │
│   ┌───────────────────────┐     │      ┌───┐   ┌┴──┐   ┌───┐   │
│   │ MASP                  │     │      │ 9N│───│MSP│───│APL│   │
│   │ Descrição da sala...  │     │      └─┬─┘   └───┘   └───┘   │
│   │                       │     │        │                     │
│   │ 👤 Coruja (aliado)    │     │      ┌─┴─┐                   │
│   │ 📦 Escudo             │     │      │TUN│                   │
│   └───────────────────────┘     │      └───┘                   │
│                                 │                               │
│         🎒 INVENTÁRIO           │   🟡 Jogador                  │
│   ┌───────────────────────┐     │   🔴 Inimigo                  │
│   │ • Espada (8kg)        │     │   🟢 Aliado                   │
│   │ • Kit Saúde (3kg)     │     │                               │
│   └───────────────────────┘     │                               │
├─────────────────────────────────┴───────────────────────────────┤
│  [Norte] [Sul] [Leste] [Oeste]  │  [Atacar] [Usar] [Pegar]      │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Minimapa Interativo

**Características:**
- Estilo mapa de ruas com conexões como "asfalto"
- Indicadores coloridos:
  - 🟡 Dourado: Jogador
  - 🔴 Vermelho: Inimigo
  - 🟢 Verde: Aliado
- Suporta:
  - Pan (arrastar)
  - Zoom (scroll/pinch)
  - Drag de salas (reposicionamento)
- Posições persistem no `localStorage`

### 9.3 Sistema de Modais

| Tipo | Função | Elementos |
|------|--------|-----------|
| **Genérico** | Informações e confirmações | Título, texto, botão OK |
| **Personagem** | Interação com NPCs | Stats, botões de ação |
| **Seleção** | Escolha de alvos | Lista de opções, cancelar |
| **Game Over** | Fim de jogo | Estatísticas, reiniciar |

---

## 🔊 Sistemas de Áudio

### 10.1 SoundSystem (Web Audio API)

```javascript
const SOUNDS = {
  attack:      { frequency: 200, duration: 0.1, type: 'square' },
  hit:         { frequency: 150, duration: 0.15, type: 'sawtooth' },
  death:       { frequency: 80, duration: 0.5, type: 'sine' },
  move:        { frequency: 300, duration: 0.05, type: 'sine' },
  pickup:      { frequency: 500, duration: 0.1, type: 'triangle' },
  useItem:     { frequency: 400, duration: 0.2, type: 'sine' },
  explosion:   { frequency: 60, duration: 0.8, type: 'sawtooth' },
  heal:        { frequency: 600, duration: 0.3, type: 'sine' },
  victory:     { frequency: 800, duration: 1.0, type: 'triangle' },
  enemyDefeat: { frequency: 250, duration: 0.4, type: 'square' },
  darkMagic:   { frequency: 100, duration: 0.6, type: 'sawtooth' },
  bombTick:    { frequency: 1000, duration: 0.05, type: 'square' },
  error:       { frequency: 200, duration: 0.3, type: 'square' }
};
```

### 10.2 MusicSystem

**Características:**
- MIDI embutido como Base64 (sem dependências externas)
- Parser MIDI nativo em JavaScript
- Controle de velocidade:
  - 0.7x durante intro
  - 1.0x durante gameplay
- Loop automático
- Interrupção ao reiniciar (evita sobreposição)

```javascript
class MusicSystem {
  constructor() {
    this.audioContext = new AudioContext();
    this.midiData = atob(MIDI_BASE64);
    this.playbackRate = 1.0;
  }
  
  setSpeed(rate) {
    this.playbackRate = rate; // 0.7 para intro, 1.0 normal
  }
  
  play() { /* ... */ }
  stop() { /* ... */ }
  loop() { /* ... */ }
}
```

---

## ✨ Efeitos Visuais

### 11.1 ScreenEffects

```javascript
const ScreenEffects = {
  flash(color) {
    const overlay = document.createElement('div');
    overlay.className = 'screen-flash';
    overlay.style.backgroundColor = color;
    document.body.appendChild(overlay);
    
    setTimeout(() => overlay.remove(), 400);
  }
};

// Uso:
ScreenEffects.flash('rgba(128, 0, 128, 0.5)');  // Roxo: palavra mágica
ScreenEffects.flash('rgba(255, 150, 50, 0.7)'); // Laranja: explosão
```

### 11.2 GlitchEffect

Ativado ao derrotar o Bombardeador:

```css
@keyframes glitch {
  0%   { transform: translate(0); filter: hue-rotate(0deg); }
  20%  { transform: translate(-5px, 5px); filter: hue-rotate(90deg); }
  40%  { transform: translate(5px, -5px); filter: hue-rotate(180deg); }
  60%  { transform: translate(-5px, -5px); filter: hue-rotate(270deg); }
  80%  { transform: translate(5px, 5px); filter: hue-rotate(360deg); }
  100% { transform: translate(0); filter: hue-rotate(0deg); }
}

.glitch-effect {
  animation: glitch 0.3s ease-in-out 10;
}
```

### 11.3 Intro Star Wars

Crawl 3D com perspectiva real usando CSS:

```css
.intro-crawl {
  position: absolute;
  top: 100%;
  transform-origin: 50% 100%;
  animation: crawl 60s linear forwards;
}

@keyframes crawl {
  0% {
    transform: rotateX(25deg) translateZ(0);
    opacity: 1;
  }
  100% {
    transform: rotateX(25deg) translateZ(-2500px);
    opacity: 0;
  }
}

.intro-container {
  perspective: 400px;
  overflow: hidden;
}
```

**Características:**
- Perspectiva 3D real com `translateZ`
- Botão de skip para iniciar imediatamente
- Música em velocidade lenta (0.7x)
- Texto armazenado como string para fácil edição

---

## 📊 Estatísticas de Game Over

Ao final de cada partida, um modal exibe:

| Estatística | Descrição |
|-------------|-----------|
| Tempo de jogo | Diferença entre hora final e 17:00 |
| Inimigos derrotados | Contagem de kills |
| Dano causado | Soma de todo dano infligido |
| Dano recebido | Soma de todo dano sofrido |
| Itens coletados | Total de itens pegos |
| Salas visitadas | Contagem única de salas |
| Resultado | Vitória ou tipo de derrota |

---

## 📁 Estrutura de Arquivos

```
avenida-paulista/
├── public/
│   ├── avenida-paulista.html    # Jogo completo (autocontido)
│   └── AvP.mid                  # Arquivo MIDI original (referência)
├── docs/
│   └── GAME_DOCUMENTATION.md    # Esta documentação
└── .lovable/
    └── plan.md                  # Plano de desenvolvimento
```

---

## 🔗 Links Úteis

- **Jogo Original (MSX)**: Referência histórica
- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **CSS 3D Transforms**: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/perspective

---

*Documentação gerada em Fevereiro de 2026*  
*Versão: 1.0.0*
