"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "@/i18n/navigation";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastLoginAt?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.ok && data.user) {
        return data.user as AuthUser;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const sessionUser = await fetchSession();
    setUser(sessionUser);
    setIsLoading(false);
  }, [fetchSession]);

  useEffect(() => {
    let ignore = false;
    fetchSession().then((currentUser) => {
      if (!ignore) {
        setUser(currentUser);
        setIsLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchSession]);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ ok: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        return {
          ok: false,
          message: data.message || "خطا در برقراری ارتباط با سرور",
        };
      }

      setUser(data.user);
      return { ok: true, message: data.message };
    } catch {
      return {
        ok: false,
        message: "خطای شبکه رخ داده است. لطفاً اتصال اینترنت خود را بررسی کنید.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      router.push("/admin/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
