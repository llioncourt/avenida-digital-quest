

# Inventário com Altura Fixa e Indicador de Scroll

## Problemas
1. Conforme itens são coletados, o inventário cresce e comprime o minimapa -- o inventário precisa de uma altura máxima fixa.
2. Falta um indicador visual sutil para quando há itens escondidos abaixo da área visível do inventário.

## Solução

### 1. Altura fixa para o inventário
Definir `max-height: 180px` no `#inventory-panel` para que ele nunca ultrapasse esse tamanho, independente de quantos itens o jogador colete. O minimapa continuará com `flex: 1` ocupando todo o espaço restante sem ser comprimido.

### 2. Indicador sutil de scroll
O sistema de scroll indicators (gradiente na base) já existe no CSS (`.scroll-indicator-container` / `.has-overflow-below`). O `inventory-scroll-wrap` já tem a classe correta. O problema é que o container pai (`#inventory-panel`) precisa ter `overflow: hidden` e o `inventory-scroll-wrap` precisa ter altura limitada para que o overflow seja detectado. Basta garantir que o `max-height` no painel pai limita o espaço e o scroll-wrap interno faz o scroll com o indicador de gradiente.

## Mudancas Tecnicas

**Arquivo**: `public/avenida-paulista.html`

1. **`#inventory-panel`** (linha ~259): Adicionar `max-height: 180px` de volta, manter `flex-shrink: 0`
2. Verificar que o `inventory-scroll-wrap` com `overflow-y: auto` e o indicador de gradiente (`::after`) continuam funcionando corretamente -- ja estao configurados, so precisam do container com altura limitada para ativar

Resultado: o inventario nunca comprime o mapa, e quando ha itens ocultos abaixo, aparece o gradiente sutil na base indicando que ha mais conteudo.
