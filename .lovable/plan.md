

## Bug: Segunda bomba não aparece como item visível

### Causa raiz

Quando a primeira bomba explode (linha 7793-7798), o loop destrói **todos** os itens na sala, incluindo o próprio item `bomba`:

```js
item.location = null;
item.isDestroyed = true;  // ← marca bomba como destruída permanentemente
```

Quando o Bombardeador tenta criar a segunda bomba (linha 8064), ele seta `GameState.items.bomba.location = bombardeador.location`, mas **nunca reseta `isDestroyed`**. Como toda renderização filtra `!item.isDestroyed`, a bomba fica invisível.

### Fix

**Arquivo:** `public/avenida-paulista.html`

**Mudança 1** — Na criação da bomba pelo Bombardeador (linha ~8064), resetar `isDestroyed`:

```js
GameState.items.bomba.location = bombardeador.location;
GameState.items.bomba.isDestroyed = false;  // ← adicionar
```

**Mudança 2** — Na explosão (linha 7793-7798), excluir o item `bomba` do loop de destruição, já que ele é tratado separadamente na linha 7809:

```js
Object.values(GameState.items).forEach(item => {
  if (item.location === bombLocation && item.id !== 'bomba') {
    item.location = null;
    item.isDestroyed = true;
  }
});
```

A mudança 2 é defensiva — evita que a bomba seja marcada como destruída duplamente. A mudança 1 é a correção principal.

