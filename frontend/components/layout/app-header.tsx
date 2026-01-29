"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api"; // Assuming this helper exists from your previous code
import { API_BASE_URL } from "@/lib/config";

interface User {
  name: string;
  email: string;
}

export default function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch user details to get the name
    apiFetch<User>(`${API_BASE_URL}/users/me`)
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to load user", err));
  }, []);

  const handleLogout = () => {
    // Clear cookie and redirect
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  // Get the first letter (Default to 'U' if loading)
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-30 shadow-sm">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo (matches your other pages) */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-slate-800 hidden sm:block">
              InternSim
            </span>
          </Link>
        </div>

        {/* Right Side: User Profile */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Avatar Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 focus:outline-none group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {user?.name || "Loading..."}
                </p>
              </div>

              <div className="h-10 w-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm group-hover:ring-2 group-hover:ring-indigo-500 transition-all">
                {initial}
              </div>
            </button>

            {/* Simple Dropdown Menu */}
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 cursor-default"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-100 py-1 z-20">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
