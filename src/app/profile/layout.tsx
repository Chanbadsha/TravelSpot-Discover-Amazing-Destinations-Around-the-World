"use client";

import AccountSidebarLayout from "@/src/Components/Account/AccountSidebarLayout";
import { FiGrid, FiUser, FiMapPin } from "react-icons/fi";

const navLinks = [
  { href: "/user/profile", label: "My Profile", icon: FiUser },
  { href: "/user", label: "Dashboard", icon: FiGrid },
  { href: "/user/posts", label: "My Posts", icon: FiMapPin },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <AccountSidebarLayout navLinks={navLinks}>{children}</AccountSidebarLayout>;
}
