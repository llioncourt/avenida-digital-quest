

## Problema: MP3s com espaços no nome retornam 404 no site publicado

O servidor do Lovable não consegue servir arquivos estáticos com espaços no nome. `favicon.ico` e `placeholder.svg` funcionam, mas `AVP Theme.mp3` retorna 404.

## Solução: Renomear todos os MP3s para usar hífens

### 1. Renomear arquivos em `public/`

| Atual | Novo |
|-------|------|
| `AVP Combat Defeat.mp3` | `AVP-Combat-Defeat.mp3` |
| `AVP Combat Victory.mp3` | `AVP-Combat-Victory.mp3` |
| `AVP Combat.mp3` | `AVP-Combat.mp3` |
| `AVP Game Over.mp3` | `AVP-Game-Over.mp3` |
| `AVP Theme.mp3` | `AVP-Theme.mp3` |
| `AVP Witch Chanting.mp3` | `AVP-Witch-Chanting.mp3` |
| `AVP Witch Summon.mp3` | `AVP-Witch-Summon.mp3` |
| `AVP Witch Win.mp3` | `AVP-Witch-Win.mp3` |

### 2. Atualizar `MP3_TRACKS` em `public/avenida-paulista.html` (~linha 5120)

```js
const MP3_TRACKS = {
  exploration: 'AVP-Theme.mp3',
  gameover: 'AVP-Game-Over.mp3',
  combat: 'AVP-Combat.mp3',
  defeat: 'AVP-Combat-Defeat.mp3',
  victory: 'AVP-Combat-Victory.mp3',
  witchChanting: 'AVP-Witch-Chanting.mp3',
  witchSummon: 'AVP-Witch-Summon.mp3',
  witchWin: 'AVP-Witch-Win.mp3'
};
```

Nenhuma outra alteração necessária — todas as referências aos MP3s passam por `MP3_TRACKS`.

