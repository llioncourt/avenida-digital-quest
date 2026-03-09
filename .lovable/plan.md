

## Plano: Posição inicial aleatória do jogador

### Solução

Já existe o array `groundRooms` na função `setupPositions` (linha 9944), que filtra exatamente as salas proibidas: `teto_masp`, `subsolo_masp`, e salas com `requiresFlight` (que inclui `ceu_cidade`). É só reutilizá-lo.

### Mudança

**Arquivo:** `public/avenida-paulista.html`, linhas 9952-9954

Substituir:
```js
GameState.characters.player.location = 'masp';
GameState.playerLocation = 'masp';
```

Por:
```js
const startRoom = Utils.randomChoice(groundRooms);
GameState.characters.player.location = startRoom;
GameState.playerLocation = startRoom;
```

Uma mudança de 2 linhas, zero código novo — reutiliza `groundRooms` + `Utils.randomChoice` que já existem.

