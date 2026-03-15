import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Fish, Calendar, Pencil, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
};

type Region = { id: string; name: string };
type FishingMethod = { id: string; name: string };
type Rank = { id: string; name: string; color: string | null };

const voivodeshipLabels: Record<string, string> = {
  dolnoslaskie: "Dolnośląskie",
  "kujawsko-pomorskie": "Kujawsko-Pomorskie",
  lubelskie: "Lubelskie",
  lubuskie: "Lubuskie",
  lodzkie: "Łódzkie",
  malopolskie: "Małopolskie",
  mazowieckie: "Mazowieckie",
  opolskie: "Opolskie",
  podkarpackie: "Podkarpackie",
  podlaskie: "Podlaskie",
  pomorskie: "Pomorskie",
  slaskie: "Śląskie",
  swietokrzyskie: "Świętokrzyskie",
  "warminsko-mazurskie": "Warmińsko-Mazurskie",
  wielkopolskie: "Wielkopolskie",
  zachodniopomorskie: "Zachodniopomorskie",
};

export default function ProfilPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [methods, setMethods] = useState<FishingMethod[]>([]);
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [formData, setFormData] = useState({
    display_name: "",
    bio: "",
    age: "",
    region_id: "",
    fishing_method_id: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/logowanie", { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, regionsRes, methodsRes, ranksRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
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
      }
      setRegions(regionsRes.data || []);
      setMethods(methodsRes.data || []);
      setRanks(ranksRes.data || []);
      setLoading(false);
    };

    fetchData();
  }, [user]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.display_name || null,
        bio: formData.bio || null,
        age: formData.age ? parseInt(formData.age) : null,
        region_id: formData.region_id || null,
        fishing_method_id: formData.fishing_method_id || null,
      })
      .eq("user_id", user!.id);

    if (!error) {
      // Refetch profile
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      if (data) setProfile(data);
      setEditing(false);
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Ładowanie profilu...</div>
      </div>
    );
  }

  if (!profile) return null;

  const rank = ranks.find((r) => r.id === profile.rank_id) || ranks[0];
  const region = regions.find((r) => r.id === profile.region_id);
  const method = methods.find((m) => m.id === profile.fishing_method_id);

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

          {/* Avatar + Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12 mb-6">
              <Avatar className="w-24 h-24 border-4 border-card">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-secondary text-foreground text-2xl">
                  {(profile.display_name || profile.username || "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-1">
                <h1 className="text-xl font-bold text-foreground">{profile.display_name || profile.username}</h1>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                  <Pencil className="w-3.5 h-3.5" /> Edytuj
                </Button>
              ) : (
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

            {/* Rank badge */}
            {rank && (
              <div className="mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-border"
                  style={{ color: rank.color || undefined }}
                >
                  <User className="w-3 h-3" />
                  {rank.name}
                </span>
              </div>
            )}

            {/* Bio */}
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
                    <select
                      value={formData.region_id}
                      onChange={(e) => setFormData((f) => ({ ...f, region_id: e.target.value }))}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Wybierz...</option>
                      {regions.map((r) => (
                        <option key={r.id} value={r.id}>{voivodeshipLabels[r.name] || r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Metoda wędkarska</label>
                  <select
                    value={formData.fishing_method_id}
                    onChange={(e) => setFormData((f) => ({ ...f, fishing_method_id: e.target.value }))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Wybierz...</option>
                    {methods.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <>
                {profile.bio && <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>}
                <div className="grid grid-cols-2 gap-3 text-sm">
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
          </div>
        </div>
      </div>
    </div>
  );
}
