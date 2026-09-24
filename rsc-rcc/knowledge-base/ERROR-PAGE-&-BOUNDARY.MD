# Error Pages and Error Boundaries in Next.js

Next.js App Router provides special files for handling errors and missing content. These files let you show a useful fallback UI instead of leaving the user with a broken page.

## Error handling overview

| File                  | Purpose                                                                             |
| --------------------- | ----------------------------------------------------------------------------------- |
| `error.jsx`           | Handles unexpected errors in a route segment and its children                       |
| `global-error.jsx`    | Handles errors in the root layout or template                                       |
| `not-found.jsx`       | Displays a not-found page for a route segment                                       |
| `global-not-found.js` | Handles unmatched routes across the application when enabled by the Next.js version |
| `loading.jsx`         | Displays a loading UI while a route segment is rendering                            |

## `error.jsx`

Create an `error.jsx` file inside a route segment to make that segment an error boundary:

```text
app/
	products/
		error.jsx
		page.jsx
```

The error boundary catches errors from the segment's page and child segments. It must be a Client Component because it uses the `reset` callback and can contain event handlers.

```jsx
// app/products/error.jsx
"use client";

export default function ProductsError({ error, reset }) {
  return (
    <main>
      <h2>Something went wrong</h2>
      <p>We could not load the products.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
```

### The `error` prop

The `error` prop contains the error that was thrown. In production, sensitive server details are not exposed to the browser. The `digest` value can help match the client error with server logs.

```jsx
"use client";

export default function Error({ error, reset }) {
  console.error(error);

  return (
    <section>
      <p>Unable to complete this request.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
```

Avoid rendering `error.message` directly when it may contain sensitive server information. Show a safe user-facing message and log useful details securely.

### The `reset` function

Calling `reset()` asks Next.js to re-render the failed route segment. It is useful for temporary failures such as a network problem.

```jsx
<button type="button" onClick={() => reset()}>
  Retry
</button>
```

`reset()` does not fix the underlying problem automatically. If the database or API is still unavailable, the boundary may appear again.

## `not-found.jsx`

Use `notFound()` when a requested resource does not exist. This is different from an unexpected error: missing data is an expected result and should receive a not-found response.

```jsx
// app/products/[id]/page.jsx
import { notFound } from "next/navigation";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </main>
  );
}
```

Add a not-found UI to the route segment:

```jsx
// app/products/[id]/not-found.jsx
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main>
      <h2>Product not found</h2>
      <p>The product may have been removed or the URL may be incorrect.</p>
      <Link href="/products">View all products</Link>
    </main>
  );
}
```

## `global-error.jsx`

Use `global-error.jsx` for errors in the root layout. Because the root layout may not be available when this boundary renders, it must provide its own `<html>` and `<body>` elements.

```jsx
// app/global-error.jsx
"use client";

export default function GlobalError({ reset }) {
  return (
    <html>
      <body>
        <h1>Application error</h1>
        <button type="button" onClick={() => reset()}>
          Reload application
        </button>
      </body>
    </html>
  );
}
```

This is a last-resort boundary. Prefer placing `error.jsx` closer to the route that can fail so the rest of the application remains usable.

## Error boundaries and `Suspense`

`Suspense` and error boundaries handle different states:

- `loading.jsx` or `Suspense` handles work that is still pending.
- `error.jsx` handles an error that was thrown.
- `not-found.jsx` handles a resource that does not exist.

```text
Request starts
	-> loading UI while pending
	-> page UI when successful
	-> not-found UI when the resource does not exist
	-> error UI when an unexpected error is thrown
```

## Throwing errors in a Server Component

Throw an error when the operation cannot be completed:

```jsx
export default async function OrdersPage() {
  const response = await fetch("https://api.example.com/orders");

  if (!response.ok) {
    throw new Error("Orders request failed");
  }

  const orders = await response.json();

  return <OrderList orders={orders} />;
}
```

For a missing order, use `notFound()` instead of throwing a generic error. For expected form-validation errors, return a structured result from a Server Action instead of using an error boundary for normal validation feedback.

## Error boundaries do not catch everything

An `error.jsx` boundary does not replace all error handling. Be aware that:

- Errors in event handlers should be handled in the event handler or action.
- Errors in a Server Action should return safe form feedback or be handled by the appropriate boundary.
- Errors in middleware or some request-level code need their own handling strategy.
- Errors in the root layout require `global-error.jsx`.
- Errors that happen before a boundary is mounted may require a parent boundary.

## Do's

- Put `error.jsx` close to the route that needs a recovery UI.
- Add a retry button that calls `reset()` for temporary failures.
- Use `notFound()` for missing resources.
- Return safe, user-friendly messages instead of exposing internal errors.
- Log errors with enough context to diagnose them on the server.
- Add loading, empty, not-found, and error states where users need them.

## Don'ts

- Do not treat every missing resource as a server error.
- Do not display database errors, stack traces, or private API details to users.
- Do not assume `reset()` will fix a persistent backend failure.
- Do not forget the `"use client"` directive in `error.jsx` and `global-error.jsx`.
- Do not use an error boundary as a replacement for normal form validation.
- Do not rely only on development error messages, because production messages are intentionally more limited.

## Simple rule

**Use loading UI for pending work, not-found UI for missing content, and error boundaries for unexpected failures.**
