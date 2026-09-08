import mongoose from "mongoose";
import Meal from "./lib/models/Meal.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI in your .env.local file");
}

const dummyMeals = [
  {
    title: "Juicy Cheese Burger",
    slug: "juicy-cheese-burger",
    image: "burger.jpg",
    summary:
      "A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.",
    instructions:
      "Mix the beef with salt and pepper, cook the patty, and assemble the burger.",
    creator: "John Doe",
    creator_email: "johndoe@example.com",
  },
  {
    title: "Spicy Curry",
    slug: "spicy-curry",
    image: "curry.jpg",
    summary:
      "A rich and spicy curry, infused with exotic spices and creamy coconut milk.",
    instructions:
      "Saute vegetables, add curry paste and coconut milk, then simmer until ready.",
    creator: "Max Schwarz",
    creator_email: "max@example.com",
  },
  {
    title: "Homemade Dumplings",
    slug: "homemade-dumplings",
    image: "dumplings.jpg",
    summary:
      "Tender dumplings filled with savory meat and vegetables, steamed to perfection.",
    instructions:
      "Prepare the filling, fold the dumplings, steam them, and serve hot.",
    creator: "Emily Chen",
    creator_email: "emilychen@example.com",
  },
  {
    title: "Classic Mac n Cheese",
    slug: "classic-mac-n-cheese",
    image: "macncheese.jpg",
    summary:
      "Creamy and cheesy macaroni, a comforting classic that is always a crowd-pleaser.",
    instructions:
      "Cook the macaroni, prepare the cheese sauce, combine, and bake until golden.",
    creator: "Laura Smith",
    creator_email: "laurasmith@example.com",
  },
  {
    title: "Authentic Pizza",
    slug: "authentic-pizza",
    image: "pizza.jpg",
    summary:
      "Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.",
    instructions:
      "Prepare the dough, add toppings, bake the pizza, and serve hot.",
    creator: "Mario Rossi",
    creator_email: "mariorossi@example.com",
  },
  {
    title: "Wiener Schnitzel",
    slug: "wiener-schnitzel",
    image: "schnitzel.jpg",
    summary:
      "Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.",
    instructions:
      "Bread the veal, fry it until golden brown, and serve with lemon.",
    creator: "Franz Huber",
    creator_email: "franzhuber@example.com",
  },
  {
    title: "Fresh Tomato Salad",
    slug: "fresh-tomato-salad",
    image: "tomato-salad.jpg",
    summary:
      "A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.",
    instructions:
      "Slice the tomatoes, add basil and seasoning, dress with vinaigrette, and serve.",
    creator: "Sophia Green",
    creator_email: "sophiagreen@example.com",
  },
];

try {
  await mongoose.connect(MONGO_URI);
  await Meal.deleteMany({});
  await Meal.insertMany(dummyMeals);
  console.log(`Seeded ${dummyMeals.length} meals into MongoDB.`);
} catch (error) {
  console.error("Failed to seed meals:", error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
