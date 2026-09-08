import Link from "next/link";
import Image from "next/image";
import LogoImg from "../../assets/logo.png";
import classes from "../main-header/main-header.module.css";
import MainHeaderBackground from "../main-header/main-header-background";
import NavLink from "./nav-link";

function MainHeader() {
  return (
    <>
      <MainHeaderBackground />
      <header className={classes.header}>
        <Link href="/" className={classes.logo}>
          <Image src={LogoImg} alt="Foodies Project Logo" priority />
          Foodies Dashboard
        </Link>

        <nav className={classes.nav}>
          <ul>
            <li>
              <NavLink href="/meals">Browse Meals</NavLink>
            </li>
            <li>
              <NavLink href="/community">Foodies Community</NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default MainHeader;
