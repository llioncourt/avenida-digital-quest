

# Fix: Slider em tempo real + Typewriter com emojis

## 1. Slider de volume em tempo real

**Problema**: Quando o usuario move o slider, `setVolume` atualiza `this.volume` e `masterVolume`, mas as notas MIDI ja agendadas foram criadas com o volume antigo (valor fixo no gain node). Notas futuras usam o novo volume, mas as que ja estao tocando nao mudam.

**Solucao**: Adicionar um `masterGainNode` global no MusicSystem que fica entre todos os sons e o `destination`. Quando o slider muda, ajustar o gain desse node em tempo real.

- Criar `MusicSystem.masterGain` (um GainNode conectado ao `audioCtx.destination`)
- Em `playNote` de cada MidiPlayer, conectar ao `MusicSystem.masterGain` ao inves de `audioCtx.destination`
- Em `MusicSystem.setVolume(val)`, atualizar `MusicSystem.masterGain.gain.value = val` em tempo real
- Remover a multiplicacao por `this.volume` no `playNote` (ja que o masterGain cuida disso)

Para SoundSystem, mesma abordagem:
- Criar `SoundSystem.masterGain` node
- Em `createOsc` e outros metodos de som, conectar ao `SoundSystem.masterGain`
- Em `SoundSystem.setVolume(val)`, atualizar `SoundSystem.masterGain.gain.value`

## 2. Typewriter respeitando emojis

**Problema**: `plainText[charIdx]` usa indexacao por code unit (UTF-16). Emojis como 🔥 sao 2 code units (surrogate pair), entao `text[0]` retorna metade do emoji — caractere quebrado.

**Solucao**: Usar `Array.from(plainText)` que respeita code points completos (cada emoji vira 1 elemento do array).

```javascript
// Antes:
var plainText = span.textContent || '';
var charIdx = 0;
// ... plainText[charIdx] ...

// Depois:
var chars = Array.from(span.textContent || '');
var charIdx = 0;
// ... chars[charIdx] ...
// ... charIdx < chars.length ...
```

Mudanca de ~3 linhas dentro de `_typewrite`.

## Resumo

- **MusicSystem**: criar `masterGain` node, conectar players nele, `setVolume` ajusta gain em tempo real
- **SoundSystem**: criar `masterGain` node, conectar sons nele, `setVolume` ajusta gain em tempo real
- **Typewriter**: trocar `plainText[i]` por `Array.from(plainText)[i]` para respeitar emojis
- Arquivo: apenas `public/avenida-paulista.html`

