

# Fix: Confirmação de ataque a aliado e botão "Atacar" sem vida

## Problemas

1. **`confirm()` nativo do browser** — O alerta "Atacar um aliado?" usa `confirm()` do JavaScript, que gera um popup feio do navegador com a URL do projeto. Deve ser substituído por um modal in-game estilizado.

2. **Botão "⚠️ Atacar" para aliados/neutros** — Usa `opacity:0.7` e um `background` flat sem gradiente, ficando apagado e sem vida comparado ao `btn-danger` e `btn-spectral`.

## Correções

### 1. Substituir `confirm()` por modal in-game estilizado

Criar uma função `Modals.confirmAttackAlly(charId, type)` que exibe um modal de confirmação temático dentro do jogo (similar ao modal de restart), com:
- Texto de aviso dramático com ícone ⚠️
- Dois botões: "Sim, Atacar" (vermelho pulsante) e "Cancelar"
- Fundo escuro com borda vermelha (reutilizando o padrão visual dos modais existentes)

No onclick do botão de atacar aliado/neutro, trocar `if(confirm(...))` por `Modals.confirmAttackAlly('charId', 'ally'|'neutral')`.

### 2. Criar classe CSS `btn-danger-warn` para o botão de atacar aliado

Novo estilo com:
- Gradiente escuro avermelhado (similar ao `btn-spectral` mas em vermelho)
- Borda vermelha com `box-shadow` pulsante (glow vermelho)
- Animação sutil de pulso (`@keyframes danger-pulse`) para chamar atenção
- `text-shadow` vermelho para o texto
- Hover com intensificação do glow

Substituir o inline style `background:var(--accent-red);opacity:0.7` pela classe `btn-danger-warn`.

### Resultado esperado

- Confirmação de ataque a aliados aparece como modal bonito in-game, sem popup do browser
- Botão "⚠️ Atacar" tem aparência ameaçadora e viva, com glow pulsante vermelho

