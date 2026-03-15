import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import fishImg from "@/assets/404-fish.png";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <img
          src={fishImg}
          alt="Zagubiona rybka"
          className="w-48 h-auto mx-auto mb-6 drop-shadow-lg"
        />
        <div className="text-6xl font-bold text-primary/20 mb-3">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Strona nie została znaleziona</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Wygląda na to, że ta strona nie istnieje lub została przeniesiona.
          Nawet nasza rybka nie może jej znaleźć!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
          >
            <Home className="w-4 h-4" />
            Wróć na stronę główną
          </Link>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kontakt
          </Link>
        </div>
      </div>
    </div>
  );
}
