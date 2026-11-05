import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata = {
  title: "EDITAURA — Video Editing Studio",
  description:
    "Cinematic video editing studio by Sunil. YouTube editing, Reels, Podcast production — crafted to captivate.",
  keywords: [
    "video editing",
    "YouTube editing",
    "Reels editing",
    "podcast editing",
    "EDITAURA",
    "cinematic editing",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable}`} style={{ fontFamily: "var(--font-jost), 'Jost', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
