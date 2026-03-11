

## Pré-carregamento de Imagens durante a Intro

### Contexto
Hoje o `StartScreen.start()` carrega MP3s com spinner antes do crawl. Queremos aproveitar esse mesmo momento para pré-carregar todas as imagens (.webp) em paralelo, deixando-as no cache do browser.

### Assets a pré-carregar
- **16 rooms** (.webp): antena, avenida_brigadeiro, avenida_paulista_leste/oeste, avenida_santos, ceu_cidade, cinema, colegio, distrito_italiano, livraria, masp, nove_julho_norte/sul, rua_augusta, shopping, subsolo_masp, tunel
- **21 textures** (.webp): todos os `bg_*.webp`
- **9 portraits** (.webp): todos os `*_neutro.webp`

Total: ~46 imagens webp.

### Alterações em `public/avenida-paulista.html`

**1. Nova função `ImagePreloader.preloadAll()` (~20 linhas)**

Cria um objeto `ImagePreloader` com array de todos os paths webp e uma função `preloadAll()` que faz `new Image()` + `src =` para cada, retornando `Promise.allSettled()` (não bloqueia se alguma falhar).

```javascript
const ImagePreloader = {
  preloadAll: function() {
    const paths = [
      // rooms
      ...['antena','avenida_brigadeiro','avenida_paulista_leste','avenida_paulista_oeste',
          'avenida_santos','ceu_cidade','cinema','colegio','distrito_italiano','livraria',
          'masp','nove_julho_norte','nove_julho_sul','rua_augusta','shopping','subsolo_masp','tunel']
        .map(r => 'rooms/' + r + '.webp'),
      // textures
      ...['acai','asa_delta','bomba','cafe','cera_magica','conjunto_musical','coxinha','detector',
          'energetico','escudo','escudo_grafitado','espada','espada_encantada','grafite',
          'guarda_chuva','hipnodisco','inv','kit_bomba','kit_saude','lanterna','livro',
          'mapa_antigo','mascara_gas','mochila','pandeiro','pastel','reliquia','seta_mortal','violao']
        .map(t => 'textures/bg_' + t + '.webp'),
      // portraits
      ...['01_player','02_feiticeiro','03_aguia','04_bombardeador','05_bruxa',
          '06_demonio','07_coruja','08_cachorro','09_vendedor']
        .map(p => 'portraits/' + p + '_neutro.webp')
    ];
    return Promise.allSettled(paths.map(src => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = resolve; // não bloqueia
      img.src = src;
    })));
  }
};
```

**2. Integrar no `StartScreen.start()` (~5 linhas)**

Após o `await Mp3Cache.ensureAll()`, rodar `ImagePreloader.preloadAll()` em paralelo. Atualizar o texto do spinner para "Carregando áudio e imagens...". O preload de imagens roda também no branch offline (são arquivos locais).

```javascript
start: async function() {
  var screen = document.getElementById('start-screen');
  screen.innerHTML = '...<p>Carregando...</p>...';

  // Carregar tudo em paralelo
  const imageLoad = ImagePreloader.preloadAll();

  if (navigator.onLine) {
    await Mp3Cache.ensureAll();
    window._useMP3 = true;
  }

  await imageLoad; // espera imagens terminarem

  screen.remove();
  IntroSystem.init();
}
```

O texto do spinner muda para "Carregando..." (genérico, cobre áudio + imagens).

