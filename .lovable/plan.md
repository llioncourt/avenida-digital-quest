

## Correção: AVP-Intro.mp3 não toca

### Problema
Duas causas prováveis:

1. **Cache com versão vazia**: O arquivo `AVP-Intro.mp3` era vazio antes do upload. O `Mp3Cache` usa Cache API (`avp-music-v1`) e pode ter cacheado a versão vazia/com erro. Próximas requisições retornam o cache antigo.

2. **Erro silenciado**: O `.catch(() => {})` no `play()` engole qualquer erro, e não há log se `blobUrl` for `null`.

### Solução em `public/avenida-paulista.html`

**1. Incrementar versão do cache** (~linha 5138)

Trocar `avp-music-v1` para `avp-music-v2` para forçar re-download de todos os MP3s (incluindo o novo arquivo real):

```js
const MP3_CACHE_NAME = 'avp-music-v2';
```

**2. Adicionar logs de debug** (~linha 10254-10262)

Trocar o bloco de reprodução para incluir logs que ajudem a diagnosticar:

```js
(async () => {
  console.log('[IntroSystem] Loading intro music...');
  const blobUrl = await Mp3Cache.load(MP3_TRACKS.introCrawl);
  console.log('[IntroSystem] blobUrl:', blobUrl);
  if (blobUrl) {
    IntroSystem._introAudio = new Audio(blobUrl);
    IntroSystem._introAudio.volume = 0.8;
    IntroSystem._introAudio.play().catch(e => console.error('[IntroSystem] Play error:', e));
  } else {
    console.warn('[IntroSystem] Failed to load intro music');
  }
})();
```

### Resultado
O cache antigo (possivelmente com arquivo vazio) será invalidado, forçando o download do novo MP3 real. Os logs ajudarão a identificar problemas futuros.

