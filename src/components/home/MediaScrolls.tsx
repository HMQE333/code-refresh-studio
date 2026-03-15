import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Images } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type GalleryPreview = {
  id: string;
  title: string;
  image_url: string;
  author_name: string | null;
};

export default function MediaScrolls() {
  const [items, setItems] = useState<GalleryPreview[]>([]);

  useEffect(() => {
    supabase
      .from("gallery_items")
      .select("id, title, image_url, author_name")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => setItems(data || []));
  }, []);

  const displayItems = items.length > 0 ? [...items, ...items] : [];

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Galeria połowów</h2>
          <p className="text-foreground-2 text-sm">Najnowsze zdjęcia od naszej społeczności.</p>
        </motion.div>

        {items.length > 0 ? (
          <div
            className="relative overflow-hidden"
            style={{ "--duration": "30s", "--gap": "1rem" } as React.CSSProperties}
          >
            <div className="flex gap-[var(--gap)] animate-marquee w-max">
              {displayItems.map((item, i) => (
                <Link
                  key={`${item.id}-${i}`}
                  to="/galeria"
                  className="shrink-0 w-52 h-36 rounded-xl border border-border overflow-hidden group relative"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-xs font-medium truncate">{item.title}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="relative overflow-hidden"
            style={{ "--duration": "25s", "--gap": "1rem" } as React.CSSProperties}
          >
            <div className="flex gap-[var(--gap)] animate-marquee w-max">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-48 h-32 rounded-xl border border-border bg-background-3 flex flex-col items-center justify-center text-foreground-2 gap-2"
                >
                  <Images size={24} className="text-primary/40" />
                  <span className="text-xs">Zdjęcie {(i % 8) + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/galeria"
            className="text-sm text-primary hover:underline font-medium"
          >
            Zobacz całą galerię →
          </Link>
        </div>
      </div>
    </section>
  );
}
