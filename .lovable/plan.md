

# Limpeza de Codigo Obsoleto

## Codigo morto identificado

### 1. Speak Modal (HTML + CSS + JS + Event Listeners)
O modal de "Falar Palavra" e completamente morto. A funcao `openSpeakModal()` nunca e chamada em nenhum lugar do codigo. O jogador usa o comando `FALAR` via text input ou o botao "Converter" no modal de personagem, ambos chamam `Game.speak()` diretamente.

**Remover:**
- CSS: `#speak-modal`, `#speak-modal.active`, `#speak-input` (linhas ~971-991)
- HTML: O bloco `<div id="modal-overlay" id="speak-modal-overlay" ...>` inteiro (linhas ~1496-1506)
- JS: Funcoes `openSpeakModal`, `closeSpeakModal`, `executeSpeakCommand` no objeto Game (linhas ~5433-5457)
- JS: Event listener do `speak-input` para Enter (linhas ~5745-5752)
- JS: Chamada `Game.closeSpeakModal()` no listener de clique fora do modal (linha ~5760)

**Manter:** A funcao `Game.speak(word)` continua existindo - ela e usada pelo botao Converter do demonio e pelo comando de texto `FALAR`.

### 2. Command Input (CSS)
Existe CSS para `#command-input-container`, `#command-input`, e `#command-input:focus` (linhas ~900-920), mas nao existe nenhum elemento HTML com esses IDs. O `processCommand` e o event listener do command-input usam `getElementById` com checagem `if (commandInput)`, entao nao causam erro, mas sao codigo morto.

**Remover:**
- CSS: `#command-input-container`, `#command-input`, `#command-input:focus` (linhas ~900-920)
- JS: Funcao `processCommand` no objeto Game (linhas ~5459-5513)
- JS: Event listener do `command-input` para Enter (linhas ~5735-5743)

### 3. Console.log de debug
Existem `console.log` de debug no MusicSystem que podem ser limpos:
- `console.log('MusicSystem: Loaded ...')` (linha ~2888)
- `console.log('MusicSystem: Not loaded yet')` (linha ~2980)
- `console.log('MusicSystem: Defeat music placeholder')` (linha ~3012)
- `console.log('MusicSystem: Victory music placeholder')` (linha ~3018)

**Remover** todos os `console.log` de debug.

### 4. HTML invalido: IDs duplicados
O speak modal div tem `id="modal-overlay" id="speak-modal-overlay"` - dois atributos `id` no mesmo elemento (invalido). Isso sera resolvido ao remover o bloco inteiro.

---

## O que NAO sera removido

- `Game.speak(word)` - ainda usado pelo botao Converter e comando FALAR
- `Modals.show/hide` - usado ativamente por explosoes, personagens, restart
- CSS e HTML do modal principal (`#modal-overlay`, `#modal`) - usado ativamente
- Nenhuma funcionalidade de gameplay sera afetada

## Detalhes tecnicos

### Ordem de remocao

1. Remover CSS do speak modal e command input (~linhas 900-991)
2. Remover HTML do speak modal (~linhas 1496-1506)
3. Remover `console.log` do MusicSystem (~linhas 2888, 2980, 3012, 3018)
4. Remover funcoes `openSpeakModal`, `closeSpeakModal`, `executeSpeakCommand`, `processCommand` do Game (~linhas 5433-5513)
5. Remover event listeners mortos e chamada `closeSpeakModal` (~linhas 5735-5762)
6. Atualizar `docs/todo.md` marcando a tarefa como concluida

### Arquivo modificado

- `public/avenida-paulista.html`
- `docs/todo.md`

