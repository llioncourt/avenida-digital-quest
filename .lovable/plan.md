

## Plano: Reposicionar salas do minimapa conforme screenshot

Baseado na imagem, a disposição exata é:

```text
            CÉU              ANT
                              
  SHP ------- P.O ---------- COL
               |  \  TETO  /
  AUG   CIN   ★(MASP)    P.L
               |    \     /
              LIV    \   /
         9JN --- ITA --- BRG
               |
              TÚN
               |
  SNT ------- 9JS
```

### Alteração única

**Arquivo:** `public/avenida-paulista.html`, função `calculateRoomPositions` (linhas 6868-6895)

Substituir o bloco `positions` por coordenadas que replicam a disposição da imagem:

```javascript
const positions = {
  // Topo
  'ceu_cidade':              { x: 42, y: 10 },
  'antena':                  { x: 82, y: 12 },

  // Nível Paulista Oeste / Shopping / Colégio
  'shopping':                { x: 10, y: 28 },
  'avenida_paulista_oeste':  { x: 42, y: 28 },
  'colegio':                 { x: 82, y: 30 },

  // Centro - MASP e arredores
  'teto_masp':               { x: 55, y: 36 },
  'masp':                    { x: 42, y: 42 },
  'avenida_paulista_leste':  { x: 82, y: 42 },
  'rua_augusta':             { x: 10, y: 44 },
  'cinema':                  { x: 28, y: 46 },

  // Nível médio-baixo
  'livraria':                { x: 60, y: 53 },
  'nove_julho_norte':        { x: 42, y: 60 },
  'distrito_italiano':       { x: 60, y: 60 },
  'avenida_brigadeiro':      { x: 82, y: 60 },

  // Nível inferior
  'tunel':                   { x: 42, y: 74 },

  // Base
  'avenida_santos':          { x: 10, y: 90 },
  'nove_julho_sul':          { x: 42, y: 88 },
};
```

Nenhuma outra alteração necessária — as conexões (exits) e a renderização de linhas já existem e se adaptam automaticamente.

