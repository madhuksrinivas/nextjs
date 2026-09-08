import "./globals.css";
import MainHeader from "../components/main-header/main-header";
// import Footer from "../components/footer/footer";
import { ToastProvider } from "../components/toast-bar/toast-context";

export const metadata = {
  title: "NextLevel Food",
  description: "Delicious meals, shared by a food-loving community.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainHeader />
        <ToastProvider>{children}</ToastProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
