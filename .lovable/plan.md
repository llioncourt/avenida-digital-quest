

# Correção: Sync do Texto de Invocação + Frases de Ataque por Último

## Problema

A `extraMessage` (frase de ataque do NPC ou texto de invocação do demônio) é adicionada ao `attackerLines` (linha 6611-6614), aparecendo durante a fase de exibição de stats. Isso causa dois problemas:

1. **"⚡ A BRUXA invoca o DEMÔNIO!"** aparece no card do atacante antes do efeito visual/sonoro, que só dispara no `applyCallback` (quando o jogador confirma). O texto fica dessincronizado.
2. **Frases de ataque dos NPCs** (`💬 "..."`) aparecem junto com os stats em vez de virem por último.

## Correção

Mover `extraMessage` de `attackerLines` (fase de stats) para `showResult()` (fase de resultado), como **última linha** após dano/derrota/HP.

### Mudança 1 — Remover do attackerLines (linhas 6611-6614)

Apagar o bloco que adiciona `extraMessage` ao `attackerLines`.

### Mudança 2 — Adicionar no final de showResult() (linha ~6779)

Após as linhas de resultado (dano, killed/hp), adicionar:

```javascript
if (result.extraMessage) {
  resultLines.push({ text: result.extraMessage, cls: 'combat-result-damage' });
}
```

Isso garante que:
- A frase aparece **depois** do resultado do combate (dano, derrota)
- Para o demônio: o texto aparece **sincronizado** com o efeito (ambos disparam após o primeiro confirmar)
- Para frases de NPC: aparecem como **última coisa** antes do botão final

## Resumo

~3 linhas movidas de um local para outro dentro do CombatModal.

