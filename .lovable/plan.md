
## Problema

Ao entrar em combate, `MusicSystem.stop()` é chamado (linha 6797), o que define `stoppedManually = true` e reseta `currentTime = 0`. Quando o combate termina, `MusicSystem.start()` reinicia a música do início.

## Solução

Usar `pause()` ao invés de `stop()` ao entrar no combate:

### Alteração em `CombatOverlay.show` (linha ~6797)

```js
// Antes:
MusicSystem.stop();

// Depois:
if (MusicSystem.pause) {
  MusicSystem.pause();
} else {
  MusicSystem.stop();
}
```

Isso permite que `MusicSystem.start()` no `processNext()` retome de onde parou (sem `stoppedManually = true`).

### Arquivo a editar

`public/avenida-paulista.html` — linha 6797: trocar `MusicSystem.stop()` por `MusicSystem.pause()`
