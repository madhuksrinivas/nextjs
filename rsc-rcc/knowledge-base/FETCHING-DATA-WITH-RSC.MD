# Fetching Data with React Server Components

React Server Components are a natural place to fetch data because they run on the server. A Server Component can be `async`, wait for data with `await`, and pass the result to the UI without sending the data-fetching code to the browser.

## Fetch data with the Fetch API

```jsx
// app/products/page.jsx
export default async function ProductsPage() {
  const response = await fetch("https://api.example.com/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await response.json();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

## Why use `fetch` in an RSC?

- Data is fetched on the server instead of in the browser.
- Private API keys and server credentials stay on the server.
- The component can render with its data on the initial request.
- You do not need `useEffect` for the initial data fetch.
- Less data-fetching JavaScript is sent to the browser.

## Loading and error states

Use `loading.jsx` to show a temporary UI while the Server Component is waiting for data:

```jsx
// app/products/loading.jsx
export default function Loading() {
  return <p>Loading products...</p>;
}
```

Use `error.jsx` to display an error UI when the page throws an error:

```jsx
// app/products/error.jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <main>
      <p>Could not load products.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
```

## Caching and revalidation

Choose a caching strategy based on how often the data changes. The exact defaults can vary between Next.js versions, so specify the behavior when it matters.

### Revalidate after a period

This allows Next.js to reuse the response and refresh it after the specified number of seconds:

```jsx
const response = await fetch("https://api.example.com/products", {
  next: { revalidate: 60 },
});
```

### Request fresh data

Use this when the response must be fetched again for each request:

```jsx
const response = await fetch("https://api.example.com/products", {
  cache: "no-store",
});
```

### Use cached data

Use this when the data can be reused:

```jsx
const response = await fetch("https://api.example.com/products", {
  cache: "force-cache",
});
```

## Fetching from a database

You do not have to use `fetch` for every data source. In an RSC, you can call a server-side database function directly:

```jsx
// app/products/page.jsx
import { getProducts } from "@/lib/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return <ProductList products={products} />;
}
```

Direct database access is often better than calling your own API route from a Server Component because it avoids an unnecessary HTTP request.

## Passing fetched data to an RCC

Fetch data in the RSC, then pass serializable data to a Client Component when interaction is needed:

```jsx
// Server Component
import FilteredProducts from "./FilteredProducts";

export default async function ProductsPage() {
  const response = await fetch("https://api.example.com/products");
  const products = await response.json();

  return <FilteredProducts products={products} />;
}
```

```jsx
// Client Component
"use client";

import { useState } from "react";

export default function FilteredProducts({ products }) {
  const [query, setQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <section>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
      />

      {filteredProducts.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </section>
  );
}
```

## Do's

- Make the Server Component `async` when it needs to await data.
- Check `response.ok` before calling `response.json()`.
- Keep API keys and private environment variables on the server.
- Choose an explicit caching or revalidation strategy for important requests.
- Use `loading.jsx`, `error.jsx`, or `Suspense` for a better user experience.
- Pass only serializable values to Client Components.
- Call database functions directly from RSCs when appropriate.

## Don'ts

- Do not use `useEffect` just to perform the initial server data fetch.
- Do not expose private credentials to a Client Component.
- Do not call your own API route from an RSC when a direct server function is available.
- Do not assume a failed HTTP request always throws an error; check `response.ok`.
- Do not pass database connections, functions, or class instances to an RCC.
- Do not fetch interactive, user-specific data only once on the server if it must update immediately in the browser.

## Simple rule

**Fetch and prepare data in an RSC. Add an RCC only when the user needs interaction with that data.**
