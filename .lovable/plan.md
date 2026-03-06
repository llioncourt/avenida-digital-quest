

# Fix: Crafting Mode Não Atualiza Inventário

## Problema

O `toggleCraftMode` e `craftSelect` chamam `UI.updateInventory()`, mas **não existe objeto `UI`**. O método `updateInventory` pertence ao objeto `Render`. Por isso o inventário só atualiza ao mudar de sala (quando `Render.update()` é chamado).

## Correção

Substituir todas as chamadas `UI.updateInventory()` por `Render.updateInventory()` nas funções de crafting:

- Linha 9123: `UI.updateInventory()` → `Render.updateInventory()`
- Linha 9150: `UI.updateInventory()` → `Render.updateInventory()`
- Linha 9163: `UI.updateInventory()` → `Render.updateInventory()`

Também na linha 8011 dentro de `updateInventory` (reset quando vazio): `this.updateCraftUI()` → `Game.updateCraftUI()` (pois `this` é `Render`, não `Game`).

4 linhas alteradas, zero linhas novas.

