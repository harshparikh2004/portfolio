import type { Metadata } from "next";
import "./globals.css";



// You might have different fonts imported here, leave your font imports as they are, 
// just update the metadata object below:

export const metadata: Metadata = {
  title: "Harsh Parikh | Computer Engineer",
  description: "Portfolio of Harsh M. Parikh. Computer Engineer & Cybersecurity Enthusiast specializing in secure systems and AI-powered applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}