

## Fix: MP3s não tocam — remover async do playback

### Causa raiz

`player.start` (linha 5575) é `async` e faz `await Mp3Cache.load(url)` antes de `audio.play()`. O `await` quebra a cadeia de user gesture do navegador → autoplay bloqueado → silêncio total. Isso acontece mesmo com cache, porque qualquer `await` cede o controle.

### Solução

**Arquivo:** `public/avenida-paulista.html`

#### 1. Pré-criar Audio elements no `preloadAll()` (linhas 5532-5550)

Adicionar um novo Map `_mp3AudioElements`. No `preloadAll()`, após obter cada blobUrl, criar `new Audio(blobUrl)` com `preload='auto'` e guardar no Map.

#### 2. Tornar `start()` síncrono (linhas 5575-5621)

Remover `async`. Em vez de `await Mp3Cache.load()`, buscar o Audio pré-criado do Map. Se existir → `audio.play()` imediatamente (síncrono, dentro do user gesture). Se não existir → fallback MIDI imediato.

```js
player.start = function() {
  if (audio && !audio.paused && player._mp3Active) return;
  if (!audio) {
    const cached = _mp3AudioElements.get(trackKey);
    if (cached) { audio = cached; audio.loop = loop; }
  }
  if (audio) {
    // sync volume, play immediately
    audio.play().catch(() => { originalStart(); });
  } else {
    originalStart();
  }
};
```

#### 3. Fallback de primeiro clique (após linha 5660)

Listener `{ once: true }` no `click` do document para retry `preloadAll()` caso o Map esteja vazio (ex: se o preload inicial falhou por timing).

