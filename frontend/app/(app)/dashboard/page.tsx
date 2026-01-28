"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    apiFetch("http://127.0.0.1:5000/users/me")
      .then((data) => setUser(data as User))
      .catch(() => {});
  }, []);

  if (!user) return <p>Loading...</p>;
  <Button
    onClick={() => {
      document.cookie = "token=; Max-Age=0; path=/";
      window.location.href = "/login";
    }}
  >
    Logout
  </Button>;
  return <h1>Welcome {user.name}</h1>;
}
