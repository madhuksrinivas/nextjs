# Search Meals Functionality

Users can search for meals by title on the `/meals` page. The search feature
uses URL query parameters for state persistence and server-side filtering.

## Architecture

**Server-side filtering pattern:**

- [app/meals/page.js](../app/meals/page.js) — async Server Component that:
  - reads `await searchParams.query` (search term from URL),
  - passes it to both `<Search defaultQuery={query} />` (to prefill the input)
    and `<Meals query={query} />` (to filter results).
- [components/meals/search.js](../components/meals/search.js) — client
  component that handles search input and navigation:
  - maintains local `query` state via `useState`,
  - uses `useRouter().push()` to update the URL with `?query=...`,
  - supports Enter key to trigger search,
  - has styled input and orange-gradient submit button matching the theme.
- [lib/meals.js](../lib/meals.js) — `getAllMeals(query)` now accepts an
  optional search term and filters via MongoDB:
  ```js
  const filter = query ? { title: { $regex: query, $options: "i" } } : {};
  ```
  This performs case-insensitive substring matching on the meal title.

## Why URL query params instead of lifting state?

Server Components can't receive event handler props from Client Components
(functions aren't serializable across the server/client boundary). Instead:

1. Client side: `<Search>` calls `router.push(/meals?query=...)`.
2. Server side: `app/meals/page.js` reads `searchParams.query` and passes it
   to the data-fetching child `<Meals>`.
3. The URL becomes the source of truth, surviving page reloads and allowing
   bookmarking/sharing of search results.

## Data flow

```
User types in <Search>
  → clicks Search or presses Enter
  → useRouter().push(url) updates URL
  → browser navigates to /meals?query=...
  → MealsPage re-renders with new searchParams
  → passes query to <Meals>
  → <Meals> calls getAllMeals(query) with MongoDB filter
  → <MealsGrid> displays filtered results
```

## Styling

Search component matches the app's dark theme:

- Input: `#1c2027` background, `#454952` border, `#f99f2a` focus outline.
- Button: orange gradient (`#f9572a` → `#ff9b05`), hover state brighter.
- Fonts: Montserrat/Quicksand matching the rest of the app.
