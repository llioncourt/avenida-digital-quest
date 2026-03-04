

## Plano: Ajustar disposicao do minimapa conforme foto de referencia

A foto mostra o mapa do jogo com a seguinte disposicao espacial (de cima para baixo):

```text
                    ITALIAN D.
                     LIBRARY        BRIGADEIRO
      MALL        JULY AVE N
                     MASP
  PAULISTA W                        PAULISTA E
              AUGUSTA ST   JULY AVE S   COLLEGE
      CINEMA       SANTOS ST
```

Salas aereas (ceu, teto, antena) ficam acima de tudo.

### Alteracao unica

**Arquivo:** `public/avenida-paulista.html` — funcao `calculateRoomPositions`

Substituir as posicoes percentuais atuais pelas novas, baseadas na foto:

```javascript
const positions = {
  // === CAMADA AEREA ===
  'ceu_cidade':  { x: 50, y: 3 },
  'teto_masp':   { x: 50, y: 12 },
  'antena':      { x: 88, y: 3 },

  // === NIVEL SUPERIOR (Distrito Italiano / Livraria / Brigadeiro) ===
  'distrito_italiano':     { x: 55, y: 22 },
  'livraria':              { x: 50, y: 32 },
  'avenida_brigadeiro':    { x: 85, y: 27 },

  // === NIVEL MEDIO-ALTO (Mall, 9 Julho Norte) ===
  'shopping':              { x: 15, y: 42 },
  'nove_julho_norte':      { x: 50, y: 42 },

  // === AVENIDA PAULISTA - LINHA PRINCIPAL ===
  'avenida_paulista_oeste': { x: 15, y: 55 },
  'masp':                   { x: 50, y: 52 },
  'avenida_paulista_leste': { x: 85, y: 55 },

  // === NIVEL INFERIOR (Augusta, 9 Julho Sul, Colegio) ===
  'rua_augusta':           { x: 28, y: 68 },
  'nove_julho_sul':        { x: 50, y: 68 },
  'colegio':               { x: 78, y: 68 },

  // === NIVEL MAIS BAIXO (Cinema, Santos, Tunel) ===
  'cinema':                { x: 15, y: 82 },
  'avenida_santos':        { x: 38, y: 82 },
  'tunel':                 { x: 50, y: 92 },
};
```

As conexoes (exits) entre salas nao mudam — apenas a posicao visual no mapa. As linhas de conexao serao redesenhadas automaticamente pela funcao `updateMinimap` existente.

