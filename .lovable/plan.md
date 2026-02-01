

# Plano: Converter MIDI para Musica de Fundo via Web Audio API

## Desafio Tecnico

O arquivo MIDI e binario e precisa ser convertido para codigo JavaScript puro que pode tocar a musica usando Web Audio API, sem necessidade do arquivo MIDI original.

## Estrategia de Implementacao

### Fase 1: Parser MIDI Embutido

Criar um parser MIDI simples em JavaScript que:
1. Aceita dados MIDI em base64
2. Extrai notas, tempos e velocidades
3. Converte para array de eventos reproduziveis

### Fase 2: Sistema de Musica de Fundo

Adicionar ao `SoundSystem` existente:

```javascript
// Novo objeto MusicSystem dentro do HTML
const MusicSystem = {
  isPlaying: false,
  currentTrack: null,
  scheduledNotes: [],
  loopEnabled: true,
  volume: 0.15,
  
  // Dados da musica convertidos do MIDI
  // (notas extraidas do arquivo AvP.mid)
  tracks: {
    main: [
      // { time: 0, note: 60, duration: 0.5, velocity: 80 },
      // { time: 0.5, note: 62, duration: 0.5, velocity: 75 },
      // ... centenas de notas
    ]
  },
  
  // Tocar uma nota com Web Audio
  playNote: function(note, time, duration, velocity) {
    const freq = 440 * Math.pow(2, (note - 69) / 12);
    // Criar oscilador e envelope
  },
  
  // Iniciar musica de fundo
  start: function(trackName) {
    this.isPlaying = true;
    this.scheduleTrack(trackName);
  },
  
  // Parar musica
  stop: function() {
    this.isPlaying = false;
    // Cancelar notas agendadas
  },
  
  // Loop da musica
  scheduleTrack: function(trackName) {
    const track = this.tracks[trackName];
    // Agendar todas as notas usando audioCtx.currentTime
  }
};
```

### Fase 3: Extracao das Notas do MIDI

Para extrair as notas do arquivo `AvP.mid`, vou:

1. Criar temporariamente uma pagina HTML com parser MIDI
2. Carregar o arquivo e extrair os eventos de nota
3. Gerar o array JavaScript com todas as notas
4. Copiar esse array para o codigo final

### Estrutura de Dados das Notas

Cada nota sera representada como:

```javascript
{
  t: 0,      // tempo em segundos desde o inicio
  n: 60,     // numero da nota MIDI (60 = C4)
  d: 0.25,   // duracao em segundos
  v: 80      // velocidade (0-127)
}
```

Para economizar espaco, usar nomes curtos de propriedades.

## Integracao com Interface

### Botao de Musica no Header

Adicionar ao lado do botao de som:

```html
<button id="music-toggle" onclick="MusicSystem.toggle()" title="Musica de fundo">
  🎵
</button>
```

### Comportamento

| Estado | Icone | Acao |
|--------|-------|------|
| Musica ligada | 🎵 | Tocando em loop |
| Musica desligada | 🔕 | Silencio |

### Inicializacao

No `Game.init()`:
```javascript
MusicSystem.init();
// Nao inicia automaticamente - usuario escolhe
```

## Sintese de Som

Para recriar o som de "Acoustic Grand Piano" do MIDI:

```javascript
playNote: function(note, startTime, duration, velocity) {
  const ctx = SoundSystem.audioCtx;
  if (!ctx) return;
  
  const freq = 440 * Math.pow(2, (note - 69) / 12);
  const vol = (velocity / 127) * this.volume;
  
  // Oscilador principal (fundamental)
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.value = freq;
  
  // Segundo harmonico (oitava)
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2;
  
  // Envelope ADSR simplificado
  const gain = ctx.createGain();
  const now = startTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.01); // Attack
  gain.gain.linearRampToValueAtTime(vol * 0.7, now + 0.1); // Decay
  gain.gain.setValueAtTime(vol * 0.7, now + duration - 0.1); // Sustain
  gain.gain.linearRampToValueAtTime(0, now + duration); // Release
  
  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);
  
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}
```

## Processo de Implementacao

1. **Primeiro**: Criar parser MIDI temporario para extrair notas
2. **Segundo**: Gerar array JavaScript com todas as notas
3. **Terceiro**: Adicionar `MusicSystem` ao HTML
4. **Quarto**: Integrar botao de controle
5. **Quinto**: Testar reproducao em loop

## Arquivos Modificados

| Arquivo | Alteracao |
|---------|-----------|
| `public/avenida-paulista.html` | Adicionar `MusicSystem` (aprox. 100 linhas) |
| `public/avenida-paulista.html` | Adicionar botao de musica no header |
| `public/avenida-paulista.html` | Array de notas do MIDI (tamanho variavel) |

## Observacao Importante

Para extrair as notas do MIDI, vou precisar executar codigo que parse o arquivo binario. Isso sera feito na implementacao, gerando o array de notas hardcoded no resultado final.

## Resultado Esperado

1. Musica de fundo tocando em loop durante o jogo
2. Controle para ligar/desligar musica
3. Som sintetizado parecido com piano
4. Nenhuma dependencia externa
5. Tudo contido no arquivo HTML unico

