

# 3 Ajustes na Bomba: Karma, Visibilidade e Descrição

## 1. Karma positivo ao desarmar bomba (~linha 5497)
Após `GameState.armedBomb = null;`, adicionar `Karma.change(10, 'Desarmou uma bomba');` na função `kit_bomba`. Isso recompensa o jogador por desarmar.

## 2. Bomba armada visível como item na sala (~linha 7315)
Quando o Bombardeador arma a bomba, setar também `GameState.items.bomba.location = bombardeador.location;` para que ela apareça no chão da sala (visível ao jogador que entrar). Quando a bomba explode (~linha 7074), setar `GameState.items.bomba.location = null;` para removê-la.

Obs: a bomba já tem `startsInWorld: false` e `location: null`. Ao dar location, ela aparecerá normalmente como item na sala.

## 3. Alterar descrição da bomba (~linha 2633)
De: `'Uma bomba poderosa. Ao usar, você a arma com um timer de 10-20 turnos. MATA TODOS no local quando explode!'`
Para: `'Uma bomba fabricada pelo Bombardeador. Use o KIT BOMBA para desarmá-la antes que exploda! Não pode ser armada pelo jogador.'`

3 locais editados, ~5 linhas alteradas no total.

