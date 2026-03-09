

## Correção: Tela de início atrás do intro-container

### Problema
O `#start-screen` e o `#intro-container` têm o mesmo `z-index: 10000`. Como o `#intro-container` vem depois no DOM, ele fica por cima — escondendo o botão "CLIQUE PARA INICIAR" e mostrando apenas o "PULAR".

### Solução
Duas mudanças simples em `public/avenida-paulista.html`:

1. **Esconder `#intro-container` inicialmente** — adicionar `display: none` ao CSS do `#intro-container` (linha ~1635).

2. **Mostrar `#intro-container` quando o usuário clicar** — no `IntroSystem.init()` (linha ~10230), adicionar `intro.style.display = ''` antes de iniciar a animação.

Isso garante que:
- Ao carregar a página, só aparece a tela preta com "CLIQUE PARA INICIAR"
- Após o clique, o start-screen é removido, o intro-container aparece, e o text crawl + música começam

