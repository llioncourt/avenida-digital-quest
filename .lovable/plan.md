

## Download do Log na Tela de Game Over

### O que será feito
Adicionar um ícone discreto (📥 ou ícone de download) no modal de game over que permite baixar todo o log da partida como arquivo `.txt`.

### Alterações em `public/avenida-paulista.html`

**1. Função de download no namespace `Log`** (~15 linhas)
- `Log.downloadAsText()` — converte `Log.entries` em texto formatado (`[HH:MM] mensagem`) e dispara download como `avp-log-YYYY-MM-DD.txt` via `Blob` + `URL.createObjectURL` + link temporário

**2. Botão no modal de game over** (linha ~9359)
- Adicionar um ícone pequeno (usando emoji 📥 ou caractere ⬇) posicionado discretamente ao lado do título ou abaixo das conquistas, antes do botão "Jogar Novamente"
- Estilo inline: opacity 0.5, hover opacity 1, cursor pointer, tamanho pequeno
- `onclick="Log.downloadAsText()"`

### Escopo
- ~20 linhas de JS/HTML adicionadas
- Tudo autocontido no HTML

