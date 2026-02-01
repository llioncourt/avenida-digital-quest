

# Plano: Reorganizar Layout do Minimapa para Parecer Mapa de Cidade Real

## Problema Identificado

Analisando o codigo e a imagem enviada, o problema e claro:

1. **Posicoes nao correspondem a topologia**: As salas estao posicionadas em uma grade generica, mas as conexoes reais do jogo criam muitas diagonais que cruzam o mapa
2. **Exemplo problematico**: `ceu_cidade` (posicao superior) tem saidas para `teto_masp`, `avenida_santos`, `rua_augusta`, `nove_julho_sul` - locais espalhados pelo mapa, criando linhas longas que se cruzam
3. **Resultado visual**: O mapa parece um emaranhado de linhas em vez de ruas de uma cidade

---

## Solucao: Layout Geografico Baseado nas Conexoes Reais

Reorganizar as posicoes para que:
- Salas conectadas fiquem PROXIMAS umas das outras
- Ruas principais (Av. Paulista) sejam horizontais claras
- Ruas secundarias (Augusta, Brigadeiro, 9 de Julho) sejam verticais claras
- Locais aereos (Ceu, Antena, Teto) fiquem em camada separada acima

### Estrutura Real das Conexoes do Jogo:

```text
Camada Aerea:
  ANTENA --- CEU_CIDADE --- TETO_MASP
     |          |               |
     |    (voo para varios)     |
     
Nivel Rua - Av. Paulista (linha principal horizontal):
  SHOPPING --- P.OESTE --- MASP --- P.LESTE --- COLEGIO
                 |          |          |           |
                 |          |          |        ANTENA
                 
Conexoes Verticais:
  P.OESTE        MASP       P.LESTE
     |            |            |
  AUGUSTA     9JN/9JS      BRIGADEIRO
     |            |            |
  CINEMA      TUNEL     DIST.ITALIANO
              SANTOS         |
                          LIVRARIA
```

---

## Nova Grade de Posicoes

### Arquivo: `public/avenida-paulista.html`
### Funcao: `calculateRoomPositions` (linhas 2785-2830)

Substituir o objeto `positions` por um layout geograficamente correto:

```javascript
const positions = {
  // === CAMADA AEREA (y: 5-15%) ===
  'ceu_cidade':  { x: 50, y: 8 },   // Centro do ceu
  'teto_masp':   { x: 50, y: 20 },  // Logo acima do MASP
  'antena':      { x: 88, y: 8 },   // Topo direito (no colegio)
  
  // === AVENIDA PAULISTA - LINHA PRINCIPAL (y: 35%) ===
  'shopping':              { x: 8, y: 35 },
  'avenida_paulista_oeste': { x: 28, y: 35 },
  'masp':                  { x: 50, y: 35 },
  'avenida_paulista_leste': { x: 72, y: 35 },
  'colegio':               { x: 92, y: 35 },
  
  // === RUAS VERTICAIS - NIVEL MEDIO (y: 55%) ===
  'rua_augusta':           { x: 20, y: 55 },
  'nove_julho_norte':      { x: 50, y: 55 },
  'avenida_brigadeiro':    { x: 78, y: 55 },
  
  // === RUAS VERTICAIS - NIVEL INFERIOR (y: 75%) ===
  'cinema':                { x: 12, y: 75 },
  'avenida_santos':        { x: 28, y: 75 },
  'nove_julho_sul':        { x: 50, y: 75 },
  'tunel':                 { x: 42, y: 88 },
  'distrito_italiano':     { x: 78, y: 75 },
  
  // === LOCAIS FINAIS (y: 90%) ===
  'livraria':              { x: 88, y: 90 },
};
```

---

## Logica da Nova Organizacao

| Sala | Nova Posicao | Justificativa |
|------|--------------|---------------|
| `ceu_cidade` | x:50, y:8 | Centro do ceu, conecta a varios por voo |
| `teto_masp` | x:50, y:20 | Logo acima do MASP (mesma coluna x) |
| `antena` | x:88, y:8 | Acima do colegio (mesma coluna x) |
| `masp` | x:50, y:35 | Centro da Av. Paulista |
| `shopping` | x:8, y:35 | Extremo oeste da Paulista |
| `colegio` | x:92, y:35 | Extremo leste da Paulista |
| `rua_augusta` | x:20, y:55 | Vertical saindo de P.Oeste |
| `nove_julho_norte` | x:50, y:55 | Vertical saindo do MASP |
| `avenida_brigadeiro` | x:78, y:55 | Vertical saindo de P.Leste |
| `cinema` | x:12, y:75 | Final da Augusta |
| `tunel` | x:42, y:88 | Abaixo de 9JS (mesmo eixo) |
| `livraria` | x:88, y:90 | Final do Dist.Italiano |

---

## Conexoes Aereas (Problema Especial)

O `ceu_cidade` tem conexoes de VOO para locais distantes. Para resolver isso de forma elegante:

**Opcao 1: Linhas Tracejadas para Voo**
Adicionar classe especial para conexoes aereas que usem linha tracejada mais fina

**Opcao 2: Nao Desenhar Conexoes de Voo**
Modificar o renderizador para ignorar conexoes de/para locais que requerem voo

Recomendo **Opcao 2** - nao desenhar conexoes aereas, pois elas nao sao "ruas"

---

## Alteracoes no Codigo

### 1. Nova grade de posicoes (linhas 2791-2818)

Substituir todo o objeto `positions` pela nova versao geografica

### 2. Filtrar conexoes aereas (linhas 2688-2722)

Adicionar verificacao antes de desenhar conexao:

```javascript
// Verificar se eh conexao aerea (nao desenhar como rua)
const roomRequiresFlight = GameState.rooms[roomId].requiresFlight;
const exitRequiresFlight = GameState.rooms[exitId].requiresFlight;
if (roomRequiresFlight || exitRequiresFlight) {
  // Nao desenhar conexao - eh rota de voo, nao rua
  return;
}
```

---

## Resultado Esperado

1. Avenida Paulista forma uma linha horizontal clara no centro
2. Ruas verticais (Augusta, 9 de Julho, Brigadeiro) descem organizadamente
3. Locais aereos ficam em camada separada no topo
4. Conexoes de voo nao aparecem como "ruas"
5. O mapa parece uma planta de cidade real vista de cima

---

## Diagrama Final Esperado

```text
        [ANT]                          [CEU]
           \                            /
            \                          /
             \       [TETO]           /
              \        |             /
               \       |            /
[SHP]---[P.O]---[MASP]---[P.L]---[COL]
          |       |         |
          |       |         |
        [AUG]   [9JN]    [BRG]
          |       |         |
          |       |         |
[CIN]--[SNT]   [9JS]    [ITA]
                 |         |
               [TUN]    [LIV]
```

Linhas majoritariamente horizontais e verticais, como ruas de verdade!

