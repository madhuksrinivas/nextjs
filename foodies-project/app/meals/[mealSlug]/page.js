import classes from "./page.module.css";
import Image from "next/image";
import { getMealBySlug } from "../../../lib/meals";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);
  if (!meal) return notFound();
  return {
    title: meal ? `${meal.title}` : "Meal Not Found",
    description: meal
      ? meal.summary
      : "The meal you are looking for does not exist. Please check the URL or return to the meals page.",
  };
}

async function MealDetailsPage({ params }) {
  const { mealSlug } = await params;
  const meal = await getMealBySlug(mealSlug);
  if (!meal) {
    notFound();
  }
  meal.instructions = meal.instructions.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            fill
            alt="Meal image"
            src={`${process.env.NEXT_PUBLIC_S3_BASE_URL}/${meal.image}`}
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p className={classes.instructions}>{meal.instructions}</p>
      </main>
    </>
  );
}
export default MealDetailsPage;
