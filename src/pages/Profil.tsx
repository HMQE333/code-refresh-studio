import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { User, MapPin, Fish, Calendar, Pencil, Save, X, MessageSquare, FileText, MessageCircle, Camera, Heart, Images, Flag, LogOut, Trash2, Mail, UserPlus, UserCheck, Clock, Share2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/timeAgo";

type Profile = {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  age: number | null;
  region_id: string | null;
  fishing_method_id: string | null;
  rank_id: string | null;
  joined_at: string;
  last_seen_at: string | null;
};

type Region = { id: string; name: string };
type FishingMethod = { id: string; name: string };
type Rank = { id: string; name: string; color: string | null; min_posts: number };
type RecentThread = { id: string; title: string; created_at: string };
type RecentGallery = { id: string; title: string; image_url: string; created_at: string };

const voivodeshipLabels: Record<string, string> = {
  dolnoslaskie: "Dolnośląskie", "kujawsko-pomorskie": "Kujawsko-Pomorskie",
  lubelskie: "Lubelskie", lubuskie: "Lubuskie", lodzkie: "Łódzkie",
  malopolskie: "Małopolskie", mazowieckie: "Mazowieckie", opolskie: "Opolskie",
  podkarpackie: "Podkarpackie", podlaskie: "Podlaskie", pomorskie: "Pomorskie",
  slaskie: "Śląskie", swietokrzyskie: "Świętokrzyskie",
  "warminsko-mazurskie": "Warmińsko-Mazurskie", wielkopolskie: "Wielkopolskie",
  zachodniopomorskie: "Zachodniopomorskie",
};

function FriendButton({ userId, currentUserId }: { userId: string; currentUserId: string }) {
  const [status, setStatus] = useState<"none" | "pending_sent" | "pending_received" | "friends" | "loading">("loading");

  useEffect(() => {
    const check = async () => {
      const { data: friendship } = await supabase
        .from("friendships")
        .select("id")
        .or(`and(user_a.eq.${currentUserId},user_b.eq.${userId}),and(user_a.eq.${userId},user_b.eq.${currentUserId})`)
        .maybeSingle();
      if (friendship) { setStatus("friends"); return; }

      const { data: sentReq } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("sender_id", currentUserId)
        .eq("receiver_id", userId)
        .eq("status", "PENDING")
        .maybeSingle();
      if (sentReq) { setStatus("pending_sent"); return; }

      const { data: recvReq } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("sender_id", userId)
        .eq("receiver_id", currentUserId)
        .eq("status", "PENDING")
        .maybeSingle();
      if (recvReq) { setStatus("pending_received"); return; }

      setStatus("none");
    };
    check();
  }, [userId, currentUserId]);

  const sendRequest = async () => {
    setStatus("pending_sent");
    await supabase.from("friend_requests").insert({ sender_id: currentUserId, receiver_id: userId });
  };

  const acceptRequest = async () => {
    await supabase.from("friend_requests").update({ status: "ACCEPTED" }).eq("sender_id", userId).eq("receiver_id", currentUserId);
    const [a, b] = [currentUserId, userId].sort();
    await supabase.from("friendships").insert({ user_a: a, user_b: b });
    setStatus("friends");
  };

  const removeFriend = async () => {
    await supabase.from("friendships").delete().or(`and(user_a.eq.${currentUserId},user_b.eq.${userId}),and(user_a.eq.${userId},user_b.eq.${currentUserId})`);
    setStatus("none");
  };

  if (status === "loading") return null;
  if (status === "friends") {
    return (
      <Button variant="outline" size="sm" onClick={removeFriend} className="gap-1.5 text-green-500 border-green-500/30">
        <UserCheck className="w-3.5 h-3.5" /> Znajomi
      </Button>
    );
  }
  if (status === "pending_sent") {
    return (
      <Button variant="outline" size="sm" disabled className="gap-1.5 opacity-60">
        <Clock className="w-3.5 h-3.5" /> Wysłano
      </Button>
    );
  }
  if (status === "pending_received") {
    return (
      <Button variant="outline" size="sm" onClick={acceptRequest} className="gap-1.5 text-primary">
        <UserPlus className="w-3.5 h-3.5" /> Akceptuj
      </Button>
    );
  }
  return (
    <Button variant="outline" size="sm" onClick={sendRequest} className="gap-1.5">
      <UserPlus className="w-3.5 h-3.5" /> Dodaj
    </Button>
  );
}

function FriendsList({ userId }: { userId: string }) {
  const [friends, setFriends] = useState<{ user_id: string; username: string | null; avatar_url: string | null }[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: friendships } = await supabase
        .from("friendships")
        .select("user_a, user_b")
        .or(`user_a.eq.${userId},user_b.eq.${userId}`);

      if (!friendships || friendships.length === 0) return;

      const friendIds = friendships.map((f) => f.user_a === userId ? f.user_b : f.user_a);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", friendIds);

      setFriends(profiles || []);
    };
    load();
  }, [userId]);

  if (friends.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Znajomi ({friends.length})</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {friends.map((f) => (
          <Link
            key={f.user_id}
            to={`/profil/${f.username}`}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 hover:border-primary/30 transition-colors"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={f.avatar_url || undefined} />
              <AvatarFallback className="bg-secondary text-foreground text-[10px]">
                {(f.username || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground">{f.username || "Użytkownik"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ProfilPage() {
  const { username: paramUsername } = useParams<{ username: string }>();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [methods, setMethods] = useState<FishingMethod[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ threads: 0, posts: 0, messages: 0 });
  const [recentThreads, setRecentThreads] = useState<RecentThread[]>([]);
  const [recentGallery, setRecentGallery] = useState<RecentGallery[]>([]);

  const [formData, setFormData] = useState({
    display_name: "", bio: "", age: "", region_id: "", fishing_method_id: "",
  });

  const isOwnProfile = !paramUsername || (profile && user && profile.user_id === user.id);

  useEffect(() => {
    const fetchData = async () => {
      let profileQuery;
      if (paramUsername) {
        profileQuery = supabase.from("profiles").select("*").eq("username", paramUsername).maybeSingle();
      } else if (user) {
        profileQuery = supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      } else {
        setLoading(false);
        return;
      }

      const [profileRes, regionsRes, methodsRes, ranksRes] = await Promise.all([
        profileQuery,
        supabase.from("regions").select("*").order("name"),
        supabase.from("fishing_methods").select("*").order("name"),
        supabase.from("ranks").select("*").order("min_posts"),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFormData({
          display_name: profileRes.data.display_name || "",
          bio: profileRes.data.bio || "",
          age: profileRes.data.age?.toString() || "",
          region_id: profileRes.data.region_id || "",
          fishing_method_id: profileRes.data.fishing_method_id || "",
        });

        const userId = profileRes.data.user_id;
        const [threadsRes, postsRes, msgsRes, recentThreadsRes, recentGalleryRes] = await Promise.all([
          supabase.from("threads").select("id", { count: "exact", head: true }).eq("author_id", userId),
          supabase.from("posts").select("id", { count: "exact", head: true }).eq("author_id", userId),
          supabase.from("channel_messages").select("id", { count: "exact", head: true }).eq("author_id", userId),
          supabase.from("threads").select("id, title, created_at").eq("author_id", userId).is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
          supabase.from("gallery_items").select("id, title, image_url, created_at").eq("author_id", userId).order("created_at", { ascending: false }).limit(6),
        ]);
        setStats({
          threads: threadsRes.count ?? 0,
          posts: postsRes.count ?? 0,
          messages: msgsRes.count ?? 0,
        });
        setRecentThreads(recentThreadsRes.data || []);
        setRecentGallery(recentGalleryRes.data || []);
      }
      setRegions(regionsRes.data || []);
      setMethods(methodsRes.data || []);
      setRanks(ranksRes.data || []);
      setLoading(false);
    };

    if (!authLoading) fetchData();
  }, [paramUsername, user, authLoading]);

  useEffect(() => {
    if (!authLoading && !user && !paramUsername) {
      navigate("/logowanie", { replace: true });
    }
  }, [user, authLoading, paramUsername, navigate]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !profile) return;

    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setUploadingAvatar(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const avatarUrl = urlData.publicUrl;

    await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", user.id);
    setProfile({ ...profile, avatar_url: avatarUrl });
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    await supabase.from("profiles").update({
      display_name: formData.display_name || null,
      bio: formData.bio || null,
      age: formData.age ? parseInt(formData.age) : null,
      region_id: formData.region_id || null,
      fishing_method_id: formData.fishing_method_id || null,
    }).eq("user_id", user.id);

    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    if (data) setProfile(data);
    setEditing(false);
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Profil nie został znaleziony.</p>
          <Link to="/" className="text-primary hover:underline">Wróć na stronę główną</Link>
        </div>
      </div>
    );
  }

  const rank = ranks.find((r) => r.id === profile.rank_id) || ranks[0];
  const region = regions.find((r) => r.id === profile.region_id);
  const method = methods.find((m) => m.id === profile.fishing_method_id);
  const displayName = profile.display_name || profile.username || "Użytkownik";

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Main profile card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-card">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-secondary text-foreground text-2xl">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-1">
                <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  @{profile.username}
                  {profile.last_seen_at && (
                    (() => {
                      const diff = Date.now() - new Date(profile.last_seen_at).getTime();
                      const isOnline = diff < 5 * 60 * 1000; // 5 min
                      return (
                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                          isOnline ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-muted-foreground"}`} />
                          {isOnline ? "Online" : `Ostatnio: ${formatTimeAgo(profile.last_seen_at)}`}
                        </span>
                      );
                    })()
                  )}
                </p>
              </div>
              {isOwnProfile && !editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                  <Pencil className="w-3.5 h-3.5" /> Edytuj
                </Button>
              )}
              {!isOwnProfile && user && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/wiadomosci?with=${profile.user_id}`)}
                    className="gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Napisz
                  </Button>
                  <FriendButton userId={profile.user_id} currentUserId={user.id} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/zglos-problem?type=user&target=${profile.username}`)}
                    className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/40"
                  >
                    <Flag className="w-3.5 h-3.5" /> Zgłoś
                  </Button>
                </div>
              )}
              {isOwnProfile && editing && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                    <Save className="w-3.5 h-3.5" /> {saving ? "..." : "Zapisz"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* Rank badge + Share */}
            <div className="flex items-center gap-2 mb-4">
              {rank && (
                <Badge variant="secondary" className="gap-1.5 px-3 py-1" style={{ color: rank.color || undefined }}>
                  <User className="w-3 h-3" /> {rank.name}
                </Badge>
              )}
              <button
                onClick={async () => {
                  const url = `${window.location.origin}/profil/${profile.username}`;
                  await navigator.clipboard.writeText(url);
                  toast.success("Link do profilu skopiowany!");
                }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
              >
                <Share2 className="w-3.5 h-3.5" /> Udostępnij
              </button>
            </div>

            {/* Edit / View mode */}
            {editing ? (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Wyświetlana nazwa</label>
                  <Input value={formData.display_name} onChange={(e) => setFormData((f) => ({ ...f, display_name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Bio</label>
                  <Textarea value={formData.bio} onChange={(e) => setFormData((f) => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Opowiedz o sobie..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Wiek</label>
                    <Input type="number" value={formData.age} onChange={(e) => setFormData((f) => ({ ...f, age: e.target.value }))} placeholder="np. 30" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Województwo</label>
                    <select value={formData.region_id} onChange={(e) => setFormData((f) => ({ ...f, region_id: e.target.value }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="">Wybierz...</option>
                      {regions.map((r) => <option key={r.id} value={r.id}>{voivodeshipLabels[r.name] || r.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Metoda wędkarska</label>
                  <select value={formData.fishing_method_id} onChange={(e) => setFormData((f) => ({ ...f, fishing_method_id: e.target.value }))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Wybierz...</option>
                    {methods.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
            ) : (
              <>
                {profile.bio && <p className="text-sm text-foreground/85 mb-4 whitespace-pre-wrap">{profile.bio}</p>}
                <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                  {profile.age && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" /> {profile.age} lat
                    </div>
                  )}
                  {region && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {voivodeshipLabels[region.name] || region.name}
                    </div>
                  )}
                  {method && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Fish className="w-4 h-4" /> {method.name}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" /> Dołączył {new Date(profile.joined_at).toLocaleDateString("pl-PL")}
                  </div>
                </div>
              </>
            )}

            {/* Stats */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">Aktywność</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-background p-4 text-center">
                  <FileText className="w-5 h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-foreground">{stats.threads}</p>
                  <p className="text-xs text-muted-foreground">Wątki</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4 text-center">
                  <MessageSquare className="w-5 h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-foreground">{stats.posts}</p>
                  <p className="text-xs text-muted-foreground">Komentarze</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-4 text-center">
                  <MessageCircle className="w-5 h-5 text-primary mx-auto mb-1.5" />
                  <p className="text-lg font-bold text-foreground">{stats.messages}</p>
                  <p className="text-xs text-muted-foreground">Wiadomości</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Friends list */}
        <FriendsList userId={profile.user_id} />

        {/* Recent threads */}
        {recentThreads.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Ostatnie wątki</h2>
            </div>
            <div className="space-y-2">
              {recentThreads.map((t) => (
                <Link
                  key={t.id}
                  to={`/forum/${t.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-background p-3 hover:border-primary/30 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground truncate mr-3">{t.title}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{formatTimeAgo(t.created_at)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent gallery */}
        {recentGallery.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Images className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Ostatnie zdjęcia</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {recentGallery.map((g) => (
                <Link key={g.id} to="/galeria" className="group aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={g.image_url} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Account actions */}
        {isOwnProfile && user && (
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground mb-2">Konto</h2>
            <Button
              variant="outline"
              className="w-full gap-2 justify-start"
              onClick={() => { signOut(); navigate("/"); }}
            >
              <LogOut className="w-4 h-4" /> Wyloguj się
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2 justify-start text-destructive hover:text-destructive hover:border-destructive/40"
              onClick={async () => {
                if (!confirm("Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.")) return;
                if (!confirm("Na pewno? Wszystkie Twoje dane zostaną usunięte.")) return;
                // Soft-delete: clear profile data
                await supabase.from("profiles").update({
                  display_name: "[usunięte]",
                  bio: null,
                  avatar_url: null,
                  age: null,
                  region_id: null,
                  fishing_method_id: null,
                }).eq("user_id", user.id);
                await signOut();
                toast.success("Konto zostało dezaktywowane.");
                navigate("/");
              }}
            >
              <Trash2 className="w-4 h-4" /> Usuń konto
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
