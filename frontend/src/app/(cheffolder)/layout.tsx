"use client"

import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import RequireAuth from "@/utils/RequireAuth";
import PersistLogin from "@/utils/PersistLogin";

// const menuItems = [
//   {
//     title: "MENU",
//     items: [
//       {
//         icon: "/approved.png",
//         label: "Valider planning",
//         href: "/chef",
//       },
//       {
//         icon: "/user.png",
//         label: "Valider étudiants",
//         href: "/",
//       },
//     ],
//   },
// ];

export default function ChefLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PersistLogin>
      <RequireAuth requiredRole="CHEF">
        <div className="h-screen flex">
          {/* LEFT */}
          <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
            <Link
              href="/"
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <Image src="/logo.png" alt="logo" width={50} height={50} />
              <span className="hidden lg:block font-semibold mt-1 text-gray-600 text-[14px]">
                Dashboard
              </span>
            </Link>
            {/* Pass menuItems to Menu */}
            <Menu role="CHEF" />
          </div>

          {/* RIGHT */}
          <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
            <Navbar />
            {children}
          </div>
        </div>
      </RequireAuth>
    </PersistLogin>
  );
}
