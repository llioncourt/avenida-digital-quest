

## Remover slide-down do card de localidade durante transição

### Problema
O `#location-panel.room-transition-out` aplica `transform: translateY(8px)`, causando um slide para baixo visível e desagradável durante a transição entre salas.

### Solução
Remover o `translateY` das classes de transição do painel, mantendo apenas o fade (opacity). Também remover o `slide-up-fade` dos elementos internos (`.stagger-in`) que causa o efeito inverso na entrada.

**Mudanças (linhas 289-296):**
```css
#location-panel.room-transition-out {
  opacity: 0;
  /* SEM translateY */
}
#location-panel.room-transition-in {
  opacity: 1;
}
```

**Mudança (linhas 460-466):** Remover ou simplificar o `slide-up-fade` keyframe e `.stagger-in` para que os elementos internos do painel façam apenas fade, sem slide vertical.

Arquivo: `public/avenida-paulista.html`

