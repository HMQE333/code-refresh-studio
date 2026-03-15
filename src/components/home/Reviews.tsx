import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  { id: 1, name: "Marek W.", text: "Najlepsza społeczność wędkarska w sieci! Tutaj zawsze znajdę odpowiedź na każde pytanie.", rating: 5 },
  { id: 2, name: "Anna K.", text: "Dzięki RybiaPaka poznałam świetnych ludzi i odkryłam nowe łowiska w mojej okolicy.", rating: 5 },
  { id: 3, name: "Piotr S.", text: "Forum pełne wiedzy, a galeria inspiruje do kolejnych wypraw. Polecam każdemu wędkarzowi!", rating: 5 },
  { id: 4, name: "Tomek M.", text: "Konkursy są super motywacją. Wygrałem już dwa razy sprzęt od sponsorów!", rating: 5 },
  { id: 5, name: "Kasia L.", text: "Świetna atmosfera i pomocni ludzie. Najlepsza strona wędkarska w PL!", rating: 5 },
  { id: 6, name: "Janek R.", text: "Mapa łowisk to rewelacja – odkryłem miejsca, o których nie miałem pojęcia.", rating: 5 },
];

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="shrink-0 w-72 rounded-2xl border border-border bg-background-3 p-6">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm text-foreground-2 leading-relaxed mb-4">"{review.text}"</p>
      <p className="text-sm font-medium text-foreground">{review.name}</p>
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-20 px-4 bg-background-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Co mówią nasi użytkownicy?</h2>
          <p className="text-foreground-2">Prawdziwe opinie z naszej społeczności.</p>
        </motion.div>

        <div className="relative overflow-hidden" style={{ "--duration": "30s", "--gap": "1.25rem" } as React.CSSProperties}>
          <div className="flex gap-[var(--gap)] animate-marquee w-max">
            {[...reviews, ...reviews].map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
