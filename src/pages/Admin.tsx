import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Users, Flag, MessageSquare, Images, FileText,
  Shield, BarChart3, Search, Ban, Clock, Trash2, Megaphone, Plus, Pencil, Pin, PinOff, ScrollText, Settings, Mail, Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/timeAgo";
import { toast } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Tab = "dashboard" | "users" | "reports" | "announcements" | "boards" | "threads" | "gallery" | "logs" | "newsletter" | "settings";

type Stats = {
  users: number;
  threads: number;
  posts: number;
  reports: number;
  gallery: number;
  messages: number;
};

type ProfileRow = {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  banned_until: string | null;
  ban_reason: string | null;
};

type ReportRow = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  author_name: string | null;
  target_type: string | null;
  target_id: string | null;
  created_at: string;
};

type RoleRow = { user_id: string; role: string };

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isModerator, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const tabFromHash = (location.hash.replace("#", "") || "dashboard") as Tab;
  const [tab, setTab] = useState<Tab>(tabFromHash);

  useEffect(() => {
    if (!authLoading && !roleLoading && (!user || (!isAdmin && !isModerator))) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, roleLoading, isAdmin, isModerator, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin && !isModerator) return null;

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
    { id: "users" as Tab, label: "Użytkownicy", icon: Users },
    { id: "reports" as Tab, label: "Zgłoszenia", icon: Flag },
    { id: "announcements" as Tab, label: "Ogłoszenia", icon: Megaphone },
    { id: "boards" as Tab, label: "Działy forum", icon: MessageSquare },
    { id: "threads" as Tab, label: "Wątki", icon: FileText },
    { id: "gallery" as Tab, label: "Galeria", icon: Images },
    { id: "logs" as Tab, label: "Logi", icon: ScrollText },
    { id: "newsletter" as Tab, label: "Newsletter", icon: Mail },
    { id: "settings" as Tab, label: "Ustawienia", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Panel Administracyjny</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); window.location.hash = t.id; }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === "dashboard" && <DashboardTab />}
        {tab === "users" && <UsersTab isAdmin={isAdmin} />}
        {tab === "reports" && <ReportsTab isAdmin={isAdmin} />}
        {tab === "announcements" && isAdmin && <AnnouncementsTab />}
        {tab === "boards" && isAdmin && <BoardsTab />}
        {tab === "threads" && <ThreadsTab />}
        {tab === "gallery" && <GalleryAdminTab />}
        {tab === "logs" && isAdmin && <LogsTab />}
        {tab === "settings" && isAdmin && <SettingsTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const [stats, setStats] = useState<Stats>({ users: 0, threads: 0, posts: 0, reports: 0, gallery: 0, messages: 0 });
  const [recentUsers, setRecentUsers] = useState<{ username: string | null; created_at: string }[]>([]);
  const [newsletterCount, setNewsletterCount] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("threads").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "PENDING"),
      supabase.from("gallery_items").select("id", { count: "exact", head: true }),
      supabase.from("channel_messages").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("username, created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
    ]).then(([u, t, p, r, g, m, recent, nl]) => {
      setStats({
        users: u.count ?? 0, threads: t.count ?? 0, posts: p.count ?? 0,
        reports: r.count ?? 0, gallery: g.count ?? 0, messages: m.count ?? 0,
      });
      setRecentUsers(recent.data || []);
      setNewsletterCount(nl.count ?? 0);
    });
  }, []);

  const cards = [
    { label: "Użytkownicy", value: stats.users, icon: Users },
    { label: "Wątki", value: stats.threads, icon: FileText },
    { label: "Komentarze", value: stats.posts, icon: MessageSquare },
    { label: "Otwarte zgłoszenia", value: stats.reports, icon: Flag },
    { label: "Galeria", value: stats.gallery, icon: Images },
    { label: "Wiadomości", value: stats.messages, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-xl border border-border bg-card p-5">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Recent users */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Nowi użytkownicy</h3>
          {recentUsers.length === 0 ? (
            <p className="text-xs text-muted-foreground">Brak</p>
          ) : (
            <div className="space-y-2">
              {recentUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <Link to={`/profil/${u.username}`} className="text-primary hover:underline text-xs">@{u.username}</Link>
                  <span className="text-[10px] text-muted-foreground">{formatTimeAgo(u.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Newsletter</h3>
          <p className="text-2xl font-bold text-foreground">{newsletterCount}</p>
          <p className="text-xs text-muted-foreground">subskrybentów</p>
        </div>
      </div>
    </div>
  );
}

function UsersTab({ isAdmin }: { isAdmin: boolean }) {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [banDialog, setBanDialog] = useState<{ userId: string; username: string } | null>(null);
  const [banDuration, setBanDuration] = useState("7");
  const [banReason, setBanReason] = useState("");

  const loadData = useCallback(async () => {
    const [pRes, rRes] = await Promise.all([
      supabase.from("profiles").select("user_id, username, display_name, avatar_url, created_at, banned_until, ban_reason").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    setProfiles(pRes.data || []);
    setRoles(rRes.data || []);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const getRoleForUser = (userId: string) => {
    const r = roles.find((ro) => ro.user_id === userId);
    return r?.role || "user";
  };

  const setRole = async (userId: string, newRole: string) => {
    setBusy((b) => ({ ...b, [userId]: true }));
    await supabase.from("user_roles").delete().eq("user_id", userId);
    if (newRole !== "user") {
      await supabase.from("user_roles").insert({ user_id: userId, role: newRole } as any);
    }
    await loadData();
    setBusy((b) => ({ ...b, [userId]: false }));
  };

  const handleBan = async () => {
    if (!banDialog) return;
    const days = parseInt(banDuration);
    const bannedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from("profiles").update({
      banned_until: bannedUntil,
      ban_reason: banReason.trim() || null,
    } as any).eq("user_id", banDialog.userId);
    toast.success(`Użytkownik ${banDialog.username} zbanowany na ${days} dni.`);
    setBanDialog(null);
    setBanReason("");
    setBanDuration("7");
    await loadData();
  };

  const handleUnban = async (userId: string) => {
    await supabase.from("profiles").update({
      banned_until: null,
      ban_reason: null,
    } as any).eq("user_id", userId);
    toast.success("Ban został usunięty.");
    await loadData();
  };

  const isBanned = (p: ProfileRow) => p.banned_until && new Date(p.banned_until) > new Date();

  const filtered = profiles.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (p.username?.toLowerCase().includes(q) || p.display_name?.toLowerCase().includes(q));
  });

  return (
    <div>
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj użytkownika..." className="pl-10" />
        </div>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Użytkownik</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Rola</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Dołączył</th>
                {isAdmin && <th className="text-left p-3 font-medium text-muted-foreground">Akcje</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const role = getRoleForUser(p.user_id);
                const banned = isBanned(p);
                return (
                  <tr key={p.user_id} className="border-b border-border last:border-0 hover:bg-muted/10">
                    <td className="p-3">
                      <Link to={`/profil/${p.username}`} className="flex items-center gap-2 hover:text-primary">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={p.avatar_url || undefined} />
                          <AvatarFallback className="bg-secondary text-foreground text-xs">
                            {(p.username ?? "?").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{p.display_name || p.username}</span>
                      </Link>
                    </td>
                    <td className="p-3">
                      <Badge variant={role === "admin" ? "default" : role === "moderator" ? "secondary" : "outline"}>
                        {role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {banned ? (
                        <Badge variant="destructive" className="gap-1 text-xs">
                          <Ban className="w-3 h-3" /> Zbanowany
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Aktywny</Badge>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">{formatTimeAgo(p.created_at)}</td>
                    {isAdmin && (
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={role}
                            onChange={(e) => setRole(p.user_id, e.target.value)}
                            disabled={busy[p.user_id]}
                            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                          >
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                          {banned ? (
                            <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => handleUnban(p.user_id)}>
                              <Clock className="w-3 h-3" /> Odbanuj
                            </Button>
                          ) : (
                            <Button size="sm" variant="destructive" className="text-xs h-7 gap-1" onClick={() => setBanDialog({ userId: p.user_id, username: p.username || "?" })}>
                              <Ban className="w-3 h-3" /> Ban
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ban Dialog */}
      <Dialog open={!!banDialog} onOpenChange={() => setBanDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zbanuj użytkownika</DialogTitle>
            <DialogDescription>
              Blokada konta użytkownika <strong>{banDialog?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Czas trwania (dni)</label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="1">1 dzień</option>
                <option value="3">3 dni</option>
                <option value="7">7 dni</option>
                <option value="14">14 dni</option>
                <option value="30">30 dni</option>
                <option value="90">90 dni</option>
                <option value="365">1 rok</option>
                <option value="3650">Permanentny</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Powód (opcjonalnie)</label>
              <Input value={banReason} onChange={(e) => setBanReason(e.target.value)} placeholder="Np. spam, łamanie regulaminu..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog(null)}>Anuluj</Button>
            <Button variant="destructive" onClick={handleBan}>Zbanuj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportsTab({ isAdmin }: { isAdmin: boolean }) {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    let q = supabase.from("reports").select("*").order("created_at", { ascending: false });
    if (filter !== "ALL") q = q.eq("status", filter);
    const { data } = await q;
    setReports(data || []);
  }, [filter]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reports").update({ status, resolved_at: status === "RESOLVED" ? new Date().toISOString() : null }).eq("id", id);
    loadReports();
  };

  const deleteReport = async (id: string) => {
    await supabase.from("reports").delete().eq("id", id);
    toast.success("Zgłoszenie usunięte.");
    loadReports();
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400",
    IN_REVIEW: "bg-blue-500/20 text-blue-400",
    RESOLVED: "bg-green-500/20 text-green-400",
    REJECTED: "bg-red-500/20 text-red-400",
  };

  const statusLabels: Record<string, string> = {
    PENDING: "Nowe", IN_REVIEW: "W toku", RESOLVED: "Zamknięte", REJECTED: "Odrzucone",
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {["ALL", "PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
            }`}
          >
            {s === "ALL" ? "Wszystkie" : statusLabels[s] || s}
          </button>
        ))}
      </div>

      {reports.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">Brak zgłoszeń</p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <button
                      onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                      className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors text-left"
                    >
                      {r.title}
                    </button>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[r.status] || ""}`}>
                      {statusLabels[r.status] || r.status}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.author_name} · {formatTimeAgo(r.created_at)}</p>
                  {expanded === r.id && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-sm text-foreground/85 whitespace-pre-wrap">
                        {r.description || "Brak opisu."}
                      </p>
                      {r.target_type && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Cel: {r.target_type} {r.target_id ? `(${r.target_id})` : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {r.status === "PENDING" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "IN_REVIEW")} className="text-xs h-7">W toku</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "RESOLVED")} className="text-xs h-7">Zamknij</Button>
                    </>
                  )}
                  {r.status === "IN_REVIEW" && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "RESOLVED")} className="text-xs h-7">Zamknij</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(r.id, "REJECTED")} className="text-xs h-7">Odrzuć</Button>
                    </>
                  )}
                  {isAdmin && (
                    <Button size="sm" variant="ghost" onClick={() => deleteReport(r.id)} className="text-xs h-7 text-destructive hover:text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type AnnouncementRow = {
  id: string;
  title: string;
  content: string;
  category: string;
  published: boolean;
  created_at: string;
};

function AnnouncementsTab() {
  const { user } = useAuth();
  const [items, setItems] = useState<AnnouncementRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<AnnouncementRow | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("ogloszenia");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setTitle(""); setContent(""); setCategory("ogloszenia");
    setEditItem(null); setShowForm(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user) return;
    setSaving(true);
    if (editItem) {
      await supabase.from("announcements").update({ title: title.trim(), content: content.trim(), category }).eq("id", editItem.id);
      toast.success("Ogłoszenie zaktualizowane.");
    } else {
      await supabase.from("announcements").insert({ title: title.trim(), content: content.trim(), category, author_id: user.id });
      toast.success("Ogłoszenie dodane.");
    }
    setSaving(false);
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć ogłoszenie?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Ogłoszenie usunięte.");
    load();
  };

  const togglePublished = async (item: AnnouncementRow) => {
    await supabase.from("announcements").update({ published: !item.published }).eq("id", item.id);
    load();
  };

  const startEdit = (item: AnnouncementRow) => {
    setEditItem(item);
    setTitle(item.title);
    setContent(item.content);
    setCategory(item.category);
    setShowForm(true);
  };

  const categoryLabels: Record<string, string> = {
    ogloszenia: "Ogłoszenia", aktualnosci: "Aktualności", konkursy: "Konkursy",
    wydarzenia: "Wydarzenia", kulisy: "Kulisy",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Zarządzanie ogłoszeniami</h2>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Dodaj
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6 space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł ogłoszenia" />
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Treść..." rows={4} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="ogloszenia">Ogłoszenia</option>
            <option value="aktualnosci">Aktualności</option>
            <option value="konkursy">Konkursy</option>
            <option value="wydarzenia">Wydarzenia</option>
            <option value="kulisy">Kulisy</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
              {saving ? "Zapisywanie..." : editItem ? "Zaktualizuj" : "Opublikuj"}
            </Button>
            <Button variant="outline" onClick={resetForm}>Anuluj</Button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">Brak ogłoszeń</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <Badge variant="secondary" className="text-[10px]">{categoryLabels[item.category] || item.category}</Badge>
                    <Badge variant={item.published ? "default" : "outline"} className="text-[10px]">
                      {item.published ? "Opublikowane" : "Szkic"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatTimeAgo(item.created_at)}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => togglePublished(item)} className="text-xs h-7">
                    {item.published ? "Ukryj" : "Opublikuj"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => startEdit(item)} className="text-xs h-7">
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-xs h-7 text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type BoardRow = { id: string; name: string; slug: string; description: string | null; icon: string | null; sort_order: number };

function BoardsTab() {
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editBoard, setEditBoard] = useState<BoardRow | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("boards").select("*").order("sort_order");
    setBoards(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => { setName(""); setSlug(""); setDescription(""); setEditBoard(null); setShowForm(false); };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) return;
    setSaving(true);
    if (editBoard) {
      await supabase.from("boards").update({ name: name.trim(), slug: slug.trim(), description: description.trim() || null }).eq("id", editBoard.id);
      toast.success("Dział zaktualizowany.");
    } else {
      const nextOrder = boards.length > 0 ? Math.max(...boards.map(b => b.sort_order)) + 1 : 0;
      await supabase.from("boards").insert({ name: name.trim(), slug: slug.trim(), description: description.trim() || null, sort_order: nextOrder });
      toast.success("Dział dodany.");
    }
    setSaving(false);
    resetForm();
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć dział? Wątki w tym dziale mogą stać się niedostępne.")) return;
    await supabase.from("boards").delete().eq("id", id);
    toast.success("Dział usunięty.");
    load();
  };

  const startEdit = (b: BoardRow) => {
    setEditBoard(b); setName(b.name); setSlug(b.slug); setDescription(b.description || ""); setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Zarządzanie działami forum</h2>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Dodaj dział
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5 mb-6 space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nazwa działu" />
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (np. wiadomosci)" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opis (opcjonalnie)" />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving || !name.trim() || !slug.trim()}>
              {saving ? "Zapisywanie..." : editBoard ? "Zaktualizuj" : "Dodaj"}
            </Button>
            <Button variant="outline" onClick={resetForm}>Anuluj</Button>
          </div>
        </div>
      )}

      {boards.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">Brak działów</p>
      ) : (
        <div className="space-y-3">
          {boards.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-foreground">{b.name}</h3>
                  <Badge variant="outline" className="text-[10px]">/{b.slug}</Badge>
                  <Badge variant="secondary" className="text-[10px]">#{b.sort_order}</Badge>
                </div>
                {b.description && <p className="text-xs text-muted-foreground">{b.description}</p>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button size="sm" variant="ghost" onClick={() => startEdit(b)} className="text-xs h-7">
                  <Pencil className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(b.id)} className="text-xs h-7 text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type ThreadAdminRow = {
  id: string;
  title: string;
  author_id: string;
  created_at: string;
  is_pinned: boolean;
  deleted_at: string | null;
  board_id: string;
  view_count: number;
  author_name: string | null;
  board_name: string | null;
};

function ThreadsTab() {
  const [threads, setThreads] = useState<ThreadAdminRow[]>([]);
  const [query, setQuery] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  const load = useCallback(async () => {
    let q = supabase
      .from("threads")
      .select("id, title, author_id, created_at, is_pinned, deleted_at, board_id, view_count")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!showDeleted) q = q.is("deleted_at", null);

    const { data: threadsData } = await q;
    if (!threadsData) { setThreads([]); return; }

    const authorIds = [...new Set(threadsData.map(t => t.author_id))];
    const boardIds = [...new Set(threadsData.map(t => t.board_id))];

    const [authorsRes, boardsRes] = await Promise.all([
      authorIds.length ? supabase.from("profiles").select("user_id, username").in("user_id", authorIds) : Promise.resolve({ data: [] }),
      boardIds.length ? supabase.from("boards").select("id, name").in("id", boardIds) : Promise.resolve({ data: [] }),
    ]);

    const authorMap = new Map((authorsRes.data || []).map(a => [a.user_id, a.username]));
    const boardMap = new Map((boardsRes.data || []).map(b => [b.id, b.name]));

    setThreads(threadsData.map(t => ({
      ...t,
      view_count: (t as any).view_count ?? 0,
      author_name: authorMap.get(t.author_id) || null,
      board_name: boardMap.get(t.board_id) || null,
    })));
  }, [showDeleted]);

  useEffect(() => { load(); }, [load]);

  const togglePin = async (id: string, current: boolean) => {
    await supabase.from("threads").update({ is_pinned: !current }).eq("id", id);
    load();
  };

  const softDelete = async (id: string) => {
    if (!confirm("Usunąć ten wątek?")) return;
    await supabase.from("threads").update({ deleted_at: new Date().toISOString() }).eq("id", id);
    toast.success("Wątek usunięty.");
    load();
  };

  const restore = async (id: string) => {
    await supabase.from("threads").update({ deleted_at: null }).eq("id", id);
    toast.success("Wątek przywrócony.");
    load();
  };

  const filtered = threads.filter(t => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.author_name?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj wątków..." className="pl-10" />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} className="rounded" />
          Pokaż usunięte
        </label>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Wątek</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Autor</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Dział</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Data</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className={`border-b border-border last:border-0 hover:bg-muted/10 ${t.deleted_at ? "opacity-50" : ""}`}>
                  <td className="p-3">
                    <Link to={`/forum/${t.id}`} className="font-medium text-foreground hover:text-primary transition-colors truncate block max-w-[250px]">
                      {t.is_pinned && <Pin className="w-3 h-3 inline mr-1 text-primary" />}
                      {t.title}
                    </Link>
                    {t.deleted_at && <Badge variant="destructive" className="text-[10px] mt-0.5">Usunięty</Badge>}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{t.author_name || "—"}</td>
                  <td className="p-3"><Badge variant="secondary" className="text-[10px]">{t.board_name || "—"}</Badge></td>
                  <td className="p-3 text-muted-foreground text-xs whitespace-nowrap">{formatTimeAgo(t.created_at)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => togglePin(t.id, t.is_pinned)} title={t.is_pinned ? "Odepnij" : "Przypnij"}>
                        {t.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                      </Button>
                      {t.deleted_at ? (
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-primary" onClick={() => restore(t.id)}>
                          <Clock className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive hover:text-destructive" onClick={() => softDelete(t.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">Brak wątków</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type GalleryAdminRow = {
  id: string;
  title: string;
  image_url: string;
  author_name: string | null;
  category: string;
  created_at: string;
};

function GalleryAdminTab() {
  const [items, setItems] = useState<GalleryAdminRow[]>([]);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("gallery_items")
      .select("id, title, image_url, author_name, category, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    setItems(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Usunąć to zdjęcie z galerii?")) return;
    await supabase.from("gallery_items").delete().eq("id", id);
    toast.success("Zdjęcie usunięte.");
    load();
  };

  const filtered = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.author_name?.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj w galerii..." className="pl-10" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">Brak zdjęć</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden group">
              <div className="aspect-square overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <h3 className="text-xs font-medium text-foreground truncate">{item.title}</h3>
                <p className="text-[10px] text-muted-foreground">{item.author_name ?? "Anonim"} · {formatTimeAgo(item.created_at)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-xs h-6 ml-auto text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LogsTab() {
  const [logs, setLogs] = useState<{ id: string; message: string; level: string; actor_id: string | null; context: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("admin_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setLogs(data || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Logi administracyjne</h2>
      {logs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Brak logów</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Czas</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Poziom</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Wiadomość</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Kontekst</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("pl-PL")}
                    </td>
                    <td className="p-3">
                      <Badge variant={log.level === "ERROR" ? "destructive" : log.level === "WARN" ? "secondary" : "outline"} className="text-[10px]">
                        {log.level}
                      </Badge>
                    </td>
                    <td className="p-3 text-foreground">{log.message}</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate">{log.context || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const [maintenance, setMaintenance] = useState(false);
  const [siteName, setSiteName] = useState("RybiaPaka.pl");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key, value")
      .then(({ data }) => {
        data?.forEach((row: any) => {
          if (row.key === "maintenance") setMaintenance(row.value === "true");
          if (row.key === "site_name") setSiteName(row.value);
        });
        setLoading(false);
      });
  }, []);

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
    setSaving(false);
    toast.success("Ustawienie zapisane.");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Ustawienia strony</h2>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        {/* Site name */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Nazwa strony</label>
          <div className="flex gap-2">
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="max-w-xs" />
            <Button size="sm" onClick={() => saveSetting("site_name", siteName)} disabled={saving}>Zapisz</Button>
          </div>
        </div>

        {/* Maintenance */}
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Tryb konserwacji</label>
          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                const newVal = !maintenance;
                setMaintenance(newVal);
                await saveSetting("maintenance", newVal.toString());
              }}
              className={`relative w-12 h-6 rounded-full transition-colors ${maintenance ? "bg-destructive" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${maintenance ? "translate-x-6" : ""}`} />
            </button>
            <span className="text-sm text-foreground">
              {maintenance ? "Aktywny — strona niedostępna dla użytkowników" : "Wyłączony"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Gdy włączony, tylko administratorzy mogą przeglądać stronę.
          </p>
        </div>
      </div>
    </div>
  );
}
