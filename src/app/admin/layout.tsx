/** @format */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="m-12">
      <h1 className="text-2xl mb-6 text-center">Admin</h1>
      <nav className="flex flex-row gap-6 justify-center items-center text-lg">
        <Link className={pathname === "/admin" ? "font-bold" : ""} href={"/admin"}>
          Home
        </Link>
        <Link className={pathname === "/admin/reconciliation" ? "font-bold" : ""} href={"/admin/reconciliation"}>
          Reconcile BGG Games
        </Link>
        <Link
          className={pathname === "/admin/reconciliation/spielapp" ? "font-bold" : ""}
          href={"/admin/reconciliation/spielapp"}
        >
          Reconcile SPIEL Games
        </Link>
      </nav>
      {children}
    </div>
  );
}
