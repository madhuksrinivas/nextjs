# How Next.js Renders the UI

This guide explains how the Foodies App Router renders pages, layouts, Server
Components, Client Components, loading states, error states, and forms.

## The App Router mental model

The App Router uses folders and special files under `app/`:

```text
app/layout.js                 Shared root layout
app/page.js                   Homepage
app/meals/page.js             Meals list
app/meals/[mealSlug]/page.js Meal details
app/meals/share/page.js       Share meal page
app/meals/loading.js          Loading UI for the Meals segment
app/meals/error.js            Error UI for the Meals segment
app/not-found.js              Not-found UI
```

A URL is built from folders. A `page.js` file produces the page for that route.
A `layout.js` file wraps the page and remains shared across navigation.

## What happens when a user opens a page

For a first visit, the broad flow is:

```text
Browser requests a URL
        |
        v
Next.js finds layouts and page files
        |
        v
Server Components execute on the server
        |
        +--> Server Components query MongoDB
        |
        +--> Client Component references are prepared
        |
        v
Next.js sends HTML plus an RSC Flight payload
        |
        v
Browser displays the HTML
        |
        v
React hydrates Client Components for interaction
```

The server does not send the complete JavaScript application for every component.
It sends the rendered result for Server Components and the references needed to
activate Client Components in the browser.

## Server Components

In the App Router, components are Server Components by default. They execute on
the server and can safely access:

- MongoDB and Mongoose
- Environment variables without `NEXT_PUBLIC_`
- Server-only modules
- The file system and other backend resources

They cannot use browser-only features such as `useState`, `useEffect`,
`useActionState`, `window`, or click handlers.

Example from Foodies:

```js
async function Meals() {
  const meals = await getAllMeals();
  return <MealsGrid meals={meals} />;
}
```

`getAllMeals()` runs on the server. MongoDB credentials and database operations
are not sent to the browser.

## Client Components

Add this directive when a component needs to run in the browser:

```js
"use client";
```

Use Client Components for:

- `useState`, `useRef`, and `useActionState`
- `onClick`, `onChange`, and other event handlers
- Browser APIs such as `window`, `document`, and `URL`
- Interactive controls and immediate browser state

In Foodies, [components/meals/share-meal-form.js](../components/meals/share-meal-form.js)
is a Client Component because it uses `useActionState` and the interactive
`ImagePicker` component.

A Client Component can be rendered inside a Server Component. The Server
Component passes serializable props to it:

```text
Server page
  -> Client form component
       -> browser interaction
```

Keep the `"use client"` boundary as low as possible. This reduces the amount of
JavaScript sent to the browser and keeps database code on the server.

## The Foodies page rendering flow

### Root layout

[app/layout.js](../app/layout.js) is a Server Component by default. It renders
shared UI such as `MainHeader` and receives the active route as `children`:

```jsx
<html lang="en">
  <body>
    <MainHeader />
    {children}
  </body>
</html>
```

The root layout surrounds every page in the application.

### Meals list

[app/meals/page.js](../app/meals/page.js) renders the page heading immediately
and places the database-dependent `Meals` component inside `Suspense`:

```jsx
<Suspense fallback={<p>Loading meals data... Please wait!</p>}>
  <Meals />
</Suspense>
```

`Suspense` displays its fallback while the async component is waiting. It is a
loading state, not an error handler.

The data flow is:

```text
app/meals/page.js
  -> getAllMeals()
  -> connectDB()
  -> Meal.find()
  -> MealsGrid
  -> MealItem
```

### Meal details

[app/meals/[mealSlug]/page.js](../app/meals/%5BmealSlug%5D/page.js) receives the
route parameter, loads one meal by slug, and calls `notFound()` when no matching
meal exists.

```js
const { mealSlug } = await params;
const meal = await getMealBySlug(mealSlug);

if (!meal) {
  notFound();
}
```

The same data lookup is used by `generateMetadata()` to create the page title and
description from the meal document.

### Share meal page

[app/meals/share/page.js](../app/meals/share/page.js) is a Server Component because
it exports `metadata`. It renders the client-side
`ShareMealForm` component.

The form uses a Server Action rather than an internal API route:

```text
Browser form
  -> useActionState
  -> shareMeal() in lib/action.js
  -> saveMeal() in lib/meals.js
  -> Mongoose
  -> MongoDB
```

## Server Actions

A Server Action is a server function marked with:

```js
"use server";
```

In Foodies, `shareMeal()` receives `FormData`, validates it, uploads the image to
S3, saves the meal to MongoDB, revalidates `/meals`, and redirects after success.

Server Actions are useful for forms because the browser does not need to build a
separate REST endpoint just to submit the form.

The action returns validation or save errors to `useActionState`:

```js
return {
  error: {
    form: "Unable to save your meal. Please try again.",
  },
  fields: mealData,
};
```

The Client Component displays that state without exposing server stack traces.

Important: keep `redirect()` after the `try/catch`. Next.js uses an internal
thrown response to perform a redirect, so catching it as an ordinary error can
make a successful submission look like a failure.

## Initial page load versus client navigation

### Initial page load

When a user enters a URL directly or refreshes the browser:

1. The server resolves the route.
2. Layouts and Server Components execute.
3. Server-side data is loaded.
4. Next.js sends rendered HTML.
5. The browser displays content quickly.
6. Client Components hydrate and become interactive.

### Client-side navigation

When a user clicks a Next.js `Link`:

1. Next.js intercepts the navigation in the browser.
2. It requests only the required route update.
3. Existing layouts can be reused.
4. The server returns an RSC Flight payload.
5. React applies the component update without a full browser refresh.

The request may contain a query parameter such as `_rsc=...`. The response can
look unusual because it is an internal React Server Components protocol, not a
normal JSON API response.

You may see references such as:

```text
$Sreact.fragment
MetadataBoundary
OutletBoundary
```

These are internal React and Next.js references used to reconstruct the rendered
component tree in the browser.

## HTML, JavaScript, and hydration

The browser receives different kinds of output:

### Server-rendered HTML

This gives the browser content that can be displayed and indexed before all
client JavaScript has finished loading.

### RSC Flight payload

This is a serialized description of Server Component output and component
references. React uses it during App Router navigation and updates.

### Client JavaScript

JavaScript bundles for Client Components are downloaded and executed in the
browser.

### Hydration

Hydration attaches React behavior to server-rendered markup. For example, the
HTML for the share form can be displayed first, then `useActionState`, image
selection, and button behavior become active in the browser.

## Loading, errors, and not-found states

These states have different purposes:

```text
loading.js       -> route segment is waiting for data
Suspense         -> a component is waiting for async work
error.js         -> rendering or data loading threw an error
not-found.js     -> requested content does not exist
```

Foodies uses:

- [app/meals/error.js](../app/meals/error.js) for errors in the Meals route
- [app/error.js](../app/error.js) for general application errors
- [app/not-found.js](../app/not-found.js) for missing content

An `error.js` file must be a Client Component because it is an interactive error
boundary and can use `reset()` to retry rendering.

## Caching and revalidation

Next.js may cache or prerender Server Component output in production. A database
query can therefore run during a build or be reused from a cache depending on the
route configuration.

After a successful meal mutation, Foodies calls:

```js
revalidatePath("/meals");
```

This tells Next.js that the meals list should be refreshed so the newly saved meal
can appear.

For a detailed explanation, see
[revalidation-caching.txt](revalidation-caching.txt).

## Environment variables and security

Server-only variables such as `MONGO_URI` must not use the `NEXT_PUBLIC_` prefix.
They should only be read by Server Components, Server Actions, or server-side
libraries.

Variables beginning with `NEXT_PUBLIC_` are intentionally available to browser
code. Foodies uses `NEXT_PUBLIC_S3_BASE_URL` for image URLs, but AWS credentials
and `MONGO_URI` must remain server-only.

Never send these to a Client Component:

- MongoDB connection strings
- Database credentials
- AWS secret keys
- Raw server errors or stack traces

## Common mistakes

### Exporting metadata from a Client Component

This fails:

```js
"use client";
export const metadata = {};
```

Keep metadata in a Server Component and move interactive code into a child Client
Component. Foodies follows this pattern on the Share Meal page.

### Querying MongoDB in a Client Component

Do not import Mongoose or `MONGO_URI` into a Client Component. Fetch data in a
Server Component or call a controlled Server Action/API route.

### Treating Suspense as error handling

`Suspense` handles waiting. It does not catch database failures. Use an
`error.js` boundary or catch the error at the appropriate server boundary.

### Calling redirect inside a catch block

Keep successful navigation after the catch block because Next.js uses a thrown
internal response for redirects.

### Using non-serializable props

Props passed from Server Components to Client Components must be serializable.
Pass strings, numbers, booleans, arrays, and plain objects rather than database
connections, Mongoose documents, or functions.

## Short summary

```text
Server Component:
  fetches data, accesses secrets, renders HTML/RSC output

Client Component:
  handles browser state, events, and interaction

Server Action:
  receives form mutations on the server

Suspense/loading.js:
  shows temporary loading UI

error.js:
  handles rendering/data failures

not-found.js:
  handles missing content

revalidatePath:
  refreshes cached route output after a mutation
```
