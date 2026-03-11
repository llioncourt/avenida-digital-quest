

## Fase 11 — Glassmorphism nos Modals + Itens de Inventário + Slider padrão zero

### Alterações em `public/avenida-paulista.html`

**1. CSS — `#modal` (linha ~1464)**
Trocar `background: var(--bg-secondary)` por glassmorphism:
```css
#modal {
  background: rgba(20, 20, 35, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

**2. CSS — `.inventory-item` (linha ~993)**
Adicionar backdrop-filter e trocar background sólido por semi-transparente.

**3. CSS — `.combat-card` (linha ~2572)**
Mesmo tratamento: background semi-transparente + blur.

**4. JS — `GlassControl.set()` (linha ~11963)**
Adicionar ao método `set()`:
```js
// Modal principal
var modal = document.getElementById('modal');
if (modal) modal.style.background = glassBg;

// Itens do inventário
document.querySelectorAll('.inventory-item').forEach(function(el) {
  el.style.background = glassBg;
});

// Cards de combate
document.querySelectorAll('.combat-card').forEach(function(el) {
  el.style.background = glassBg;
});
```

**5. HTML — Slider valor padrão 0 (linha ~3090)**
- `value="55"` → `value="0"`, texto `55%` → `0%`
- No `DOMContentLoaded`, chamar `GlassControl.set(0)` para aplicar estado inicial opaco (sem glassmorphism por padrão).

### Atualização do plano (`.lovable/plan.md`)

Adicionar nova fase:
```
### ✅ Fase 11 — Glassmorphism expandido + Controle de transparência

- Glassmorphism aplicado em: `#modal`, `.inventory-item`, `.combat-card`
- `GlassControl.set()` atualiza todos os elementos dinamicamente
- Slider padrão em 0 (totalmente opaco); usuário ajusta em tempo real
- Cobre modals de personagem, item, combate e itens do inventário
```

