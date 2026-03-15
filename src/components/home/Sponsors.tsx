import { motion } from "framer-motion";

const sponsors = [
  { name: "FishMaster", logo: "🎣" },
  { name: "ProAngler", logo: "🏆" },
  { name: "Wędkarz Polski", logo: "🌊" },
  { name: "AquaGear", logo: "🧰" },
  { name: "NatureLure", logo: "🐟" },
];

export default function Sponsors() {
  return (
    <section className="py-16 px-4 bg-background-2">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-10">Nasi partnerzy</h2>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="animate-partner-pop w-32 h-20 rounded-xl border border-border bg-background-3 flex flex-col items-center justify-center gap-1.5 text-foreground-2 interactive-press"
            >
              <span className="text-2xl">{sponsor.logo}</span>
              <span className="text-xs font-medium">{sponsor.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
