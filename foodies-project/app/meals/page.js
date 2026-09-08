import { Suspense } from "react";
import classes from "./page.module.css";
import Link from "next/link";
import MealsGrid from "@/components/meals/meals-grid";
import { getAllMeals } from "@/lib/meals";
import Search from "../../components/meals/search";

async function Meals({ query }) {
  const meals = await getAllMeals(query);
  return <MealsGrid meals={meals} />;
}

export const metadata = {
  title: "All Meals - Foodies",
  description:
    "Browse all meals shared by our community of food lovers. Find your next favorite recipe and enjoy cooking!",
};

async function MealsPage({ searchParams }) {
  const { query } = await searchParams;

  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious Meals, created{" "}
          <span className={classes.highlight}>by you</span>
        </h1>
        <p>
          Choose your favorite recipe and cook it yourself. It's easy and fun!
        </p>
        <p className={classes.cta}>
          <Link href="/meals/share">Share Your Favorite Recipe</Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense
          fallback={
            <p className={classes.loading}>
              Loading meals data... Please wait!
            </p>
          }
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Search defaultQuery={query || ""} />
            <Meals query={query} />
          </div>
        </Suspense>
      </main>
    </>
  );
}

export default MealsPage;
