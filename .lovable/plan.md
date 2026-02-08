
Objetivo
- Fazer uma validação “de ponta a ponta” do jogo (especialmente Intro/Text Crawl e regras do “Céu da Cidade”), identificar causas raiz, e aplicar correções que eliminem regressões recorrentes.
- Reduzir retrabalho: criar “cintos de segurança” no runtime (sanity checks) para que, mesmo que um bug apareça em algum fluxo raro, o jogo se auto-corrija e registre o ocorrido no log.

Constatações (análise do código atual)
1) Intro/Text crawl “não faz nada” (causa raiz provável: animação começa cedo + início invisível por muito tempo)
- O elemento #intro-crawl já nasce com `animation: star-wars-crawl 60s ...` definido no CSS.
- O conteúdo do texto só é inserido em `IntroSystem.init()` (DOMContentLoaded).
- Resultado: a animação pode estar rodando “em branco” antes do innerHTML existir; quando o texto entra, ele já está em um ponto da animação (ou até fora da tela).
- Além disso, com o estado atual:
  - `bottom: 0` + `translateY(100%)` deixa o texto totalmente fora da viewport no início.
  - Ele só “entra” depois de uma fração grande da duração (em muitos casos, parece travado/inexistente por vários segundos).
- Dependendo de timing/render, `animationend` pode não disparar como esperado (listener é adicionado depois da animação já ter começado; e se a animação não rodar como previsto, o overlay nunca sai).

2) Intro overlay não está isolando o jogo por baixo
- Pelo que vimos no browser tool, elementos do jogo aparecem “clicáveis” mesmo com o intro presente (isso indica que o overlay não está bloqueando interação ou há alguma condição onde ele não cobre do jeito esperado).
- Isso cria sensação de “tela inicial não saiu” e também dificulta diagnosticar se o problema é o intro ou o game rodando por trás.

3) Regras do “Céu da Cidade” ainda escapam por caminhos alternativos (itens/bomba)
- A inicialização (Game.setupPositions) já filtra `requiresFlight !== true` para itens e personagens terrestres, o que é bom.
- Porém existem rotas secundárias que conseguem colocar itens no céu:
  - `ItemUseHandlers.kit_bomba()` ao desarmar: faz `GameState.items.bomba.location = GameState.playerLocation` sem respeitar `mayHaveItems: false` (no céu deveria “cair e destruir”).
- Render.updateItems também não filtra `isDestroyed`, e não força a regra `mayHaveItems: false` na UI. Então qualquer item “vazado” para ceu_cidade aparece.

4) Bombardeador “colocou bomba no céu” (precisamos tornar impossível, não só improvável)
- Já existe o guard:
  - Em `processNPCMovement`: impede NPC sem voo de ir para `requiresFlight`.
  - Em `processBombardeadorBombs`: impede armar bomba se room.requiresFlight.
- Se isso ainda ocorreu, a explicação mais provável é:
  - Ou houve estado inválido em algum momento (bombardeador.location ficou em ceu_cidade por bug/edge-case), ou
  - A UI/log está reportando/interpretando algo indevidamente.
- Para acabar com regressões, precisamos de validação contínua: se um personagem terrestre aparecer em sala aérea, o jogo corrige automaticamente e registra no log (isso também economiza créditos porque o problema “não fica feio” em runtime).

5) “Tela inicial não saiu”
- No React (rota “/”) ainda existe a landing page (src/pages/Index.tsx) com botão “JOGAR” para /avenida-paulista.html.
- Se a expectativa é abrir direto o jogo, precisamos redirecionar automaticamente (sem tela intermediária).

Lista completa de correções propostas (implementação)
Arquivos
- Principal: public/avenida-paulista.html
- Opcional (para remover a landing): src/pages/Index.tsx (ou ajuste de rotas no src/App.tsx)

A) Tornar o Intro/Text Crawl determinístico e “visível desde o começo”
1. Não deixar a animação iniciar automaticamente via CSS
- Remover a animação “fixa” do CSS do #intro-crawl e iniciar via JS depois de inserir o texto.
- Abordagem segura:
  - CSS: `#intro-crawl { animation: none; }`
  - JS (IntroSystem.init):
    - Inserir innerHTML do texto
    - Forçar restart da animação:
      - `crawl.style.animation = 'none'`
      - `crawl.offsetHeight` (force reflow)
      - `crawl.style.animation = 'star-wars-crawl 60s linear forwards'`
2. Ajustar o início para não ficar “invisível” por muitos segundos
- Trocar o keyframe inicial de translateY(100%) para algo que apareça rápido:
  - Ex.: iniciar em translateY(10%/20%) ou usar valores em vh/px mais previsíveis.
- Para recuperar o “entra” (profundidade), adicionar componente de Z:
  - Ex.: `translate3d(0, Y, 0)` -> `translate3d(0, Yfinal, -1200px)`
3. Fallback de término (se animationend falhar)
- Iniciar um timer de segurança em IntroSystem.init (duration + margem).
- No finish (animationend ou timer), chamar IntroSystem.complete() e limpar o timer.
4. Isolar o intro do game por baixo
- Enquanto intro estiver ativo:
  - esconder o game container (ex.: `#game-container { visibility: hidden; }` ou classe `intro-active`)
  - ou bloquear pointer events do game.
- Ao skip/complete:
  - mostrar o game container novamente.

B) “World Sanity” (validação contínua para evitar regressões)
Criar um módulo leve no próprio HTML (ex.: WorldSanity / Validators) e chamar:
- Depois de Game.setupPositions() (no init)
- No início e/ou fim de Events.advanceTime()
Regras a impor:
1. Personagem sem voo nunca pode estar em sala `requiresFlight: true`
- Se detectar (ex.: bombardeador, cachorro, feiticeiro, etc):
  - mover automaticamente para uma sala terrestre aleatória (groundRooms)
  - registrar no Log como correção automática (tipo warning)
2. Nenhum item pode permanecer em sala com `mayHaveItems === false` (como ceu_cidade)
- Se detectar item.location em ceu_cidade:
  - `item.location = null; item.isDestroyed = true`
  - registrar no Log que caiu do céu e foi destruído
3. Bombas:
- Se `GameState.armedBomb.location` cair em sala aérea (por qualquer motivo):
  - cancelar/desarmar e registrar no Log (ou explodir imediatamente, dependendo do design; vou propor desarmar para evitar “soft lock”)
- Se `GameState.items.bomba.location` estiver em sala aérea:
  - destruir (mesma regra de itens)

C) Fechar o “vazamento” do kit_bomba no céu
- Em ItemUseHandlers.kit_bomba(), após desarmar:
  - Se a sala atual tiver `mayHaveItems === false`:
    - a bomba “cai”: setar `location=null` e `isDestroyed=true`
    - mensagem especial no log/modal (“ao soltar no céu, é destruída ao atingir o solo”)
  - Caso contrário, pode continuar deixando no chão como hoje.

D) Render mais defensivo (para não “mostrar lixo”)
- Render.updateItems():
  - filtrar `!item.isDestroyed`
  - se a sala atual tem `mayHaveItems === false`, sempre mostrar “Nenhum item aqui” (e opcionalmente disparar uma sanitização imediata)
Isso reduz muito a chance de o usuário “ver item no céu” mesmo que algo dê errado.

E) Harden do Bombardeador (dupla proteção)
- Manter o guard atual (requiresFlight) em processBombardeadorBombs.
- Adicionar:
  - Se bombardeador.location for inválida (null/undefined) ou sala aérea, corrigir (teleport) antes de qualquer lógica.
  - Se por algum motivo armou bomba em local inválido, WorldSanity também corrige.

F) Remover “tela inicial” do React (se a expectativa é abrir direto no jogo)
Opção 1 (simples e efetiva)
- Em src/pages/Index.tsx: redirect automático para /avenida-paulista.html via useEffect + window.location.replace.
Resultado: acessou “/”, já cai no jogo; não tem tela intermediária.
Opção 2
- Ajustar rotas do App para servir o HTML diretamente (menos comum no stack atual).

Plano de testes (o que eu vou executar após implementar)
1) Smoke test do Intro
- Abrir /avenida-paulista.html
- Verificar:
  - texto aparece rapidamente (em 1–2s no máximo)
  - movimento “para dentro” (recedendo) perceptível por Z/perspective
  - botão PULAR funciona sempre
  - ao terminar (animationend ou timer), intro sai e Game.init roda (sem ficar preso)
2) Teste de isolamento
- Durante o intro, garantir que não dá para clicar em saídas/itens do jogo por baixo.
3) Teste de spawn (repetição)
- Recarregar a página múltiplas vezes e verificar:
  - nunca há itens no ceu_cidade no início
  - bombardeador e cachorro nunca aparecem no ceu_cidade
4) Teste do “asa_delta drop = morte”
- Conseguir asa_delta, ir para ceu_cidade, largar asa_delta:
  - morte imediata
  - modal de fim de jogo aparece
5) Teste de bomba/kit_bomba no céu
- Forçar cenário onde bomba é desarmada no céu (se possível) e verificar que:
  - bomba é destruída (não fica como item no ceu_cidade)
6) Teste de regressão do bombardeador
- Jogar alguns turnos (movimento/tempo) e confirmar que:
  - não arma bomba em ceu_cidade
  - se qualquer estado inválido ocorrer, o log acusa “correção automática” e o jogo se mantém consistente
7) Console
- Confirmar sem erros no console (principalmente relacionados a IntroSystem e animação)

Entrega (resultado esperado)
- Intro/text crawl sempre aparece e sempre termina (sem “travamentos”).
- Céu da Cidade vira uma regra “impossível de quebrar”:
  - itens não persistem lá
  - personagens terrestres não ficam lá
  - bombardeador não arma bomba lá, mesmo em caso de estado corrompido
- Menos iterações para corrigir bugs: o próprio jogo denuncia e corrige inconsistências, evitando regressões “feias”.

Observação sobre “validar tudo”
- O código é um HTML monolítico com muitos sistemas (som, minimapa, eventos, render). Em vez de tentar “achar manualmente” cada bug a cada rodada, o ganho real aqui vem de:
  1) corrigir a causa raiz do Intro (timing/restart)
  2) adicionar validação contínua (WorldSanity) para impedir que qualquer bug futuro quebre as regras básicas do mundo
Isso é o que vai parar de “gastar créditos à toa”.

Se você aprovar este plano, eu implemento essas mudanças de uma vez (principalmente em public/avenida-paulista.html) e faço a rodada de smoke tests no preview para confirmar os pontos acima.
