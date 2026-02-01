
# Plano: Corrigir Modal de Fim de Jogo ao Derrotar a Bruxa

## Problema Identificado

Quando você mata a bruxa através do botão "Atacar" no modal de personagem, há um conflito de execução:

```text
Botão onclick: "Game.attack('bruxa'); Modals.hide();"
                      │                    │
                      ▼                    ▼
              Executa ataque         Fecha o modal
              Mata a bruxa                 │
              Mostra Game Over ────────────┘
                                    (fecha tudo!)
```

O `Modals.hide()` está sendo chamado **depois** de `Game.attack()`, que por sua vez chama `Modals.showGameOver()`. Resultado: o modal de vitória aparece e é imediatamente fechado.

## Solucao

### Arquivo: `public/avenida-paulista.html`

**Alteracao 1 - Linha 2515**

Modificar o botao de atacar no modal do personagem para **nao chamar `Modals.hide()` diretamente**. Em vez disso, deixar que o `Game.attack()` decida se deve fechar o modal ou mostrar o game over.

De:
```javascript
${!char.isAlly ? `<button class="btn btn-danger" onclick="Game.attack('${char.id}'); Modals.hide();">Atacar</button>` : ''}
```

Para:
```javascript
${!char.isAlly ? `<button class="btn btn-danger" onclick="Game.attackAndClose('${char.id}')">Atacar</button>` : ''}
```

**Alteracao 2 - Adicionar nova funcao em Game (aproximadamente linha 2718)**

Criar uma funcao que executa o ataque e so fecha o modal se o jogo NAO terminou:

```javascript
attackAndClose: function(charId) {
  this.processAction(Actions.attack(charId));
  // So fecha o modal se o jogo NAO acabou (game over mostra seu proprio modal)
  if (!GameState.gameOver) {
    Modals.hide();
  }
},
```

## Resumo das Mudancas

| Local | Alteracao |
|-------|-----------|
| Linha 2515 | Trocar `Game.attack(); Modals.hide()` por `Game.attackAndClose()` |
| Linha ~2718 | Adicionar nova funcao `attackAndClose()` que verifica `gameOver` |

## Resultado Esperado

1. Voce clica em "Atacar" no modal do personagem
2. O ataque e processado
3. Se a bruxa morrer, `checkGameOver()` retorna vitoria
4. `showGameOver()` exibe o modal de vitoria
5. O modal NAO e fechado porque `GameState.gameOver` e `true`
6. Usuario ve o resumo completo da partida e o botao "Jogar Novamente"
