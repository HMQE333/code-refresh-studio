import { useEffect, useState } from "react";
import { X, Fish, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "rybiapaka_welcome_seen";

export default function WelcomeModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "1");
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
            className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-5">
                <Fish className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Witaj na RybiaPaka.pl! 🎣
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Najlepsza społeczność wędkarska w Polsce. Dołącz do nas, dziel się swoimi
                okazami i wymieniaj doświadczenia z innymi pasjonatami.
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
                  Później — chcę się najpierw rozejrzeć
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border rounded-b-2xl overflow-hidden">
              <div
                className="h-full bg-primary origin-left"
                style={{ animation: "welcome-progress 8s linear forwards" }}
                onAnimationEnd={dismiss}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
