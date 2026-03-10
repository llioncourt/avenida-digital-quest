

## Melhorar Transição entre Salas + Switch de Toggle

### Mudanças

**1. CSS — Animação mais lenta e com mais efeitos (~linhas 317-359)**

- Duração de 800ms → **1500ms**
- Adicionar efeito de **motion blur** via CSS filter no `travel-from`
- Adicionar **vinheta escura** (radial gradient overlay) para dramatizar
- Adicionar **scan lines** sutis durante a transição (pseudo-element)
- `travel-out`: escala maior (1.08) + blur crescente
- `travel-in`: começa mais ampla (1.15) e fecha com leve overshoot

```css
.room-travel-overlay {
  /* ...existente... */
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%);
}
.room-travel-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
  z-index: 2;
  pointer-events: none;
}
/* Duração 1500ms em todas as animations */
/* travel-out com filter: blur(3px) no final */
/* travel-in com scale 1.12 → 1 */
```

**2. JS — `RoomTransition._duration` de 800 → 1500 (linha 10080)**

Callback no midpoint continua em `_duration * 0.5` = 750ms.

**3. JS — Flag `RoomTransition.enabled` + método `toggle()` (dentro do namespace)**

```javascript
RoomTransition.enabled = true;
RoomTransition.toggle = function() { ... };
```

No `play()`: se `!this.enabled`, chama `callback()` imediatamente.

**4. HTML — Botão toggle na barra de controles (~após linha 2769)**

Botão estilo idêntico ao `particles-toggle` e `typewriter-toggle`:

```html
<button
  id="travel-toggle"
  onclick="RoomTransition.toggle(); this.style.opacity = RoomTransition.enabled ? '1' : '0.4';"
  title="Ligar/Desligar transição de viagem"
  style="background: none; border: none; padding: 0.3rem 0.5rem; cursor: pointer; font-size: 1rem;"
>
  🎬
</button>
```

### Arquivo alterado

Apenas `public/avenida-paulista.html`.

