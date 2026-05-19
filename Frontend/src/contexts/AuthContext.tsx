import React, { createContext, useContext, useState, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  role: "volunteer" | "citizen";
  verificationStatus: "pending" | "verified" | "rejected" | "unsubmitted";
  avatar?: string;
  joinedAt: string;
  reportsSubmitted: number;
  trustScore: number;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  requiresVerification?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (data: Pick<User, "name" | "email" | "city" | "role"> & { password?: string }) => Promise<AuthResponse>;
  signOut: () => void;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (password: string) => Promise<AuthResponse>;
  resendVerification: (email: string) => Promise<AuthResponse>;
  updateVerification: (status: User["verificationStatus"]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("resq_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("resq_user");
      return null;
    }
  });

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          success: false, 
          error: data.detail || "Login failed",
          requiresVerification: response.status === 403
        };
      }
      
      const supabaseUser = data.session.user;
      
      const mappedUser: User = {
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email || "",
        city: supabaseUser.user_metadata?.city || "",
        role: supabaseUser.user_metadata?.role || "citizen",
        verificationStatus: "unsubmitted",
        joinedAt: supabaseUser.created_at,
        reportsSubmitted: 0,
        trustScore: 0,
      };

      setUser(mappedUser);
      localStorage.setItem("resq_user", JSON.stringify(mappedUser));
      localStorage.setItem("resq_session", JSON.stringify(data.session));
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
  }, []);

  const signUp = useCallback(async (data: Pick<User, "name" | "email" | "city" | "role"> & { password?: string }): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          city: data.city,
          role: data.role
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.detail || "Signup failed" };
      }

      return { 
        success: true, 
        requiresVerification: result.requires_verification 
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { success: false, error: error.message || "An unexpected error occurred" };
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.detail || "Request failed" };
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const resetPassword = useCallback(async (password: string): Promise<AuthResponse> => {
    try {
      // In Supabase, resetting password usually happens while the user is temporarily 'signed in' 
      // via the recovery link. We'll send the request to our backend.
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: password, token: "temp" }), // token handled by session usually
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.detail || "Reset failed" };
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const resendVerification = useCallback(async (email: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data.detail || "Failed to resend" };
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("resq_user");
      localStorage.removeItem("resq_session");
    }
  }, []);

  const updateVerification = useCallback(async (status: User["verificationStatus"]) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, verificationStatus: status };
      localStorage.setItem("resq_user", JSON.stringify(updated));
      return updated;
    });

    // In a real app, you would call the backend to update the status in the DB
    // For now, we update local state and you can later add a backend route for this
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      signIn, 
      signUp, 
      signOut, 
      forgotPassword, 
      resetPassword, 
      resendVerification, 
      updateVerification 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
