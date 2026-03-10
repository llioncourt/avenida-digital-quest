

## Separação completa MIDI vs MP3 — decisão no boot

### Conceito

Em vez do sistema híbrido atual (que tenta misturar MIDI e MP3 por player), a decisão é **binária e feita uma vez só** no `StartScreen.start()`:

- **Online** → engine MP3 exclusivo. MIDI nunca toca.
- **Offline** → engine MIDI exclusivo. MP3 nunca tenta carregar.

### Mudanças em `public/avenida-paulista.html`

**1. Flag global `window._useMP3`** (definida no StartScreen):

```js
window._useMP3 = false; // default MIDI
```

**2. `StartScreen.start()` reescrito:**

```js
start: async function() {
  var screen = document.getElementById('start-screen');

  if (navigator.onLine) {
    // Mostrar spinner e carregar TODAS as MP3s
    screen.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">' +
      '<div style="width:48px;height:48px;border:4px solid #FFD70044;border-top-color:#FFD700;border-radius:50%;animation:spin 1s linear infinite;"></div>' +
      '<p style="color:#FFD700;font-family:\'Press Start 2P\',monospace;font-size:0.8rem;">Carregando...</p></div>';

    await Mp3Cache.ensureAll(); // Carrega TODAS (não só critical)
    window._useMP3 = true;
  }
  // Offline: não mostra spinner, segue direto com MIDI

  screen.remove();
  IntroSystem.init();
}
```

**3. Novo método `Mp3Cache.ensureAll()`** — carrega todas as tracks e guarda blob URLs num Map reutilizável:

```js
// Map persistente: trackKey → blobUrl
const _blobUrlMap = new Map();

ensureAll: async function() {
  const keys = Object.keys(MP3_TRACKS);
  await Promise.all(keys.map(async (key) => {
    const blobUrl = await this.load(MP3_TRACKS[key]);
    if (blobUrl) {
      _blobUrlMap.set(key, blobUrl);
      _cachedTrackKeys.add(key);
    }
  }));
  console.log('[Mp3Cache] All tracks loaded:', [..._blobUrlMap.keys()]);
}
```

**4. `_addMp3Layer` simplificado** — sem async, sem fallback, sem flags complexas:

```js
function _addMp3Layer(player, trackKey, options = {}) {
  const loop = options.loop !== false;
  let audio = null;
  const originalStart = player.start.bind(player);
  const originalStop = player.stop.bind(player);

  player.start = function() {
    if (!window._useMP3) {
      // MIDI mode — ignora MP3 completamente
      originalStart();
      return;
    }

    // MP3 mode — ignora MIDI completamente
    SoundSystem.resume();
    if (audio) { audio.pause(); audio.currentTime = 0; }

    var blobUrl = _blobUrlMap.get(trackKey);
    if (!blobUrl) { originalStart(); return; } // safety fallback

    audio = new Audio(blobUrl);
    audio.loop = loop;
    audio.volume = MusicSystem.musicGain
      ? MusicSystem.musicGain.gain.value
      : (MusicSystem.volume || 1.0);
    player.isPlaying = true;
    audio.play().catch(function() { originalStart(); });
  };

  player.pause = function() {
    if (audio) { audio.pause(); }
    originalStop();
    player.isPlaying = false;
  };

  player.stop = function() {
    if (audio) { audio.pause(); audio.currentTime = 0; }
    originalStop();
    player.isPlaying = false;
  };

  // Volume sync
  const originalSetVolume = player.setVolume;
  if (originalSetVolume) {
    player.setVolume = function(val) {
      originalSetVolume.call(player, val);
      if (audio) audio.volume = val;
    };
  }
}
```

### Resultado

- Zero flags `_mp3Active`, `_stopped`, zero `.then()` dentro de `start()`
- MIDI e MP3 nunca tocam juntos — decisão feita uma vez no boot
- Todas as MP3s carregadas antes do jogo começar (spinner na tela preta)
- Offline: experiência idêntica à anterior (MIDI puro)

