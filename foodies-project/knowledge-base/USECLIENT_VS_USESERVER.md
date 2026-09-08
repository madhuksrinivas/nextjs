# Next.js App Router: `use client` vs `use server`

In the Next.js App Router, components are **Server Components by default**.

You only add a directive when you need to change that default behavior:

- Use `"use client"` when a component must run in the browser.
- Use `"use server"` when a function must run on the server, usually as a Server Action.
- Use no directive for normal Server Components.

## Quick Comparison

| Feature                      | `"use client"`                                 | `"use server"`                                           |
| ---------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| Runs where?                  | Browser/client                                 | Server                                                   |
| Used for                     | Interactive components                         | Server Actions and server-only functions                 |
| Common examples              | Buttons, forms with state, modals, dropdowns   | Database writes, file uploads, authentication, mutations |
| Can use React hooks?         | Yes, like `useState`, `useEffect`, `useRef`    | No client hooks                                          |
| Can access browser APIs?     | Yes, like `window`, `document`, `localStorage` | No                                                       |
| Can access secrets/database? | No                                             | Yes                                                      |
| Where is it written?         | Top of a component file                        | Inside a server function or top of a server actions file |

## The Default: Server Components

In the App Router, this is a Server Component by default:

```jsx
export default async function MealsPage() {
  const meals = await getMeals();

  return <MealList meals={meals} />;
}
```

This component can fetch data on the server before rendering.

It does **not** need `"use server"` because App Router components already run on the server by default.

Use Server Components for:

- fetching data
- rendering static or dynamic content
- reading from a database
- accessing environment variables
- keeping large dependencies out of the browser bundle

## When To Use `"use client"`

Add `"use client"` at the **top of the file** when the component needs browser interactivity.

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

This needs `"use client"` because it uses:

- `useState`
- `onClick`
- browser-side interaction

Use `"use client"` when your component uses:

- `useState`
- `useEffect`
- `useRef`
- `useReducer`
- event handlers like `onClick`, `onChange`, `onSubmit`
- browser APIs like `window`, `document`, `localStorage`, `navigator`
- interactive UI like tabs, modals, menus, filters, counters, search boxes, sliders
- third-party libraries that depend on the browser

### Example: Search Input

```jsx
"use client";

export default function SearchBox() {
  return (
    <input
      type="search"
      placeholder="Search meals..."
      onChange={(event) => console.log(event.target.value)}
    />
  );
}
```

The `onChange` handler runs in the browser, so this must be a Client Component.

## When To Use `"use server"`

Use `"use server"` for server-only functions, especially **Server Actions**.

Server Actions let forms or Client Components call server-side code without creating a separate API route manually.

```jsx
export default function NewMealPage() {
  async function createMeal(formData) {
    "use server";

    const title = formData.get("title");

    // Save to database here.
  }

  return (
    <form action={createMeal}>
      <input name="title" />
      <button type="submit">Save</button>
    </form>
  );
}
```

The form appears in the UI, but `createMeal` runs on the server.

Use `"use server"` for:

- database inserts, updates, and deletes
- form submissions
- authentication and authorization checks
- reading or writing files
- accessing private environment variables
- secure business logic
- calling private backend services
- mutations that should not run in the browser

### Separate Server Action File

You can also put Server Actions in a separate file:

```js
"use server";

export async function saveMeal(formData) {
  const title = formData.get("title");

  // Save meal to database.
}
```

When `"use server"` is at the top of a file, all exported functions in that file are treated as server functions.

## Recommended Pattern

Keep most of the page as a Server Component, then move only the interactive part into a small Client Component.

### Server Component

```jsx
import SearchBox from "./SearchBox";

export default async function MealsPage() {
  const meals = await getMeals();

  return (
    <>
      <SearchBox />
      <MealList meals={meals} />
    </>
  );
}
```

### Client Component

```jsx
"use client";

export default function SearchBox() {
  return <input onChange={(event) => console.log(event.target.value)} />;
}
```

This keeps the page fast and server-rendered while only sending the interactive search box to the browser.

## Important Rules

- `"use client"` must be the first statement in the file, before imports.
- `"use server"` must be inside a server function or at the top of a module that exports server functions.
- Do not put secrets, database credentials, or private API keys in Client Components.
- Server Components can import Client Components.
- Client Components should not directly import Server Components.
- Client Components can receive data from Server Components through props.
- Once a file is marked `"use client"`, the code imported by that component can become part of the client bundle.

## Common Mistakes

### Mistake 1: Adding `"use client"` to every component

Do not make every component a Client Component.

Only use `"use client"` for components that actually need browser interactivity.

### Mistake 2: Using `useState` in a Server Component

This will fail:

```jsx
export default function Counter() {
  const [count, setCount] = useState(0);

  return <button>{count}</button>;
}
```

Fix it by adding `"use client"` at the top:

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button>{count}</button>;
}
```

### Mistake 3: Putting secrets in a Client Component

Never do this:

```jsx
"use client";

const apiKey = process.env.SECRET_API_KEY;
```

Secrets belong on the server.

## Decision Guide

Ask these questions:

1. Does this component use `useState`, `useEffect`, or browser events?

   Use `"use client"`.

2. Does this code access the database, file system, secrets, or private backend logic?

   Keep it on the server. If it is a callable action, use `"use server"`.

3. Is this component just fetching data and rendering UI?

   Use the default Server Component. No directive needed.

## Short Version

```txt
Server Component -> default in App Router
Client Component -> add "use client"
Server Action    -> add "use server"
```

Remember:

- `"use client"` means this component needs the browser.
- `"use server"` means this function must run on the server.
- No directive usually means a Server Component.
