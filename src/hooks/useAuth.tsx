/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  totalResumes?: number;
  latestResume?: string;
  lastUpdated?: string;
  templatesUsed?: string[];
  createdAt?: string;
}

export type AuthContextType = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  name: "Suraj Rawat",
  email: "rawatsuraj80627@gmail.com",
  password: "password123",
  title: "Full Stack Engineer",
  phone: "+91 9675219087",
  location: "Haldwani, Uttarakhand, India",
  bio: "Passionate software engineer crafting high-impact digital experiences and modern web applications with React, TypeScript, and cloud technologies.",
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js", "GraphQL", "PostgreSQL"],
  linkedin: "https://linkedin.com/in/suraj-rawat-30513b340",
  github: "https://github.com/SurajRawatr07",
  portfolio: "https://surajrawat.dev",
  totalResumes: 1,
  latestResume: "Software_Engineer_Resume.pdf",
  lastUpdated: "Today",
  templatesUsed: ["Modern", "Professional"],
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize stored users and check active session
  useEffect(() => {
    try {
      // Ensure users collection exists in localStorage
      const storedUsersRaw = localStorage.getItem("users");
      let users: UserProfile[] = [];
      if (storedUsersRaw) {
        users = JSON.parse(storedUsersRaw);
      } else {
        users = [DEFAULT_USER];
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Check active auth session
      const authFlag = localStorage.getItem("auth");
      const currentEmail = localStorage.getItem("currentUserEmail");

      if (authFlag === "true" && currentEmail) {
        const foundUser = users.find(
          (u) => u.email.toLowerCase() === currentEmail.toLowerCase()
        );
        if (foundUser) {
          setUser(foundUser);
          setIsAuthenticated(true);
        } else {
          // Invalidate stale session
          localStorage.removeItem("auth");
          localStorage.removeItem("currentUserEmail");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    // Artificial slight delay for realistic, crisp SaaS feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      return {
        success: false,
        message: "Please enter both email and password.",
      };
    }

    const storedUsersRaw = localStorage.getItem("users");
    const users: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const existingUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (!existingUser) {
      return {
        success: false,
        message: "No account found with this email address. Please register first.",
      };
    }

    if (existingUser.password && existingUser.password !== trimmedPass) {
      return {
        success: false,
        message: "Incorrect password. Please verify your credentials and try again.",
      };
    }

    // Success: store active session
    localStorage.setItem("auth", "true");
    localStorage.setItem("currentUserEmail", existingUser.email);
    setUser(existingUser);
    setIsAuthenticated(true);

    return { success: true };
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      };
    }

    if (trimmedPass.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long.",
      };
    }

    const storedUsersRaw = localStorage.getItem("users");
    const users: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const exists = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    if (exists) {
      return {
        success: false,
        message: "An account with this email address already exists. Please sign in instead.",
      };
    }

    const newUser: UserProfile = {
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPass,
      title: "Job Seeker / Professional",
      phone: "",
      location: "",
      bio: "Crafting a standout professional resume.",
      skills: ["Problem Solving", "Communication", "Team Collaboration"],
      linkedin: "",
      github: "",
      portfolio: "",
      totalResumes: 1,
      latestResume: "My_Resume.pdf",
      lastUpdated: "Just now",
      templatesUsed: ["Modern"],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Sign in the newly registered user immediately into the session
    localStorage.setItem("auth", "true");
    localStorage.setItem("currentUserEmail", newUser.email);
    setUser(newUser);
    setIsAuthenticated(true);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("currentUserEmail");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    const storedUsersRaw = localStorage.getItem("users");
    const users: UserProfile[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === user.email.toLowerCase()
    );

    if (userIndex === -1) return false;

    const updatedUser: UserProfile = {
      ...users[userIndex],
      ...updatedData,
    };

    users[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    setUser(updatedUser);

    if (updatedData.email && updatedData.email !== user.email) {
      localStorage.setItem("currentUserEmail", updatedData.email);
    }

    return true;
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
