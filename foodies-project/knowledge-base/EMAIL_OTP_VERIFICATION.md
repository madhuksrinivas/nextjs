# Email OTP Verification

Before a meal can be shared, the creator's email must be verified with a
6-digit one-time code sent by email.

## Files involved

- [lib/otp-store.js](../lib/otp-store.js) — in-memory OTP store (code,
  expiry, verified flag), cached on `global` like
  [lib/mongodb.js](../lib/mongodb.js) so it survives dev hot-reloads.
- [lib/email-verification.js](../lib/email-verification.js) — sends the code
  by email via Resend.
- [lib/action.js](../lib/action.js) — Server Actions:
  `requestMealVerificationCode`, `confirmMealVerificationCode`, `shareMeal`.
- [components/meal-verfication/verify-meal-form.js](../components/meal-verfication/verify-meal-form.js)
  — the OTP modal (native `<dialog>`), styled by
  [verify-meal-form.module.css](../components/meal-verfication/verify-meal-form.module.css)
  to match the app's dark theme.
- [components/meals/share-meal-form.js](../components/meals/share-meal-form.js)
  — reads the email input via `ref`, opens the modal, and swaps in the real
  "Share Meal" submit button once verification succeeds.

## Flow

1. User fills the form and clicks **Verify using email OTP**. The email
   value is read from the input via `ref` and passed to the modal.
2. The modal opens (`dialogRef.current.showModal()`) and immediately calls
   `requestMealVerificationCode(email)`, which:
   - generates a 6-digit code with `createOtp(email)`,
   - stores `{ code, expiresAt, verified: false }` in the OTP store (5 minute
     TTL),
   - emails the code via `sendVerificationCode`.
3. User enters the code into the 6 single-digit inputs and submits. This
   calls `confirmMealVerificationCode(email, code)` -> `verifyOtp()`, which
   checks the entry exists, hasn't expired, and matches. On success it sets
   `verified: true` on the store entry.
4. The modal closes and the "Share Meal" submit button is shown.
5. Submitting the main form runs `shareMeal`, which **re-validates**
   `isEmailVerified(mealData.creator_email)` on the server before saving —
   this is the authoritative check, since the client-side `isVerified` state
   only controls which button is rendered and could be bypassed.
6. On a successful save, `clearOtp(email)` removes the store entry so the
   same code can't be reused for a future submission.

## OTP Input field behavior

The OTP modal displays 6 single-digit input boxes with the following UX:

- **Auto-advance**: typing a digit automatically moves focus to the next box.
- **Backspace/Delete**: clearing a digit via Backspace or Delete moves focus
  to the previous box on the next keydown, allowing left-to-right deletion.
- **Validation**: the form won't submit unless all 6 digits are entered.
- **Key reset**: after successful verification or on modal close, all inputs
  are cleared.

## Production guidance

The OTP store is process-memory only. It resets on server restart and is not
shared across multiple server instances, so it is fine for local development
but should be replaced with a persistent, expiring store (e.g. a MongoDB
collection with a TTL index, or Redis) before deploying to a multi-instance
production environment.
