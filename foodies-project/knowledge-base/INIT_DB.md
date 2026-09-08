# Database Initialization: Mongoose

Foodies uses MongoDB through Mongoose. The application does not create a local
database file. MongoDB stores meals in the `meals` collection configured by the
database name in `MONGO_URI`.

## Environment variable

Add this to `.env.local`:

```text
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
```

Keep `.env.local` out of version control. Never commit the connection string.

## Seed sample meals

The optional seed script is [initdb.mjs](../initdb.mjs). Run it from the project
root:

```bash
npm run seed
```

The command loads `.env.local`, connects with Mongoose, deletes the existing
documents in the `meals` collection, and inserts the sample meals.

The reset behavior comes from:

```js
await Meal.deleteMany({});
await Meal.insertMany(dummyMeals);
```

Because `deleteMany({})` removes all meals, run the seed command only when you
intend to reset the collection.

## Meal model

The schema is defined in [lib/models/Meal.js](../lib/models/Meal.js). It validates
these fields:

| Field           | Purpose                       |
| --------------- | ----------------------------- |
| `slug`          | Unique URL-friendly meal name |
| `title`         | Meal title                    |
| `image`         | Uploaded image filename       |
| `summary`       | Short meal description        |
| `instructions`  | Cooking instructions          |
| `creator`       | Author name                   |
| `creator_email` | Author email                  |

The schema also adds `createdAt` and `updatedAt` timestamps.

## Runtime data access

The application uses [lib/mongodb.js](../lib/mongodb.js) to reuse one Mongoose
connection. Queries and inserts are kept in [lib/meals.js](../lib/meals.js):

```js
Meal.find().sort({ createdAt: -1 }).lean();
Meal.findOne({ slug }).lean();
Meal.create(mealData);
```

The database connection is not closed after each request. Mongoose reuses the
connection while the Next.js process is running and closes it when the process
ends. The seed script is different because it is a short-lived process and
closes its connection in `finally`.
