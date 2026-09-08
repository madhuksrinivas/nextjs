# Global Toast Notifications

A single global toast provider mounted at the root layout allows any client
component to display temporary notifications without managing local state.

## Architecture

**Toast Provider (Context + Component):**

- [components/toast-bar/toast-context.js](../components/toast-bar/toast-context.js)
  — exports:
  - `ToastProvider` — wraps the app and renders a single `<ToastNotification>`,
    manages `open`, `message`, and `type` state.
  - `useToast()` — hook that returns `showToast(message, type)` function.

**Toast UI:**

- [components/toast-bar/toast-notification.js](../components/toast-bar/toast-notification.js)
  — renders as a `<dialog>` positioned fixed at top-right, no backdrop.
- [components/toast-bar/toast-notification.module.css](../components/toast-bar/toast-notification.module.css)
  — dark theme styling matching app colors (`#1c2027` bg, `#454952` border).

**Root Layout:**

- [app/layout.js](../app/layout.js) — wraps `{children}` with `<ToastProvider>`.

## Usage

From any client component (even deeply nested):

```js
import { useToast } from "../components/toast-bar/toast-context";

export default function MyComponent() {
  const showToast = useToast();

  function handleSave() {
    showToast("Changes saved!", "success");
  }

  function handleError() {
    showToast("Something went wrong.", "error");
  }

  return <button onClick={handleSave}>Save</button>;
}
```

Used in:

- `VerifyMealForm` — after OTP sent/verified.
- `ShareMealForm` — (can be added) for meal save success/failure.
- Any other component that needs quick feedback.

## Why Context + useToast()?

Avoids repeatedly importing/rendering `<ToastNotification>` in each component
and managing redundant open/message/type state. One provider at the root,
called via a hook from anywhere.

## Limitation

Server Components and Server Actions cannot call `useToast()` (it's a hook).
Trigger toasts only from event handlers or effects in Client Components, or
have a Client Component wrapper trigger the toast based on Server Action
results passed via `useActionState`.
