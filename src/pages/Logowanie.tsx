import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LogowaniePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setError("Podaj e-mail i hasło.");
      return;
    }

    setIsSubmitting(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (authError) {
      if (authError.message.includes("Invalid login")) {
        setError("Nieprawidłowy e-mail lub hasło.");
      } else {
        setError(authError.message);
      }
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="text-center mb-6">
            <Link to="/">
              <img src="/logo.png" alt="RybiaPaka.pl" className="h-8 mx-auto mb-4" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Zaloguj się</h1>
            <p className="text-sm text-muted-foreground mt-1">Witaj z powrotem!</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">Adres e-mail</label>
              <Input id="email" name="email" type="email" placeholder="twoj@email.com" />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground mb-1.5 block">Hasło</label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/odzyskaj-haslo" className="text-xs text-primary hover:underline">Zapomniałeś hasła?</Link>
            </div>
            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              <LogIn size={16} />
              {isSubmitting ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Nie masz konta?{" "}
            <Link to="/rejestracja" className="text-primary hover:underline font-medium">Zarejestruj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
