"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { CookieManager } from "@/lib/cookies";

interface User {
  userName: string;
  token: string;
  loginTime: number;
}

interface LoginContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: { token: string; userName: string }) => void;
  logout: () => void;
  checkAuthStatus: () => boolean;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

interface LoginProviderProps {
  children: ReactNode;
}

export const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check authentication status
  const checkAuthStatus = useCallback((): boolean => {
    const tokenData = CookieManager.getSecureToken();

    if (tokenData && tokenData.isValid) {
      if (!user) {
        setUser({
          userName: tokenData.userName,
          token: tokenData.token,
          loginTime: Date.now(),
        });
      }
      return true;
    } else {
      if (user) {
        setUser(null);
        CookieManager.clearAuthCookies();
      }
      return false;
    }
  }, [user]);

  // Login function
  const login = (userData: { token: string; userName: string }) => {
    const newUser: User = {
      userName: userData.userName,
      token: userData.token,
      loginTime: Date.now(),
    };

    setUser(newUser);

    // Set secure cookie with 8 hours expiry for government site security
    CookieManager.setSecureToken(userData.token, userData.userName, 0.33); // 8 hours

    // Set additional session tracking
    CookieManager.setCookie("user_session", "active", {
      expires: 0.33,
      secure: true,
      sameSite: "strict",
    });
  };

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    CookieManager.clearAuthCookies();
    router.push("/login");
  }, [router]);

  // Check auth on mount and periodically
  useEffect(() => {
    checkAuthStatus();
    setIsLoading(false);

    const interval = setInterval(() => {
      if (!checkAuthStatus()) {
        logout();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuthStatus, logout]);

  // Auto logout on tab visibility change (security feature)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Set a timestamp when tab becomes hidden
        CookieManager.setCookie("tab_hidden_time", Date.now().toString(), {
          expires: 1,
          secure: true,
        });
      } else {
        // Check if tab was hidden for too long (30 minutes)
        const hiddenTime = CookieManager.getCookie("tab_hidden_time");
        if (hiddenTime) {
          const timeDiff = Date.now() - Number.parseInt(hiddenTime);
          const maxHiddenTime = 30 * 60 * 1000; // 30 minutes

          if (timeDiff > maxHiddenTime && user) {
            logout();
          }
          CookieManager.deleteCookie("tab_hidden_time");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user, logout]);

  const value: LoginContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
};

export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};
