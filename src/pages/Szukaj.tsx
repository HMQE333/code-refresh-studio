import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Users, MessageSquare, Images, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/timeAgo";

const MIN_QUERY = 2;
const DEBOUNCE_MS = 350;

type UserResult = { user_id: string; username: string | null; display_name: string | null; avatar_url: string | null; region_name: string | null; method_name: string | null };
type ThreadResult = { id: string; title: string; content: string; created_at: string; board_name: string | null; author_name: string | null };
type GalleryResult = { id: string; title: string; image_url: string; category: string; author_name: string | null; created_at: string };

export default function SzukajPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [users, setUsers] = useState<UserResult[]>([]);
  const [threads, setThreads] = useState<ThreadResult[]>([]);
  const [gallery, setGallery] = useState<GalleryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<{ id: string; name: string }[]>([]);
  const [methods, setMethods] = useState<{ id: string; name: string }[]>([]);
  const [regionId, setRegionId] = useState(searchParams.get("region") || "");
  const [methodId, setMethodId] = useState(searchParams.get("method") || "");

  useEffect(() => {
    Promise.all([
      supabase.from("regions").select("*").order("name"),
      supabase.from("fishing_methods").select("*").order("name"),
    ]).then(([r, m]) => {
      setRegions(r.data || []);
      setMethods(m.data || []);
    });
  }, []);

  const trimmed = useMemo(() => query.trim(), [query]);

  const doSearch = useCallback(async () => {
    if (trimmed.length < MIN_QUERY) {
      setUsers([]); setThreads([]); setGallery([]);
      return;
    }
    setLoading(true);
    const pattern = `%${trimmed}%`;

    // Search profiles
    let profileQ = supabase.from("profiles").select("user_id, username, display_name, avatar_url, region_id, fishing_method_id").or(`username.ilike.${pattern},display_name.ilike.${pattern}`).limit(20);
    if (regionId) profileQ = profileQ.eq("region_id", regionId);
    if (methodId) profileQ = profileQ.eq("fishing_method_id", methodId);

    // Search threads
    const threadQ = supabase.from("threads").select("id, title, content, created_at, board_id, author_id").or(`title.ilike.${pattern},content.ilike.${pattern}`).is("deleted_at", null).order("created_at", { ascending: false }).limit(20);

    // Search gallery
    const galleryQ = supabase.from("gallery_items").select("id, title, image_url, category, author_name, created_at").ilike("title", pattern).order("created_at", { ascending: false }).limit(20);

    const [profileRes, threadRes, galleryRes] = await Promise.all([profileQ, threadQ, galleryQ]);

    // Enrich profiles with region/method names
    const enrichedUsers: UserResult[] = (profileRes.data || []).map((p) => ({
      user_id: p.user_id,
      username: p.username,
      display_name: p.display_name,
      avatar_url: p.avatar_url,
      region_name: regions.find((r) => r.id === p.region_id)?.name || null,
      method_name: methods.find((m) => m.id === p.fishing_method_id)?.name || null,
    }));

    // Enrich threads with board and author names
    const boardIds = [...new Set((threadRes.data || []).map((t) => t.board_id))];
    const authorIds = [...new Set((threadRes.data || []).map((t) => t.author_id))];
    const [boardsRes, authorsRes] = await Promise.all([
      boardIds.length ? supabase.from("boards").select("id, name").in("id", boardIds) : Promise.resolve({ data: [] }),
      authorIds.length ? supabase.from("profiles").select("user_id, username").in("user_id", authorIds) : Promise.resolve({ data: [] }),
    ]);
    const boardMap = new Map((boardsRes.data || []).map((b) => [b.id, b.name]));
    const authorMap = new Map((authorsRes.data || []).map((a) => [a.user_id, a.username]));

    const enrichedThreads: ThreadResult[] = (threadRes.data || []).map((t) => ({
      id: t.id,
      title: t.title,
      content: t.content.slice(0, 160),
      created_at: t.created_at,
      board_name: boardMap.get(t.board_id) || null,
      author_name: authorMap.get(t.author_id) || null,
    }));

    setUsers(enrichedUsers);
    setThreads(enrichedThreads);
    setGallery(galleryRes.data || []);
    setLoading(false);
  }, [trimmed, regionId, methodId, regions, methods]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(doSearch, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [doSearch]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    if (regionId) params.set("region", regionId);
    if (methodId) params.set("method", methodId);
    setSearchParams(params, { replace: true });
  }, [trimmed, regionId, methodId, setSearchParams]);

  const totalResults = users.length + threads.length + gallery.length;
  const canSearch = trimmed.length >= MIN_QUERY;
  const clearAll = () => { setQuery(""); setRegionId(""); setMethodId(""); };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Wyszukiwarka</h1>
          <p className="text-muted-foreground">Szukaj tematów, zdjęć i profili w jednym miejscu</p>
        </div>

        {/* Search bar */}
        <div className="space-y-3 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj w forum, galerii i profilach..." className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={regionId} onChange={(e) => setRegionId(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Wszystkie regiony</option>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select value={methodId} onChange={(e) => setMethodId(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Wszystkie metody</option>
              {methods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            {(query || regionId || methodId) && (
              <button onClick={clearAll} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" /> Wyczyść
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {!canSearch && (
          <p className="text-center text-sm text-muted-foreground py-12">Wpisz minimum {MIN_QUERY} znaki, aby wyszukać.</p>
        )}

        {canSearch && loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {canSearch && !loading && totalResults === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">Brak wyników. Spróbuj innej frazy.</p>
        )}

        {canSearch && !loading && totalResults > 0 && (
          <div className="space-y-8">
            {/* Threads */}
            {threads.length > 0 && (
              <Section title="Wątki" icon={<MessageSquare className="w-4 h-4" />} count={threads.length}>
                <div className="space-y-2">
                  {threads.map((t) => (
                    <Link key={t.id} to={`/forum/${t.id}`} className="block rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        {t.board_name && <Badge variant="secondary" className="text-[10px]">{t.board_name}</Badge>}
                        <span className="text-[10px] text-muted-foreground">{formatTimeAgo(t.created_at)}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.content}</p>
                      {t.author_name && <p className="text-[10px] text-muted-foreground mt-1">Autor: {t.author_name}</p>}
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <Section title="Galeria" icon={<Images className="w-4 h-4" />} count={gallery.length}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((g) => (
                    <Link key={g.id} to="/galeria" className="group rounded-xl border border-border overflow-hidden">
                      <div className="aspect-square relative">
                        <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-foreground truncate">{g.title}</p>
                        <p className="text-[10px] text-muted-foreground">{g.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* Users */}
            {users.length > 0 && (
              <Section title="Użytkownicy" icon={<Users className="w-4 h-4" />} count={users.length}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {users.map((u) => (
                    <Link key={u.user_id} to={`/profil/${u.username}`} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-primary/30 transition-colors">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-secondary text-foreground text-sm">
                          {(u.username ?? "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">@{u.username}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          {u.region_name && <span>{u.region_name}</span>}
                          {u.method_name && <span>{u.method_name}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, count, children }: { title: string; icon: React.ReactNode; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary">{icon}</span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Badge variant="outline" className="text-[10px]">{count}</Badge>
      </div>
      {children}
    </div>
  );
}
