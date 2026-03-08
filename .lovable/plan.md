

# Fix: Game Over inconsistente na Antena + Karma + Layout do Modal

## 1. Bug do Game Over (causa raiz)

O jogador morre na Antena (hp=0, isAlive=false), mas `moveTo` retorna `advanceTime: true`. Dentro de `advanceTime()`:

- **Linha 6916**: A regen da Relíquia Paulistana verifica `player.hp < player.maxHp` — como 0 < 100, cura o jogador de volta para hp=1, desfazendo a morte
- **Linha 7356**: `processAutoCombat` não verifica se o jogador está morto, então NPCs hostis ainda atacam um jogador morto, enfileirando combate desnecessário

Isso explica a inconsistência: com regen, o game over não aparece; sem regen, aparece.

### Correções:

**A.** Na morte da Antena (linha ~5994), setar `GameState.gameOver = true` diretamente, impedindo qualquer processamento subsequente de desfazer a morte.

**B.** Na regen (linha 6916), adicionar guard: `if (player.isAlive && Rules.hasEffect('regen'))` — jogador morto não regenera.

**C.** Em `processAutoCombat` (linha 7354), retornar imediatamente se `!player.isAlive` — não processar combate com jogador morto.

## 2. Karma ao pular da Antena

Na morte da Antena (linha ~5994), adicionar `Karma.change(-10, 'Pulou da Antena')` antes do return.

## 3. Conquistas em duas linhas no Game Over

Mudar `.achievement-grid` de `display: flex; flex-wrap: wrap` para `display: grid; grid-template-columns: repeat(5, auto)` — com 9 conquistas, isso gera 2 linhas (5+4). Manter `justify-content: center` e `gap: 0.35rem`.

## 4. Modal mais largo no desktop

Alterar `#modal` de `max-width: 500px` para `max-width: 650px` (linha 1227).

