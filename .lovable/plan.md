

## Animar o botão "Pular" do text crawl (sem borda)

Remover a borda do botão e manter apenas efeitos de glow e animação nas setas.

### Mudanças

**CSS — adicionar keyframes:**
```css
@keyframes skip-glow {
  0%, 100% { box-shadow: 0 0 8px rgba(212,168,70,0.1); }
  50% { box-shadow: 0 0 14px rgba(212,168,70,0.3), 0 0 30px rgba(212,168,70,0.1); }
}

@keyframes skip-arrows {
  0%, 100% { transform: translateX(0); opacity: 0.7; }
  50% { transform: translateX(4px); opacity: 1; }
}
```

**`#intro-skip` — atualizar estilo:**
- Remover `border` (trocar por `border: none`)
- Adicionar `animation: skip-glow 2.5s ease-in-out infinite`

**Span das setas (`▸▸`):**
- Adicionar `animation: skip-arrows 1.5s ease-in-out infinite`

Resultado: botão sem borda, com halo dourado pulsante e setas que se movem ritmicamente.

