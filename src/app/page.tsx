import { Suspense } from "react";
import AuthForm from "@/components/authForm";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Suspense>
        <AuthForm />
      </Suspense>
    </main>
  );
}
