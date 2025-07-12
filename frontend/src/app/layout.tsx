import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

//import the authProvider
import { AuthProvider } from "../context/authProvider";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exam Dashboard | ISIMM",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* wrap the children with the authProvider juste bech les compoants yabda 3andhom accés lil globale state li hiya fil7ala mte3na token w role w email */}
        <AuthProvider>
          <ToastContainer position="bottom-right" theme="dark"/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
