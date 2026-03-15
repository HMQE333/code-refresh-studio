import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "***";
  const masked = local.length <= 2 ? "*".repeat(local.length) : local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
  return `${masked}@${domain}`;
}

export default function BottomCTA() {
  const [email, setEmail] = useState("");
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [revealEmail, setRevealEmail] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    setSavedEmail(null);
    setRevealEmail(false);

    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setMessage("Podaj poprawny adres e-mail.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    const { error } = await supabase.from("newsletter_subscribers").insert({ email: trimmed });
    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setSavedEmail(trimmed);
        setMessage("Już zapisałeś się do newslettera.");
        setEmail("");
        return;
      }
      setStatus("error");
      setMessage("Nie udało się zapisać. Spróbuj ponownie.");
      return;
    }

    setStatus("success");
    setSavedEmail(trimmed);
    setMessage("Dziękujemy! Już zapisałeś się do newslettera.");
    setEmail("");
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Podoba Ci się to, co widzisz?{" "}
            <span className="text-primary">Zapisz się do newslettera.</span>
          </h2>
          <p className="text-foreground-2 mb-8 leading-relaxed">
            Jedna wiadomość raz na jakiś czas: nowości, konkursy, poradniki i
            aktualizacje serwisu.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") {
                  setStatus("idle");
                  setMessage(null);
                  setSavedEmail(null);
                }
              }}
              placeholder="Adres e-mail"
              className="flex-1 bg-background-3 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium text-sm hover:brightness-110 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {status === "loading" ? "Zapisywanie..." : "Zapisz się"}
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm ${status === "error" ? "text-destructive" : "text-primary"}`}>
              {message}
            </p>
          )}

          {savedEmail && status === "success" && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>Zapisano: {revealEmail ? savedEmail : maskEmail(savedEmail)}</span>
              <button
                type="button"
                onClick={() => setRevealEmail(!revealEmail)}
                className="p-1 hover:text-foreground transition-colors"
                title={revealEmail ? "Ukryj e-mail" : "Pokaż e-mail"}
              >
                {revealEmail ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
