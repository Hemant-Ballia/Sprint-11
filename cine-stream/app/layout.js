import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cine-Stream | Movie Database",
  description: "Discover popular movies and manage your favorites.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <nav className="navbar">
          <div className="navbar-content">
            <h2>
              <Link href="/" className="nav-brand">Cine-Stream</Link>
            </h2>
            {/* Client components like SearchBar will be added here later */}
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}