

# Conquistas em Tempo Real — Toast no Momento que Acontecer

## Visão Geral

Atualmente as conquistas só são verificadas no modal de fim de jogo. O plano é adicionar verificação contínua durante o gameplay, com um **toast animado** que aparece na tela quando uma conquista é desbloqueada.

## Conquistas e Quando Verificar

Das 6 conquistas, 3 podem ser detectadas em tempo real durante o jogo:

| Conquista | Trigger | Onde verificar |
|-----------|---------|----------------|
| 🎒 Colecionador | 8+ itens no inventário | Após pegar item (`Actions.pickup`) |
| 🤝 Diplomata | Demônio convertido + Feiticeiro hipnotizado | Após converter/hipnotizar NPC |
| 🗺️ Explorador | Todas as salas visitadas | Após mover (`Actions.move`) |

As outras 3 (Pacifista, Speedrunner, Sobrevivente) dependem de `GameState.victory`, então só podem ser avaliadas no fim — continuam no modal final.

## Implementação

### 1. CSS — Toast de conquista (animação slide-in/out)

Adicionar estilo `.achievement-toast` com animação que entra por cima, fica 3s, e sai. Visual dourado consistente com o tema de conquistas existente.

### 2. Função `Achievements.tryUnlock(key)`

Nova função que verifica se uma conquista específica **já foi desbloqueada nesta sessão**. Se não, salva e exibe o toast. Usa um set `Achievements.unlockedThisSession` para evitar toasts duplicados.

```javascript
unlockedThisSession: new Set(),
tryUnlock: function(key) {
  if (this.unlockedThisSession.has(key)) return;
  var saved = this.load();
  if (saved[key]) return; // já tinha de sessão anterior
  saved[key] = true;
  this.save(saved);
  this.unlockedThisSession.add(key);
  this.showToast(key);
},
showToast: function(key) {
  var def = this.definitions[key];
  // criar div com ícone + nome + desc, auto-remove após 4s
}
```

### 3. Hooks nos momentos certos

- **Colecionador**: em `Actions.pickup`, após adicionar item ao inventário, checar `if (GameState.playerInventory.length >= 8) Achievements.tryUnlock('colecionador')`
- **Diplomata**: onde o demônio é convertido e onde o feiticeiro é hipnotizado, checar se ambos são aliados e chamar `tryUnlock('diplomata')`
- **Explorador**: em `Actions.move`, após `GameState.visitedRooms.add()`, checar se `visitedRooms.size >= totalRooms`

### 4. `check()` continua funcionando

O `check()` no final do jogo não muda — ele ainda verifica todas as 6 conquistas (incluindo as 3 que dependem de vitória). Conquistas já desbloqueadas em tempo real simplesmente já estarão salvas.

## Resumo

- ~30 linhas de CSS para o toast animado
- ~25 linhas de JS para `tryUnlock` + `showToast`
- ~3 hooks de 2 linhas cada nos pontos de trigger

