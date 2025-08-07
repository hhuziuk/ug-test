import axios from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import api from "../api";

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email: email, password: password });
      const newAccessToken = res.data.accessToken;

      setToken(newAccessToken);
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      localStorage.setItem("token", newAccessToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Login failed. Please check your credentials.");
      } else {
        alert("An unexpected error occurred during login.");
      }
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/register", { emailRaw: email, passwordRaw: password });
      const newAccessToken = res.data.accessToken;

      setToken(newAccessToken);
      api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      localStorage.setItem("token", newAccessToken);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        alert(error.response.data.message || "Registration failed.");
      } else {
        alert("An unexpected error occurred during registration.");
      }
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
