import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function NavigationTutorial() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Jak poruszać się po stronie?</h2>
          <p className="text-foreground-2 text-sm">Krótki przewodnik po najważniejszych funkcjach.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="aspect-video max-w-3xl mx-auto rounded-2xl border border-border bg-background-3 flex items-center justify-center"
        >
          <div className="text-center text-foreground-2">
            <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center mx-auto mb-4 interactive-press">
              <Play size={28} className="text-primary ml-1" />
            </div>
            <p className="text-sm">Film instruktażowy — wkrótce</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
