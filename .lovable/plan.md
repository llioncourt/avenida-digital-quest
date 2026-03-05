

# 4 Bug Fixes

## 1. Mochila na troca — maxWeight não ajusta

Em `executeTrade` (linha 9220-9223), itens são trocados diretamente sem chamar pickup/drop, então o `maxWeight` nunca muda.

**Correção** (após linha 9223):
```javascript
if (playerItemId === 'mochila') {
  GameState.characters.player.maxWeight = Math.max(20, GameState.characters.player.maxWeight - 20);
}
if (vendorItemId === 'mochila') {
  GameState.characters.player.maxWeight += 20;
}
```

## 2. Aliado atacando neutro

Em `processAllyAttacks` (linha 7419-7423), o filtro de inimigos não exclui neutros.

**Correção** — adicionar `&& !c.isNeutral` na linha 7423:
```javascript
!c.isAlly && !c.isNeutral
```

## 3. Hipnodisco funciona no neutro

Em `hipnodisco` (linha 5750-5755), o filtro de alvos "inimigos" não exclui neutros.

**Correção** — adicionar `&& !c.isNeutral` na linha 5753:
```javascript
!c.immuneToHypnosis && !c.isNeutral) {
```

## 4. Tooltip da lanterna mostra subsolo antes da noite

Em `updateLocation` (linha 7610), o tooltip da lanterna aparece sempre que o jogador tem lanterna, sem checar horário. A mecânica de revelar itens adjacentes deveria funcionar só à noite (≥ 20:00).

**Correção** — adicionar checagem de horário na linha 7610:
```javascript
if (GameState.playerInventory.includes('lanterna') && GameState.time >= 1200) {
```

## Resumo

4 correções de 1 linha cada, em locais distintos do arquivo.

