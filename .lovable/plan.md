
# Plano: Corrigir Clique no Minimapa

## Problema Identificado

O clique no minimapa nao funciona porque o codigo esta chamando uma funcao que NAO EXISTE:

```javascript
// Linha 2389 - ERRADO
roomEl.onclick = () => {
  Game.processAction(Actions.move(roomId));  // Actions.move NAO EXISTE!
};
```

A estrutura correta e:
- `Actions.moveTo(roomId)` - retorna o resultado da acao (linha 1686)
- `Game.move(roomId)` - wrapper que chama `processAction(Actions.moveTo())` (linha 2670)

## Solucao

### Arquivo: `public/avenida-paulista.html`

**Linha 2389:** Corrigir a chamada para usar `Actions.moveTo` em vez de `Actions.move`:

De:
```javascript
roomEl.onclick = () => {
  Game.processAction(Actions.move(roomId));
};
```

Para:
```javascript
roomEl.onclick = () => {
  Game.processAction(Actions.moveTo(roomId));
};
```

Alternativa (mais limpa):
```javascript
roomEl.onclick = () => {
  Game.move(roomId);
};
```

## Resumo

| Local | Alteracao |
|-------|-----------|
| Linha 2389 | Trocar `Actions.move` por `Actions.moveTo` (ou `Game.move`) |

## Resultado Esperado

1. Clicar em uma sala azul no minimapa move o jogador para la
2. A acao avanca o turno normalmente
3. O minimapa atualiza mostrando as novas saidas validas
