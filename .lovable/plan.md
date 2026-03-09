

## Deixar o text crawl 50% mais lento

### Alteração única em `public/avenida-paulista.html`

**Linha ~10252**: Trocar a duração da animação de `168s` para `252s` (168 × 1.5 = 252 segundos = 4min12s).

```js
crawl.style.animation = 'star-wars-crawl 252s linear forwards';
```

Isso faz o texto rolar 50% mais devagar, encaixando melhor nos ~5 minutos da música.

