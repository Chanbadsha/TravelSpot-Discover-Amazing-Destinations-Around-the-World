import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/src/Components/Auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your TravelSpot account to manage your profile and posts.",
};

export default function LoginPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-[var(--background)]">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
