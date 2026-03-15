import { Link } from "react-router-dom";
import {
  Anchor,
  Feather,
  Fish,
  FishSymbol,
  Gamepad2,
  Laugh,
  Sailboat,
  Snowflake,
  Target,
  Tent,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Channel = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  accent: string;
};

const CHANNELS: Channel[] = [
  {
    id: "spinning",
    name: "Spinning",
    description: "Dla łowców drapieżników na spinning.",
    icon: FishSymbol,
    gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent",
    accent: "text-emerald-300",
  },
  {
    id: "karpiowanie",
    name: "Karpiowanie",
    description: "Dla karpiarzy lubiących długie zasiadki.",
    icon: Tent,
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent",
    accent: "text-amber-200",
  },
  {
    id: "feeder",
    name: "Feeder",
    description: "Dla wędkarzy łowiących na feeder.",
    icon: Anchor,
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent",
    accent: "text-blue-200",
  },
  {
    id: "metoda",
    name: "Method feeder",
    description: "Dla fanów method feeder zestawów.",
    icon: Target,
    gradient: "from-amber-400/25 via-amber-400/10 to-transparent",
    accent: "text-amber-100",
  },
  {
    id: "splawik",
    name: "Spławik",
    description: "Dla zwolenników klasycznego spławika.",
    icon: Fish,
    gradient: "from-teal-400/20 via-teal-400/10 to-transparent",
    accent: "text-teal-200",
  },
  {
    id: "muchowe",
    name: "Muchowe",
    description: "Dla miłośników łowienia na muchę.",
    icon: Feather,
    gradient: "from-purple-500/20 via-purple-500/10 to-transparent",
    accent: "text-purple-200",
  },
  {
    id: "podlodowe",
    name: "Podlodowe",
    description: "Dla wędkarzy łowiących spod lodu.",
    icon: Snowflake,
    gradient: "from-blue-300/25 via-blue-300/10 to-transparent",
    accent: "text-blue-100",
  },
  {
    id: "morskie",
    name: "Morskie",
    description: "Dla tych, co kochają morze.",
    icon: Sailboat,
    gradient: "from-cyan-400/20 via-cyan-400/10 to-transparent",
    accent: "text-cyan-200",
  },
  {
    id: "memy",
    name: "Memy",
    description: "Dla osób szukających wędkarskich memów.",
    icon: Laugh,
    gradient: "from-green-400/20 via-green-400/10 to-transparent",
    accent: "text-green-200",
  },
  {
    id: "gry",
    name: "Gry",
    description: "Dla graczy lubiących wędkarskie gry.",
    icon: Gamepad2,
    gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent",
    accent: "text-indigo-200",
  },
];

function ChatButton({ id, name, description, icon, gradient, accent }: Channel) {
  const Icon = icon;
  return (
    <Link
      to={`/dyskusje/${id}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 interactive-press"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", gradient)} />
      <div className="relative flex items-start gap-4">
        <div className="shrink-0 mt-0.5">
          <Icon className={cn("w-6 h-6", accent)} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">{name}</h3>
            <span className="text-xs text-muted-foreground">#{id}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Link>
  );
}

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
            Wybierz kanał tematyczny i dołącz do rozmowy z innymi wędkarzami.
          </p>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((ch) => (
            <ChatButton key={ch.id} {...ch} />
          ))}
        </div>
      </div>
    </div>
  );
}
