
# Bug: Seta Mortal mata a Bruxa mas o jogo nao termina

## Causa Raiz

No botao de selecao de alvo da Seta Mortal (linha ~4290), o `onclick` chama:

```
Game.useWithTarget('seta_mortal', targetId); Modals.hide();
```

O problema e a sequencia de execucao:
1. `Game.useWithTarget` processa a acao, mata a bruxa, e `checkGameOver` detecta a vitoria e chama `Modals.showGameOver` (mostra o modal de vitoria)
2. Logo em seguida, `Modals.hide()` executa e **fecha o modal de vitoria** que acabou de ser aberto

O modal de fim de jogo aparece e desaparece instantaneamente.

## Correcao

**Arquivo**: `public/avenida-paulista.html`

Alterar o `onclick` dos botoes da Seta Mortal para **nao chamar `Modals.hide()` depois**, usando a mesma logica que ja existe no `attackAndClose` (linha ~4350):

```javascript
// Antes (bugado):
onclick="Game.useWithTarget('seta_mortal', '${t.id}'); Modals.hide();"

// Depois (corrigido):
onclick="Game.useSetaAndClose('${t.id}');"
```

Criar uma funcao `useSetaAndClose` no objeto `Game` que fecha o modal **somente se o jogo nao acabou**:

```javascript
useSetaAndClose: function(targetId) {
  this.processAction(Actions.useItem('seta_mortal', targetId));
  if (!GameState.gameOver) {
    Modals.hide();
  }
}
```

Mesma abordagem ja usada em `attackAndClose`. Uma mudanca simples de 2 pontos no arquivo.
