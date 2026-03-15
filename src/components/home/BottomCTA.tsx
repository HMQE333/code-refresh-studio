import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BottomCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setMessage("Podaj poprawny adres e-mail.");
      return;
    }

    // Mock success for now — will connect to backend later
    setStatus("success");
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
                }
              }}
              placeholder="Adres e-mail"
              className="flex-1 bg-background-3 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground-2 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium text-sm hover:brightness-110 transition-all whitespace-nowrap"
            >
              Zapisz się
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-sm ${
                status === "error" ? "text-destructive" : "text-primary"
              }`}
            >
              {message}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
