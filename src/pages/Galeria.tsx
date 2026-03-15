import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Heart, MessageCircle, Plus, X, Send, Trash2, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatTimeAgo } from "@/lib/timeAgo";

const CATEGORIES = ["Wszystkie", "Życiówki", "Krajobraz", "Spinning", "Karpiowanie", "Feeder", "Spławik", "Muchowe", "Sumowe"];

type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string;
  author_id: string;
  author_name: string | null;
  created_at: string;
  likes_count: number;
  comments_count: number;
  liked: boolean;
};

type GalleryComment = {
  id: string;
  author_name: string | null;
  author_id: string;
  content: string;
  created_at: string;
};

export default function GaleriaPage() {
  const { user } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState("Wszystkie");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [comments, setComments] = useState<GalleryComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [profile, setProfile] = useState<{ username: string | null } | null>(null);

  // Create form
  const [createTitle, setCreateTitle] = useState("");
  const [createDesc, setCreateDesc] = useState("");
  const [createCategory, setCreateCategory] = useState("Życiówki");
  const [createFile, setCreateFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle().then(({ data }) => setProfile(data));
  }, [user]);

  const loadItems = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("gallery_items").select("*").order("created_at", { ascending: false }).limit(50);
    if (category !== "Wszystkie") query = query.eq("category", category);
    const { data: galleryData } = await query;
    if (!galleryData) { setLoading(false); return; }

    // Get likes and comments counts
    const ids = galleryData.map((i) => i.id);
    const [likesRes, commentsRes, userLikesRes] = await Promise.all([
      supabase.from("gallery_likes").select("gallery_item_id").in("gallery_item_id", ids),
      supabase.from("gallery_comments").select("gallery_item_id").in("gallery_item_id", ids),
      user ? supabase.from("gallery_likes").select("gallery_item_id").in("gallery_item_id", ids).eq("user_id", user.id) : Promise.resolve({ data: [] }),
    ]);

    const likeCounts: Record<string, number> = {};
    const commentCounts: Record<string, number> = {};
    const userLiked = new Set<string>();
    (likesRes.data || []).forEach((l) => { likeCounts[l.gallery_item_id] = (likeCounts[l.gallery_item_id] || 0) + 1; });
    (commentsRes.data || []).forEach((c) => { commentCounts[c.gallery_item_id] = (commentCounts[c.gallery_item_id] || 0) + 1; });
    (userLikesRes.data || []).forEach((l) => userLiked.add(l.gallery_item_id));

    setItems(galleryData.map((item) => ({
      ...item,
      likes_count: likeCounts[item.id] || 0,
      comments_count: commentCounts[item.id] || 0,
      liked: userLiked.has(item.id),
    })));
    setLoading(false);
  }, [category, user]);

  useEffect(() => { loadItems(); }, [loadItems]);

  const handleCreate = async () => {
    if (!user || !createFile || !createTitle.trim()) return;
    setCreating(true);
    const ext = createFile.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, createFile);
    if (uploadError) { setCreating(false); return; }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
    const authorName = profile?.username ?? user.email?.split("@")[0] ?? "Anonim";

    await supabase.from("gallery_items").insert({
      title: createTitle.trim(),
      description: createDesc.trim() || null,
      image_url: urlData.publicUrl,
      category: createCategory,
      author_id: user.id,
      author_name: authorName,
    });

    setCreateTitle(""); setCreateDesc(""); setCreateFile(null); setCreateCategory("Życiówki");
    setShowCreate(false); setCreating(false);
    loadItems();
  };

  const handleLike = async (item: GalleryItem) => {
    if (!user) return;
    if (item.liked) {
      await supabase.from("gallery_likes").delete().eq("gallery_item_id", item.id).eq("user_id", user.id);
    } else {
      await supabase.from("gallery_likes").insert({ gallery_item_id: item.id, user_id: user.id });
    }
    setItems((prev) => prev.map((i) =>
      i.id === item.id ? { ...i, liked: !i.liked, likes_count: i.liked ? i.likes_count - 1 : i.likes_count + 1 } : i
    ));
    if (lightbox?.id === item.id) setLightbox((lb) => lb ? { ...lb, liked: !lb.liked, likes_count: lb.liked ? lb.likes_count - 1 : lb.likes_count + 1 } : lb);
  };

  const openLightbox = async (item: GalleryItem) => {
    setLightbox(item);
    const { data } = await supabase.from("gallery_comments").select("*").eq("gallery_item_id", item.id).order("created_at", { ascending: true });
    setComments(data || []);
  };

  const handleComment = async () => {
    if (!user || !lightbox || !newComment.trim()) return;
    const authorName = profile?.username ?? user.email?.split("@")[0] ?? "Anonim";
    const { data } = await supabase.from("gallery_comments").insert({
      gallery_item_id: lightbox.id,
      author_id: user.id,
      author_name: authorName,
      content: newComment.trim(),
    }).select().single();
    if (data) setComments((prev) => [...prev, data]);
    setNewComment("");
    setItems((prev) => prev.map((i) => i.id === lightbox.id ? { ...i, comments_count: i.comments_count + 1 } : i));
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Galeria</h1>
          <p className="text-muted-foreground">Najlepsze zdjęcia naszej społeczności wędkarskiej</p>
          {user && (
            <Button onClick={() => setShowCreate(true)} className="mt-4 gap-2">
              <Plus className="w-4 h-4" /> Dodaj zdjęcie
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border border-border hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Brak zdjęć w tej kategorii. Bądź pierwszy! 📸</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => openLightbox(item)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-border bg-card"
              >
                <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/70 text-xs">{item.author_name}</span>
                    <div className="flex items-center gap-3 text-white/70 text-xs">
                      <span className="flex items-center gap-1"><Heart className={`w-3.5 h-3.5 ${item.liked ? "fill-red-500 text-red-500" : ""}`} /> {item.likes_count}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {item.comments_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <LightboxView
          item={lightbox}
          items={items}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          user={user}
          isAdmin={isAdmin}
          isModerator={isModerator}
          onClose={() => setLightbox(null)}
          onLike={() => handleLike(lightbox)}
          onComment={handleComment}
          onDelete={async () => {
            if (!confirm("Usunąć to zdjęcie?")) return;
            await supabase.from("gallery_items").delete().eq("id", lightbox.id);
            setLightbox(null);
            loadItems();
          }}
          onNavigate={(item) => {
            setLightbox(item);
            supabase.from("gallery_comments").select("*").eq("gallery_item_id", item.id).order("created_at").then(({ data }) => setComments(data || []));
          }}
        />
      )}

      {/* Create modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Dodaj zdjęcie</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="Tytuł" />
            <Textarea value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} placeholder="Opis (opcjonalnie)" rows={2} />
            <select value={createCategory} onChange={(e) => setCreateCategory(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {CATEGORIES.filter((c) => c !== "Wszystkie").map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="file" accept="image/*" onChange={(e) => setCreateFile(e.target.files?.[0] || null)} className="text-sm" />
            {createFile && (
              <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                <img
                  src={URL.createObjectURL(createFile)}
                  alt="Podgląd"
                  className="w-full max-h-48 object-contain"
                />
                <button
                  onClick={() => setCreateFile(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 text-foreground flex items-center justify-center hover:bg-background transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <Button onClick={handleCreate} disabled={creating || !createTitle.trim() || !createFile} className="w-full">
              {creating ? "Przesyłanie..." : "Opublikuj"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
