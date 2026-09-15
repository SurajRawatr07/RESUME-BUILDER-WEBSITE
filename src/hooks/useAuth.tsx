/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, UserProfile } from "@/lib/api";

export type { UserProfile };

export type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword?: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on application mount
  const checkSession = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return {
        success: false,
        message: res.message || "Invalid credentials",
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check your network and credentials.";
      return {
        success: false,
        message,
      };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.auth.register({ name, email, password, confirmPassword });
      if (res.success && res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return {
        success: false,
        message: res.message || "Failed to create account.",
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An account with this email may already exist or input is invalid.";
      return {
        success: false,
        message,
      };
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const res = await api.auth.updateProfile(updatedData);
      if (res.success && res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update profile:", err);
      return false;
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        signup,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
