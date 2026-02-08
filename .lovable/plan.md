
# Plano: Criar Documentação Completa do Jogo

## Objetivo
Criar um arquivo Markdown (`docs/GAME_DOCUMENTATION.md`) com documentação completa e padronizada de todas as estruturas, mecânicas, personagens, itens e sistemas do jogo "Avenida Paulista".

---

## Estrutura da Documentação

### 1. Cabeçalho
- Título e descrição do projeto
- Badges e links relevantes

### 2. Conceito do Jogo
- Sinopse
- Objetivo principal
- Inspiração (remake do jogo de MSX)

### 3. Salas (ROOMS_DATA)

| ID | Nome | Descrição | Saídas | requiresFlight | Atributos Especiais |
|----|------|-----------|--------|----------------|---------------------|
| tunel | Túnel | Túnel escuro sob a Av. Paulista | Nove de Julho Norte, Sul | false | - |
| nove_julho_norte | Nove de Julho Norte | Parte norte da Av. 9 de Julho | Distrito Italiano, MASP, Túnel | false | - |
| nove_julho_sul | Nove de Julho Sul | Trecho sul da 9 de Julho | Túnel, Av. Santos, Av. Brigadeiro | false | - |
| avenida_brigadeiro | Av. Brigadeiro | Avenida larga e arborizada | Distrito Italiano, Av. Paulista Leste, 9 de Julho Sul | false | - |
| avenida_santos | Av. Santos | Rua comercial | 9 de Julho Sul, Rua Augusta | false | - |
| rua_augusta | Rua Augusta | Famosa rua da vida noturna | Shopping, Av. Paulista Oeste, Cinema, Av. Santos | false | - |
| shopping | Shopping | Shopping center moderno | Av. Paulista Oeste, Rua Augusta | false | - |
| avenida_paulista_oeste | Av. Paulista Oeste | Trecho oeste da Paulista | Rua Augusta, Shopping, Av. Paulista Leste, MASP | false | - |
| avenida_paulista_leste | Av. Paulista Leste | Trecho leste da Paulista | Av. Paulista Oeste, Av. Brigadeiro, Colégio, MASP | false | - |
| masp | MASP | Museu de Arte de São Paulo | Av. Paulista Leste/Oeste, 9 de Julho Norte, Teto do MASP | false | Ponto inicial do jogador |
| distrito_italiano | Distrito Italiano | Bairro italiano | Livraria, 9 de Julho Norte, Av. Brigadeiro | false | - |
| teto_masp | Teto do MASP | Topo do MASP | - (armadilha) | false | Sala da Bruxa, protegido por escudo de força |
| colegio | Colégio | Antigo colégio | Av. Paulista Leste, Antena | false | - |
| livraria | Livraria | Livraria antiga | Distrito Italiano | false | Localização fixa do LIVRO |
| antena | Antena | Torre de antena | Colégio, Céu da Cidade | false | hasDeadlyJump: true (pular sem asa delta = morte) |
| ceu_cidade | Céu da Cidade | Flutua sobre São Paulo | Teto do MASP, Av. Santos, Rua Augusta, 9 de Julho Sul | **true** | mayHaveItems: false (itens largados são destruídos) |
| cinema | Cinema | Cinema antigo | Rua Augusta | false | - |

### 4. Itens (ITEMS_DATA)

| ID | Nome | Descrição | Ataque | Defesa | Peso | canFly | isUsable | singleUse | Notas |
|----|------|-----------|--------|--------|------|--------|----------|-----------|-------|
| espada | ESPADA | Espada de aço toledano | 15 | 2 | 8 | false | false | false | Equipamento |
| escudo | ESCUDO | Escudo resistente com emblemas | 0 | 12 | 10 | false | false | false | Equipamento |
| kit_saude | KIT SAÚDE | Kit de primeiros socorros | 0 | 0 | 3 | false | **true** | **false** | Cura 40 HP, reutilizável |
| kit_bomba | KIT BOMBA | Kit de desarmamento | 0 | 0 | 3 | false | **true** | **false** | Desarma bombas, reutilizável |
| livro | LIVRO | Livro antigo de encantamentos | 0 | 0 | 2 | false | **true** | **true** | Revela a palavra mágica do Demônio, **sempre na Livraria** |
| asa_delta | ASA DELTA | Asa delta leve | 0 | 0 | 12 | **true** | false | false | Permite acessar salas com `requiresFlight: true` |
| cera_magica | CERA MÁGICA | Cera encantada | 0 | 0 | 1 | false | **true** | **true** | Zera o peso de um item permanentemente |
| seta_mortal | SETA MORTAL | Seta envenenada | 40 | 0 | 1 | false | **true** | **true** | Causa 40 de dano em um inimigo |
| mascara_gas | MÁSCARA GÁS | Protege contra gases | 0 | 5 | 2 | false | false | false | Anula dano extra do Bombardeador |
| hipnodisco | HIPNODISCO | Disco hipnótico | 0 | 0 | 2 | false | **true** | **true** | 3 funções: hipnotizar inimigo, dar vida a item, remover escudo do Feiticeiro |
| bomba | BOMBA | Bomba poderosa | 0 | 0 | 6 | false | **true** | **true** | Criada pelo Bombardeador, jogador não pode armar. Timer 10-20 turnos, mata TODOS na sala |

### 5. Personagens (CHARACTERS_DATA)

| ID | Nome | HP | Ataque | Defesa | canFly | isAlly | Atributos Especiais |
|----|------|----|----|------|--------|--------|---------------------|
| player | JOGADOR | 100 | 10 | 5 | false | true | maxWeight: 50, posição inicial: MASP |
| feiticeiro | FEITICEIRO | 60 | 12 | 8 | false | false | Preso no Túnel até 18:00, pode remover escudo de força se hipnotizado |
| aguia | ÁGUIA | 45 | 18 | 4 | **true** | false | Ataca do ar, pode estar em salas de voo |
| bombardeador | BOMBARDEADOR | 50 | 20 | 6 | false | false | usesGas: true, canCreateBombs: true, bombCooldown: 60 min, efeito glitch ao morrer |
| bruxa | BRUXA | 120 | 25 | 15 | **true** | false | lastBoss: true, **immuneToHypnosis: true**, posição fixa: Teto do MASP |
| demonio | DEMÔNIO | 80 | 35 | 20 | true | false | isSummoned: false, **immuneToHypnosis: true**, invocado quando Bruxa é atacada, pode ser convertido com palavra mágica |
| coruja | CORUJA | 35 | 10 | 5 | **true** | true | Aliado natural, pode voar |
| cachorro | CACHORRO | 40 | 12 | 3 | false | true | Aliado natural, terrestre |

### 6. Estado do Jogo (GameState)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| time | number | Tempo atual em minutos (início: 17*60 = 17:00) |
| playerLocation | string | ID da sala atual do jogador |
| playerInventory | array | IDs dos itens no inventário |
| witchWords | number | Palavras mágicas pronunciadas (0-4) |
| witchWordCooldown | number | Cooldown entre palavras (30 min) |
| gameOver | boolean | Se o jogo acabou |
| victory | boolean | Se foi vitória |
| demonSummoned | boolean | Se o demônio foi invocado |
| forceShieldDown | boolean | Se o escudo de força foi removido |
| armedBomb | object | { location, turnsLeft } ou null |
| hasReadMagicBook | boolean | Se o jogador leu o livro |
| demonMagicWord | string | Palavra para converter o demônio |
| playerDefenseBonus | number | Bônus temporário de defesa |
| playerDefenseBonusTurns | number | Turnos restantes do bônus |

### 7. Sistemas do Jogo

#### 7.1 Sistema de Tempo
- Cada ação avança 5 minutos
- Início: 17:00
- Fim: quando jogador morre, bruxa completa ritual, ou bruxa é derrotada

#### 7.2 Sistema de Combate
- **Dano**: `max(1, attackPower - targetDefensePower)`
- **Poder de ataque**: base do player + soma de `attackPower` dos itens no inventário
- **Poder de defesa**: base do player + soma de `defensePower` dos itens + bônus temporário

#### 7.3 Condições de Fim

| Condição | Resultado |
|----------|-----------|
| Player HP ≤ 0 | Derrota |
| witchWords ≥ 4 | Derrota (portal aberto) |
| Bruxa HP ≤ 0 | **Vitória** |

#### 7.4 Sistema de Peso
- Jogador tem capacidade máxima de 50kg
- Cada item tem peso próprio
- **Cera Mágica** pode zerar o peso de um item permanentemente

#### 7.5 Sistema de Voo
- Salas com `requiresFlight: true` só são acessíveis com ASA DELTA
- Pular da Antena sem asa delta = morte instantânea
- Itens largados no Céu da Cidade são destruídos

#### 7.6 World Sanity (Validação Contínua)
- Personagens terrestres são teleportados para o solo se ficarem no ar
- Itens em salas aéreas são destruídos
- Bombas armadas no ar são desarmadas
- Executa a cada turno (dupla validação)

### 8. Mecânicas Especiais

#### 8.1 Escudo de Força
- Bloqueia acesso ao Teto do MASP vindo do MASP (à pé)
- Pode ser removido usando HIPNODISCO no Feiticeiro
- Não bloqueia acesso vindo do Céu da Cidade

#### 8.2 Invocação do Demônio
- Ao atacar a Bruxa pela primeira vez, ela invoca o Demônio
- Demônio aparece na mesma sala que a Bruxa
- Pode ser convertido em aliado com a palavra mágica (revelada pelo LIVRO)

#### 8.3 Sistema de Bombas
- Bombardeador cria e arma bombas (cooldown: 60 min, chance: 5%)
- Timer: 10-20 turnos
- Explosão: mata TODOS (incluindo aliados e jogador) e destrói todos os itens
- Kit Bomba pode desarmar
- Bombardeador não arma bombas em salas de voo

#### 8.4 Ataques de Aliados
- Aliados atacam inimigos automaticamente (50% de chance por turno)
- Aliados não atacam a Bruxa se o escudo de força estiver ativo
- Aliados criados pelo Hipnodisco herdam atributos do item animado

#### 8.5 Hipnodisco (Item Especial)
3 funções possíveis:
1. **Hipnotizar inimigo**: Converte em aliado (exceto Bruxa e Demônio)
2. **Dar vida a item**: Cria personagem aliado baseado no item
3. **Remover escudo**: Usado no Feiticeiro para remover escudo de força

#### 8.6 Imunidade à Hipnose
- `immuneToHypnosis: true` em Bruxa e Demônio
- Impede que sejam alvo do Hipnodisco
- Defesa em profundidade: validação dupla (coleta de alvos + execução)

### 9. Interface e UI

#### 9.1 Layout Principal
- Header: tempo, HP, peso, indicador da bruxa, som/música
- Painel esquerdo: Log, Sala atual, Inventário
- Painel direito: Minimapa interativo

#### 9.2 Minimapa
- Estilo mapa de ruas com conexões como "asfalto"
- Indicadores coloridos: dourado (jogador), vermelho (inimigo), verde (aliado)
- Suporta pan, zoom (scroll/pinch), drag de salas
- Posições persistem no localStorage

#### 9.3 Sistema de Modais
- Modal genérico para informações e confirmações
- Modal de personagem: stats + botões de ação
- Modal de seleção: Hipnodisco, Seta Mortal, Cera Mágica
- Modal de game over com resumo de estatísticas

### 10. Sistemas de Áudio

#### 10.1 SoundSystem (Web Audio API)
Sons: attack, hit, death, move, pickup, useItem, explosion, heal, victory, enemyDefeat, darkMagic, bombTick, error

#### 10.2 MusicSystem
- MIDI embutido como Base64
- Parser nativo sem dependências
- Controle de velocidade (0.7x durante intro)
- Loop automático

### 11. Efeitos Visuais

#### 11.1 ScreenEffects
- Flash roxo: palavra mágica da Bruxa
- Flash laranja: explosão de bomba

#### 11.2 GlitchEffect
- Ativado ao derrotar o Bombardeador
- Distorção visual de 3 segundos

#### 11.3 Intro Star Wars
- Crawl 3D com perspectiva real (`translateZ`)
- Botão de skip
- Música em velocidade lenta

---

## Arquivo a Criar

**Caminho**: `docs/GAME_DOCUMENTATION.md`

**Conteúdo**: Documentação Markdown completa seguindo a estrutura acima, com tabelas, listas, exemplos de código e diagramas ASCII quando apropriado.

---

## Testes Pós-Implementação
1. ✅ Arquivo criado em `docs/GAME_DOCUMENTATION.md`
2. ✅ Markdown renderiza corretamente
3. ✅ Todas as salas, itens e personagens documentados
4. ✅ Mecânicas e sistemas explicados
5. ✅ Formatação consistente e padronizada
