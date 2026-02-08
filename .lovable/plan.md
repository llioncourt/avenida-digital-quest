
# Plano: Remover Landing Page e Corrigir Intro Crawl 3D

## Objetivo
- Remover a página de landing (Index.tsx) da rota "/"
- Redirecionar automaticamente para /avenida-paulista.html 
- Corrigir o Intro/Text Crawl para ter efeito 3D real (transform + Z-axis, não animação de top)
- Nada mais, focado e cirúrgico

## Mudanças Necessárias

### 1. src/pages/Index.tsx - Remover Landing, Implementar Redirect
**Localização**: Linhas 1-22
**Mudança**: Transformar em componente que redireciona automaticamente para /avenida-paulista.html
- Adicionar `useEffect` que dispara na montagem
- Usar `window.location.replace('/avenida-paulista.html')` para redirecionar sem histórico
- Componente retorna `null` (nada para renderizar)

**Resultado**: Acessar "/" agora leva direto ao jogo, sem tela intermediária

### 2. public/avenida-paulista.html - Corrigir CSS do Crawl (3D Real)
**Seção**: Lines 992-1006 (#intro-crawl CSS)
**Mudança**: 
- Remover `top: 100%` 
- Remover `transform: rotateX(25deg)` e `transform-origin: 50% 0%`
- Deixar apenas `bottom: 0` para ancoragem base
- A animação via `@keyframes` será responsável pelo `transform` completo

**Seção**: Lines 1020-1032 (@keyframes star-wars-crawl)
**Mudança**: Substituir animação de `top` por animação de `transform` com Z-axis
- **0%**: `transform: rotateX(28deg) translateY(80vh) translateZ(0)` (começa visível, abaixo da tela)
- **100%**: `transform: rotateX(28deg) translateY(-400vh) translateZ(-1200px)` (sobe e "entra" com profundidade)
- Isso cria o efeito real de "entrar na tela" com perspectiva 3D (Star Wars)

### 3. public/avenida-paulista.html - Melhorar IntroSystem.init()
**Seção**: Lines 4542-4576 (IntroSystem.init)
**Mudanças**:
- Adicionar `crawl.style.animation = 'none'` antes do `offsetHeight` para garantir reset
- Aumentar duração para `60s` (ajustado para o novo keyframe que vai de 80vh até -400vh)
- Melhorar o listener: usar `once: true` ou remover o listener após disparar (evitar múltiplas execuções)
- Aumentar safetyTimeout para `65000ms` (alinhado com a duração de 60s + margem)

**Resultado**: Animação sempre começa do frame 0 e termina de forma confiável

## Por Que Essas Mudanças Funcionam

| Problema | Solução | Por Quê |
|----------|---------|--------|
| Landing page aparece | Redirect em useEffect | O "/" redireciona antes de renderizar React |
| Crawl não tem profundidade | Transform com Z-axis | `translateZ(-1200px)` cria recuo real em perspectiva |
| Crawl parece "parado" por segundos | Começar em `80vh` (visível) | Texto aparece rapidamente em vez de fora da tela |
| Crawl pode não terminar | Reset + safetyTimeout | Garante que animation sempre rodar do início e tem fallback |

## Testes Pós-Implementação
1. ✅ Abrir "/" → deve redirecionar para /avenida-paulista.html (sem parar na landing)
2. ✅ Crawl aparece em ~1-2s
3. ✅ Crawl tem efeito "entrar" (recuo em perspectiva, não só sobe)
4. ✅ Botão PULAR funciona sempre
5. ✅ Ao terminar, intro some e jogo aparece (sem travar)
6. ✅ Recarregar página 3x e verificar que funciona toda vez (determinístico)
