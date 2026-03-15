import { useState } from "react";
import {
  Megaphone,
  Newspaper,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type InfoCategory = "ogloszenia" | "aktualnosci" | "konkursy" | "wydarzenia" | "kulisy";

const categories: { key: InfoCategory; title: string; description: string; icon: React.ReactNode }[] = [
  { key: "ogloszenia", title: "Ogłoszenia", description: "Ważne komunikaty", icon: <Megaphone size={18} /> },
  { key: "aktualnosci", title: "Aktualności", description: "Co nowego", icon: <Newspaper size={18} /> },
  { key: "konkursy", title: "Konkursy", description: "Wygraj nagrody", icon: <Sparkles size={18} /> },
  { key: "wydarzenia", title: "Wydarzenia", description: "Spotkania i zloty", icon: <Users size={18} /> },
  { key: "kulisy", title: "Kulisy", description: "Za kulisami projektu", icon: <Wrench size={18} /> },
];

const mockEntries: Record<InfoCategory, { title: string; date: string; content: string }[]> = {
  ogloszenia: [
    { title: "Witamy na nowej stronie!", date: "2026-01-15", content: "RybiaPaka.pl przeszła gruntowny remont. Zapraszamy do eksploracji nowych funkcji." },
    { title: "Przerwa techniczna", date: "2026-01-10", content: "W sobotę 12.01 w godzinach 2:00-4:00 planowana jest przerwa techniczna." },
  ],
  aktualnosci: [
    { title: "Nowy system galerii", date: "2026-01-14", content: "Galeria zdjęć została całkowicie przebudowana. Teraz możesz dodawać opisy i tagi." },
  ],
  konkursy: [
    { title: "Konkurs na najlepsze zdjęcie", date: "2026-01-12", content: "Do wygrania zestaw wędkarski! Wyślij swoje najlepsze zdjęcie z łowiska." },
  ],
  wydarzenia: [
    { title: "Zlot wędkarski – Mazury", date: "2026-02-01", content: "Zapraszamy na pierwszy zlot społeczności RybiaPaka nad jeziorem Śniardwy." },
  ],
  kulisy: [
    { title: "Jak powstała RybiaPaka?", date: "2026-01-08", content: "Historia projektu od pierwszego pomysłu do pełnoprawnej platformy społecznościowej." },
  ],
};

export default function InformacjePage() {
  const [activeKey, setActiveKey] = useState<InfoCategory>("ogloszenia");

  const entries = mockEntries[activeKey];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 page-transition">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Informacje</h1>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveKey(cat.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all interactive-press",
                activeKey === cat.key
                  ? "bg-primary text-primary-foreground filter-pill"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              )}
            >
              {cat.icon}
              {cat.title}
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.title}
              className="rounded-2xl border border-border bg-card p-6 interactive-card"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-muted-foreground">{entry.date}</span>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {categories.find((c) => c.key === activeKey)?.title}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">{entry.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{entry.content}</p>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Brak wpisów w tej kategorii.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
