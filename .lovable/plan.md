

## Problemas Identificados

### 1. Ícone aparece desligado mas música toca
O wrapper `_addMp3Layer` sobrescreve `player.start()` mas **não chama `updateButton()`** após iniciar o MP3. O `isPlaying = true` é setado (linha 5222), mas o ícone não é atualizado.

### 2. Volume 0% reinicia a música
`setVolume(0)` chama `this.stop()` (linha 5078), que aciona o wrapper com `stoppedManually = true` + `audio.currentTime = 0`. Deveria apenas **pausar** sem resetar.

---

## Solução

### Alterações em `_addMp3Layer` (linhas ~5192-5246)

1. **Chamar `updateButton()`** após `audio.play()` iniciar com sucesso
2. **Adicionar método `player.pause()`** que só pausa o áudio sem resetar `currentTime`

### Alterações em `MusicSystem.setVolume` (linhas ~5073-5084)

1. Quando `val === 0`: chamar `player.pause()` ao invés de `player.stop()`
2. Quando `val > 0` e estava pausado: chamar `audio.play()` para retomar

### Código simplificado:

```js
// Em _addMp3Layer — adicionar método pause
player.pause = function() {
  if (audio && player._mp3Active) {
    audio.pause();
    // NÃO reseta currentTime
  }
  player.isPlaying = false;
  // NÃO chama originalStop (mantém MIDI scheduledOscs)
};

// Em player.start — chamar updateButton
audio.play().then(() => {
  if (player.updateButton) player.updateButton();
}).catch(...)

// Em MusicSystem.setVolume
if (val === 0) {
  this.pause();  // não stop()
  if (btn) btn.textContent = '🔕';
} else {
  if (audio && audio.paused) audio.play();  // retoma
  if (btn) btn.textContent = '🎵';
}
```

---

## Arquivos a editar

`public/avenida-paulista.html`:
- Linhas 5192-5255: `_addMp3Layer` — adicionar `pause()` e `updateButton()` call
- Linhas 5073-5084: `MusicSystem.setVolume` — usar `pause()` ao invés de `stop()`

