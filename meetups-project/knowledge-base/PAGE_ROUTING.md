# Next.js Pages Router

This project uses the **Pages Router**, which is the older and simpler routing system in Next.js.

In the Pages Router, routes are created from files and folders inside the `pages/` directory.

## Route Mapping In This Project

```txt
pages/index.js                 -> /
pages/new-meetup/index.js      -> /new-meetup
pages/[meetupId]/index.js      -> /:meetupId
pages/_app.js                  -> custom app wrapper for all pages
```

## How Pages Router Works

Every file inside `pages/` becomes a route.

For example:

```txt
pages/index.js -> /
```

```jsx
function HomePage(props) {
  return <MeetupList meetups={props.meetups} />;
}

export default HomePage;
```

The default export from the file is the React component rendered for that route.

## Folder-Based Routes

A folder with an `index.js` file also creates a route.

```txt
pages/new-meetup/index.js -> /new-meetup
```

That page renders the meetup creation form:

```jsx
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

function NewMeetupPage() {
  function onAddMeetupHandler() {}

  return <NewMeetupForm onAddMeetup={onAddMeetupHandler} />;
}

export default NewMeetupPage;
```

## Dynamic Routes

Dynamic routes use square brackets.

```txt
pages/[meetupId]/index.js -> /1, /2, /abc, etc.
```

The `[meetupId]` part means the route value is dynamic.

In the Pages Router, you can read route parameters with `useRouter` from `next/router`.

```jsx
import { useRouter } from "next/router";

function MeetupDetailsPage() {
  const router = useRouter();
  const meetupId = router.query["meetupId"];

  return <p>{meetupId}</p>;
}

export default MeetupDetailsPage;
```

For this URL:

```txt
/1
```

`router.query.meetupId` will be:

```txt
1
```

## `_app.js`

The `pages/_app.js` file lets you customize the root component for all pages.

In this project, `_app.js` wraps every page with the shared `Layout` component:

```jsx
import "../styles/globals.css";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
```

This means every page gets the same navigation and layout structure.

## Pages Router vs App Router

| Feature           | Pages Router                             | App Router                                  |
| ----------------- | ---------------------------------------- | ------------------------------------------- |
| Main folder       | `pages/`                                 | `app/`                                      |
| Route file        | file name or `index.js`                  | `page.js`                                   |
| Dynamic route     | `[meetupId].js` or `[meetupId]/index.js` | `[mealSlug]/page.js`                        |
| Shared layout     | usually `_app.js` + `Layout` component   | `layout.js`                                 |
| Data fetching     | `getStaticProps`, `getServerSideProps`   | async Server Components                     |
| Hooks             | can be used directly in components       | require `"use client"` in Client Components |
| Server Components | not the default model                    | default behavior                            |

## Why There Is No `"use client"`

In the Pages Router, components are traditional React components.

That means you can use hooks like this without adding `"use client"`:

```jsx
import { useRouter } from "next/router";

function MeetupDetailsPage() {
  const router = useRouter();
  return <p>{router.query.meetupId}</p>;
}
```

The `"use client"` directive is mainly needed in the App Router because App Router components are Server Components by default.

This project uses the Pages Router, so you usually do not write `"use client"` or `"use server"`.

## Navigation

Use `Link` from `next/link` for client-side page navigation.

```jsx
import Link from "next/link";

export default function MeetupItem({ id, title }) {
  return <Link href={`/${id}`}>{title}</Link>;
}
```

Using `Link` prevents full page reloads and lets Next.js handle navigation efficiently.

## Short Version

```txt
pages/index.js              -> homepage
pages/new-meetup/index.js   -> /new-meetup
pages/[meetupId]/index.js   -> dynamic detail page
pages/_app.js               -> wraps all pages
```

Remember:

- Pages Router uses the `pages/` folder.
- File and folder names create routes.
- Dynamic routes use square brackets.
- `_app.js` is used for global layout and global CSS.
- Hooks can be used directly; no `"use client"` directive is needed.
