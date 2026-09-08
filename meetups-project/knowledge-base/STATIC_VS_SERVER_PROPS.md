# `getStaticProps` vs `getServerSideProps`

In the Next.js Pages Router, page data can be loaded before the component renders.

The two most common data-fetching functions are:

- `getStaticProps`
- `getServerSideProps`

Both functions run on the server, not in the browser.

They return props that are passed into the page component.

## Quick Comparison

| Feature                    | `getStaticProps`                | `getServerSideProps`                           |
| -------------------------- | ------------------------------- | ---------------------------------------------- |
| Runs when?                 | at build time                   | on every request                               |
| Good for                   | data that does not change often | data that must always be fresh                 |
| Page speed                 | very fast after build           | slower because server work happens per request |
| Can use secrets/database?  | yes                             | yes                                            |
| Runs in browser?           | no                              | no                                             |
| Can access request object? | no                              | yes                                            |
| Supports revalidation?     | yes, with `revalidate`          | no, because it already runs every request      |

## Current Project Example

Your homepage currently uses `getServerSideProps`:

```jsx
function HomePage(props) {
  return <MeetupList meetups={props.meetups} />;
}

export async function getServerSideProps() {
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}

export default HomePage;
```

This means Next.js runs `getServerSideProps` for every request to `/`.

The returned `meetups` value becomes available as `props.meetups` inside `HomePage`.

## `getStaticProps`

Use `getStaticProps` when the page can be pre-rendered at build time.

Example:

```jsx
export async function getStaticProps() {
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}
```

This runs during build time.

It does not run in the browser.

It does not run again on every request unless you use Incremental Static Regeneration.

## Incremental Static Regeneration

`getStaticProps` can use `revalidate`.

```jsx
export async function getStaticProps() {
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
    revalidate: 10,
  };
}
```

This means Next.js can regenerate the page in the background at most once every 10 seconds.

This is useful when the data changes sometimes, but not on every single request.

Use this for pages like:

- meetup lists
- blog posts
- product pages
- recipe pages
- marketing pages

## `getServerSideProps`

Use `getServerSideProps` when data must be fetched fresh for every request.

Example:

```jsx
export async function getServerSideProps(context) {
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}
```

This runs on the server every time someone visits the page.

Use this when the page depends on:

- request headers
- cookies
- authentication
- user-specific data
- frequently changing data
- data that must never be stale

## The `context` Object

`getServerSideProps` receives a `context` object.

```jsx
export async function getServerSideProps(context) {
  const request = context.req;
  const response = context.res;

  return {
    props: {},
  };
}
```

The `context` object can contain request-specific information like:

- `req`
- `res`
- `params`
- `query`
- cookies through the request

`getStaticProps` also receives a `context` object, but it does not include `req` and `res` because it does not run per request.

## Props Flow

The data flow looks like this:

```txt
getStaticProps or getServerSideProps
				↓
return { props: { meetups: data } }
				↓
HomePage(props)
				↓
props.meetups
				↓
<MeetupList meetups={props.meetups} />
```

## Important Rules

- These functions only work in files inside the `pages/` folder.
- They do not work in normal components.
- They do not work in the App Router `app/` folder.
- They always run on the server.
- Code inside them is not included in the browser JavaScript bundle.
- You can safely access databases, file systems, and private environment variables inside them.
- They must be exported from the page file.

## Which One Should This Project Use?

For a public meetup list, `getStaticProps` with `revalidate` is usually a better fit.

```jsx
export async function getStaticProps() {
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
    revalidate: 10,
  };
}
```

Why?

- The page can be pre-rendered.
- The same meetup list is shown to all users.
- It does not need cookies or authentication.
- It can update periodically with `revalidate`.
- It is faster than rendering the page on every request.

Use `getServerSideProps` only if the meetup list must be different for every request or user.

## Relationship To App Router

In the App Router, you usually do not use either of these functions.

Instead of this Pages Router pattern:

```jsx
export async function getStaticProps() {
  return {
    props: {
      meetups,
    },
  };
}
```

App Router code usually fetches directly inside an async Server Component:

```jsx
export default async function MealsPage() {
  const meals = await getAllMeals();

  return <MealsGrid meals={meals} />;
}
```

## Short Version

```txt
getStaticProps      -> build time, fast, can revalidate
getServerSideProps  -> every request, fresh, request-aware
```

Remember:

- Use `getStaticProps` for public data that can be cached.
- Use `getServerSideProps` for request-specific or always-fresh data.
- Both run only on the server.
- Both are Pages Router features.
- App Router uses async Server Components instead.
