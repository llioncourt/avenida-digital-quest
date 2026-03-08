

# Fix: Bomb icon alignment and hover tooltip in minimap

## Problems
1. **Bomb icon misaligned**: The `💣` button uses `position:absolute; left:4px; top:50%; transform:translateY(-50%)` inline on the HTML element, but visually it's floating awkwardly in the minimap area instead of being neatly aligned in the header bar alongside the title and journal icon.

2. **Hover tooltip lost**: The tooltip is appended to `document.body` and positioned via JS on `mouseenter`. The tooltip styling (`.bomb-tooltip`) has `box-shadow`, gold border, and proper formatting — this should still work, but may have positioning issues if the button's `getBoundingClientRect()` returns unexpected values due to the absolute positioning.

## Changes

### 1. Fix bomb icon alignment in minimap header (line ~2288)
Remove the inline `style="position:absolute; left:4px; top:50%; transform:translateY(-50%);"` from the bomb button. Instead, make the minimap header a proper 3-column layout (bomb | title | journal) so all three elements are naturally aligned:

**CSS (`#minimap-header`, line ~883)**:
```css
#minimap-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
}
```
Change to grid with 3 equal columns so bomb (left), title (center), journal (right) are symmetrically placed:
```css
#minimap-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  margin-bottom: 0.5rem;
}
```

**HTML (line ~2288-2293)**: Remove inline absolute positioning from both bomb button and journal button. Bomb gets `justify-self: start`, journal gets `justify-self: end`.

### 2. Restore hover tooltip visual feedback (line ~2005-2018)
Add a subtle hover glow effect to the bomb button itself:
```css
.bomb-indicator:hover {
  filter: drop-shadow(0 0 6px rgba(255, 100, 0, 0.6));
  transform: scale(1.3);
}
```

The tooltip JS logic (lines ~9967-9982) is correct — it appends to body and positions via `getBoundingClientRect()`. The fix to the button positioning (removing absolute) should make `getBoundingClientRect()` return correct values, restoring proper tooltip placement.

## Summary
- Convert `#minimap-header` from flex+absolute to grid 3-column layout
- Remove inline absolute positioning from bomb and journal buttons
- Add hover glow effect to bomb indicator for visual feedback

