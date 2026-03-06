

# Plano: Scrollbar no Mapa + 2 Bug Fixes

## 1. Scrollbar visivel no modal do Mapa Antigo

O `.mapa-antigo-scroll` ja tem `overflow-y: auto` e estilos de scrollbar webkit (linha 1054-1056), mas o `#modal` nao tem `max-height` nem `overflow` controlado. O modal cresce sem limite e ultrapassa a tela.

**Correcao:** Adicionar `max-height: 85vh` e `overflow-y: auto` ao `#modal` (linha 999), e reduzir o `max-height` do `.mapa-antigo-scroll` para `60vh` para garantir que o scroll funcione dentro do modal. Tambem adicionar estilos de scrollbar no proprio `#modal` para Firefox (`scrollbar-width: thin`).

## 2. Bug: Personagens mortos sendo atacados

O problema esta em `processNext` (linha 6599). Quando multiplos combates sao enfileirados no mesmo turno contra o mesmo alvo, o primeiro combate mata o alvo, mas os seguintes continuam sendo processados. O `processNext` atualiza o HP e recalcula `killed`, mas nunca **pula** combates contra alvos ja mortos.

**Correcao:** Em `processNext`, apos atualizar HP do defensor (linha 6617-6621), adicionar verificacao: se o defensor ja esta morto (`!defChar.isAlive`), pular esse combate e chamar `processNext()` recursivamente.

```javascript
if (defChar && !defChar.isAlive) {
  this.processNext();
  return;
}
```

Mesma verificacao para o atacante — se o atacante morreu num combate anterior, pular tambem.

## 3. Bug: Frase de efeito do inimigo no card errado

A `extraMessage` (linha 6841-6843) esta sendo adicionada ao `resultLines` que vai para o `defCard` (card do defensor). Para ataques de NPCs, a frase deveria aparecer no card do **atacante**.

**Correcao:** Em `showResult`, em vez de sempre colocar no `defCard`, verificar: se `playerIsAttacker` e false (NPC atacando), colocar a `extraMessage` no `atkCard` (card do atacante). Se `playerIsAttacker` e true, manter no `defCard` (para a invocacao do demonio pela Bruxa).

```javascript
if (result.extraMessage) {
  var targetCard = result.playerIsAttacker 
    ? document.getElementById('combat-card-defender')
    : document.getElementById('combat-card-attacker');
  // adicionar linha com animacao no card correto
}
```

## Resumo

1. **CSS**: `max-height` + `overflow` no `#modal` + scrollbar styles
2. **processNext**: ~4 linhas para pular combates contra mortos
3. **showResult**: ~8 linhas para redirecionar extraMessage ao card do atacante quando NPC ataca

