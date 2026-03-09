

## Portrait com Degradê ao Longo do Card — Visual "WOW"

### Conceito
A imagem do portrait no topo do card se estende para baixo com um degradê suave que vai desaparecendo, criando um efeito cinematográfico moderno. O portrait ocupa o card inteiro como background, mas com um gradiente forte de cima para baixo que faz a imagem "dissolver" no fundo escuro do card. O texto fica por cima sem precisar de background nas letras — a opacidade baixa + gradiente garante legibilidade.

### Alterações em `public/avenida-paulista.html`

**1. Reestruturar `.combat-portrait`** — Em vez de um bloco fixo de 160px no topo, o portrait vira uma camada absoluta que cobre o card inteiro:

```css
.combat-card {
  position: relative;
  overflow: hidden;
}
.combat-portrait {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
}
.combat-portrait img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top center;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, transparent 75%);
  -webkit-mask-image: /* idem */;
  animation: portrait-reveal 0.6s ease-out;
}
```

O `mask-image` com gradiente faz a imagem ser forte no topo e ir desaparecendo suavemente — sem atrapalhar o texto embaixo. Sem background nas letras. Moderno.

**2. Conteúdo do card acima do portrait** — Todos os filhos diretos do card ganham `position: relative; z-index: 1` para ficarem acima da camada de imagem.

**3. Remover margin negativo** — O portrait antigo usava `margin: -1.5rem` para sangrar. Agora com `position: absolute` isso é desnecessário. Remover também a `height: 160px` fixa.

**4. Placeholder** — Mesma lógica, mas o placeholder agora também cobre o card inteiro com gradiente escuro sutil.

**5. Animação** — Manter o `portrait-reveal` (scale 1.05→1 + fade-in), que combina bem com o efeito full-card.

### Resultado Visual
- Imagem do personagem cobre o topo do card, dissolve suavemente para baixo
- Texto do combate fica legível naturalmente sobre a parte já transparente
- Visual tipo "card de herói" de jogos modernos (Genshin Impact, Honkai Star Rail)
- Zero background nas letras, zero hack — só mask-image + z-index

### Escopo
- ~20 linhas CSS alteradas
- ~5 linhas JS (remover margin negativo do createEl, adicionar z-index nos filhos)

