import { Link } from "react-router-dom";
import { Compass, Images, User, LifeBuoy } from "lucide-react";
import { motion } from "framer-motion";

const quickLinks = [
  {
    title: "Forum",
    description: "Dołącz do dyskusji",
    icon: Compass,
    href: "/forum",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Galeria",
    description: "Zobacz zdjęcia",
    icon: Images,
    href: "/galeria",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    title: "Mój profil",
    description: "Zarządzaj kontem",
    icon: User,
    href: "/profil",
    color: "bg-green-500/10 text-green-500",
  },
  {
    title: "Zgłoś problem",
    description: "Pomoc techniczna",
    icon: LifeBuoy,
    href: "/zglos-problem",
    color: "bg-orange-500/10 text-orange-500",
  },
];

export default function QuickAccess() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">Szybki dostęp</h2>
        </motion.div>

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
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
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
