

# Fix: Bomb flag and location sync

## Problem
When the player picks up the armed bomb, `carriedByPlayer` is set to `true` but `armedBomb.location` is **not updated** to the player's current location. This causes:
1. The tooltip/indicator shows stale location until the player moves
2. After dropping, `carriedByPlayer` is correctly set to `false`, but the intermediate state may be inconsistent
3. The `kit_bomba` disarm check (`armedBomb.location !== playerLocation`) can fail if the player hasn't moved since picking up the bomb

## Fix (2 lines)

### In `pickupItem` (line ~6162-6163)
Add `armedBomb.location = GameState.playerLocation` when the player picks up the bomb:

```javascript
if (itemId === 'bomba' && GameState.armedBomb) {
  GameState.armedBomb.carriedByPlayer = true;
  GameState.armedBomb.location = GameState.playerLocation; // ADD THIS
}
```

### In `kit_bomba` (line ~5491)
Also allow disarming if the player is carrying the bomb (not just if in the same room):

```javascript
if (GameState.armedBomb.location !== GameState.playerLocation && !GameState.armedBomb.carriedByPlayer) {
```

This ensures the bomb location is always in sync and the player can disarm it while carrying.

