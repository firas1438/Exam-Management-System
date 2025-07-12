"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";

interface AuthWrapperProps {
  children: React.ReactNode;
//   requiredRole: string;
}

const PersistLogin: React.FC<AuthWrapperProps> = ({ children }) => {
  const { auth } = useAuth();
  const refresh=useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const verifyRefreshToken = async () => {
        try {
            await refresh();
        }
        catch (err) {
            console.error(err);
        }
        finally {
             setIsLoading(false);
        }
    }

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken  ? verifyRefreshToken() : setIsLoading(false);

}, [])

useEffect(() => {
    console.log(`isLoading: ${isLoading}`)
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
}, [isLoading])


//   if (!auth?.accessToken) {
//     router.push("/sign-in");
//     return null;
//   } else if (auth.role !== requiredRole) {
//     router.push("/unauthorized");
//     return null;
//   }
// return <>{children}</>;
    if(isLoading) return <p>Loading...</p>
    else return <>{children}</>;
};

export default PersistLogin;
