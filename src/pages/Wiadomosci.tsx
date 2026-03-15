import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Send, ArrowLeft, Search, Mail, MailOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/timeAgo";

type Conversation = {
  user_id: string;
  username: string | null;
  avatar_url: string | null;
  last_message: string;
  last_at: string;
  unread: number;
};

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  read_at: string | null;
};

export default function WiadomosciPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatWith = searchParams.get("with");

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(chatWith);
  const [activeChatProfile, setActiveChatProfile] = useState<{ username: string | null; avatar_url: string | null } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/logowanie", { replace: true });
  }, [user, authLoading, navigate]);

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!data) { setLoading(false); return; }

    const convMap = new Map<string, Conversation>();
    for (const msg of data) {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          user_id: otherId,
          username: null,
          avatar_url: null,
          last_message: msg.text,
          last_at: msg.created_at,
          unread: 0,
        });
      }
      if (msg.receiver_id === user.id && !msg.read_at) {
        const c = convMap.get(otherId)!;
        c.unread++;
      }
    }

    // Get profiles for all conversation partners
    const userIds = Array.from(convMap.keys());
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);
      profiles?.forEach((p) => {
        const c = convMap.get(p.user_id);
        if (c) {
          c.username = p.username;
          c.avatar_url = p.avatar_url;
        }
      });
    }

    setConversations(Array.from(convMap.values()));
    setLoading(false);
  }, [user]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Load chat messages
  useEffect(() => {
    if (!activeChat || !user) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${activeChat}),and(sender_id.eq.${activeChat},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      setMessages(data || []);

      // Mark as read
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", activeChat)
        .eq("receiver_id", user.id)
        .is("read_at", null);

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("user_id", activeChat)
        .maybeSingle();
      setActiveChatProfile(profile);
    };
    loadMessages();

    // Realtime
    const channel = supabase
      .channel(`dm-${activeChat}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === user.id && msg.receiver_id === activeChat) ||
          (msg.sender_id === activeChat && msg.receiver_id === user.id)
        ) {
          setMessages((prev) => [...prev, msg]);
          if (msg.sender_id === activeChat) {
            supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("id", msg.id);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat || !user || sending) return;
    setSending(true);
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: activeChat,
      text: newMessage.trim(),
    });
    setNewMessage("");
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const filtered = conversations.filter((c) =>
    !searchQuery || c.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Wiadomości</h1>

        <div className="rounded-2xl border border-border bg-card overflow-hidden flex" style={{ height: "70vh" }}>
          {/* Sidebar */}
          <div className={`w-full sm:w-80 border-r border-border flex flex-col ${activeChat ? "hidden sm:flex" : "flex"}`}>
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj rozmów..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  Brak wiadomości
                </div>
              ) : (
                filtered.map((conv) => (
                  <button
                    key={conv.user_id}
                    onClick={() => setActiveChat(conv.user_id)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors text-left ${
                      activeChat === conv.user_id ? "bg-accent/30" : ""
                    }`}
                  >
                    <Avatar className="w-10 h-10 shrink-0">
                      <AvatarImage src={conv.avatar_url || undefined} />
                      <AvatarFallback className="bg-secondary text-foreground text-xs">
                        {(conv.username || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">
                          {conv.username || "Użytkownik"}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTimeAgo(conv.last_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.last_message}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${!activeChat ? "hidden sm:flex" : "flex"}`}>
            {activeChat ? (
              <>
                {/* Chat header */}
                <div className="p-3 border-b border-border flex items-center gap-3">
                  <button onClick={() => setActiveChat(null)} className="sm:hidden text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={activeChatProfile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-secondary text-foreground text-xs">
                      {(activeChatProfile?.username || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className="text-sm font-medium text-foreground cursor-pointer hover:underline"
                    onClick={() => activeChatProfile?.username && navigate(`/profil/${activeChatProfile.username}`)}
                  >
                    {activeChatProfile?.username || "Użytkownik"}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : ""}`}>
                            <span className="text-[10px] opacity-60">
                              {new Date(msg.created_at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isMine && (
                              msg.read_at
                                ? <MailOpen className="w-3 h-3 opacity-60" />
                                : <Mail className="w-3 h-3 opacity-40" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border flex gap-2">
                  <Input
                    placeholder="Napisz wiadomość..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} disabled={!newMessage.trim() || sending} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Wybierz rozmowę lub napisz do kogoś z profilu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
