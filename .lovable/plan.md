

## Integrar MP3 "AVP Witch Summon" na invocação do demônio

Mesmo padrão usado no `witchChanting`: tentar MP3 via `Mp3Cache`, fallback para `SoundSystem.playDemonSummon()`.

### Alterações em `public/avenida-paulista.html`

**1. Adicionar track ao `MP3_TRACKS` (linha 5117)**
```js
witchChanting: 'AVP Witch Chanting.mp3',
witchSummon: 'AVP Witch Summon.mp3'
```

**2. Modificar invocação do demônio (linha 6651)**

Substituir `SoundSystem.playDemonSummon();` por bloco async com fallback:
```js
(async () => {
  const blobUrl = await Mp3Cache.load(MP3_TRACKS.witchSummon);
  if (blobUrl) {
    const a = new Audio(blobUrl);
    if (MusicSystem.musicGain) a.volume = MusicSystem.musicGain.gain.value;
    a.play().catch(() => SoundSystem.playDemonSummon());
  } else {
    SoundSystem.playDemonSummon();
  }
})();
```

2 pontos de edição no arquivo.

