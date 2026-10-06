import { Suspense } from "react";
import AuthForm from "@/components/authForm";

export default function LoginPage() {
  return (
    <main
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backgroundColor: "#f9fafb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "2000px",
          backgroundColor: "#ffffff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <Suspense>
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}
