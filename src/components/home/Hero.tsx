import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Fish } from "lucide-react";
import { motion } from "framer-motion";

interface SwimmingFish {
  id: number;
  top: number;
  size: number;
  duration: number;
}

export default function Hero() {
  const [fishes, setFishes] = useState<SwimmingFish[]>([]);
  const fishCounter = useRef(0);

  useEffect(() => {
    setFishes([]);
    fishCounter.current = 0;

    const spawnFish = () => {
      const id = fishCounter.current++;
      const top = Math.random() * 70 + 10;
      const size = Math.random() * 20 + 14;
      const duration = Math.random() * 10 + 10;

      setFishes((prev) => [...prev, { id, top, size, duration }]);

      setTimeout(() => {
        setFishes((prev) => prev.filter((f) => f.id !== id));
      }, duration * 1000);
    };

    const interval = setInterval(spawnFish, 700);
    for (let i = 0; i < 6; i++) spawnFish();
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-2" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[100px]" />

      {/* Swimming fish */}
      {fishes.map((fish) => (
        <div
          key={fish.id}
          className="fish-animation"
          style={{ top: `${fish.top}%`, animationDuration: `${fish.duration}s` }}
        >
          <Fish size={fish.size} className="text-primary/20" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Dołącz do najlepszej{" "}
            <span className="text-primary">społeczności wędkarskiej</span>{" "}
            w Polsce!
          </h1>
          <p className="text-lg sm:text-xl text-foreground-2 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dziel się swoimi okazami, wymieniaj doświadczeniami i poznawaj
            pasjonatów takich jak Ty. Razem tworzymy historię polskiego
            wędkarstwa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/rejestracja"
              className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-primary/25"
            >
              Dołącz teraz
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/logowanie"
              className="flex items-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-2xl font-medium text-base hover:bg-background-3 transition-all"
            >
              Zaloguj się
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
