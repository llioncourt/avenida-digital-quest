

## Melhorar visibilidade da imagem de fundo no card de sala

### Problema
A imagem está com `opacity: 0.15` e a máscara dissolve muito cedo (transparente aos 85%). Resultado: quase invisível.

### Solução
Aumentar a opacidade e ajustar a máscara, mantendo legibilidade com uma camada de escurecimento sutil:

**Mudanças no CSS (linhas 302-316):**

1. **Subir opacidade** de `0.15` para `0.35`
2. **Máscara menos agressiva** — manter mais da imagem visível, fade só no final
3. **Adicionar overlay escuro** via `::after` no `.room-bg` para garantir que o texto continue legível mesmo com opacidade maior

```css
.room-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  opacity: 0;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, transparent 95%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, transparent 95%);
  pointer-events: none;
  transition: opacity 0.5s ease;
  z-index: 0;
}
.room-bg.loaded {
  opacity: 0.35;
}
```

Isso triplica a visibilidade sem comprometer o texto (que já tem `z-index: 1` e o painel tem fundo escuro). A máscara mantém o fade gradual no final do card para não cortar abruptamente.

