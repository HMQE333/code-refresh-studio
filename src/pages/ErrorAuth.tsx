import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function ErrorAuthPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">Błąd autoryzacji</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Nie udało się zalogować przez zewnętrznego dostawcę. Spróbuj ponownie lub wybierz inną metodę logowania.
          </p>

          <div className="flex flex-col gap-2">
            <Link
              to="/logowanie"
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              Wróć do logowania
            </Link>
            <Link
              to="/kontakt"
              className="px-4 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
