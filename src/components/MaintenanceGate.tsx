import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const ALLOWLIST = [
  "/administracja",
  "/logowanie",
  "/rejestracja",
  "/odzyskaj-haslo",
  "/reset-hasla",
  "/errorauth",
];

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  const [siteName, setSiteName] = useState("RybiaPaka.pl");
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const location = useLocation();

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["maintenance", "site_name"])
      .then(({ data }) => {
        data?.forEach((row: any) => {
          if (row.key === "maintenance") setMaintenance(row.value === "true");
          if (row.key === "site_name") setSiteName(row.value);
        });
        setLoaded(true);
      });
  }, []);

  if (!loaded) return null;

  const isAllowed = ALLOWLIST.some((prefix) => location.pathname.startsWith(prefix));
  const shouldBlock = maintenance && !isAdmin && !isAllowed;

  if (!shouldBlock) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔧</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-3">Tryb konserwacji</h1>
        <p className="text-muted-foreground mb-6">
          {siteName} jest chwilowo niedostępna. Spróbuj ponownie za jakiś czas.
        </p>
        <div className="flex flex-col gap-3">
          {!user && (
            <Link
              to="/logowanie"
              className="text-sm text-primary hover:underline"
            >
              Jestem administratorem — zaloguj się
            </Link>
          )}
          <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-foreground">
            Kontakt
          </Link>
        </div>
      </div>
    </div>
  );
}
