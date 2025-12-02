# Grid

A CSS Grid layout Webflow Code Component.

Arranges slotted content items into a responsive CSS grid with configurable columns.

## Component Requirements

### Properties

- **Columns** (Number) - Min: 1, Max: 100, Step: 1, Default: 3
  - Number of equal-width columns in the grid
  - Value is clamped and rounded to ensure valid integer between 1-100

- **Content** (Slot) - Items to distribute across the grid
  - Each child element in the slot becomes a grid item
  - Grid items automatically flow into columns

- **Debug Mode** (Boolean) - Default: false
  - Shows numbered badges on each grid item
  - Displays debug panel with column count and item information

### Behavior

The Grid component creates a CSS grid container with the specified number of columns. All items placed in the Content slot are automatically distributed across the grid columns in a row-by-row fashion.

## Technical Implementation

### The Slot Problem

Webflow code components face a unique challenge with slots in Shadow DOM. When content is placed into a slot:

1. The component renders inside a `<code-island>` element with Shadow DOM
2. Webflow wraps all slot content in a `<div slot="content">` container in the light DOM
3. The Shadow DOM contains a `<slot name="content"></slot>` element
4. All user-added items are children of the wrapper div, not direct children of the code-island

This structure creates a problem for CSS Grid:

```html
<code-island>                          <!-- Where we want grid styles -->
  <div slot="content">                 <!-- Wrapper (becomes ONE grid item) -->
    <button>Item 1</button>            <!-- These need to be grid items -->
    <button>Item 2</button>
    <button>Item 3</button>
  </div>
  #shadow-root
    <div style="display: grid;">       <!-- Grid container -->
      <slot name="content"></slot>     <!-- Slot element -->
    </div>
</code-island>
```

If we apply `display: grid` to a container inside the Shadow DOM, the slot element becomes a single grid item, and all the buttons stack inside it.

### The Solution: `:host` and `::slotted()`

The Grid component uses two powerful Shadow DOM CSS pseudo-selectors to solve this:

#### `:host` Pseudo-selector

The `:host` pseudo-selector targets the shadow host element itself (the `<code-island>` element) from within the Shadow DOM stylesheet.

```css
:host {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 1rem !important;
  align-items: start !important;
  width: 100% !important;
}
```

**How it works:**
- `:host` applies styles to the `<code-island>` element
- This makes the code-island itself the grid container
- The `<div slot="content">` becomes a direct child of the grid container

**Why `!important`:**
- Webflow adds `style="display:contents"` as an inline style to code-island
- While inline styles normally override stylesheet rules, the `:host` selector combined with `!important` can override it in the computed style
- The browser applies the grid display despite the inline style attribute

#### `::slotted()` Pseudo-selector

The `::slotted()` pseudo-selector targets elements that are slotted into the Shadow DOM from the light DOM.

```css
::slotted(*) {
  display: contents !important;
}
```

**How it works:**
- `::slotted(*)` targets the `<div slot="content">` wrapper
- `display: contents` makes the wrapper "transparent" to layout
- The wrapper's children (the buttons) participate in the parent's grid layout as if the wrapper doesn't exist

**The `display: contents` magic:**
- When an element has `display: contents`, it doesn't generate a box
- Its children are laid out as if they were children of the element's parent
- This effectively "unwraps" the slot content wrapper

### The Complete Flow

With both pseudo-selectors working together:

1. `:host` makes `<code-island>` a grid container with 3 columns
2. `::slotted(*)` makes `<div slot="content">` use `display: contents`
3. The 6 buttons become direct participants in the grid layout
4. Each button occupies one grid cell, flowing across 3 columns

**Visual representation:**

```
Before (broken):
┌─ code-island (grid container) ──────────┐
│ ┌─ div[slot="content"] (ONE grid item) ┐│
│ │  Button 1                            ││
│ │  Button 2                            ││
│ │  Button 3                            ││
│ │  Button 4                            ││
│ │  Button 5                            ││
│ │  Button 6                            ││
│ └──────────────────────────────────────┘│
└──────────────────────────────────────────┘

After (with ::slotted):
┌─ code-island (grid container) ────┐
│ ┌─────┬─────┬─────┐ ← 3 columns  │
│ │ Btn1│ Btn2│ Btn3│               │
│ ├─────┼─────┼─────┤               │
│ │ Btn4│ Btn5│ Btn6│               │
│ └─────┴─────┴─────┘               │
└────────────────────────────────────┘
```

### Why This Approach Works

1. **Shadow DOM boundaries respected**: Styles don't leak out, maintaining encapsulation
2. **No wrapper interference**: The slot wrapper doesn't create an extra layout box
3. **Dynamic columns**: The grid-template-columns value is generated from the `columns` prop
4. **Proper grid behavior**: Each slotted child becomes a grid item with correct placement

### Alternative Approaches (and why they don't work)

**❌ Applying grid to the slot element:**
```css
slot { display: grid; }
```
Doesn't work because the slot element is a placeholder; its children render in the light DOM.

**❌ Wrapping slot items individually in the component:**
```tsx
{slotItems.map(child => <div>{child}</div>)}
```
Doesn't work because you can't iterate over slot children from within the component; they're in the light DOM.

**❌ Using flexbox instead of grid:**
Would require knowing item widths and breaks, defeating the purpose of a simple grid component.

## Grid Specification

### Column Calculation

- Columns are clamped: `Math.min(100, Math.max(1, Math.round(value)))`
- Non-numeric or non-finite values default to 1
- Fractional values are rounded to nearest integer
- Grid uses `minmax(0, 1fr)` to ensure equal-width columns that can shrink below content size

### Gap

- Fixed 1rem gap between grid items
- Applied to both row and column gaps

### Debug Mode

When enabled:
- Numbered badges (1, 2, 3...) appear on each grid item
- Debug panel shows:
  - Column count
  - Can be extended to show item count (requires slot children introspection)

## Use Cases

- Image galleries with consistent columns
- Product grids
- Card layouts
- Any content that needs uniform column distribution

## Limitations

- Slot content wrapper must not have display styles that override `display: contents`
- Grid items have no individual control over column span (all items occupy 1 column)
- Row height is determined by tallest item in row (use `align-items: start` to top-align)
