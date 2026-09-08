import classes from "./page.module.css";
import ShareMealForm from "../../../components/meals/share-meal-form";

export const metadata = {
  title: "Share Your Favorite Meal - Foodies",
  description:
    "Share your favorite meal with our community of food lovers! Fill out the form to submit your recipe, including a title, summary, instructions, and an image.",
};

export default function ShareMealPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <ShareMealForm />
    </>
  );
}
