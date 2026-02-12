

# Scan Completo de Código Morto - avenida-paulista.html

## Resumo dos Achados

Após análise minuciosa do arquivo, identifiquei várias categorias de código morto e órfão que podem ser removidos com segurança, sem afetar a funcionalidade do jogo.

## 1. CSS Classes Órfãs (Definidas mas Nunca Usadas no HTML)

### Classes não encontradas no HTML:
- **`.btn-exit`** (linhas 359-367) - Estilo para botões de saída do jogo. Nunca é aplicada em nenhum elemento HTML. Não há buttons com classe `btn-exit`.
- **`.map-room.has-enemy`** (linhas 730-732) - Comentário vazio, sem estilos. O indicador de inimigo é feito via `::after` (linha 734-745), não precisa dessa classe vazia.
- **`.map-room.has-ally`** (linhas 752-754) - Comentário vazio, sem estilos. O indicador de aliado é feito via `::after` (linha 756-766), não precisa dessa classe vazia.
- **`.map-room.has-both`** (linhas 768-770) - Comentário vazio, sem estilos. O indicador bicolor é feito via `::after` (linha 772-783), não precisa dessa classe vazia.

**Impacto:** Essas classes são puramente estruturais/comentários. Remover não afeta nada. O código que usa `.map-room` continua funcionando normalmente.

## 2. Keyframes e Animações Potencialmente Não Usadas

### Keyframes órfãs identificadas:
- **`@keyframes glitch-offset`** (linhas 1060-1072) - Definida mas nunca referenciada em nenhuma animação CSS. A classe `.glitch-active` usa `glitch-skew` e `glitch-color`, mas não `glitch-offset`.

**Impacto:** Removal de 13 linhas de CSS inerte. O glitch effect continua funcionando normalmente com os outros dois keyframes.

## 3. Comentários de Código Residuais

Existem vários blocos de comentários descritivos que são literais/informativos mas não contêm código:

- **Linha 731-732:** Comentários vazios em `.map-room.has-enemy` dizendo "Bolinha indicadora de inimigo" 
- **Linha 753-754:** Comentários vazios em `.map-room.has-ally` dizendo "Bolinha indicadora de aliado"
- **Linha 769-770:** Comentários vazios em `.map-room.has-both` dizendo "Bolinha bicolor"

Esses podem ser removidos junto com as classes órfãs.

## 4. Código Comentado Funcional

- **Linha 194:** `/* max-height: 150px; <-- REMOVIDO */` - Comentário histórico sobre remoção de propriedade. Pode ser removido.
- **Linha 473:** `/* text-overflow removido do container pai pois os filhos agora são blocos */` - Comentário histórico. Pode ser removido.

## 5. Possível Código Morto Condicional

Verificação: A função `Game.move()` (linha 5242) tem lógica de "encounter" para NPCs que falam ao encontrar o jogador. Isso está ATIVO e funciona corretamente.

## O Que NÃO Deve Ser Removido

- ✅ **`glitch-active` e seus keyframes `glitch-skew`, `glitch-color`** - Usados para efeito de glitch ao derrotar Bombardeador
- ✅ **`screen-shake`** - Usado por `ScreenEffects.flash()` e eventos aleatórios
- ✅ **`.log-entry`, `.log-action`, `.log-success`, etc.** - Todos usados dinamicamente pelo Log
- ✅ **`.btn-item`, `.btn-character`, `.btn-danger`** - Todos usados em renderização dinâmica
- ✅ **Todos os overlays (`#rain-overlay`, `#fog-overlay`, `#whisper-overlay`)** - Usados pelo RandomEvents
- ✅ **`NPC_PHRASES` e lógica de NPCs** - Sistema de diálogo dos NPCs está ativo

## Ordem de Remoção

1. **Remover classe vazia `.map-room.has-enemy` (linhas 730-732)**
2. **Remover classe vazia `.map-room.has-ally` (linhas 752-754)**
3. **Remover classe vazia `.map-room.has-both` (linhas 768-770)**
4. **Remover CSS class `.btn-exit` (linhas 359-367)** - Nunca usada
5. **Remover keyframe `@keyframes glitch-offset` (linhas 1060-1072)** - Nunca referenciada
6. **Remover comentários históricos** (linhas 194, 473) - Limpar código

## Arquivos Afetados

- `public/avenida-paulista.html` (único arquivo)

## Total de Linhas a Remover

- Aproximadamente **40-50 linhas** de CSS puro e comentários inúteis
- Zero linhas de JavaScript (todo código JS está sendo usado)
- Zero linhas de HTML

## Impacto de Segurança

**Nenhum impacto negativo esperado:**
- As remoções não afetam lógica do jogo
- Não removem funcionalidades utilizadas
- Não removem event listeners
- Não removem dados ou estruturas do GameState
- Remocão é puramente cosmética/limpeza

