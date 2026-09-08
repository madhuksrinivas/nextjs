# Mongoose Data Access

## Project flow

```text
Meals page -> lib/meals.js -> lib/mongodb.js -> MongoDB
Share form -> Server Action -> lib/meals.js -> MongoDB
```

The Foodies App Router does not need an internal API route for these operations.
Server Components can read data directly on the server, and the Share Meal form
uses a Server Action for writes.

## Connection helper

[lib/mongodb.js](../lib/mongodb.js) caches the Mongoose connection globally. This
prevents a new connection from being opened for every request or development hot
reload.

Call it before using the model:

```js
await connectDB();
const meals = await Meal.find().lean();
```

## Meal model

[lib/models/Meal.js](../lib/models/Meal.js) defines the schema and exports the
Mongoose model. The `mongoose.models.Meal || mongoose.model(...)` pattern avoids
redefining the model during Next.js development reloads.

## Query helpers

[lib/meals.js](../lib/meals.js) exposes the application data API:

- `getAllMeals()` loads meals ordered by newest first.
- `getMealBySlug(slug)` loads one meal and returns `null` when it does not exist.
- `saveMeal(meal)` uploads the image to S3, sanitizes instructions, and inserts
  the meal into MongoDB.

MongoDB's `_id` is converted to the existing `id` property before meal data is
sent to the UI.
