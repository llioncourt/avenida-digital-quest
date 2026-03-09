

## Diagnóstico

Após análise extensiva do código e testes no browser:

1. **Todos os 9 MP3s carregam com sucesso** (9/9 OK no preloadAll). O problema NÃO é de carregamento, é de **playback**.

2. **Problema da Exploração**: O `player.start()` (mp3 wrapper) não chama `SoundSystem.resume()` antes de `audio.play()`. O `start()` original do MIDI chamava `SoundSystem.resume()` (linha 5401), mas o wrapper do `_addMp3Layer` pula isso. Sem o `resume()`, o AudioContext pode estar suspenso e o browser pode recusar o play.

3. **Problema da Intro**: O async IIFE `(async () => { ... })()` na intro cria uma microtask boundary mesmo sem `await`. Embora o JS execute síncrono até o primeiro `await`, o wrapping em `async` pode causar problemas sutis com a detecção de user gesture em alguns browsers.

4. **`MusicSystem.init()` é `async` desnecessariamente** — não tem nenhum `await` dentro, mas o `async` pode confundir a cadeia de user gesture.

5. **Bug no `setVolume`**: Dentro de `_addMp3Layer`, o override de `setVolume` sempre modifica `MusicSystem.setVolume` (hardcoded), independente de qual player foi passado. Isso não é o problema principal, mas é um bug.

## Plano — arquivo `public/avenida-paulista.html`

### Mudança 1: Adicionar `SoundSystem.resume()` no wrapper mp3 (linha 5575)

O wrapper `player.start` precisa chamar `SoundSystem.resume()` no início, como o `start()` original fazia:

```js
player.start = function() {
  if (audio && !audio.paused && player._mp3Active) return;

  SoundSystem.resume(); // <-- ADICIONAR: desbloqueia AudioContext

  // Busca síncrona do cache em memória
  if (!blobUrl) {
    blobUrl = _mp3BlobCache.get(url) || null;
  }
  // ... resto igual
```

### Mudança 2: Remover `async` do `MusicSystem.init()` (linha 5375)

```js
init: function() {
  if (!this.isLoaded) _musicBase.init.call(this);
  this.start();
},
```

### Mudança 3: Intro — remover async IIFE, usar play direto (linhas 11021-11036)

```js
// Tocar música da intro (nova track)
console.log('[IntroSystem] Loading intro music...');
var introBlob = _mp3BlobCache.get(MP3_TRACKS.introCrawl) || null;
console.log('[IntroSystem] blobUrl:', introBlob);
if (introBlob) {
  IntroSystem._introAudio = new Audio(introBlob);
  IntroSystem._introAudio.volume = 0.8;
  IntroSystem._introAudio.play().catch(function(e) {
    console.error('[IntroSystem] Play error:', e);
  });
} else {
  // Fallback: carregar async (pode falhar por user gesture)
  Mp3Cache.load(MP3_TRACKS.introCrawl).then(function(b) {
    if (b) {
      IntroSystem._introAudio = new Audio(b);
      IntroSystem._introAudio.volume = 0.8;
      IntroSystem._introAudio.play().catch(function(e) {
        console.error('[IntroSystem] Fallback play error:', e);
      });
    }
  });
}
```

### Mudança 4: Fix `setVolume` dentro de `_addMp3Layer` (linha 5672)

Mudar de `MusicSystem.setVolume` para `player.setVolume`:

```js
const originalSetVolume = player.setVolume;
if (originalSetVolume) {
  player.setVolume = function(val) {
    originalSetVolume.call(player, val);
    if (audio && player._mp3Active) {
      audio.volume = val;
    }
  };
}
```

### O que NÃO muda
- `preloadAll()`, `Mp3Cache.load()` — intocados
- `stop()`, `pause()` — intocados
- Efeitos da bruxa — intocados
- Auto-switch MIDI→MP3 — intocado
- Paths dos MP3s — intocados

