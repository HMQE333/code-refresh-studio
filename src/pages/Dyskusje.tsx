import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Channel = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  accent: string;
};

const CHANNELS: Channel[] = [
  { id: "spinning", name: "Spinning", description: "Dla łowców drapieżników na spinning.", icon: FishSymbol, gradient: "from-emerald-500/25 via-emerald-500/10 to-transparent", accent: "text-emerald-300" },
  { id: "karpiowanie", name: "Karpiowanie", description: "Dla karpiarzy lubiących długie zasiadki.", icon: Tent, gradient: "from-amber-500/20 via-amber-500/10 to-transparent", accent: "text-amber-200" },
  { id: "feeder", name: "Feeder", description: "Dla wędkarzy łowiących na feeder.", icon: Anchor, gradient: "from-blue-500/20 via-blue-500/10 to-transparent", accent: "text-blue-200" },
  { id: "metoda", name: "Method feeder", description: "Dla fanów method feeder zestawów.", icon: Target, gradient: "from-amber-400/25 via-amber-400/10 to-transparent", accent: "text-amber-100" },
  { id: "splawik", name: "Spławik", description: "Dla zwolenników klasycznego spławika.", icon: Fish, gradient: "from-teal-400/20 via-teal-400/10 to-transparent", accent: "text-teal-200" },
  { id: "muchowe", name: "Muchowe", description: "Dla miłośników łowienia na muchę.", icon: Feather, gradient: "from-purple-500/20 via-purple-500/10 to-transparent", accent: "text-purple-200" },
  { id: "podlodowe", name: "Podlodowe", description: "Dla wędkarzy łowiących spod lodu.", icon: Snowflake, gradient: "from-blue-300/25 via-blue-300/10 to-transparent", accent: "text-blue-100" },
  { id: "morskie", name: "Morskie", description: "Dla tych, co kochają morze.", icon: Sailboat, gradient: "from-cyan-400/20 via-cyan-400/10 to-transparent", accent: "text-cyan-200" },
  { id: "memy", name: "Memy", description: "Dla osób szukających wędkarskich memów.", icon: Laugh, gradient: "from-green-400/20 via-green-400/10 to-transparent", accent: "text-green-200" },
  { id: "gry", name: "Gry", description: "Dla graczy lubiących wędkarskie gry.", icon: Gamepad2, gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent", accent: "text-indigo-200" },
];

function ChatButton({ channel, messageCount, lastMessage }: { channel: Channel; messageCount: number; lastMessage?: { text: string; author_name: string | null; created_at: string } }) {
  const Icon = channel.icon;
  return (
    <Link
      to={`/dyskusje/${channel.id}`}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 interactive-press"
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", channel.gradient)} />
      <div className="relative flex items-start gap-4">
        <div className="shrink-0 mt-0.5">
          <Icon className={cn("w-6 h-6", channel.accent)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold text-foreground">{channel.name}</h3>
            <span className="text-xs text-muted-foreground">#{channel.id}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{channel.description}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{messageCount} {messageCount === 1 ? 'wiadomość' : 'wiadomości'}</span>
          </div>
          {lastMessage && (
            <p className="mt-1.5 text-xs text-muted-foreground truncate">
              <span className="font-medium text-foreground/70">{lastMessage.author_name ?? "Anonim"}:</span>{" "}
              {lastMessage.text.length > 60 ? lastMessage.text.slice(0, 57) + "..." : lastMessage.text}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DyskusjePage() {
  const { user } = useAuth();
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>({});
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const loadCounts = async () => {
      const { data } = await supabase
        .from("channel_messages")
        .select("channel_id");
      
      const counts: Record<string, number> = {};
      (data || []).forEach((msg: any) => {
        counts[msg.channel_id] = (counts[msg.channel_id] || 0) + 1;
      });
      setMessageCounts(counts);
    };
    loadCounts();

    // Track presence
    const room = supabase.channel("online-users", {
      config: { presence: { key: user?.id || "anon-" + Math.random().toString(36).slice(2) } },
    });
    room
      .on("presence", { event: "sync" }, () => {
        setOnlineCount(Object.keys(room.presenceState()).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await room.track({ online_at: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(room); };
  }, [user]);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Kanały dyskusji
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wybierz kanał tematyczny i dołącz do rozmowy z innymi wędkarzami.
          </p>
          {onlineCount > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {onlineCount} {onlineCount === 1 ? "osoba online" : "osób online"}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHANNELS.map((ch) => (
            <ChatButton key={ch.id} channel={ch} messageCount={messageCounts[ch.id] || 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
