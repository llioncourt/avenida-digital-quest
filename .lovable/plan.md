

## Animação de Transição entre Salas com Imagens de Fundo

### Conceito

Ao mover de uma sala para outra, uma **overlay fullscreen** aparece brevemente mostrando a transição visual: a imagem da sala de origem faz fade-out enquanto a imagem da sala de destino faz fade-in. Tudo isso acontece **antes** do `processAction` (que dispara combates, eventos, etc).

### Implementação

**1. CSS — Overlay de transição (~após linha 316)**

```css
.room-travel-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
}
.room-travel-overlay .travel-from,
.room-travel-overlay .travel-to {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}
.room-travel-overlay .travel-from {
  opacity: 1;
}
.room-travel-overlay .travel-to {
  opacity: 0;
}
.room-travel-overlay.active {
  opacity: 1;
  animation: travel-fade 800ms ease-in-out forwards;
}
.room-travel-overlay .travel-from {
  animation: travel-out 800ms ease-in-out forwards;
}
.room-travel-overlay .travel-to {
  animation: travel-in 800ms ease-in-out forwards;
}
@keyframes travel-fade {
  0% { opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes travel-out {
  0% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 0; transform: scale(1.05); }
  100% { opacity: 0; }
}
@keyframes travel-in {
  0% { opacity: 0; transform: scale(1.1); }
  40% { opacity: 0; }
  100% { opacity: 0.7; transform: scale(1); }
}
```

Opacidade máxima de 0.7 para manter o clima escuro/atmosférico. Sobreposição escura sutil via gradiente.

**2. JS — Função `RoomTransition.play(fromRoomId, toRoomId, callback)` (novo namespace)**

- Cria a overlay com duas divs (from/to), cada uma com `background-image: url('rooms/{id}.webp')`
- Pré-testa se as imagens existem (`new Image()` com `.onload`/`.onerror`)
- Se **nenhuma imagem** existir → chama `callback()` imediatamente (fallback para nada)
- Se pelo menos uma existir → mostra a animação (800ms) e chama `callback()` ao terminar
- Remove a overlay do DOM após completar

**3. JS — Alterar `Game.move()` (~linha 10265-10326)**

O fluxo atual:
1. Adiciona `room-transition-out` ao panel
2. Espera `delay` ms
3. Chama `processAction(Actions.moveTo(roomId))`
4. Adiciona `room-transition-in`

Novo fluxo:
1. Adiciona `room-transition-out`
2. Chama `RoomTransition.play(prevRoom, roomId, function() { ... })`
3. Dentro do callback: executa `processAction(Actions.moveTo(roomId))` + `room-transition-in` + glow
4. A transição especial do Teto do MASP continua funcionando (flash + shake adicionados dentro do callback)

O delay total será ~800ms para a animação de viagem, substituindo o delay fixo de 160ms atual. Se não houver imagens, o callback é imediato e o comportamento fica idêntico ao atual.

### Fallback

- Sem imagem de nenhuma sala → callback imediato, zero mudança visual
- Só uma imagem disponível → mostra fade-in/out só dela
- Sem internet / imagem falha no load → tratado pelo `.onerror`, considerado como "sem imagem"

### Arquivos alterados

Apenas `public/avenida-paulista.html`: CSS novo + namespace `RoomTransition` + ajuste em `Game.move()`.

