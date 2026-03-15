import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Fish,
  Home,
  Images,
  LifeBuoy,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SwimmingFish {
  id: number;
  top: number;
  size: number;
  duration: number;
}

type DashboardStop = {
  id: string;
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  badge?: string;
  offsetClass?: string;
};

const DASHBOARD_STOPS: DashboardStop[] = [
  { id: "home", title: "Strona Główna", description: "Start i podsumowanie", href: "/", Icon: Home, badge: "START", offsetClass: "-translate-x-10 sm:-translate-x-16" },
  { id: "dyskusje", title: "Dyskusje", description: "Rozmowy na żywo", href: "/dyskusje", Icon: Compass, badge: "NA ŻYWO", offsetClass: "translate-x-6 sm:translate-x-14" },
  { id: "forum", title: "Forum", description: "Nowe wątki", href: "/forum", Icon: MessageSquare, badge: "WĄTKI", offsetClass: "-translate-x-4 sm:-translate-x-12" },
  { id: "galeria", title: "Galeria", description: "Świeże okazy", href: "/galeria", Icon: Images, offsetClass: "translate-x-12 sm:translate-x-20" },
  { id: "informacje", title: "Informacje", description: "Poradniki i newsy", href: "/informacje", Icon: MapPin, offsetClass: "-translate-x-12 sm:-translate-x-20" },
  { id: "kontakt", title: "Kontakt", description: "Napisz do nas", href: "/kontakt", Icon: Mail, offsetClass: "translate-x-2 sm:translate-x-10" },
  { id: "zglos-problem", title: "Zgłoś problem", description: "Zgłoś problem", href: "/zglos-problem", Icon: LifeBuoy, offsetClass: "translate-x-12 sm:translate-x-18" },
];

const QUICK_ACTIONS = [
  { title: "Nowy wątek na forum", description: "Zacznij rozmowę ze społecznością", href: "/forum", Icon: MessageSquare },
  { title: "Dołącz do dyskusji", description: "Rozmowy na żywo i metody wędkarskie", href: "/dyskusje", Icon: Compass },
  { title: "Dodaj zdjęcie", description: "Pokaż swój ostatni okaz", href: "/galeria", Icon: Images },
];

const RADAR_ITEMS = [
  { label: "Forum", description: "Nowe tematy i odpowiedzi" },
  { label: "Dyskusje", description: "Aktywne rozmowy live" },
  { label: "Galeria", description: "Świeże zdjęcia od wędkarzy" },
];

export default function Hero() {
  const { user } = useAuth();
  const isDashboard = !!user;
  const location = useLocation();
  const [fishes, setFishes] = useState<SwimmingFish[]>([]);
  const fishCounter = useRef(0);

  useEffect(() => {
    setFishes([]);
    fishCounter.current = 0;

    const spawnFish = () => {
      const id = fishCounter.current++;
      const top = Math.random() * 70 + 10;
      const size = Math.random() * (isDashboard ? 14 : 20) + 14;
      const duration = Math.random() * (isDashboard ? 12 : 10) + 10;
      setFishes((prev) => [...prev, { id, top, size, duration }]);
      setTimeout(() => {
        setFishes((prev) => prev.filter((f) => f.id !== id));
      }, duration * 1000);
    };

    const interval = setInterval(spawnFish, isDashboard ? 1100 : 700);
    for (let i = 0; i < (isDashboard ? 4 : 6); i++) spawnFish();
    return () => clearInterval(interval);
  }, [isDashboard]);

  return (
    <section className={cn("relative overflow-hidden", isDashboard ? "min-h-[70vh] flex items-start pt-24 pb-12" : "min-h-[90vh] flex items-center justify-center")}>
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
      {isDashboard ? (
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Pulpit nawigacyjny</h1>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-background-3/60 px-3 py-1 rounded-full border border-border">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Szlak 01 — Droga do najlepszych połowów
              </div>
            </div>

            {/* Navigation stops */}
            <div className="flex flex-col items-center gap-3 mb-10">
              {DASHBOARD_STOPS.map((stop, index) => {
                const isCurrent = location.pathname === stop.href || (stop.href !== "/" && location.pathname.startsWith(stop.href));
                const isHome = stop.id === "home";
                return (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.35 }}
                    className={cn("w-full max-w-sm", stop.offsetClass)}
                  >
                    <Link
                      to={stop.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all group",
                        isCurrent
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb,0,206,0),0.2)]"
                          : "border-border bg-background-3/50 hover:border-primary/30 hover:bg-background-3"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border backdrop-blur transition-colors",
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background-4 text-foreground group-hover:text-primary"
                      )}>
                        <stop.Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{stop.title}</span>
                          {stop.badge && (
                            <span className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                              isCurrent ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"
                            )}>
                              {stop.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{stop.description}</span>
                      </div>
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </Link>
                  </motion.div>
                );
              })}
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" /> = Strona, na której jesteś
              </p>
            </div>

            {/* Quick actions + Radar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick actions */}
              <div className="rounded-2xl border border-border bg-background-3/50 p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">Szybkie akcje</h3>
                <div className="space-y-2">
                  {QUICK_ACTIONS.map((action) => (
                    <Link
                      key={action.href}
                      to={action.href}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background-4/50 px-4 py-3 hover:border-primary/30 hover:bg-background-4 transition-all group"
                    >
                      <action.Icon size={16} className="text-primary shrink-0" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{action.title}</span>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Community radar */}
              <div className="rounded-2xl border border-border bg-background-3/50 p-5">
                <h3 className="text-sm font-bold text-foreground mb-4">Radar społeczności</h3>
                <div className="space-y-3">
                  {RADAR_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-primary/60 shrink-0 animate-pulse" />
                      <div>
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
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
      )}
    </section>
  );
}
