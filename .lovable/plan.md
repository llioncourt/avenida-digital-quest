

# Permitir Navegação para o Céu da Cidade pelo Minimapa

## Problema
Desde que a seção de saídas foi removida, o minimapa é a única forma de navegar. Porém, o "Céu da Cidade" é marcado como `blocked-exit` (vermelho) quando o jogador não tem a Asa Delta, impedindo o clique. A lógica de "pulo mortal" já existe dentro de `Game.move()` -- ela deveria ser acionada normalmente.

## Solução
Tratar a saída da Antena para o Céu da Cidade como um caso especial no minimapa: quando a sala atual for `antena` e a saída for `ceu_cidade`, marcar como `valid-exit` (clicável) mesmo sem a Asa Delta, permitindo que o `Game.move()` cuide da morte/sucesso.

## Mudança

**Arquivo**: `public/avenida-paulista.html`

Na lógica de renderização do minimapa (por volta da linha 3506-3518), ao avaliar se uma saída é `blocked-exit` ou `valid-exit`, adicionar uma exceção:

- Se a sala atual é `antena` e a saída é `ceu_cidade`, sempre marcar como `valid-exit` (pois o jogo permite o pulo -- com consequências)

Isso mantém o comportamento de morte irônica intacto, apenas desbloqueando o clique no mapa.

## Detalhes Tecnicos

Dentro do bloco que verifica `needsFlight || blockedByShield`:

```javascript
// Exceção: Antena → Céu é sempre clicável (Game.move cuida da morte)
const isDeadlyJump = GameState.playerLocation === 'antena' && roomId === 'ceu_cidade';

if ((needsFlight || blockedByShield) && !isDeadlyJump) {
  roomEl.classList.add('blocked-exit');
  // ...
} else {
  roomEl.classList.add('valid-exit');
  // ...
}
```

## Escopo
- Uma pequena alteração condicional na renderização do minimapa
- Zero impacto na lógica de jogo existente
