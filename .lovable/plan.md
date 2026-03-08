

# Tooltip de Volume + Normalizar Musicas

## 1. Tooltip de porcentagem no slider

Adicionar um `<span>` ao lado do `<input type="range">` dentro de cada `.vol-slider` que mostra a porcentagem atual (ex: "30%"). Atualizar o valor no `oninput` do range.

**HTML**: Adicionar `<span class="vol-pct">30%</span>` e `<span class="vol-pct">10%</span>` nos sliders de som e musica respectivamente.

**CSS**: `.vol-pct` com `color: #b8860b; font-size: 0.7rem; min-width: 28px; text-align: right; margin-left: 4px;`

**JS**: No `oninput`, atualizar o span: `this.nextElementSibling.textContent = this.value + '%'`. Tambem atualizar nos `setVolume` de SoundSystem e MusicSystem.

## 2. Normalizar volumes das musicas

Atualmente os volumes base sao muito diferentes:
- MusicSystem (principal): `0.10`
- CombatMusicSystem: `0.12`
- VictoryMusicSystem: `0.12`
- ClickMusicSystem: `0.15`
- DefeatMusicSystem: `0.35`
- GameOverMusicSystem: `0.40`

Normalizar todos para `0.15` — um valor medio que funciona bem com o slider de musica. Os sistemas Combat/Victory/Click ja estao proximos. Defeat e GameOver estao muito altos comparados.

**Mudancas**:
- `MusicSystem.volume`: `0.10` → `0.15`
- `DefeatMusicSystem`: `volume: 0.35` → `volume: 0.15`
- `GameOverMusicSystem`: `volume: 0.40` → `volume: 0.15`
- Combat, Victory, Click ja estao proximos, ajustar todos para `0.15` por consistencia

**Slider de musica**: valor inicial do input range de `10` → `15` para refletir o novo default.

## Arquivos: apenas `public/avenida-paulista.html`

