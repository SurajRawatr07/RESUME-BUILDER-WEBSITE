/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem("auth", "true");
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("auth");
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      return false;
    }

    const newUser = { name, email, password };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // auto login after signup
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);

    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}