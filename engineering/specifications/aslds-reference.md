# ASL Design System (ASLDS) — Master Reference

**Version:** 1.1 Stable
**Purpose:** Single source of truth for every class, token, component, and behavior in ASLDS.
**Rule:** If it isn't documented here, it isn't part of ASLDS — do not invent it.

---

## Section 01 — How to Use This Document

### Purpose

This document is the authoritative reference for building any page, application, or component inside the A Square L Innovate ecosystem. Every class, token, animation, and behavior used in production must be traceable to a section here.

### Structure

| Section Range | Content |
| :--- | :--- |
| 01 | How to Use This Document |
| 02 | Design Tokens |
| 03–08 | Base Styles (reset, typography, layout, utilities, motion, documentation) |
| 09–24 | Component Catalog |
| 25–35 | JavaScript Module Catalog |
| 36 | Golden Rules |
| 37 | Canonical Page Template |

### Golden Rules (summary — full list in Section 36)

1. **Never** write inline CSS for a component that already exists in ASLDS.
2. **Never** duplicate behavior that already lives in a JS module.
3. **Never** invent a class name — use the ones documented here.
4. **If a pattern repeats twice** → it belongs in ASLDS, not on the page.
5. **If a pattern is truly one-off** → keep it minimal and page-local.

### How To Read Each Section

Every component section follows this format:

```
### Component Name
File:          path/to/file.css
JS Module:     module-name.js (or "None")
HTML:          <exact markup>
Variants:      list
Sizes:         list
States:        list
A11y:          requirements
Notes:         gotchas
```

---

## Section 02 — Design Tokens

**Source:** `packages/aslds/css/variables.css`
**Scope:** Global. Available to every page and every component.
**Rule:** Always reference tokens via `var(--token-name)`. Never hardcode the value.

---

### 2.1 Colors

#### Brand / Primary

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--primary-gold` | `#D4AF37` | Primary brand color, accents, active states |
| `--primary-gold-hover` | `#E5C158` | Hover state for gold elements |
| `--dark-gold` | `#B8860B` | Gradient endpoints, secondary accents |
| `--gold-light` | `#F5E7A1` | Soft highlights, gradient endpoints |

#### Neutrals

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--black` | `#000000` | Pure black (rare) |
| `--background` | `#050505` | Page background (dark theme) |
| `--surface` | `#0B0B0B` | Elevated surfaces |
| `--card-bg` | `#111111` | Card backgrounds |
| `--card-hover` | `#1A1A1A` | Card hover state |
| `--border-color` | `#222222` | Default border |

#### Whites & Grays

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--white` | `#FFFFFF` | Primary text (dark theme) |
| `--gray-100` | `#F5F5F5` | Headings, high-emphasis text |
| `--gray-200` | `#DDDDDD` | Body text (high) |
| `--gray-300` | `#C9C9C9` | Body text (default) |
| `--gray-400` | `#B3B3B3` | Muted text, secondary labels |
| `--gray-500` | `#999999` | Disabled text, hints |
| `--gray-600` | `#777777` | Subdued text |
| `--gray-700` | `#555555` | Borders in light theme |
| `--gray-800` | `#333333` | Darker borders |
| `--gray-900` | `#1A1A1A` | Darkest surface |

#### Status Colors

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--success` | `#22C55E` | Success alerts, toasts, badges |
| `--warning` | `#FACC15` | Warnings |
| `--danger` | `#EF4444` | Errors, destructive actions |
| `--info` | `#3B82F6` | Informational messages |

---

### 2.2 Typography

#### Font Family

| Token | Value |
| :--- | :--- |
| `--font-family` | `'Nunito', sans-serif` |

**Rule:** Always inherit the font from `body`. Never set a font-family on individual elements unless documented.

#### Font Sizes

| Token | Value | Typical Use |
| :--- | :--- | :--- |
| `--fs-xs` | `12px` | Micro text, badges |
| `--fs-sm` | `14px` | Small labels, captions |
| `--fs-md` | `16px` | Body (default) |
| `--fs-lg` | `18px` | Lead paragraphs |
| `--fs-xl` | `20px` | H5, small headings |
| `--fs-2xl` | `24px` | H4 |
| `--fs-3xl` | `30px` | H3 |
| `--fs-4xl` | `36px` | H2 |
| `--fs-5xl` | `48px` | H1 (standard) |
| `--fs-6xl` | `64px` | Display / hero titles |

#### Font Weights

| Token | Value |
| :--- | :--- |
| `--fw-light` | `300` |
| `--fw-normal` | `400` |
| `--fw-medium` | `500` |
| `--fw-semibold` | `600` |
| `--fw-bold` | `700` |
| `--fw-extrabold` | `800` |

#### Line Heights

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--lh-tight` | `1.2` | Headings |
| `--lh-normal` | `1.6` | Body |
| `--lh-relaxed` | `1.8` | Long-form reading |

---

### 2.3 Spacing System

**Grid:** 8px baseline.

| Token | Value | Common Use |
| :--- | :--- | :--- |
| `--space-1` | `8px` | Tight gaps |
| `--space-2` | `16px` | Default gap |
| `--space-3` | `24px` | Paragraph rhythm |
| `--space-4` | `32px` | Card padding |
| `--space-5` | `40px` | Section internal |
| `--space-6` | `48px` | Sub-section rhythm |
| `--space-7` | `56px` | — |
| `--space-8` | `64px` | Section rhythm (compact) |
| `--space-9` | `80px` | — |
| `--space-10` | `96px` | Section rhythm (standard) |
| `--space-11` | `120px` | Hero / large sections |

**Rule:** All padding and margin should use these tokens, not raw pixel values.

---

### 2.4 Border Radius

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--radius-sm` | `8px` | Small chips, tags |
| `--radius-md` | `12px` | Inputs, small cards |
| `--radius-lg` | `18px` | Cards, panels |
| `--radius-xl` | `24px` | Large cards, modals |
| `--radius-round` | `999px` | Pills, avatars, badges |

---

### 2.5 Shadows

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,.15)` | Subtle elevation |
| `--shadow-md` | `0 8px 20px rgba(0,0,0,.25)` | Cards |
| `--shadow-lg` | `0 15px 40px rgba(0,0,0,.35)` | Elevated panels, modals |
| `--shadow-gold` | `0 0 15px rgba(212,175,55,.20)` | Gold glow emphasis |

---

### 2.6 Glass Effect

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--glass-bg` | `rgba(255,255,255,.04)` | Glass surface (dark) |
| `--glass-border` | `rgba(255,255,255,.08)` | Glass border |
| `--glass-blur` | `blur(10px)` | Backdrop filter |

**Note:** Glass background/border are overridden in light theme.

---

### 2.7 Transitions

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--transition-fast` | `0.2s ease` | Hover, active states |
| `--transition-normal` | `0.3s ease` | Default transitions |
| `--transition-slow` | `0.6s ease` | Theme transitions, large animations |

**Rule:** Always use these tokens for transition durations.

---

### 2.8 Z-Index

| Token | Value | Layer |
| :--- | :--- | :--- |
| `--z-dropdown` | `1000` | Dropdown menus |
| `--z-sticky` | `1020` | Sticky elements |
| `--z-navbar` | `1030` | Navbar |
| `--z-modal` | `1050` | Modal overlays |
| `--z-tooltip` | `1060` | Tooltips |
| `--z-toast` | `1070` | Toast notifications |
| `--z-loader` | `1200` | Full-screen loaders |

**Rule:** Never hardcode a `z-index`. Always use a token so layering stays predictable.

---

### 2.9 Container

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--container-width` | `1200px` | Max content width |
| `--container-padding` | `24px` | Horizontal page padding |

---

### 2.10 Component Dimensions

| Token | Value | Component |
| :--- | :--- | :--- |
| `--navbar-height` | `75px` | Navbar |
| `--sidebar-width` | `280px` | Sidebar |
| `--btn-height` | `50px` | Buttons (default) |
| `--btn-padding` | `0 28px` | Buttons (default) |
| `--input-height` | `52px` | Form inputs |
| `--course-card-height` | `340px` | Academy course cards |
| `--lesson-sidebar-width` | `320px` | Academy lesson sidebar |
| `--progress-height` | `8px` | Progress bars |

---

### 2.11 Breakpoints

**Reference only.** CSS media queries use these values directly.

| Token | Value | Target |
| :--- | :--- | :--- |
| `--mobile` | `576px` | Small phones |
| `--tablet` | `768px` | Tablets |
| `--laptop` | `992px` | Laptops |
| `--desktop` | `1200px` | Desktops |
| `--wide` | `1400px` | Large screens |

---

### 2.12 Theme Overrides

Themes are activated by setting `data-theme` on the `<html>` element:

```html
<html data-theme="dark">
<html data-theme="light">
```

`theme.js` handles this automatically — pages do not need to set it manually.

**What changes per theme:**

| Category | Light Theme | Dark Theme |
| :--- | :--- | :--- |
| `--background` | `#F8FAFC` | `#050505` |
| `--surface` | `#FFFFFF` | `#0B0B0B` |
| `--card-bg` | `#FFFFFF` | `#111111` |
| `--card-hover` | `#F3F4F6` | `#1A1A1A` |
| `--white` | `#111111` | `#FFFFFF` |
| `--gray-100…900` | Inverted | Standard |
| `--border-color` | `#D8D8D8` | `#222222` |
| `--glass-bg` | `rgba(255,255,255,.75)` | `rgba(255,255,255,.04)` |
| `--glass-border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` |

**Rule:** Never check theme state in CSS. Always reference tokens — they resolve automatically.

---

### 2.13 Theme Transitions

Added to prevent flash on theme switch:

```css
:root:not(.theme-transitioning) {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

:root.theme-transitioning * {
    transition: none !important;
}
```

`theme.js` adds `.theme-transitioning` during initial load to prevent flash, then removes it.

The `[data-theme-toggle]` element gets a smooth opacity transition automatically.

---

### 2.14 Token Usage Rules

| ✅ Do | ❌ Don't |
| :--- | :--- |
| `color: var(--primary-gold);` | `color: #D4AF37;` |
| `padding: var(--space-4);` | `padding: 32px;` |
| `border-radius: var(--radius-lg);` | `border-radius: 18px;` |
| `box-shadow: var(--shadow-md);` | `box-shadow: 0 8px 20px rgba(0,0,0,.25);` |
| `z-index: var(--z-modal);` | `z-index: 1050;` |
| `transition: var(--transition-normal);` | `transition: 0.3s ease;` |

**If a value is not tokenized, do not invent a token on the page.** Request it be added to `variables.css`.

---

### 2.15 Gold Glow Tints

Ambient glow tints used for section and card backgrounds. Values are theme-neutral — same rgba works on light and dark.

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--gold-glow-strong` | `rgba(212,175,55,.16)` | Hero pulsing glow |
| `--gold-glow-medium` | `rgba(212,175,55,.08)` | Section ambient glow, card sheen |
| `--gold-glow-soft`   | `rgba(212,175,55,.04)` | Edge fade in gradients |

# Section 03 — Base Reset

**Source:** `packages/aslds/css/reset.css`
**Scope:** Applied globally via `reset.css`. Runs before every other stylesheet.
**Rule:** Do not fight the reset. Understand what's already handled so you don't redefine it per-page.

---

### 3.1 Universal Reset

```css
*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

**Impact:**
- All margins and paddings default to `0` — you must add spacing explicitly.
- `box-sizing: border-box` everywhere — padding and border are inside declared widths.
- No need to reset spacing per-element. Ever.

---

### 3.2 HTML & Body

| Selector | Behavior |
| :--- | :--- |
| `html` | `scroll-behavior: smooth` · `font-size: 16px` (root for `rem`) |
| `body` | `min-height: 100vh` · font, background, text color, line-height pulled from tokens |

Body uses these tokens automatically:

| Property | Token |
| :--- | :--- |
| `font-family` | `--font-family` |
| `background` | `--background` |
| `color` | `--white` |
| `line-height` | `--lh-normal` |

**Additional body behavior:**
- `text-rendering: optimizeLegibility`
- `-webkit-font-smoothing: antialiased`
- `-moz-osx-font-smoothing: grayscale`
- `overflow-x: hidden`

**Rule:** Never set font-family, background, or text color on `body`. It's already done.

---

### 3.3 Media Elements

| Element | Reset Applied |
| :--- | :--- |
| `img`, `picture` | `max-width: 100%` · `display: block` · `user-select: none` |
| `video` | `max-width: 100%` · `display: block` |
| `svg` | `display: block` |

**Impact:**
- Images are responsive by default — no need for `width: 100%` on image tags.
- Images are `display: block` — no more `inline-block` gap issues.
- Users cannot accidentally select or drag images.

---

### 3.4 Links

```css
a {
    text-decoration: none;
    color: inherit;
    transition: var(--transition-normal);
}
```

**Impact:**
- Links have no underline by default.
- Links inherit text color from parent.
- Links transition with `--transition-normal` automatically.

**Rule:** To style a link, target `a` or `a:hover` — do not redefine `text-decoration` or `color: inherit` unless intentionally overriding.

---

### 3.5 Lists

```css
ul, ol { list-style: none; }
```

**Impact:**
- All lists are unstyled by default — no bullets, no numbers, no indentation.
- To restore list styling in content areas, add a class like `.list-disc` or `.list-decimal`.

---

### 3.6 Buttons

| Property | Value |
| :--- | :--- |
| `border` | `none` |
| `background` | `none` |
| `font` | `inherit` |
| `color` | `inherit` |
| `cursor` | `pointer` |
| `:disabled` | `cursor: not-allowed` · `opacity: .6` |

**Impact:**
- A raw `<button>` has no default styling — visually identical to plain text.
- Always pair with `.btn` + variant (see Section 09).
- Disabled state is styled globally — no per-page work needed.

---

### 3.7 Form Inputs

```css
input, textarea, select {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    outline: none;
}

textarea { resize: vertical; }
```

**Impact:**
- Inputs inherit the page font, color, and have no borders/background.
- Focus outline is removed — **do not rely on it** for visible focus.
- `textarea` is vertical-resize only.

**Rule:** Always style inputs via documented form classes (Section 11). Never rely on browser defaults.

---

### 3.8 Tables

```css
table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}
```

**Impact:**
- Tables fill their container by default.
- No gaps between cells.
- Structural styles (borders, padding, headers) come from `table.css` (Section 24).

---

### 3.9 Forms Structure

| Element | Reset |
| :--- | :--- |
| `fieldset` | `border: none` |
| `legend` | `padding: 0` |

---

### 3.10 Horizontal Rule

```css
hr {
    border: none;
    border-top: 1px solid var(--border-color);
}
```

**Impact:**
- `<hr>` uses the theme-aware border color automatically.
- Works in light and dark mode without additional CSS.

---

### 3.11 Selection

```css
::selection {
    background: var(--primary-gold);
    color: var(--black);
}
```

**Impact:**
- Text selection uses brand gold.
- Contrast is set to black for legibility.

---

### 3.12 Scrollbar (Chrome, Edge, Safari)

| Part | Style |
| :--- | :--- |
| Track | `var(--surface)` |
| Thumb | `var(--primary-gold)` · `border-radius: var(--radius-round)` |
| Thumb hover | `var(--dark-gold)` |
| Width | `10px` |

**Note:** Firefox uses its own scrollbar API — not styled here. Acceptable inconsistency.

---

### 3.13 Focus Accessibility

```css
:focus-visible {
    outline: 2px solid var(--primary-gold);
    outline-offset: 3px;
}
```

**Impact:**
- Keyboard focus is always visible with a gold outline.
- Mouse clicks do not trigger the outline (`:focus-visible` behavior).
- Do not remove or override this globally.

---

### 3.14 Hidden Attribute

```css
[hidden] { display: none !important; }
```

**Impact:**
- Setting `hidden` on any element reliably hides it, even if other styles try to override.
- Preferred over `style="display:none"`.

---

### 3.15 Reset — What This Means For You

| Already handled | What you must do |
| :--- | :--- |
| Margins & padding zeroed | Add spacing with tokens |
| Box-sizing set | Nothing — layout math is predictable |
| Body font/background/color | Never set these on body |
| Images responsive | Use as-is |
| Links unstyled | Add your own visual treatment |
| Buttons unstyled | Always pair with `.btn` |
| Inputs unstyled | Always pair with form classes |
| Focus visible | Never override — design around it |
| Scrollbar branded | Leave alone unless required |

---

### 3.16 Skip Link

```css
.skip-link {
    position: absolute;
    top: -100px;
    left: 0;
    z-index: 9999;
    padding: 12px 20px;
    background: var(--primary-gold);
    color: var(--black);
    font-weight: 700;
    font-size: var(--fs-sm);
    text-decoration: none;
    border-radius: 0 0 var(--radius-md) 0;
    transition: top .2s ease;
}

.skip-link:focus {
    top: 0;
    outline: 2px solid var(--primary-gold);
    outline-offset: 2px;
}

================================================================================
SECTION 04 — TYPOGRAPHY
Source: packages/aslds/css/typography.css
Scope:  Global. Applied to every page automatically.
Rule:   Never redefine these styles per-page. Only extend via documented classes.
================================================================================

4.1 GOOGLE FONT
--------------------------------------------------------------------------------
@import url('...Nunito:300;400;500;600;700;800...')

Loaded automatically by typography.css. Weights available: 300–800.

Rule: Do not add another @import for Nunito. Only add new fonts if truly new.

--------------------------------------------------------------------------------
4.2 BODY (base text defaults)
--------------------------------------------------------------------------------
font-family:   var(--font-family)   → 'Nunito', sans-serif
font-size:     var(--fs-md)         → 16px
font-weight:   var(--fw-normal)     → 400
line-height:   var(--lh-normal)     → 1.6
color:         var(--white)         → theme-aware (dark: #FFF, light: #111)

Rule: Never set base text styles on body. Already done here.

--------------------------------------------------------------------------------
4.3 HEADINGS — h1..h6
--------------------------------------------------------------------------------
Common to all headings:
    font-weight:   var(--fw-bold)    → 700
    line-height:   var(--lh-tight)   → 1.2
    margin-bottom: var(--space-2)    → 16px
    color:         var(--white)

Individual sizes:
    h1 → var(--fs-6xl)   → 64px
    h2 → var(--fs-5xl)   → 48px
    h3 → var(--fs-4xl)   → 36px
    h4 → var(--fs-3xl)   → 30px
    h5 → var(--fs-2xl)   → 24px
    h6 → var(--fs-xl)    → 20px

Rule: Use semantic heading tags (h1..h6), not styled divs.
Rule: Only one <h1> per page.

--------------------------------------------------------------------------------
4.4 PARAGRAPHS — p
--------------------------------------------------------------------------------
font-size:     var(--fs-lg)        → 18px
color:         var(--gray-400)     → muted
margin-bottom: var(--space-2)      → 16px

Rule: <p> is muted by default. For emphasis use <strong>.

--------------------------------------------------------------------------------
4.5 LINKS — a
--------------------------------------------------------------------------------
Default:
    color:      var(--white)
    transition: var(--transition-normal)

Hover:
    color:      var(--primary-gold)

Rule: Never re-declare link transition or hover gold. Global.

--------------------------------------------------------------------------------
4.6 LISTS — ul, ol, li
--------------------------------------------------------------------------------
ul, ol:
    margin-bottom: var(--space-2)   → 16px

li:
    color:         var(--gray-300)
    margin-bottom: 8px

Note: bullets/numbers removed by reset.css. Add .list-disc / .list-decimal if needed.

--------------------------------------------------------------------------------
4.7 EMPHASIS
--------------------------------------------------------------------------------
strong → color: var(--white); font-weight: var(--fw-bold)
em     → font-style: italic

--------------------------------------------------------------------------------
4.8 SMALL TEXT — small
--------------------------------------------------------------------------------
font-size: var(--fs-sm)      → 14px
color:     var(--gray-500)   → subdued

--------------------------------------------------------------------------------
4.9 LABELS — label
--------------------------------------------------------------------------------
display:       block
margin-bottom: 8px
font-weight:   var(--fw-semibold)   → 600
color:         var(--white)

Rule: Always pair a label with a form input (Section 11).

--------------------------------------------------------------------------------
4.10 INLINE CODE — code
--------------------------------------------------------------------------------
background:     var(--surface)
color:          var(--primary-gold)
padding:        2px 6px
border-radius:  var(--radius-sm)   → 8px
font-family:    Consolas, monospace

--------------------------------------------------------------------------------
4.11 CODE BLOCK — pre
--------------------------------------------------------------------------------
background:     #050505
border:         1px solid var(--border-color)
border-radius:  var(--radius-md)   → 12px
padding:        24px
overflow:       auto
margin-bottom:  var(--space-3)     → 24px

Inside pre:
    pre code → background: none; color: var(--gray-200); padding: 0;

--------------------------------------------------------------------------------
4.12 BLOCKQUOTE
--------------------------------------------------------------------------------
border-left:    4px solid var(--primary-gold)
padding-left:   20px
margin:         32px 0
color:          var(--gray-300)
font-style:     italic

--------------------------------------------------------------------------------
4.13 HORIZONTAL RULE — hr
--------------------------------------------------------------------------------
margin: 40px 0
(border style defined in reset.css → 1px solid var(--border-color))

--------------------------------------------------------------------------------
4.14 TEXT UTILITY CLASSES
--------------------------------------------------------------------------------
Alignment:
    .text-center   → text-align: center
    .text-left     → text-align: left
    .text-right    → text-align: right

Color:
    .text-gold     → var(--primary-gold)
    .text-white    → var(--white)
    .text-gray     → var(--gray-400)
    .text-success  → var(--success)
    .text-warning  → var(--warning)
    .text-danger   → var(--danger)
    .text-info     → var(--info)

Rule: Use these utilities instead of inline styles.

--------------------------------------------------------------------------------
4.15 RESPONSIVE TYPOGRAPHY (max-width: 768px)
--------------------------------------------------------------------------------
    h1 → 42px
    h2 → 34px
    h3 → 28px
    h4 → 24px
    p  → 16px

Rule: These fire automatically. Do not override in page CSS.

--------------------------------------------------------------------------------
4.16 QUICK REFERENCE
--------------------------------------------------------------------------------
Element        Default Style                                Token
-------------- -------------------------------------------- --------------------
body           16px / 1.6 / Nunito / --white                --fs-md, --lh-normal
h1             64px / 700 / tight / white                   --fs-6xl
h2             48px / 700 / tight / white                   --fs-5xl
h3             36px / 700 / tight / white                   --fs-4xl
h4             30px / 700 / tight / white                   --fs-3xl
h5             24px / 700 / tight / white                   --fs-2xl
h6             20px / 700 / tight / white                   --fs-xl
p              18px / --gray-400 / mb 16px                  --fs-lg
a              --white → hover --primary-gold
small          14px / --gray-500                            --fs-sm
label          block / 600 / white / mb 8px                 --fw-semibold
strong         bold / white
code           gold on --surface / rounded                  --primary-gold
pre            #050505 / bordered / 24px padding
blockquote     gold left border / italic
hr             40px vertical margin

--------------------------------------------------------------------------------
4.17 GOLDEN RULES FOR TYPOGRAPHY
--------------------------------------------------------------------------------
✅ Use semantic tags: <h1>…<h6>, <p>, <strong>, <em>, <small>, <code>, <pre>
✅ Use .text-* utilities for alignment and color
✅ Use <code> for inline code and <pre><code> for blocks
✅ Let responsive sizes apply automatically

❌ Never set font-family on page elements — inherit from body
❌ Never hardcode font sizes — use tokens or heading tags
❌ Never remove the gold hover from links globally
❌ Never override the responsive type scale per-page
❌ Never style <p> to be white — use <strong> for emphasis

================================================================================
END OF SECTION 04
================================================================================


================================================================================
SECTION 05 — LAYOUT
Source: packages/aslds/css/layout.css
Scope:  Global. Provides containers, sections, grids, flex utilities, and page shells.
Rule:   Use these classes instead of writing layout CSS per page.
================================================================================

5.1 MAIN CONTAINER
--------------------------------------------------------------------------------
.container
    width:      100%
    max-width:  var(--container-width)   → 1200px
    margin:     0 auto
    padding:    0 var(--container-padding) → 0 24px
    box-sizing: border-box

Rule: Wrap every page's content sections in .container.
Rule: Never set max-width or auto-margins manually.

--------------------------------------------------------------------------------
5.2 SECTION PADDING
--------------------------------------------------------------------------------
.section       → padding: var(--space-10) 0     → 96px vertical
.section-sm    → padding: var(--space-7) 0      → 56px vertical
.section-lg    → padding: var(--space-11) 0     → 120px vertical

Rule: Every major content block uses one of these three.
Rule: Do not add vertical padding to sections in page CSS.

--------------------------------------------------------------------------------
5.3 PAGE SHELL
--------------------------------------------------------------------------------
.page-wrapper
    min-height:     100vh
    display:        flex
    flex-direction: column

.main-content
    flex: 1

Purpose: Pushes the footer to the bottom on short pages.
Structure:
    <div class="page-wrapper">
        <header>...</header>
        <main class="main-content">...</main>
        <footer>...</footer>
    </div>

Rule: Always wrap the page in .page-wrapper, and use <main class="main-content">.

--------------------------------------------------------------------------------
5.4 DISPLAY UTILITIES
--------------------------------------------------------------------------------
.d-flex       → display: flex
.d-grid       → display: grid
.d-block      → display: block
.d-inline     → display: inline-block

--------------------------------------------------------------------------------
5.5 FLEX DIRECTION
--------------------------------------------------------------------------------
.flex-column  → flex-direction: column
.flex-row     → flex-direction: row

--------------------------------------------------------------------------------
5.6 FLEX ALIGNMENT
--------------------------------------------------------------------------------
Vertical (align-items):
    .align-center → align-items: center
    .align-start  → align-items: flex-start
    .align-end    → align-items: flex-end

Horizontal (justify-content):
    .justify-center  → justify-content: center
    .justify-between → justify-content: space-between
    .justify-around  → justify-content: space-around
    .justify-evenly  → justify-content: space-evenly
    .justify-start   → justify-content: flex-start
    .justify-end     → justify-content: flex-end

Rule: Combine with .d-flex, e.g. <div class="d-flex align-center justify-between">.

--------------------------------------------------------------------------------
5.7 GAP UTILITIES
--------------------------------------------------------------------------------
.gap-1 → var(--space-1)   → 8px
.gap-2 → var(--space-2)   → 16px
.gap-3 → var(--space-3)   → 24px
.gap-4 → var(--space-4)   → 32px
.gap-5 → var(--space-5)   → 40px
.gap-6 → var(--space-6)   → 48px

Rule: Use .gap-* on flex/grid parents instead of margins on children.

--------------------------------------------------------------------------------
5.8 GRID SYSTEM
--------------------------------------------------------------------------------
.grid          → display: grid; gap: var(--space-4)
.grid-2        → grid-template-columns: repeat(2, 1fr)
.grid-3        → grid-template-columns: repeat(3, 1fr)
.grid-4        → grid-template-columns: repeat(4, 1fr)
.grid-auto     → repeat(auto-fit, minmax(280px, 1fr))

Rule: Combine .grid + .grid-2 (etc.) for immediate layouts.
Example:
    <div class="grid grid-3">
        <div>…</div><div>…</div><div>…</div>
    </div>

--------------------------------------------------------------------------------
5.9 WIDTH UTILITIES
--------------------------------------------------------------------------------
.w-100  → width: 100%
.w-50   → width: 50%
.w-auto → width: auto

--------------------------------------------------------------------------------
5.10 HEIGHT UTILITIES
--------------------------------------------------------------------------------
.h-100   → height: 100%
.min-vh  → min-height: 100vh

--------------------------------------------------------------------------------
5.11 OVERFLOW
--------------------------------------------------------------------------------
.overflow-hidden → overflow: hidden
.overflow-auto   → overflow: auto

--------------------------------------------------------------------------------
5.12 POSITION
--------------------------------------------------------------------------------
.relative  → position: relative
.absolute  → position: absolute
.fixed     → position: fixed
.sticky    → position: sticky; top: 0; z-index: var(--z-navbar)

Rule: .sticky carries a z-index automatically — do not add another.

--------------------------------------------------------------------------------
5.13 HERO LAYOUT
--------------------------------------------------------------------------------
.hero           → min-height: 85vh; display: flex; align-items: center
.hero-content   → flex: 1
.hero-image     → flex: 1; display: flex; justify-content: center

Note: For documentation pages, showcase.css overrides hero with a grid layout.
For application pages (public-site), this simple flex hero is the default.

--------------------------------------------------------------------------------
5.14 DASHBOARD LAYOUT
--------------------------------------------------------------------------------
.dashboard-layout  → grid: 280px 1fr; min-height: 100vh
.sidebar           → background: var(--card-bg); border-right: 1px solid var(--border-color)
.dashboard-content → padding: var(--space-5)

Structure:
    <div class="dashboard-layout">
        <aside class="sidebar">…</aside>
        <div class="dashboard-content">…</div>
    </div>

--------------------------------------------------------------------------------
5.15 COURSE LAYOUT (Academy)
--------------------------------------------------------------------------------
.course-layout   → grid: 320px 1fr; gap: var(--space-4)
.lesson-sidebar  → background: var(--card-bg); border-radius: var(--radius-lg)
.lesson-content  → background: var(--card-bg); border-radius: var(--radius-lg); padding: var(--space-5)

--------------------------------------------------------------------------------
5.16 RESPONSIVE — max-width: 992px
--------------------------------------------------------------------------------
.dashboard-layout  → 1 column
.course-layout     → 1 column
.hero              → flex-column; text-align: center; justify-content: center
.hero-image        → margin-top: var(--space-5)
.grid-2, .grid-3, .grid-4 → 1 column

Rule: These fire automatically. Do not re-declare per page.

--------------------------------------------------------------------------------
5.17 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.container          → padding: 0 16px
.section            → padding: 64px 0
.dashboard-content  → padding: 24px

--------------------------------------------------------------------------------
5.18 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                     Purpose
------------------------- ------------------------------------------------
.container                Max-width wrapper (1200px), auto margins
.section                  Standard vertical rhythm (96px)
.section-sm               Compact rhythm (56px)
.section-lg               Roomy rhythm (120px)
.page-wrapper             Flex column, min-height 100vh
.main-content             flex:1 (pushes footer down)

.d-flex / .d-grid         Display
.flex-column / .flex-row  Direction
.align-* / .justify-*     Alignment
.gap-1..6                 Gaps

.grid .grid-2/3/4/auto    Grid systems

.w-100 / .w-50 / .w-auto  Widths
.h-100 / .min-vh          Heights

.overflow-hidden / auto   Overflow
.relative / .absolute     Position
.fixed / .sticky          Fixed / sticky

.hero / .hero-content / .hero-image          Flex hero
.dashboard-layout / .sidebar / .dashboard-content
.course-layout / .lesson-sidebar / .lesson-content

--------------------------------------------------------------------------------
5.19 GOLDEN RULES FOR LAYOUT
--------------------------------------------------------------------------------
✅ Wrap content in .container
✅ Use .section / .section-sm / .section-lg for vertical rhythm
✅ Wrap every page in .page-wrapper > main.main-content
✅ Use .grid .grid-* for two-to-four column layouts
✅ Use .d-flex + .align-* + .justify-* + .gap-* for flex layouts
✅ Use .sticky for sticky elements (has z-index built-in)

❌ Never set max-width or auto-margins manually on a page
❌ Never add vertical section padding in page CSS
❌ Never use raw pixel gaps — use .gap-* tokens
❌ Never re-implement .dashboard-layout / .course-layout / .hero per page
❌ Never add margins to flex children to create gaps — use .gap-*

================================================================================
END OF SECTION 05
================================================================================


================================================================================
SECTION 06 — UTILITIES
Source: packages/aslds/css/utilities.css
Scope:  Global. Low-specificity helper classes for rapid composition.
Rule:   These are atomic utilities. Use them INSTEAD of page-level CSS.
================================================================================

6.1 DISPLAY
--------------------------------------------------------------------------------
NOTE: Every class in this block uses !important.

.d-none           → display: none !important
.d-block          → display: block !important
.d-inline         → display: inline !important
.d-inline-block   → display: inline-block !important
.d-flex           → display: flex !important
.d-grid           → display: grid !important

Rule: Because they use !important, do NOT fight them with page CSS.
Rule: Prefer .d-flex / .d-grid for new layouts.

--------------------------------------------------------------------------------
6.2 FLEX DIRECTION
--------------------------------------------------------------------------------
.flex-row     → flex-direction: row
.flex-column  → flex-direction: column

--------------------------------------------------------------------------------
6.3 FLEX WRAP
--------------------------------------------------------------------------------
.flex-wrap    → flex-wrap: wrap
.flex-nowrap  → flex-wrap: nowrap

--------------------------------------------------------------------------------
6.4 FLEX JUSTIFY (main axis)
--------------------------------------------------------------------------------
.justify-start    → flex-start
.justify-center   → center
.justify-end      → flex-end
.justify-between  → space-between
.justify-around   → space-around
.justify-evenly   → space-evenly

--------------------------------------------------------------------------------
6.5 FLEX ALIGN (cross axis)
--------------------------------------------------------------------------------
NOTE: These are prefixed .items-*, NOT .align-* (that's layout.css).

.items-start    → align-items: flex-start
.items-center   → align-items: center
.items-end      → align-items: flex-end
.items-stretch  → align-items: stretch

--------------------------------------------------------------------------------
6.6 GAP (different scale from layout.css)
--------------------------------------------------------------------------------
.gap-xs  → 4px
.gap-sm  → 8px
.gap-md  → 16px
.gap-lg  → 24px
.gap-xl  → 32px

CAUTION: layout.css has .gap-1..6 (token-based).
utilities.css has .gap-xs/sm/md/lg/xl (numeric scale).
Pick one scale and stay consistent per layout. Prefer layout.css .gap-*.

--------------------------------------------------------------------------------
6.7 WIDTH
--------------------------------------------------------------------------------
.w-25   → width: 25%
.w-50   → width: 50%
.w-75   → width: 75%
.w-100  → width: 100%

.h-100  → height: 100%

.min-vh-100 → min-height: 100vh

--------------------------------------------------------------------------------
6.8 MARGIN
--------------------------------------------------------------------------------
.m-0   → margin: 0

Top:
.mt-1  → 8px
.mt-2  → 16px
.mt-3  → 24px
.mt-4  → 32px
.mt-5  → 48px

Bottom:
.mb-1  → 8px
.mb-2  → 16px
.mb-3  → 24px
.mb-4  → 32px
.mb-5  → 48px

Auto horizontal centering:
.mx-auto  → margin-left: auto; margin-right: auto

--------------------------------------------------------------------------------
6.9 PADDING
--------------------------------------------------------------------------------
All sides:
.p-0  → 0
.p-1  → 8px
.p-2  → 16px
.p-3  → 24px
.p-4  → 32px
.p-5  → 48px

Vertical:
.py-1  → 8px top + bottom
.py-2  → 16px
.py-3  → 24px

Horizontal:
.px-2  → 16px left + right
.px-3  → 24px left + right

--------------------------------------------------------------------------------
6.10 TEXT ALIGNMENT
--------------------------------------------------------------------------------
.text-left    → left
.text-center  → center
.text-right   → right

--------------------------------------------------------------------------------
6.11 TEXT COLOR
--------------------------------------------------------------------------------
.text-white    → var(--white)
.text-gold     → var(--primary-gold)
.text-muted    → var(--gray-400)
.text-success  → var(--success)
.text-danger   → var(--danger)
.text-warning  → var(--warning)
.text-info     → var(--info)

--------------------------------------------------------------------------------
6.12 FONT WEIGHT
--------------------------------------------------------------------------------
.fw-normal      → 400
.fw-medium      → 500
.fw-bold        → 700
.fw-extra-bold  → 800

--------------------------------------------------------------------------------
6.13 BACKGROUND
--------------------------------------------------------------------------------
.bg-primary     → var(--primary-gold)
.bg-card        → var(--card-bg)
.bg-surface     → var(--surface)
.bg-transparent → transparent

--------------------------------------------------------------------------------
6.14 BORDER RADIUS
--------------------------------------------------------------------------------
.rounded-sm      → var(--radius-sm)       → 8px
.rounded         → var(--radius-md)       → 12px
.rounded-lg      → var(--radius-lg)       → 18px
.rounded-xl      → var(--radius-xl)       → 24px
.rounded-circle  → 50%

--------------------------------------------------------------------------------
6.15 SHADOW
--------------------------------------------------------------------------------
.shadow-sm  → var(--shadow-sm)
.shadow     → var(--shadow-md)
.shadow-lg  → var(--shadow-lg)
.shadow-xl  → var(--shadow-xl)

CAUTION: --shadow-xl is referenced here but NOT defined in variables.css.
Only --shadow-sm, --shadow-md, --shadow-lg, --shadow-gold exist.
Recommendation: add --shadow-xl to variables.css OR avoid .shadow-xl.

--------------------------------------------------------------------------------
6.16 POSITION
--------------------------------------------------------------------------------
.position-relative  → relative
.position-absolute  → absolute
.position-fixed     → fixed

.top-0     → top: 0
.bottom-0  → bottom: 0
.left-0    → left: 0
.right-0   → right: 0

--------------------------------------------------------------------------------
6.17 OVERFLOW
--------------------------------------------------------------------------------
.overflow-hidden  → overflow: hidden
.overflow-auto    → overflow: auto

--------------------------------------------------------------------------------
6.18 CURSOR
--------------------------------------------------------------------------------
.cursor-pointer  → cursor: pointer

--------------------------------------------------------------------------------
6.19 TRANSITIONS
--------------------------------------------------------------------------------
.transition  → transition: var(--transition-normal)

--------------------------------------------------------------------------------
6.20 RESPONSIVE (max-width: 768px)
--------------------------------------------------------------------------------
.mobile-hidden  → display: none !important
.mobile-full    → width: 100% !important

Rule: These fire automatically. Use for mobile-only overrides.

--------------------------------------------------------------------------------
6.21 DUPLICATES WITH layout.css — RESOLUTION
--------------------------------------------------------------------------------
Some classes exist in both files with different behaviors. The rule:

Class              layout.css             utilities.css        Use
------------------ ---------------------- -------------------- ----------------
.d-block           display: block         display:block!       Prefer layout.css
.d-flex            display: flex          display:flex!        layout.css
.d-grid            display: grid          display:grid!        layout.css
.d-inline          display: inline-block  display: inline      layout.css
.flex-row          yes                    yes                  Either (identical)
.flex-column       yes                    yes                  Either (identical)
.align-center      align-items            —                    layout.css
.items-center      —                      align-items          utilities.css
.justify-*         yes                    yes                  Either (identical)
.gap-1..6          yes                    —                    layout.css
.gap-xs..xl        —                      yes                  utilities.css
.w-50 / .w-100     yes                    yes                  Either
.h-100             yes                    yes                  Either
.text-center       typography.css         utilities.css        Either (identical)
.text-gold         typography.css         utilities.css        Either (identical)
.overflow-hidden   yes                    yes                  Either
.overflow-auto     yes                    yes                  Either

RECOMMENDATION:
   For layout → use layout.css classes (.d-flex, .align-*, .gap-*).
   For atomic tweaks → use utilities.css (.mt-*, .p-*, .text-*).
   Avoid mixing .gap-* scales.

--------------------------------------------------------------------------------
6.22 QUICK REFERENCE — MOST USED UTILITIES
--------------------------------------------------------------------------------
Display:      .d-flex  .d-grid  .d-none  .d-block
Direction:    .flex-row  .flex-column  .flex-wrap
Justify:      .justify-center  .justify-between  .justify-start  .justify-end
Align:        .align-center (layout)  .items-center (utilities)
Gap:          .gap-1..6 (layout)  |  .gap-xs..xl (utilities)
Widths:       .w-25  .w-50  .w-75  .w-100
Margins:      .m-0  .mt-1..5  .mb-1..5  .mx-auto
Paddings:     .p-0..5  .py-1..3  .px-2..3
Text:         .text-left  .text-center  .text-right
Colors:       .text-gold  .text-muted  .text-white  .text-success  .text-danger
Weights:      .fw-normal  .fw-medium  .fw-bold  .fw-extra-bold
Backgrounds:  .bg-primary  .bg-card  .bg-surface  .bg-transparent
Radius:       .rounded-sm  .rounded  .rounded-lg  .rounded-xl  .rounded-circle
Shadows:      .shadow-sm  .shadow  .shadow-lg
Position:     .position-relative  .position-absolute  .position-fixed  .top-0 .. .right-0
Misc:         .cursor-pointer  .transition  .overflow-hidden  .overflow-auto
Responsive:   .mobile-hidden  .mobile-full

--------------------------------------------------------------------------------
6.23 GOLDEN RULES FOR UTILITIES
--------------------------------------------------------------------------------
✅ Use utilities for one-off tweaks: spacing, alignment, colors
✅ Use .d-flex + .items-* + .justify-* + .gap-* for flex layouts
✅ Use .mt-* / .mb-* / .p-* / .px-* / .py-* for spacing
✅ Use .text-gold / .text-muted / .text-success for semantic colors
✅ Use .mx-auto for horizontal centering
✅ Use .mobile-hidden / .mobile-full for responsive overrides

❌ Never re-implement a utility in page CSS
❌ Never mix .gap-* (layout) and .gap-xs..xl (utilities) on the same element
❌ Never add !important to override a utility — pick a different class
❌ Never use .shadow-xl until --shadow-xl is defined in variables.css
❌ Never use .d-none to hide page structure — use [hidden] attribute

--------------------------------------------------------------------------------
6.24 GOLD GLOW UTILITIES
--------------------------------------------------------------------------------
Ambient gold glow effects. Applied to any section or card. Require the element
to have positional context (they use ::before / ::after with isolation).

.bg-glow-top
    → soft radial gold glow from top center
    → best for: section backgrounds
    → static (no animation)

.bg-glow-hero
    → pulsing radial gold glow from center
    → best for: hero sections
    → animated: glowPulse 7s infinite alternate

.bg-sheen-gold
    → subtle diagonal gold wash (135deg)
    → best for: cards, CTA panels
    → static, sits above content with z-index:1

Rule: Use AT MOST one .bg-glow-* per section to avoid visual fatigue.
Rule: Never stack .bg-glow-hero + .bg-sheen-gold on the same element.

Example:
    <section class="hero bg-glow-hero">…</section>
    <section class="section bg-glow-top">…</section>
    <div class="card bg-sheen-gold">…</div>

================================================================================
END OF SECTION 06
================================================================================


================================================================================
SECTION 07 — MOTION
Source: packages/aslds/css/animations.css
Scope:  Global. Every animation class in ASLDS.
Rule:   Use these classes instead of writing @keyframes in page CSS.
================================================================================

7.1 DURATION TOKENS
--------------------------------------------------------------------------------
Defined in animations.css (in addition to --transition-* in variables.css):

    --animation-fast    → 0.2s
    --animation-normal  → 0.35s
    --animation-slow    → 0.6s

CAUTION: Two different timing systems exist.
    variables.css: --transition-fast / --transition-normal / --transition-slow
    animations.css: --animation-fast / --animation-normal / --animation-slow

Rule: Use --transition-* for property transitions (hover, color, border).
Rule: Use --animation-* only inside animation-duration.

--------------------------------------------------------------------------------
7.2 ENTRY ANIMATIONS — FADE
--------------------------------------------------------------------------------
.fade-in     → fades from opacity 0 → 1   (duration: --animation-normal)
.fade-out    → fades from opacity 1 → 0   (duration: --animation-normal)

Keyframes: fadeIn, fadeOut

--------------------------------------------------------------------------------
7.3 ENTRY ANIMATIONS — SLIDE
--------------------------------------------------------------------------------
All use duration .45s ease.

.slide-up     → from translateY(40px)  → 0
.slide-down   → from translateY(-40px) → 0
.slide-left   → from translateX(40px)  → 0
.slide-right  → from translateX(-40px) → 0

All fade in as they move (opacity 0 → 1).

Keyframes: slideUp, slideDown, slideLeft, slideRight

--------------------------------------------------------------------------------
7.4 ENTRY ANIMATION — SCALE
--------------------------------------------------------------------------------
.scale-in  → from scale(.92) + opacity 0  → scale(1) + opacity 1  (duration .35s)

Keyframe: scaleIn

--------------------------------------------------------------------------------
7.5 CONTINUOUS ANIMATIONS
--------------------------------------------------------------------------------
.float   → gentle up/down  · duration 4s  · infinite
           translateY: 0 → -12px → 0

.pulse   → subtle scale   · duration 2s  · infinite
           scale: 1 → 1.04 → 1

.spin    → continuous rotation · duration 1s · linear · infinite
           rotate: 0 → 360deg

.glow    → pulsing gold box-shadow · duration 2s · infinite
           box-shadow: transparent → 0 0 30px rgba(212,175,55,.45) → transparent

.glow-pulse  → backdrop opacity pulse · duration 7s · infinite · alternate
               opacity: .55 → 1
               Applied automatically inside .bg-glow-hero::before           

--------------------------------------------------------------------------------
7.6 ATTENTION ANIMATIONS (one-shot)
--------------------------------------------------------------------------------
.shake   → horizontal jitter · duration .45s
           translateX: 0 → -8 → 8 → -6 → 6 → 0

.bounce  → vertical bounce · duration 1s
           translateY: 0 → -20 → -10 → -4 → 0

--------------------------------------------------------------------------------
7.7 LOADING — SKELETON
--------------------------------------------------------------------------------
.skeleton
    background: linear-gradient(90deg, #111 25%, #1c1c1c 50%, #111 75%)
    background-size: 400% 100%
    animation: skeleton 1.5s infinite

Keyframe skeleton: background-position 100% → -100%

Rule: Apply to a placeholder element that has explicit width/height.
Rule: Dark-theme only. For light theme, override background in page CSS only if needed.

--------------------------------------------------------------------------------
7.8 INTERACTION — RIPPLE
--------------------------------------------------------------------------------
.ripple
    position: relative
    overflow: hidden

.ripple::after
    pseudo-element grows to 300×300px circle on hover (rgba(255,255,255,.15))
    transition: .5s

Rule: Add .ripple to a button or clickable card for a hover ripple.

--------------------------------------------------------------------------------
7.9 INTERACTION — HOVER LIFT
--------------------------------------------------------------------------------
.hover-lift
    transition: .3s

.hover-lift:hover
    transform: translateY(-8px)
    box-shadow: var(--shadow-lg)

Rule: Apply to cards, tiles, clickable panels.
Rule: The lift matches the hover elevation used in showcase.css cards.

--------------------------------------------------------------------------------
7.10 INTERACTION — HOVER SCALE
--------------------------------------------------------------------------------
.hover-scale
    transition: .3s

.hover-scale:hover
    transform: scale(1.05)

--------------------------------------------------------------------------------
7.11 INTERACTION — HOVER ROTATE
--------------------------------------------------------------------------------
.hover-rotate
    transition: .35s

.hover-rotate:hover
    transform: rotate(6deg)

--------------------------------------------------------------------------------
7.12 PAGE ENTRY
--------------------------------------------------------------------------------
.page-enter
    animation: pageEnter .6s ease
    from opacity 0 + translateY(25px) → opacity 1 + translateY(0)

Rule: Add .page-enter to <main> on page load for a soft entrance.

--------------------------------------------------------------------------------
7.13 STAGGER
--------------------------------------------------------------------------------
.stagger > * {
    opacity: 0;
    animation: fadeIn .6s forwards;
}

Delays (for children 1 through 5):
    .stagger > *:nth-child(1) → delay .1s
    .stagger > *:nth-child(2) → delay .2s
    .stagger > *:nth-child(3) → delay .3s
    .stagger > *:nth-child(4) → delay .4s
    .stagger > *:nth-child(5) → delay .5s

Rule: Wrap a group (grid of cards, feature list) in .stagger. Children fade in sequence.
Rule: Only 5 delays are defined. For more children, add delays in page CSS or extend animations.css.

--------------------------------------------------------------------------------
7.14 REDUCED MOTION
--------------------------------------------------------------------------------
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
    }
}

Rule: Automatically disables every animation for users who request reduced motion.
Rule: This is a11y-critical. Never remove it.

--------------------------------------------------------------------------------
7.15 QUICK REFERENCE
--------------------------------------------------------------------------------
Class              Type          Duration   Loop     Purpose
------------------ ------------- ---------- -------- ------------------------
.fade-in           entry         .35s       once     Fade in
.fade-out          entry         .35s       once     Fade out
.slide-up          entry         .45s       once     Slide from below
.slide-down        entry         .45s       once     Slide from above
.slide-left        entry         .45s       once     Slide from right
.slide-right       entry         .45s       once     Slide from left
.scale-in          entry         .35s       once     Scale up from 92%
.float             continuous    4s         infinite Idle hover
.pulse             continuous    2s         infinite Attention
.spin              continuous    1s         infinite Loading
.glow              continuous    2s         infinite Gold attention
.shake             attention     .45s       once     Error feedback
.bounce            attention     1s         once     Success feedback
.skeleton          loading       1.5s       infinite Placeholder
.ripple            interaction   .5s        —        Click ripple
.hover-lift        interaction   .3s        —        Card hover lift
.hover-scale       interaction   .3s        —        Scale on hover
.hover-rotate      interaction   .35s       —        Rotate on hover
.page-enter        entry         .6s        once     Page load entrance
.stagger           group         .6s each   sequence Child fade-in cascade

--------------------------------------------------------------------------------
7.16 JAVASCRIPT PAIRING
--------------------------------------------------------------------------------
animations.js (Section 35) automates scroll-triggered animations.

It observes any element matching:
    [data-animate], .fade-in, .slide-up, .slide-down, .slide-left,
    .slide-right, .scale-in, .stagger > *

When an element enters the viewport → animations.js adds .is-visible → animation plays.
Once-only by default.

Rule: To trigger a scroll animation, add the CSS class directly (e.g., .slide-up).
Rule: Do NOT add .is-visible manually — animations.js handles it.
Rule: Do NOT write IntersectionObserver code in page JS.

--------------------------------------------------------------------------------
7.17 GOLDEN RULES FOR MOTION
--------------------------------------------------------------------------------
✅ Use ASLDS animation classes for entry, attention, and interaction
✅ Combine with .stagger for cascading entrances
✅ Let animations.js auto-trigger scroll animations
✅ Trust prefers-reduced-motion — never override it
✅ Use --transition-* tokens for property transitions
✅ Add .hover-lift to cards, .hover-scale to icons/avatars

❌ Never write @keyframes in page CSS
❌ Never re-implement .fade-in / .slide-up logic
❌ Never add .is-visible manually
❌ Never mix --animation-* and --transition-* for the same purpose
❌ Never remove or override the reduced-motion block
❌ Never add scroll animations that conflict with animations.js

--------------------------------------------------------------------------------
7.18 KNOWN GAPS (for future addition to animations.css)
--------------------------------------------------------------------------------
The following are used in earlier generated pages but are NOT YET in ASLDS:

1. .reveal / .reveal.is-visible
   → Scroll-triggered opacity + translateY
   → Recommended addition to animations.css

2. .reveal-delay-1 .. .reveal-delay-4
   → Delay variants for staggered reveals
   → Recommended addition

3. .text-gradient-gold
   → Gold gradient text treatment
   → Better placed in typography.css

4. .glow-pulse
   → Larger radial glow animation for hero backgrounds
   → Recommended addition to animations.css

These should be added ONLY once confirmed across multiple pages.
Until then, do NOT use them in production pages.



================================================================================
END OF SECTION 07
================================================================================


================================================================================
SECTION 08 — DOCUMENTATION LAYOUT (showcase.css)
Source: packages/aslds/css/showcase.css
Scope:  Documentation pages inside packages/aslds/showcase/*
Rule:   This file EXTENDS ASLDS — it never overrides the core framework.
        It provides documentation-specific layouts only.
================================================================================

8.1 SCOPE & PHILOSOPHY
--------------------------------------------------------------------------------
showcase.css is NOT part of the core framework. It provides:
    • Hero layouts for documentation
    • Section headers with labels
    • Documentation card grids
    • Sidebar navigation for docs
    • Code examples & previews
    • Roadmap timeline
    • Changelog layouts
    • Documentation footer

Rule: Application pages (public-site, academy, etc.) use this file ONLY if they
      follow the documentation pattern. Otherwise use layout.css + components.

--------------------------------------------------------------------------------
8.2 PAGE SHELL (matches layout.css, redefined here)
--------------------------------------------------------------------------------
.page-wrapper   → min-height:100vh; flex column
.main-content   → flex:1

NOTE: These are ALSO in layout.css. Same intent, duplicate implementation.
      Prefer layout.css values.

--------------------------------------------------------------------------------
8.3 SECTION (documentation flavor)
--------------------------------------------------------------------------------
.section             → padding: 6rem 0; position: relative
.section:first-of-type → padding-top: 4rem
.section:last-of-type  → padding-bottom: 8rem

CAUTION: layout.css defines .section with padding: var(--space-10) → 96px.
         showcase.css overrides with 6rem (=96px, same). But adds first/last overrides.

Rule: Documentation pages → use as-is.
Rule: Application pages → use layout.css .section.

--------------------------------------------------------------------------------
8.4 SECTION HEADER
--------------------------------------------------------------------------------
.section-header         → max-width: 760px; margin: 0 auto 4rem; text-align: center
.section-label          → inline-flex pill · padding .45rem 1rem · radius 999px ·
                          font-size .8rem · weight 600 · uppercase · letter-spacing .12em
.section-header h2      → margin-bottom: 1rem
.section-header p       → max-width: 720px; margin: 0 auto

Purpose: The canonical heading block for every section on every page.

Structure:
    <header class="section-header">
        <span class="section-label">Label</span>
        <h2>Section Title</h2>
        <p>Section description</p>
    </header>

--------------------------------------------------------------------------------
8.5 HERO (documentation flavor)
--------------------------------------------------------------------------------
.hero              → padding: 8rem 0 7rem; position: relative; overflow: hidden
.hero::before      → absolute inset:0; pointer-events: none; opacity: .45
.hero-grid         → grid: 1.3fr .9fr; gap: 4rem; align-items: center
.hero-content      → max-width: 760px
.hero-badge        → inline-flex pill · padding .5rem 1rem · radius 999px ·
                     margin-bottom 1.5rem · font-size .85rem · weight 600 ·
                     uppercase · letter-spacing .08em
.hero-title        → margin-bottom: 1.5rem; line-height: 1.05
.hero-tagline      → font-size: 1.45rem; weight: 600; margin-bottom: 1.5rem
.hero-description  → max-width: 680px; margin-bottom: 2rem; line-height: 1.8
.hero-actions      → flex; wrap; gap: 1rem
.hero-panel        → padding: 2rem; border-radius: 1.5rem
.hero-panel h3     → margin-bottom: 1.25rem
.hero-panel ul     → grid; gap: 1rem; list-style: none
.hero-panel li     → flex; align-items: center; gap: .75rem

Structure:
    <section class="hero">
        <div class="container">
            <div class="hero-grid">
                <div class="hero-content">
                    <span class="hero-badge">Label</span>
                    <h1 class="hero-title">…</h1>
                    <p class="hero-tagline">…</p>
                    <p class="hero-description">…</p>
                    <div class="hero-actions">
                        <a class="btn btn-primary">…</a>
                        <a class="btn btn-outline">…</a>
                    </div>
                </div>
                <aside class="hero-panel card">
                    <h3>On This Page</h3>
                    <ul>…</ul>
                </aside>
            </div>
        </div>
    </section>

CAUTION: layout.css defines a different .hero (min-height: 85vh; flex).
         showcase.css overrides it to a grid layout.
         Choose ONE per page:
             Documentation page → showcase.css hero
             Application landing → layout.css hero

--------------------------------------------------------------------------------
8.6 GRID LAYOUTS (documentation)
--------------------------------------------------------------------------------
.card-grid            → display: grid; gap: 2rem
.stats-grid           → repeat(auto-fit, minmax(220px, 1fr))
.documentation-grid   → repeat(auto-fit, minmax(280px, 1fr))
.component-grid       → repeat(auto-fit, minmax(280px, 1fr))
.feature-grid         → repeat(auto-fit, minmax(280px, 1fr))
.roadmap-grid         → repeat(4, minmax(0, 1fr))
.updates-grid         → repeat(3, minmax(0, 1fr))
.quick-links-grid     → repeat(auto-fit, minmax(240px, 1fr))

Rule: Always pair .card-grid with one variant, e.g.:
      <div class="card-grid documentation-grid">

--------------------------------------------------------------------------------
8.7 CARD VARIANTS (all share behavior)
--------------------------------------------------------------------------------
Classes: .documentation-card · .component-card · .feature-card · .roadmap-card ·
         .update-card · .quick-link-card · .stat-card

Shared behavior:
    transition: transform .3s ease, box-shadow .3s ease
    :hover → transform: translateY(-6px)
    h3 → margin-bottom: 1rem
    p  → margin-bottom: 1.5rem

Rule: Combine with .card + .card-body for full structure:
      <article class="card documentation-card">
          <div class="card-body">
              <h3>…</h3>
              <p>…</p>
          </div>
      </article>

--------------------------------------------------------------------------------
8.8 STAT CARD (variant)
--------------------------------------------------------------------------------
.stat-card     → text-align: center
.stat-card h3  → font-size: 3rem; margin-bottom: .5rem
.stat-card p   → margin: 0

Structure:
    <div class="card stat-card">
        <div class="card-body">
            <h3>52</h3>
            <p>Weeks of transformation</p>
        </div>
    </div>

--------------------------------------------------------------------------------
8.9 SECTION ACTIONS
--------------------------------------------------------------------------------
.section-actions → display: flex; justify-content: center; margin-top: 3rem

Purpose: Centered CTA row below a section.

--------------------------------------------------------------------------------
8.10 BREADCRUMB (documentation)
--------------------------------------------------------------------------------
.doc-breadcrumb            → flex; wrap; gap .75rem; margin-bottom 2rem; font-size .95rem
.doc-breadcrumb a          → no underline; transition opacity .25s
.doc-breadcrumb a:hover    → opacity: .75
.doc-breadcrumb-separator  → opacity: .45

Structure:
    <nav class="doc-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span class="doc-breadcrumb-separator">/</span>
        <a href="/components/">Components</a>
        <span class="doc-breadcrumb-separator">/</span>
        <span>Buttons</span>
    </nav>

--------------------------------------------------------------------------------
8.11 DOC SIDEBAR LAYOUT
--------------------------------------------------------------------------------
.doc-layout          → grid: 300px minmax(0, 1fr); gap: 3rem; align-items: start
.doc-sidebar         → position: sticky; top: 2rem
.doc-sidebar-header  → margin-bottom: 2rem
.doc-sidebar-title   → margin-bottom: .5rem
.doc-sidebar-nav     → flex column; gap: .35rem
.doc-sidebar-link    → flex; gap .75rem; padding .85rem 1rem; border-radius .9rem;
                       transition: background .25s, color .25s, transform .25s
.doc-sidebar-link:hover   → transform: translateX(4px)
.doc-sidebar-link.active  → font-weight: 600

Rule: Use .active on the current page's sidebar link.

--------------------------------------------------------------------------------
8.12 DOC CONTENT
--------------------------------------------------------------------------------
.doc-content              → min-width: 0
.doc-content section+section → margin-top: 6rem

--------------------------------------------------------------------------------
8.13 COMPONENT PREVIEW
--------------------------------------------------------------------------------
.component-preview           → margin 2rem 0; padding 2rem; border-radius 1.5rem; overflow auto
.component-preview-header    → flex; justify-between; align-center; gap 1rem; margin-bottom 2rem
.component-preview-title     → margin: 0
.preview-stage               → flex; wrap; align-center; gap 1.5rem; min-height 140px

Purpose: Preview boxes on component documentation pages.

--------------------------------------------------------------------------------
8.14 CODE EXAMPLE
--------------------------------------------------------------------------------
.code-example       → margin-top 2rem; border-radius 1.25rem; overflow hidden
.code-header        → flex; justify-between; align-center; padding 1rem 1.5rem
.code-language      → font-size .85rem; weight 600; uppercase; letter-spacing .08em
.copy-button        → cursor: pointer
.code-content       → overflow: auto
.code-content pre   → margin 0; padding 2rem
.code-content code  → font-family: Consolas, "Courier New", monospace

Structure:
    <div class="code-example">
        <div class="code-header">
            <span class="code-language">HTML</span>
            <button class="copy-button">Copy</button>
        </div>
        <div class="code-content">
            <pre><code>…</code></pre>
        </div>
    </div>

--------------------------------------------------------------------------------
8.15 DOCUMENTATION NOTES
--------------------------------------------------------------------------------
.note-grid        → grid; repeat(3, minmax(0,1fr)); gap 2rem; margin-top 3rem
.note-card        → border-radius 1.25rem; padding 1.75rem
.note-card h4     → margin-bottom 1rem
.note-card ul     → margin 0; padding-left 1.2rem
.note-card li+li  → margin-top .6rem

--------------------------------------------------------------------------------
8.16 RELATED COMPONENTS
--------------------------------------------------------------------------------
.related-components        → margin-top 5rem
.related-components-grid   → grid; repeat(4, minmax(0,1fr)); gap 2rem
.related-component-card    → transition transform .3s, box-shadow .3s
.related-component-card:hover → translateY(-6px)

--------------------------------------------------------------------------------
8.17 SEARCH RESULTS
--------------------------------------------------------------------------------
.search-results        → grid; gap 1.5rem
.search-result         → padding 1.5rem; border-radius 1rem
.search-result-title   → margin-bottom .5rem
.search-highlight      → font-weight: 700

--------------------------------------------------------------------------------
8.18 EMPTY STATES
--------------------------------------------------------------------------------
.empty-state               → text-align: center; padding 5rem 2rem
.empty-state-icon          → font-size 3rem; margin-bottom 1.5rem
.empty-state-title         → margin-bottom 1rem
.empty-state-description   → max-width 520px; margin 0 auto 2rem

--------------------------------------------------------------------------------
8.19 ROADMAP TIMELINE
--------------------------------------------------------------------------------
.roadmap-timeline          → position relative; flex column; gap 2rem; margin-top 2rem
.roadmap-timeline::before  → absolute vertical 2px line · left 1rem · opacity .25
.roadmap-item              → position relative; flex; gap 2rem; padding-left 3rem
.roadmap-marker            → absolute left 0; 2rem circle; centered content
.roadmap-content           → flex: 1
.roadmap-content h3        → margin-bottom .75rem
.roadmap-content p         → margin-bottom 1rem

--------------------------------------------------------------------------------
8.20 CHANGELOG
--------------------------------------------------------------------------------
.changelog-list           → grid; gap 2rem
.changelog-item           → border-radius 1.25rem; padding 2rem
.changelog-version        → flex; justify-between; align-center; gap 1rem; margin-bottom 1rem
.changelog-version h3     → margin: 0
.changelog-date           → font-size .9rem; opacity .7
.changelog-item ul        → margin 0; padding-left 1.25rem
.changelog-item li+li     → margin-top .75rem

--------------------------------------------------------------------------------
8.21 QUICK LINKS
--------------------------------------------------------------------------------
.quick-links      → grid; auto-fit minmax(220px,1fr); gap 1.5rem
.quick-link       → flex column; justify-between; min-height 180px; border-radius 1.25rem
.quick-link:hover → translateY(-6px)
.quick-link h3    → margin-bottom 1rem
.quick-link p     → margin-bottom 1.5rem

--------------------------------------------------------------------------------
8.22 DOCUMENTATION FOOTER
--------------------------------------------------------------------------------
.doc-footer                    → margin-top 6rem; padding-top 3rem
.doc-footer-grid               → grid: 2fr 1fr 1fr 1fr; gap 3rem
.doc-footer-column h3          → margin-bottom 1.25rem
.doc-footer-column ul          → list-style none; margin 0; padding 0
.doc-footer-column li+li       → margin-top .75rem
.doc-footer-column a           → no underline; transition opacity .25s
.doc-footer-column a:hover     → opacity .75
.doc-footer-bottom             → margin-top 3rem; padding-top 2rem; flex; justify-between; wrap

Note: This footer differs from the main site footer (footer.css).
      Use .doc-footer for documentation pages only.

--------------------------------------------------------------------------------
8.23 SCROLL UTILITIES
--------------------------------------------------------------------------------
.scroll-offset   → scroll-margin-top: 7rem
.back-to-top     → fixed; right 2rem; bottom 2rem; 3rem circle; centered;
                   transition opacity .3s, transform .3s
.back-to-top:hover → translateY(-4px)

--------------------------------------------------------------------------------
8.24 LOADING STATE
--------------------------------------------------------------------------------
.skeleton
    overflow: hidden; position: relative

.skeleton::after
    absolute inset 0; transform: translateX(-100%);
    animation: showcase-skeleton 1.4s infinite

@keyframes showcase-skeleton
    100% → transform: translateX(100%)

CAUTION: animations.css ALSO defines .skeleton (background-gradient shimmer).
         Two DIFFERENT implementations exist. Choose one:
             Documentation page → showcase.css version (::after overlay)
             Application page   → animations.css version (background shimmer)
         Recommendation: unify in a future cleanup.

--------------------------------------------------------------------------------
8.25 DOCUMENTATION UTILITIES
--------------------------------------------------------------------------------
.text-center   → text-align: center
.mt-section    → margin-top: 6rem
.mb-section    → margin-bottom: 6rem
.full-width    → width: 100%
.max-content   → max-width: 960px; margin-inline: auto

--------------------------------------------------------------------------------
8.26 RESPONSIVE — max-width: 1440px
--------------------------------------------------------------------------------
.hero-grid               → 1 column; gap 3rem
.stats-grid              → 2 columns
.documentation-grid      → 2 columns
.component-grid          → 2 columns
.feature-grid            → 2 columns
.roadmap-grid            → 2 columns
.updates-grid            → 2 columns
.quick-links-grid        → 2 columns
.related-components-grid → 2 columns
.doc-footer-grid         → 2 columns

--------------------------------------------------------------------------------
8.27 RESPONSIVE — max-width: 992px
--------------------------------------------------------------------------------
.section                 → padding 5rem 0
.doc-layout              → 1 column
.doc-sidebar             → position: static
.hero                    → padding 6rem 0
.hero-content            → max-width: 100%
.component-preview-header → flex-column; align-start
.note-grid               → 1 column

--------------------------------------------------------------------------------
8.28 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.section                 → padding 4rem 0
.hero                    → padding 5rem 0
.hero-actions            → flex-column; align-stretch
All documentation grids  → 1 column
.doc-footer-grid         → 1 column
.doc-footer-bottom       → flex-column; align-start
.roadmap-item            → padding-left 2.5rem

--------------------------------------------------------------------------------
8.29 RESPONSIVE — max-width: 576px
--------------------------------------------------------------------------------
.hero-title              → font-size 2.3rem
.hero-tagline            → font-size 1.2rem
.section-header          → margin-bottom 3rem
.component-preview       → padding 1.25rem
.code-header             → flex-column; align-start
.code-content pre        → padding 1.25rem
.back-to-top             → right 1rem; bottom 1rem

--------------------------------------------------------------------------------
8.30 PRINT STYLES
--------------------------------------------------------------------------------
Hidden on print:
    .navbar · .doc-sidebar · .hero-actions · .back-to-top · .copy-button ·
    .theme-toggle · .mobile-toggle

.page-wrapper  → display: block
.section       → page-break-inside: avoid
.component-preview, .code-example, .card → break-inside: avoid

--------------------------------------------------------------------------------
8.31 MOTION PREFERENCES
--------------------------------------------------------------------------------
@media (prefers-reduced-motion: reduce) → disable all animation/transition.

--------------------------------------------------------------------------------
8.32 FOCUS & SELECTION
--------------------------------------------------------------------------------
:focus-visible   → outline: 3px solid var(--color-primary); offset: 3px
::selection      → background: var(--color-primary); color: var(--color-white)

⚠️  CRITICAL ISSUE — UNDEFINED TOKENS
The following tokens are referenced in showcase.css but NOT defined in variables.css:
    --color-primary   (should be --primary-gold)
    --color-white     (should be --white)

Impact: Focus outlines and text selection on documentation pages fall back to
        browser defaults (usually blue outline, blue selection).

RECOMMENDED FIX (one line in variables.css):
    :root {
        --color-primary: var(--primary-gold);
        --color-white: var(--white);
    }
OR
Replace in showcase.css:
    var(--color-primary) → var(--primary-gold)
    var(--color-white)   → var(--white)

Action required before shipping documentation.

--------------------------------------------------------------------------------
8.33 DOCUMENTATION HELPERS
--------------------------------------------------------------------------------
.is-hidden     → display: none !important
.is-visible    → display: block !important
.is-active     → opacity: 1
.is-disabled   → pointer-events: none; opacity: .55
.has-shadow    → box-shadow: var(--shadow-lg)
.has-radius    → border-radius: var(--radius-lg)
.glass-panel   → backdrop-filter: blur(18px)

--------------------------------------------------------------------------------
8.34 QUICK REFERENCE — MOST USED DOC CLASSES
--------------------------------------------------------------------------------
Page shell:        .page-wrapper  .main-content
Section:           .section  .section-header  .section-label  .section-actions
Hero:              .hero  .hero-grid  .hero-content  .hero-badge
                   .hero-title  .hero-tagline  .hero-description  .hero-actions  .hero-panel
Grids:             .card-grid + (.stats-grid|.documentation-grid|.component-grid|
                   .feature-grid|.roadmap-grid|.updates-grid|.quick-links-grid)
Cards:             .documentation-card  .component-card  .feature-card  .stat-card
Preview:           .component-preview  .component-preview-header  .preview-stage
Code:              .code-example  .code-header  .code-language  .copy-button  .code-content
Notes:             .note-grid  .note-card
Sidebar:           .doc-layout  .doc-sidebar  .doc-sidebar-nav  .doc-sidebar-link
Content:           .doc-content
Breadcrumb:        .doc-breadcrumb  .doc-breadcrumb-separator
Roadmap:           .roadmap-timeline  .roadmap-item  .roadmap-marker  .roadmap-content
Changelog:         .changelog-list  .changelog-item  .changelog-version  .changelog-date
Quick links:       .quick-links  .quick-link
Doc footer:        .doc-footer  .doc-footer-grid  .doc-footer-column  .doc-footer-bottom
Misc:              .empty-state  .back-to-top  .scroll-offset
Utilities:         .mt-section  .mb-section  .full-width  .max-content

--------------------------------------------------------------------------------
8.35 GOLDEN RULES FOR SHOWCASE.CSS
--------------------------------------------------------------------------------
✅ Use documentation layout classes ONLY on documentation pages
✅ Pair .card-grid with one variant (.documentation-grid, .feature-grid, etc.)
✅ Combine .card + variant class (.card.documentation-card)
✅ Use .section-header for the standard heading block
✅ Use .doc-layout + .doc-sidebar + .doc-content for doc pages with sidebar
✅ Keep print styles and reduced-motion block intact
✅ Fix the --color-primary / --color-white bug before shipping

❌ Never use .doc-* classes on application (public-site) pages
❌ Never use .hero from showcase.css on application pages (use layout.css hero)
❌ Never override showcase.css from a page — extend it if needed
❌ Never mix documentation footer with main footer
❌ Never use .skeleton from both files on the same page

================================================================================
END OF SECTION 08
================================================================================

================================================================================
SECTION 09 — BUTTONS
Source: packages/aslds/css/components/buttons.css
Scope:  Global. All button styles in ASLDS.
JS:     None — buttons are pure CSS.
================================================================================

9.1 BASE BUTTON — .btn
--------------------------------------------------------------------------------
Required base class. Every button in ASLDS starts with .btn.

.btn
    position:        relative
    display:         inline-flex
    align-items:     center
    justify-content: center
    gap:             10px
    height:          var(--btn-height)      → 50px
    padding:         var(--btn-padding)     → 0 28px
    font-family:     var(--font-family)
    font-size:       var(--fs-md)           → 16px
    font-weight:     var(--fw-bold)         → 700
    border:          none
    border-radius:   var(--radius-md)       → 12px
    cursor:          pointer
    overflow:        hidden
    transition:      all var(--transition-normal)
    white-space:     nowrap
    user-select:     none

Structure:
    <button class="btn btn-primary">Label</button>
    <a class="btn btn-primary" href="...">Label</a>

--------------------------------------------------------------------------------
9.2 SHINE EFFECT (automatic on every .btn)
--------------------------------------------------------------------------------
.btn::before
    Pseudo-element: gradient strip sweeping left → right
    Position: absolute · top: 0 · left: -120%
    Size: 60% width · 100% height
    Background: linear-gradient(120deg, transparent, rgba(255,255,255,.25), transparent)
    Transition: .8s

.btn:hover::before
    Left: 140% (sweeps across)

Rule: The shine is automatic. Never add it manually.

--------------------------------------------------------------------------------
9.3 VARIANTS
--------------------------------------------------------------------------------
.btn-primary
    background: var(--primary-gold)
    color:      var(--black)
    box-shadow: var(--shadow-gold)
    hover → background: var(--primary-gold-hover); transform: translateY(-3px)

.btn-secondary
    background: var(--card-bg)
    color:      var(--white)
    border:     1px solid var(--border-color)
    hover → border: var(--primary-gold); color: var(--primary-gold)

.btn-outline
    background: transparent
    border:     2px solid var(--primary-gold)
    color:      var(--primary-gold)
    hover → background: var(--primary-gold); color: var(--black)

.btn-success
    background: var(--success) · color: #fff

.btn-danger
    background: var(--danger) · color: #fff

.btn-warning
    background: var(--warning) · color: #000

.btn-info
    background: var(--info) · color: #fff

.btn-light
    background: #fff · color: #000

.btn-glass
    background: var(--glass-bg)
    backdrop-filter: var(--glass-blur)
    border: 1px solid var(--glass-border)
    color: #fff
    hover → border: var(--primary-gold)

.btn-link
    padding: 0 · background: none · height: auto
    color: var(--primary-gold)
    hover → color: var(--primary-gold-hover)

.btn-icon
    width: 50px · padding: 0
    i → font-size: 18px

Structure rule:
    Always combine base + variant:
        <button class="btn btn-primary">Save</button>
        <button class="btn btn-outline btn-sm">Cancel</button>

--------------------------------------------------------------------------------
9.4 SIZES
--------------------------------------------------------------------------------
.btn-sm  → height: 40px · padding: 0 18px · font-size: 14px
.btn-md  → height: 50px (default)
.btn-lg  → height: 60px · padding: 0 36px · font-size: 18px
.btn-xl  → height: 70px · padding: 0 48px · font-size: 20px

Rule: Size class is optional. Default = .btn-md sizing.

--------------------------------------------------------------------------------
9.5 WIDTH
--------------------------------------------------------------------------------
.btn-block → width: 100%

--------------------------------------------------------------------------------
9.6 ROUNDED VARIANTS
--------------------------------------------------------------------------------
.rounded        → border-radius: var(--radius-md)   (12px)
.rounded-pill   → border-radius: 999px
.rounded-circle → width: 55px · height: 55px · border-radius: 50% · padding: 0

Rule: Combine with .btn + variant:
    <button class="btn btn-primary rounded-pill">Rounded</button>

⚠️  NAME CONFLICT — see 9.13.

--------------------------------------------------------------------------------
9.7 STATES
--------------------------------------------------------------------------------
.btn:active              → transform: scale(.98)
.btn:disabled            → opacity: .6 · cursor: not-allowed · transform: none
.btn-loading             → pointer-events: none · opacity: .8
.btn-loading::after      → spinning circle (border-based) · uses @keyframes spin
                           from animations.css

Rule: Use <button disabled> to trigger .btn:disabled.
Rule: Use .btn-loading + disabled during async actions.

--------------------------------------------------------------------------------
9.8 FLOATING ACTION BUTTON
--------------------------------------------------------------------------------
.btn-fab
    position: fixed · right: 30px · bottom: 30px
    width: 65px · height: 65px · border-radius: 50%
    z-index: 999

⚠️  z-index is hardcoded to 999 instead of using --z-* token.

--------------------------------------------------------------------------------
9.9 BUTTON GROUP
--------------------------------------------------------------------------------
.btn-group
    display: flex · gap: 16px · flex-wrap: wrap

Rule: Wrap related buttons to space them uniformly.

--------------------------------------------------------------------------------
9.10 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.btn       → width: 100%
.btn-group → flex-direction: column

⚠️  This makes ALL buttons full-width on mobile.
    Problem: navbar theme toggle, icon buttons, and inline actions would also become full-width.
    See 9.13 for details.

--------------------------------------------------------------------------------
9.11 QUICK REFERENCE
--------------------------------------------------------------------------------
Class               Purpose
------------------- --------------------------------------------
.btn                Base — required on every button
.btn-primary        Gold action (default CTA)
.btn-secondary      Neutral surface
.btn-outline        Gold outline, transparent background
.btn-success        Green — confirmations
.btn-danger         Red — destructive
.btn-warning        Yellow — caution
.btn-info           Blue — information
.btn-light          White
.btn-glass          Glassmorphism
.btn-link           Text-only (no chrome)
.btn-icon           Square icon-only (50px)

.btn-sm / .btn-md / .btn-lg / .btn-xl       Sizes
.btn-block                                  Full width
.rounded / .rounded-pill / .rounded-circle  Shape
.btn-fab                                    Floating action
.btn-group                                  Group wrapper
.btn-loading                                Loading state

--------------------------------------------------------------------------------
9.12 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ <button> for actions; <a class="btn"> for navigation
✅ aria-label required on icon-only buttons (.btn-icon)
✅ Disabled state uses <button disabled>
✅ Focus visible handled by reset.css (:focus-visible gold outline)

❌ Never remove focus outline
❌ Never use .btn on a plain <div> — use <button> or <a>

--------------------------------------------------------------------------------
9.13 KNOWN ISSUES (to fix after full reference)
--------------------------------------------------------------------------------
1. NAME CONFLICTS WITH utilities.css
   .rounded         defined in both — same value, safe
   .rounded-circle  defined in utilities.css (50% radius) and buttons.css
                    (55×55 + 50% radius). Buttons version changes size — could break
                    avatars using .rounded-circle in the same page.

2. RESPONSIVE .btn { width: 100% } on mobile (≤768px)
   This forces ALL buttons full-width — including navbar toggle, theme toggle,
   icon buttons inside cards, FABs. Should be opt-in via .btn-block only.

3. HARDCODED z-index in .btn-fab
   Uses z-index: 999 instead of --z-sticky (1020) or a new --z-fab token.

4. HARDCODED COLORS
   #fff and #000 appear in .btn-success, .btn-danger, .btn-warning, .btn-info,
   .btn-light, .btn-glass. Should be tokens (--white, --black).

5. MISSING HOVER ON SEVERAL VARIANTS
   .btn-success, .btn-danger, .btn-warning, .btn-info, .btn-light have no :hover
   rule — they don't respond on hover except the shine sweep.

6. NO .btn-ghost VARIANT
   Documentation pages commonly reference a ghost button — not defined here.

7. .btn-icon is fixed at 50px width
   Should scale with size variants (.btn-icon.btn-sm, .btn-icon.btn-lg).

8. .btn-link has no underline option
   Sometimes a link-button should show underline on hover — not supported.

--------------------------------------------------------------------------------
9.14 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Always: class="btn btn-{variant} [btn-{size}]"
✅ Use <button> for actions, <a class="btn"> for navigation
✅ Use .btn-icon + aria-label for icon-only
✅ Use .btn-loading + disabled during async
✅ Use .btn-group to space related buttons

❌ Never use .btn without a variant
❌ Never override .btn styles in page CSS
❌ Never add inline styles to buttons
❌ Never rely on mobile full-width — wrap in .btn-group or override carefully

================================================================================
END OF SECTION 09
================================================================================


================================================================================
SECTION 10 — CARDS
Source: packages/aslds/css/components/cards.css
Scope:  Global. All card patterns in ASLDS.
JS:     None — cards are pure CSS.
================================================================================

10.1 BASE CARD — .card
--------------------------------------------------------------------------------
Required base class for every card.

.card
    position:        relative
    background:      var(--card-bg)
    border:          1px solid var(--border-color)
    border-radius:   var(--radius-lg)      → 18px
    overflow:        hidden
    transition:      all var(--transition-normal)

.card:hover
    transform:       translateY(-8px)
    border-color:    var(--primary-gold)
    box-shadow:      var(--shadow-lg)

Structure:
    <article class="card">
        <div class="card-header">…</div>
        <div class="card-body">…</div>
        <div class="card-footer">…</div>
    </article>

⚠️  Hover lift is automatic on EVERY .card — including non-clickable ones.
    See 10.11.

--------------------------------------------------------------------------------
10.2 CARD SECTIONS
--------------------------------------------------------------------------------
.card-header
    padding: var(--space-4)      → 32px
    border-bottom: 1px solid var(--border-color)

.card-title
    margin: 0
    color: var(--white)
    font-size: var(--fs-xl)      → 20px
    font-weight: var(--fw-bold)

.card-subtitle
    color: var(--gray-400)
    margin-top: 8px

.card-body
    padding: var(--space-4)      → 32px

.card-footer
    padding: var(--space-4)      → 32px
    border-top: 1px solid var(--border-color)

Rule: Use any combination — cards can be body-only, header+body, etc.

--------------------------------------------------------------------------------
10.3 GLASS CARD
--------------------------------------------------------------------------------
.card-glass
    background:      var(--glass-bg)
    backdrop-filter: var(--glass-blur)
    border:          1px solid var(--glass-border)

Rule: Combine with .card → <div class="card card-glass">.

--------------------------------------------------------------------------------
10.4 COURSE CARD (Academy)
--------------------------------------------------------------------------------
.course-card
    display: flex · flex-direction: column

.course-image
    width: 100% · height: 220px · overflow: hidden

.course-image img
    width: 100% · height: 100% · object-fit: cover · transition: .5s

.course-card:hover img
    transform: scale(1.08)        ← image zoom on card hover

.course-content
    padding: var(--space-4)

.course-title
    font-size: var(--fs-xl) · color: var(--white) · margin-bottom: 12px

.course-description
    color: var(--gray-400)

.course-footer
    padding: var(--space-4) · flex · justify-between · align-center

--------------------------------------------------------------------------------
10.5 DASHBOARD CARD
--------------------------------------------------------------------------------
.dashboard-card
    padding: var(--space-5)      → 40px

.dashboard-value
    font-size: 42px · font-weight: var(--fw-extrabold) · color: var(--primary-gold)

.dashboard-label
    color: var(--gray-400)

Rule: Combine with .card → <div class="card dashboard-card">.

--------------------------------------------------------------------------------
10.6 STAT CARD
--------------------------------------------------------------------------------
.stat-card
    text-align: center · padding: 40px

.stat-icon
    70×70 circle · background: rgba(212,175,55,.1)
    color: var(--primary-gold) · font-size: 30px
    centered · margin-bottom: 20px

.stat-number
    font-size: 38px · font-weight: 800

.stat-text
    color: var(--gray-400)

⚠️  CONFLICT — showcase.css ALSO defines .stat-card with different values:
    showcase.css → h3 font-size: 3rem; p margin: 0
    cards.css    → text-align:center; padding:40px; uses .stat-number / .stat-text

    Documentation pages use showcase.css version.
    App pages use cards.css version.
    Same class name → unpredictable. See 10.11.

--------------------------------------------------------------------------------
10.7 PROFILE CARD
--------------------------------------------------------------------------------
.profile-card
    text-align: center · padding: 40px

.profile-avatar
    120×120 circle · border: 4px solid var(--primary-gold) · overflow: hidden
    margin: auto

.profile-avatar img
    width: 100% · height: 100% · object-fit: cover

.profile-name
    margin-top: 20px · font-size: 24px

.profile-role
    color: var(--gray-400)

--------------------------------------------------------------------------------
10.8 PRICING CARD
--------------------------------------------------------------------------------
.pricing-card
    text-align: center · padding: 50px 35px

.pricing-price
    font-size: 56px · color: var(--primary-gold) · font-weight: 800

.pricing-duration
    color: var(--gray-400)

--------------------------------------------------------------------------------
10.9 FEATURED CARD (Popular ribbon)
--------------------------------------------------------------------------------
.featured
    border: 2px solid var(--primary-gold)

.featured::before
    content: "POPULAR"
    position: absolute · top: 18px · right: -35px
    width: 150px · text-align: center · padding: 8px
    background: var(--primary-gold) · color: #000
    transform: rotate(45deg)
    font-size: 12px · font-weight: 700

Rule: Combine with .card → <div class="card pricing-card featured">.

⚠️  `.card` has overflow: hidden — the rotated ribbon should render fine since it's
    positioned inside, but if the card grows, the corner ribbon may be clipped.
    Test with real content.

--------------------------------------------------------------------------------
10.10 SPECIALIZED CARDS
--------------------------------------------------------------------------------
.card-horizontal
    display: flex
    img → width: 260px · object-fit: cover

.lesson-card
    padding: 25px · flex · justify-between · align-center

.certificate-card
    text-align: center · padding: 50px · border: 2px dashed var(--primary-gold)

.download-card
    flex · align-center · justify-between · padding: 25px

.card-badge
    position: absolute · top: 18px · left: 18px

--------------------------------------------------------------------------------
10.11 RESPONSIVE
--------------------------------------------------------------------------------
@media (max-width: 992px):
    .card-horizontal      → flex-direction: column
    .card-horizontal img  → width: 100%

@media (max-width: 768px):
    .dashboard-value → font-size: 32px
    .pricing-price   → font-size: 42px
    .profile-avatar  → 90×90

--------------------------------------------------------------------------------
10.12 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                Purpose
-------------------- --------------------------------------------
.card                Base card (required)
.card-header         Top section (border-bottom)
.card-title          Heading inside header
.card-subtitle       Subtext under title
.card-body           Main content area
.card-footer         Bottom section (border-top)
.card-glass          Glassmorphism variant
.card-badge          Absolute badge position (top-left)

.course-card         Academy course tile
.dashboard-card      Dashboard metric tile
.stat-card           Centered stat tile
.profile-card        User profile tile
.pricing-card        Pricing tier tile
.featured            "POPULAR" ribbon + gold border
.card-horizontal     Side-by-side image + content
.lesson-card         Compact lesson row
.certificate-card    Dashed gold border, centered
.download-card       File row with action

--------------------------------------------------------------------------------
10.13 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Use <article> or <div class="card"> depending on semantic role
✅ Cards with click handlers should be <a class="card"> or <button class="card">
✅ Use aria-label on icon-only cards
✅ Keep heading hierarchy inside (.card-title should be semantic <h3>)

--------------------------------------------------------------------------------
10.14 KNOWN ISSUES (to fix after full reference)
--------------------------------------------------------------------------------
1. .card:hover ALWAYS lifts (translateY -8px)
   This is wrong for non-clickable cards (info panels, hero side panels, doc cards).
   Recommendation: move hover lift to opt-in via .hover-lift class from animations.css.

2. .card { overflow: hidden } clips absolute-positioned children
   Badges, ribbons, tooltips, or popovers that extend beyond card bounds will be
   clipped. Recommendation: remove overflow: hidden or apply conditionally.

3. .stat-card CONFLICT with showcase.css
   Same class, two implementations. Recommendation: rename one
   (e.g. docs uses .doc-stat-card, apps uses .stat-card).

4. HARDCODED VALUES
   Many raw values instead of tokens:
     - rgba(212,175,55,.1) → should be a --gold-tint-10 token
     - width: 70px, 120px, 220px, 260px, 55px, 42px, 56px, 38px, 30px, 24px
     - transition: .5s (hardcoded) → should use --transition-slow
   Recommendation: tokenize recurring values.

5. .featured::before POPULAR text is hardcoded
   Cannot be customized (e.g. "NEW", "BEST VALUE").
   Recommendation: move text to data-attribute (content: attr(data-ribbon)).

6. NO .card-danger / .card-success / .card-warning variants
   Cards with status accents are missing.

7. NO .card-clickable variant
   Cards that navigate on click need different styling (cursor: pointer, hover ring).

8. NO .card-image (generic) — only .course-image
   Should be generalized for any image-topped card.

--------------------------------------------------------------------------------
10.15 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Always start with .card
✅ Use .card-header / .card-body / .card-footer for structure
✅ Combine with a variant class (.dashboard-card, .course-card, .pricing-card…)
✅ Use .card-glass for glassmorphism

❌ Never rely on hover lift for non-clickable cards
❌ Never put a badge or ribbon that extends outside the card — it will be clipped
❌ Never override .card base padding — use inner sections
❌ Never use .stat-card on a documentation page (conflicts with showcase.css)

================================================================================
END OF SECTION 10
================================================================================

================================================================================
SECTION 11 — FORMS
Source: packages/aslds/css/components/forms.css
Scope:  Global. All form controls, layouts, and validation states.
JS:     None — forms are pure CSS.
================================================================================

11.1 FORM LAYOUT
--------------------------------------------------------------------------------
.form
    display: flex · flex-direction: column · gap: var(--space-5)  → 40px

.form-row
    display: grid · grid-template-columns: repeat(2, 1fr) · gap: var(--space-4)

.form-row-3
    display: grid · grid-template-columns: repeat(3, 1fr) · gap: var(--space-4)

Structure:
    <form class="form">
        <div class="form-row">
            <div class="form-group">…</div>
            <div class="form-group">…</div>
        </div>
        <div class="form-row-3">
            <div class="form-group">…</div>
            <div class="form-group">…</div>
            <div class="form-group">…</div>
        </div>
    </form>

--------------------------------------------------------------------------------
11.2 FORM GROUP (field wrapper)
--------------------------------------------------------------------------------
.form-group
    display: flex · flex-direction: column · gap: 10px

Rule: Always wrap label + input + helper in .form-group.

--------------------------------------------------------------------------------
11.3 LABEL — .form-label
--------------------------------------------------------------------------------
.form-label
    color: var(--white)
    font-size: var(--fs-sm)         → 14px
    font-weight: var(--fw-semibold) → 600

⚠️  CONFLICT with typography.css label:
    typography.css → display:block · margin-bottom:8px · semibold · white
    forms.css      → color/font only, no display, no margin-bottom

    Impact: A bare <label> gets block + margin; .form-label does NOT.
    If you use .form-label, you must ensure it's inside .form-group
    (which supplies the gap) or add your own spacing.

--------------------------------------------------------------------------------
11.4 INPUT — .form-control
--------------------------------------------------------------------------------
.form-control
    width: 100%
    height: 56px
    padding: 0 18px
    background: var(--card-bg)
    color: var(--white)
    border: 1px solid var(--border-color)
    border-radius: var(--radius-md)     → 12px
    font-size: var(--fs-md)             → 16px
    transition: all var(--transition-normal)

.form-control::placeholder
    color: var(--gray-500)

.form-control:focus
    outline: none
    border-color: var(--primary-gold)
    box-shadow: 0 0 0 4px rgba(212,175,55,.15)

.form-control:disabled
    opacity: .65
    cursor: not-allowed

Structure:
    <input class="form-control" type="text" placeholder="…">

⚠️  HEIGHT MISMATCH — variables.css defines --input-height: 52px
    But .form-control hardcodes height: 56px.
    Recommendation: use var(--input-height) or align the token.

--------------------------------------------------------------------------------
11.5 TEXTAREA
--------------------------------------------------------------------------------
textarea.form-control
    min-height: 150px
    resize: vertical
    padding: 18px

--------------------------------------------------------------------------------
11.6 SELECT
--------------------------------------------------------------------------------
select.form-control
    cursor: pointer

Note: Native browser select styling — no custom arrow. Acceptable for now.

--------------------------------------------------------------------------------
11.7 INPUT GROUP (prefix/suffix)
--------------------------------------------------------------------------------
.input-group
    display: flex · align-items: center

.input-group-text
    background: var(--surface)
    color: var(--gray-300)
    padding: 0 18px
    height: 56px
    display: flex · align-items: center
    border: 1px solid var(--border-color)

.input-group .form-control
    border-left: none

Structure:
    <div class="input-group">
        <span class="input-group-text">@</span>
        <input class="form-control" type="text">
    </div>

⚠️  RADIUS MISMATCH
    .input-group-text has no border-radius, so corners may look cut on outer edges.
    .input-group .form-control loses its left border AND left radius overlaps.
    Recommendation: add explicit radius to first/last children.

--------------------------------------------------------------------------------
11.8 SEARCH BOX
--------------------------------------------------------------------------------
.search-box
    position: relative

.search-box i
    position: absolute · left: 18px · top: 50% · transform: translateY(-50%)
    color: var(--gray-400)

.search-box .form-control
    padding-left: 50px     (makes room for the icon)

Structure:
    <div class="search-box">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input class="form-control" type="search" placeholder="Search…">
    </div>

Assumption: <i> is Font Awesome. For other icon systems, adjust selector.

--------------------------------------------------------------------------------
11.9 CHECKBOX
--------------------------------------------------------------------------------
.checkbox
    display: flex · align-items: center · gap: 12px

.checkbox input
    accent-color: var(--primary-gold)

Structure:
    <label class="checkbox">
        <input type="checkbox">
        <span>Remember me</span>
    </label>

--------------------------------------------------------------------------------
11.10 RADIO
--------------------------------------------------------------------------------
.radio
    display: flex · align-items: center · gap: 12px

.radio input
    accent-color: var(--primary-gold)

Structure:
    <label class="radio">
        <input type="radio" name="group">
        <span>Option</span>
    </label>

--------------------------------------------------------------------------------
11.11 SWITCH (toggle)
--------------------------------------------------------------------------------
.switch
    position: relative · width: 52px · height: 28px

.switch input
    display: none      ← hides native checkbox

.slider
    position: absolute · inset: 0
    background: #444
    border-radius: 30px
    transition: .3s
    cursor: pointer

.slider::before
    content: "" · 22×22 circle · left: 3px · top: 3px
    background: #fff · border-radius: 50% · transition: .3s

.switch input:checked + .slider
    background: var(--primary-gold)

.switch input:checked + .slider::before
    transform: translateX(24px)

Structure:
    <label class="switch">
        <input type="checkbox">
        <span class="slider"></span>
    </label>

⚠️  ACCESSIBILITY PROBLEM
    display:none removes the input from the tab order — keyboard users cannot
    toggle the switch. Should use .sr-only or opacity:0 + absolute positioning
    that keeps focusability, plus a :focus-visible style on .slider.

--------------------------------------------------------------------------------
11.12 FILE UPLOAD
--------------------------------------------------------------------------------
.file-upload
    border: 2px dashed var(--border-color)
    border-radius: var(--radius-lg)      → 18px
    padding: 40px
    text-align: center
    cursor: pointer
    transition: .3s

.file-upload:hover
    border-color: var(--primary-gold)
    background: rgba(212,175,55,.05)

Structure:
    <label class="file-upload">
        <input type="file" hidden>
        <span>Drop files or click to upload</span>
    </label>

⚠️  No focus style when the hidden input is tabbed to.

--------------------------------------------------------------------------------
11.13 HELPER TEXT
--------------------------------------------------------------------------------
.form-text
    font-size: var(--fs-sm)      → 14px
    color: var(--gray-400)

Rule: Place under .form-control inside .form-group.

--------------------------------------------------------------------------------
11.14 VALIDATION STATES
--------------------------------------------------------------------------------
.is-success   → border-color: var(--success) !important
.is-error     → border-color: var(--danger)  !important
.is-warning   → border-color: var(--warning) !important

.text-success → color: var(--success)
.text-error   → color: var(--danger)
.text-warning → color: var(--warning)

Structure:
    <input class="form-control is-error" type="email">
    <p class="form-text text-error">Please enter a valid email.</p>

⚠️  CONFLICTS
    .text-success is also defined in utilities.css AND typography.css — same value, safe.
    .text-warning is also defined in utilities.css — same value, safe.
    .text-error is NOT in utilities.css (utilities uses .text-danger instead).
    Inconsistent naming: forms uses .text-error, utilities uses .text-danger.

--------------------------------------------------------------------------------
11.15 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.form-row    → grid-template-columns: 1fr
.form-row-3  → grid-template-columns: 1fr

--------------------------------------------------------------------------------
11.16 QUICK REFERENCE
--------------------------------------------------------------------------------
Layout:
    .form          Vertical stack with 40px gap
    .form-row      2-column grid
    .form-row-3    3-column grid
    .form-group    Field wrapper (flex column, 10px gap)

Controls:
    .form-label       Label (semibold, 14px)
    .form-control     Input / textarea / select (56px tall)
    textarea.form-control  Tall textarea (150px min)
    select.form-control    Cursor pointer
    .form-text        Helper text below field

Groups:
    .input-group        Prefix/suffix group
    .input-group-text   The prefix/suffix itself

Specialized:
    .search-box        Input with left icon
    .checkbox          Native checkbox with gold accent
    .radio             Native radio with gold accent
    .switch + .slider  Toggle switch
    .file-upload       Dashed drop zone

Validation:
    .is-success        Green border
    .is-error          Red border
    .is-warning        Yellow border
    .text-success      Green text
    .text-error        Red text
    .text-warning      Yellow text

Disabled:
    .form-control:disabled   Opacity .65, not-allowed cursor

--------------------------------------------------------------------------------
11.17 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Every input needs a <label> or aria-label
✅ Pair .form-label with the input via for/id
✅ Mark required fields with aria-required or required attribute
✅ Group radio/checkbox with <fieldset> + <legend>
✅ Error states need aria-invalid="true" on the input

❌ Never rely on color alone — pair .is-error with text-error message
❌ Never use placeholder as the only label

--------------------------------------------------------------------------------
11.18 KNOWN ISSUES (to fix after full reference)
--------------------------------------------------------------------------------
1. HEIGHT MISMATCH
   --input-height = 52px but .form-control = 56px. Align.

2. LABEL CONFLICT
   .form-label and typography.css `label` differ. Unify.

3. INPUT GROUP RADIUS
   .input-group-text has no radius — corners may look broken.

4. SWITCH ACCESSIBILITY
   .switch input { display: none } removes it from tab order.
   Fix: use .sr-only pattern.

5. FILE UPLOAD FOCUS
   No visible focus ring when the hidden input is focused.

6. VALIDATION NAMING
   .text-error vs utilities.css .text-danger — same concept, two names.

7. HARDCODED VALUES
   height: 56px, border-radius: 30px, transform: translateX(24px),
   background: #444, #fff, rgba(212,175,55,.05)

8. NO SIZE VARIANTS
   No .form-control-sm / .form-control-lg.

9. NO INLINE FORM
   No way to place label + input on one row.

10. NO REQUIRED MARKER
    No visual indicator for required fields.

11. NO DARK/LIGHT CONTRAST CHECK
    #444 slider track may not meet contrast in light theme.

--------------------------------------------------------------------------------
11.19 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Wrap every field in .form-group
✅ Pair .form-label + .form-control for accessibility
✅ Use .form-row / .form-row-3 for multi-column layouts
✅ Use .is-error + .text-error together for validation
✅ Use <label> for clickable file-upload and switch targets

❌ Never use .form-control without a label (visible or aria)
❌ Never use placeholder as the only label
❌ Never rely on color alone to convey error
❌ Never use .text-error on non-form elements (use .text-danger)
❌ Never override form heights per page — request a token if needed

================================================================================
END OF SECTION 11
================================================================================

================================================================================
SECTION 12 — NAVBAR
Source: packages/aslds/css/components/navbar.css
Scope:  Global. Primary navigation component.
JS:     navbar.js (Section 27) — the reference implementation.
================================================================================

12.1 BASE NAVBAR — .navbar
--------------------------------------------------------------------------------
.navbar
    position:        sticky · top: 0
    width:           100%
    z-index:         var(--z-navbar)     → 1030
    background:      rgba(0,0,0,.82)
    backdrop-filter: blur(18px)
    border-bottom:   1px solid var(--border-color)

⚠️  BACKGROUND IS HARDCODED rgba(0,0,0,.82) — the same value renders differently
    on light theme. In light mode, a black bar over a light page looks wrong.
    Should be a token like --navbar-bg that flips per theme.

--------------------------------------------------------------------------------
12.2 CONTAINER — .navbar-container
--------------------------------------------------------------------------------
.navbar-container
    height:          80px
    display:         flex
    align-items:     center
    justify-content: space-between
    gap:             2rem

⚠️  HEIGHT 80px HARDCODED — variables.css has --navbar-height: 75px.
    Mismatch. Align one of them.

--------------------------------------------------------------------------------
12.3 LOGO — .navbar-logo
--------------------------------------------------------------------------------
.navbar-logo
    display:         flex
    align-items:     center
    gap:             14px
    text-decoration: none
    color:           var(--white)
    font-size:       24px
    font-weight:     800
    flex-shrink:     0

.navbar-logo span
    color: var(--primary-gold)

.navbar-logo img
    height: 42px

Structure:
    <a href="/" class="navbar-logo">
        <strong>ASL<span>INNOVATE</span></strong>
    </a>

Rule: The <span> inside .navbar-logo is the gold accent — e.g., "ASL" white, "INNOVATE" gold.

--------------------------------------------------------------------------------
12.4 MENU — .nav-menu
--------------------------------------------------------------------------------
.nav-menu
    display:         flex
    align-items:     center
    gap:             32px
    list-style:      none
    flex:            1
    justify-content: center
    margin-inline:   2rem

Structure:
    <nav>
        <ul class="nav-menu">
            <li><a class="nav-link" href="/">Home</a></li>
            <li><a class="nav-link active" href="/about">About</a></li>
        </ul>
    </nav>

--------------------------------------------------------------------------------
12.5 NAV LINK — .nav-link
--------------------------------------------------------------------------------
.nav-link
    color:           var(--gray-300)
    text-decoration: none
    font-weight:     600
    transition:      .3s
    position:        relative

.nav-link:hover
    color: var(--primary-gold)

Active state:
.nav-link.active
    color: var(--primary-gold)

.nav-link.active::after
    content:    ""
    position:   absolute
    left:       0
    bottom:     -8px
    width:      100%
    height:     2px
    background: var(--primary-gold)

Rule: Add .active and aria-current="page" on the current page's link.

--------------------------------------------------------------------------------
12.6 NAV ACTIONS — .nav-actions
--------------------------------------------------------------------------------
.nav-actions
    display:         flex
    align-items:     center
    justify-content: flex-end
    gap:             16px
    flex-wrap:       nowrap
    flex-shrink:     0
    margin-left:     auto

Purpose: Right-side controls — theme toggle, search, avatar, CTA buttons.

--------------------------------------------------------------------------------
12.7 SEARCH — .nav-search
--------------------------------------------------------------------------------
.nav-search
    width:     200px
    max-width: 18vw

⚠️  Two widths conflict. The max-width:18vw means on screens narrower than 1111px,
    the search shrinks below 200px. Combined with display:none at 992px, this
    creates an awkward in-between state.

--------------------------------------------------------------------------------
12.8 AVATAR — .nav-avatar
--------------------------------------------------------------------------------
.nav-avatar
    width:         44px
    height:        44px
    border-radius: 50%
    overflow:      hidden
    border:        2px solid var(--primary-gold)
    cursor:        pointer

.nav-avatar img
    width: 100% · height: 100% · object-fit: cover

--------------------------------------------------------------------------------
12.9 NOTIFICATION BADGE
--------------------------------------------------------------------------------
.notification-btn
    position: relative

.notification-count
    position:        absolute
    top:             -6px
    right:           -6px
    width:           20px
    height:          20px
    border-radius:   50%
    background:      var(--danger)
    color:           #fff
    display:         flex · align-items: center · justify-content: center
    font-size:       11px
    font-weight:     700

⚠️  HARDCODED #fff — should be var(--white).
    Also, this concept duplicates .badge from badge.css — potential overlap.

--------------------------------------------------------------------------------
12.10 NAVBAR DROPDOWN
--------------------------------------------------------------------------------
⚠️  CRITICAL CONFLICT WITH dropdown.css
    navbar.css defines a HOVER-based .dropdown/.dropdown-menu:
        .dropdown:hover .dropdown-menu → visible
    dropdown.css (Section 16) defines a CLICK-based .dropdown.

    Same class names, completely different behavior. If both files load on the
    same page, the hover rule and the click rule fight each other.

    RECOMMENDATION (fix after reference):
        Rename navbar version to .nav-dropdown / .nav-dropdown-menu
        OR remove hover-only dropdown from navbar and rely on dropdown.js

.navbar dropdown (current behavior):
    .dropdown         → position: relative
    .dropdown-menu    → absolute · top: 60px · right: 0 · width: 260px
                        background: var(--card-bg) · border-radius: var(--radius-lg)
                        opacity: 0 · visibility: hidden · transform: translateY(12px)
                        transition: .3s
    .dropdown:hover .dropdown-menu → opacity: 1 · visibility: visible · transform: translateY(0)
    .dropdown-menu a → block · padding: 16px 22px · --gray-300
    .dropdown-menu a:hover → background: rgba(212,175,55,.08) · color: --primary-gold

--------------------------------------------------------------------------------
12.11 MOBILE TOGGLE — .mobile-toggle
--------------------------------------------------------------------------------
.mobile-toggle
    display:         none (hidden on desktop)
    align-items:     center
    justify-content: center
    width:           48px
    height:          48px
    border:          none
    background:      transparent
    color:           var(--white)
    cursor:          pointer
    transition:      .3s

.mobile-toggle:hover
    color: var(--primary-gold)

.mobile-toggle span
    display:    block
    width:      22px
    height:     2px
    margin:     4px auto
    background: currentColor
    transition: .3s

Structure (hamburger):
    <button class="mobile-toggle">
        <span></span>
        <span></span>
        <span></span>
    </button>

⚠️  No transform to X on open. navbar.js handles aria-expanded but CSS doesn't
    animate the hamburger into an X. Should be added.

--------------------------------------------------------------------------------
12.12 RESPONSIVE — max-width: 992px
--------------------------------------------------------------------------------
.nav-menu
    display:         none    ← hidden by default on mobile
    position:        absolute · top: 80px · left: 0 · width: 100%
    flex-direction:  column · align-items: flex-start
    gap:             0
    padding:         24px
    background:      rgba(0, 0, 0, .95)
    backdrop-filter: blur(18px)
    border-top:      1px solid var(--border-color)

.nav-menu.open  → display: flex

.nav-search     → display: none    (hidden on mobile)

.nav-link
    width:         100%
    padding:       16px 0
    border-bottom: 1px solid rgba(255,255,255,.05)

.nav-actions    → gap: 8px

.mobile-toggle  → display: flex

--------------------------------------------------------------------------------
12.13 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.navbar-container → height: 72px
.navbar-logo      → font-size: 20px

--------------------------------------------------------------------------------
12.14 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                     Purpose
------------------------- --------------------------------------------
.navbar                   Base sticky navbar
.navbar-container         Flex row · logo | menu | actions
.navbar-logo              Brand mark (link)
.nav-menu                 Center nav list
.nav-link                 Nav item
.nav-link.active          Current page indicator (gold underline)
.nav-actions              Right-side controls wrapper
.nav-search               Search trigger (hidden on mobile)
.nav-avatar               Circular avatar (44px)
.notification-btn         Wrapper for notification badge
.notification-count       Red circle counter
.mobile-toggle            Hamburger (shown ≤992px)

--------------------------------------------------------------------------------
12.15 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Wrap nav in <nav aria-label="Primary Navigation">
✅ Add aria-current="page" on the active link
✅ .mobile-toggle needs aria-expanded + aria-controls
✅ Include a skip link before the navbar

❌ Never remove focus visibility from nav links

--------------------------------------------------------------------------------
12.16 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HARDCODED BACKGROUND — rgba(0,0,0,.82) breaks light theme.
2. HEIGHT MISMATCH — 80px in code vs 75px in token.
3. DROPDOWN CONFLICT — hover-based vs click-based in dropdown.css.
4. HAMBURGER NO ANIMATION — spans don't transform to X.
5. SEARCH WIDTH CONFLICT — 200px vs 18vw.
6. HARDCODED #fff in notification-count.
7. NO :focus-visible STYLE for .mobile-toggle.
8. NOTIFICATION COUNTER OVERLAPS BADGE CONCEPT — consolidate with badge.css.

--------------------------------------------------------------------------------
12.17 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .navbar + .navbar-container for structure
✅ Add .active + aria-current to current page
✅ Let navbar.js handle mobile toggle behavior
✅ Use .nav-avatar for user avatars only
❌ Never hardcode background — should flip with theme
❌ Never use .dropdown inside navbar — conflict with dropdown.css

================================================================================
END OF SECTION 12
================================================================================


================================================================================
SECTION 13 — SIDEBAR
Source: packages/aslds/css/components/sidebar.css
Scope:  Global. Application sidebar for dashboards, admin, academy.
JS:     sidebar.js (Section 28)
================================================================================

13.1 BASE SIDEBAR — .sidebar
--------------------------------------------------------------------------------
.sidebar
    width:           280px
    min-height:      100vh
    background:      var(--card-bg)
    border-right:    1px solid var(--border-color)
    display:         flex · flex-direction: column
    position:        sticky · top: 0
    overflow-y:      auto
    transition:      var(--transition-normal)

⚠️  WIDTH 280px DUPLICATES --sidebar-width token (280px). Use the token.
⚠️  min-height:100vh may cause double-scroll if used with sticky navbars.

--------------------------------------------------------------------------------
13.2 SIDEBAR HEADER — .sidebar-header
--------------------------------------------------------------------------------
.sidebar-header
    padding:        30px 24px
    border-bottom:  1px solid var(--border-color)

.sidebar-logo
    display: flex · align-items: center · gap: 14px
    text-decoration: none

.sidebar-logo img
    width: 44px · height: 44px · object-fit: contain

.sidebar-brand
    display: flex · flex-direction: column

.sidebar-title
    font-size: 22px · font-weight: 800 · color: var(--white)

.sidebar-subtitle
    font-size: 13px · color: var(--primary-gold)

Structure:
    <div class="sidebar-header">
        <a href="/" class="sidebar-logo">
            <img src="logo.png" alt="Brand">
            <div class="sidebar-brand">
                <span class="sidebar-title">ASLDS</span>
                <span class="sidebar-subtitle">Documentation</span>
            </div>
        </a>
    </div>

--------------------------------------------------------------------------------
13.3 USER PROFILE — .sidebar-user
--------------------------------------------------------------------------------
.sidebar-user
    padding:        24px
    text-align:     center
    border-bottom:  1px solid var(--border-color)

.sidebar-avatar
    width:         80px
    height:        80px
    border-radius: 50%
    overflow:      hidden
    margin:        0 auto 15px
    border:        3px solid var(--primary-gold)

.sidebar-avatar img
    width: 100% · height: 100% · object-fit: cover

.sidebar-name
    font-size: 18px · font-weight: 700 · color: var(--white)

.sidebar-role
    font-size: 14px · color: var(--gray-400) · margin-top: 4px

.sidebar-level
    display:         inline-block
    margin-top:      12px
    padding:         6px 14px
    background:      rgba(212,175,55,.12)
    border:          1px solid var(--primary-gold)
    border-radius:   999px
    color:           var(--primary-gold)
    font-size:       13px
    font-weight:     700

⚠️  OVERLAPS WITH avatar.css — sidebar defines its own avatar sizing.
    Could reuse .avatar .avatar-lg if sizing matches.

--------------------------------------------------------------------------------
13.4 NAVIGATION — .sidebar-nav / .sidebar-menu / .sidebar-link
--------------------------------------------------------------------------------
.sidebar-nav
    flex:    1
    padding: 20px 16px

.sidebar-menu
    list-style:      none
    display:         flex · flex-direction: column
    gap:             8px

.sidebar-item
    width: 100%

.sidebar-link
    display:         flex · align-items: center · gap: 14px
    padding:         14px 18px
    border-radius:   var(--radius-md)
    color:           var(--gray-300)
    text-decoration: none
    font-weight:     600
    transition:      var(--transition-normal)

.sidebar-link i
    width: 22px · text-align: center · font-size: 18px

.sidebar-link:hover
    background: rgba(212,175,55,.08)
    color:      var(--primary-gold)

.sidebar-link.active
    background:  rgba(212,175,55,.12)
    color:        var(--primary-gold)
    border-left:  4px solid var(--primary-gold)

Structure:
    <nav class="sidebar-nav">
        <ul class="sidebar-menu">
            <li class="sidebar-item">
                <a href="/" class="sidebar-link active">
                    <i class="fa-solid fa-home"></i> Home
                </a>
            </li>
        </ul>
    </nav>

--------------------------------------------------------------------------------
13.5 PROGRESS CARD — .sidebar-progress
--------------------------------------------------------------------------------
.sidebar-progress
    margin: 20px 16px
    padding: 20px
    background: var(--surface)
    border: 1px solid var(--border-color)
    border-radius: var(--radius-lg)

.sidebar-progress-title
    font-size: 14px · color: var(--gray-400) · margin-bottom: 12px

.sidebar-progress-value
    font-size: 26px · font-weight: 800 · color: var(--primary-gold) · margin-bottom: 12px

.sidebar-progress-bar
    width: 100% · height: 10px · background: rgba(255,255,255,.08)
    border-radius: 999px · overflow: hidden

.sidebar-progress-fill
    height: 100% · border-radius: 999px
    background: linear-gradient(90deg, var(--primary-gold), var(--dark-gold))

⚠️  HARDCODED WIDTH ON FILL
    .sidebar-progress-fill has width: 68% hardcoded in the original CSS.
    This should be set inline via style="width: 68%" per instance.

⚠️  OVERLAPS WITH progress.css — should reuse .progress / .progress-bar patterns.

--------------------------------------------------------------------------------
13.6 DAILY MISSION — .sidebar-mission
--------------------------------------------------------------------------------
.sidebar-mission
    margin:        0 16px 20px
    padding:       20px
    border-radius: var(--radius-lg)
    background:    rgba(212,175,55,.08)
    border:        1px solid rgba(212,175,55,.2)

.sidebar-mission h4
    color:         var(--primary-gold)
    margin-bottom: 10px
    font-size:     15px

.sidebar-mission p
    color:       var(--gray-300)
    font-size:   14px
    line-height: 1.6

--------------------------------------------------------------------------------
13.7 FOOTER — .sidebar-footer
--------------------------------------------------------------------------------
.sidebar-footer
    padding:     20px
    border-top:  1px solid var(--border-color)

.sidebar-footer .sidebar-link
    color: var(--danger)

.sidebar-footer .sidebar-link:hover
    background: rgba(220,53,69,.12)
    color:      var(--danger)

--------------------------------------------------------------------------------
13.8 SCROLLBAR
--------------------------------------------------------------------------------
.sidebar::-webkit-scrollbar          → width 8px
.sidebar::-webkit-scrollbar-track    → transparent
.sidebar::-webkit-scrollbar-thumb    → rgba(212,175,55,.25) · radius 999px
.sidebar::-webkit-scrollbar-thumb:hover → var(--primary-gold)

⚠️  DIFFERS FROM GLOBAL SCROLLBAR (reset.css)
    reset.css → 10px width · --surface track · --primary-gold thumb
    sidebar.css overrides with 8px, transparent track, transparent thumb
    Two different scrollbar styles on the same page is inconsistent.

--------------------------------------------------------------------------------
13.9 RESPONSIVE — max-width: 992px
--------------------------------------------------------------------------------
.sidebar
    position: fixed · left: -100% · top: 0
    z-index: 1100
    transition: left .3s ease

.sidebar.open
    left: 0

⚠️  z-index 1100 HARDCODED — higher than --z-modal (1050) but not a defined token.
    --z-loader is 1200. Which one should sidebar be?
    Recommendation: add --z-sidebar token.

--------------------------------------------------------------------------------
13.10 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.sidebar         → width: 260px
.sidebar-header  → padding: 24px 20px
.sidebar-user    → padding: 20px

--------------------------------------------------------------------------------
13.11 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                       Purpose
--------------------------- --------------------------------------
.sidebar                    Base sticky sidebar (280px)
.sidebar-header             Top section (logo)
.sidebar-logo               Logo link
.sidebar-brand              Text wrapper (title + subtitle)
.sidebar-title              Brand title
.sidebar-subtitle           Brand subtitle (gold)
.sidebar-user               User profile block
.sidebar-avatar             Circular avatar (80px, gold border)
.sidebar-name               User name
.sidebar-role               User role
.sidebar-level              Pill (level indicator)
.sidebar-nav                Nav wrapper (flex:1)
.sidebar-menu               Nav list
.sidebar-item               Nav list item
.sidebar-link               Nav link
.sidebar-link.active        Current item
.sidebar-progress           Progress card
.sidebar-mission            Gold-accent mission card
.sidebar-footer             Bottom (logout)

--------------------------------------------------------------------------------
13.12 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Wrap nav in <nav> with aria-label
✅ Add aria-current="page" on active link
✅ Logout link should be a button, not an anchor
✅ Sidebar toggle needs aria-expanded + aria-controls

--------------------------------------------------------------------------------
13.13 KNOWN ISSUES
--------------------------------------------------------------------------------
1. WIDTH HARDCODED — 280px duplicates --sidebar-width token.
2. SCROLLBAR STYLE OVERRIDE — inconsistent with reset.css.
3. Z-INDEX 1100 HARDCODED — no token.
4. PROGRESS FILL WIDTH HARDCODED — 68% baked into CSS.
5. AVATAR DUPLICATION — .sidebar-avatar duplicates avatar.css.
6. PROGRESS DUPLICATION — .sidebar-progress duplicates progress.css.
7. MISSION BLOCK IS ACADEMY-SPECIFIC — being in generic sidebar makes it
   mandatory for every app. Should be optional or moved to academy components.
8. NO ICON-ONLY COLLAPSED STATE — sidebar has no way to render at 60px wide.

--------------------------------------------------------------------------------
13.14 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .sidebar + .sidebar-nav + .sidebar-menu structure
✅ Add .active + aria-current on current page
✅ Let sidebar.js handle mobile toggle
✅ Set progress fill width inline (style="width: 68%")

❌ Never rely on hardcoded 280px — use --sidebar-width
❌ Never duplicate scrollbar styling — inherit from reset
❌ Never use .sidebar-avatar for non-sidebar avatars — use .avatar

================================================================================
END OF SECTION 13
================================================================================


================================================================================
SECTION 14 — FOOTER
Source: packages/aslds/css/components/footer.css
Scope:  Global. Main site footer (not documentation footer).
================================================================================

14.1 BASE FOOTER — .footer
--------------------------------------------------------------------------------
.footer
    background:   var(--card-bg)
    border-top:   1px solid var(--border-color)
    margin-top:   auto
    color:        var(--gray-300)

Structure:
    <footer class="footer">
        <div class="footer-container">
            …
        </div>
    </footer>

--------------------------------------------------------------------------------
14.2 CONTAINER — .footer-container
--------------------------------------------------------------------------------
.footer-container
    max-width: var(--container-xl)     ⚠️  UNDEFINED TOKEN
    margin:    0 auto
    padding:   60px 24px 30px

⚠️  CRITICAL: --container-xl DOES NOT EXIST in variables.css.
    Available container tokens: --container-width (1200px).
    Impact: max-width falls back to none → footer content stretches full-width on
    large screens. Design is broken on 4K monitors.

    FIX (after reference):
        Replace --container-xl with --container-width
        OR add --container-xl to variables.css

--------------------------------------------------------------------------------
14.3 FOOTER GRID — .footer-grid
--------------------------------------------------------------------------------
.footer-grid
    display:               grid
    grid-template-columns: 2fr 1fr 1fr 1.2fr
    gap:                   40px
    margin-bottom:         50px

Structure: 4-column layout
    Column 1: Brand (2fr — widest)
    Column 2: Links group
    Column 3: Links group
    Column 4: Newsletter (1.2fr)

--------------------------------------------------------------------------------
14.4 BRAND — .footer-brand
--------------------------------------------------------------------------------
.footer-brand h2
    color: var(--white) · font-size: 26px · margin-bottom: 10px · font-weight: 800

.footer-brand span
    color: var(--primary-gold)

.footer-brand p
    color: var(--gray-400) · line-height: 1.8

Structure:
    <div class="footer-brand">
        <h2>ASL<span>INNOVATE</span></h2>
        <p>…</p>
    </div>

--------------------------------------------------------------------------------
14.5 TITLES — .footer-title
--------------------------------------------------------------------------------
.footer-title
    color:         var(--white)
    font-size:     18px
    margin-bottom: 20px
    font-weight:   700

Rule: Use .footer-title on <h3> or <h4> inside link columns.

--------------------------------------------------------------------------------
14.6 LINKS — .footer-links
--------------------------------------------------------------------------------
.footer-links
    list-style:     none
    display:        flex · flex-direction: column
    gap:            12px

.footer-links a
    color:           var(--gray-400)
    text-decoration: none
    transition:      var(--transition-normal)

.footer-links a:hover
    color:         var(--primary-gold)
    padding-left:  6px    ← slide-in effect

Structure:
    <ul class="footer-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
    </ul>

--------------------------------------------------------------------------------
14.7 CONTACT — .footer-contact
--------------------------------------------------------------------------------
.footer-contact
    display: flex · flex-direction: column · gap: 14px

.footer-contact-item
    display: flex · align-items: flex-start · gap: 12px

.footer-contact-item i
    color: var(--primary-gold) · width: 20px · margin-top: 4px

Structure:
    <div class="footer-contact">
        <div class="footer-contact-item">
            <i class="fa-solid fa-envelope"></i>
            <span>contact@…</span>
        </div>
    </div>

--------------------------------------------------------------------------------
14.8 SOCIAL — .footer-social
--------------------------------------------------------------------------------
.footer-social
    display: flex · gap: 14px · margin-top: 25px

.footer-social a
    width: 42px · height: 42px · border-radius: 50%
    display: flex · align-items: center · justify-content: center
    background: rgba(255,255,255,.05)
    color: var(--gray-300)
    transition: var(--transition-normal)

.footer-social a:hover
    background: var(--primary-gold)
    color: #000
    transform: translateY(-3px)

⚠️  HARDCODED #000 — should be var(--black).
⚠️  HARDCODED rgba(255,255,255,.05) — should be var(--glass-bg) or a token.

--------------------------------------------------------------------------------
14.9 NEWSLETTER — .footer-newsletter
--------------------------------------------------------------------------------
.footer-newsletter
    margin-top: 20px

.footer-newsletter input
    width: 100% · padding: 14px 16px
    border: 1px solid var(--border-color)
    border-radius: var(--radius-md)
    background: var(--surface)
    color: var(--white)
    margin-bottom: 12px

.footer-newsletter input:focus
    outline: none · border-color: var(--primary-gold)

⚠️  This is only the input. There's NO submit button styling here.
    On public-site pages, the newsletter form has a submit button (paper plane).
    That button is NOT styled by footer.css → uses unstyled <button> from reset.

    FIX: Add .footer-newsletter button styles here (positioned inside input,
    circular, gold background).

--------------------------------------------------------------------------------
14.10 BOTTOM — .footer-bottom
--------------------------------------------------------------------------------
.footer-bottom
    border-top:      1px solid var(--border-color)
    padding-top:     24px
    display:         flex · justify-content: space-between · align-items: center
    gap:             20px
    flex-wrap:       wrap

.footer-copy
    color: var(--gray-500) · font-size: 14px

.footer-bottom-links
    display: flex · gap: 24px

.footer-bottom-links a
    color: var(--gray-400) · text-decoration: none
    transition: var(--transition-fast)

.footer-bottom-links a:hover
    color: var(--primary-gold)

Structure:
    <div class="footer-bottom">
        <p class="footer-copy">© 2026 …</p>
        <div class="footer-bottom-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
        </div>
    </div>

--------------------------------------------------------------------------------
14.11 RESPONSIVE — max-width: 992px
--------------------------------------------------------------------------------
.footer-grid → grid-template-columns: repeat(2, 1fr)

--------------------------------------------------------------------------------
14.12 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.footer-grid          → 1 column · gap: 35px
.footer-bottom        → flex-direction: column · text-align: center
.footer-bottom-links  → flex-wrap: wrap · justify-content: center

--------------------------------------------------------------------------------
14.13 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                     Purpose
------------------------- --------------------------------------------
.footer                   Base footer wrapper
.footer-container         Max-width inner wrapper
.footer-grid              4-column layout
.footer-brand             Brand column (logo + tagline)
.footer-title             Column heading
.footer-links             Link list
.footer-contact           Contact info column
.footer-contact-item      Contact row (icon + text)
.footer-social            Social icon row
.footer-newsletter        Newsletter input
.footer-bottom            Copyright + legal links
.footer-copy              Copyright text
.footer-bottom-links      Legal link row

--------------------------------------------------------------------------------
14.14 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Use <footer role="contentinfo">
✅ Wrap link columns in <nav aria-label="Footer">
✅ Newsletter input needs a <label> (can be visually hidden)
✅ Social icons need aria-label

--------------------------------------------------------------------------------
14.15 KNOWN ISSUES
--------------------------------------------------------------------------------
1. UNDEFINED TOKEN — --container-xl used but not defined. Breaks max-width.
2. MISSING NEWSLETTER BUTTON STYLE — submit button unstyled.
3. HARDCODED #000 in .footer-social a:hover.
4. HARDCODED rgba(255,255,255,.05) in .footer-social a.
5. .footer-title NOT APPLIED — structure uses <h4> in HTML but CSS expects .footer-title.
6. DUPLICATES WITH showcase.css .doc-footer
   Two different footer implementations. Same concept.
   Docs pages use .doc-footer; app pages use .footer.
   Both exist. Choose one per page.
7. MARGIN-TOP: auto — assumes parent is flex column.
   If not wrapped in .page-wrapper, footer floats up.

--------------------------------------------------------------------------------
14.16 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .footer + .footer-container + .footer-grid structure
✅ Use .footer-title for column headings
✅ Give every social link an aria-label
✅ Wrap footer in <footer role="contentinfo">
✅ Use .footer for app pages, .doc-footer for docs

❌ Never use .footer without .page-wrapper on the parent — margin-top:auto
❌ Never mix .footer and .doc-footer on the same page
❌ Never use .footer-social a without an aria-label

================================================================================
END OF SECTION 14
================================================================================

================================================================================
SECTION 15 — MODAL
Source: packages/aslds/css/components/modal.css
Scope:  Global. Dialog/overlay component.
JS:     modal.js (Section 29)
================================================================================

15.1 BACKDROP — .modal
--------------------------------------------------------------------------------
.modal
    position:        fixed · inset: 0
    display:         flex · align-items: center · justify-content: center
    padding:         24px
    background:      rgba(0,0,0,.72)
    backdrop-filter: blur(8px)
    opacity:         0
    visibility:      hidden
    transition:      var(--transition-normal)
    z-index:         2000

.modal.is-open
    opacity:    1
    visibility: visible

Structure:
    <div class="modal" id="myModal">
        <div class="modal-dialog">
            <div class="modal-header">…</div>
            <div class="modal-body">…</div>
            <div class="modal-footer">…</div>
        </div>
    </div>

⚠️  Z-INDEX 2000 HARDCODED — HIGHER THAN --z-loader (1200).
    Modal should use var(--z-modal) which is 1050.
    Current value means modal sits above loaders, toasts, everything.

--------------------------------------------------------------------------------
15.2 DIALOG — .modal-dialog
--------------------------------------------------------------------------------
.modal-dialog
    width:            100%
    max-width:        650px
    background:       var(--card-bg)
    border:           1px solid var(--border-color)
    border-radius:    var(--radius-xl)     → 24px
    box-shadow:       var(--shadow-xl)     ⚠️ UNDEFINED TOKEN
    overflow:         hidden
    transform:        translateY(20px) scale(.97)
    transition:       var(--transition-normal)

.modal.is-open .modal-dialog
    transform: translateY(0) scale(1)

⚠️  --shadow-xl UNDEFINED — same bug as utilities.css.
    Only --shadow-sm, --shadow-md, --shadow-lg, --shadow-gold exist.
    Falls back to none → modal has no shadow!

--------------------------------------------------------------------------------
15.3 SIZES
--------------------------------------------------------------------------------
.modal-sm .modal-dialog  → max-width: 420px
.modal-md .modal-dialog  → max-width: 650px
.modal-lg .modal-dialog  → max-width: 900px
.modal-xl .modal-dialog  → max-width: 1200px

Rule: Size class goes on the OUTER .modal, not on .modal-dialog:
    <div class="modal modal-lg">…</div>

--------------------------------------------------------------------------------
15.4 HEADER — .modal-header
--------------------------------------------------------------------------------
.modal-header
    display:         flex · justify-content: space-between · align-items: center
    padding:         22px 26px
    border-bottom:   1px solid var(--border-color)

.modal-title
    font-size:   22px
    font-weight: 700
    color:       var(--white)

Structure:
    <div class="modal-header">
        <h3 class="modal-title">Title</h3>
        <button class="modal-close" aria-label="Close">×</button>
    </div>

--------------------------------------------------------------------------------
15.5 CLOSE BUTTON — .modal-close
--------------------------------------------------------------------------------
.modal-close
    width:         42px
    height:        42px
    border:        none
    border-radius: 50%
    background:    rgba(255,255,255,.05)
    color:         var(--gray-300)
    cursor:        pointer
    transition:    var(--transition-fast)

.modal-close:hover
    background: rgba(212,175,55,.12)
    color:      var(--primary-gold)
    transform:  rotate(90deg)

Rule: Always include aria-label="Close" on the close button.

--------------------------------------------------------------------------------
15.6 BODY — .modal-body
--------------------------------------------------------------------------------
.modal-body
    padding:     28px
    color:       var(--gray-300)
    line-height: 1.8

--------------------------------------------------------------------------------
15.7 FOOTER — .modal-footer
--------------------------------------------------------------------------------
.modal-footer
    display:         flex · justify-content: flex-end · gap: 14px
    padding:         22px 26px
    border-top:      1px solid var(--border-color)

Structure:
    <div class="modal-footer">
        <button class="btn btn-outline">Cancel</button>
        <button class="btn btn-primary">Confirm</button>
    </div>

--------------------------------------------------------------------------------
15.8 SCROLLABLE CONTENT — .modal-scroll
--------------------------------------------------------------------------------
.modal-scroll
    max-height: 70vh
    overflow-y: auto

Rule: Add to .modal-body when content might overflow.

--------------------------------------------------------------------------------
15.9 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.modal           → padding: 16px
.modal-body      → padding: 20px
.modal-header    → padding: 18px
.modal-footer    → padding: 18px · flex-direction: column
.modal-footer .btn → width: 100%

--------------------------------------------------------------------------------
15.10 QUICK REFERENCE
--------------------------------------------------------------------------------
Class             Purpose
----------------- --------------------------------------
.modal            Backdrop overlay (fixed, covers screen)
.modal-dialog     Inner dialog container
.modal-sm/md/lg/xl  Sizes (on outer .modal)
.modal-header     Top bar (title + close)
.modal-title      Heading
.modal-close      Round close button (rotates on hover)
.modal-body       Content area
.modal-footer     Action buttons (right-aligned)
.modal-scroll     Scrollable body (max 70vh)

--------------------------------------------------------------------------------
15.11 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ role="dialog" on .modal-dialog
✅ aria-modal="true" on .modal-dialog
✅ aria-labelledby pointing to .modal-title's id
✅ Close button: aria-label="Close"
✅ Focus trap (handled by modal.js)
✅ Escape key to close (handled by modal.js)

--------------------------------------------------------------------------------
15.12 KNOWN ISSUES
--------------------------------------------------------------------------------
1. --shadow-xl UNDEFINED — modal has no shadow at all.
2. z-index 2000 HARDCODED — no token, wrong priority order.
3. NO VARIANTS — no fullscreen, no drawer/sheet, no confirmation-style.
4. NO ANIMATION ON BACKDROP FADE — only the dialog transforms.
5. HEADER PADDING DIFFERS FROM BODY (22px vs 28px vertical).
6. NO .modal-backdrop class — .modal does both jobs (overlay + wrapper).

--------------------------------------------------------------------------------
15.13 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .modal + .modal-dialog structure
✅ Sizes go on the outer .modal (.modal-lg, .modal-xl)
✅ Always include aria-labelledby + aria-modal
✅ Let modal.js handle focus trap, escape, scroll lock

❌ Never open a modal without a close button
❌ Never stack multiple modals
❌ Never use .modal for tooltips or popovers

================================================================================
END OF SECTION 15
================================================================================


================================================================================
SECTION 16 — DROPDOWN
Source: packages/aslds/css/components/dropdown.css
Scope:  Global. Menu on click (contrast with navbar.css hover-based dropdown).
JS:     dropdown.js (Section 30)
================================================================================

16.1 WRAPPER — .dropdown
--------------------------------------------------------------------------------
.dropdown
    position: relative
    display:  inline-block

--------------------------------------------------------------------------------
16.2 TOGGLE — .dropdown-toggle
--------------------------------------------------------------------------------
.dropdown-toggle
    display:     flex · align-items: center · gap: 10px
    cursor:      pointer
    border:      none
    background:  none
    color:       var(--white)
    font:        inherit

Structure:
    <div class="dropdown">
        <button class="dropdown-toggle">
            Menu <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu">…</div>
    </div>

--------------------------------------------------------------------------------
16.3 MENU — .dropdown-menu
--------------------------------------------------------------------------------
.dropdown-menu
    position:        absolute
    top:             calc(100% + 12px)
    right:           0
    min-width:       240px
    background:      var(--card-bg)
    border:          1px solid var(--border-color)
    border-radius:   var(--radius-lg)      → 18px
    box-shadow:      var(--shadow-lg)
    overflow:        hidden
    opacity:         0
    visibility:      hidden
    transform:       translateY(-10px)
    transition:      var(--transition-normal)
    z-index:         1000

.dropdown.is-open .dropdown-menu
    opacity:    1
    visibility: visible
    transform:  translateY(0)

⚠️  z-index 1000 HARDCODED — matches --z-dropdown token but not using it.
⚠️  CONFLICT WITH navbar.css — navbar has its own .dropdown-menu that opens on
    HOVER with different dimensions (260px vs 240px). Both files use .dropdown
    and .dropdown-menu. Loading both on the same page causes rule collision.

--------------------------------------------------------------------------------
16.4 HEADER — .dropdown-header
--------------------------------------------------------------------------------
.dropdown-header
    padding:       18px
    border-bottom: 1px solid var(--border-color)

.dropdown-title
    font-size:   16px
    font-weight: 700
    color:       var(--white)

.dropdown-subtitle
    margin-top: 4px
    font-size:  13px
    color:      var(--gray-400)

--------------------------------------------------------------------------------
16.5 LIST — .dropdown-list
--------------------------------------------------------------------------------
.dropdown-list
    list-style: none
    padding:    8px 0

.dropdown-item
    width: 100%

--------------------------------------------------------------------------------
16.6 LINK — .dropdown-link
--------------------------------------------------------------------------------
.dropdown-link
    display:         flex · align-items: center · gap: 14px
    padding:         14px 18px
    text-decoration: none
    color:           var(--gray-300)
    transition:      var(--transition-fast)

.dropdown-link:hover
    background: rgba(212,175,55,.08)
    color:      var(--primary-gold)

.dropdown-link.active
    background: rgba(212,175,55,.12)
    color:      var(--primary-gold)

.dropdown-link i
    width:      18px
    text-align: center

Structure:
    <ul class="dropdown-list">
        <li class="dropdown-item">
            <a class="dropdown-link" href="/profile">
                <i class="fa-solid fa-user"></i> Profile
            </a>
        </li>
    </ul>

--------------------------------------------------------------------------------
16.7 DIVIDER — .dropdown-divider
--------------------------------------------------------------------------------
.dropdown-divider
    height:     1px
    background: var(--border-color)
    margin:     8px 0

--------------------------------------------------------------------------------
16.8 FOOTER — .dropdown-footer
--------------------------------------------------------------------------------
.dropdown-footer
    padding:    14px 18px
    border-top: 1px solid var(--border-color)

.dropdown-footer a
    color:           var(--primary-gold)
    text-decoration: none
    font-weight:     600

--------------------------------------------------------------------------------
16.9 STATES
--------------------------------------------------------------------------------
.is-hidden    → display: none !important
.is-disabled  → opacity: .5 · pointer-events: none

--------------------------------------------------------------------------------
16.10 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.dropdown-menu → min-width: 210px

--------------------------------------------------------------------------------
16.11 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                 Purpose
--------------------- ------------------------------------------
.dropdown             Wrapper (position: relative)
.dropdown-toggle      Trigger button
.dropdown-menu        The floating menu
.dropdown.is-open     Open state (set by dropdown.js)
.dropdown-header      Top section (title + subtitle)
.dropdown-list        Menu list
.dropdown-item        List item wrapper
.dropdown-link        Menu link
.dropdown-link.active Current item
.dropdown-divider     Separator
.dropdown-footer      Bottom section

--------------------------------------------------------------------------------
16.12 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ role="menu" on .dropdown-menu
✅ role="menuitem" on .dropdown-link
✅ aria-haspopup="true" + aria-expanded on .dropdown-toggle
✅ Escape closes (handled by dropdown.js)
✅ Arrow keys navigate (handled by dropdown.js)

--------------------------------------------------------------------------------
16.13 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HARD CONFLICT WITH navbar.css — same class names, different behavior.
   Fix: rename one to .nav-dropdown-*.
2. z-index 1000 HARDCODED.
3. NO ARROW/POINTER — dropdown has no visual connection to its trigger.
4. NO LEFT-ALIGNED VARIANT — only right: 0 alignment.
5. NO OFFSET CONFIGURATION — top: calc(100% + 12px) hardcoded.
6. NO KEYBOARD FOCUS STYLES — no :focus-visible.

--------------------------------------------------------------------------------
16.14 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .dropdown-toggle (button) + .dropdown-menu (content)
✅ Add role="menu" to the menu
✅ Let dropdown.js handle open/close
✅ One dropdown pattern per page — do NOT mix navbar hover + this click version

================================================================================
END OF SECTION 16
================================================================================


================================================================================
SECTION 17 — TABS
Source: packages/aslds/css/components/tabs.css
Scope:  Global. Tabbed interface pattern.
JS:     tabs.js (Section 31)
================================================================================

17.1 WRAPPER — .tabs
--------------------------------------------------------------------------------
.tabs
    width: 100%

--------------------------------------------------------------------------------
17.2 TAB LIST — .tab-list
--------------------------------------------------------------------------------
.tab-list
    display:        flex
    gap:            10px
    border-bottom:  1px solid var(--border-color)
    margin-bottom:  24px
    overflow-x:     auto

Rule: Horizontal scroll on overflow (mobile friendly).

--------------------------------------------------------------------------------
17.3 TAB BUTTON — .tab-button
--------------------------------------------------------------------------------
.tab-button
    padding:            14px 22px
    border:             none
    background:         none
    cursor:             pointer
    font-weight:        700
    color:              var(--gray-400)
    border-bottom:      3px solid transparent
    transition:         var(--transition-fast)
    white-space:        nowrap

.tab-button:hover
    color: var(--primary-gold)

.tab-button.is-active
    color:                var(--primary-gold)
    border-bottom-color:  var(--primary-gold)

⚠️  USES .is-active — SAME AS tabs.js expects. Good.
    But dropdown and other components use .active (without is-).
    Inconsistent naming across ASLDS: .active vs .is-active.

--------------------------------------------------------------------------------
17.4 CONTENT — .tab-content
--------------------------------------------------------------------------------
.tab-content
    display:   none
    animation: fadeTab .35s ease

.tab-content.is-active
    display: block

@keyframes fadeTab
    from → opacity 0 · translateY(8px)
    to   → opacity 1 · translateY(0)

--------------------------------------------------------------------------------
17.5 ICONS — .tab-button i
--------------------------------------------------------------------------------
.tab-button i
    margin-right: 8px

--------------------------------------------------------------------------------
17.6 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.tab-button
    padding:    12px 16px
    font-size:  14px

--------------------------------------------------------------------------------
17.7 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                 Purpose
--------------------- ------------------------------------
.tabs                 Wrapper
.tab-list             Horizontal row of buttons
.tab-button           Tab trigger
.tab-button.is-active Active tab (gold underline)
.tab-content          Panel (hidden by default)
.tab-content.is-active Visible panel

--------------------------------------------------------------------------------
17.8 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ role="tablist" on .tab-list
✅ role="tab" on each .tab-button
✅ aria-selected + aria-controls on buttons
✅ role="tabpanel" on each .tab-content
✅ Arrow key navigation (handled by tabs.js)

--------------------------------------------------------------------------------
17.9 KNOWN ISSUES
--------------------------------------------------------------------------------
1. NO FOCUS VISIBLE — .tab-button:focus-visible not defined.
2. NO VERTICAL TABS variant.
3. NO PILL TABS variant — only underline style.
4. NO ICON-ONLY TABS variant.
5. INCONSISTENT ACTIVE STATE NAMING (.is-active vs .active).
6. NO DISABLED STATE — no .tab-button:disabled styling.

--------------------------------------------------------------------------------
17.10 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .tabs > .tab-list > .tab-button structure
✅ Panels use .tab-content + .is-active
✅ Let tabs.js manage is-active + ARIA

================================================================================
END OF SECTION 17
================================================================================


================================================================================
SECTION 18 — TOAST
Source: packages/aslds/css/components/toast.css
Scope:  Global. Notification toasts.
JS:     toast.js (Section 32)
================================================================================

18.1 CONTAINER — .toast-container
--------------------------------------------------------------------------------
.toast-container
    position:        fixed
    z-index:         var(--z-toast, 1070)
    display:         flex · flex-direction: column · gap: 12px
    max-width:       400px
    width:           100%
    padding:         16px
    pointer-events:  none    ← container ignores clicks

Positions:
    .toast-container--top-right      → top: 20px · right: 20px
    .toast-container--top-left       → top: 20px · left: 20px
    .toast-container--bottom-right   → bottom: 20px · right: 20px
    .toast-container--bottom-left    → bottom: 20px · left: 20px

Rule: Created dynamically by toast.js. Never write this in HTML.

--------------------------------------------------------------------------------
18.2 INDIVIDUAL TOAST — .toast
--------------------------------------------------------------------------------
.toast
    position:        relative
    pointer-events:  auto     ← each toast is clickable
    background:      var(--card-bg)
    border:          1px solid var(--border-color)
    border-radius:   var(--radius-lg)
    box-shadow:      var(--shadow-lg)
    padding:         16px 20px  (padding-right: 48px for close)
    min-height:      60px
    overflow:        hidden
    animation:       toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards
    transition:      opacity .3s, transform .3s, max-height .3s

.toast::before
    content: ""
    position: absolute · top: 0 · left: 0 · width: 4px · height: 100%
    border-radius: var(--radius-sm) 0 0 var(--radius-sm)

Rule: The ::before creates the colored left accent bar.

--------------------------------------------------------------------------------
18.3 TYPES
--------------------------------------------------------------------------------
.toast--success
    border-left-color: var(--success)
    ::before → background: var(--success)
    .toast-icon → color: var(--success)

.toast--error
    border-left-color: var(--danger)
    ::before → background: var(--danger)
    .toast-icon → color: var(--danger)

.toast--warning
    border-left-color: var(--warning)
    ::before → background: var(--warning)
    .toast-icon → color: var(--warning)

.toast--info
    border-left-color: var(--primary-gold)
    ::before → background: var(--primary-gold)
    .toast-icon → color: var(--primary-gold)

--------------------------------------------------------------------------------
18.4 CONTENT STRUCTURE
--------------------------------------------------------------------------------
.toast-content  → flex · align-items: flex-start · gap: 14px
.toast-icon     → 22px square · flex-shrink: 0 · font-size: 18px
.toast-body     → flex: 1
.toast-title    → 15px · weight 700 · white · margin-bottom 4px
.toast-message  → 14px · --gray-400 · line-height 1.6

Structure (created by toast.js):
    <div class="toast toast--success">
        <div class="toast-content">
            <span class="toast-icon">✓</span>
            <div class="toast-body">
                <div class="toast-title">Success!</div>
                <div class="toast-message">Your changes have been saved.</div>
            </div>
        </div>
        <button class="toast-close">✕</button>
        <div class="toast-progress"></div>
    </div>

--------------------------------------------------------------------------------
18.5 CLOSE BUTTON — .toast-close
--------------------------------------------------------------------------------
.toast-close
    position:        absolute · top: 12px · right: 12px
    width:           28px · height: 28px
    border:          none · background: none
    color:           var(--gray-500)
    cursor:          pointer · font-size: 18px
    border-radius:   var(--radius-sm)
    transition:      var(--transition-fast)
    display:         flex · align-items: center · justify-content: center

.toast-close:hover
    background: rgba(255,255,255,0.08)
    color:      var(--white)

.toast-close:focus-visible
    outline: 2px solid var(--primary-gold) · outline-offset: 2px

--------------------------------------------------------------------------------
18.6 PROGRESS BAR — .toast-progress
--------------------------------------------------------------------------------
.toast-progress
    position:      absolute · bottom: 0 · left: 0
    height:        3px
    background:    var(--primary-gold)
    border-radius: 0 0 var(--radius-lg) var(--radius-lg)
    transition:    width 0.1s linear
    width:         100%

Type overrides:
    .toast--success .toast-progress → background: var(--success)
    .toast--error   .toast-progress → background: var(--danger)
    .toast--warning .toast-progress → background: var(--warning)
    .toast--info    .toast-progress → background: var(--primary-gold)

Rule: toast.js shrinks width from 100% → 0% during auto-dismiss.

--------------------------------------------------------------------------------
18.7 ANIMATIONS
--------------------------------------------------------------------------------
@keyframes toastSlideIn
    from → opacity 0 · translateX(30px) · scale(.96)
    to   → opacity 1 · translateX(0) · scale(1)

@keyframes toastSlideOut
    from → opacity 1 · translateX(0) · scale(1)
    to   → opacity 0 · translateX(30px) · scale(.96)

.toast--exiting
    animation: toastSlideOut 0.3s ease forwards

Rule: toast.js adds .toast--exiting before removal for exit animation.

--------------------------------------------------------------------------------
18.8 RESPONSIVE — max-width: 576px
--------------------------------------------------------------------------------
.toast-container    → full width · padding 12px · top 12px · left+right 12px
All positions       → left: 12px · right: 12px (both sides)
.toast              → padding 14px 16px
.toast-title        → 14px
.toast-message      → 13px
.toast-close        → smaller (24×24) · repositioned to 10px

--------------------------------------------------------------------------------
18.9 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                        Purpose
---------------------------- -----------------------------------
.toast-container             Fixed wrapper (created by JS)
.toast-container--{position} One of 4 position variants
.toast                       Individual notification
.toast--success/error/warning/info   Type
.toast-content               Inner flex row
.toast-icon                  Left icon (type-colored)
.toast-body                  Text wrapper
.toast-title                 Bold title
.toast-message               Description
.toast-close                 Dismiss button (absolute)
.toast-progress              Bottom progress bar
.toast--exiting              Exit animation state

--------------------------------------------------------------------------------
18.10 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Container: aria-live="polite" (set by toast.js)
✅ Individual toast: role="alert" (set by toast.js)
✅ Close button has aria-label="Dismiss notification"
✅ Focus-visible outline on close button
✅ Progress bar is decorative (no ARIA needed)

--------------------------------------------------------------------------------
18.11 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HARDCODED rgba(255,255,255,0.08) in .toast-close:hover
   — should be a token like --glass-bg.
2. HARDCODED animation timing (0.4s in, 0.3s out) — not tokens.
3. NO STACKED LIMIT STYLE — if many toasts stack, no visual "N more" indicator.
4. NO ACTION BUTTON — no "Undo" or "View" button support.
5. NO ICON CUSTOMIZATION — icon is set by toast.js, CSS doesn't allow custom.
6. NO COMPACT/EXPANDED variants.
7. --z-toast FALLBACK — uses var(--z-toast, 1070). Good, but token exists so fallback never fires.

--------------------------------------------------------------------------------
18.12 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use ASLDS.Toast.show({ type, title, message }) — never create HTML manually
✅ Always include a title for accessibility
✅ Let toast.js handle placement, timing, dismissal
✅ Prefer top-right for docs, bottom-right for apps (config)

❌ Never write .toast markup in HTML
❌ Never override toast colors per page — use type variants
❌ Never place .toast-container manually — toast.js manages it

================================================================================
END OF SECTION 18
================================================================================

================================================================================
SECTION 19 — BADGE (COMPLETE)
Source: packages/aslds/css/components/badge.css
Scope:  Global. Status pills, labels, counters.
JS:     None — pure CSS.
================================================================================

19.1 BASE BADGE — .badge
--------------------------------------------------------------------------------
.badge
    display:         inline-flex
    align-items:     center
    justify-content: center
    gap:             6px
    padding:         6px 14px
    border-radius:   999px
    font-size:       12px
    font-weight:     700
    letter-spacing:  .3px
    line-height:     1
    white-space:     nowrap
    user-select:     none
    transition:      var(--transition-normal)
    background:      rgba(212,175,55,.12)      ← gold tint (default)
    color:           var(--primary-gold)
    border:          1px solid rgba(212,175,55,.25)

.badge:hover
    transform: translateY(-1px)

Structure:
    <span class="badge">v1.1 Stable</span>

Rule: Default .badge = gold tint. Matches navbar usage on every page.

--------------------------------------------------------------------------------
19.2 SIZES
--------------------------------------------------------------------------------
.badge-sm → padding: 4px 10px · font-size: 11px
.badge-md → padding: 6px 14px · font-size: 12px  (default)
.badge-lg → padding: 8px 18px · font-size: 14px

Responsive:
    @media (max-width: 768px)
        .badge-lg → padding: 6px 14px · font-size: 13px

--------------------------------------------------------------------------------
19.3 COLOR VARIANTS (tint style — default)
--------------------------------------------------------------------------------
Each uses a 12% tinted background + 25% border + full-color text.

.badge-gold / .badge-primary
    background: rgba(212,175,55,.12)
    color:      var(--primary-gold)
    border:     1px solid rgba(212,175,55,.25)

.badge-success
    background: rgba(34,197,94,.12)
    color:      var(--success)
    border:     1px solid rgba(34,197,94,.25)

.badge-warning
    background: rgba(250,204,21,.12)
    color:      var(--warning)
    border:     1px solid rgba(250,204,21,.25)

.badge-danger
    background: rgba(239,68,68,.12)
    color:      var(--danger)
    border:     1px solid rgba(239,68,68,.25)

.badge-info
    background: rgba(59,130,246,.12)
    color:      var(--info)
    border:     1px solid rgba(59,130,246,.25)

⚠️  RGB VALUES are hardcoded but derived from the token hexes.
    Acceptable trade-off until hex-to-rgb tokens exist.

--------------------------------------------------------------------------------
19.4 SOLID VARIANT — .badge-solid
--------------------------------------------------------------------------------
Adds .badge-solid to any color variant to switch from tint to filled.

.badge-solid.badge-gold / .badge-solid.badge-primary
    background: var(--primary-gold) · color: var(--black) · border: none

.badge-solid.badge-success
    background: var(--success) · color: #fff

.badge-solid.badge-warning
    background: var(--warning) · color: #000

.badge-solid.badge-danger
    background: var(--danger) · color: #fff

.badge-solid.badge-info
    background: var(--info) · color: #fff

Usage:
    <span class="badge badge-success badge-solid">Success</span>

--------------------------------------------------------------------------------
19.5 OUTLINE VARIANT — .badge-outline
--------------------------------------------------------------------------------
Adds .badge-outline to any color variant to switch to border-only.

.badge-outline.badge-gold / .badge-outline.badge-primary
    background: transparent · color: var(--primary-gold) · border-color: var(--primary-gold)

.badge-outline.badge-success
    background: transparent · color: var(--success) · border-color: var(--success)

.badge-outline.badge-warning
    background: transparent · color: var(--warning) · border-color: var(--warning)

.badge-outline.badge-danger
    background: transparent · color: var(--danger) · border-color: var(--danger)

.badge-outline.badge-info
    background: transparent · color: var(--info) · border-color: var(--info)

Usage:
    <span class="badge badge-info badge-outline">Info</span>

--------------------------------------------------------------------------------
19.6 DOT VARIANT — .badge-dot
--------------------------------------------------------------------------------
Minimal 8px circle indicator — no text.

.badge-dot
    width: 8px · height: 8px · padding: 0
    border-radius: 50% · border: none

.badge-dot.badge-gold / .badge-dot.badge-primary → background: var(--primary-gold)
.badge-dot.badge-success                          → background: var(--success)
.badge-dot.badge-warning                          → background: var(--warning)
.badge-dot.badge-danger                           → background: var(--danger)
.badge-dot.badge-info                             → background: var(--info)

Usage:
    <span class="badge badge-dot badge-success" aria-label="Online"></span>

⚠️  Needs aria-label since there's no text content.

--------------------------------------------------------------------------------
19.7 REMOVABLE VARIANT — .badge-close
--------------------------------------------------------------------------------
Adds a small ✕ button inside the badge.

.badge-close
    background: none · border: none · color: inherit
    cursor: pointer · font-size: 14px · line-height: 1
    padding: 0 · opacity: .7 · transition: var(--transition-fast)

.badge-close:hover
    opacity: 1

Usage:
    <span class="badge badge-gold">
        Gold
        <button class="badge-close" aria-label="Remove">×</button>
    </span>

--------------------------------------------------------------------------------
19.8 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                    Purpose
------------------------ -----------------------------------------------
.badge                   Base pill (gold tint by default)
.badge-sm/md/lg          Sizes

Color variants (tint style):
.badge-gold / .badge-primary   Gold (default)
.badge-success                 Green
.badge-warning                 Yellow
.badge-danger                  Red
.badge-info                    Blue

Style variants (add with color):
.badge-solid                   Filled background
.badge-outline                 Border-only
.badge-dot                     8px circle indicator
.badge-close                   Removable ✕ button

--------------------------------------------------------------------------------
19.9 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Badges are non-interactive — no role needed
✅ .badge-dot needs aria-label (no text content)
✅ .badge-close needs aria-label="Remove" or similar
✅ Never rely on color alone — pair with descriptive text

--------------------------------------------------------------------------------
19.10 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HARDCODED RGB VALUES in tint variants — no token for "gold at 12%".
   Recommendation: add tint tokens (--gold-tint, --success-tint, etc.)
   or convert to color-mix() in modern CSS.
2. .badge:hover ALWAYS LIFTS — even non-interactive badges.
   Recommendation: move to opt-in via .badge-interactive.
3. NO ICON-ONLY VARIANT — no way to show just an icon without text.
4. NO COUNT-STYLE VARIANT — no small circular counter (like notification).
   Related pattern exists in navbar.css .notification-count.
5. DUPLICATE CONCEPTS — .notification-count (navbar.css) and .avatar-badge
   (avatar.css) both implement counters separately.

--------------------------------------------------------------------------------
19.11 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .badge as base — pair with ONE color variant + OPTIONAL style variant
✅ Prefer tint style for informational labels
✅ Use .badge-solid for high-emphasis
✅ Use .badge-outline for neutral contexts
✅ Use .badge-dot for status indicators only
✅ Always include descriptive text with semantic colors

❌ Never use .badge for long text — it's designed for 1-3 words
❌ Never rely on color alone for meaning
❌ Never override .badge padding per page — use size variants

================================================================================
END OF SECTION 19
================================================================================




================================================================================
SECTION 20 — ALERT
Source: packages/aslds/css/components/alert.css
Scope:  Global. Inline notification banners (contrast with toast — which is transient).
JS:     None — pure CSS (alert.js may be added later for dismiss).
================================================================================

20.1 BASE ALERT — .alert
--------------------------------------------------------------------------------
.alert
    display:      flex · align-items: flex-start · gap: 16px
    width:        100%
    padding:      18px 20px
    border-radius: var(--radius-lg)      → 18px
    border:       1px solid transparent
    position:     relative
    overflow:     hidden
    transition:   var(--transition-normal)

Structure:
    <div class="alert alert-success">
        <div class="alert-icon"><i class="fa-solid fa-check"></i></div>
        <div class="alert-content">
            <div class="alert-title">Success</div>
            <div class="alert-text">Your changes have been saved.</div>
        </div>
        <button class="alert-close" aria-label="Close">×</button>
    </div>

--------------------------------------------------------------------------------
20.2 ICON — .alert-icon
--------------------------------------------------------------------------------
.alert-icon
    width:           42px · height: 42px
    display:         flex · align-items: center · justify-content: center
    border-radius:   50%
    flex-shrink:     0
    font-size:       18px

--------------------------------------------------------------------------------
20.3 CONTENT — .alert-content
--------------------------------------------------------------------------------
.alert-content  → flex: 1

.alert-title
    font-size:     16px
    font-weight:   700
    margin-bottom: 6px
    color:         var(--white)

.alert-text
    color:       var(--gray-300)
    line-height: 1.7
    font-size:   14px

--------------------------------------------------------------------------------
20.4 CLOSE BUTTON — .alert-close
--------------------------------------------------------------------------------
.alert-close
    background:  none · border: none
    color:       inherit
    cursor:      pointer
    font-size:   18px
    opacity:     .7
    transition:  var(--transition-fast)

.alert-close:hover
    opacity:    1
    transform:  rotate(90deg)

--------------------------------------------------------------------------------
20.5 VARIANTS
--------------------------------------------------------------------------------
.alert-success
    background:    rgba(25,135,84,.12)
    border-color:  rgba(25,135,84,.25)
    .alert-icon    → background: rgba(25,135,84,.18) · color: var(--success)

.alert-warning
    background:    rgba(255,193,7,.12)
    border-color:  rgba(255,193,7,.25)
    .alert-icon    → background: rgba(255,193,7,.18) · color: var(--warning)

.alert-danger
    background:    rgba(220,53,69,.12)
    border-color:  rgba(220,53,69,.25)
    .alert-icon    → background: rgba(220,53,69,.18) · color: var(--danger)

.alert-info
    background:    rgba(13,202,240,.12)
    border-color:  rgba(13,202,240,.25)
    .alert-icon    → background: rgba(13,202,240,.18) · color: var(--info)

.alert-primary
    background:    rgba(212,175,55,.10)
    border-color:  rgba(212,175,55,.25)

⚠️  HARDCODED RGB VALUES — none of these use tokens.
    rgba(25,135,84,.12)   → should be derived from --success
    rgba(255,193,7,.12)   → should be derived from --warning
    rgba(220,53,69,.12)   → should be derived from --danger
    rgba(13,202,240,.12)  → MISMATCH with --info (#3B82F6)
    rgba(212,175,55,.10)  → matches --primary-gold

⚠️  COLOR INCONSISTENCY — .alert-info uses Bootstrap's #0dcaf0 cyan,
    but --info is #3B82F6 (blue). The alert-info icon will be blue while the
    background is cyan.

--------------------------------------------------------------------------------
20.6 QUICK REFERENCE
--------------------------------------------------------------------------------
Class             Purpose
----------------- ------------------------------------
.alert            Base banner (flex row)
.alert-icon       42px circle icon container
.alert-content    Text wrapper
.alert-title      Bold heading
.alert-text       Body text
.alert-close      Dismiss button (rotates on hover)

.alert-success    Green variant
.alert-warning    Yellow variant
.alert-danger     Red variant
.alert-info       Blue variant
.alert-primary    Gold variant

--------------------------------------------------------------------------------
20.7 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ role="alert" for important messages
✅ aria-live="polite" for non-critical
✅ aria-label on close button

--------------------------------------------------------------------------------
20.8 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HARDCODED COLOR VALUES throughout — no token usage.
2. COLOR MISMATCH — .alert-info uses #0dcaf0 (Bootstrap) vs --info (#3B82F6).
3. NO .alert-dismissible WRAPPER — close button just floats.
4. NO ICON AUTO-INSERT — icon must be manually added.
5. NO STACKED MULTIPLE — no gap handling for stacked alerts.
6. NO BORDER-ONLY VARIANT — no outline-only style.
7. NO :focus-visible STYLE on .alert-close.

--------------------------------------------------------------------------------
20.9 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Pair .alert + .alert-{type}
✅ Include .alert-icon, .alert-content, optional .alert-close
✅ Use role="alert" for critical messages

❌ Never use .alert as a page-level banner (use .section > .container)
❌ Never use alert-info expecting a blue — the color is currently cyan

================================================================================
END OF SECTION 20
================================================================================


================================================================================
SECTION 21 — PROGRESS
Source: packages/aslds/css/components/progress.css
Scope:  Global. Progress bars, circles, step indicators.
JS:     None — width set inline or by JS.
================================================================================

21.1 WRAPPER — .progress
--------------------------------------------------------------------------------
.progress
    width:           100%
    display:         flex
    flex-direction:  column
    gap:             10px

--------------------------------------------------------------------------------
21.2 HEADER — .progress-header
--------------------------------------------------------------------------------
.progress-header
    display:         flex
    justify-content: space-between
    align-items:     center

.progress-title
    font-size:   14px
    font-weight: 600
    color:       var(--gray-300)

.progress-value
    font-size:   14px
    font-weight: 700
    color:       var(--primary-gold)

Structure:
    <div class="progress">
        <div class="progress-header">
            <span class="progress-title">Course Progress</span>
            <span class="progress-value">68%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 68%"></div>
        </div>
    </div>

--------------------------------------------------------------------------------
21.3 BAR — .progress-bar / .progress-fill
--------------------------------------------------------------------------------
.progress-bar
    width:         100%
    height:        10px
    background:    rgba(255,255,255,.08)
    border-radius: 999px
    overflow:      hidden
    position:      relative

.progress-fill
    width:         0%          ← set inline via style="width: X%"
    height:        100%
    background:    linear-gradient(90deg, var(--primary-gold), var(--dark-gold))
    border-radius: 999px
    transition:    width .6s ease

Rule: Fill width is set inline (style="width: 68%").

--------------------------------------------------------------------------------
21.4 SIZES
--------------------------------------------------------------------------------
.progress-sm .progress-bar → height: 6px
.progress-md .progress-bar → height: 10px (default)
.progress-lg .progress-bar → height: 16px

Rule: Size class goes on outer .progress wrapper.

--------------------------------------------------------------------------------
21.5 COLOR VARIANTS
--------------------------------------------------------------------------------
.progress-success .progress-fill → background: var(--success)
.progress-warning .progress-fill → background: var(--warning)
.progress-danger  .progress-fill → background: var(--danger)
.progress-info    .progress-fill → background: var(--info)

--------------------------------------------------------------------------------
21.6 STRIPED
--------------------------------------------------------------------------------
.progress-striped .progress-fill
    background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%,
                                       transparent 50%, rgba(255,255,255,.15) 50%,
                                       rgba(255,255,255,.15) 75%, transparent 75%, transparent)
    background-size: 20px 20px

--------------------------------------------------------------------------------
21.7 ANIMATED
--------------------------------------------------------------------------------
.progress-animated .progress-fill
    animation: progressMove 1.2s linear infinite

@keyframes progressMove
    from → background-position: 20px 0
    to   → background-position: 0 0

--------------------------------------------------------------------------------
21.8 CIRCULAR PROGRESS — .progress-circle
--------------------------------------------------------------------------------
.progress-circle
    width:           120px · height: 120px
    border-radius:   50%
    background:      conic-gradient(var(--primary-gold) 68%, rgba(255,255,255,.08) 0)
    display:         flex · align-items: center · justify-content: center

.progress-circle-inner
    width:           90px · height: 90px
    background:      var(--card-bg)
    border-radius:   50%
    display:         flex · align-items: center · justify-content: center
    color:           var(--white)
    font-size:       22px
    font-weight:     700

⚠️  HARDCODED 68% IN CSS — conic-gradient has a fixed percentage.
    Cannot be set inline easily. Would need a CSS custom property:
    background: conic-gradient(var(--primary-gold) var(--progress, 68%), ...)

Structure:
    <div class="progress-circle" style="--progress: 72%">
        <div class="progress-circle-inner">72%</div>
    </div>

--------------------------------------------------------------------------------
21.9 STEP PROGRESS — .progress-steps
--------------------------------------------------------------------------------
.progress-steps
    display:         flex · justify-content: space-between
    align-items:     center
    gap:             12px

.progress-step
    flex:          1
    height:       8px
    border-radius: 999px
    background:   rgba(255,255,255,.08)

.progress-step.active
    background: var(--primary-gold)

--------------------------------------------------------------------------------
21.10 COURSE PROGRESS CARD
--------------------------------------------------------------------------------
.course-progress
    padding:       20px
    background:    var(--card-bg)
    border:        1px solid var(--border-color)
    border-radius: var(--radius-lg)

.course-progress h4
    color:         var(--white)
    margin-bottom: 15px

--------------------------------------------------------------------------------
21.11 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.progress-circle         → 90px × 90px
.progress-circle-inner   → 68px × 68px · font-size: 18px

--------------------------------------------------------------------------------
21.12 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                     Purpose
------------------------- -----------------------------------
.progress                 Wrapper (flex column)
.progress-header          Title + value row
.progress-title           Label
.progress-value           Percentage
.progress-bar             10px track
.progress-fill            Fills from left (width inline)
.progress-sm/md/lg        Sizes
.progress-success/warning/danger/info   Colors
.progress-striped         Diagonal stripes
.progress-animated        Moving stripes
.progress-circle          Circular (conic-gradient)
.progress-circle-inner    Center content
.progress-steps           Multi-step row
.progress-step            Individual step
.progress-step.active     Completed step
.course-progress          Academy card wrapper

--------------------------------------------------------------------------------
21.13 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ role="progressbar" on .progress-bar
✅ aria-valuenow, aria-valuemin, aria-valuemax

--------------------------------------------------------------------------------
21.14 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HARDCODED 68% in .progress-circle — cannot be set per-instance.
2. HARDCODED rgba(255,255,255,.08) for track color.
3. NO INDETERMINATE STATE — no way to show "loading unknown progress".
4. NO LABEL INSIDE BAR — only above it.
5. NO BUFFER STATE — no way to show buffered + loaded.
6. DUPLICATES WITH sidebar.css (.sidebar-progress) and cards.css (.dashboard-card).
7. NO .progress-xs (2px line).

--------------------------------------------------------------------------------
21.15 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .progress > .progress-header + .progress-bar > .progress-fill
✅ Set fill width inline (style="width: 68%")
✅ Size class on outer .progress
✅ Pair with role="progressbar" + aria-valuenow

❌ Never hardcode conic-gradient percentage — use a CSS variable
❌ Never use .sidebar-progress / .dashboard-card for generic progress

================================================================================
END OF SECTION 21
================================================================================


================================================================================
SECTION 22 — AVATAR
Source: packages/aslds/css/components/avatar.css
Scope:  Global. User images, initials, stacks.
JS:     None — pure CSS.
================================================================================

22.1 BASE AVATAR — .avatar
--------------------------------------------------------------------------------
.avatar
    position:        relative
    display:         inline-flex
    align-items:     center
    justify-content: center
    overflow:        hidden
    border-radius:   50%
    flex-shrink:     0
    background:      var(--surface)
    border:          2px solid var(--border-color)
    user-select:     none
    transition:      var(--transition-normal)

.avatar img
    width: 100% · height: 100% · object-fit: cover · display: block

.avatar:hover
    transform: scale(1.05)

Structure:
    <div class="avatar avatar-md">
        <img src="user.jpg" alt="John Doe">
    </div>

    <!-- Or initials -->
    <div class="avatar avatar-md">
        <span class="avatar-initials">JD</span>
    </div>

⚠️  HOVER SCALE AUTOMATIC
    Every avatar scales on hover — even non-interactive ones.
    Recommendation: move hover to opt-in.

--------------------------------------------------------------------------------
22.2 INITIALS — .avatar-initials
--------------------------------------------------------------------------------
.avatar-initials
    font-weight:    700
    color:          var(--white)
    text-transform: uppercase

--------------------------------------------------------------------------------
22.3 SIZES
--------------------------------------------------------------------------------
.avatar-xs → 28px × 28px · font-size 10px
.avatar-sm → 40px × 40px · font-size 13px
.avatar-md → 56px × 56px · font-size 16px
.avatar-lg → 72px × 72px · font-size 20px
.avatar-xl → 100px × 100px · font-size 28px

--------------------------------------------------------------------------------
22.4 BORDER COLOR VARIANTS
--------------------------------------------------------------------------------
.avatar-gold     → border-color: var(--primary-gold)
.avatar-success  → border-color: var(--success)
.avatar-danger   → border-color: var(--danger)
.avatar-white    → border-color: var(--white)

--------------------------------------------------------------------------------
22.5 ONLINE STATUS — .avatar-status
--------------------------------------------------------------------------------
.avatar-status
    position:      absolute
    right:         2px
    bottom:        2px
    width:         14px
    height:        14px
    border-radius: 50%
    border:        2px solid var(--card-bg)

Status colors:
    .status-online   → var(--success)
    .status-away     → var(--warning)
    .status-busy     → var(--danger)
    .status-offline  → var(--gray-500)

Structure:
    <div class="avatar avatar-md">
        <img src="user.jpg" alt="User">
        <span class="avatar-status status-online"></span>
    </div>

⚠️  STATUS BORDER ASSUMES CARD BACKGROUND
    border: 2px solid var(--card-bg) — will look wrong on non-card surfaces.

--------------------------------------------------------------------------------
22.6 VERIFIED BADGE — .avatar-badge
--------------------------------------------------------------------------------
.avatar-badge
    position:        absolute
    right:           -2px
    top:             -2px
    width:           20px
    height:          20px
    border-radius:   50%
    background:      var(--primary-gold)
    color:           #000
    display:         flex · align-items: center · justify-content: center
    font-size:       10px
    font-weight:     700
    border:          2px solid var(--card-bg)

⚠️  HARDCODED #000 — should be var(--black).

--------------------------------------------------------------------------------
22.7 GLOW — .avatar-glow
--------------------------------------------------------------------------------
.avatar-glow
    box-shadow: 0 0 18px rgba(212,175,55,.30)

⚠️  HARDCODED rgba — should be --shadow-gold (which exists at .20 opacity).

--------------------------------------------------------------------------------
22.8 STACKED AVATARS — .avatar-group
--------------------------------------------------------------------------------
.avatar-group
    display:     flex
    align-items: center

.avatar-group .avatar
    margin-left:  -12px
    border:       2px solid var(--card-bg)

.avatar-group .avatar:first-child
    margin-left: 0

.avatar-group .avatar:hover
    z-index: 5

Structure:
    <div class="avatar-group">
        <div class="avatar avatar-sm"><img …></div>
        <div class="avatar avatar-sm"><img …></div>
        <div class="avatar avatar-sm"><img …></div>
    </div>

--------------------------------------------------------------------------------
22.9 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.avatar-xl → 80px × 80px · font-size 22px
.avatar-lg → 60px × 60px · font-size 18px

--------------------------------------------------------------------------------
22.10 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                Purpose
-------------------- ------------------------------
.avatar              Base circle
.avatar img          Image (cover fit)
.avatar-initials     Initials text
.avatar-xs..xl       Sizes
.avatar-gold/success/danger/white   Border colors
.avatar-status       Status dot (bottom-right)
.status-online/away/busy/offline    Status colors
.avatar-badge        Verified badge (top-right)
.avatar-glow         Gold glow
.avatar-group        Stacked avatars

--------------------------------------------------------------------------------
22.11 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ <img> needs alt text
✅ Initials-only avatars need aria-label
✅ Status dot needs aria-label or visible text

--------------------------------------------------------------------------------
22.12 KNOWN ISSUES
--------------------------------------------------------------------------------
1. HOVER SCALE ALWAYS — wrong for non-clickable avatars.
2. HARDCODED #000 in .avatar-badge.
3. HARDCODED rgba(212,175,55,.30) in .avatar-glow.
4. STATUS BORDER ASSUMES --card-bg — no neutral option.
5. NO RECTANGULAR AVATAR variant (rounded-square for apps/tools).
6. NO GROUP OVERFLOW indicator (+N more).
7. DUPLICATES WITH navbar.css (.nav-avatar) and sidebar.css (.sidebar-avatar).

--------------------------------------------------------------------------------
22.13 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .avatar + .avatar-{size}
✅ Provide alt text or aria-label
✅ Use .avatar-group for stacked lists

❌ Never use .nav-avatar / .sidebar-avatar outside their components
❌ Never rely on hover scale for non-interactive avatars

================================================================================
END OF SECTION 22
================================================================================


================================================================================
SECTION 23 — TABLE
Source: packages/aslds/css/components/table.css
Scope:  Global. Data tables.
JS:     None — pure CSS.
================================================================================

23.1 WRAPPER — .table-wrapper
--------------------------------------------------------------------------------
.table-wrapper
    width:         100%
    overflow-x:    auto
    border-radius: var(--radius-lg)
    border:        1px solid var(--border-color)
    background:    var(--card-bg)

Rule: Always wrap tables in .table-wrapper for horizontal scroll + rounded corners.

--------------------------------------------------------------------------------
23.2 BASE TABLE — .table
--------------------------------------------------------------------------------
.table
    width:            100%
    border-collapse:  collapse
    color:            var(--white)

.table th,
.table td
    padding:         18px 20px
    text-align:      left
    vertical-align:  middle

.table thead
    background: rgba(212,175,55,.08)

.table th
    font-size:      14px
    font-weight:    700
    color:          var(--primary-gold)
    white-space:    nowrap

.table tbody tr
    border-top:     1px solid var(--border-color)
    transition:     var(--transition-fast)

.table tbody tr:hover
    background:     rgba(212,175,55,.05)

.table td
    color: var(--gray-300)

Structure:
    <div class="table-wrapper">
        <table class="table">
            <thead>
                <tr><th>Name</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>Buttons</td><td>Ready</td></tr>
            </tbody>
        </table>
    </div>

--------------------------------------------------------------------------------
23.3 ALIGNMENT UTILITIES
--------------------------------------------------------------------------------
.text-center → text-align: center
.text-right  → text-align: right

⚠️  CONFLICT — these duplicate typography.css and utilities.css (identical
    values, so it's safe, but redundant).

--------------------------------------------------------------------------------
23.4 VARIANTS
--------------------------------------------------------------------------------
.table-striped tbody tr:nth-child(even)
    background: rgba(255,255,255,.02)

.table-bordered td,
.table-bordered th
    border: 1px solid var(--border-color)

.table-sm th,
.table-sm td
    padding: 12px 14px

--------------------------------------------------------------------------------
23.5 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.table th, .table td → padding: 14px · font-size: 14px

--------------------------------------------------------------------------------
23.6 QUICK REFERENCE
--------------------------------------------------------------------------------
Class               Purpose
------------------- ------------------------------
.table-wrapper      Rounded scroll container (required)
.table              Base table
.table-striped      Zebra rows
.table-bordered     Full borders
.table-sm           Compact padding

--------------------------------------------------------------------------------
23.7 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Wrap in .table-wrapper for horizontal scroll
✅ Use <th scope="col"> or scope="row"
✅ Add <caption> for screen readers (visually hidden OK)

--------------------------------------------------------------------------------
23.8 KNOWN ISSUES
--------------------------------------------------------------------------------
1. NO STICKY HEADER — long tables lose column context when scrolling.
2. NO SORTABLE COLUMNS — no arrows/indicators.
3. NO SELECTABLE ROWS — no checkbox column styling.
4. NO EMPTY STATE — no design for "no data".
5. NO PAGINATION styling — pagination is out of scope but typically comes with tables.
6. HARDCODED rgba values for header + hover + zebra.
7. NO RESPONSIVE STACKING — on mobile, tables still scroll horizontally.

--------------------------------------------------------------------------------
23.9 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Always wrap in .table-wrapper
✅ Use .table + variant (.table-striped, .table-bordered, .table-sm)
✅ Add <caption> for accessibility

❌ Never style bare <table> without .table class
❌ Never rely on horizontal scroll for mobile — plan stacking

================================================================================
END OF SECTION 23
================================================================================


================================================================================
SECTION 24 — DASHBOARD
Source: packages/aslds/css/components/dashboard.css
Scope:  Global. Full-page dashboard shell.
JS:     None — layout only.
================================================================================

24.1 DASHBOARD SHELL — .dashboard
--------------------------------------------------------------------------------
.dashboard
    display:               grid
    grid-template-columns: 280px 1fr
    min-height:            100vh
    background:            var(--background)

⚠️  DUPLICATES layout.css (.dashboard-layout)
    layout.css   → .dashboard-layout (grid: 280px 1fr)
    dashboard.css → .dashboard (grid: 280px 1fr)
    Two different class names for the same layout. Inconsistency.

--------------------------------------------------------------------------------
24.2 SIDEBAR — .dashboard-sidebar
--------------------------------------------------------------------------------
.dashboard-sidebar
    background:    var(--card-bg)
    border-right:  1px solid var(--border-color)
    padding:       24px

⚠️  DIFFERENT FROM .sidebar (sidebar.css)
    sidebar.css defines .sidebar with sticky, overflow, flex column, etc.
    dashboard.css defines .dashboard-sidebar as just a padded column.
    Two sidebar approaches — pick one and stay consistent.

--------------------------------------------------------------------------------
24.3 CONTENT WRAPPER — .dashboard-content
--------------------------------------------------------------------------------
.dashboard-content
    display:         flex · flex-direction: column
    min-height:      100vh

--------------------------------------------------------------------------------
24.4 HEADER — .dashboard-header
--------------------------------------------------------------------------------
.dashboard-header
    display:         flex · justify-content: space-between · align-items: center
    padding:         24px 32px
    border-bottom:   1px solid var(--border-color)
    background:      rgba(0,0,0,.55)
    backdrop-filter: blur(12px)

⚠️  HARDCODED rgba(0,0,0,.55) — breaks light theme.

--------------------------------------------------------------------------------
24.5 TITLE
--------------------------------------------------------------------------------
.dashboard-title
    font-size:   32px
    font-weight: 800
    color:       var(--white)

.dashboard-subtitle
    margin-top: 8px
    color:      var(--gray-400)

--------------------------------------------------------------------------------
24.6 BODY
--------------------------------------------------------------------------------
.dashboard-body
    padding: 32px
    flex:    1

--------------------------------------------------------------------------------
24.7 STATS GRID
--------------------------------------------------------------------------------
.dashboard-stats
    display:               grid
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))
    gap:                   24px
    margin-bottom:         32px

--------------------------------------------------------------------------------
24.8 MAIN GRID
--------------------------------------------------------------------------------
.dashboard-grid
    display:               grid
    grid-template-columns: 2fr 1fr
    gap:                   24px

Structure: content on left (2fr) + sidebar panels on right (1fr).

--------------------------------------------------------------------------------
24.9 WIDGET — .widget
--------------------------------------------------------------------------------
.widget
    background:    var(--card-bg)
    border:        1px solid var(--border-color)
    border-radius: var(--radius-lg)
    padding:       24px
    transition:    var(--transition-normal)

.widget:hover
    border-color: var(--primary-gold)
    transform:    translateY(-4px)

.widget-title
    font-size:     22px
    font-weight:   700
    margin-bottom: 20px

⚠️  Same hover-lift issue as .card — non-interactive widgets move on hover.

--------------------------------------------------------------------------------
24.10 QUICK ACTIONS
--------------------------------------------------------------------------------
.quick-actions
    display:               grid
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))
    gap:                   20px

.quick-action
    text-align:    center
    padding:       30px 20px
    border-radius: var(--radius-lg)
    background:    var(--surface)
    transition:    .3s
    cursor:        pointer

.quick-action:hover
    background:    rgba(212,175,55,.08)
    border:        1px solid var(--primary-gold)

.quick-action i
    font-size:     34px
    color:         var(--primary-gold)
    margin-bottom: 14px

--------------------------------------------------------------------------------
24.11 ACTIVITY LIST
--------------------------------------------------------------------------------
.activity-list
    display: flex · flex-direction: column · gap: 18px

.activity-item
    display:         flex · justify-content: space-between · align-items: center
    padding:         16px
    border-radius:   var(--radius-md)
    background:      var(--surface)

--------------------------------------------------------------------------------
24.12 RESPONSIVE — max-width: 992px
--------------------------------------------------------------------------------
.dashboard          → 1 column
.dashboard-sidebar  → display: none
.dashboard-grid     → 1 column

--------------------------------------------------------------------------------
24.13 RESPONSIVE — max-width: 768px
--------------------------------------------------------------------------------
.dashboard-header  → flex-direction: column · align-items: flex-start · gap: 20px
.dashboard-body    → padding: 20px

--------------------------------------------------------------------------------
24.14 QUICK REFERENCE
--------------------------------------------------------------------------------
Class                  Purpose
---------------------- ----------------------------------
.dashboard             Grid shell (280px + 1fr)
.dashboard-sidebar     Left column
.dashboard-content     Right column (flex)
.dashboard-header      Top bar
.dashboard-title       Page title (32px)
.dashboard-subtitle    Subtitle
.dashboard-body        Content area (32px padding)
.dashboard-stats       Stat card grid
.dashboard-grid        Main grid (2fr + 1fr)
.widget                Panel card
.widget-title          Panel heading
.quick-actions         Action tile grid
.quick-action          Action tile
.activity-list         Activity list
.activity-item         Activity row

--------------------------------------------------------------------------------
24.15 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ <aside> for .dashboard-sidebar
✅ <main> for .dashboard-content
✅ <header> for .dashboard-header
✅ aria-label on nav regions

--------------------------------------------------------------------------------
24.16 KNOWN ISSUES
--------------------------------------------------------------------------------
1. DUPLICATE OF layout.css (.dashboard-layout)
2. DUPLICATE OF sidebar.css (.sidebar)
3. HARDCODED rgba(0,0,0,.55) breaks light theme
4. HARDCODED rgba(212,175,55,.08) for hover
5. WIDGET HOVER LIFT ALWAYS — non-interactive widgets move
6. .quick-action uses cursor: pointer but has no href/onclick by default
7. NO COLLAPSED SIDEBAR state
8. NO MOBILE DRAWER — sidebar just disappears on mobile
9. NO DASHBOARD SEARCH BAR styling
10. NO BREADCRUMB
11. NO USER MENU / AVATAR styling in header

--------------------------------------------------------------------------------
24.17 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use .dashboard shell only for full-page apps (not doc pages)
✅ Structure: .dashboard > .dashboard-sidebar + .dashboard-content
✅ Use .widget for any panel inside the dashboard
✅ .quick-actions for tile grids

❌ Never mix .dashboard and .dashboard-layout (pick one)
❌ Never mix .dashboard-sidebar and .sidebar (pick one)
❌ Never use .dashboard for docs pages — use .doc-layout from showcase.css

================================================================================
END OF SECTION 24
================================================================================


================================================================================
SECTION 25 — RUNTIME (app.js)
Source: packages/aslds/js/app.js
Scope:  The core runtime. Loads first, orchestrates everything else.
Role:   Provides namespace, module registry, event bus, storage, utilities,
        lifecycle. Contains ZERO component logic.
================================================================================

25.1 PURPOSE
--------------------------------------------------------------------------------
The runtime is the single orchestrator. Every other JS module registers itself
with the runtime. The runtime handles:
    • Namespace (window.ASLDS)
    • Module registry (register / get / has / unregister)
    • Lifecycle (init → boot → destroy → reset)
    • Event bus (on / off / emit)
    • DOM utilities (select / selectAll / exists / delegate)
    • Element cache (cacheElement / getCachedElement / clearCache)
    • Event helpers (on / offAll)
    • Accessibility helpers (setExpanded / setHidden / focus)
    • Storage (get / set / remove / clear)
    • Errors (report / warn)
    • Performance (mark / measure / now)
    • Configuration (configure)
    • DOM observer (MutationObserver → emits "runtime:dom-change")

Rule: Never add component-specific logic to app.js.

--------------------------------------------------------------------------------
25.2 NAMESPACE EXPORTS
--------------------------------------------------------------------------------
ASLDS.name          → "ASL Design System"
ASLDS.shortName     → "ASLDS"
ASLDS.version       → "1.1.0"
ASLDS.release       → "Stable"
ASLDS.author        → "A Square L Innovate"
ASLDS.initialized   → boolean

--------------------------------------------------------------------------------
25.3 CONFIGURATION
--------------------------------------------------------------------------------
ASLDS.config
    debug              → false      (verbose logging in console)
    autoInitialize     → true       (auto-init on window load)
    enableAccessibility→ true
    enableAnimations   → true
    enableLogging      → true
    observeDOM         → true       (MutationObserver on body)

ASLDS.configure({ debug: true })    → merges options into config

--------------------------------------------------------------------------------
25.4 STATE
--------------------------------------------------------------------------------
ASLDS.state
    booting     → true during init sequence
    initialized → true after init() completes
    ready       → true after boot() completes
    destroyed   → true after destroy()

--------------------------------------------------------------------------------
25.5 CONSTANTS / EVENTS
--------------------------------------------------------------------------------
ASLDS.constants
    VERSION    → ASLDS.version
    RELEASE    → ASLDS.release
    EVENTS     → frozen object:
        BEFORE_INIT       → "runtime:before-init"
        AFTER_INIT        → "runtime:after-init"
        REFRESH           → "runtime:refresh"
        DESTROY           → "runtime:destroy"
        MODULE_REGISTERED → "module:registered"
        MODULE_DESTROYED  → "module:destroyed"

Runtime also emits: "runtime:ready", "runtime:dom-change"

--------------------------------------------------------------------------------
25.6 LOGGER
--------------------------------------------------------------------------------
ASLDS.logger.log(...)      → only if enableLogging
ASLDS.logger.info(...)     → only if enableLogging + debug
ASLDS.logger.warn(...)     → always
ASLDS.logger.error(...)    → always

All prefixed with "[ASLDS]".

--------------------------------------------------------------------------------
25.7 MODULE REGISTRY
--------------------------------------------------------------------------------
ASLDS.register(name, module, priority = 100, dependencies = [])
    Registers a module. Module MUST be an object.
    Priority: lower runs first.
    Dependencies: array of module names that must exist.

ASLDS.unregister(name)     → removes a module
ASLDS.getModule(name)      → returns module or null
ASLDS.hasModule(name)      → boolean
ASLDS.getModules()         → array of registered module names

Standard priorities:
    10   Theme
    50   Animations
    55   Search
    60   Playground
    70   Toast
    75   Dropdown
    80   Tabs
    85   Modal
    90   Sidebar
    100  Navbar

--------------------------------------------------------------------------------
25.8 LIFECYCLE
--------------------------------------------------------------------------------
ASLDS.init()          → emits BEFORE_INIT · boot() · startObserver()
                        sets initialized + state.initialized
                        emits AFTER_INIT

ASLDS.boot()          → iterates modules sorted by priority
                        calls each module.init() (if defined)
                        catches + reports per-module errors
                        emits "runtime:ready"

ASLDS.refresh()       → re-runs boot() · emits REFRESH

ASLDS.destroy()       → destroyModules() · disconnects observer · offAll events
                        clears caches, listeners, plugins, services, deps
                        emits DESTROY · sets state.destroyed

ASLDS.reset()         → destroy() then init()

Auto-init: window "load" event → ASLDS.init() if config.autoInitialize

--------------------------------------------------------------------------------
25.9 EVENT BUS
--------------------------------------------------------------------------------
ASLDS.events.on(event, callback)
ASLDS.events.off(event, callback)
ASLDS.events.emit(event, payload = {})

Rule: All events pass through try/catch — a failing listener won't break others.

Standard events to listen for:
    theme:ready              → { mode, effective, system }
    theme:mode-changed       → { mode, effective }
    theme:effective-changed  → { mode, effective, system }

    asl:sidebar:open         → { sidebar }
    asl:sidebar:close        → { sidebar }
    asl:sidebar:init         → { sidebar }
    asl:sidebar:destroy      → (no payload)

    asl:modal:open           → { modal }
    asl:modal:close          → { modal }
    asl:modal:init           → { modal }

    asl:dropdown:open        → { container, toggle }
    asl:dropdown:close       → { container, toggle }

    asl:tabs:activate        → { container, button, index, panel }
    asl:toast:show           → { toast, data, options }
    asl:toast:dismiss        → { toast, data }
    asl:toast:clear          → (no payload)

    asl:search:open          → (no payload)
    asl:search:close         → (no payload)

    asl:animations:triggered → { element, id }

    runtime:ready            → (no payload)
    runtime:refresh          → (no payload)
    runtime:destroy          → (no payload)
    runtime:dom-change       → (no payload)

--------------------------------------------------------------------------------
25.10 DOM UTILITIES
--------------------------------------------------------------------------------
ASLDS.utils.select(selector, scope = document)     → Element or null
ASLDS.utils.selectAll(selector, scope = document)  → Array of Elements
ASLDS.utils.exists(selector, scope = document)     → boolean

--------------------------------------------------------------------------------
25.11 EVENT HELPERS
--------------------------------------------------------------------------------
ASLDS.utils.on(element, event, callback, options = false)
    Adds listener + tracks it in cache.listeners for later cleanup.

ASLDS.utils.offAll()
    Removes ALL tracked listeners. Called during destroy().

ASLDS.utils.delegate(parent, event, selector, handler)
    Delegated listener. handler.call(target, event, target).
    Called with `this` = matched element, plus (event, target).

--------------------------------------------------------------------------------
25.12 ELEMENT CACHE
--------------------------------------------------------------------------------
ASLDS.utils.cacheElement(key, element)
ASLDS.utils.getCachedElement(key)
ASLDS.utils.clearCache()

Backed by ASLDS.cache.elements (Map).

--------------------------------------------------------------------------------
25.13 ACCESSIBILITY HELPERS
--------------------------------------------------------------------------------
ASLDS.accessibility.setExpanded(element, expanded)
    Sets aria-expanded.

ASLDS.accessibility.setHidden(element, hidden)
    Sets aria-hidden.

ASLDS.accessibility.focus(element)
    Calls element.focus() if element exists.

--------------------------------------------------------------------------------
25.14 STORAGE
--------------------------------------------------------------------------------
ASLDS.storage.get(key)      → parsed JSON value or null
ASLDS.storage.set(key, val) → stringified JSON
ASLDS.storage.remove(key)
ASLDS.storage.clear()       → removes all keys starting with prefix

Prefix: "ASLDS::"
    e.g. ASLDS.storage.set("theme-mode", "dark")
    → stores at localStorage["ASLDS::theme-mode"]

--------------------------------------------------------------------------------
25.15 ERRORS
--------------------------------------------------------------------------------
ASLDS.errors.report(error, context = "")   → logs error with context
ASLDS.errors.warn(message)                 → logs warning

--------------------------------------------------------------------------------
25.16 PERFORMANCE
--------------------------------------------------------------------------------
ASLDS.performance.mark(name)
ASLDS.performance.measure(name, start, end)
ASLDS.performance.now()

Wraps the native Performance API.

--------------------------------------------------------------------------------
25.17 SELECTORS (SHARED)
--------------------------------------------------------------------------------
ASLDS.selectors  → frozen object with default class hooks:
    navbar     → ".navbar"
    sidebar    → ".sidebar"
    dropdown   → ".dropdown"
    modal      → ".modal"
    tabs       → ".tabs"
    toast      → ".toast"
    tooltip    → ".tooltip"
    accordion  → ".accordion"
    button     → ".btn"

--------------------------------------------------------------------------------
25.18 OBSERVER
--------------------------------------------------------------------------------
ASLDS.startObserver()    → starts MutationObserver on body
                            emits "runtime:dom-change" on any change
ASLDS.observer           → the MutationObserver instance (or null)

Rule: Do NOT create additional MutationObservers in modules unless truly needed.

--------------------------------------------------------------------------------
25.19 INFO / STATUS / VERSION
--------------------------------------------------------------------------------
ASLDS.info()       → full runtime info (framework, version, modules, services, plugins)
ASLDS.status()     → state flags + module list + config
ASLDS.getVersion() → { framework, version, release }

--------------------------------------------------------------------------------
25.20 PAGE USAGE — WHAT A PAGE MUST DO
--------------------------------------------------------------------------------
In <head>: nothing special.

In <body> at the end, scripts in this order:
    <script src="app.js"></script>       ← runtime first
    ...all component modules...

The runtime handles the rest. Pages do NOT need to:
    ❌ call ASLDS.init() manually (it auto-inits on load)
    ❌ call any module's .init() manually (register does it)
    ❌ wire up event listeners manually (modules self-wire)
    ❌ set up MutationObservers (runtime does it)

Pages CAN:
    ✅ call ASLDS.refresh() after dynamic content changes (optional)
    ✅ listen to any "asl:*" or "theme:*" event for cross-module logic
    ✅ use ASLDS.utils.* and ASLDS.storage.* for helpers

--------------------------------------------------------------------------------
25.21 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Runtime loads FIRST — always.
✅ Every component calls ASLDS.register() once.
✅ Every component exposes init() and destroy().
✅ Every component destroys what it creates.
✅ All events emit through ASLDS.events.

❌ Never touch window.ASLDS directly to add methods (use register).
❌ Never use console.log for diagnostics — use ASLDS.logger.
❌ Never manually init components from a page.
❌ Never add component logic to app.js.

================================================================================
END OF SECTION 25
================================================================================


================================================================================
SECTION 26 — THEME MODULE
Source: packages/aslds/js/theme.js
Version: 2.0.0
Scope:  Global. Handles auto/light/dark modes.
Priority: 10 (loads first — everything else can depend on theme).
================================================================================

26.1 PURPOSE
--------------------------------------------------------------------------------
Provides:
    • Three modes: auto · light · dark
    • Auto follows OS via prefers-color-scheme
    • Persistent storage of user choice
    • Live OS change watching (only in auto)
    • Smooth transitions (prevents FOUC)
    • Toggle button label cycling
    • Public API for programmatic control

Applies to: <html data-theme="dark" data-theme-mode="auto">

--------------------------------------------------------------------------------
26.2 CONFIGURATION (frozen — cannot be changed at runtime)
--------------------------------------------------------------------------------
ASLDS.Theme.config
    storageKey       → "theme-mode"
    attribute        → "data-theme"
    modeAttribute    → "data-theme-mode"
    transitionClass  → "theme-transitioning"
    defaultMode      → "auto"
    debounceDelay    → 100 (ms)

--------------------------------------------------------------------------------
26.3 MODES
--------------------------------------------------------------------------------
ASLDS.Theme.modes   → ["auto", "light", "dark"]
ASLDS.Theme.labels
    auto  → "🌓 Auto"
    light → "☀️ Light"
    dark  → "🌙 Dark"

--------------------------------------------------------------------------------
26.4 STATE
--------------------------------------------------------------------------------
ASLDS.Theme.state
    initialized   → boolean
    mode          → "auto" | "light" | "dark"    (user preference)
    effective     → "light" | "dark"             (what's applied)
    system        → "light" | "dark"             (OS preference)
    mediaQuery    → MediaQueryList or null
    mediaListener → function or null

--------------------------------------------------------------------------------
26.5 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Theme.setMode(mode, instant)
    mode:    "auto" | "light" | "dark"
    instant: skip transition if true
    returns: boolean success
    emits:   theme:mode-changed { mode, effective }
             theme:effective-changed { mode, effective, system }

ASLDS.Theme.toggle(instant)
    cycles: auto → light → dark → auto
    calls setMode(next, instant)

ASLDS.Theme.getMode()
    returns user's mode ("auto" | "light" | "dark")

ASLDS.Theme.getEffectiveTheme()
    returns applied theme ("light" | "dark")

ASLDS.Theme.getSystemTheme()
    returns OS theme ("light" | "dark")

ASLDS.Theme.isDark()   → boolean (effective === "dark")
ASLDS.Theme.isLight()  → boolean (effective === "light")
ASLDS.Theme.isAuto()   → boolean (mode === "auto")

ASLDS.Theme.refresh()
    re-applies current effective theme (no mode change)

ASLDS.Theme.reset()
    clears storage → resets to "auto"

ASLDS.Theme.info()
    returns { module, version, mode, effective, system, initialized, availableModes }

ASLDS.Theme.init()
    normally called automatically by runtime.

ASLDS.Theme.destroy()
    unwatches system, clears state.

--------------------------------------------------------------------------------
26.6 AUTO MODE BEHAVIOR
--------------------------------------------------------------------------------
When mode === "auto":
    • effective mirrors OS preference
    • watchSystemTheme() is active
    • OS change → re-applies after 100ms debounce

When mode === "light" or "dark":
    • effective is forced
    • watchSystemTheme() is disabled (no listeners)

--------------------------------------------------------------------------------
26.7 TOGGLE BUTTONS
--------------------------------------------------------------------------------
Any element with [data-theme-toggle] gets:

    1. Click handler (via delegated events — no page wiring needed).
       Click → ASLDS.Theme.toggle(false)

    2. Label updates automatically:
        mode=auto  → "🌓 Auto"
        mode=light → "☀️ Light"
        mode=dark  → "🌙 Dark"

Structure — just add the attribute:
    <button class="btn btn-outline" data-theme-toggle>Theme</button>

Rule: Do NOT add click handlers to toggle buttons — the module handles it.
Rule: Do NOT set label text in HTML — the module writes it.

--------------------------------------------------------------------------------
26.8 ATTRIBUTES ON <html>
--------------------------------------------------------------------------------
<html data-theme="dark" data-theme-mode="auto">

    data-theme         → "light" | "dark"  (used by variables.css)
    data-theme-mode    → "auto" | "light" | "dark"  (optional, for styling mode UI)

Rule: Never set these manually. theme.js manages them.

--------------------------------------------------------------------------------
26.9 FLASH PREVENTION
--------------------------------------------------------------------------------
On init:
    • root gets .theme-transitioning class  → disables transitions
    • attribute applied
    • next animation frame → class removed   → transitions re-enable

The class is defined in variables.css:
    :root.theme-transitioning * { transition: none !important; }

Rule: Never remove .theme-transitioning manually.

--------------------------------------------------------------------------------
26.10 STORAGE FORMAT
--------------------------------------------------------------------------------
Stored via ASLDS.storage:
    key   → "theme-mode"
    value → "auto" | "light" | "dark"

Backward compatibility: "light"/"dark" (from v1) are accepted as forced modes.

--------------------------------------------------------------------------------
26.11 EVENTS EMITTED
--------------------------------------------------------------------------------
theme:ready              → { mode, effective, system }
theme:mode-changed       → { mode, effective }
theme:effective-changed  → { mode, effective, system }

Rule: To react to theme changes in page logic, listen to these events.
      Do NOT read window.getComputedStyle or the data-theme attribute directly.

Example:
    document.addEventListener("theme:mode-changed", function (e) {
        console.log("Now in", e.detail.mode, "mode");
    });

--------------------------------------------------------------------------------
26.12 PAGE USAGE
--------------------------------------------------------------------------------
On any page that uses ASLDS:

    ✅ Add data-theme-toggle to any button you want to cycle themes
    ✅ Reference tokens (var(--background), var(--white), etc.) — they flip automatically
    ✅ Listen to theme:* events if you need to react

    ❌ Do NOT set data-theme manually
    ❌ Do NOT add your own theme JS
    ❌ Do NOT hardcode light/dark colors in page CSS
    ❌ Do NOT use :root[data-theme="dark"] selectors in page CSS — use tokens

--------------------------------------------------------------------------------
26.13 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Themes work automatically. Add data-theme-toggle and be done.
✅ Always use tokens — never hex values, never light/dark checks.
✅ Trust the CSS variables to resolve.
✅ Listen to theme:mode-changed if you need JS-level awareness.

❌ Never override the theme system with page-level JS.
❌ Never mix --transition-* and --animation-* tokens for theme changes.
❌ Never assume the theme is dark or light — always read from CSS variables.

================================================================================
END OF SECTION 26
================================================================================

================================================================================
SECTION 27 — NAVBAR MODULE (navbar.js)
Source: packages/aslds/js/navbar.js
Version: 1.0.0
Scope:  Mobile navigation toggle, aria state, and menu close behaviors.
Priority: 100 (loads last — after all other modules).
Pattern: IIFE + ASLDS.register() — matches every other ASLDS module.
================================================================================

27.1 PURPOSE
--------------------------------------------------------------------------------
Controls the responsive mobile navigation:
    • Toggle .nav-menu.open via .mobile-toggle
    • Update aria-expanded + aria-hidden
    • Close menu on link click, escape, outside click, or desktop resize
    • Restore focus to toggle when menu closes via escape
    • Public API for programmatic control
    • Emits lifecycle + open/close events

Applied to: <header class="navbar"> in every ASLDS page.

--------------------------------------------------------------------------------
27.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    navbarSelector:        '.navbar',
    toggleSelector:        '.mobile-toggle',
    menuSelector:          '.nav-menu',
    linkSelector:          '.nav-link',
    openClass:             'open',
    resizeBreakpoint:      992,
    closeOnOutsideClick:   true,
    closeOnEscape:         true,
    closeOnResize:         true,
    closeOnLinkClick:      true,
    restoreFocusOnClose:   true
}

Override any of these by passing an object to ASLDS.Navbar.init(config).

--------------------------------------------------------------------------------
27.3 REQUIRED HTML CONTRACT
--------------------------------------------------------------------------------
navbar.js depends on this structure:

    <header class="navbar">
        <div class="navbar-container">
            <button class="mobile-toggle" aria-expanded="false">…</button>
            <nav>
                <ul class="nav-menu">
                    <li><a class="nav-link" href="…">Home</a></li>
                    <li><a class="nav-link" href="…">About</a></li>
                </ul>
            </nav>
        </div>
    </header>

Required:
    • .mobile-toggle  — button with aria-expanded
    • .nav-menu       — the wrapper element
    • .nav-link       — each nav anchor

The script silently returns if .mobile-toggle or .nav-menu is missing.

Required CSS (from navbar.css — Section 12.12):
    @media (max-width: 992px) {
        .mobile-toggle { display: flex; }
        .nav-menu      { display: none; }
        .nav-menu.open { display: flex; }
    }

--------------------------------------------------------------------------------
27.4 BEHAVIOR — OPEN / CLOSE
--------------------------------------------------------------------------------
Opening:
    • Menu gets .open class
    • aria-expanded="true" on toggle
    • aria-hidden="false" on menu (mobile only)
    • Emits "asl:navbar:open"

Closing:
    • .open class removed
    • aria-expanded="false" on toggle
    • aria-hidden="true" on menu (mobile only)
    • Optionally restores focus to toggle
    • Emits "asl:navbar:close"

Sync on init:
    • If .nav-menu already has .open in HTML, state syncs as open.
    • Otherwise state starts as closed.

--------------------------------------------------------------------------------
27.5 CLOSE TRIGGERS
--------------------------------------------------------------------------------
Four independent ways the menu closes:

1. Link click
   Any .nav-link click → closeMenu (no focus restore — user is navigating)

2. Escape key
   document keydown → if Escape and menu open → closeMenu + restoreFocus

3. Outside click
   document click → if target is outside .navbar → closeMenu (no focus restore)

4. Viewport resize
   window resize → if innerWidth > 992 → closeMenu (no focus restore)

Each trigger is independently toggleable via config flags (see 27.2).

--------------------------------------------------------------------------------
27.6 ARIA BEHAVIOR
--------------------------------------------------------------------------------
aria-expanded on .mobile-toggle:
    Managed on every open/close. Ensures "true" / "false" always accurate.

aria-hidden on .nav-menu:
    Only applied when window width ≤ resizeBreakpoint (992px).
    Removed entirely at desktop widths so screen readers see the menu normally.

Initial aria-expanded:
    If toggle has no aria-expanded in HTML, script sets it to "false" during init.

--------------------------------------------------------------------------------
27.7 FOCUS MANAGEMENT
--------------------------------------------------------------------------------
Focus restore triggers only when:
    • Menu closes via Escape
    • AND restoreFocusOnClose === true

Not restored on:
    • Link click (user is navigating)
    • Outside click (user clicked elsewhere intentionally)
    • Resize (viewing change, not user dismissal)

--------------------------------------------------------------------------------
27.8 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Navbar.init(config)              → wire up (called automatically by runtime)
ASLDS.Navbar.destroy()                 → remove all listeners, clear state

ASLDS.Navbar.open()                    → open menu programmatically
ASLDS.Navbar.close(shouldRestoreFocus) → close menu (optionally restore focus)
ASLDS.Navbar.toggle()                  → cycle open/close

ASLDS.Navbar.isOpen()                  → boolean
ASLDS.Navbar.getState()                → { isOpen, initialized }
ASLDS.Navbar.getToggle()               → toggle element
ASLDS.Navbar.getMenu()                 → menu element

ASLDS.Navbar.updateConfig(config)      → change closeOnOutsideClick / closeOnEscape
                                          at runtime

--------------------------------------------------------------------------------
27.9 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:navbar:init     → { menu, toggle }        fires after init completes
asl:navbar:open     → { menu, toggle }        fires when menu opens
asl:navbar:close    → { menu, toggle }        fires when menu closes
asl:navbar:destroy  → (no payload)             fires after destroy

Listening from page JS:
    document.addEventListener("asl:navbar:open", function (e) {
        console.log("Menu opened", e.detail.menu);
    });

Rule: Prefer these events over polling ASLDS.Navbar.getState().

--------------------------------------------------------------------------------
27.10 PAGE USAGE — WHAT A PAGE MUST DO
--------------------------------------------------------------------------------
Include navbar.js after app.js:

    <script src="../../packages/aslds/js/app.js"></script>
    <script src="../../packages/aslds/js/navbar.js"></script>
    <script src="../../packages/aslds/js/theme.js"></script>
    …

That is all. The runtime will:
    • Register the module
    • Auto-call init() during boot
    • Auto-call destroy() on runtime destroy

Pages do NOT need to:
    ❌ add mobile-toggle click handlers
    ❌ manage aria-expanded
    ❌ add Escape handlers
    ❌ add outside-click handlers
    ❌ add resize handlers

Pages CAN:
    ✅ Add data-* attributes to extend styling (e.g., .navbar.scrolled if added later)
    ✅ Listen to asl:navbar:* events
    ✅ Call ASLDS.Navbar.open() / .close() programmatically

--------------------------------------------------------------------------------
27.11 WHAT NAVBAR.JS DOES *NOT* HANDLE
--------------------------------------------------------------------------------
Explicitly out of scope — pages must not assume these exist:

    ❌ .navbar.scrolled on scroll       → requires CSS + JS, not implemented
    ❌ Hamburger-to-X animation         → requires CSS transform rules
    ❌ Focus trap inside menu           → menu is a dropdown, not a modal
    ❌ Body scroll lock                 → not needed for a dropdown
    ❌ Search toggle                    → handled by search.js (Section 33)
    ❌ Theme toggle                     → handled by theme.js (Section 26)
    ❌ Notification dropdown            → handled by dropdown.js (Section 30)

If a future page needs .navbar.scrolled:
    1. Add CSS to navbar.css (e.g., .navbar.scrolled { background: … })
    2. Extend navbar.js with a debounced scroll handler
    Do NOT add scroll logic to individual pages.

--------------------------------------------------------------------------------
27.12 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include navbar.js after app.js on every page with a navbar.
✅ Use exact class names: .mobile-toggle, .nav-menu, .nav-link.
✅ Keep aria-expanded="false" on the toggle in HTML (script updates it).
✅ Let the runtime auto-initialize — no page wiring.

❌ Never add duplicate mobile-toggle handlers in page JS.
❌ Never call navbar behavior from another script (use the public API).
❌ Never rely on .navbar.scrolled — not implemented in this module.
❌ Never manage aria-expanded manually from page JS.

================================================================================
END OF SECTION 27
================================================================================


================================================================================
SECTION 28 — SIDEBAR MODULE (sidebar.js)
Source: packages/aslds/js/sidebar.js
Version: 1.0.0
Scope:  Application sidebar (dashboards, admin, academy).
Priority: 90 (loads after Modal, before Navbar).
================================================================================

28.1 PURPOSE
--------------------------------------------------------------------------------
Controls the responsive application sidebar:
    • Toggle .sidebar.open on mobile
    • aria-expanded on toggle, aria-hidden on sidebar
    • Close on link click (auto), outside click, escape, or desktop resize
    • Auto-highlight the current page's sidebar link
    • Public API + lifecycle + events
    • Runtime registered

Applied to: <aside class="sidebar"> in dashboard/admin/academy pages.

--------------------------------------------------------------------------------
28.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    sidebarSelector:        '.sidebar',
    toggleSelector:         '.mobile-toggle',
    openClass:              'open',
    closeOnOutsideClick:    true,
    closeOnEscape:          true,
    closeOnResize:          true,
    resizeBreakpoint:       992,
    ariaExpandedAttribute:  'aria-expanded',
    ariaControlsAttribute:  'aria-controls',
    activeStateAttribute:   'aria-current',
    activeLinkClass:        'active',
    linkSelector:           '.sidebar-link',
    focusOnOpen:            false,
    trapFocus:              false
}

--------------------------------------------------------------------------------
28.3 REQUIRED HTML CONTRACT
--------------------------------------------------------------------------------
    <aside class="sidebar">
        <nav class="sidebar-nav">
            <ul class="sidebar-menu">
                <li class="sidebar-item">
                    <a href="/dashboard" class="sidebar-link active">
                        <i class="fa-solid fa-home"></i> Dashboard
                    </a>
                </li>
            </ul>
        </nav>
    </aside>

    <button class="mobile-toggle" aria-expanded="false">☰</button>

Required:
    • .sidebar          — the aside wrapper
    • .sidebar-link     — each nav anchor (for active highlighting)
    • .mobile-toggle    — the open/close trigger
    • data-sidebar-toggle (fallback if .mobile-toggle not found)

--------------------------------------------------------------------------------
28.4 BEHAVIOR
--------------------------------------------------------------------------------
Toggle:          click .mobile-toggle → .sidebar.open
Auto-highlight:  current URL matched against each .sidebar-link's href
                 → adds .active + aria-current="page"
Close triggers:  outside click · Escape · resize > 992 · clicking a link

--------------------------------------------------------------------------------
28.5 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Sidebar.init(config)              → wire up (auto by runtime)
ASLDS.Sidebar.destroy()                 → remove listeners, reset state

ASLDS.Sidebar.open()                    → open sidebar
ASLDS.Sidebar.close()                   → close sidebar
ASLDS.Sidebar.toggle()                  → cycle

ASLDS.Sidebar.getState()                → { isOpen, initialized }
ASLDS.Sidebar.getElement()              → sidebar element
ASLDS.Sidebar.getToggle()               → toggle element

ASLDS.Sidebar.updateConfig(config)      → change closeOnOutsideClick at runtime

--------------------------------------------------------------------------------
28.6 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:sidebar:init     → { sidebar }
asl:sidebar:open     → { sidebar }
asl:sidebar:close    → { sidebar }
asl:sidebar:destroy  → (no payload)

--------------------------------------------------------------------------------
28.7 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ aria-expanded on toggle — updated automatically
✅ aria-hidden on sidebar — updated automatically
✅ aria-current="page" set on active link
✅ Optional: trapFocus config for modal-style sidebar
✅ Optional: focusOnOpen config to auto-focus first element
❌ Never manage aria-expanded from page JS

--------------------------------------------------------------------------------
28.8 KNOWN ISSUES
--------------------------------------------------------------------------------
1. Default focusOnOpen = false, trapFocus = false — need opt-in for full a11y
2. Auto-active link detection uses substring match — can be fragile with similar URLs
3. Only supports one sidebar per page (uses first .sidebar found)
4. Close on link click is not configurable — always closes

--------------------------------------------------------------------------------
28.9 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include sidebar.js on any page with .sidebar
✅ Use exact class names (.sidebar, .sidebar-link, .mobile-toggle)
✅ Let runtime auto-initialize — no page wiring

❌ Never manage sidebar state from page JS — use ASLDS.Sidebar API
❌ Never duplicate the toggle handler

================================================================================
END OF SECTION 28
================================================================================


================================================================================
SECTION 29 — MODAL MODULE (modal.js)
Source: packages/aslds/js/modal.js
Version: 1.0.0
Scope:  Single dialog control.
Priority: 85 (loads after Tabs, before Sidebar).
================================================================================

29.1 PURPOSE
--------------------------------------------------------------------------------
Controls a single modal dialog:
    • Open/close via public API
    • Focus trapping inside dialog
    • Body scroll lock (with scrollbar compensation)
    • Escape to close, outside-click to close
    • aria-modal + role="dialog" applied
    • Focus restore to trigger element
    • Public API + lifecycle + events

Applied to: single <div class="modal"> on a page.

--------------------------------------------------------------------------------
29.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    modalSelector:          '.modal',
    dialogSelector:         '.modal-dialog',
    openClass:              'is-open',
    closeButtonSelector:    '.modal-close',
    closeOnOutsideClick:    true,
    closeOnEscape:          true,
    focusOnOpen:            true,
    trapFocus:              true,
    lockScroll:             true
}

--------------------------------------------------------------------------------
29.3 REQUIRED HTML CONTRACT
--------------------------------------------------------------------------------
    <div class="modal" id="myModal">
        <div class="modal-dialog">
            <div class="modal-header">
                <h3 class="modal-title">Title</h3>
                <button class="modal-close" aria-label="Close">×</button>
            </div>
            <div class="modal-body">…</div>
            <div class="modal-footer">…</div>
        </div>
    </div>

Structure classes required:
    .modal          — outer backdrop
    .modal-dialog   — inner dialog (focus target)
    .modal-close    — close button

--------------------------------------------------------------------------------
29.4 BEHAVIOR
--------------------------------------------------------------------------------
Open:      adds .is-open to .modal · sets aria-modal="true" · role="dialog"
           · locks body scroll (compensates for scrollbar width)
           · focuses first focusable element in dialog
Close:     removes .is-open · unlocks scroll · restores focus to previous element

Close triggers:
    • Click on .modal-close
    • Click outside .modal-dialog (on the backdrop)
    • Escape key

--------------------------------------------------------------------------------
29.5 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Modal.init(config)                → wire up
ASLDS.Modal.destroy()                   → cleanup

ASLDS.Modal.open()                      → open
ASLDS.Modal.close()                     → close
ASLDS.Modal.toggle()                    → cycle

ASLDS.Modal.getState()                  → { isOpen, initialized }
ASLDS.Modal.getElement()                → modal element
ASLDS.Modal.getDialog()                 → dialog element

ASLDS.Modal.updateConfig(config)        → change closeOnOutsideClick / closeOnEscape

--------------------------------------------------------------------------------
29.6 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:modal:init     → { modal }
asl:modal:open     → { modal }
asl:modal:close    → { modal }
asl:modal:destroy  → (no payload)

--------------------------------------------------------------------------------
29.7 SCROLL LOCK DETAIL
--------------------------------------------------------------------------------
On open:
    • Computes scrollbar width via a temp element
    • Applies body padding-right = original + scrollbar width
    • Adds .asl-modal-open class to <body>

On close:
    • Restores body padding-right
    • Removes .asl-modal-open

Rule: Never manually add overflow:hidden to body when a modal is open.

--------------------------------------------------------------------------------
29.8 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ aria-modal="true" on dialog
✅ role="dialog" on dialog
✅ aria-hidden on outer modal (true when closed)
✅ Focus trap active by default
✅ Focus restore to previous element
✅ Escape closes

⚠️  aria-labelledby not set — recommended addition:
    Set modal-dialog aria-labelledby to modal-title's ID for full screen reader support.

--------------------------------------------------------------------------------
29.9 KNOWN ISSUES
--------------------------------------------------------------------------------
1. Only supports ONE modal per page (uses first .modal found)
2. No support for stacked/nested modals
3. aria-labelledby not applied — modal title not announced by screen readers
4. Focus trap assumes Tab/Shift+Tab only — no F6 or arrow handling
5. modal.js does not auto-open from data-modal-target attributes — pages must call ASLDS.Modal.open()

--------------------------------------------------------------------------------
29.10 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include modal.js on any page with a .modal
✅ Add role="dialog" aria-modal="true" in HTML (script also sets it)
✅ Always include .modal-close with aria-label
✅ Let modal.js handle scroll lock, focus trap, escape

❌ Never open a modal without a way to close it
❌ Never stack modals
❌ Never call body overflow toggle manually

================================================================================
END OF SECTION 29
================================================================================


================================================================================
SECTION 30 — DROPDOWN MODULE (dropdown.js)
Source: packages/aslds/js/dropdown.js
Version: 1.0.0
Scope:  Multiple independent dropdowns per page.
Priority: 75 (loads after Tabs).
================================================================================

30.1 PURPOSE
--------------------------------------------------------------------------------
Controls one or more dropdowns on a page:
    • Click toggle to open/close
    • Only one dropdown open at a time
    • Outside click / Escape closes
    • Arrow keys navigate items inside menu
    • ARIA roles (menu, menuitem) applied automatically
    • Auto-generates IDs for aria-controls relationships

Applied to: any <div class="dropdown"> on a page.

--------------------------------------------------------------------------------
30.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    dropdownSelector:       '.dropdown',
    toggleSelector:         '.dropdown-toggle',
    menuSelector:           '.dropdown-menu',
    itemSelector:           '.dropdown-link, .dropdown-item',
    openClass:              'is-open',
    closeOnOutsideClick:    true,
    closeOnEscape:          true,
    closeOnItemClick:       false,
    focusOnOpen:            true,
    trapFocus:              false
}

--------------------------------------------------------------------------------
30.3 REQUIRED HTML CONTRACT
--------------------------------------------------------------------------------
    <div class="dropdown">
        <button class="dropdown-toggle" aria-expanded="false">
            Menu <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu">
            <ul class="dropdown-list">
                <li class="dropdown-item">
                    <a class="dropdown-link" href="/profile">Profile</a>
                </li>
                <li class="dropdown-item">
                    <a class="dropdown-link" href="/settings">Settings</a>
                </li>
            </ul>
        </div>
    </div>

Required:
    .dropdown           — wrapper (position: relative)
    .dropdown-toggle    — the button
    .dropdown-menu      — the menu

Optional (auto-detected items):
    .dropdown-link · .dropdown-item

--------------------------------------------------------------------------------
30.4 MULTIPLE DROPDOWNS
--------------------------------------------------------------------------------
This module supports MULTIPLE independent .dropdown containers on one page.
Each is tracked in state.groups (Map).

Behavior on open:
    • All other open dropdowns close first
    • Only one dropdown open at a time (accordion behavior)

--------------------------------------------------------------------------------
30.5 BEHAVIOR
--------------------------------------------------------------------------------
Toggle:        click .dropdown-toggle → open/close
Outside click: closes all open dropdowns
Escape:        closes all open dropdowns
Arrow Down:    focus next item
Arrow Up:      focus previous item
Home/End:      focus first/last item
Tab:           if trapFocus=true, cycles within menu

--------------------------------------------------------------------------------
30.6 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Dropdown.init(config)              → wire up all .dropdown containers
ASLDS.Dropdown.destroy()                 → cleanup all

ASLDS.Dropdown.open(container, focus)    → open specific dropdown
ASLDS.Dropdown.close(container)          → close specific (or all if no arg)
ASLDS.Dropdown.toggle(container)         → cycle
ASLDS.Dropdown.closeAll()                → close every open dropdown

ASLDS.Dropdown.getState(container)       → { isOpen, initialized, toggle, menu }
ASLDS.Dropdown.getContainers()           → array of .dropdown elements
ASLDS.Dropdown.getToggle(container)      → toggle element
ASLDS.Dropdown.getMenu(container)        → menu element

ASLDS.Dropdown.updateConfig(config)      → change closeOnOutsideClick, closeOnEscape, closeOnItemClick

Rule: Most API methods require the container element as the first argument.
      Unlike modal/sidebar (single instance), dropdown is multi-instance.

--------------------------------------------------------------------------------
30.7 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:dropdown:init     → { count }
asl:dropdown:open     → { container, toggle }
asl:dropdown:close    → { container, toggle }
asl:dropdown:destroy  → (no payload)

--------------------------------------------------------------------------------
30.8 AUTO-GENERATED IDS & ARIA
--------------------------------------------------------------------------------
If toggle or menu lacks an ID, the script generates one:
    "asl-dropdown-toggle-N"
    "asl-dropdown-menu-N"

Applied automatically:
    toggle: aria-haspopup="true" · aria-expanded · aria-controls
    menu:   role="menu" · aria-labelledby
    items:  role="menuitem" · tabindex="-1" (for links)

Rule: You do NOT need to set these in HTML — the module does it.
Rule: Do NOT override aria-* attributes — the module manages them.

--------------------------------------------------------------------------------
30.9 KNOWN ISSUES
--------------------------------------------------------------------------------
1. CONFLICT WITH navbar.css — the CSS defines a hover-based .dropdown-menu that
   will fight the click-based behavior. If dropdown.js is used inside a navbar,
   the CSS must be adjusted or the navbar dropdown renamed.
2. focusOnOpen = true by default — auto-focus first item on every open
3. closeOnItemClick = false by default — menu stays open when item clicked
4. Menu doesn't reposition if it would overflow the viewport
5. No left-aligned variant — menu is right-aligned (right: 0)
6. ARIA role="menu" is a rigid spec — some screen readers prefer a simpler list

--------------------------------------------------------------------------------
30.10 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include dropdown.js on any page with .dropdown
✅ Use .dropdown-toggle + .dropdown-menu structure
✅ Multiple dropdowns per page are fine
✅ Let the module handle ARIA and IDs

❌ Never use .dropdown inside a navbar (conflicts with navbar.css hover)
❌ Never manage aria-expanded from page JS
❌ Never open multiple dropdowns simultaneously — module enforces one-at-a-time

================================================================================
END OF SECTION 30
================================================================================


================================================================================
SECTION 31 — TABS MODULE (tabs.js)
Source: packages/aslds/js/tabs.js
Version: 1.0.0
Scope:  Multiple independent tab groups per page.
Priority: 80 (loads after Dropdown, before Modal).
================================================================================

31.1 PURPOSE
--------------------------------------------------------------------------------
Controls one or more tabbed interfaces on a page:
    • Click tab button → switch panel
    • Arrow keys / Home / End navigate between tabs
    • ARIA roles (tablist, tab, tabpanel) applied automatically
    • Auto-generates IDs for aria-controls relationships
    • Auto-activates first tab if none marked active

Applied to: any <div class="tabs"> on a page.

--------------------------------------------------------------------------------
31.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    tabSelector:        '.tabs',
    buttonSelector:     '.tab-button',
    panelSelector:      '.tab-content',
    listSelector:       '.tab-list',
    activeClass:        'is-active',
    activateOnInit:     true,
    keyboardNavigation: true
}

--------------------------------------------------------------------------------
31.3 REQUIRED HTML CONTRACT
--------------------------------------------------------------------------------
    <div class="tabs">
        <div class="tab-list" role="tablist">
            <button class="tab-button is-active" role="tab">
                Overview
            </button>
            <button class="tab-button" role="tab">
                Settings
            </button>
        </div>
        <div class="tab-content is-active" role="tabpanel">
            Overview content
        </div>
        <div class="tab-content" role="tabpanel">
            Settings content
        </div>
    </div>

Required:
    .tabs           — wrapper
    .tab-list       — button container
    .tab-button     — each tab trigger
    .tab-content    — each panel (must match button count)

Rule: Panels must be siblings of .tab-list, not children.

--------------------------------------------------------------------------------
31.4 MULTIPLE TAB GROUPS
--------------------------------------------------------------------------------
Supports multiple independent .tabs on one page. Each tracked in state.groups.

Rule: All public API methods accept a container element as the first arg.

--------------------------------------------------------------------------------
31.5 BEHAVIOR
--------------------------------------------------------------------------------
Click:          activates target tab, deactivates others
Arrow Right:    next tab (wraps)
Arrow Left:     previous tab (wraps)
Home:           first tab
End:            last tab
Auto-init:      if no tab has .is-active, first tab is activated

Active state:
    button:  .is-active + aria-selected="true" + tabindex="0"
    others:  aria-selected="false" + tabindex="-1"
    panel:   matching index gets .is-active

--------------------------------------------------------------------------------
31.6 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Tabs.init(config)                         → wire up all .tabs containers
ASLDS.Tabs.destroy()                            → cleanup all

ASLDS.Tabs.activateByIndex(container, i, focus) → activate tab at index
ASLDS.Tabs.getActiveTab(container)              → current active button
ASLDS.Tabs.getTabs(container)                   → array of tab buttons
ASLDS.Tabs.getPanels(container)                 → array of panels
ASLDS.Tabs.getState(container)                  → { initialized, tabCount, panelCount, activeIndex }

ASLDS.Tabs.updateConfig(config)                 → toggle keyboardNavigation

--------------------------------------------------------------------------------
31.7 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:tabs:init       → { count }
asl:tabs:activate   → { container, button, index, panel }
asl:tabs:destroy    → (no payload)

--------------------------------------------------------------------------------
31.8 AUTO-GENERATED IDS & ARIA
--------------------------------------------------------------------------------
If button or panel lacks an ID:
    "asl-tab-N" · "asl-panel-N"

Applied automatically:
    list:    role="tablist"
    buttons: role="tab" · aria-controls · aria-selected · tabindex
    panels:  role="tabpanel" · aria-labelledby

Rule: Do NOT set these in HTML — the module does it.

--------------------------------------------------------------------------------
31.9 KNOWN ISSUES
--------------------------------------------------------------------------------
1. No vertical tab orientation support
2. No pill-style tab variant styling hook (only .is-active)
3. No lazy-loading of panels — all content is in DOM
4. If button and panel counts mismatch, warning is logged but no fix applied
5. No ARIA aria-orientation attribute on tablist

--------------------------------------------------------------------------------
31.10 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include tabs.js on any page with .tabs
✅ Keep button/panel counts equal
✅ Only one button should have .is-active initially (or none — module activates first)
✅ Let the module handle ARIA

❌ Never manage is-active from page JS — use ASLDS.Tabs.activateByIndex
❌ Never duplicate tab click handlers

================================================================================
END OF SECTION 31
================================================================================


================================================================================
SECTION 32 — TOAST MODULE (toast.js)
Source: packages/aslds/js/toast.js
Version: 1.0.0
Scope:  Global. Programmatic notifications.
Priority: 70 (loads after Playground/Search/Animations).
================================================================================

32.1 PURPOSE
--------------------------------------------------------------------------------
Provides a programmatic notification system:
    • Show toast via API (never write HTML)
    • 4 types: success, error, warning, info
    • Auto-dismiss with progress bar
    • Pause on hover
    • Stacking with max-toasts limit
    • 4 corner positions
    • Manual dismiss + clear all

Not a component — no HTML wiring. Toasts are created on demand.

--------------------------------------------------------------------------------
32.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    duration:       3500,
    position:       'top-right',    // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    maxToasts:      5,
    showProgress:   true,
    showIcon:       true,
    pauseOnHover:   true,
    closeButton:    true
}

Configure defaults with:
    ASLDS.Toast.configure({ duration: 4000, position: 'bottom-right' })

--------------------------------------------------------------------------------
32.3 DOM STRUCTURE (created by toast.js — never write manually)
--------------------------------------------------------------------------------
    <div class="toast-container toast-container--top-right" role="status" aria-live="polite">
        <div class="toast toast--success" role="alert" aria-live="assertive">
            <div class="toast-content">
                <span class="toast-icon">✓</span>
                <div class="toast-body">
                    <div class="toast-title">Success!</div>
                    <div class="toast-message">Saved successfully.</div>
                </div>
            </div>
            <button class="toast-close" aria-label="Dismiss notification">✕</button>
            <div class="toast-progress"></div>
        </div>
    </div>

Rule: Never write toast HTML directly. Always use ASLDS.Toast.show().

--------------------------------------------------------------------------------
32.4 BEHAVIOR
--------------------------------------------------------------------------------
Show:        creates container (if needed) + toast · starts RAF-based timer
Auto-dismiss: when progress bar reaches 0, dismisses with animation
Pause on hover:  mouseenter pauses timer · mouseleave resumes with remaining
Stacking:    newest on top · max 5 (oldest auto-dismissed when exceeded)
Empty cleanup: when last toast dismissed, container is removed from DOM

--------------------------------------------------------------------------------
32.5 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Toast.show(options)          → create and return a toast element
    options:
        type          → 'success' | 'error' | 'warning' | 'info'   (default: 'info')
        title         → string
        message       → string
        duration      → milliseconds (0 = never auto-dismiss)
        position      → 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
        showProgress  → boolean
        showIcon      → boolean
        closeButton   → boolean

ASLDS.Toast.dismiss(toast, immediate)   → dismiss one toast
ASLDS.Toast.clear(immediate)            → dismiss all
ASLDS.Toast.configure(config)           → update defaults
ASLDS.Toast.getConfig()                 → current defaults
ASLDS.Toast.getToasts()                 → array of active toasts
ASLDS.Toast.getContainer(position)      → container element for a position
ASLDS.Toast.info()                      → { module, version, initialized, config, toastCount }

ASLDS.Toast.init(config)                → called automatically by runtime
ASLDS.Toast.destroy()                   → cleanup

--------------------------------------------------------------------------------
32.6 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:toast:init      → { config }
asl:toast:show      → { toast, data, options }
asl:toast:dismiss   → { toast, data }
asl:toast:clear     → (no payload)
asl:toast:destroy   → (no payload)

--------------------------------------------------------------------------------
32.7 USAGE EXAMPLES
--------------------------------------------------------------------------------
    // Simple success
    ASLDS.Toast.show({
        type: 'success',
        title: 'Saved',
        message: 'Your changes have been saved.'
    });

    // Error, longer duration
    ASLDS.Toast.show({
        type: 'error',
        title: 'Error',
        message: 'Something went wrong.',
        duration: 5000
    });

    // Persistent (no auto-dismiss)
    ASLDS.Toast.show({
        type: 'info',
        title: 'Update available',
        message: 'Click here to install.',
        duration: 0
    });

    // Different position, no progress bar
    ASLDS.Toast.show({
        type: 'info',
        message: 'Quick message.',
        position: 'bottom-left',
        showProgress: false
    });

--------------------------------------------------------------------------------
32.8 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Container has role="status" + aria-live="polite"
✅ Each toast has role="alert" + aria-live="assertive"
✅ Close button has aria-label="Dismiss notification"
✅ Pause on hover doesn't break SR flow

--------------------------------------------------------------------------------
32.9 KNOWN ISSUES
--------------------------------------------------------------------------------
1. Uses requestAnimationFrame for progress — pauses when tab is background
   (progress will complete but slightly slower when returning to tab)
2. Toast icons are Unicode glyphs — no easy way to swap for icon fonts
3. No action button support (e.g. "Undo", "View")
4. maxToasts eviction uses first-in — could dismiss a toast the user is reading
5. No compact/small size variant

--------------------------------------------------------------------------------
32.10 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Use ASLDS.Toast.show() — never write toast HTML manually
✅ Always include a title (improves screen reader experience)
✅ Use type matching meaning: success/error/warning/info
✅ Set duration: 0 for critical messages requiring user acknowledgement

❌ Never write .toast markup in HTML
❌ Never place .toast-container manually
❌ Never override toast colors per page — use type variants

================================================================================
END OF SECTION 32
================================================================================

================================================================================
SECTION 33 — SEARCH MODULE (search.js)
Source: packages/aslds/js/search.js
Version: 1.0.0
Scope:  Global. Search overlay with live filtering and keyboard shortcuts.
Priority: 55 (loads after Animations).
================================================================================

33.1 PURPOSE
--------------------------------------------------------------------------------
Provides a global search overlay for documentation and applications:
    • Opens via click on .nav-search OR Ctrl+K / Cmd+K
    • Creates its own overlay DOM entirely (no HTML contract)
    • Injects its own CSS into <head> (no external search.css file)
    • Live filtering with weighted scoring
    • Keyboard navigation (Arrow Up/Down, Home, End, Enter, Escape)
    • Result highlighting
    • Configurable search index

⚠️  NO search.css FILE — styles are embedded in search.js and injected at init.
    This is different from every other component.
    Search is the only module that ships its own CSS through JavaScript.

Applied to: any page with a search button (.nav-search).

--------------------------------------------------------------------------------
33.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    searchButtonSelector:   '.nav-search',
    overlayClass:           'search-overlay',
    inputSelector:          '#search-input',
    resultsSelector:        '#search-results',
    resultItemSelector:     '.search-result-item',
    activeClass:            'is-active',
    highlightClass:         'search-highlight',
    shortcutKey:            'k',
    maxResults:             10,
    placeholder:            'Search documentation...',
    noResultsText:          'No results found',
    openOnLoad:             false,
    closeOnEscape:          true,
    closeOnOutsideClick:    true
}

--------------------------------------------------------------------------------
33.3 SEARCH INDEX
--------------------------------------------------------------------------------
The search index is HARDCODED inside search.js. Current entries:

    Foundations:  Colors, Typography, Spacing, Layout, Shadows, Borders, Icons, Animations
    Components:   Buttons, Cards, Forms, Navbar, Sidebar, Dashboard, Alerts, Badges,
                  Progress, Avatars, Dropdowns, Modals, Tables, Tabs, Toasts, Footer
    Guides:       Getting Started, Installation, Playground, Accessibility,
                  Engineering, Roadmap, Changelog

Each entry: { title, url, category, keywords }

⚠️  HARDCODED — the index is fixed at build time. To customize:
        ASLDS.Search.setIndex([...])

⚠️  URLs are RELATIVE — they assume the page is at the same depth as the search
    target. On nested pages (e.g., /components/buttons.html), the links may
    404. Consider this for future improvement.

--------------------------------------------------------------------------------
33.4 DOM STRUCTURE (created dynamically — never write manually)
--------------------------------------------------------------------------------
    <div class="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
        <div class="search-backdrop"></div>
        <div class="search-modal">
            <div class="search-header">
                <span class="search-icon">🔍</span>
                <input id="search-input" class="search-input" ...>
                <span class="search-shortcut">Esc</span>
            </div>
            <div id="search-results" class="search-results">
                <div class="search-no-results">No results found</div>
            </div>
        </div>
    </div>

Rule: Never write this markup in HTML. search.js creates it on init.

--------------------------------------------------------------------------------
33.5 BEHAVIOR
--------------------------------------------------------------------------------
Opening:
    • .nav-search click OR Ctrl+K / Cmd+K
    • body gets .search-open (locks scroll)
    • overlay gets .is-active (visible)
    • input auto-focused after 100ms

Live filter:
    • input event → performSearch(query)
    • Scoring: title-match 2 · start-match 3 · keyword/category match 1
    • Results sorted by score descending
    • Top 10 (configurable) rendered

Keyboard:
    Arrow Down   → next result
    Arrow Up     → previous result
    Enter        → navigate to selected (or first) result
    Escape       → close

Closing:
    • Click backdrop
    • Escape key
    • Body .search-open removed
    • Input value cleared
    • Focus returned to .nav-search

--------------------------------------------------------------------------------
33.6 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Search.init(config)             → wire up (auto by runtime)
ASLDS.Search.destroy()                → cleanup + remove injected CSS

ASLDS.Search.open()                   → open overlay
ASLDS.Search.close()                  → close overlay
ASLDS.Search.toggle()                 → cycle

ASLDS.Search.isOpen()                 → boolean
ASLDS.Search.getResults()             → current result objects
ASLDS.Search.getIndex()               → copy of search index
ASLDS.Search.setIndex(array)          → replace search index at runtime
ASLDS.Search.info()                   → { module, version, initialized, isOpen, indexSize, config }
ASLDS.Search.updateConfig(config)     → placeholder, maxResults, noResultsText

--------------------------------------------------------------------------------
33.7 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:search:init     → { config }
asl:search:open     → (no payload)
asl:search:close    → (no payload)
asl:search:destroy  → (no payload)

--------------------------------------------------------------------------------
33.8 INJECTED CSS (search.js-specific)
--------------------------------------------------------------------------------
The module injects a <style id="aslds-search-styles"> block into <head>
containing every rule needed for:
    .search-overlay · .search-backdrop · .search-modal
    .search-header · .search-icon · .search-input · .search-shortcut
    .search-results · .search-result-item · .search-result-title
    .search-result-meta · .search-result-category · .search-result-keywords
    .search-no-results · .search-highlight · body.search-open

Includes theme overrides via [data-theme="light"] selectors.

Rule: Do NOT add a search.css to any page — it will conflict.
Rule: Do NOT override these classes from page CSS.
Rule: On destroy(), the injected <style> is removed.

--------------------------------------------------------------------------------
33.9 ACCESSIBILITY
--------------------------------------------------------------------------------
✅ Overlay has role="dialog" + aria-modal="true" + aria-label="Search"
✅ Input auto-focused on open
✅ Escape closes
✅ Focus returned to trigger on close
✅ Results are keyboard navigable
✅ Each result is a <div> with click handler — recommended upgrade: make them
    semantic <button> or <a> for better screen reader support

--------------------------------------------------------------------------------
33.10 KNOWN ISSUES
--------------------------------------------------------------------------------
1. INLINE CSS INJECTION — unconventional for a design system. Search styles
   should ideally live in css/components/search.css for consistency.
2. HARDCODED SEARCH INDEX — pages cannot add entries without JS call.
3. RELATIVE URLS — will break on nested pages.
4. RESULTS ARE <div> NOT <a> — poor screen reader semantics.
5. NO ARIA-LIVE REGION — result count changes are not announced.
6. NO LOADING STATE — not needed for local index but worth noting.
7. Ctrl+K conflicts with browser defaults — preventDefault() is applied.

--------------------------------------------------------------------------------
33.11 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include search.js on any page with .nav-search
✅ Override index via ASLDS.Search.setIndex() for app-specific results
✅ Use Ctrl+K to test — should open on every page

❌ Never write search markup in HTML
❌ Never create a search.css file
❌ Never override .search-* classes from page CSS
❌ Never assume the hardcoded index matches your app's pages

================================================================================
END OF SECTION 33
================================================================================


================================================================================
SECTION 34 — PLAYGROUND MODULE (playground.js)
Source: packages/aslds/js/playground.js
Version: 1.0.0
Scope:  Showcase-only. Wires up demo buttons on documentation pages.
Priority: 60 (loads after Search, before Toast).
================================================================================

34.1 PURPOSE
--------------------------------------------------------------------------------
Wires up interactive demo buttons on showcase/documentation pages:
    • [data-demo-toast]       → triggers a demo toast
    • [data-demo-modal]       → opens the modal
    • [data-demo-dropdown]    → toggles a dropdown
    • [data-demo-tab]         → activates a tab
    • "Copy Code" buttons      → copies code block content to clipboard
    • Theme toggle label       → reflects current theme mode

⚠️  SHOWCASE-ONLY MODULE — not intended for production apps.
    Applications should call ASLDS.Toast.show(), ASLDS.Modal.open(), etc. directly.

--------------------------------------------------------------------------------
34.2 NO CONFIGURATION OBJECT
--------------------------------------------------------------------------------
Playground does not accept a config object. It auto-wires based on
data-* attributes found in the DOM.

--------------------------------------------------------------------------------
34.3 REQUIRED HTML CONTRACT
--------------------------------------------------------------------------------
Playground auto-wires any of these attributes when found:

    <button data-demo-toast="success">Show Success</button>
    <button data-demo-toast="error">Show Error</button>
    <button data-demo-toast="warning">Show Warning</button>
    <button data-demo-toast="info">Show Info</button>
    <button data-demo-toast="custom">Show Custom</button>

    <button data-demo-modal>Open Modal</button>
    <button class="playground-modal-trigger">Open Modal</button>

    <button data-demo-dropdown="#myDropdown">Toggle</button>
    <div class="dropdown" id="myDropdown">…</div>

    <button data-demo-tab="0">Tab 1</button>
    <button data-demo-tab="1">Tab 2</button>

    <button class="btn-copy">Copy Code</button>
    <div class="card"><pre><code>…</code></pre><button class="btn-copy">Copy Code</button></div>

--------------------------------------------------------------------------------
34.4 DEMO TOASTS — CANONICAL CONTENT
--------------------------------------------------------------------------------
Playground ships with fixed demo content:

    success:   title "✨ Success!"  · message "Your changes have been saved successfully."
    error:     title "❌ Error"      · message "Something went wrong. Please try again."
    warning:   title "⚠️ Warning"   · message "Your session will expire in 5 minutes."
    info:      title "ℹ️ Info"      · message "New update available. Click here to install."
    custom:    title "👋 Custom Toast" · message "You can customize the title, message, duration, and position."

    duration:  3500ms (custom: 5000ms)

⚠️  These strings are hardcoded in playground.js — they cannot be changed
    without editing the module.

--------------------------------------------------------------------------------
34.5 BEHAVIOR
--------------------------------------------------------------------------------
Init on page load:
    1. Scans for [data-demo-toast] buttons → bind click → showDemoToast(type)
    2. Scans for [data-demo-modal] + .playground-modal-trigger → open modal
    3. Scans for [data-demo-dropdown] → toggle target dropdown
    4. Scans for [data-demo-tab] → activate target tab
    5. Wires theme toggle labels (redundant with theme.js but safe)
    6. Wires .btn-copy buttons → copies <pre><code> content
    7. Prevents default on empty nav links (href="#")

--------------------------------------------------------------------------------
34.6 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Playground.init()                    → wire up (auto by runtime)
ASLDS.Playground.destroy()                 → cleanup

ASLDS.Playground.showToast(type)           → show a demo toast
ASLDS.Playground.showModal()               → open the modal
ASLDS.Playground.toggleDropdown(container) → toggle a dropdown
ASLDS.Playground.activateTab(container, i) → activate a tab

ASLDS.Playground.getState()                → { initialized, toastDemoCount, modalOpen }

--------------------------------------------------------------------------------
34.7 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:playground:ready    → { toasts, modal }
asl:playground:destroy  → (no payload)

--------------------------------------------------------------------------------
34.8 COPY-CODE BUTTONS
--------------------------------------------------------------------------------
Detection rule:
    Buttons are considered "copy" buttons when:
        • Their class contains ".btn-copy", OR
        • Their text is "Copy Component" or "Copy Code"

Behavior:
    Finds the nearest .card or .documentation-card ancestor, then the first
    <pre><code> inside. Copies its textContent to the clipboard.
    Shows "✅ Copied!" for 2 seconds.
    Falls back to execCommand("copy") if navigator.clipboard fails.

⚠️  If no code block found, still shows "Copied!" (false positive).

--------------------------------------------------------------------------------
34.9 KNOWN ISSUES
--------------------------------------------------------------------------------
1. DUPLICATE THEME HANDLING — theme.js already updates toggle labels.
   Playground duplicates this "just in case", which can cause redundant work.
2. HARDCODED DEMO CONTENT — users cannot customize without editing the file.
3. COPY FALSE POSITIVE — if no code block, still shows "Copied!".
4. NO DESTROY CLEANUP — event listeners are added directly, not tracked.
   On destroy(), listeners remain attached (harmless for showcase pages, but
   not clean).
5. NOT REUSABLE — this module is hardcoded for the showcase. It should not be
   included on production pages.
6. ONLY INITIALIZES ONCE — if you add [data-demo-toast] buttons after init,
   they won't be wired.

--------------------------------------------------------------------------------
34.10 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include playground.js ONLY on showcase/documentation demo pages
✅ Use [data-demo-toast], [data-demo-modal], [data-demo-dropdown], [data-demo-tab]
✅ Let it wire up automatically — no page JS needed

❌ Never include playground.js on production app pages
❌ Never depend on Playground for app logic
❌ Never call ASLDS.Playground.showToast() from app code — use ASLDS.Toast.show()

================================================================================
END OF SECTION 34
================================================================================


================================================================================
SECTION 35 — ANIMATIONS MODULE (animations.js)
Source: packages/aslds/js/animations.js
Version: 1.0.0
Scope:  Global. Scroll-triggered animation engine.
Priority: 50 (loads first among non-core modules).
================================================================================

35.1 PURPOSE
--------------------------------------------------------------------------------
Automates scroll-triggered animations:
    • Watches for elements with animation classes
    • Adds .is-visible when the element enters the viewport
    • Respects prefers-reduced-motion
    • Supports staggered children
    • Watches for new elements added dynamically
    • Public API for manual triggering

Applied to: every page that uses ASLDS animation classes (see Section 07).

--------------------------------------------------------------------------------
35.2 DEFAULT CONFIGURATION
--------------------------------------------------------------------------------
{
    selector:                 '[data-animate], .fade-in, .slide-up, .slide-down, .slide-left, .slide-right, .scale-in, .stagger > *',
    threshold:                0.15,
    rootMargin:               '0px 0px -50px 0px',
    once:                     true,
    animationClass:           'is-visible',
    disableOnReducedMotion:   true,
    delayStagger:             150
}

--------------------------------------------------------------------------------
35.3 WATCHED SELECTORS
--------------------------------------------------------------------------------
Any element matching one of these will be observed:

    [data-animate]      → generic opt-in
    .fade-in
    .slide-up
    .slide-down
    .slide-left
    .slide-right
    .scale-in
    .stagger > *        → each direct child of .stagger

Also checked for animation class presence at trigger time:
    fade-in, fade-out, slide-up, slide-down, slide-left, slide-right,
    scale-in, float, pulse, spin, shake, bounce, glow, page-enter

Rule: If a matching element has NONE of the above animation classes,
      it is skipped.

--------------------------------------------------------------------------------
35.4 BEHAVIOR
--------------------------------------------------------------------------------
On init:
    • Creates an IntersectionObserver with configured threshold + rootMargin
    • Observes every element matching the selector
    • For elements already in viewport → triggers after 50ms delay
    • Sets up a MutationObserver to detect new matching elements
    • Sets up a prefers-reduced-motion listener

On intersection:
    • Element enters viewport → triggerElement(element)
    • Adds .is-visible to element
    • If element has .stagger → children get .is-visible with 150ms increments

On reduced motion change:
    • Reduced motion ON  → removes .is-visible from all · clears triggered set
    • Reduced motion OFF → re-triggers visible elements

--------------------------------------------------------------------------------
35.5 HOW ANIMATION CLASSES WORK TOGETHER
--------------------------------------------------------------------------------
CSS side (animations.css):
    .fade-in { animation: fadeIn .35s ease; }

But WITHOUT .is-visible, the element is still hidden by initial opacity.

The animations.js module adds .is-visible when the element scrolls into view,
triggering the animation at the right moment.

Example CSS pattern (from animations.css — check for actual rules):
    .fade-in { opacity: 0; }
    .fade-in.is-visible { opacity: 1; animation: fadeIn .35s ease; }

⚠️  Check animations.css to confirm this pattern is actually used. If the CSS
    uses only animation: fadeIn (without an initial opacity: 0), animations
    will fire immediately on page load, not on scroll.

--------------------------------------------------------------------------------
35.6 PUBLIC API
--------------------------------------------------------------------------------
ASLDS.Animations.init(config)              → wire up (auto by runtime)
ASLDS.Animations.destroy()                 → disconnect observers

ASLDS.Animations.trigger(element)          → manually trigger an element
ASLDS.Animations.refresh()                 → re-scan for new elements
ASLDS.Animations.isReducedMotion()         → boolean
ASLDS.Animations.getObservedElements()     → NodeList of currently observed
ASLDS.Animations.getTriggeredElements()    → Set of triggered elements
ASLDS.Animations.info()                    → module info
ASLDS.Animations.updateConfig(config)      → threshold, rootMargin, once, disableOnReducedMotion

--------------------------------------------------------------------------------
35.7 EVENTS EMITTED
--------------------------------------------------------------------------------
asl:animations:init       → { config, observedElements, reducedMotion }
asl:animations:triggered  → { element, id }
asl:animations:destroy    → (no payload)

--------------------------------------------------------------------------------
35.8 DYNAMIC CONTENT HANDLING
--------------------------------------------------------------------------------
Two mechanisms watch for new elements:

1. IntersectionObserver
   Only observes elements present at init or after a refresh.

2. MutationObserver
   Watches document.body for childList changes.
   If a new element (or its descendant) matches the selector →
   re-runs setupObserver() automatically.

Rule: After adding new content dynamically (e.g., via fetch), you may also
      call ASLDS.Animations.refresh() for immediate observation.

--------------------------------------------------------------------------------
35.9 REDUCED MOTION
--------------------------------------------------------------------------------
At init:
    state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

If true at trigger time AND disableOnReducedMotion is true → skip animation.
If the user changes the OS setting → live handler updates state.

Rule: Never override or remove the reduced-motion media query in CSS.
Rule: Never call ASLDS.Animations.trigger() bypassing the reduced-motion check
      unless you intend to (there's no API for bypass — it respects config).

--------------------------------------------------------------------------------
35.10 KNOWN ISSUES
--------------------------------------------------------------------------------
1. OVERLAP WITH RUNTIME MUTATIONOBSERVER — the runtime already watches body
   via ASLDS.observer (Section 25.18). animations.js creates its own second
   MutationObserver. This is redundant but functional.
2. TRIGGERED SET GROWS — with once: true, the triggeredElements Set grows
   unbounded. Not a problem for normal usage but worth noting.
3. NO PRIORITY ORDER — if an element matches multiple observers, all fire.
4. NO SCROLL DIRECTION AWARENESS — animations trigger both on scroll down
   and scroll up (unless once: true).
5. NO DELAY CONFIGURATION per-element — only global delayStagger.
6. TRIGGER EVENT FIRES MANY TIMES in once: false mode — could flood listeners.

--------------------------------------------------------------------------------
35.11 GOLDEN RULES
--------------------------------------------------------------------------------
✅ Include animations.js on every page that uses animation classes
✅ Add animation classes to elements — animations.js handles the trigger
✅ Use .stagger on a container for cascading child animations
✅ Respect prefers-reduced-motion — never override it

❌ Never call .classList.add('is-visible') manually
❌ Never create your own IntersectionObserver for scroll animations
❌ Never rely on animations.js to hide elements — pair with CSS opacity rules

================================================================================
END OF SECTION 35
================================================================================

================================================================================
SECTION 36 — GOLDEN RULES
Synthesis of every rule from Sections 01–35.
These are the standards. Break them only with documented reason.
================================================================================

36.1 THE SEVEN LAWS OF ASLDS
--------------------------------------------------------------------------------
1. Tokens first.        Never hardcode a color, size, or transition that a
                        token already provides.

2. Components first.    Never write a button, card, form, or nav from scratch.
                        Use the ASLDS component classes.

3. Modules only.        Never duplicate JS behavior that a module handles.
                        Never wire a component manually.

4. One pattern.         Every page follows the same structure. Every module
                        follows the same shape (IIFE + register).

5. No page CSS.         A page does not add CSS for anything ASLDS covers.
                        Extend ASLDS only if the pattern is truly reusable.

6. No page JS for
   components.          Add behavior to the module, not the page.

7. A11y is default.     Every interactive element is keyboard-reachable,
                        focus-visible, and screen-reader-friendly.

--------------------------------------------------------------------------------
36.2 CSS RULES
--------------------------------------------------------------------------------
✅ Always use tokens:
      color: var(--primary-gold)
      padding: var(--space-4)
      border-radius: var(--radius-lg)
      transition: var(--transition-normal)

✅ Always use component classes for structure:
      <button class="btn btn-primary">…</button>
      <div class="card"><div class="card-body">…</div></div>
      <section class="hero">…</section>

✅ Use utility classes for one-off tweaks:
      <div class="mt-4 mb-3 text-center text-gold">…</div>

✅ Use layout classes for structure:
      <div class="container">
      <section class="section">
      <div class="grid grid-3">

❌ Never hardcode colors (#D4AF37, rgba(...)), sizes (32px), or transitions.
❌ Never create page-specific classes for something ASLDS already covers.
❌ Never override .btn / .card / .navbar styles in page CSS.
❌ Never redefine .btn / .card / .input in <style> blocks.
❌ Never write a new @keyframes if animations.css has one that fits.

If a needed pattern repeats in 2+ pages → request it added to ASLDS.

--------------------------------------------------------------------------------
36.3 JAVASCRIPT RULES
--------------------------------------------------------------------------------
✅ Every module is an IIFE:
      (function (window, document, undefined) { 'use strict'; … })(window, document);

✅ Every module registers with the runtime:
      window.ASLDS.register('ModuleName', API, priority, dependencies);

✅ Every module exposes:
      • init(config)
      • destroy()
      • a public API with getState() where applicable

✅ Every module owns its listeners and cleans them in destroy().
✅ Every module uses CustomEvent for cross-module communication.
✅ Every module respects runtime config (e.g., config.enableLogging).

❌ Never write a component handler in page <script>.
❌ Never call module internals — use the public API.
❌ Never add a second listener for something a module already listens to.
❌ Never re-implement scroll, resize, or intersection logic per page.
❌ Never call ASLDS.init() from a page — the runtime auto-inits on window load.

Rule: If a page needs new behavior, extend the relevant module — do not
      bolt it onto the page.

--------------------------------------------------------------------------------
36.4 HTML RULES
--------------------------------------------------------------------------------
✅ Every page wraps content in .page-wrapper.
✅ Every page has <main id="main-content" class="main-content">.
✅ Every page has a skip link:
      <a href="#main-content" class="skip-link">Skip to main content</a>

✅ Every interactive element is a <button>, <a>, or <input> — not a <div>.
✅ Every button that is icon-only has aria-label.
✅ Every link that opens in a new tab has rel="noopener".
✅ Every form field has an associated <label>.

❌ Never use <div onclick="...">.
❌ Never inline style="…" — use classes.
❌ Never duplicate IDs.
❌ Never skip heading levels (h1 → h2 → h3).

--------------------------------------------------------------------------------
36.5 ACCESSIBILITY RULES
--------------------------------------------------------------------------------
✅ Every page has a single <h1>.
✅ Every landmark has a role or semantic tag:
      <header> · <nav aria-label="…"> · <main> · <aside> · <footer role="contentinfo">
✅ Every interactive element is keyboard-reachable.
✅ Focus outline is visible (reset.css handles it).
✅ Modals trap focus and restore it on close (modal.js).
✅ Menus close on Escape (navbar.js, dropdown.js, sidebar.js).
✅ Motion respects prefers-reduced-motion (animations.css, animations.js).

❌ Never remove the focus outline.
❌ Never rely on color alone to convey meaning.
❌ Never use placeholder as the only label.
❌ Never auto-play sound or video.

--------------------------------------------------------------------------------
36.6 TOKEN USAGE RULES
--------------------------------------------------------------------------------
When writing CSS, always reach for a token before a raw value:

    Need          Use                              Not
    ------------  -------------------------------  ----------------
    Brand color   var(--primary-gold)              #D4AF37
    Spacing       var(--space-4)                    32px
    Radius        var(--radius-lg)                  18px
    Shadow        var(--shadow-md)                  0 8px 20px rgba(...)
    Transition    var(--transition-normal)          0.3s ease
    Layer         var(--z-modal)                     1050
    Font size     var(--fs-lg)                       18px
    Container     var(--container-width)             1200px

If a value is used repeatedly and has no token → request a new token in
variables.css rather than hardcoding.

--------------------------------------------------------------------------------
36.7 COMPONENT REUSE RULES
--------------------------------------------------------------------------------
Before building anything, ask:

    1. Does ASLDS already have this component?
         → Use it. Do not rebuild.

    2. Does ASLDS have a component close enough?
         → Use it and extend via composition, not modification.

    3. Is this pattern truly new?
         → Propose it as an ASLDS component before writing it in a page.

Rule: A page NEVER introduces a new visual pattern without it being documented
      in ASLDS first.

--------------------------------------------------------------------------------
36.8 PATH & FILE RULES
--------------------------------------------------------------------------------
Folder structure reference:

    A-Square-L-Innovate/
    ├── apps/
    │   ├── public-site/
    │   ├── academy/
    │   ├── ai/
    │   ├── business-os/
    │   ├── portfolio/
    │   └── admin/
    ├── packages/
    │   └── aslds/
    │       ├── css/  (reset · variables · typography · layout · utilities · animations)
    │       │   └── components/  (buttons · cards · forms · navbar · sidebar ·
    │       │                    dashboard · footer · badge · alert · progress ·
    │       │                    avatar · dropdown · modal · toast · table · tabs)
    │       ├── js/   (app · sidebar · tabs · dropdown · modal · theme ·
    │       │          playground · search · animations · toast)
    │       ├── icons/ · fonts/ · images/
    │       └── showcase/  (docs site)
    ├── backend/
    ├── docs/
    ├── engineering/
    ├── scripts/
    ├── tests/
    ├── deployment/
    └── .github/workflows/

Relative paths from each location to ASLDS:

    From packages/aslds/showcase/*.html
        → ../css/…  ·  ../js/…

    From packages/aslds/showcase/{foundations,components,guides}/*.html
        → ../../css/…  ·  ../../js/…

    From apps/{any-app}/*.html
        → ../../packages/aslds/css/…
        → ../../packages/aslds/js/…

Rule: Always reference ASLDS via relative paths. Never copy ASLDS files into
      apps/.

--------------------------------------------------------------------------------
36.9 WHAT NEVER TO DO
--------------------------------------------------------------------------------
❌ Inline <style> blocks for anything ASLDS already covers
❌ Inline <script> blocks for component behavior
❌ Hardcoded hex colors, pixel sizes, or z-indices
❌ Duplicating button, card, form, or nav markup by hand
❌ Adding data-theme manually to <html> (theme.js does it)
❌ Manually calling ASLDS.*.init() from a page
❌ Copying ASLDS CSS files into an app
❌ Using jQuery, Bootstrap, or any external UI library
❌ Creating a new search.css / new custom module without going through ASLDS

--------------------------------------------------------------------------------
36.10 WHEN SOMETHING IS MISSING
--------------------------------------------------------------------------------
If a page needs something ASLDS does not have:

    Step 1 — Verify it isn't already provided (grep through ASLDS docs).
    Step 2 — Ask: "Is this pattern reusable across 2+ pages?"
        • Yes → add it to ASLDS (CSS or JS)
        • No  → keep it page-local, minimal, and clearly named
                (prefix: .page-{app}-{feature} to avoid collisions)

    Step 3 — If added to ASLDS, update:
        • variables.css      (if new tokens)
        • components/*.css   (if new component)
        • js/*.js            (if new module)
        • This reference document (Section numbers)

Rule: Never ship a page with an undocumented new pattern.

================================================================================
END OF SECTION 36
================================================================================


================================================================================
SECTION 37 — CANONICAL PAGE TEMPLATE
The exact HTML skeleton every ASLDS page follows.
================================================================================

37.1 PURPOSE
--------------------------------------------------------------------------------
Every page inside every app (showcase, public-site, academy, ai, business-os,
portfolio, admin) starts from this skeleton. Deviations are allowed only for
page-type (docs vs app vs dashboard), which are documented at 37.4.

--------------------------------------------------------------------------------
37.2 THE TEMPLATE — SHOWCASE PAGE (docs)
File location: packages/aslds/showcase/components/buttons.html

<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="…">
    <meta name="author" content="A Square L Innovate">
    <meta name="theme-color" content="#0b0b0b">
    <title>Page Title • ASL Design System</title>

    <link rel="icon" type="image/png" href="../../images/favicon.png">
    <link rel="apple-touch-icon" href="../../images/favicon.png">

    <!-- Core CSS -->
    <link rel="stylesheet" href="../../css/reset.css">
    <link rel="stylesheet" href="../../css/variables.css">
    <link rel="stylesheet" href="../../css/typography.css">
    <link rel="stylesheet" href="../../css/layout.css">
    <link rel="stylesheet" href="../../css/utilities.css">
    <link rel="stylesheet" href="../../css/animations.css">

    <!-- Component CSS -->
    <link rel="stylesheet" href="../../css/components/navbar.css">
    <link rel="stylesheet" href="../../css/components/sidebar.css">
    <link rel="stylesheet" href="../../css/components/buttons.css">
    <link rel="stylesheet" href="../../css/components/cards.css">
    <link rel="stylesheet" href="../../css/components/forms.css">
    <link rel="stylesheet" href="../../css/components/dashboard.css">
    <link rel="stylesheet" href="../../css/components/footer.css">
    <link rel="stylesheet" href="../../css/components/badge.css">
    <link rel="stylesheet" href="../../css/components/alert.css">
    <link rel="stylesheet" href="../../css/components/progress.css">
    <link rel="stylesheet" href="../../css/components/avatar.css">
    <link rel="stylesheet" href="../../css/components/dropdown.css">
    <link rel="stylesheet" href="../../css/components/modal.css">
    <link rel="stylesheet" href="../../css/components/toast.css">
    <link rel="stylesheet" href="../../css/components/table.css">
    <link rel="stylesheet" href="../../css/components/tabs.css">

    <!-- Documentation CSS -->
    <link rel="stylesheet" href="../../css/showcase.css">

    <!-- Google Fonts + Font Awesome -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>

    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Page wrapper -->
    <div class="page-wrapper">

        <!-- Navbar -->
        <header class="navbar">
            <div class="navbar-container">
                <a href="../index.html" class="navbar-logo" aria-label="ASL Design System">
                    <strong>ASLDS</strong>
                </a>

                <button
                    class="mobile-toggle"
                    type="button"
                    aria-label="Toggle Navigation"
                    aria-expanded="false"
                    aria-controls="primary-navigation"
                >
                    <span></span><span></span><span></span>
                </button>

                <nav id="primary-navigation" aria-label="Primary Navigation">
                    <ul class="nav-menu">
                        <li><a href="../index.html" class="nav-link">Home</a></li>
                        <li><a href="../getting-started.html" class="nav-link">Getting Started</a></li>
                        <li><a href="../installation.html" class="nav-link">Installation</a></li>
                        <li><a href="../playground.html" class="nav-link">Playground</a></li>
                        <li><a href="buttons.html" class="nav-link active" aria-current="page">Components</a></li>
                    </ul>
                </nav>

                <div class="nav-actions">
                    <button class="nav-search" type="button">Search</button>
                    <button class="btn btn-outline" type="button" data-theme-toggle>Theme</button>
                    <button class="btn btn-secondary" type="button">GitHub</button>
                    <span class="badge">v1.1 Stable</span>
                </div>
            </div>
        </header>

        <!-- Main content -->
        <main id="main-content" class="main-content">

            <!-- Breadcrumb -->
            <section class="section">
                <div class="container">
                    <nav aria-label="Breadcrumb">
                        <a href="../index.html">Home</a> /
                        <a href="../index.html">Components</a> /
                        <span>Buttons</span>
                    </nav>
                </div>
            </section>

            <!-- Hero -->
            <section class="hero">
                <div class="container">
                    <div class="hero-grid">
                        <div class="hero-content">
                            <span class="hero-badge">Component</span>
                            <h1 class="hero-title">Buttons</h1>
                            <p class="hero-tagline">Short tagline.</p>
                            <p class="hero-description">Long description.</p>
                            <div class="hero-actions">
                                <button class="btn btn-primary">Copy Component</button>
                                <span class="badge">Version 1.1 Stable</span>
                            </div>
                        </div>
                        <aside class="hero-panel card">
                            <div class="card-body">
                                <h3>On This Page</h3>
                                <ul>
                                    <li>Introduction</li>
                                    <li>Anatomy</li>
                                    <li>Variants</li>
                                </ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            <!-- Content sections -->
            <section id="introduction" class="section">
                <div class="container">
                    <header class="section-header">
                        <span class="section-label">Overview</span>
                        <h2>Section Title</h2>
                        <p>Section description.</p>
                    </header>

                    <div class="card-grid documentation-grid">
                        <article class="card documentation-card">
                            <div class="card-body">
                                <h3>Card Title</h3>
                                <p>Card body.</p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <!-- Previous / Next navigation -->
            <section class="section">
                <div class="container">
                    <div class="page-navigation">
                        <a href="previous.html" class="btn btn-outline">← Previous<br>Previous</a>
                        <a href="next.html" class="btn btn-primary">Next →<br>Next</a>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="footer" role="contentinfo">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <h3>ASL Design System</h3>
                        <p>Description.</p>
                        <div class="social-links">
                            <a href="…" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                        </div>
                    </div>
                    <div class="footer-links">
                        <h4>Documentation</h4>
                        <ul>…</ul>
                    </div>
                    <div class="footer-links">
                        <h4>Foundations</h4>
                        <ul>…</ul>
                    </div>
                    <div class="footer-links">
                        <h4>Components</h4>
                        <ul>…</ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>© 2026 A Square L Innovate. All rights reserved.</p>
                    <span class="badge">ASLDS v1.1 Stable</span>
                </div>
            </div>
        </footer>

    </div>

    <!-- Accessibility regions -->
    <div id="live-region" class="sr-only" aria-live="polite" aria-atomic="true"></div>
    <section id="toast-region" aria-live="polite" aria-label="Toast Notifications"></section>
    <dialog id="modal-root" aria-label="Application Modal"></dialog>

    <!-- JavaScript — order matters -->
    <script src="../../js/app.js"></script>
    <script src="../../js/navbar.js"></script>
    <script src="../../js/sidebar.js"></script>
    <script src="../../js/tabs.js"></script>
    <script src="../../js/dropdown.js"></script>
    <script src="../../js/modal.js"></script>
    <script src="../../js/theme.js"></script>
    <script src="../../js/playground.js"></script>
    <script src="../../js/search.js"></script>
    <script src="../../js/animations.js"></script>
    <script src="../../js/toast.js"></script>

</body>
</html>

--------------------------------------------------------------------------------
37.3 TEMPLATE — PUBLIC-SITE / APP PAGE
File location: apps/public-site/index.html

Same as above, except:

    CSS paths:    ../../packages/aslds/css/…
    JS paths:     ../../packages/aslds/js/…
    Icons path:   assets/images/favicon.png
    Logo path:    assets/images/logo.png

Remove:
    • showcase.css  (docs-only stylesheet — apps don't need it)
    • Breadcrumb section
    • "On This Page" hero panel

Add:
    • Page-specific sections as needed
    • Real navigation (About, Products, Academy, etc.)
    • App-specific footer content

Do NOT add:
    • <style> block for colors, spacing, buttons, cards
    • <script> block for toggle, modal, theme, search behavior

--------------------------------------------------------------------------------
37.4 TEMPLATE — DASHBOARD PAGE (Academy / Admin / Business OS)
File location: apps/academy/dashboard.html

Uses layout.css .dashboard-layout:

    <div class="page-wrapper">
        <header class="navbar">…</header>

        <div class="dashboard-layout">
            <aside class="sidebar">
                <div class="sidebar-header">…</div>
                <nav class="sidebar-nav">
                    <ul class="sidebar-menu">
                        <li class="sidebar-item">
                            <a href="/dashboard" class="sidebar-link active" aria-current="page">
                                <i class="fa-solid fa-home"></i> Dashboard
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main class="dashboard-content">
                <header class="dashboard-header">
                    <h1 class="dashboard-title">Dashboard</h1>
                </header>
                <div class="dashboard-body">
                    <div class="dashboard-stats">…</div>
                    <div class="dashboard-grid">…</div>
                </div>
            </main>
        </div>

        <footer class="footer">…</footer>
    </div>

Rules:
    • Same CSS imports as showcase (with correct relative paths)
    • Same JS scripts at the bottom
    • Sidebar + Modal + Dropdown + Toast + Tabs all loaded
    • No page-specific <script> block — sidebar.js, modal.js handle their parts

--------------------------------------------------------------------------------
37.5 SCRIPT LOADING RULES
--------------------------------------------------------------------------------
Order is NOT optional:

    1. app.js             — the runtime
    2. navbar.js          — depends on runtime
    3. sidebar.js         — depends on runtime
    4. tabs.js            — depends on runtime
    5. dropdown.js        — depends on runtime
    6. modal.js           — depends on runtime
    7. theme.js           — depends on runtime + storage
    8. playground.js      — depends on all others (showcase only)
    9. search.js          — depends on runtime + injects CSS
    10. animations.js     — depends on runtime
    11. toast.js          — depends on runtime

Rule: Load app.js FIRST, everything else after.
Rule: Never use type="module" — the modules are IIFE, not ES modules.

Load only what the page needs:

    Showcase page:      all 11 scripts
    Public site page:   all except playground.js
    App dashboard:      all except playground.js and search.js (unless used)
    Auth page:          app · theme · toast · modal

Rule: Over-include rather than under-include. Runtime handles missing DOM
      gracefully (modules silently no-op if their selector isn't found).

--------------------------------------------------------------------------------
37.6 PATH RULES PER LOCATION
--------------------------------------------------------------------------------
From packages/aslds/showcase/*.html → ASLDS is one level up:

    <link rel="stylesheet" href="../css/variables.css">
    <script src="../js/app.js"></script>
    <img src="../images/logo.png" alt="…">

From packages/aslds/showcase/{foundations,components,guides}/*.html → two up:

    <link rel="stylesheet" href="../../css/variables.css">
    <script src="../../js/app.js"></script>
    <img src="../../images/logo.png" alt="…">

From apps/{public-site,academy,ai,business-os,portfolio,admin}/*.html → two up:

    <link rel="stylesheet" href="../../packages/aslds/css/variables.css">
    <script src="../../packages/aslds/js/app.js"></script>
    <img src="assets/images/logo.png" alt="…">
    <link rel="icon" href="assets/images/favicon.png">

Rule: Never copy ASLDS CSS or JS into apps/. Always reference via relative path.

--------------------------------------------------------------------------------
37.7 FAVICON
--------------------------------------------------------------------------------
Every page includes:

    <link rel="icon" type="image/png" href="[path]/favicon.png">
    <link rel="apple-touch-icon" href="[path]/favicon.png">

Locations:

    packages/aslds/showcase/*.html            → ../images/favicon.png
    packages/aslds/showcase/**/*.html         → ../../images/favicon.png
    apps/{any-app}/*.html                     → assets/images/favicon.png

Rule: One favicon file per app + one canonical favicon in packages/aslds/images/.

--------------------------------------------------------------------------------
37.8 VERIFICATION CHECKLIST
--------------------------------------------------------------------------------
Before committing any page, verify:

    [ ] DOCTYPE html + <html lang="en" data-theme="dark">
    [ ] <meta viewport> present
    [ ] <title> present, unique, ends with " • ASL Design System" (showcase)
    [ ] Favicon linked (relative, correct depth)
    [ ] All ASLDS core CSS linked in order
    [ ] All needed component CSS linked
    [ ] Showcase CSS linked (docs pages only)
    [ ] Skip link present as first element in <body>
    [ ] .page-wrapper wraps everything
    [ ] <header class="navbar"> present
    [ ] <main id="main-content" class="main-content">
    [ ] <footer class="footer" role="contentinfo">
    [ ] Accessibility regions present (live-region, toast-region, modal-root)
    [ ] app.js loaded FIRST
    [ ] All needed scripts loaded in order
    [ ] No inline <style> for ASLDS-covered styles
    [ ] No inline <script> for component behavior
    [ ] No hardcoded colors, sizes, or z-indices
    [ ] All interactive elements are button/a/input
    [ ] All icon-only buttons have aria-label
    [ ] Only one <h1> per page
    [ ] All images have alt (or alt="" if decorative)
    [ ] All external links have rel="noopener" if target="_blank"

--------------------------------------------------------------------------------
37.9 WHAT THE RUNTIME DOES FOR YOU (NO PAGE CODE NEEDED)
--------------------------------------------------------------------------------
Do NOT add these — the runtime handles them automatically:

    ❌ ASLDS.init()            → auto-fires on window load
    ❌ Module .init() calls     → register() handles them
    ❌ Theme toggle listeners   → theme.js wires [data-theme-toggle]
    ❌ Search open on Ctrl+K    → search.js handles
    ❌ Mobile menu toggle       → navbar.js handles
    ❌ Sidebar toggle           → sidebar.js handles
    ❌ Tab switching            → tabs.js handles
    ❌ Dropdown open/close      → dropdown.js handles
    ❌ Modal open/close         → modal.js handles
    ❌ Toast display            → call ASLDS.Toast.show() from code
    ❌ Scroll animation trigger → animations.js handles
    ❌ Body scroll lock on modal → modal.js handles

If you find yourself writing any of the above in a page script — stop. It
already exists.

--------------------------------------------------------------------------------
37.10 THE ONE-LINE RULE
--------------------------------------------------------------------------------
If a page has more than ~30 lines of inline CSS or any inline JS that
manipulates a component, something is wrong. Audit against Section 36 and
the module docs.

Rule: A well-built ASLDS page has ZERO inline <style> and ZERO inline <script>
      beyond simple initialization calls (which the runtime does for you).

================================================================================
END OF SECTION 37
================================================================================

================================================================================
END OF ASLDS REFERENCE DOCUMENT
================================================================================