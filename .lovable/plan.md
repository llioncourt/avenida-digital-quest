

## Diagnóstico: MP3s estão funcionando no preview

Testei no browser automatizado e **todos os 9 MP3s carregam com sucesso**:

```text
[Mp3Cache] Loaded: music/AVP-Theme.mp3
[Mp3Cache] Loaded: music/AVP-Combat.mp3
[Mp3Cache] Loaded: music/AVP-Intro.mp3
[Mp3Cache] Loaded: music/AVP-Combat-Victory.mp3
[Mp3Cache] Loaded: music/AVP-Combat-Defeat.mp3
[Mp3Cache] Loaded: music/AVP-Witch-Chanting.mp3
[Mp3Cache] Loaded: music/AVP-Game-Over.mp3
[Mp3Cache] Loaded: music/AVP-Witch-Summon.mp3
[Mp3Cache] Loaded: music/AVP-Witch-Win.mp3
[Mp3Cache] Preload complete
```

A mudança do Cache API para Map em memória **resolveu o problema**. Os arquivos em `public/music/` estão sendo servidos corretamente.

### Possível causa da sua percepção

O site publicado em `avpweb.lovable.app` pode estar com uma versão anterior cacheada (antes do fix do Map). Precisa republicar para a versão mais recente chegar ao site publicado.

### Plano: Adicionar logs visuais temporários para confirmar

Para você poder confirmar que está funcionando ao testar manualmente, vou adicionar um **indicador visual temporário** no canto da tela que mostra se os MP3s carregaram:

1. No `preloadAll()`, após carregar todos os MP3s, exibir um badge discreto no canto inferior esquerdo por 3 segundos: "🎵 MP3s OK" (verde) ou "⚠️ MP3 FAIL" (vermelho)
2. No `_addMp3Layer.start()`, logar `[Mp3Layer] Playing MP3: <trackKey>` (já existe) — sem mudança
3. Adicionar um `console.log` no `audio.play().then()` confirmando reprodução

Isso vai dar certeza visual de que os MP3s estão sendo carregados E reproduzidos.

### Alterações em `public/avenida-paulista.html`

- **~5 linhas** no `preloadAll()` — adicionar badge visual temporário
- **~2 linhas** no `_addMp3Layer` start — log de confirmação de playback

