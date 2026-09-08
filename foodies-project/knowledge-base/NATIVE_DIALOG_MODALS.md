# Native Dialog Elements

This project uses native HTML `<dialog>` elements (not third-party modal
libraries) for modals and toast notifications. The native API is simple,
accessible, and handles backdrop + focus-trapping natively.

## Dialog Basics

Native `<dialog>` provides:

- `.showModal()` — open with a backdrop (dimmed background).
- `.close()` — close the dialog.
- `.open` — read-only boolean, true if the dialog is open.
- `::backdrop` pseudo-element — style the dimmed overlay.
- Built-in focus trap and Escape-to-close.

## Modals in this project

**OTP Verification Modal:**

- [components/meal-verification/verify-meal-form.js](../components/meal-verification/verify-meal-form.js)
  — `<dialog ref={dialogRef}>` with 6 digit-input boxes.
- Opens via `dialogRef.current.showModal()` when `open` prop becomes true.
- Closes via `dialogRef.current.close()` on success or cancel.
- Styled in [verify-meal-form.module.css](../components/meal-verification/verify-meal-form.module.css).

**Toast Notifications:**

- [components/toast-bar/toast-notification.js](../components/toast-bar/toast-notification.js)
  — `<dialog ref={toastRef}>` positioned fixed, no backdrop.
- Opens/closes via `toastRef.current.showModal()` / `close()`.
- Styled in [toast-notification.module.css](../components/toast-bar/toast-notification.module.css).

## CSS reset for native dialogs

Both dialogs reset browser defaults:

```css
.dialog {
  border: 1px solid #454952;
  border-radius: 8px;
  padding: 2rem;
  background: #1c2027;
  /* etc. */
}

.dialog::backdrop {
  background: rgba(0, 0, 0, 0.7); /* or transparent for toast */
}
```

Without these, the browser renders a centered box with default styling.

## Ref + useEffect pattern

```js
const dialogRef = useRef();

useEffect(() => {
  const dialog = dialogRef.current;
  if (!dialog) return;

  if (open && !dialog.open) {
    dialog.showModal(); // open
  } else if (!open && dialog.open) {
    dialog.close(); // close
  }
}, [open]);

return <dialog ref={dialogRef}>...</dialog>;
```

Syncs the `open` prop with the actual `.open` state of the element.

## Browser support

Native `<dialog>` is well-supported in modern browsers (Chrome 37+, Firefox
98+, Safari 15.4+, Edge 79+). For older browsers, a polyfill like
[dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill) can be
added.
