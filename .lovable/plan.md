

# Restaurar Icones de Musica e Som

**Arquivo**: `public/avenida-paulista.html`

## Problema

O `overflow: hidden` adicionado ao `#header` (linha 65) esta cortando os botoes de audio (musica e efeitos sonoros) que ficam no final da linha flex. Como o card usa `flex-wrap: nowrap`, o conteudo que nao cabe e simplesmente escondido.

## Solucao

**Mudancas CSS no `#header` (~linha 55-68):**
- Remover `overflow: hidden`
- Adicionar `overflow: visible` (ou simplesmente remover a propriedade)
- Manter `flex-wrap: nowrap` para o card nao crescer em altura
- Adicionar `min-width: 0` no `#stats` para que ele encolha se necessario, em vez de empurrar os botoes para fora

**Mudancas CSS no `#stats` (~linha 70-76):**
- Adicionar `min-width: 0` e `overflow: hidden` (apenas no stats, nao no header inteiro)
- Adicionar `flex: 1` para o stats ocupar o espaco disponivel sem empurrar os botoes

Assim o card mantem tamanho fixo (nao quebra linha) mas os botoes de audio permanecem visiveis.
