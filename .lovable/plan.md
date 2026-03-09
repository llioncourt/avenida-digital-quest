

## Integrar MP3 "AVP Witch Chanting" no evento da Bruxa

Sem criar player novo. Usar diretamente o sistema `Mp3Cache` + `<audio>` inline no `processWitchWord`, com fallback para o `SoundSystem.playDarkMagic()` que já existe.

### Alterações em `public/avenida-paulista.html`

**1. Adicionar `witchChanting` ao `MP3_TRACKS` (linha 5116)**
```js
victory: 'AVP Combat Victory.mp3',
witchChanting: 'AVP Witch Chanting.mp3'
```
Isso garante que o MP3 seja pré-cacheado pelo `Mp3Cache.preloadAll()` automaticamente.

**2. Modificar `processWitchWord` (linha 7371-7387)**

Dentro do bloco `if (Utils.random() < chance)`, substituir a chamada direta a `SoundSystem.playDarkMagic()` por uma tentativa async de tocar o MP3 via `Mp3Cache.load()`. Se o MP3 estiver disponível (cache ou rede), toca com `new Audio()`. Se não, faz fallback para `SoundSystem.playDarkMagic()` (o efeito MIDI/synth atual).

```js
if (Utils.random() < chance) {
  GameState.witchWords++;
  GameState.lastWitchWordTime = GameState.time;
  ScreenEffects.flash();

  // Tentar MP3, fallback para efeito synth
  (async () => {
    const blobUrl = await Mp3Cache.load(MP3_TRACKS.witchChanting);
    if (blobUrl) {
      const a = new Audio(blobUrl);
      if (MusicSystem.musicGain) a.volume = MusicSystem.musicGain.gain.value;
      a.play().catch(() => SoundSystem.playDarkMagic());
    } else {
      SoundSystem.playDarkMagic();
    }
  })();

  // ... mensagens continuam iguais
}
```

### Resumo
- Nenhum player novo criado
- MP3 priorizado, fallback para o efeito synth existente
- Cache offline funciona via `Mp3Cache` já implementado
- 2 pontos de edição no arquivo

