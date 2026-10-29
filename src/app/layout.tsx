import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Moonlit Wardrobe — Fashion Marketplace",
  description: "Clothes are the spirit of fashion. Shop unstitched suits, casual wear and formal outfits.",
};

const themeScript = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${poppins.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col"><AuthProvider><CartProvider>{children}</CartProvider></AuthProvider></body>
    </html>
  );
}
