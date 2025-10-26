import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Ankit Mishra - Software Engineer",
  description:
    "Full-Stack Developer (MERN, Python, Spring Boot) with a passion for DevOps and ML. Building innovative, high-impact software from concept to delivery.",
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "MERN",
    "React",
    "Node.js",
    "Python",
    "Spring Boot",
  ],
  authors: [{ name: "Ankit Mishra" }],
  openGraph: {
    type: "website",
    title: "Ankit Mishra - Software Engineer",
    description:
      "Full-Stack Developer specializing in MERN, Python, and Spring Boot",
    siteName: "Ankit Mishra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ankit Mishra - Software Engineer",
    description:
      "Full-Stack Developer specializing in MERN, Python, and Spring Boot",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} spotlight-glow`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navigation />
          <main className="min-h-screen pt-16 md:pt-20">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
