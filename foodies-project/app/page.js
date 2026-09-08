import Link from "next/link";
import classes from "./page.module.css";
import ImageSlideshow from "../components/images/image-slideshow";
import { getAllMeals } from "../lib/meals";

export default async function Home() {
  const meals = await getAllMeals();
  const images = meals.map((meal) => ({ image: meal.image, alt: meal.title }));

  return (
    <>
      <header className={classes.header}>
        <div className={classes.slideshow}>
          <ImageSlideshow images={images} />
        </div>
        <div>
          <div className={classes.hero}>
            <h1>Next level Food for Next Level Foodies</h1>
            <p>Taste the world food from all over the world!</p>
          </div>
          <div className={classes.cta}>
            <Link href="/community">Community</Link>
            <Link href="/meals">Explore our Meals</Link>
          </div>
        </div>
      </header>
      <main className={classes.main}>
        <section className={classes.section}>
          <h2>How it works</h2>
          <p>
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>

        <section className={classes.section}>
          <h2>Why NextLevel Food?</h2>
          <p>
            NextLevel Food is a platform for foodies to share their favorite
            recipes with the world. It&apos;s a place to discover new dishes,
            and to connect with other food lovers.
          </p>
          <p>
            NextLevel Food is a place to discover new dishes, and to connect
            with other food lovers.
          </p>
        </section>
      </main>
    </>
  );
}
