import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Clock } from "lucide-react";

const threads = [
  { id: 1, title: "Jak złapać suma na rzece?", author: "Wędkarz123", replies: 24, likes: 18, time: "2h temu" },
  { id: 2, title: "Najlepsze przynęty na szczupaka", author: "ProAngler", replies: 31, likes: 42, time: "5h temu" },
  { id: 3, title: "Porady dla początkujących – od czego zacząć?", author: "StartFishing", replies: 56, likes: 89, time: "1d temu" },
];

export default function Tutorials() {
  return (
    <section className="py-16 px-4 bg-background-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Popularne wątki</h2>
          <p className="text-foreground-2 text-sm">Dołącz do dyskusji na naszym forum.</p>
        </motion.div>

        <div className="grid gap-4">
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              className="interactive-card rounded-2xl border border-border bg-background-3 p-5 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground mb-1 truncate">{thread.title}</h3>
                <p className="text-xs text-foreground-2">przez {thread.author}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-foreground-2">
                <span className="flex items-center gap-1 text-xs">
                  <MessageSquare size={14} /> {thread.replies}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <ThumbsUp size={14} /> {thread.likes}
                </span>
                <span className="flex items-center gap-1 text-xs hidden sm:flex">
                  <Clock size={14} /> {thread.time}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
