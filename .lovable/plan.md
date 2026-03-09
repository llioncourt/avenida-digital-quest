

## Botão "Iniciar" + nova música no text crawl

### Contexto
Browsers bloqueiam autoplay sem interação. A solução é adicionar uma tela de "Iniciar" antes do crawl, garantindo que qualquer áudio subsequente funcione sem restrições.

### Alterações em `public/avenida-paulista.html`

**1. Adicionar nova track ao `MP3_TRACKS` (~linha 5128)**

```js
witchWin: 'AVP-Witch-Win.mp3',
introCrawl: 'AVP-Intro.mp3'   // ← novo (você precisará fazer upload do arquivo)
```

**2. Adicionar tela de início no HTML (~linha 2180)**

Antes do `intro-container`, inserir um overlay com botão "INICIAR":

```html
<div id="start-screen" style="position:fixed; inset:0; z-index:10000; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer;" onclick="StartScreen.start()">
  <h1 style="color:#FFD700; font-family:'Press Start 2P',monospace; font-size:2rem; text-shadow:0 0 20px #FFD700;">AVENIDA PAULISTA</h1>
  <p style="color:#aaa; margin-top:2rem; font-size:1.2rem; animation:pulse 2s infinite;">▶ CLIQUE PARA INICIAR</p>
</div>
```

**3. Criar `StartScreen` object no JS (~antes do IntroSystem)**

```js
const StartScreen = {
  start: function() {
    document.getElementById('start-screen').remove();
    IntroSystem.init();
  }
};
```

**4. Modificar `DOMContentLoaded` (~linha 10294)**

Trocar `IntroSystem.init()` por nada — o `StartScreen.start()` já chama `IntroSystem.init()`.

**5. Modificar `IntroSystem.init()` (~linha 10244-10246)**

Trocar a música do crawl: em vez de `MusicSystem.init()` (que toca AVP-Theme), tocar a nova MP3 diretamente:

```js
// Tocar música da intro (nova track)
(async () => {
  const blobUrl = await Mp3Cache.load(MP3_TRACKS.introCrawl);
  if (blobUrl) {
    IntroSystem._introAudio = new Audio(blobUrl);
    IntroSystem._introAudio.volume = 0.8;
    IntroSystem._introAudio.play().catch(() => {});
  }
})();
```

**6. Modificar `IntroSystem.complete()` (~linha 10265)**

Parar a música da intro antes de iniciar o jogo:

```js
if (this._introAudio) {
  this._introAudio.pause();
  this._introAudio = null;
}
```

### Resultado
- Usuário vê tela preta com "CLIQUE PARA INICIAR"
- Clique = interação do usuário → libera autoplay para toda a sessão
- Text crawl inicia com música nova (AVP-Intro.mp3)
- Ao terminar/pular crawl, música da intro para e tema do jogo começa normalmente

### Pendência
Você precisará fazer upload do arquivo `AVP-Intro.mp3` na pasta `public/`.

