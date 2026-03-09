

## Plano: Ajustar caminhos MP3 + Redesign tela inicial

### 1. Prefixar todos os MP3s com `music/`

No objeto `MP3_TRACKS` (~linha 5193), adicionar `music/` a todos os valores:

```javascript
const MP3_TRACKS = {
  exploration: 'music/AVP-Theme.mp3',
  gameover: 'music/AVP-Game-Over.mp3',
  combat: 'music/AVP-Combat.mp3',
  defeat: 'music/AVP-Combat-Defeat.mp3',
  victory: 'music/AVP-Combat-Victory.mp3',
  witchChanting: 'music/AVP-Witch-Chanting.mp3',
  witchSummon: 'music/AVP-Witch-Summon.mp3',
  witchWin: 'music/AVP-Witch-Win.mp3',
  introCrawl: 'music/AVP-Intro.mp3'
};
```

### 2. Redesign da tela inicial (~linha 2248-2251)

- Remover o `<p>` com "CLIQUE PARA INICIAR"
- O `<h1>` "AVENIDA PAULISTA" vira o botão clicável (já está dentro do div com `onclick`)
- Adicionar animação de heartbeat/pulsar ao título:

```css
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.08); }
  30% { transform: scale(1); }
  45% { transform: scale(1.05); }
  60% { transform: scale(1); }
}
```

Aplicar `animation: heartbeat 1.5s ease-in-out infinite` ao `<h1>`, com `cursor: pointer` e `text-shadow` dourado para reforçar que é clicável.

### Escopo
- ~10 linhas CSS (keyframe heartbeat)
- ~2 linhas HTML alteradas (remover `<p>`, estilizar `<h1>`)
- ~9 linhas JS alteradas (prefixo `music/` nos tracks)

