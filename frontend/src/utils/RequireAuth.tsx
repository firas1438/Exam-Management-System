"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

interface AuthWrapperProps {
  children: React.ReactNode;
  requiredRole: string;
}

const RequireAuth: React.FC<AuthWrapperProps> = ({ children, requiredRole }) => {
  const { auth } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // État pour savoir si on attend la redirection

  useEffect(() => {
    if (!auth?.accessToken) {
      router.push("/sign-in"); // Redirection si non authentifié
    } else if (auth.role !== requiredRole) {
      router.push("/unauthorized"); // Redirection si rôle non valide
    } else {
      setIsLoading(false); // Laisse afficher les enfants si tout est OK
    }
  }, [auth, requiredRole, router]); // Exécuter à chaque changement d’authentification

  if (isLoading) return null; // Empêcher l'affichage du contenu tant que la vérification est en cours

  return <>{children}</>; // Affiche les enfants uniquement si tout est bon
};

export default RequireAuth;
