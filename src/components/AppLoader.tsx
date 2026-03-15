import { useEffect, useRef, useState } from "react";
import { Fish } from "lucide-react";

const FACTS = [
  "Ciekawostka: Czy wiedziałeś, że ryby mają linię boczną, która wyczuwa drgania wody?",
  "Ciekawostka: Czy wiedziałeś, że szczupak potrafi przyspieszyć w ułamku sekundy, by zaatakować ofiarę?",
  "Ciekawostka: Czy wiedziałeś, że karpie mogą dożywać kilkudziesięciu lat?",
  "Ciekawostka: Czy wiedziałeś, że sum ma bardzo czułe wąsy pomagające mu znaleźć pokarm w mętnej wodzie?",
  "Ciekawostka: Czy wiedziałeś, że ryby reagują na dźwięki i wibracje?",
  "Ciekawostka: Czy wiedziałeś, że wiele ryb żeruje najaktywniej o świcie i zmierzchu?",
  "Ciekawostka: Czy wiedziałeś, że okonie często polują w stadach, zbijając narybek?",
  "Ciekawostka: Czy wiedziałeś, że pstrągi preferują chłodne, dobrze natlenione wody?",
  "Ciekawostka: Czy wiedziałeś, że leszcze chętnie żerują na miękkim dnie?",
  "Ciekawostka: Czy wiedziałeś, że ryby mają bardzo dobrze rozwinięty węch?",
];

const MIN_VISIBLE_MS = 800;
const FADE_OUT_MS = 400;

export default function AppLoader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [factIndex] = useState(() => Math.floor(Math.random() * FACTS.length));
  const settledRef = useRef(false);

  useEffect(() => {
    const startedAt = performance.now();

    const finish = () => {
      if (settledRef.current) return;
      settledRef.current = true;
      setExiting(true);
      setTimeout(() => setVisible(false), FADE_OUT_MS);
    };

    // Wait for fonts + minimum visible time
    const fontReady = "fonts" in document && document.fonts?.ready
      ? document.fonts.ready.catch(() => undefined)
      : Promise.resolve();

    fontReady.then(async () => {
      const elapsed = performance.now() - startedAt;
      if (elapsed < MIN_VISIBLE_MS) {
        await new Promise((r) => setTimeout(r, MIN_VISIBLE_MS - elapsed));
      }
      finish();
    });

    // Fallback timeout
    const timer = setTimeout(finish, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-[400ms] ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Logo / fish animation */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Fish size={36} className="text-primary" />
        </div>
        {/* Ripple rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="absolute inset-[-8px] rounded-full border border-primary/10 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.3s" }} />
      </div>

      {/* Loading text */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-semibold text-foreground tracking-widest uppercase">
          Ładowanie
        </span>
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full bg-border overflow-hidden mb-8">
        <div
          className="h-full bg-primary rounded-full"
          style={{
            animation: `loaderProgress ${MIN_VISIBLE_MS}ms ease-out forwards`,
          }}
        />
      </div>

      {/* Fun fact */}
      <p className="text-xs text-muted-foreground max-w-sm text-center px-4 leading-relaxed">
        {FACTS[factIndex]}
      </p>
    </div>
  );
}
