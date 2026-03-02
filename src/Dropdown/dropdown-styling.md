# Dropdown — CSS Custom Properties

Set these on the Dropdown component element in Webflow's style panel to override defaults.

## Level-Specific Overrides

Every variable supports an optional `-{N}` suffix (e.g. `--cc-dropdown-background-2`) that applies **only** to dropdowns at nesting depth N. Depth 1 = top-level, 2 = first nested, 3 = second nested, and so on.

**Priority order (highest → lowest):**
1. `--cc-dropdown-{property}-{N}` — level-specific override
2. `--cc-dropdown-{property}` — global default (all levels)
3. Hard-coded fallback

**Example:** Style the top-level trigger differently from nested submenus:
```css
/* Applied to every dropdown */
--cc-dropdown-background: #ffffff;
--cc-dropdown-border-width: 1px;

/* Applied only at the second nesting level */
--cc-dropdown-background-2: #f0f0f0;
--cc-dropdown-border-width-2: 0;
```

---

## Padding

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-padding` | `0.5em` / `0.75em` | Sets all four sides at once. Overridden per-side by the variables below. |
| `--cc-dropdown-padding-top` | `--cc-dropdown-padding` | Top padding on the trigger button |
| `--cc-dropdown-padding-bottom` | `--cc-dropdown-padding` | Bottom padding on the trigger button |
| `--cc-dropdown-padding-left` | `--cc-dropdown-padding` | Left padding on the trigger button |
| `--cc-dropdown-padding-right` | `--cc-dropdown-padding` | Right padding on the trigger button |

Padding also supports level suffixes on both the shorthand and the per-side variables (e.g. `--cc-dropdown-padding-2`, `--cc-dropdown-padding-top-2`).

---

## Trigger (the clickable label row)

### Color

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-background` | `none` | Background color of the trigger button |
| `--cc-dropdown-color` | `inherit` | Foreground (text and icon) color of the trigger button |

### Border

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-border-width` | `0` | Border thickness (e.g. `1px`, `2px`) |
| `--cc-dropdown-border-color` | `transparent` | Border color |
| `--cc-dropdown-border-radius` | `0` | Corner rounding (e.g. `4px`, `0.5em`, `9999px` for pill) |

---

## Panel (the dropdown container)

### Color

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-panel-background` | `none` | Background color of the panel |

### Border

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-panel-border-width` | `0` | Panel border thickness |
| `--cc-dropdown-panel-border-color` | `transparent` | Panel border color |
| `--cc-dropdown-panel-border-radius` | `0` | Panel corner rounding |

### Size

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-panel-max-width` | `none` | Maximum width before content wraps |

## Icon

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-icon-size` | `1em` | Width and height of the leading icon (always square) |
| `--cc-dropdown-icon-gap` | `0.4em` | Space between the leading icon and the label text |

## Typography

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-font-family` | `inherit` | Font family for the trigger label |
| `--cc-dropdown-font-size` | `inherit` | Font size for the trigger label |
| `--cc-dropdown-line-height` | `inherit` | Line height for the trigger label |

## Chevron

| Variable | Default | Description |
|---|---|---|
| `--cc-dropdown-chevron-gap` | `0.4em` | Space between the label text and the chevron icon |
