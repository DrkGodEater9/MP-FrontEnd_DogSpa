import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DogSpa - El Spa Perfecto para tu Mascota",
  description: "Servicios profesionales de belleza y bienestar para mantener a tu mascota feliz y saludable.",
  keywords: ["DogSpa", "mascotas", "spa", "belleza", "cuidado", "perros", "gatos"],
  authors: [{ name: "DogSpa Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "DogSpa - El Spa Perfecto para tu Mascota",
    description: "Servicios profesionales de belleza y bienestar para mantener a tu mascota feliz y saludable.",
    url: "https://dogspa.com",
    siteName: "DogSpa",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DogSpa - El Spa Perfecto para tu Mascota",
    description: "Servicios profesionales de belleza y bienestar para mantener a tu mascota feliz y saludable.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
