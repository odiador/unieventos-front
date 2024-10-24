"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { checkUser, login } from "./api";
import { CheckUserDTO, LoginResponseDTO } from "./schemas";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";

async function checkUserCookie(cookie?: string) {
  if (!cookie)
    return null;
  return await checkUser(cookie);
}

interface AuthContext {
  updateRole: () => Promise<CheckUserDTO | null>;
  account: { role: "CLIENT" | "ADMINISTRATOR", email: string, name: string } | null;
  signin: (email: string, password?: string, code?: string) => Promise<{ status: number; data: any; }>;
  signout: () => void;
  loggedIn: () => boolean;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuthContext must be used within a AuthProvider');
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {

  const [account, setAccount] = useState<{ role: "CLIENT" | "ADMINISTRATOR", email: string, name: string } | null>(null);
  const [waiting, setWaiting] = useState(false);

  const updateRole = async () => {
    if (!loggedIn())
      return null;
    const response = await checkUserCookie(getCookie("jwt"));
    if (response?.status != 200) {
      signout();
      return null;
    }
    const data = response.data.response as CheckUserDTO;
    setAccount(data);
    return data;
  }
  const signin = async (email: string, password?: string, code?: string) => {
    let data = {};
    if (password) data = { email, password };
    if (code) data = { email, code };
    const response = await login(JSON.stringify(data));
    if (response.status === 200) {
      const data = response.data.response as LoginResponseDTO;
      setAccount({ email: email, role: data.role, name: data.userData.name });
      setCookie("jwt", "Bearer " + data.token);
    }
    return response;
  }
  const loggedIn = () => {
    return hasCookie("jwt");
  }
  const signout = () => {
    setAccount(null);
    if (hasCookie("jwt"))
      deleteCookie("jwt")
  }
  return <AuthContext.Provider value={{ updateRole, account, signin, signout, loggedIn }}>
    {children}
  </AuthContext.Provider>
}
export { AuthProvider, checkUserCookie as checkRole, useAuthContext };