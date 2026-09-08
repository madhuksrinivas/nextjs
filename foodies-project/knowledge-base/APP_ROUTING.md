# Next.js App Router

The **App Router** is the newer routing system in Next.js. It uses the `app/` folder instead of the older `pages/` folder.

In the App Router, routes are created from folders, and special files like `page.js`, `layout.js`, `loading.js`, `error.js`, and `not-found.js` control what gets rendered.

## App Router vs Pages Router

| Feature                | App Router                              | Pages Router                                       |
| ---------------------- | --------------------------------------- | -------------------------------------------------- |
| Main folder            | `app/`                                  | `pages/`                                           |
| Route file             | `page.js`                               | file name itself, like `index.js` or `about.js`    |
| Default component type | Server Component                        | Client-capable React component                     |
| Data fetching          | directly inside async Server Components | `getStaticProps`, `getServerSideProps`, API routes |
| Layouts                | built-in nested layouts                 | custom layout wrapper pattern                      |
| Loading UI             | `loading.js`                            | manual loading state                               |
| Error UI               | `error.js`                              | custom error handling                              |
| Not found UI           | `not-found.js`                          | `404.js`                                           |
| Server Actions         | supported                               | not the main pattern                               |

## Basic Route Mapping

In the App Router, each folder becomes a route segment.

The UI for a route must be inside a `page.js` file.

```txt
app/page.js                -> /
app/community/page.js      -> /community
app/meals/page.js          -> /meals
app/meals/share/page.js    -> /meals/share
```

In your `foodies-project`, these files create the main routes:

```txt
app/page.js                      -> homepage
app/community/page.js            -> community page
app/meals/page.js                -> all meals page
app/meals/share/page.js          -> share meal page
app/meals/[mealSlug]/page.js     -> dynamic meal details page
```

## `page.js`

A `page.js` file defines the main UI for a route.

Example:

```jsx
export default function CommunityPage() {
  return <main>Community</main>;
}
```

This file creates a route only because it is named `page.js`.

For example:

```txt
app/community/page.js -> /community
```

## `layout.js`

A `layout.js` file wraps pages and keeps shared UI on the screen while users move between routes.

Common uses:

- navigation bars
- headers
- footers
- shared providers
- global structure

Example:

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

The root layout lives here:

```txt
app/layout.js
```

Every App Router project must have a root layout.

## Nested Layouts

Layouts can be nested.

Example:

```txt
app/layout.js              -> wraps the whole app
app/meals/layout.js        -> wraps only /meals routes
app/meals/page.js          -> /meals
app/meals/share/page.js    -> /meals/share
```

If `app/meals/layout.js` exists, it wraps all routes inside `/meals`.

## Dynamic Routes

Dynamic routes use square brackets.

```txt
app/meals/[mealSlug]/page.js -> /meals/some-meal-slug
```

The dynamic value is available through `params`.

Example:

```jsx
export default function MealDetailsPage({ params }) {
  const mealSlug = params.mealSlug;

  return <main>{mealSlug}</main>;
}
```

So for this URL:

```txt
/meals/pasta-carbonara
```

`params.mealSlug` will be:

```txt
pasta-carbonara
```

## Loading UI

Add a `loading.js` file to show fallback UI while a route is loading.

```txt
app/meals/loading.js -> loading UI for /meals
```

Example:

```jsx
export default function LoadingMeals() {
  return <p>Loading meals...</p>;
}
```

This is useful when a page fetches data slowly.

## Error UI

Add an `error.js` file to handle errors for a route segment.

```txt
app/error.js        -> global route error UI
app/meals/error.js  -> errors inside /meals
```

Important: `error.js` must be a Client Component.

```jsx
"use client";

export default function Error({ error }) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </main>
  );
}
```

It needs `"use client"` because error boundaries require client-side behavior.

## Not Found UI

Add `not-found.js` to customize the 404 page.

```txt
app/not-found.js -> global not found page
```

You can trigger it manually with `notFound()` from `next/navigation`.

Example:

```jsx
import { notFound } from "next/navigation";

export default async function MealDetailsPage({ params }) {
  const meal = await getMeal(params.mealSlug);

  if (!meal) {
    notFound();
  }

  return <main>{meal.title}</main>;
}
```

## Server Components By Default

In the App Router, components are Server Components by default.

That means this is allowed:

```jsx
export default async function MealsPage() {
  const meals = await getAllMeals();

  return <MealsGrid meals={meals} />;
}
```

You can fetch data directly inside the component because it runs on the server.

You do not need `"use server"` for normal Server Components.

## Client Components

Use `"use client"` when a component needs browser-only features.

```jsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

Use Client Components for:

- `useState`, `useEffect`, `useRef`, `useActionState`
- event handlers like `onClick`, `onChange`, `onSubmit`
- browser APIs like `window`, `document`, `localStorage`
- interactive UI

## Server Actions

Use `"use server"` for Server Actions.

Server Actions are functions that run on the server but can be connected to forms or called from Client Components.

Example:

```js
"use server";

export async function shareMeal(formData) {
  const title = formData.get("title");

  // Validate data and save it to the database.
}
```

Use Server Actions for:

- form submissions
- database writes
- authentication checks
- file uploads
- secure server-side mutations

## Metadata

The App Router has built-in metadata support.

Example:

```js
export const metadata = {
  title: "All Meals - Foodies",
  description: "Browse all meals shared by our community.",
};
```

Metadata must be exported from a Server Component file.

Do not export `metadata` from a file marked with `"use client"`.

If a page needs both metadata and client hooks, split it into two files:

```txt
app/meals/share/page.js              -> Server Component, exports metadata
components/meals/share-form.js       -> Client Component, uses hooks
```

## Recommended App Router Pattern

Keep routes server-first and move only interactive pieces into Client Components.

```txt
app/meals/page.js                  -> fetches meals on the server
components/meals/meals-grid.js     -> displays meals
components/search/search-box.js    -> client component only if it needs interactivity
```

This keeps the browser bundle smaller and lets the server handle data fetching securely.

## Short Version

```txt
app/page.js                    -> route for /
app/about/page.js              -> route for /about
app/meals/[mealSlug]/page.js   -> dynamic route
app/layout.js                  -> shared wrapper
app/loading.js                 -> loading UI
app/error.js                   -> error UI, must use "use client"
app/not-found.js               -> 404 UI
```

Remember:

- App Router uses the `app/` folder.
- Pages are created with `page.js` files.
- Components are Server Components by default.
- Use `"use client"` only when browser interactivity is needed.
- Use `"use server"` for Server Actions, not normal pages.
