import { useState, useEffect } from "react";
import {
  Megaphone,
  Newspaper,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { formatTimeAgo } from "@/lib/timeAgo";

type InfoCategory = "ogloszenia" | "aktualnosci" | "konkursy" | "wydarzenia" | "kulisy";

const categories: { key: InfoCategory; title: string; description: string; icon: React.ReactNode }[] = [
  { key: "ogloszenia", title: "Ogłoszenia", description: "Ważne komunikaty", icon: <Megaphone size={18} /> },
  { key: "aktualnosci", title: "Aktualności", description: "Co nowego", icon: <Newspaper size={18} /> },
  { key: "konkursy", title: "Konkursy", description: "Wygraj nagrody", icon: <Sparkles size={18} /> },
  { key: "wydarzenia", title: "Wydarzenia", description: "Spotkania i zloty", icon: <Users size={18} /> },
  { key: "kulisy", title: "Kulisy", description: "Za kulisami projektu", icon: <Wrench size={18} /> },
];

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export default function InformacjePage() {
  const [activeKey, setActiveKey] = useState<InfoCategory>("ogloszenia");
  const [entries, setEntries] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("announcements" as any)
        .select("id, title, content, category, created_at")
        .eq("category", activeKey)
        .eq("published", true)
        .order("created_at", { ascending: false });
      setEntries((data as Announcement[]) || []);
      setLoading(false);
    };
    load();
  }, [activeKey]);

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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-2xl border border-border bg-card p-6 interactive-card"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-muted-foreground">{formatTimeAgo(entry.created_at)}</span>
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
        )}
      </div>
    </div>
  );
}
