import { Source_Code_Pro, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NavigationBar from "@/components/NavigationMenu";

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  display: "swap",
})

export const metadata = {
  title: "TaskMaster - Orgatick",
  description: "Orgatick simplifies event management with secure ticketing, analytics, and real-time updates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans3.variable} ${sourceCodePro.variable} font-source-sans-3 antialiased`}
      >
        <NavigationBar />
        <div className="pt-12">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
