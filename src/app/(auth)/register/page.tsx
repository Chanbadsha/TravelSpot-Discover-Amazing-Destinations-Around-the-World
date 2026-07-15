import { Suspense } from "react";
import RegisterForm from "@/src/Components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 bg-[var(--background)]">
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </section>
  );
}
