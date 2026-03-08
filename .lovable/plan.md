

# Sliders de Volume para Som e Música

## O que muda

Substituir os botões simples 🔊/🎵 por controles com **slider** (input range) que aparecem ao clicar/hover no ícone. Quando o volume chega a 0, funciona como mute automaticamente.

## Implementação

### 1. HTML — Trocar botões por containers com popover slider

Cada botão vira um container com o ícone + um slider que aparece ao interagir:

```html
<div class="volume-control">
  <button class="vol-btn" onclick="SoundSystem.toggleSlider()">🔊</button>
  <div class="vol-slider" id="sound-slider">
    <input type="range" min="0" max="100" value="30" 
           oninput="SoundSystem.setVolume(this.value/100)">
  </div>
</div>
```

Mesma estrutura para MusicSystem com `value="10"` (volume atual 0.10).

### 2. CSS — Estilo do slider (~25 linhas)

- `.volume-control`: `position: relative; display: inline-block`
- `.vol-slider`: Escondido por padrão, aparece com classe `.active` (posição absoluta abaixo do botão)
- Estilizar o `input[type=range]` com cores do tema (track cinza, thumb dourado)
- Slider vertical ou horizontal compacto (~80px de largura)

### 3. JS — Lógica (~15 linhas por sistema)

**SoundSystem:**
- `setVolume(val)`: Atualiza `masterVolume = val`. Se `val === 0`, seta `enabled = false` e ícone 🔇. Se `val > 0` e `enabled === false`, seta `enabled = true` e ícone 🔊.
- `toggleSlider()`: Mostra/esconde o slider

**MusicSystem:**
- `setVolume(val)`: Atualiza `this.volume = val`. Se `val === 0`, chama `stop()`. Se `val > 0` e não está tocando, chama `start()`. Ícone 🎵/🔕 atualizado.
- `toggleSlider()`: Mostra/esconde o slider

### 4. Comportamento

- Click no ícone: abre/fecha o slider
- Click fora: fecha o slider
- Arrastar slider: volume muda em tempo real
- Volume 0 = mute (ícone muda para 🔇/🔕)
- Volume > 0 = reativa automaticamente

## Arquivos alterados

Apenas `public/avenida-paulista.html` — CSS inline + HTML + JS no mesmo arquivo.

## Risco: Baixo

Não altera lógica de áudio existente, apenas expõe `masterVolume` e `volume` via slider.

