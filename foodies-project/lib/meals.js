import slugify from "slugify";
import xss from "xss";
import { S3 } from "@aws-sdk/client-s3";
import connectDB from "./mongodb";
import Meal from "./models/Meal";

const s3 = new S3({
  region: "us-east-1",
});

export async function getAllMeals(query) {
  try {
    await connectDB();
    const filter = query ? { title: { $regex: query, $options: "i" } } : {};
    const meals = await Meal.find(filter).sort({ createdAt: -1 }).lean();

    return meals.map(({ _id, ...meal }) => ({
      ...meal,
      id: _id.toString(),
    }));
  } catch (error) {
    throw new Error("Unable to load meals.");
  }
}

export async function getMealBySlug(slug) {
  try {
    await connectDB();
    const meal = await Meal.findOne({ slug }).lean();

    if (!meal) {
      return null;
    }

    const { _id, ...mealData } = meal;
    return { ...mealData, id: _id.toString() };
  } catch (error) {
    throw new Error("Unable to load this meal.");
  }
}

export async function saveMeal(meal) {
  try {
    // Generate a slug from the title
    meal.slug = slugify(meal.title, { lower: true });
    // Sanitize the instructions to prevent XSS attacks
    meal.instructions = xss(meal.instructions);

    // Generate a unique filename for the image based on the slug and original extension
    const extension = meal.image.name.split(".").pop();
    const fileName = `${meal.slug}.${extension}`;

    const bufferedImage = await meal.image.arrayBuffer();

    await s3.putObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(bufferedImage),
      ContentType: meal.image.type,
    });

    await connectDB();
    await Meal.create({
      slug: meal.slug,
      title: meal.title,
      image: fileName,
      summary: meal.summary,
      instructions: meal.instructions,
      creator: meal.creator,
      creator_email: meal.creator_email,
    });

    return { message: "Meal shared successfully!" };
  } catch (error) {
    throw new Error(
      error.code === 11000
        ? "A meal with this title already exists."
        : "Unable to save your meal. Please try again.",
    );
  }
}
