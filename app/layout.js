import { Caveat, Great_Vibes, Outfit } from "next/font/google";
import { AppShell } from "../components/app-shell";
import { StudioProvider } from "../components/studio";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
});

export const metadata = {
  title: "Isha Dhakal · Creator Studio",
  description: "Creator studio for Isha Dhakal, with live TikTok, Instagram, and Pinterest counts and a place to stage photos, videos, and collaboration notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${script.variable} ${hand.variable}`}>
        <StudioProvider>
          <AppShell>{children}</AppShell>
        </StudioProvider>
      </body>
    </html>
  );
}
