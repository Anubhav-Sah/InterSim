"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/layout/container";
import PageTitle from "@/components/ui/page-title";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Login → get token
      const data = await apiFetch<{ accessToken: string }>(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      );

      // 2️⃣ Store token in cookie (for middleware + api)
      document.cookie = `token=${data.accessToken}; path=/`;

      // 3️⃣ Fetch user profile
      const user = await apiFetch<{
        onboardingCompleted: boolean;
      }>(`${API_BASE_URL}/users/me`);

      // 4️⃣ Redirect based on onboarding status
      if (!user.onboardingCompleted) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <PageTitle title="Login" subtitle="Sign in to continue" />

      <div className="space-y-4 max-w-sm mx-auto">
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Don’t have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </div>
    </Container>
  );
}
