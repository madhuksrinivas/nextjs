import MealItem from "./meal-item";
import classes from "./meal-grid.module.css";

export default function MealsGrid({ meals }) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal, index) => (
        <li key={meal.id}>
          <MealItem {...meal} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}
