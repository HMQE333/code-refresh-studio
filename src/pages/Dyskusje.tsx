import { Link } from "react-router-dom";
import { Fish, Target, Waves, CircleDot, Anchor, Bug, Snowflake, Ship, Laugh, Gamepad2 } from "lucide-react";

const channels = [
  { id: "spinning", name: "Spinning", icon: Target, gradient: "from-blue-500 to-cyan-500", desc: "Dyskusje o technikach spinningowych, przynętach i sprzęcie." },
  { id: "karpiowanie", name: "Karpiowanie", icon: Fish, gradient: "from-amber-600 to-yellow-500", desc: "Wszystko o łowieniu karpi — taktyki, zanęty, zestawy." },
  { id: "feeder", name: "Feeder", icon: Anchor, gradient: "from-emerald-600 to-green-400", desc: "Metoda feederowa od podstaw do zaawansowanych technik." },
  { id: "method-feeder", name: "Method Feeder", icon: CircleDot, gradient: "from-lime-600 to-emerald-400", desc: "Koszykówka methodowa — mieszanki, haczyki, montaże." },
  { id: "splawik", name: "Spławik", icon: Waves, gradient: "from-sky-500 to-blue-400", desc: "Klasyczne łowienie na spławik — techniki i sprzęt." },
  { id: "muchowe", name: "Muchowe", icon: Bug, gradient: "from-violet-500 to-purple-400", desc: "Wędkarstwo muchowe — wiązanie much, rzuty, taktyka." },
  { id: "podlodowe", name: "Podlodowe", icon: Snowflake, gradient: "from-cyan-400 to-blue-300", desc: "Łowienie spod lodu — bezpieczeństwo, sprzęt, techniki." },
  { id: "morskie", name: "Morskie", icon: Ship, gradient: "from-indigo-500 to-blue-600", desc: "Wędkarstwo morskie — kutry, spinning morski, dorsze." },
  { id: "memy", name: "Memy", icon: Laugh, gradient: "from-pink-500 to-rose-400", desc: "Wędkarskie memy i humor — podziel się śmiechem!" },
  { id: "gry", name: "Gry", icon: Gamepad2, gradient: "from-orange-500 to-red-400", desc: "Gry wędkarskie i symulatory — recenzje i rozmowy." },
];

export default function DyskusjePage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Kanały dyskusji
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wybierz kanał tematyczny i dołącz do rozmowy z innymi wędkarzami. Każdy kanał to osobna przestrzeń poświęcona konkretnej metodzie lub tematowi.
          </p>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <Link
                key={ch.id}
                to={`/dyskusje/${ch.id}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 interactive-press"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${ch.gradient} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{ch.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{ch.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
