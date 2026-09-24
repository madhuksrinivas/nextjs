# React `use()` Hook: Promises and Data Fetching

The React `use()` API can read a value from a Context or unwrap a Promise during rendering.

When `use()` reads a Promise, it works with `Suspense` to show a fallback while the Promise is pending. When the Promise resolves, React renders the component again with the resolved value.

> `use()` is available in React 19 and compatible frameworks such as modern Next.js versions.

## Using `use()` with Context

`use()` can read Context values just like `useContext()`:

```jsx
import { use } from "react";
import { ThemeContext } from "./ThemeContext";

export default function ThemeButton() {
  const theme = use(ThemeContext);

  return <button className={theme.buttonClass}>Save</button>;
}
```

One difference is that `use()` can be called inside conditions or loops, while regular Hooks such as `useContext()` must follow the Rules of Hooks.

## Using `use()` with a Promise

The usual pattern is:

1. Create or fetch the Promise outside the Client Component's render.
2. Pass the Promise to the Client Component.
3. Wrap the Client Component in `Suspense`.
4. Call `use(promise)` to read the resolved value.

### Server Component

```jsx
// app/page.jsx
import { Suspense } from "react";
import UserDetails from "./UserDetails";

function getUser() {
  return fetch("https://api.example.com/user").then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  });
}

export default function Page() {
  const userPromise = getUser();

  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
}
```

### Client Component

```jsx
// app/UserDetails.jsx
"use client";

import { use } from "react";

export default function UserDetails({ userPromise }) {
  const user = use(userPromise);

  return <h1>Welcome, {user.name}</h1>;
}
```

While `userPromise` is pending, `Suspense` displays `Loading user...`. Once it resolves, `use()` returns the user object.

## What kind of Promise can `use()` read?

`use()` can read a Promise that React can track, such as a Promise created outside the component render and passed into the component. In Next.js, a common pattern is creating the Promise in a Server Component and passing it to a Client Component.

Do not create a new Promise during every Client Component render:

```jsx
// Avoid this pattern.
"use client";

import { use } from "react";

export default function UserDetails() {
  const user = use(
    fetch("https://api.example.com/user").then((response) => response.json()),
  );

  return <p>{user.name}</p>;
}
```

Creating a new Promise during render can cause repeated requests or an unstable Suspense cycle. Create the Promise outside the render path, use a framework data-fetching API, or use a library that integrates with React Suspense.

## Error handling

If the Promise rejects, the nearest error boundary handles the error. `Suspense` handles the pending state; it does not replace an error boundary.

```jsx
// app/error.jsx
"use client";

export default function Error({ reset }) {
  return (
    <main>
      <p>Could not load the user.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
```

## `use()` compared with `useEffect`

Use `use()` with `Suspense` when data is part of the component's initial render and the Promise is supplied by the server or a Suspense-compatible data layer.

Use `useEffect` for browser-only side effects, such as subscribing to an event, synchronizing with an external browser API, or responding to a user interaction. Do not use `useEffect` just to fetch initial data that can be loaded in a Server Component.

## Do's

- Wrap Promise-reading components in `Suspense`.
- Create Promises outside the Client Component's render function.
- Prefer fetching initial data in a Server Component in Next.js.
- Pass Promises from a Server Component to a Client Component when streaming data is useful.
- Add an error boundary for rejected Promises.
- Use a data-fetching library when the application needs caching, refetching, or mutation support.

## Don'ts

- Do not create a new Promise during every Client Component render.
- Do not expect `Suspense` to handle rejected Promises by itself.
- Do not use `use()` as a replacement for every `useEffect` use case.
- Do not expose private API keys or server credentials in a Client Component.
- Do not pass database connections or other non-serializable values to the client.

## Simple rule

**Create the Promise outside the Client Component, pass it into the component, read it with `use()`, and wrap the component in `Suspense`.**
THe use() hook can be used for getting access to context.
It can also be used to await promises in CLient comp.
works together with suspense to handle data fetching and loading fallbacks.

use() for Promises requires "special promises", created via libraries that integrate with react suspense feature.
can't be used with promises we created.
