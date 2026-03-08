

# Melhorias Visuais: Typewriter + Particulas + Mini-animacoes

## 1. Typewriter no Log (~60 linhas)

**Como funciona:** Cada nova mensagem do Log aparece caractere a caractere (~15ms/char) com cursor piscante `▌`. Mensagens se acumulam numa fila — enquanto uma "digita", as proximas esperam. Se muitas mensagens chegam de uma vez (ex: turno de combate com 5+ mensagens), as anteriores completam instantaneamente e so a ultima tem efeito typewriter.

**Implementacao:**
- Adicionar CSS para cursor piscante (`@keyframes blink-cursor`)
- Modificar `Log._flush()` para, ao adicionar entradas novas, iniciar animacao typewriter na ultima entrada
- Nova funcao `Log._typewrite(element, fullHTML, callback)` que revela caractere a caractere
- Se uma nova mensagem chega durante typewriter ativo, a anterior completa instantaneamente
- Click no log-container durante typewriter = skip (completa tudo)

**Risco:** Medio — precisa de cuidado com o batching de mensagens e scroll. Nao pode quebrar o fluxo de combate que gera varias mensagens rapidas.

---

## 2. Particulas Ambientais (~120 linhas)

**Sistema:** Objeto `AmbientParticles` que gerencia um container overlay (`#particles-overlay`) sobre o `#game-container` com `pointer-events: none`. Cria/destroi particulas via CSS animations.

**Presets por condicao:**
- **Chuva** (`rain` ativo): gotinhas brancas caindo diagonalmente (`@keyframes rain-fall`)
- **Neblina** (`fog` ativo): manchas semi-transparentes flutuando horizontalmente (`@keyframes fog-drift`)
- **Vento** (`wind_howl` ativo): linhas finas horizontais rapidas (`@keyframes wind-streak`)
- **Noite** (`theme-night`): vagalumes (pontos amarelos piscando e flutuando) (`@keyframes firefly`)
- **Bomba** (`theme-bomb`): centelhas laranjas (`@keyframes spark`)
- **Ruinas** (`theme-ruins`): poeira caindo lentamente (`@keyframes dust-fall`)

**Limites de performance:** Max 30 particulas simultaneas. Cada particula e um `<div>` com CSS animation. Particulas sao recicladas (removidas ao terminar animation, novas criadas por intervalo).

**Toggle on/off:** Adicionar botao `✨` ao lado do botao de som/musica no header. Estado em `AmbientParticles.enabled`. Default: ligado.

**Integracao:** Chamar `AmbientParticles.update()` dentro de `Render.update()` e `RandomEvents.start()`/`RandomEvents.stop()`.

**Risco:** Medio — performance precisa ser gerenciada. Limitar particulas e usar `will-change: transform` nos CSS.

---

## 3. Mini-animacoes nos Botoes (~30 linhas, apenas CSS)

**Itens (`btn-item`):** Leve flutuacao vertical continua (bob) — `@keyframes item-bob` com `translateY(-2px)` e volta. Periodo: 3s. Cada botao com delay aleatorio via `animation-delay` baseado no indice (ja existe `idx * 50ms`).

**Inimigos (`btn-character.hostile`):** Tremor sutil continuo — `@keyframes enemy-shake` com micro-translacoes horizontais (1px). Periodo: 0.5s. Apenas enquanto hover? Nao — continuo, para dar sensacao de ameaca.

**Aliados (`btn-character.ally`):** Pulso verde suave na borda — `@keyframes ally-pulse` com `box-shadow` verde pulsando. Periodo: 2s.

**Vendedor (`btn-character` com `accent-gold`):** Brilho dourado sutil na borda — `@keyframes vendor-shimmer`. Periodo: 3s.

**Itens de inventario:** Sem animacao extra (para nao distrair durante crafting).

**Risco:** Baixo — apenas CSS, sem logica.

---

## Resumo

```text
┌──────────────────────────────────┬─────────┬────────┬─────────┐
│ Melhoria                         │ Linhas  │ Risco  │ Impacto │
├──────────────────────────────────┼─────────┼────────┼─────────┤
│ Typewriter no Log                │   ~60   │ Medio  │ Alto    │
│ Particulas ambientais + toggle   │  ~120   │ Medio  │ Alto    │
│ Mini-animacoes nos botoes (CSS)  │   ~30   │ Baixo  │ Medio   │
├──────────────────────────────────┼─────────┼────────┼─────────┤
│ TOTAL                            │  ~210   │        │         │
└──────────────────────────────────┴─────────┴────────┴─────────┘
```

## O que NAO muda

- Estrutura HTML existente, paineis, modais
- Sistema de combate, crafting, trade, achievements
- Som, musica, eventos aleatorios (logica)
- Minimap, temas de cor por sala

## Ordem de implementacao

1. Mini-animacoes CSS nos botoes (mais simples, baixo risco)
2. Particulas ambientais + botao toggle
3. Typewriter no Log (mais complexo)

