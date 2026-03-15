import { Ban, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function BanNotice() {
  const { isBanned, banReason, bannedUntil, signOut } = useAuth();

  if (!isBanned) return null;

  const until = bannedUntil ? new Date(bannedUntil).toLocaleDateString("pl-PL", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  }) : null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-destructive/95 backdrop-blur-sm border-b border-destructive text-destructive-foreground">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-start gap-3">
          <Ban className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <strong>Twoje konto zostało zablokowane</strong>
              {until && <span> do {until}</span>}
            </div>
            {banReason && (
              <p className="text-xs mt-1 opacity-90">Powód: {banReason}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <Link
                to="/odwolanie"
                className="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Złóż odwołanie
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={signOut}
                className="text-xs opacity-75 hover:opacity-100 transition-opacity"
              >
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
