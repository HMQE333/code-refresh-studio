import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export interface StatItem {
  label: string;
  value: string;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k+`;
  return `${n}+`;
}

export default function Statistics() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Użytkownicy", value: "..." },
    { label: "Posty", value: "..." },
    { label: "Zdjęcia", value: "..." },
    { label: "Komentarze", value: "..." },
  ]);

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("threads").select("id", { count: "exact", head: true }),
      supabase.from("gallery_items").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
    ]).then(([users, threads, gallery, posts]) => {
      setStats([
        { label: "Użytkownicy", value: formatCount(users.count ?? 0) },
        { label: "Posty", value: formatCount(threads.count ?? 0) },
        { label: "Zdjęcia", value: formatCount(gallery.count ?? 0) },
        { label: "Komentarze", value: formatCount(posts.count ?? 0) },
      ]);
    });
  }, []);

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="stat-card interactive-press rounded-2xl border border-border bg-background-3 p-6 text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-foreground-2">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
