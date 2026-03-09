

## Problema

Na linha 8309, quando o vendedor é neutro (`char.isNeutral && char.id === 'vendedor'`), o botão é configurado apenas como `vendorTrade` e faz `continue`, pulando completamente o caminho `showCharacter`. Isso significa que o jogador nunca vê o modal com o botão "⚠️ Atacar".

## Solução

Modificar o botão do vendedor para ter **duas ações**: trocar e atacar. Duas abordagens possíveis:

**Abordagem escolhida**: Ao clicar no vendedor, abrir o `showCharacter` normal (que já tem o botão de ataque para neutros na linha 9190), mas **adicionar um botão de troca** ao modal do personagem.

### Alterações

**1. `showCharacter` (linha ~9170-9197)**: Adicionar botão de troca quando `charId === 'vendedor'` e o vendedor ainda é neutro:

```js
// Dentro do content, antes do botão Fechar:
let tradeButton = '';
if (charId === 'vendedor' && char.isNeutral && char.isAlive) {
  tradeButton = `<button class="btn" style="border-color:var(--accent-gold);color:var(--accent-gold);" onclick="Modals.hide(); VendorTrade.openTradeModal();">🛒 Trocar</button>`;
}
```

**2. Botão na UI (linhas 8308-8318)**: Remover o `continue` e deixar o vendedor usar a mesma lógica de `showCharacter` dos outros personagens, mas mantendo o ícone/estilo especial:

```js
if (char.isNeutral && char.id === 'vendedor') {
  btn.dataset.action = 'showCharacter';  // abre modal com ataque
  btn.dataset.charId = char.id;
  btn.className = 'btn btn-character stagger-in';
  btn.style.borderColor = 'var(--accent-gold)';
  btn.style.color = 'var(--accent-gold)';
  btn.title = char.description || '';
  btn.textContent = '🛒 ' + char.name;
  frag.appendChild(btn);
  nextCache.set(char.id, btn);
  continue;
}
```

### Arquivo

`public/avenida-paulista.html`:
- Linhas 8308-8318: Mudar `vendorTrade` → `showCharacter`
- Linhas 9170-9197: Adicionar botão de troca no modal do vendedor

