

## Bug: MIDI e MP3 tocando simultaneamente

### Causa raiz encontrada

`MusicSystem.init()` é chamado **duas vezes em sequência rápida**:

1. Linha 11044: `MusicSystem.init()` → `this.start()` → cria `Audio A`, chama `A.play()` (retorna Promise pendente)
2. Linha 11047: `Game.init()` → linha 9818: `MusicSystem.stop()` → faz `A.pause()` **antes do Promise resolver**
3. Linha 9821: `MusicSystem.init()` → `this.start()` → cria `Audio B`, chama `B.play()` → MP3 tocando ✓

**O problema:** O `A.play()` Promise **rejeita com AbortError** (audio pausado antes de iniciar). O `.catch()` na linha 5603-5606 dispara:

```js
.catch(function(err) {
  originalStart();  // ← INICIA MIDI como "fallback"!
});
```

Resultado: Audio B (MP3) e MIDI (via originalStart) tocam **ao mesmo tempo**.

O mesmo padrão pode ocorrer em qualquer transição rápida (exploração → combate).

### Fix (3 mudanças cirúrgicas)

**1. Remover fallback MIDI do `.catch()`** (linha 5603-5606):

Quando `window._useMP3` é true, NUNCA iniciar MIDI. Se MP3 falhar, silêncio é melhor que sobreposição.

```js
.catch(function(err) {
  console.warn('[Mp3Layer] MP3 play failed:', err);
  // Sem fallback MIDI — evita sobreposição
});
```

**2. Remover fallback MIDI do blobUrl missing** (linha 5592):

Guardar com `if (!window._useMP3)`:

```js
if (!blobUrl) {
  if (!window._useMP3) { originalStart(); }
  return;
}
```

**3. Remover `MusicSystem.init()` duplicado** (linha 11044):

`Game.init()` na linha seguinte (11047) já chama `MusicSystem.stop()` + `MusicSystem.init()`. A chamada na linha 11044 é redundante e causa a race condition.

```js
// Remover linha 11044: MusicSystem.init();
```

### Resultado

- `.catch()` nunca inicia MIDI quando MP3 está ativo
- Chamadas rápidas em sequência não causam race condition
- Transições (exploração ↔ combate) ficam limpas

