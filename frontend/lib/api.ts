// frontend/lib/api.ts

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

type ApiError = {
  message: string;
  status?: number;
};

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getTokenFromCookie();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        ...options.headers,
      },
    });

    // 🔐 UNAUTHORIZED
    if (res.status === 401) {
      // clear auth
      document.cookie = "token=; Max-Age=0; path=/";

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        window.location.href = "/login";
      }

      throw {
        message: "Session expired. Please login again.",
        status: 401,
      } as ApiError;
    }

    // ❌ OTHER SERVER ERRORS
    if (!res.ok) {
      let message = "Something went wrong. Please try again.";

      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {}

      throw { message, status: res.status } as ApiError;
    }

    // ✅ SUCCESS
    return res.json();
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "status" in error) {
      throw error as ApiError;
    }

    throw {
      message: "Unable to connect to server. Please try again later.",
    } as ApiError;
  }
}
