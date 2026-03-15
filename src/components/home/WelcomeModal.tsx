import { useEffect, useRef, useState } from "react";
import { X, Fish, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "rybiapaka_welcome_seen";
const AUTO_CLOSE_SECONDS = 10;

export default function WelcomeModal() {
  const [show, setShow] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);
  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!show) return;

    const startTime = Date.now();
    setSecondsLeft(AUTO_CLOSE_SECONDS);

    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((AUTO_CLOSE_SECONDS * 1000 - elapsed) / 1000));
      setSecondsLeft(remaining);
    }, 1000);

    timerRef.current = window.setTimeout(() => {
      dismiss();
    }, AUTO_CLOSE_SECONDS * 1000);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [show]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={dismiss}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Badge */}
            <span className="absolute top-4 left-5 text-[10px] font-bold tracking-widest text-primary/60 uppercase">
              Alfa
            </span>

            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
                <Fish className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                RybiaPaka.pl 🎣
              </h2>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Zintegrowana platforma wędkarska, która łączy galerię zdjęć,
                forum, wiadomości i narzędzia dla wędkarzy w jednym miejscu.
              </p>
              <p className="text-xs text-muted-foreground/70 mb-6">
                To wersja Alfa. Jeśli coś nie działa, prosimy o zgłaszanie błędów w{" "}
                <Link to="/zglos-problem" onClick={dismiss} className="text-primary hover:underline">
                  formularzu zgłoszeń
                </Link>.
              </p>

              <p className="text-xs text-muted-foreground mb-4">
                Okno zamknie się za{" "}
                <span className="font-bold text-foreground">{Math.max(1, secondsLeft)}</span> s
              </p>

              <div className="flex flex-col gap-3">
                <Link
                  to="/rejestracja"
                  onClick={dismiss}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:brightness-110 transition-all"
                >
                  Dołącz do społeczności
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={dismiss}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Przejdź do platformy
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
              <div
                className="h-full bg-primary origin-left"
                style={{
                  animation: `welcome-progress ${AUTO_CLOSE_SECONDS}s linear forwards`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
