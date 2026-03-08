

# Fix: Log da bomba e sincronização de localização

## 3 Correções

### 1. Remover distância do log da bomba (linhas 7024-7030)
O log deve mostrar apenas o nome da sala, sem `(🚶 X salas de distância)`. Reverter para formato simples:
```
⏱️ BOMBA: X turno(s) para explodir em SalaName!
```
Quando o jogador está na sala da bomba, manter o formato normal (não o "AQUI! CORRA!" — isso é só para o tooltip).

### 2. Remover mensagem "AQUI! ⚠️ CORRA!" do log (linha 7025)
Quando `armedBomb.location === playerLocation`, o log deve mostrar o mesmo formato: `⏱️ BOMBA: X turno(s) para explodir em SalaName!`. A mensagem irônica/alerta fica apenas no tooltip do indicador do minimapa.

### 3. Sincronizar `armedBomb.location` quando jogador pega/larga a bomba

**Em `pickupItem` (linha ~6153)**: Quando o item é `bomba` e `armedBomb` existe, atualizar `armedBomb.location` para acompanhar o jogador. Setar uma flag `armedBomb.carriedByPlayer = true`.

```javascript
// Após item.location = null (linha 6153)
if (itemId === 'bomba' && GameState.armedBomb) {
  GameState.armedBomb.carriedByPlayer = true;
}
```

**Em `Actions.move`**: Quando o jogador se move e está carregando a bomba armada, atualizar `armedBomb.location` para a nova sala:
```javascript
if (GameState.armedBomb && GameState.armedBomb.carriedByPlayer) {
  GameState.armedBomb.location = roomId;
}
```

**Em `dropItem`**: Quando o jogador larga a bomba, atualizar `armedBomb.location` e desligar a flag:
```javascript
if (itemId === 'bomba' && GameState.armedBomb) {
  GameState.armedBomb.location = GameState.playerLocation;
  GameState.armedBomb.carriedByPlayer = false;
}
```

**No tooltip do indicador**: Quando `carriedByPlayer === true`, mostrar a mensagem irônica ao invés da distância.

