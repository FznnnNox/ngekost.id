"use client";

import { usePathname } from "next/navigation";

const HIDDEN_ON = [
  "/login",
  "/admin/dashboard",
  "/admin/boarding-houses",
  "/admin/categories",
  "/admin/cities",
  "/admin/users",
  "/admin/transactions",
  "/admin/testimonials"
];

export default function HideOnDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return null;
  return <>{children}</>;
}
