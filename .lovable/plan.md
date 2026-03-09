

## Plano: Fix MIDI + MP3 tocando juntas

**Arquivo:** `public/avenida-paulista.html`

**Causa raiz:** O wrapper `start()` do `_addMp3Layer`, ao encontrar um `blobUrl` válido, toca o MP3 mas **nunca chama `originalStop()` para parar o MIDI**. Se o MIDI estava tocando antes (de uma sessão anterior ou do fallback), ele continua junto com o MP3.

### Mudança única: Adicionar `originalStop()` antes de tocar MP3 (linha ~5574)

No branch onde `blobUrl` existe, chamar `originalStop()` para garantir que o MIDI pare:

```js
if (blobUrl) {
  // PARAR MIDI antes de tocar MP3
  originalStop();

  // Usar MP3
  if (!audio) {
    audio = new Audio(blobUrl);
    audio.loop = loop;
  }
  // ... resto igual
```

Isso é uma linha adicionada. O `originalStop()` (MusicSystem.stop original) limpa oscillators, clearTimeout do loop, e seta `isPlaying = false`. Depois o wrapper seta `isPlaying = true` novamente para o MP3.

