import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, Pin, PinOff, Trash2, Pencil, Save, X, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatTimeAgo } from "@/lib/timeAgo";
import CommentSection, { CommentData } from "@/components/forum/CommentSection";
import { toast } from "@/components/ui/sonner";

export default function ThreadDetailPage() {
  const { threadId } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const navigate = useNavigate();
  const [thread, setThread] = useState<any>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [boardName, setBoardName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const loadThread = useCallback(async () => {
    if (!threadId) return;
    const { data } = await supabase
      .from("threads")
      .select("*, profiles!threads_author_id_fkey(username, avatar_url)")
      .eq("id", threadId)
      .maybeSingle();

    if (!data) {
      navigate("/forum", { replace: true });
      return;
    }
    setThread(data);

    // Increment view count (fire-and-forget)
    supabase.rpc("increment_thread_views" as any, { thread_id: threadId }).then(() => {});

    // Get board name
    if (data.board_id) {
      const { data: board } = await supabase.from("boards").select("name").eq("id", data.board_id).maybeSingle();
      setBoardName(board?.name || null);
    }

    // Get like count
    const { count } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("thread_id", threadId)
      .eq("type", "like");
    setLikeCount(count ?? 0);

    // Check if user liked
    if (user) {
      const { data: myReaction } = await supabase
        .from("reactions")
        .select("id")
        .eq("thread_id", threadId)
        .eq("user_id", user.id)
        .eq("type", "like")
        .maybeSingle();
      setLiked(!!myReaction);
    }

    setLoading(false);
  }, [threadId, user, navigate]);

  const loadComments = useCallback(async () => {
    if (!threadId) return;
    const { data: posts } = await supabase
      .from("posts")
      .select("*, profiles!posts_author_id_fkey(username, avatar_url)")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (!posts) return;

    // Get reactions for posts
    const postIds = posts.map((p: any) => p.id);
    const { data: reactionsData } = await supabase
      .from("reactions")
      .select("post_id, user_id")
      .in("post_id", postIds.length > 0 ? postIds : ["none"])
      .eq("type", "like");

    const likeCounts: Record<string, number> = {};
    const userLikes = new Set<string>();
    (reactionsData ?? []).forEach((r: any) => {
      likeCounts[r.post_id] = (likeCounts[r.post_id] ?? 0) + 1;
      if (user && r.user_id === user.id) userLikes.add(r.post_id);
    });

    setComments(
      posts.map((p: any) => ({
        id: p.id,
        author: p.profiles?.username ?? "Anonim",
        authorId: p.author_id,
        avatarUrl: p.profiles?.avatar_url,
        createdAt: p.created_at,
        content: p.content,
        likes: likeCounts[p.id] ?? 0,
        liked: userLikes.has(p.id),
        parentId: p.parent_id,
      }))
    );
  }, [threadId, user]);

  useEffect(() => {
    loadThread();
    loadComments();
  }, [loadThread, loadComments]);

  const handleLikeThread = async () => {
    if (!user || !threadId) {
      toast.error("Zaloguj się, aby polubić.");
      return;
    }
    if (liked) {
      await supabase.from("reactions").delete().eq("thread_id", threadId).eq("user_id", user.id).eq("type", "like");
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase.from("reactions").insert({ thread_id: threadId, user_id: user.id, type: "like" });
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleAddComment = async (content: string, parentId?: string | null) => {
    if (!user || !threadId) {
      toast.error("Zaloguj się, aby komentować.");
      return;
    }
    const { error } = await supabase.from("posts").insert({
      content,
      thread_id: threadId,
      author_id: user.id,
      parent_id: parentId ?? null,
    });
    if (error) {
      toast.error("Nie udało się dodać komentarza.");
      return;
    }
    await loadComments();
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast.error("Zaloguj się, aby polubić.");
      return;
    }
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;

    if (comment.liked) {
      await supabase.from("reactions").delete().eq("post_id", commentId).eq("user_id", user.id).eq("type", "like");
    } else {
      await supabase.from("reactions").insert({ post_id: commentId, user_id: user.id, type: "like" });
    }
    await loadComments();
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    if (!user) return;
    await supabase.from("posts").update({ content: newContent }).eq("id", commentId);
    await loadComments();
    toast.success("Komentarz zaktualizowany.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!thread) return null;

  const authorName = thread.profiles?.username ?? "Anonim";
  const authorAvatar = thread.profiles?.avatar_url;

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link to="/forum" className="hover:text-primary transition-colors">Forum</Link>
          {boardName && (
            <>
              <span>›</span>
              <span className="text-foreground">{boardName}</span>
            </>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Wróć
        </button>

        <article className="rounded-2xl border border-border bg-card p-6">
          <div className="flex gap-4">
            <Link to={`/profil/${authorName}`} className="shrink-0">
              <Avatar className="w-12 h-12">
                <AvatarImage src={authorAvatar || undefined} />
                <AvatarFallback className="bg-secondary text-foreground">
                  {authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {thread.is_pinned && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0 gap-1">
                    <Pin className="w-2.5 h-2.5" /> Przypięty
                  </Badge>
                )}
                <Link to={`/profil/${authorName}`} className="text-sm font-medium text-primary hover:underline">
                  {authorName}
                </Link>
                <span className="text-xs text-muted-foreground">• {formatTimeAgo(thread.created_at)}</span>
                {thread.view_count > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" /> {thread.view_count}
                  </span>
                )}
                {thread.tag && <Badge variant="secondary" className="text-xs">{thread.tag}</Badge>}
              </div>
              <h1 className="text-xl font-bold text-foreground mb-3">
                {editing ? (
                  <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-xl font-bold" />
                ) : (
                  thread.title
                )}
              </h1>
              {editing ? (
                <Textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={6} className="text-sm" />
              ) : (
                <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">{thread.content}</p>
              )}

              <div className="flex items-center gap-4 mt-5 pt-4 border-t border-border">
                <button
                  onClick={handleLikeThread}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-red-400" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-red-400" : ""}`} />
                  {likeCount} {likeCount === 1 ? "polubienie" : "polubień"}
                </button>
                {user?.id === thread.author_id && !editing && (
                  <button
                    onClick={() => {
                      setEditTitle(thread.title);
                      setEditContent(thread.content);
                      setEditing(true);
                    }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-4 h-4" /> Edytuj
                  </button>
                )}
                {editing && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      disabled={editSaving}
                      onClick={async () => {
                        setEditSaving(true);
                        await supabase.from("threads").update({ title: editTitle, content: editContent }).eq("id", thread.id);
                        setThread({ ...thread, title: editTitle, content: editContent });
                        setEditing(false);
                        setEditSaving(false);
                        toast.success("Wątek zaktualizowany.");
                      }}
                      className="gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> {editSaving ? "..." : "Zapisz"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                {(isAdmin || isModerator) && !editing && (
                  <button
                    onClick={async () => {
                      const newPinned = !thread.is_pinned;
                      await supabase.from("threads").update({ is_pinned: newPinned }).eq("id", thread.id);
                      setThread({ ...thread, is_pinned: newPinned });
                      toast.success(newPinned ? "Wątek przypięty." : "Wątek odpięty.");
                    }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {thread.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                    {thread.is_pinned ? "Odepnij" : "Przypnij"}
                  </button>
                )}
                {(user?.id === thread.author_id || isAdmin || isModerator) && !editing && (
                  <button
                    onClick={async () => {
                      if (!confirm("Czy na pewno chcesz usunąć ten wątek?")) return;
                      await supabase.from("threads").update({ deleted_at: new Date().toISOString() }).eq("id", thread.id);
                      toast.success("Wątek został usunięty.");
                      navigate("/forum", { replace: true });
                    }}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors ml-auto"
                  >
                    <Trash2 className="w-4 h-4" /> Usuń
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-2">
            Komentarze ({comments.length})
          </h2>
          <CommentSection
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            onDeleteComment={async (commentId: string) => {
              await supabase.from("posts").update({ deleted_at: new Date().toISOString() }).eq("id", commentId);
              await loadComments();
            }}
            canModerate={isAdmin || isModerator}
          />
        </div>
      </div>
    </div>
  );
}
