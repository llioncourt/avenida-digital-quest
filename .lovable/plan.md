

# Fix: Header centering, bomb log entry with distance, and tooltip when at bomb location

## 3 Changes

### 1. Header stays centered when no bomb
Currently `.bomb-indicator` uses `display: none` / `display: inline-block`. When hidden, the grid column collapses and MAPA shifts left.

**Fix**: Change to `visibility: hidden; opacity: 0; pointer-events: none` (base) and `visibility: visible; opacity: 1; pointer-events: auto` (`.active`). This preserves the grid cell space.

### 2. Bomb log entry includes distance info
The bomb tick log (line ~7021) currently only shows location name. Add the player's distance so it updates every turn as the player moves:

```
⏱️ BOMBA: 5 turno(s) para explodir em Trianon! (🚶 2 salas de distância)
```

When the player IS in the bomb room:
```
⏱️ BOMBA: 5 turno(s) para explodir AQUI! ⚠️ CORRA!
```

### 3. Tooltip shows ironic alert when player is at bomb location
In `BombIndicator.update()` (line ~7782), when `bomb.location === GameState.playerLocation`, instead of showing distance, show something like:

```
💣 Bomba AQUI com você!
⏱️ X turno(s) restante(s)
🤡 Boa sorte, herói. Você está sentado na bomba.
```

Otherwise keep the current tooltip with distance.

