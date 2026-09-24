# React Server Components and Client Components

This project demonstrates Next.js features that are not available in a standard React setup created with Create React App or Vite.

## Features

- React Server Components (RSC)
- React Client Components (RCC)
- Server Actions
- The `use()` hook with Promises

## Why Next.js?

React Server Components, Server Actions, and the server/client rendering model require framework support. Next.js provides the project setup and runtime needed to use these features.

## Server and Client Components

### React Server Components

- Run only on the server.
- Can access server-only resources such as databases and the file system.
- Do not add JavaScript to the client bundle.

### React Client Components

- Are rendered on the server for the initial HTML response when appropriate.
- Are then hydrated in the browser and can run interactively on the client.
- Must be marked with the `"use client"` directive when they use client-only features such as state, effects, or browser APIs.

The two component types can be composed together: Server Components can render Client Components, while Client Components cannot import Server Components directly.