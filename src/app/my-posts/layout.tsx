"use client";

import AccountSidebarLayout from "@/src/Components/Account/AccountSidebarLayout";
import { FiGrid, FiUser, FiMapPin } from "react-icons/fi";

const navLinks = [
  { href: "/user/posts", label: "My Posts", icon: FiMapPin },
  { href: "/user", label: "Dashboard", icon: FiGrid },
  { href: "/user/profile", label: "My Profile", icon: FiUser },
];

export default function MyPostsLayout({ children }: { children: React.ReactNode }) {
  return <AccountSidebarLayout navLinks={navLinks}>{children}</AccountSidebarLayout>;
}
