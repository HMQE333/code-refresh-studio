import { motion } from "framer-motion";

const sponsors = [
  { name: "Sponsor 1" },
  { name: "Sponsor 2" },
  { name: "Sponsor 3" },
  { name: "Sponsor 4" },
  { name: "Sponsor 5" },
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Nasi partnerzy</h2>
          <p className="text-foreground-2 text-sm mb-10">
            Współpracujemy z najlepszymi markami wędkarskimi w Polsce.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="animate-partner-pop w-28 h-16 rounded-xl border border-border bg-background-3 flex items-center justify-center text-foreground-2 text-xs font-medium interactive-press"
            >
              {sponsor.name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
