function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const token = getTokenFromCookie();

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
    });

    // 🔐 401 handling
    if (res.status === 401) {
      document.cookie = "token=; Max-Age=0; path=/";

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login";
      }

      throw new Error("Unauthorized");
    }

    if (!res.ok) {
      let message = "Something went wrong. Please try again.";

      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {}

      throw new Error(message);
    }

    return res.json();
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error(
      "Unable to connect to server. Please try again later."
    );
  }
}
