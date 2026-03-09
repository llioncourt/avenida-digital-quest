

## Fix: MP3s Falling Back to MIDI

### Root Cause

`Mp3Cache.load()` wraps everything in `caches.open()` (Cache API). If `caches` is unavailable (iframe restrictions, privacy settings, certain browsers), the entire load fails silently and falls back to MIDI. The current code has no direct-fetch fallback path when Cache API is unavailable.

### Solution

Replace the Cache API approach with a simpler in-memory cache using a plain `Map`. Fetch MP3s directly via `fetch()` → `blob()` → `URL.createObjectURL()`, storing the blob URLs in memory. This removes the Cache API dependency entirely while keeping the same interface.

### Changes in `public/avenida-paulista.html`

**1. Replace `Mp3Cache` implementation (~lines 5211-5264)**

```javascript
const _mp3BlobCache = new Map();

const Mp3Cache = {
  async load(url) {
    if (!url) return null;
    if (_mp3BlobCache.has(url)) return _mp3BlobCache.get(url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn('[Mp3Cache] Fetch failed:', url, response.status);
        return null;
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      _mp3BlobCache.set(url, blobUrl);
      console.log('[Mp3Cache] Loaded:', url);
      return blobUrl;
    } catch (err) {
      console.warn('[Mp3Cache] Error:', url, err);
      return null;
    }
  },
  async preloadAll() {
    const urls = Object.values(MP3_TRACKS).filter(u => u);
    await Promise.all(urls.map(u => this.load(u)));
    console.log('[Mp3Cache] Preload complete');
  }
};
```

**2. Remove `MP3_CACHE_NAME` constant** (line 5211) — no longer needed.

**3. Simplify preload call (~line 5372)** — Remove the `if ('caches' in window)` guard since we no longer use Cache API:

```javascript
Mp3Cache.preloadAll();
```

### Why This Fixes It
- No dependency on `caches` API — works in all browser contexts
- `fetch()` works universally (same-origin, no CORS issues)
- In-memory cache avoids repeated fetches within the same session
- Parallel preload with `Promise.all` is faster than sequential

### Scope
- ~20 lines changed in Mp3Cache
- 1 line removed (MP3_CACHE_NAME)
- 1 line simplified (preload guard)

