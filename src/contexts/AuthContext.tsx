import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isBanned: boolean;
  banReason: string | null;
  bannedUntil: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isBanned: false,
  banReason: null,
  bannedUntil: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);
  const [banReason, setBanReason] = useState<string | null>(null);
  const [bannedUntil, setBannedUntil] = useState<string | null>(null);

  const checkBan = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("banned_until, ban_reason")
      .eq("user_id", userId)
      .maybeSingle();

    if (data?.banned_until && new Date(data.banned_until) > new Date()) {
      setIsBanned(true);
      setBanReason(data.ban_reason);
      setBannedUntil(data.banned_until);
    } else {
      setIsBanned(false);
      setBanReason(null);
      setBannedUntil(null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session?.user) {
        checkBan(session.user.id);
        // Update last_seen_at
        supabase.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("user_id", session.user.id).then(() => {});
      } else {
        setIsBanned(false);
        setBanReason(null);
        setBannedUntil(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session?.user) {
        checkBan(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading,
      isBanned,
      banReason,
      bannedUntil,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
