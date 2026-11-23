import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HideOnDashboard from "@/components/layout/HideOnDashboard";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ngekost.id - Find Your Kosan",
  description: "Find verified boarding houses near campuses and offices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#121212] text-[#ededed]">
        <HideOnDashboard>
          <Navbar />
        </HideOnDashboard>
        {children}
        <HideOnDashboard>
          <Footer />
        </HideOnDashboard>
      </body>
    </html>
  );
}