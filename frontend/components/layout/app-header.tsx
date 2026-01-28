// "use client";

// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

// export default function AppHeader() {
//   const router = useRouter();

//   function handleLogout() {
//     // Clear JWT cookie
//     document.cookie = "token=; Max-Age=0; path=/";
//     router.push("/login");
//   }

//   return (
//     <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
//       <h1 className="font-semibold">Internship Simulator</h1>

//       <Button variant="outline" onClick={handleLogout}>
//         Logout
//       </Button>
//     </header>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

type User = {
  name: string;
  email: string;
};

export default function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await apiFetch<User>(
          `${API_BASE_URL}/users/me`
        );
        setUser(data);
      } catch {
        // handled globally by apiFetch
      }
    }

    loadUser();
  }, []);

  function handleLogout() {
    document.cookie = "token=; Max-Age=0; path=/";
    router.push("/login");
  }

  return (
    <header className="h-14 border-b bg-white px-6 flex items-center justify-between">
      <h1 className="font-semibold">InternSim</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-muted-foreground">
            {user.name}
          </span>
        )}

        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
