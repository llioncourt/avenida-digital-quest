

## Correção: Safety timeout cortando a música

### Problema
O safety timeout está em `90000ms` (90 segundos / 1:30), mas a animação do crawl agora dura 340 segundos. Quando o timeout dispara, chama `this.complete()` que para a música prematuramente.

### Solução em `public/avenida-paulista.html`

**Linha ~10291-10296**: Atualizar o safety timeout para ser maior que a duração do crawl (340s + margem).

Trocar:
```js
this.safetyTimeout = setTimeout(() => {
  if (!this.isComplete) {
    console.warn('IntroSystem: safety timeout triggered');
    this.complete();
  }
}, 90000);
```

Por:
```js
this.safetyTimeout = setTimeout(() => {
  if (!this.isComplete) {
    console.warn('IntroSystem: safety timeout triggered');
    this.complete();
  }
}, 350000); // 350s (10s após os 340s do crawl)
```

Isso garante que o crawl e a música rodem os 340 segundos completos antes do timeout de segurança.

