import { motion } from "framer-motion";

export interface StatItem {
  label: string;
  value: string;
}

const mockStats: StatItem[] = [
  { label: "Użytkownicy", value: "2.4k+" },
  { label: "Posty", value: "8.1k+" },
  { label: "Zdjęcia", value: "3.2k+" },
  { label: "Komentarze", value: "15.6k+" },
];

export default function Statistics() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="stat-card rounded-2xl border border-border bg-background-3 p-6 text-center"
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
