

## Reescrita do Sistema de Áudio MP3 — Lógica Simplificada

### Lógica Nova (conforme especificado)

```text
1. navigator.onLine?
   ├─ NÃO → usa MIDI (sem tentar MP3)
   └─ SIM → segura execução
              ├─ Cache tem MP3s? → toca MP3 direto
              └─ Não tem cache → fetch da internet → salva no cache → toca MP3
2. Ao longo do jogo: carrega outras tracks async em background
```

### Mudanças

**Arquivo:** `public/avenida-paulista.html`

**1. Reescrever `Mp3Cache`** (linhas 5498-5551)

- Trocar `_mp3BlobCache` (Map em memória) por **Cache API** (`caches.open('avp-music-v1')`) para persistir entre sessões
- `load(url)`: checa cache primeiro, senão faz fetch e guarda no cache
- `isReady(trackKey)`: verifica se a track está no cache (sync-like via flag interna)
- `ensureTrack(trackKey)`: garante que uma track específica está carregada (retorna Promise)
- `ensureAllCritical()`: carrega as tracks essenciais (exploration, introCrawl) — retorna Promise
- `preloadRemaining()`: carrega o resto (combat, defeat, victory, gameover, witch*) de forma async sem bloquear

**2. Reescrever `_addMp3Layer`** (linhas 5564-5660)

Simplificar drasticamente:
- `player.start()`:
  - Se offline → `originalStart()` (MIDI)
  - Se online → `Mp3Cache.ensureTrack(trackKey)` → quando resolver, toca Audio do blob. Se falhar, MIDI fallback
- `player.stop()` / `player.pause()`: para o Audio se ativo, senão para MIDI

**3. Reescrever inicialização** (linhas 5669-5679)

Remover `preloadAll()` automático e o listener de retry. A lógica agora é:
- No `StartScreen.start()` (linha 11116-11119): antes de chamar `IntroSystem.init()`, verificar online e carregar tracks críticas
- Se offline: segue direto com MIDI
- Se online: `await Mp3Cache.ensureAllCritical()` → depois inicia intro com MP3

**4. Background preload** 

Após `Game.init()` iniciar, disparar `Mp3Cache.preloadRemaining()` para carregar combat/defeat/victory/witch tracks em background.

**5. IntroSystem.init()** (linhas 11018-11039)

Simplificar: a track de intro já vai estar garantida pelo passo 3 quando online. Basta pegar do cache.

**6. Game.init()** (linhas 9870-9878)

Após inicializar music systems, chamar `Mp3Cache.preloadRemaining()` para carregar tracks secundárias em background.

### Resumo das Mudanças

| Local | O que muda |
|-------|-----------|
| `Mp3Cache` | Cache API persistente + `ensureTrack`/`ensureAllCritical`/`preloadRemaining` |
| `_addMp3Layer.start()` | Online? → ensure + toca. Offline? → MIDI direto |
| Inicialização | `StartScreen.start()` segura até critical tracks carregarem (se online) |
| `IntroSystem.init()` | Assume track já carregada, pega do cache |
| `Game.init()` | Dispara `preloadRemaining()` async |
| `_mp3BlobCache` / `_mp3AudioElements` | Removidos — substituídos por Cache API |

