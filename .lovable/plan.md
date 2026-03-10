

## Bug: Música de Game Over continua tocando ao clicar "Jogar Novamente"

### Causa raiz

`Game.restart()` chama apenas `MusicSystem.stop()`, que é o player de **exploração**. O `GameOverMusicSystem` (que está tocando nesse momento) nunca é parado.

Além disso, pode haver o `WitchWinSoundSystem` tocando simultaneamente (ativado quando game over é por portal da bruxa).

### Fix

Na função `Game.restart()` (linha 10370), adicionar stops para todos os players de música antes de `MusicSystem.stop()`:

```js
restart: function() {
  GameOverMusicSystem.stop();
  CombatMusicSystem.stop();
  DefeatMusicSystem.stop();
  VictoryMusicSystem.stop();
  MusicSystem.stop();
  Modals.hide();
  this.init();
}
```

Uma mudança de 4 linhas. Garante que qualquer música ativa (game over, combate, vitória, derrota) seja parada imediatamente ao reiniciar.

