

## Melhorar o Card de Inventário

### Problema
O card do inventário mostra apenas nome e peso em linhas simples sem graça -- falta informação visual, categorização e refinamento estético comparado aos outros cards do jogo.

### Solução

**Arquivo: `public/avenida-paulista.html`**

#### 1. CSS -- Visual mais rico para `.inventory-item`

- **Gradiente de fundo** como os `.btn-item` (linear-gradient dark), borda com accent-gold-dim
- **Ícone por categoria** baseado nas propriedades do item: ⚔️ (attackPower > 0), 🛡️ (defensePower > 0), 💊 (isUsable + singleUse), 🔧 (isUsable + !singleUse), 🎒 (passivo/outros)
- **Tags visuais** pequenas badges coloridas mostrando stats relevantes:
  - `⚔️ +15` (ataque, cor vermelha)
  - `🛡️ +12` (defesa, cor azul)
  - `✈️` (voo, cor ciano)
  - `1x` (uso único, cor amarela dim)
  - Efeitos passivos como mini-badges (ex: "💨 Voo", "🔦 Visão", "☔ Chuva")
- **Descrição em tooltip** ao fazer hover sobre o item (title attribute com item.description)
- **Hover effect** com borda dourada e leve glow, similar aos botões de item no chão

#### 2. HTML/JS -- `updateInventory` enriquecido (~linha 9188-9258)

Modificar a criação do `row` para incluir:

```
┌──────────────────────────────────────┐
│ 🗡️ ESPADA                    ✋ 📤 │
│ ⚔️+15  🛡️+2  ⚖️8kg               │
└──────────────────────────────────────┘
```

- **Linha 1**: Ícone de categoria + nome (dourado, mono) + botões de ação à direita
- **Linha 2**: Tags de stats em mini-badges + peso
- O `title` do row recebe `item.description` para tooltip
- Itens de uso único recebem uma badge `1x` para distinguir dos reutilizáveis

Estrutura do DOM atualizada:
```html
<div class="inventory-item" title="Uma espada afiada...">
  <div class="inventory-left">
    <span class="inventory-item-name">⚔️ ESPADA</span>
    <div class="inventory-item-stats">
      <span class="inv-tag inv-tag-atk">⚔️+15</span>
      <span class="inv-tag inv-tag-def">🛡️+2</span>
      <span class="inv-tag inv-tag-weight">⚖️8kg</span>
    </div>
  </div>
  <div class="inventory-actions">
    <button class="btn btn-small">📤</button>
  </div>
</div>
```

#### 3. CSS -- Novas classes

```css
.inventory-item {
  background: linear-gradient(135deg, #2a1a1a, #1a1a0a);
  border: 1px solid var(--accent-gold-dim);
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.inventory-item:hover {
  border-color: var(--accent-gold);
  box-shadow: 0 0 6px rgba(212, 168, 70, 0.2);
}

.inventory-item-stats {
  display: flex;
  gap: 0.4rem;
  margin-top: 2px;
  flex-wrap: wrap;
}

.inv-tag {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  padding: 1px 4px;
  border-radius: 3px;
  opacity: 0.85;
}
.inv-tag-atk { color: #ff6b6b; background: rgba(255,107,107,0.1); }
.inv-tag-def { color: #6baaff; background: rgba(107,170,255,0.1); }
.inv-tag-weight { color: var(--text-muted); }
.inv-tag-fly { color: #6bffdb; background: rgba(107,255,219,0.1); }
.inv-tag-single { color: #ffdb6b; background: rgba(255,219,107,0.1); }
.inv-tag-passive { color: #c080ff; background: rgba(192,128,255,0.1); }
```

#### 4. JS -- Lógica de ícone por categoria

```javascript
function getItemIcon(item) {
  if (item.attackPower > 0 && item.defensePower > 0) return '⚔️';
  if (item.attackPower > 0) return '🗡️';
  if (item.defensePower > 0) return '🛡️';
  if (item.canFly) return '🪂';
  if (item.isUsable && item.singleUse) return '💫';
  if (item.isUsable) return '🔧';
  if (item.passiveEffects && item.passiveEffects.length) return '✨';
  return '📦';
}
```

### Resultado
- Cada item do inventário mostra stats visuais relevantes (ataque, defesa, passivos) em mini-tags coloridas
- Hover com glow dourado e tooltip com a descrição completa do item
- Ícone por tipo de item para identificação rápida
- Visual alinhado com o resto da interface (gradientes escuros, bordas douradas)

