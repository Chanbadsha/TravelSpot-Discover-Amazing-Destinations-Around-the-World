import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/src/Components/Auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Join TravelSpot and start sharing your favorite travel destinations.",
};

export default function RegisterPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-[var(--background)]">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </section>
  );
}
