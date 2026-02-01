
# Plano: Remover Highlight de Salas com NPCs, Manter Apenas Bolinhas

## Problema Atual

As salas com inimigos, aliados ou ambos têm:
- Borda colorida (vermelha, verde ou roxa)
- Box-shadow colorido
- Bolinha indicadora no canto superior direito

O usuário quer manter **apenas as bolinhas** e deixar o highlight azul das saídas válidas visível.

---

## Solução

### Arquivo: `public/avenida-paulista.html`

**Linhas 431-434:** Remover estilos de borda/sombra de `.map-room.has-enemy`:

De:
```css
.map-room.has-enemy {
  border-color: rgba(201, 64, 64, 0.8);
  box-shadow: 0 0 12px rgba(201, 64, 64, 0.4);
}
```

Para:
```css
.map-room.has-enemy {
  /* Apenas bolinha ::after, sem highlight no quadrado */
}
```

**Linhas 453-456:** Remover estilos de borda/sombra de `.map-room.has-ally`:

De:
```css
.map-room.has-ally {
  border-color: rgba(64, 160, 96, 0.8);
  box-shadow: 0 0 12px rgba(64, 160, 96, 0.3);
}
```

Para:
```css
.map-room.has-ally {
  /* Apenas bolinha ::after, sem highlight no quadrado */
}
```

**Linhas 469-472:** Remover estilos de borda/sombra de `.map-room.has-both`:

De:
```css
.map-room.has-both {
  border-color: rgba(128, 64, 160, 0.8);
  box-shadow: 0 0 12px rgba(128, 64, 160, 0.4);
}
```

Para:
```css
.map-room.has-both {
  /* Apenas bolinha ::after, sem highlight no quadrado */
}
```

---

## Resumo das Alterações

| Classe | Alteração |
|--------|-----------|
| `.map-room.has-enemy` | Remover `border-color` e `box-shadow` |
| `.map-room.has-ally` | Remover `border-color` e `box-shadow` |
| `.map-room.has-both` | Remover `border-color` e `box-shadow` |

Os pseudo-elementos `::after` (bolinhas) permanecem inalterados.

## Resultado Esperado

1. Salas com inimigos, aliados ou ambos mostram apenas a bolinha indicadora
2. O quadrado da sala não tem mais borda/sombra colorida
3. Saídas válidas continuam com highlight azul visível
4. Se uma saída válida tiver um NPC, ela terá o highlight azul E a bolinha correspondente
