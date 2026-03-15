import { Users, Award, MessageSquare, Map } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Aktywna społeczność",
    description: "Tysiące wędkarzy gotowych do pomocy i wymiany doświadczeń.",
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: "Konkursy i nagrody",
    description: "Regularne zawody z cennymi nagrodami od naszych partnerów.",
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: "Eksperckie forum",
    description: "Baza wiedzy tworzona latami. Znajdź odpowiedź na każde pytanie.",
  },
  {
    icon: <Map className="h-8 w-8" />,
    title: "Mapa łowisk",
    description: "Odkrywaj nowe miejscówki i sprawdzaj opinie o łowiskach w Twojej okolicy.",
  },
];

export default function WhyUs() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Dlaczego warto do nas dołączyć?
          </h2>
          <p className="text-foreground-2 max-w-2xl mx-auto leading-relaxed">
            RybiaPaka.pl to więcej niż forum. To miejsce, gdzie pasja spotyka się
            z profesjonalizmem: uczysz się od mistrzów, bierzesz udział w zawodach,
            wymieniasz sprawdzone zestawy i planujesz kolejne wyprawy.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="interactive-card rounded-2xl border border-border bg-background-3 p-6 sm:p-8"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-foreground-2 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
