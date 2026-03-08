

# Bug: Dano do gás do Bombardeador invisível no modal de combate

## O problema

A matemática não fecha na tela: **22 ataque - 5 defesa = 17**, mas o dano mostrado é **27**.

O motivo: o Bombardeador tem `usesGas`, que adiciona `+10` ao dano na linha 7379, **mas esse bônus não aparece no card do atacante**. O `totalAttack` passado ao modal é `attackMove.power` (22), sem incluir o +10 do gás.

## A correção

No bloco do Bombardeador com gás (linhas 7373-7382), quando o jogador não tem máscara:

1. Adicionar o bônus de gás ao `totalAttack` exibido no modal, para que o card do atacante mostre "Granada Toxica (22) + ☠️ Gás Tóxico (+10) = TOTAL: 32"
2. Ou mais simples: incluir o item de gás na lista `items` do atacante, similar ao padrão já usado para itens do jogador (ex: `{ name: 'Gás Tóxico', bonus: 10 }`)

### Implementação

Na chamada do `CombatModal.enqueue` (linhas 7393-7396):
- Quando `usesGas && !hasGasMask`: passar `items: [{ name: 'Gás Tóxico ☠️', bonus: 10 }]` e `totalAttack: attackMove.power + 10` no attackerData
- Isso faz o modal renderizar automaticamente a linha extra "📦 +10 (Gás Tóxico ☠️)" e o TOTAL correto (32), usando o sistema de renderização que já existe (linhas 6622-6626)

O dano real (27 = 32 - 5) passa a ser visualmente consistente com os números exibidos.

