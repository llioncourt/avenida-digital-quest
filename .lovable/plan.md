

# Correções: Frase de Ataque no Card Certo + Lanterna como Ícone

## Problema 1: Frase de ataque aparece no card do defensor

A `extraMessage` com a frase de ataque do NPC (💬 "...") é renderizada no `showResult()` dentro do card do **defensor** (linhas 6710-6713). Mas a frase pertence ao **atacante** — deveria aparecer no card do atacante.

**Correção**: Mover o bloco de `extraMessage` do `showResult()` (card defensor) para que seja adicionado como uma linha extra no card do atacante. Duas opções:

- Adicionar a `extraMessage` como última linha do `attackerLines` array (linha ~6543), antes de renderizar, quando `extraMessage` existir no result.
- Ou renderizar a frase no card do atacante dentro de `showResult()`, criando um div no `atkCard` em vez do `defCard`.

Melhor abordagem: em `showResult()`, mover o bloco `extraMessage` para renderizar no `atkCard` em vez do `defCard`, com animação sincronizada antes das linhas de resultado do defensor.

## Problema 2: Lanterna poluindo descrição

Já detalhado no plano anterior — sem mudanças. Remover texto concatenado na desc (linhas 7538-7554), substituir por ícone 🔦 no canto superior direito do `#location-panel` com tooltip no hover mostrando itens adjacentes.

**CSS**: `#location-panel { position: relative; }`, `.lanterna-indicator` absoluto top-right, `.lanterna-tooltip` com fundo escuro e borda dourada.

**JS**: No `updateLocation()`, em vez de concatenar na desc, criar/atualizar elemento `.lanterna-indicator` com tooltip contendo as infos organizadas por sala.

## Resumo

1. **~8 linhas** — mover `extraMessage` do card defensor para o card atacante em `showResult()`
2. **~35 linhas** — substituir texto da lanterna por ícone + tooltip flutuante

