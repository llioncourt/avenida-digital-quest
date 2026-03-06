

# Plano: Sistema de Crafting

## Conceito

Adicionar um botao "Combinar" no inventario que permite selecionar 2 itens para criar um novo item mais poderoso. Receitas tematicas que fazem sentido narrativo com os itens existentes.

## Receitas de Crafting

| Ingrediente 1 | Ingrediente 2 | Resultado | Efeito |
|---|---|---|---|
| Espada + Cera Magica | | **Espada Encantada** | ATK 25, DEF 5, peso 6 (cera remove peso + encanta) |
| Escudo + Grafite Magico | | **Escudo Grafitado** | DEF 18, reflete 5 de dano ao atacante |
| Kit Bomba + Lanterna | | **Detector** | Revela armadilhas + itens ocultos em salas adjacentes, peso 3 |
| Violao + Pandeiro | | **Conjunto Musical** | Pacifica inimigos + atrai aliados simultaneamente, peso 4 |
| Kit Saude + Cafe | | **Energetico Paulista** | Cura 50 HP + pula tempo, uso unico, peso 1 |
| Mascara Gas + Guarda-chuva | | **Traje Protetor** | DEF 10, imune a chuva/gas/queda, peso 3 |

## Implementacao Tecnica

### 1. Dados das receitas (~30 linhas)

Criar objeto `CRAFTING_RECIPES` com as combinacoes. Cada receita tem `ingredients` (array de 2 ids), `result` (id do novo item) e os dados do item resultante em `ITEMS_DATA`.

### 2. Adicionar novos itens ao ITEMS_DATA (~40 linhas)

Definir os 6 novos itens craftados com stats, descricoes e comportamentos.

### 3. Logica de crafting em Actions (~25 linhas)

Funcao `Actions.craft(itemId1, itemId2)` que:
- Verifica se ambos estao no inventario
- Busca receita correspondente (ordem nao importa)
- Remove os 2 ingredientes
- Adiciona o item resultante ao inventario e ao GameState.items
- Retorna mensagem de sucesso com efeito sonoro e flash visual

### 4. UI: Botao "Combinar" no inventario (~40 linhas)

- Adicionar botao "⚗️ Combinar" ao lado dos botoes existentes no inventario
- Ao clicar, entra em modo de selecao: "Selecione o 1o item" -> "Selecione o 2o item"
- Destaque visual nos itens selecionados (borda dourada)
- Se a combinacao existe, crafta. Se nao, mensagem "Esses itens nao combinam."
- Botao "Cancelar" para sair do modo combinacao

### 5. ItemUseHandlers para itens craftados (~20 linhas)

Handlers para itens usaveis craftados (Energetico Paulista, Conjunto Musical).

### 6. Achievement: "Alquimista" (~3 linhas)

Nova conquista: "Criar seu primeiro item craftado."

### 7. CSS para modo de selecao (~10 linhas)

Estilo `.craft-selected` com borda dourada pulsante para indicar item selecionado.

## Resumo

- ~170 linhas de codigo novo
- 6 receitas de crafting tematicas
- UI integrada ao inventario existente
- 1 novo achievement
- Nenhuma dependencia externa

