

## Ajustar duração do text crawl para 340 segundos

### Alteração única em `public/avenida-paulista.html`

**Linha ~10252**: Trocar a duração da animação de `252s` para `340s`.

```js
crawl.style.animation = 'star-wars-crawl 340s linear forwards';
```

Isso faz o text crawl durar 5 minutos e 40 segundos, cobrindo praticamente toda a música de intro.

