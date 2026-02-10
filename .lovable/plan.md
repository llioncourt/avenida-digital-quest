
# Bug Fix: Jogador nao morre na explosao da bomba

## Problema

O jogador nunca morre na explosao porque o codigo da bomba verifica `char.location === bombLocation` para todos os personagens, incluindo o player. Porem, a localizacao do jogador e atualizada apenas em `GameState.playerLocation`, e nao em `GameState.characters.player.location` (que fica travada em `'masp'`, a sala inicial).

Ou seja, a explosao nunca "encontra" o jogador na sala certa.

## Solucao

Duas correcoes complementares:

### 1. Sincronizar `characters.player.location` com `playerLocation`

Em todos os pontos onde `GameState.playerLocation` e atualizado (funcao `moveTo` em `Actions`), tambem atualizar `GameState.characters.player.location` para manter consistencia.

Locais a alterar em `Actions.moveTo()` (3 pontos onde `GameState.playerLocation = roomId` aparece):
- Linha ~2956 (morte por queda)
- Linha ~2964 (voo normal)
- Linha ~2986 (movimento normal)

Adicionar `GameState.characters.player.location = roomId;` logo apos cada `GameState.playerLocation = roomId;`.

### 2. Protecao extra na explosao

No `processBombTimer`, adicionar uma verificacao explicita do player usando `GameState.playerLocation` para garantir que ele seja incluido nas vitimas mesmo que algo saia de sincronia:

```javascript
// Antes do loop de personagens (linha ~3263)
const playerInBombRoom = GameState.playerLocation === bombLocation;
```

E apos o loop, se `playerInBombRoom` e o player nao foi incluido, forcar a morte:

```javascript
if (playerInBombRoom && GameState.characters.player.isAlive) {
  GameState.characters.player.hp = 0;
  GameState.characters.player.isAlive = false;
  if (!victims.includes(GameState.characters.player.name)) {
    victims.push(GameState.characters.player.name);
  }
}
```

## Arquivo modificado

- `public/avenida-paulista.html`
