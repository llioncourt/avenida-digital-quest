

# Indicador de Bomba na UI + Restrição do Subsolo do MASP

## 1. Ícone de Bomba ao lado do Diário

Adicionar um botão `💣` à esquerda do botão `📓` (linha ~1970) que:
- Só aparece quando `GameState.armedBomb !== null`
- No hover, mostra um tooltip customizado com:
  - **Localização** da bomba (nome da sala)
  - **Turnos restantes** até explodir
  - **Distância mínima** (em turnos/salas) do jogador até a bomba via BFS

### Implementação

**CSS**: Criar classe `.bomb-indicator` (estilo similar ao `.journal-btn`) e `.bomb-tooltip` (tooltip posicionado absolutamente, estilo consistente com o tema do jogo).

**JS**: 
- Criar função `BFS` simples: partindo de `GameState.playerLocation`, percorrer `exits` de cada sala até encontrar a sala da bomba, retornando a distância em salas.
- Criar objeto `BombIndicator` com:
  - `update()`: mostra/esconde o botão, atualiza conteúdo do tooltip
  - Chamado dentro de `Render.update()` a cada turno
- Inserir o botão no HTML ao lado do diário (à esquerda).

**Tooltip**: No hover exibe algo como:
```
💣 Bomba em Parque Trianon
⏱️ 8 turnos restantes
🚶 3 salas de distância
```

## 2. Bombardeador não pode colocar bombas no Subsolo do MASP

Na função de criação de bombas do bombardeador (linha ~7700), adicionar verificação:
```javascript
if (bombardeador.location === 'subsolo_masp') return;
```

## Alterações

- **1 arquivo**: `public/avenida-paulista.html`
- **CSS**: ~15 linhas (estilo do indicador e tooltip)
- **HTML**: 1 botão adicionado na barra de ícones
- **JS**: ~40 linhas (BFS, BombIndicator, integração no Render.update, restrição do bombardeador)

