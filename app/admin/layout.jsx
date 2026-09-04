import { Playfair_Display, DM_Mono } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export default function AdminLayout({ children }) {
  return (
    <div className={`${playfair.variable} ${dmMono.variable}`}>
      {children}
    </div>
  );
}
