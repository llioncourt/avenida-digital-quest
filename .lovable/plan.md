

## Melhorar o modal de explosão + imagens de fundo nos cards de sala

### 1. Modal de Explosão Cinematográfico

O modal atual usa o `Modals.show()` genérico -- texto simples dentro do modal padrão. Vou criar um layout dedicado para explosões, inspirado no combat modal:

- **Imagem de fundo da sala** que explodiu, usando o mesmo sistema de nomenclatura padronizada (ex: `rooms/masp.webp`)
- Layout com a imagem ocupando o fundo do modal inteiro com `mask-image` fade (como os retratos de combate)
- Texto sobreposto com efeitos visuais (glow vermelho/laranja, text-shadow)
- Animação de shake no modal ao aparecer
- Lista de vítimas e itens destruídos com estilo temático (ícones, cores)

**Nomenclatura das imagens de sala:**
```
public/rooms/{roomId}.webp
```
Exemplos: `rooms/masp.webp`, `rooms/colegio.webp`, `rooms/rua_augusta.webp`

O sistema terá fallback: tenta carregar a imagem, se não existir mostra um gradiente escuro com efeito de fumaça (CSS).

**Lógica de explosão (linhas ~7840-7860):** Em vez de `Modals.show('💥 EXPLOSÃO!', modalContent)`, criar uma função `Modals.showExplosion()` dedicada que:
- Monta HTML com div de imagem de fundo (como `combat-portrait`)
- Aplica animação de entrada (shake + fade-in)
- Usa CSS específico para o modal de explosão (borda vermelha/laranja, glow de fogo)

### 2. Imagens de Fundo no Card da Sala (location-panel)

Adicionar uma imagem de fundo sutil ao `#location-panel` que muda conforme a sala atual:

- Usar a mesma nomenclatura `rooms/{roomId}.webp`
- Aplicar via `background-image` com `mask-image` fade (opacidade baixa ~0.15 para não atrapalhar legibilidade)
- Atualizar em `updateLocation()` (linha 8661)
- Fallback: sem imagem, mantém o visual atual (gradiente do `.panel`)

**CSS necessário:**
```css
#location-panel {
  position: relative;
  overflow: hidden;
}
#location-panel .room-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.12;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 85%);
  pointer-events: none;
  transition: opacity 0.3s;
}
```

**JS em `updateLocation()`:** Criar/atualizar um elemento `.room-bg` com `background-image: url('rooms/' + roomId + '.webp')`.

### Mudanças no arquivo

**`public/avenida-paulista.html`:**

1. **CSS:** Adicionar estilos para `.room-bg` no location-panel e para o modal de explosão customizado (`.explosion-modal`)
2. **JS - `updateLocation()`** (~linha 8661): Inserir/atualizar div `.room-bg` com a imagem da sala
3. **JS - `Modals`**: Criar `showExplosion(roomId, content)` que monta o modal com imagem de fundo da sala
4. **JS - lógica de detonação** (~linha 7840-7860): Trocar `Modals.show()` por `Modals.showExplosion()`

### Nomenclatura padronizada

As imagens ainda não existem no projeto, mas o sistema estará preparado com fallback. O usuário poderá adicionar imagens em `public/rooms/` seguindo o padrão `{roomId}.webp` (ex: `masp.webp`, `colegio.webp`, `teto_masp.webp`).

