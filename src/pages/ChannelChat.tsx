import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/timeAgo";

// Channel metadata (same as Dyskusje page)
const CHANNEL_META: Record<string, { name: string; summary: string }> = {
  spinning: { name: "Spinning", summary: "Agresywne brania, szybkie zwijanie i testy przynęt drapieżnych." },
  karpiowanie: { name: "Karpiowanie", summary: "Długie zasiadki, taktyka nęcenia i patenty na wielkie karpie." },
  feeder: { name: "Feeder", summary: "Mieszanki zanęt, delikatne sygnały i skuteczne zestawy feederowe." },
  metoda: { name: "Method feeder", summary: "Method feeder od A do Z: koszyki, pelety i precyzyjne podania." },
  splawik: { name: "Spławik", summary: "Klasyka spławika: ustawienie gruntu, przynęty i prowadzenie." },
  muchowe: { name: "Muchowe", summary: "Muchy, przypony i polowania na ostrożne ryby w klarownej wodzie." },
  podlodowe: { name: "Podlodowe", summary: "Bezpieczny lód, wędki podlodowe i zimowe miejscówki." },
  morskie: { name: "Morskie", summary: "Słona woda, pilkery, dorsze i wyprawy na pełne morze." },
  memy: { name: "Memy", summary: "Rybackie żarty, memy i luźne rozmowy o wodzie." },
  gry: { name: "Gry", summary: "Gry wędkarskie, nowości, patche i wspólne wypady online." },
};

type Message = {
  id: string;
  author_name: string | null;
  author_id: string | null;
  text: string;
  created_at: string;
};

type ProfileInfo = { username: string | null; avatar_url: string | null };

export default function ChannelChatPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const { user } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [profilesMap, setProfilesMap] = useState<Record<string, ProfileInfo>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const channel = channelId ? CHANNEL_META[channelId] : null;

  // Load profile
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("username, avatar_url").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      setProfile(data);
    });
  }, [user]);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!channelId) return;
    const { data } = await supabase
      .from("channel_messages")
      .select("id, author_name, author_id, text, created_at")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) {
      setMessages(data.reverse());
      // Load avatars for unique author_ids
      const authorIds = [...new Set(data.map(m => m.author_id).filter(Boolean))] as string[];
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, username, avatar_url").in("user_id", authorIds);
        if (profiles) {
          const map: Record<string, ProfileInfo> = {};
          profiles.forEach(p => { map[p.user_id] = { username: p.username, avatar_url: p.avatar_url }; });
          setProfilesMap(map);
        }
      }
    }
  }, [channelId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!channelId) return;
    const sub = supabase
      .channel(`chat-${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channel_messages", filter: `channel_id=eq.${channelId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "channel_messages", filter: `channel_id=eq.${channelId}` },
        (payload) => {
          const deletedId = (payload.old as any).id;
          setMessages((prev) => prev.filter(m => m.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [channelId]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!user || !channelId || !newMessage.trim()) return;
    setSending(true);
    const authorName = profile?.username ?? user.email?.split("@")[0] ?? "Anonim";
    await supabase.from("channel_messages").insert({
      channel_id: channelId,
      author_id: user.id,
      author_name: authorName,
      text: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  const handleDelete = async (msgId: string) => {
    await supabase.from("channel_messages").delete().eq("id", msgId);
    setMessages((prev) => prev.filter(m => m.id !== msgId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Kanał nie istnieje.</p>
          <Link to="/dyskusje" className="text-primary hover:underline">Wróć do kanałów</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/90 backdrop-blur-lg px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dyskusje")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-semibold text-foreground">#{channelId} — {channel.name}</h1>
            <p className="text-xs text-muted-foreground">{channel.summary}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">
              Brak wiadomości. Napisz coś pierwszemu! 🎣
            </p>
          )}
          {messages.map((msg) => {
            const isOwn = user && msg.author_id === user.id;
            const canDelete = isOwn || isAdmin || isModerator;
            const authorProfile = msg.author_id ? profilesMap[msg.author_id] : null;
            return (
              <div key={msg.id} className={`flex gap-3 group ${isOwn ? "flex-row-reverse" : ""}`}>
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={authorProfile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-secondary text-foreground text-xs">
                    {(msg.author_name ?? "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${isOwn ? "items-end" : ""}`}>
                  <div className={`flex items-center gap-2 mb-0.5 ${isOwn ? "flex-row-reverse" : ""}`}>
                    {!isOwn && (
                      <Link to={`/profil/${msg.author_name}`} className="text-xs font-medium text-primary hover:underline">
                        {msg.author_name ?? "Anonim"}
                      </Link>
                    )}
                    <span className="text-[10px] text-muted-foreground">{formatTimeAgo(msg.created_at)}</span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                        title="Usuń wiadomość"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-card border border-border text-foreground rounded-tl-md"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Composer */}
      <div className="sticky bottom-0 border-t border-border bg-card/90 backdrop-blur-lg px-4 py-3">
        <div className="max-w-3xl mx-auto">
          {user ? (
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Napisz w #${channelId}...`}
                maxLength={2000}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 hover:brightness-110 disabled:opacity-50 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/logowanie" className="text-primary hover:underline">Zaloguj się</Link> aby dołączyć do rozmowy.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
