"use client"

import { useState,createContext, ReactNode } from "react";
interface AuthContextType {

    setAuth: React.Dispatch<React.SetStateAction<any>>
    auth: any


  
  }
const AuthContext = createContext<AuthContextType>({
    auth: {},
    setAuth: () => {},

  });

interface AuthProviderProps {
    children: ReactNode;
}
interface AuthState {
    accessToken?: string;
    email?: string;
    password?: string;
    role?: string;
  }

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthState>({})


    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext










