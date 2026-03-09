
## Problema

Na linha 5213 do `_addMp3Layer`, o código sempre faz `audio.currentTime = 0` antes de `audio.play()`. Isso significa que toda vez que `.start()` é chamado (ex: ao retomar do combate para exploração), a música reinicia do zero ao invés de continuar de onde parou.

## Solução

### 1. Não resetar `currentTime` se a música já estiver tocando

Adicionar uma checagem: só reseta `currentTime` se o áudio **não estiver** já em reprodução ativa.

```js
// Antes (linha 5213):
audio.currentTime = 0;
audio.play()...

// Depois:
if (audio.paused) {
  // só reseta se estava pausado/parado, não se estava tocando
  if (audio.ended || audio.currentTime === 0) {
    audio.currentTime = 0;
  }
  audio.play().catch(...)
}
```

Mas na verdade o comportamento desejado é: **se o áudio foi pausado, retomar de onde estava** (não reiniciar). Se foi completamente parado (stop() chamado), aí sim começa do início.

### 2. Distinguir "pausa" de "stop completo"

No `player.stop()` atual (linha 5228), o código faz `audio.pause()` + `audio.currentTime = 0`. Isso é correto para stop completo.

O problema é que quando a música para por qualquer outro motivo (ex: browser throttling, perda de foco), e depois `.start()` é chamado, o `audio.currentTime = 0` reinicia.

### Implementação

**Em `player.start`** — remover o `audio.currentTime = 0` incondicional. Só resetar quando o audio tiver chegado ao fim (`audio.ended`) ou quando o player estiver sendo iniciado pela primeira vez:

```js
// Lógica corrigida
if (!audio.paused) return; // já tocando, não faz nada

// Só reseta ao início se já terminou (ended) — o stop() já cuida do reset manual
if (audio.ended) {
  audio.currentTime = 0;
}

audio.play().catch(...)
```

**Flag `_stopped`** para distinguir stop intencional vs pausa acidental:

No `player.stop()` — setar `audio._stopped = true` antes de resetar.
No `player.start()` — se `_stopped`, reiniciar do zero; se não, continuar de onde estava.

### Arquivo a editar

`public/avenida-paulista.html` — apenas as linhas 5191-5236 (bloco `player.start` e `player.stop` dentro de `_addMp3Layer`).

### Mudanças específicas

1. Adicionar variável `let stoppedManually = false` junto das outras variáveis locais
2. Em `player.start`: checar se `!audio.paused` → retornar sem fazer nada (já tocando); só fazer `audio.currentTime = 0` se `stoppedManually === true` ou `audio.ended`; setar `stoppedManually = false`
3. Em `player.stop`: setar `stoppedManually = true` antes do `audio.currentTime = 0`

Nenhuma outra parte do código precisa ser alterada.
