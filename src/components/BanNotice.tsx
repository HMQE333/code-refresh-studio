import { Ban } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function BanNotice() {
  const { isBanned, banReason, bannedUntil } = useAuth();

  if (!isBanned) return null;

  const until = bannedUntil ? new Date(bannedUntil).toLocaleDateString("pl-PL", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  }) : null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-destructive/95 backdrop-blur-sm border-b border-destructive text-destructive-foreground">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        <Ban className="w-5 h-5 shrink-0" />
        <div className="text-sm">
          <strong>Twoje konto jest zablokowane</strong>
          {until && <span> do {until}</span>}
          {banReason && <span> — Powód: {banReason}</span>}
        </div>
      </div>
    </div>
  );
}
