# Data Loading and Error Handling

## Database failures

The data functions in [lib/meals.js](../lib/meals.js) catch connection and query
failures. They log the technical error on the server and throw a safe message:

```text
Unable to load meals.
Unable to load this meal.
Unable to save your meal. Please try again.
```

The MongoDB helper also clears a failed connection promise so a later request can
retry the connection.

## Loading meals

The `/meals` page uses `Suspense` for its loading state and
[app/meals/error.js](../app/meals/error.js) for failures. The error boundary shows
a retry button that calls `reset()`.

```text
Suspense fallback -> data is still loading
app/meals/error.js -> loading the Meals route failed
app/error.js -> a general application error occurred
```

## Saving a meal

The Share Meal Server Action validates form data before calling `saveMeal()`.
Database, upload, and duplicate-slug errors are caught and returned through
`useActionState`. The form displays the returned form-level message without
exposing database credentials or stack traces.

Next.js `redirect()` is called after the `try/catch`, because `redirect()` uses an
internal thrown response to stop the Server Action and navigate successfully.

## Production guidance

Technical errors should remain in server logs. User-facing responses should stay
generic and should not include the MongoDB URI, credentials, stack trace, or raw
database error.
