import { Link } from "react-router-dom";
import { Megaphone, MessageSquare, Images, Search } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  { label: "Dyskusje", href: "/dyskusje", icon: Megaphone, description: "Dołącz do rozmów" },
  { label: "Forum", href: "/forum", icon: MessageSquare, description: "Zadaj pytanie" },
  { label: "Galeria", href: "/galeria", icon: Images, description: "Pokaż swoje okazy" },
  { label: "Szukaj", href: "/szukaj", icon: Search, description: "Znajdź treści" },
];

export default function QuickAccess() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.35 }}
              >
                <Link
                  to={item.href}
                  className="interactive-card interactive-press block rounded-2xl border border-border bg-background-3 p-5 text-center group"
                >
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3 transition-transform group-hover:scale-110" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.label}</h3>
                  <p className="text-xs text-foreground-2">{item.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
