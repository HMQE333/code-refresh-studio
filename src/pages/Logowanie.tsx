import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Potwierdź swój adres e-mail przed zalogowaniem.");
      } else {
        setError(authError.message);
      }
      return;
    }

    // Check if banned
    const { data: profile } = await supabase
      .from("profiles")
      .select("banned_until, ban_reason")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .maybeSingle();

    if (profile?.banned_until && new Date(profile.banned_until) > new Date()) {
      const banDate = new Date(profile.banned_until).toLocaleDateString("pl-PL");
      await supabase.auth.signOut();
      setError(`Twoje konto jest zbanowane do ${banDate}.${profile.ban_reason ? ` Powód: ${profile.ban_reason}` : ""}`);
      return;
    }

    navigate("/");
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setError("Nie udało się zalogować przez Google.");
    }
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground uppercase">albo</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 text-sm text-foreground hover:bg-secondary transition-colors interactive-press"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Zaloguj się przez Google
          </button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Nie masz konta?{" "}
            <Link to="/rejestracja" className="text-primary hover:underline font-medium">Zarejestruj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
