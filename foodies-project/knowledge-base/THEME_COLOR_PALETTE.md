# Theming and Dark Mode Color Palette

All UI components follow a consistent dark theme with orange accents.
Colors, fonts, and spacing are reused across the app for a cohesive look.

## Color Palette

| Element           | Color                  | Usage                               |
| ----------------- | ---------------------- | ----------------------------------- |
| Background (dark) | `#1c2027`              | Input backgrounds, card backgrounds |
| Background (grid) | `#282c34`              | Body background gradient            |
| Border/outline    | `#454952`              | Input borders, dialog borders       |
| Text (primary)    | `#ddd6cb`              | Body text, labels                   |
| Text (secondary)  | `#b3aea5`              | Placeholder, muted text             |
| Accent (start)    | `#f9572a`              | Gradient start (orange-red)         |
| Accent (end)      | `#ff9b05` or `#ffc905` | Gradient end (yellow-orange)        |
| Accent (focus)    | `#f99f2a`              | Input focus outline                 |
| Success           | `#2fae5a`              | Toast success border                |
| Error/Alert       | `#f9572a`              | Toast error border, error text      |

## Fonts

- **Serif/Display**: `"Montserrat", sans-serif` — headings, labels, buttons.
- **Body**: `"Quicksand", sans-serif` — paragraph text, input text.
- Imported from Google Fonts in [app/globals.css](../app/globals.css).

## Spacing & sizing conventions

- **Padding**: `0.5rem`, `1rem`, `1.5rem`, `2rem`.
- **Gap**: `0.5rem` (compact), `1rem` (standard), `1.5rem` (large).
- **Border radius**: `4px` (inputs, buttons), `8px` (modals/cards).
- **Button height**: `2.5rem` (standard form height).
- **Max-width**: `40rem` (forms), `50rem` (pages), `75rem` (layouts).

## Components using the theme

- [app/meals/share/page.module.css](../app/meals/share/page.module.css) —
  form inputs, action buttons (baseline style).
- [components/meals/search.module.css](../components/meals/search.module.css)
  — search input and button.
- [components/meal-verification/verify-meal-form.module.css](../components/meal-verification/verify-meal-form.module.css)
  — OTP modal and inputs.
- [components/toast-bar/toast-notification.module.css](../components/toast-bar/toast-notification.module.css)
  — toast notifications.
- [app/globals.css](../app/globals.css) — global overrides and font setup.

## How to add new components

1. **Colors**: use CSS custom properties or inline hex values from the table.
2. **Fonts**: import Montserrat/Quicksand via `font-family` in component CSS.
3. **States**:
   - `:focus` → `outline-color: #f99f2a; background: #1f252d;`
   - `:hover` (buttons) → brighter gradient or lifted shadow.
   - `:disabled` → `#ccc` background, `#979797` text, `cursor: not-allowed`.
4. **Reference**: check existing `.module.css` files (e.g.
   `search.module.css`, `verify-meal-form.module.css`) for copy-paste patterns.

## Testing the theme

Open browser DevTools and toggle between light/dark themes (if supported),
or validate colors against the table above in each component's CSS.
