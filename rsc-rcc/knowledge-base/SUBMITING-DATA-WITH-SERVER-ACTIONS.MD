# Submitting Data with Server Actions

Server Actions let you run a server-side function when a user submits a form or triggers an action. They are useful for creating, updating, and deleting data without manually creating an API route for every form submission.

## How Server Actions work

1. A user submits a form or triggers an action.
2. Next.js sends the form data to the server.
3. The Server Action validates and processes the data.
4. The action can update the database, revalidate a page, or redirect the user.

Server Actions always run on the server, so database access and private credentials remain outside the browser.

## Basic Server Action

Use the `"use server"` directive to mark a function as a Server Action:

```jsx
// app/actions.js
"use server";

import { revalidatePath } from "next/cache";

export async function createProduct(formData) {
  const name = formData.get("name");
  const price = formData.get("price");

  if (!name || !price) {
    throw new Error("Name and price are required");
  }

  await saveProduct({
    name: String(name),
    price: Number(price),
  });

  revalidatePath("/products");
}
```

The action receives a `FormData` object. Inputs must have a `name` attribute to be included in that object.

## Using a Server Action with a form

Pass the action to the form's `action` attribute:

```jsx
// app/products/new/page.jsx
import { createProduct } from "@/app/actions";

export default function NewProductPage() {
  return (
    <form action={createProduct}>
      <label>
        Name
        <input name="name" required />
      </label>

      <label>
        Price
        <input name="price" type="number" min="0" step="0.01" required />
      </label>

      <button type="submit">Create product</button>
    </form>
  );
}
```

The form works without writing a separate `onSubmit` handler. The browser sends the form fields to the Server Action.

## Server Actions in Client Components

A Client Component can import a Server Action from a separate server-only module and use it as a form action:

```jsx
// app/actions.js
"use server";

export async function addComment(formData) {
  const comment = String(formData.get("comment") || "").trim();

  if (!comment) {
    throw new Error("Comment is required");
  }

  await saveComment(comment);
}
```

```jsx
// app/comments/CommentForm.jsx
"use client";

import { addComment } from "@/app/actions";

export default function CommentForm() {
  return (
    <form action={addComment}>
      <textarea name="comment" required />
      <button type="submit">Post comment</button>
    </form>
  );
}
```

The Client Component can use the action, but the action's implementation and secrets remain on the server.

## Showing a pending state

Use `useFormStatus` in a child component inside the form:

```jsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
```

```jsx
import { SubmitButton } from "./SubmitButton";

export default function ProductForm({ action }) {
  return (
    <form action={action}>
      <input name="name" required />
      <SubmitButton />
    </form>
  );
}
```

`useFormStatus` must be used by a component rendered inside the `<form>` that owns the action.

## Returning validation state with `useActionState`

For user-friendly validation messages, return a result from the action and connect it to `useActionState`:

```jsx
// app/actions.js
"use server";

export async function createProduct(previousState, formData) {
  const name = String(formData.get("name") || "").trim();

  if (!name) {
    return { error: "Product name is required" };
  }

  await saveProduct({ name });
  return { error: null };
}
```

```jsx
"use client";

import { useActionState } from "react";
import { createProduct } from "@/app/actions";

const initialState = { error: null };

export default function ProductForm() {
  const [state, formAction, pending] = useActionState(
    createProduct,
    initialState,
  );

  return (
    <form action={formAction}>
      <input name="name" required />
      {state.error && <p role="alert">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}
```

## Revalidate and redirect after submission

After changing data, refresh any page or layout that displays the changed data:

```jsx
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData) {
  const product = await saveProduct({
    name: String(formData.get("name")),
  });

  revalidatePath("/products");
  redirect(`/products/${product.id}`);
}
```

`redirect` ends the current action, so code after it will not run.

## Validation and security

Browser validation such as `required` improves the user experience, but it is not security. A Server Action must validate and authorize every request because it can be called outside the expected UI flow.

```jsx
"use server";

export async function updateProfile(formData) {
  const name = String(formData.get("name") || "").trim();

  if (name.length < 2 || name.length > 80) {
    return { error: "Name must contain between 2 and 80 characters" };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be signed in" };
  }

  await updateUser(user.id, { name });
  return { error: null };
}
```

## Do's

- Validate and authorize data inside the Server Action.
- Keep database calls and private credentials on the server.
- Use meaningful input `name` attributes.
- Return structured validation errors when the form needs to display feedback.
- Revalidate affected paths after a successful mutation.
- Disable submit controls while an action is pending.
- Redirect after a successful action when the user should move to another page.

## Don'ts

- Do not trust browser validation alone.
- Do not put secrets or database logic in a Client Component.
- Do not treat a Server Action as automatically authorized; check the current user and permissions.
- Do not use `useFormStatus` outside the form that owns the action.
- Do not forget to handle failed validation or database errors.
- Do not expose sensitive values in returned error messages.

## Simple rule

**Use Server Actions to validate and mutate data on the server, then revalidate or redirect so the UI reflects the result.**
