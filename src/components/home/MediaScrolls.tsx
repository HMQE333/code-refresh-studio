import { motion } from "framer-motion";
import { Images } from "lucide-react";

const placeholderImages = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  label: `Zdjęcie ${i + 1}`,
}));

export default function MediaScrolls() {
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

        <div className="relative overflow-hidden" style={{ "--duration": "25s", "--gap": "1rem" } as React.CSSProperties}>
          <div className="flex gap-[var(--gap)] animate-marquee w-max">
            {[...placeholderImages, ...placeholderImages].map((img, i) => (
              <div
                key={`${img.id}-${i}`}
                className="shrink-0 w-48 h-32 rounded-xl border border-border bg-background-3 flex flex-col items-center justify-center text-foreground-2 gap-2"
              >
                <Images size={24} className="text-primary/40" />
                <span className="text-xs">{img.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
