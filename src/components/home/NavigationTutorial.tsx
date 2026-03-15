import { motion } from "framer-motion";
import { Play, BookOpen, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

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
          <p className="text-foreground-2 text-sm max-w-xl mx-auto">
            Przygotowujemy wideo onboardingowe. Do czasu publikacji możesz
            skorzystać z krótkiego przewodnika i zgłosić pomysł na materiał, który
            najbardziej Ci pomoże.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="aspect-video max-w-3xl mx-auto rounded-2xl border border-border bg-background-3 flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center mx-auto mb-4 interactive-press">
            <Play size={28} className="text-primary ml-1" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">Wideo w drodze</p>
          <p className="text-xs text-muted-foreground max-w-xs text-center mb-6">
            Pracujemy nad materiałem wideo. Napisz, czego potrzebujesz w
            pierwszej kolejności, a damy znać gdy będzie gotowe.
          </p>
          <div className="flex gap-3">
            <Link
              to="/faq"
              className="flex items-center gap-2 text-xs font-medium text-primary border border-primary/30 rounded-xl px-4 py-2 hover:bg-primary/10 transition-colors"
            >
              <BookOpen size={14} />
              Krótki przewodnik
            </Link>
            <Link
              to="/zglos-problem?type=suggestion"
              className="flex items-center gap-2 text-xs font-medium text-foreground-2 border border-border rounded-xl px-4 py-2 hover:border-primary/30 transition-colors"
            >
              <MessageSquare size={14} />
              Zgłoś temat wideo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
