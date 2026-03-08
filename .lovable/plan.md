

# Volume e Gain padrão em 100%

## Mudanças em `public/avenida-paulista.html`

### 1. SoundSystem — volume default 1.0
- Linha 3760: `masterVolume: 0.3` → `masterVolume: 1.0`
- Linha 2166: slider `value="30"` → `value="100"`, span `30%` → `100%`

### 2. MusicSystem — volume default 1.0
- Linha 4885: `volume: 0.15` → `volume: 1.0`
- Linha 2173: slider `value="15"` → `value="100"`, span `15%` → `100%`

### 3. Todos os MidiPlayers criados via createMidiPlayer — volume 1.0
- Linhas 4849, 4855, 4861, 4867, 4873: `volume: 0.15` → `volume: 1.0`

### 4. Gain dos sons individuais no SoundSystem — dobrar valores
Os ganhos fixos multiplicados por `masterVolume` nos efeitos sonoros (linhas ~3196, 3488, 3511, 3535, 3559, 3590, 3615, 3643, 3668, 3696-3698) já são escalados pelo `masterGain` node, então com masterVolume=1.0 eles passam o valor cheio. Não precisa dobrar — o masterVolume já cuida disso.

Na verdade, como o pedido é "aumente o gain em 100%", vou dobrar os gain values base dos osciladores nos `playNote` de MusicSystem e do `createMidiPlayer`:
- MusicSystem.playNote: `g1.gain.value = 0.7` → `1.0`, `g2.gain.value = 0.3` → `0.6`
- createMidiPlayer.playNote: gain values similares — dobrar `gain1` e `gain2` nos configs (mas eles são passados como parâmetros, então dobrar no playNote interno)

Vou verificar o playNote do createMidiPlayer para confirmar.

**Resumo**: Sliders iniciam em 100%, volumes base em 1.0, gains dos osciladores dobrados.

