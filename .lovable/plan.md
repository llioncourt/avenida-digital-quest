

# Ajuste do grid de Stats para 3x2

## Layout atual (3 col × 3 linhas)
```
HP        Peso     Hora
Energia   Karma    (Hora span)
     Bruxa (span 3 colunas)
```

## Layout desejado (3 col × 2 linhas)
```
HP        Peso        Hora
Energia   Bruxa(🔮)   Karma
```

## Mudanças (linhas ~139-150)

Reposicionar as classes de grid placement:
- `.stat-hp` → col 1, row 1 (sem mudança)
- `.stat-weight` → col 2, row 1 (sem mudança)
- `.stat-time` → col 3, row 1 (remover span de 2 rows)
- `.stat-energy` → col 1, row 2 (sem mudança)
- `.stat-witch` → col 2, row 2 (remover span de 3 colunas, centralizar)
- `.stat-karma` → col 3, row 2 (mover para direita)

Atualizar `grid-template-rows` para `auto auto` (2 linhas apenas).

Mesma mudança na media query mobile (~linha 1437).

