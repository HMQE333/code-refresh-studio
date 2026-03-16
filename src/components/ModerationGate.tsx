import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function formatDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pl-PL");
}

export default function ModerationGate({ children }: { children: React.ReactNode }) {
  const { user, isBanned, banReason, bannedUntil, signOut } = useAuth();
  const location = useLocation();

  const allowlisted = useMemo(
    () => ["/odwolanie", "/kontakt", "/logowanie", "/rejestracja", "/odzyskaj-haslo", "/reset-hasla", "/errorauth"].some(
      (prefix) => location.pathname.startsWith(prefix)
    ),
    [location.pathname]
  );

  // Not banned or on allowlisted page
  if (!isBanned || allowlisted || !user) {
    return <>{children}</>;
  }

  // Check if it's a permanent ban or temporary suspension
  const isPermanent = bannedUntil && new Date(bannedUntil).getFullYear() > 2099;
  const isSuspension = bannedUntil && !isPermanent;

  if (isPermanent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Konto zablokowane</h1>
          <p className="text-muted-foreground">
            Twoje konto zostało zablokowane na stałe.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Powód: {banReason || "Naruszenie regulaminu."}</p>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/odwolanie"
              className="text-sm text-primary hover:underline"
            >
              Jeśli chcesz się odwołać, przejdź do instrukcji
            </Link>
            <button
              onClick={signOut}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Wyloguj
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuspension) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <span className="text-3xl">⏸️</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Przerwa na koncie</h1>
          <p className="text-muted-foreground">
            Twoje konto ma aktywną przerwę.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            {bannedUntil && <p>Do: {formatDate(bannedUntil)}</p>}
            <p>Powód: {banReason || "Naruszenie regulaminu."}</p>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors pt-2"
          >
            Wyloguj
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
