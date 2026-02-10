

# Plano: Musica de Game Over + Feedback do Escudo do MASP

## Resumo

Duas alteracoes:
1. **Parar a musica de fundo ao fim do jogo** (vitoria ou derrota) e deixar silencio (placeholders para futuras musicas)
2. **Dar feedback textual** ao clicar no Teto do MASP bloqueado pelo escudo no minimapa

---

## Alteracao 1: Musica no Game Over

**Onde:** Funcao `Modals.showGameOver()` (linha ~4211) e `Rules.checkGameOver()` (linha ~2499)

**O que fazer:**
- Em `Rules.checkGameOver()`, quando o jogo termina (derrota ou vitoria), chamar `MusicSystem.stop()` para parar a musica de fundo
- Adicionar dois metodos placeholder no `MusicSystem`: `playDefeatMusic()` e `playVictoryMusic()` que por enquanto nao fazem nada (apenas um `console.log` indicando que futuramente terao musica)
- Chamar `playDefeatMusic()` nas derrotas e `playVictoryMusic()` na vitoria, logo apos parar a musica principal

**Resultado:** Ao morrer ou vencer, a musica de fundo para e fica silencio. Os placeholders ficam prontos para receber musicas no futuro.

---

## Alteracao 2: Feedback ao clicar no Teto do MASP com escudo

**Onde:** Handlers de clique/tap no minimapa (linhas ~3963-3967 para mouse, ~4116-4119 para touch)

**O que fazer:**
- Nos dois handlers (mouseup e touchend), quando o clique/tap e detectado como "clique rapido" em uma sala, alem de verificar `valid-exit`, tambem verificar se e `blocked-exit`
- Se for `blocked-exit`, chamar `Game.move(this.dragTarget)` que ja retorna a mensagem de bloqueio ("Um ESCUDO DE FORCA magico bloqueia a subida!") via `Actions.moveTo()`, ou alternativamente adicionar uma mensagem ao Log diretamente
- A abordagem mais limpa: se `roomEl.classList.contains('blocked-exit')`, adicionar uma mensagem no Log via `Log.add()` com o texto apropriado, sem consumir turno

**Resultado:** Ao clicar no Teto do MASP quando o escudo esta ativo, o jogador recebe feedback textual no Log explicando o bloqueio.

---

## Detalhes Tecnicos

### MusicSystem - novos metodos placeholder

```javascript
playDefeatMusic: function() {
  // TODO: Adicionar musica de derrota
  console.log('MusicSystem: Defeat music placeholder');
},

playVictoryMusic: function() {
  // TODO: Adicionar musica de vitoria
  console.log('MusicSystem: Victory music placeholder');
}
```

### checkGameOver - parar musica

Nas 3 condicoes de fim de jogo (HP <= 0, witchWords >= 4, bruxa morta):
- Adicionar `MusicSystem.stop()` antes dos sons de derrota/vitoria
- Chamar o placeholder correspondente (`playDefeatMusic` ou `playVictoryMusic`)

### Minimap click handlers - feedback do escudo

Nos dois pontos (mouseup linha ~3963, touchend linha ~4116), adicionar um `else if` apos o check de `valid-exit`:

```javascript
if (roomEl.classList.contains('valid-exit')) {
  Game.move(this.dragTarget);
} else if (roomEl.classList.contains('blocked-exit')) {
  const room = GameState.rooms[this.dragTarget];
  const msg = this.dragTarget === 'teto_masp' && !GameState.forceShieldDown
    ? '🛡️ Um escudo de força mágico bloqueia o acesso! Derrote o Feiticeiro para removê-lo.'
    : '✈️ Você precisa voar para acessar ' + (room ? room.name : 'este local') + '.';
  Log.add(msg, 'warning');
}
```

