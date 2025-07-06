import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { toast } from "react-toastify";

//Interface what is needed for databse
interface AuthContextType {
  user: User | null;
  signinWithGithub: () => void;
  signOut: () => void;
}

//Create authentication context for signin and signout
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // it will store the session on user when user logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
    //refresh when auth changes (either signin or signout)
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  //it will get authentication from github and create a session
  const signinWithGithub = () => {
    supabase.auth.signInWithOAuth({ provider: "github" });
    toast.success("User Logged in Sucessfully");
  };

  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
      toast.error("Logout failed: " + error.message);
    } else {
      toast.success("Signed out successfully");
    }
  };

  return (
    <AuthContext.Provider value={{ user, signinWithGithub, signOut }}>
      {" "}
      {children}
    </AuthContext.Provider>
  );
};

//
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be within the AuthProvider");
  }
  return context;
};
