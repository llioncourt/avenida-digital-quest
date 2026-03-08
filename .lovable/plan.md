

# Fix: Log scroll during typewriter animation

## Problem
The log scrolls to bottom once when the entry is first rendered (line 7600), but during the typewriter animation, as characters are added one by one, the content height grows (especially with multi-line messages) and the container doesn't scroll to keep up. The scroll position becomes stale.

## Fix
Add `container.scrollTop = container.scrollHeight` inside the typewriter's `setInterval` callback (line 7525-7532), so the log scrolls to bottom on every character tick. Also scroll after `_finishTypewriter` restores the full HTML.

### In `_typewrite` (line 7525 interval):
After inserting each character, scroll the container to bottom.

### In `_finishTypewriter` (line 7535):
After restoring `innerHTML`, scroll the container to bottom.

Both use `this._ensureContainer().scrollTop = this._ensureContainer().scrollHeight`.

