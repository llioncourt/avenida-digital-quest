

# Fixar Status Card + Peso Maximo 20kg

**Arquivo**: `public/avenida-paulista.html`

## 1. Fixar tamanho do card de Status

O `#header` (status card) atualmente usa `flex-wrap: wrap` (linha 63) e `#stats` tambem (linha 72), o que permite que o conteudo quebre linha e aumente a altura do card.

**Mudancas CSS (~linhas 54-75):**
- `#header`: adicionar `flex-wrap: nowrap` e `overflow: hidden` para impedir crescimento
- `#stats`: trocar `flex-wrap: wrap` por `flex-wrap: nowrap`
- Garantir que o card nao cresca com conteudo dinamico

## 2. Peso maximo do player para 20kg

Na definicao do personagem `player` (~linha 1566), trocar:

```
maxWeight: 50
```

Por:

```
maxWeight: 20
```

Isso limita o inventario do jogador a 20kg, alinhado com o balanceamento desejado. O display de peso (`weight/maxWeight`) ja usa `player.maxWeight` dinamicamente, entao refletira automaticamente.

