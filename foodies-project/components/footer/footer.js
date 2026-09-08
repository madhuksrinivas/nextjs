"use client";
import { usePathname } from "next/navigation";
import classes from "./footer.module.css";
import Link from "next/link";

export default function Footer() {
  const pathname = usePathname();
  const rootfooter = (
    <p>
      &copy; 2026 NextLevel Food. All rights reserved. |{" "}
      <a href="/privacy-policy">Privacy Policy</a>
    </p>
  );
  const navpathName =
    pathname === "/meals"
      ? "/"
      : pathname.startsWith("/meals/")
        ? "/meals"
        : null;
  const mealsfooter = (
    <Link href={navpathName} className={classes.backLink}>
      <h2>Back</h2>
    </Link>
  );
  return (
    <footer className={classes.footer}>
      {pathname.toLowerCase() === "/"
        ? rootfooter
        : pathname.startsWith("/meals")
          ? mealsfooter
          : null}
    </footer>
  );
}
