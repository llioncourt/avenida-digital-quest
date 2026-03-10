

## Corrigir crash do jogo: `bombRoom` declarado duas vezes

### Problema
Na função `processBombTimer()` (linha 7847), a variável `bombRoom` é declarada duas vezes:
- **Linha 7854**: `var bombRoom = GameState.rooms[GameState.armedBomb.location].name;` (usada para o log de countdown)
- **Linha 7861**: `const bombRoom = GameState.rooms[bombLocation];` (usada na lógica de explosão)

Isso causa `SyntaxError: Identifier 'bombRoom' has already been declared`, que mata o script inteiro. Como `StartScreen` é definido depois no código, ele nunca é criado, e clicar no título dá `ReferenceError: StartScreen is not defined`.

### Correção
Renomear a variável da linha 7854 para `bombRoomName` (já que ela só guarda o `.name`):

```js
// Linha 7854: trocar
var bombRoom = GameState.rooms[GameState.armedBomb.location].name;
// para
var bombRoomName = GameState.rooms[GameState.armedBomb.location].name;

// Linha 7855: trocar
Log.add(`⏱️ BOMBA: ${GameState.armedBomb.turnsLeft} turno(s) para explodir em ${bombRoom}!`, 'warning');
// para
Log.add(`⏱️ BOMBA: ${GameState.armedBomb.turnsLeft} turno(s) para explodir em ${bombRoomName}!`, 'warning');
```

Uma mudança de 2 linhas que resolve o crash completo.

