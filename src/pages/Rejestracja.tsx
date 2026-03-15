import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";

export default function RejestracjaPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  const errorMessages: Record<number, { title: string; message: string }> = {
    1: { title: "Hasła nie pasują", message: "Wpisz identyczne hasło w obu polach." },
    2: { title: "E-mail zajęty", message: "Ten adres e-mail jest już zarejestrowany." },
    3: { title: "Błąd rejestracji", message: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później." },
    4: { title: "Nazwa użytkownika zajęta", message: "Wybierz inną nazwę użytkownika." },
    5: { title: "Brak danych", message: "Podaj nazwę użytkownika, e-mail i hasło." },
    6: { title: "Hasło za krótkie", message: "Hasło musi mieć co najmniej 8 znaków." },
    7: { title: "Niepoprawny e-mail", message: "Podaj poprawny adres e-mail." },
    8: { title: "Rejestracja udana!", message: "Sprawdź swoją skrzynkę e-mail, aby potwierdzić konto." },
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(0);
    const data = new FormData(e.currentTarget);
    const username = String(data.get("username") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage(5);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(1);
      return;
    }
    if (password.length < 8) {
      setErrorMessage(6);
      return;
    }

    setIsSubmitting(true);

    // Check if username is taken
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      setErrorMessage(4);
      setIsSubmitting(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: window.location.origin,
      },
    });

    setIsSubmitting(false);

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        setErrorMessage(2);
      } else {
        setErrorMessage(3);
      }
      return;
    }

    // Show success message — user needs to confirm email
    setErrorMessage(8);
  };

  const handleGoogleSignup = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      setErrorMessage(3);
    }
  };

  const errorInfo = errorMessage ? errorMessages[errorMessage] : null;
  const isSuccess = errorMessage === 8;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 page-transition">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="RybiaPaka.pl" className="h-8" />
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">Dołącz do naszej społeczności</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            RybiaPaka.pl jest najlepszą społecznością wędkarską w Polsce.
          </p>

          {errorMessage !== 0 && errorInfo && (
            <div className={`mb-4 rounded-xl border p-4 ${
              isSuccess
                ? "border-primary/30 bg-primary/10"
                : "border-destructive/30 bg-destructive/10"
            }`}>
              <p className={`text-sm font-semibold ${isSuccess ? "text-primary" : "text-destructive"}`}>{errorInfo.title}</p>
              <p className={`text-xs mt-1 ${isSuccess ? "text-primary/80" : "text-destructive/80"}`}>{errorInfo.message}</p>
            </div>
          )}

          {!isSuccess && (
            <>
              <form onSubmit={onSubmit} className="space-y-4">
                <input
                  name="username"
                  type="text"
                  placeholder="Nazwa użytkownika"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Hasło"
                    required
                    minLength={8}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordValue.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => {
                        const strength = getPasswordStrength(passwordValue);
                        return (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              level <= strength.level
                                ? strength.level <= 1 ? "bg-destructive" : strength.level <= 2 ? "bg-yellow-500" : strength.level <= 3 ? "bg-blue-500" : "bg-green-500"
                                : "bg-border"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className={`text-[10px] ${
                      getPasswordStrength(passwordValue).level <= 1 ? "text-destructive" : getPasswordStrength(passwordValue).level <= 2 ? "text-yellow-500" : "text-green-500"
                    }`}>
                      {getPasswordStrength(passwordValue).label}
                    </p>
                  </div>
                )}
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Potwierdź hasło"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold py-3 text-sm hover:brightness-110 transition-all disabled:opacity-50 interactive-press"
                >
                  <UserPlus size={16} />
                  {isSubmitting ? "Rejestracja..." : "Zarejestruj się"}
                </button>
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
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 text-sm text-foreground hover:bg-secondary transition-colors interactive-press"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Zarejestruj się przez Google
              </button>
            </>
          )}

          <p className="text-xs text-muted-foreground text-center mt-6">
            Masz już konto?{" "}
            <Link to="/logowanie" className="text-primary hover:underline">
              Zaloguj się
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
