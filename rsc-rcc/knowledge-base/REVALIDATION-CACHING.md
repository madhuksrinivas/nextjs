# Caching and Revalidation in Next.js

Caching stores data or rendered output so it can be reused instead of being generated or fetched again. Revalidation is the process of refreshing cached data when it becomes stale.

Caching can improve performance, reduce API requests, and make pages load faster. The right strategy depends on how often the data changes.

## Common caching strategies

### Cache the response

Use `force-cache` when the data changes rarely and can be reused:

```jsx
const response = await fetch("https://api.example.com/products", {
  cache: "force-cache",
});

const products = await response.json();
```

### Request fresh data

Use `no-store` when the data must be fetched for every request:

```jsx
const response = await fetch("https://api.example.com/account", {
  cache: "no-store",
});
```

This is useful for highly dynamic or user-specific data.

### Revalidate after a period

Use time-based revalidation when cached data can remain fresh for a limited period:

```jsx
const response = await fetch("https://api.example.com/news", {
  next: { revalidate: 60 },
});
```

The cached response can be reused for up to 60 seconds. After that, Next.js can refresh the data when the route is requested again.

## Route-level revalidation

You can define a default revalidation period for a route:

```jsx
// app/news/page.jsx
export const revalidate = 60;

export default async function NewsPage() {
  const response = await fetch("https://api.example.com/news");
  const articles = await response.json();

  return <ArticleList articles={articles} />;
}
```

This gives the route a default revalidation interval. Individual `fetch` calls can still use their own caching options when needed.

## On-demand revalidation

Time-based revalidation is not always enough. After a product is created or updated, revalidate the affected page immediately from a Server Action or Route Handler.

### Revalidate a path

```jsx
"use server";

import { revalidatePath } from "next/cache";

export async function updateProduct(formData) {
  const productId = String(formData.get("productId"));

  await saveProduct(productId, {
    name: String(formData.get("name")),
  });

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
}
```

`revalidatePath` marks a route or page for fresh data the next time it is rendered.

## Revalidate with cache tags

Tags are useful when several pages use the same data. Add a tag to the fetch request:

```jsx
const response = await fetch("https://api.example.com/products", {
  next: { tags: ["products"] },
});
```

Then invalidate all requests using that tag:

```jsx
"use server";

import { revalidateTag } from "next/cache";

export async function updateProduct(formData) {
  await saveProduct({
    name: String(formData.get("name")),
  });

  revalidateTag("products", "max");
}
```

Use a descriptive tag such as `products`, `products:featured`, or `product:123` so you can invalidate the right group of data.

## Revalidation after a mutation

A common workflow is:

1. Receive submitted data in a Server Action.
2. Validate the input and check authorization.
3. Update the database.
4. Revalidate the affected path or tag.
5. Redirect or return the updated result.

```jsx
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData) {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return { error: "Product name is required" };
  }

  const product = await insertProduct({ name });

  revalidatePath("/products");
  redirect(`/products/${product.id}`);
}
```

## Caching database queries

`fetch` options do not automatically cache every database call. For database functions, use the caching API supported by your Next.js version or use a framework-compatible data layer.

Keep database access in a server-only module:

```jsx
// lib/products.js
import "server-only";

export async function getProducts() {
  return database.product.findMany();
}
```

Then call the function from a Server Component or Server Action. Do not import database modules into Client Components.

## Choosing a strategy

| Data type                             | Recommended strategy                                |
| ------------------------------------- | --------------------------------------------------- |
| Marketing content                     | `force-cache` or long revalidation                  |
| News or product catalog               | Time-based revalidation                             |
| Data changed by an admin action       | Cache tags or `revalidatePath`                      |
| User dashboard                        | `no-store` or carefully scoped revalidation         |
| Authentication and authorization data | Fetch fresh data or use a trusted session mechanism |

## Do's

- Choose caching based on how quickly the data becomes stale.
- Use `revalidatePath` after a mutation that changes a known route.
- Use cache tags when the same data appears on multiple routes.
- Revalidate related list and detail pages after an update.
- Keep secrets and database calls on the server.
- Test cached, stale, and updated states separately.

## Don'ts

- Do not cache private, user-specific data without carefully scoping it.
- Do not assume a database mutation automatically refreshes cached pages.
- Do not use `no-store` everywhere when the data can safely be cached.
- Do not revalidate unrelated routes after every mutation.
- Do not rely on browser refreshes as a data consistency strategy.
- Do not expose revalidation endpoints without authentication or authorization.

## Simple rule

**Cache data that can be reused, fetch fresh data when necessary, and revalidate the exact paths or tags affected by a mutation.**
