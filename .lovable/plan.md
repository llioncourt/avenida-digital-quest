
# Plano: Corrigir Minimapa, HUD de Energia e Morte por Eventos

## Problemas Identificados

1. **Subsolo do MASP visível no minimapa** — A sala secreta aparece normalmente no mapa (posição definida, conexões desenhadas), quebrando o mistério. Deve ser oculta até ser descoberta.

2. **Energia no HUD** — O HTML e o JS de atualização existem e parecem corretos. Pode ser um bug de inicialização ou CSS. Vou verificar e garantir que funcione.

3. **Morte por eventos não-combate** — O código já seta `hp = 0` e `isAlive = false` em armadilhas, tropeço noturno e exaustão. O `checkGameOver()` é chamado no final de `Game.move()`, então **armadilhas e tropeço** já disparam game over corretamente. Porém, **morte por energia/exaustão** acontece dentro de `Events.advanceTime()`, que é chamado ANTES do `checkGameOver()` em `Game.move()` — então também funciona. Mas preciso confirmar que chuva e gás residual também levam ao game over (falta o check de `hp <= 0` no bloco de gás).

---

## Correções

### 1. Ocultar Subsolo do MASP no Minimapa
- No loop de desenho de salas (`updateMinimap`), pular `subsolo_masp` se o jogador nunca visitou (não está em `GameState.visitedRooms`)
- No loop de desenho de conexões, também pular conexões envolvendo `subsolo_masp` se não visitada
- Resultado: a sala só aparece no mapa depois que o jogador entra nela pela primeira vez

### 2. Garantir Energia no HUD
- Verificar que `GameState.energy` é inicializado antes do primeiro `Render.update()`
- Confirmar que o CSS `#energy-display` não está sendo escondido
- Adicionar formato visual mais claro: `"⚡ 100/100"` em vez de apenas `"100"`

### 3. Morte por HP 0 de Eventos Diversos
- **Gás residual** (linha ~6019): falta o check `if (hp <= 0)` — adicionar
- **Chuva** (buscar bloco de dano de chuva): verificar se tem check de morte
- Criar uma função utilitária `applyEnvironmentalDamage(amount, message)` que centraliza: subtrai HP, loga, e seta `isAlive = false` se morreu — evita esquecer o check
- Garantir que `GameState.deathReason` é setado com mensagem apropriada para cada tipo de morte ambiental (exaustão, tropeço, armadilha, chuva, gás)

---

## Resumo Técnico
- Arquivo: `public/avenida-paulista.html`
- ~30 linhas modificadas no `updateMinimap` (filtro de subsolo)
- ~10 linhas para função `applyEnvironmentalDamage`
- ~15 linhas ajustando pontos de dano ambiental para usar a função centralizada
- ~5 linhas ajustando display de energia
