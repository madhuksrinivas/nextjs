# React Server Components (RSC) and React Client Components (RCC)

## Quick idea

In a Next.js App Router application, components can run in two different places:

- **RSC (React Server Component):** runs on the server. It can fetch data close to the database or API and sends rendered UI to the browser.
- **RCC (React Client Component):** runs in the browser. It is used when the UI needs interactivity, browser APIs, or client-side state.

The default in the `app` directory is a **Server Component**. Add the directive `'use client'` at the top of a file when that file should be a Client Component.

```jsx
// This is a Server Component by default.
export default async function ProductsPage() {
  const response = await fetch("https://example.com/api/products");
  const products = await response.json();

  return <ProductList products={products} />;
}
```

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## RSC: React Server Components

A Server Component is rendered outside the browser. It is a good place for work that does not need user interaction.

### What RSC is good at

- Fetching data from databases, APIs, and the file system.
- Keeping secrets such as API keys and database credentials on the server.
- Rendering content that is mostly read-only.
- Reducing the amount of JavaScript sent to the browser.
- Using `async` functions and awaiting data directly in the component.
- Preparing data before passing it to a Client Component.

### Example RSC

```jsx
// app/products/page.jsx
export default async function ProductsPage() {
  const products = await getProductsFromDatabase();

  return (
    <main>
      <h1>Products</h1>
      <ProductList products={products} />
    </main>
  );
}
```

## RCC: React Client Components

A Client Component is sent to the browser and can respond to user actions. The `'use client'` directive marks the boundary between server-only and client-capable code.

### What RCC is good at

- Handling events such as `onClick`, `onChange`, and `onSubmit`.
- Using React Hooks such as `useState`, `useEffect`, and `useReducer`.
- Reading browser APIs such as `localStorage`, `window`, and `navigator`.
- Creating interactive widgets, forms, menus, tabs, and animations.
- Managing temporary UI state such as an open menu or selected tab.

### Example RCC

```jsx
"use client";

import { useState } from "react";

export default function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <label>
      Search
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
    </label>
  );
}
```

## RSC vs RCC

| Topic                                  | RSC                                   | RCC                                          |
| -------------------------------------- | ------------------------------------- | -------------------------------------------- |
| Runs in                                | Server                                | Browser and server during the initial render |
| Default in `app` directory             | Yes                                   | No                                           |
| Can use state and effects              | No                                    | Yes                                          |
| Can use event handlers                 | No                                    | Yes                                          |
| Can access database and server secrets | Yes                                   | No                                           |
| Can use browser APIs                   | No                                    | Yes                                          |
| Can be an `async` component            | Yes                                   | Usually no for the component itself          |
| JavaScript sent to browser             | Less                                  | More                                         |
| Best for                               | Data fetching and static/read-only UI | Interactive UI and browser behavior          |

### Important relationship

A Server Component can render a Client Component directly:

```jsx
// Server Component
import AddToCartButton from "./AddToCartButton";

export default async function Product({ id }) {
  const product = await getProduct(id);

  return (
    <article>
      <h2>{product.name}</h2>
      <AddToCartButton productId={product.id} />
    </article>
  );
}
```

A Client Component cannot directly import a Server Component. However, an RCC can render server-provided content through the `children` prop. The RSC is rendered by the Server Component parent and passed into the RCC as a React node.

```jsx
// Server Component
import ProductDetails from "./ProductDetails";
import ProductShell from "./ProductShell";

export default async function ProductPage() {
  return (
    <ProductShell>
      <ProductDetails />
    </ProductShell>
  );
}
```

```jsx
// Client Component
"use client";

export default function ProductShell({ children }) {
  return (
    <section>
      <button type="button">Add to cart</button>
      {children}
    </section>
  );
}
```

In this example:

```text
RSC parent
  -> renders RCC
      -> receives RSC content through children
```

So the rule is:

- **RSC can render RCC.**
- **RCC cannot directly import or render an RSC.**
- **RCC can display RSC content passed through `children` or another React node prop.**

## Do's and don'ts for RSC

### Do

- Keep components as Server Components unless they need browser behavior.
- Fetch data in the Server Component closest to where it is needed.
- Access databases, private services, and secrets only on the server.
- Pass serializable data to Client Components, such as strings, numbers, arrays, and plain objects.
- Use `loading.jsx`, `error.jsx`, or `Suspense` for useful loading and error states.
- Keep server-only logic in server modules and use `server-only` when helpful to prevent accidental imports.

### Don't

- Do not use `useState`, `useEffect`, or event handlers in a Server Component.
- Do not access `window`, `document`, `localStorage`, or other browser-only APIs.
- Do not expose API keys, database credentials, or private environment variables in props.
- Do not add `'use client'` just because a component renders HTML.
- Do not pass functions, class instances, database connections, or other non-serializable values to a Client Component.
- Do not fetch the same data again in the browser when the server can provide it safely and efficiently.

## Do's and don'ts for RCC

### Do

- Put `'use client'` at the top of the file, before imports.
- Keep the Client Component boundary as small as possible.
- Use Client Components for events, state, effects, and browser APIs.
- Receive server-fetched data through props when appropriate.
- Validate user input on the server as well as in the browser.
- Move reusable interactive behavior into focused components.

### Don't

- Do not put `'use client'` on the root layout or an entire page unless it truly needs to be client-side.
- Do not put database queries or secret-bearing code in a Client Component.
- Do not assume client-side checks provide security; the server must authorize requests.
- Do not use `useEffect` for data that can be fetched in a Server Component.
- Do not pass non-serializable props from an RSC to an RCC.
- Do not turn every component into a Client Component by default, because this increases browser JavaScript and can hurt performance.

## How to choose

Ask these questions when creating a component:

1.  **Does it need `useState`, `useEffect`, an event handler, or a browser API?** - Yes: make it an RCC. - No: keep it as an RSC.
2.  **Does it need a database, private API, or secret?** - Yes: keep that work in an RSC or another server-side function.
3.  **Can the page be split?** - Keep the data-fetching and layout in an RSC. - Extract only the interactive part into a small RCC.

A common pattern is:

```text
RSC page
	 -> fetches data
	 -> renders the page layout
	 -> passes serializable data to a small RCC
				-> handles clicks, typing, and local UI state
```

## Simple rule to remember

**Server Components fetch and prepare. Client Components interact and react.**

Keep the server boundary where data and secrets belong, and keep the client boundary where the user needs immediate interaction.
