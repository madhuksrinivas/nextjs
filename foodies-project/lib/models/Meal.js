import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
      trim: true,
    },
    creator_email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Meal = mongoose.models.Meal || mongoose.model("Meal", mealSchema);

export default Meal;
