

# Reorganização de Indicadores na Interface

## Resumo das 3 mudanças

1. **🔮 Indicador de palavras da Bruxa** — sai do header do minimapa → vai para o card de stats (ao lado dos outros stats como HP, Energia, Karma)
2. **💣 Indicador de bomba ativa** — sai do header do log → vai para o canto superior esquerdo do minimapa (substituindo onde estava o 🔮)
3. **📓 Botão do Diário** — sai do header do log → vai para o canto superior direito do minimapa

## Alterações no HTML

### Card de Stats (linhas ~2239-2259)
Adicionar um novo `.stat` para o indicador da Bruxa com o 🔮 e as 4 esferas, mantendo o mesmo visual mas adaptado ao formato dos outros stats (label + value).

### Header do Minimapa (linhas ~2263-2277)
- **Esquerda** (`position:absolute; left:0`): substituir o witch-indicator pelo `bomb-indicator-btn` (💣)
- **Direita** (`position:absolute; right:0`): adicionar o botão do Diário (📓)
- Remover o antigo bloco do witch-indicator daqui

### Header do Log (linhas ~2157-2162)
- Remover o `bomb-indicator-btn` e o `journal-btn` daqui (os controles de volume e partículas permanecem)

## Ajustes de CSS/JS
- Adaptar o estilo do witch-indicator para caber inline no card de stats (horizontal, compacto)
- O tooltip da bomba já usa `position:fixed` no body, então mover o botão não quebra nada
- As referências JS (`getElementById('bomb-indicator-btn')`, `getElementById('witch-indicator')`) continuam funcionando pois os IDs não mudam

