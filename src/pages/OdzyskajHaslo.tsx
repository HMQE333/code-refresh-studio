import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OdzyskajHasloPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Podaj adres e-mail.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Podaj poprawny adres e-mail.");
      return;
    }
    setIsSubmitting(true);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-hasla`,
    });
    setIsSubmitting(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-border bg-card p-8">
          {!success ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Odzyskaj hasło</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Podaj adres e-mail powiązany z Twoim kontem. Wyślemy Ci link do resetowania hasła.
                </p>
              </div>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
              )}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground mb-1.5 block">Adres e-mail</label>
                  <Input id="email" type="email" placeholder="twoj@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Wysyłanie..." : "Wyślij link resetowania"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Sprawdź skrzynkę</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Jeśli istnieje konto z adresem <strong className="text-foreground">{email}</strong>, wyślemy na nie link do resetowania hasła.
              </p>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/logowanie" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Wróć do logowania
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
