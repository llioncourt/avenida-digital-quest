

## Adicionar imagens faltantes + Portrait dinâmico do Traje Protetor

### 1. Copiar e converter imagens
- Copiar imagem 1 (traje) para `public/textures/bg_traje_protetor.webp`
- Copiar imagem 2 (teto MASP) para `public/rooms/teto_masp.webp`

### 2. Atualizar ImagePreloader
No array de rooms (linha 11813): adicionar `'teto_masp'`
No array de textures (linha 11818): adicionar `'traje_protetor'`
No array de portraits (linha 11822): adicionar `'01_player_traje_protetor'` (nova imagem do player com traje)

### 3. Salvar portrait do player com traje
Copiar a mesma imagem 1 para `public/portraits/01_player_traje_protetor.webp` — será usada como portrait do player quando ele tem o traje equipado.

### 4. Portrait dinâmico no combate
Modificar `Portraits.createEl()` (linha 7597): quando `charId === 'player'`, verificar se `GameState.playerInventory.includes('traje_protetor')`. Se sim, usar `portraits/01_player_traje_protetor.webp` como URL neutra em vez de `01_player_neutro.webp`.

Alteração em `Portraits.createEl`:
```javascript
createEl: function(charId, moveName) {
  var self = this;
  var div = document.createElement('div');
  div.className = 'combat-portrait';
  var specificUrl = this.buildUrl(charId, moveName);
  var neutralUrl = this.buildUrl(charId, 'neutro');
  
  // Player com traje protetor usa portrait especial
  if (charId === 'player' && GameState.playerInventory.includes('traje_protetor')) {
    neutralUrl = 'portraits/01_player_traje_protetor.webp';
    if (!moveName || moveName === 'neutro') {
      specificUrl = neutralUrl;
    }
  }
  
  var img = document.createElement('img');
  img.src = specificUrl;
  // ... resto igual
```

Isso cobre automaticamente todos os cenários: quando o player pega o traje, o portrait muda; quando larga (splice do inventário), o traje sai do inventário e o portrait volta ao neutro na próxima renderização. Não precisa de hook extra no drop/trap porque o portrait é calculado dinamicamente a cada combate.

