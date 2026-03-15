import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Flame, Clock3, MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/forum/PostCard";
import CreatePostModal from "@/components/forum/CreatePostModal";
import { toast } from "@/components/ui/sonner";

type ThreadRow = {
  id: string;
  title: string;
  content: string;
  tag: string | null;
  created_at: string;
  board_id: string;
  author_id: string;
  is_pinned: boolean;
  profiles: { username: string | null; avatar_url: string | null } | null;
  likes: number;
  comments: number;
  liked: boolean;
};

const sortOptions = [
  { id: "popular", label: "Popularne", icon: Flame },
  { id: "newest", label: "Najnowsze", icon: Clock3 },
  { id: "comments", label: "Komentarze", icon: MessageSquare },
  { id: "unanswered", label: "Bez odpowiedzi", icon: Sparkles },
] as const;

export default function ForumPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [boards, setBoards] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [activeBoard, setActiveBoard] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Load user count
  useEffect(() => {
    supabase.from("profiles").select("id", { count: "exact", head: true }).then(({ count }) => {
      setTotalUsers(count ?? 0);
    });
  }, []);

  // Load boards
  useEffect(() => {
    supabase.from("boards").select("id, name, slug").order("sort_order").then(({ data }) => {
      setBoards(data ?? []);
    });
  }, []);

  const PAGE_SIZE = 20;

  // Load threads
  const loadThreads = useCallback(async (append = false) => {
    if (!append) setLoading(true);

    let query = supabase
      .from("threads")
      .select("id, title, content, tag, created_at, board_id, author_id, is_pinned, view_count, profiles!threads_author_id_fkey(username, avatar_url)")
      .is("deleted_at", null);

    if (activeBoard) {
      query = query.eq("board_id", activeBoard);
    }

    if (searchQuery.trim()) {
      query = query.ilike("title", `%${searchQuery.trim()}%`);
    }

    const offset = append ? page * PAGE_SIZE : 0;
    query = query.order("is_pinned", { ascending: false }).order("created_at", { ascending: false }).range(offset, offset + PAGE_SIZE);

    const { data: threadsData } = await query;

    if (!threadsData || threadsData.length === 0) {
      if (!append) setThreads([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    setHasMore(threadsData.length > PAGE_SIZE);

    const displayData = threadsData.slice(0, PAGE_SIZE);
    const threadIds = displayData.map((t: any) => t.id);

    // Get like counts
    const { data: likesData } = await supabase
      .from("reactions")
      .select("thread_id")
      .in("thread_id", threadIds)
      .eq("type", "like");

    const likeCounts: Record<string, number> = {};
    (likesData ?? []).forEach((r: any) => {
      likeCounts[r.thread_id] = (likeCounts[r.thread_id] ?? 0) + 1;
    });

    // Get user's likes
    const userLikes = new Set<string>();
    if (user) {
      const { data: myLikes } = await supabase
        .from("reactions")
        .select("thread_id")
        .in("thread_id", threadIds)
        .eq("user_id", user.id)
        .eq("type", "like");
      (myLikes ?? []).forEach((r: any) => userLikes.add(r.thread_id));
    }

    // Get comment counts
    const { data: commentsData } = await supabase
      .from("posts")
      .select("thread_id")
      .in("thread_id", threadIds);

    const commentCounts: Record<string, number> = {};
    (commentsData ?? []).forEach((p: any) => {
      commentCounts[p.thread_id] = (commentCounts[p.thread_id] ?? 0) + 1;
    });

    let result: ThreadRow[] = displayData.map((t: any) => ({
      ...t,
      profiles: t.profiles,
      likes: likeCounts[t.id] ?? 0,
      comments: commentCounts[t.id] ?? 0,
      liked: userLikes.has(t.id),
    }));

    // Sort
    if (activeSort === "popular") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (activeSort === "comments") {
      result.sort((a, b) => b.comments - a.comments);
    }

    if (append) {
      setThreads((prev) => [...prev, ...result]);
    } else {
      setThreads(result);
    }
    setLoading(false);
  }, [activeBoard, activeSort, searchQuery, user, page]);

  useEffect(() => {
    if (page === 0) {
      loadThreads(false);
    } else {
      loadThreads(true);
    }
  }, [loadThreads, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [activeBoard, activeSort, searchQuery]);

  const handleLike = async (threadId: string) => {
    if (!user) {
      toast.error("Zaloguj się, aby polubić.");
      return;
    }
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return;

    if (thread.liked) {
      await supabase.from("reactions").delete().eq("thread_id", threadId).eq("user_id", user.id).eq("type", "like");
    } else {
      await supabase.from("reactions").insert({ thread_id: threadId, user_id: user.id, type: "like" });
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, liked: !t.liked, likes: t.liked ? t.likes - 1 : t.likes + 1 }
          : t
      )
    );
  };

  const defaultBoardId = boards.length > 0 ? boards[0].id : "";

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Forum</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-muted-foreground">Przeglądaj wątki i dołącz do dyskusji</p>
              {totalUsers > 0 && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-card border border-border px-2 py-0.5 rounded-full">
                  <Users className="w-3 h-3" /> {totalUsers} użytkowników
                </span>
              )}
            </div>
          </div>
          {user && (
            <Button onClick={() => setShowCreate(true)} className="gap-2 self-start">
              <Plus className="w-4 h-4" />
              Utwórz wątek
            </Button>
          )}
        </div>

        {/* Board filter */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveBoard(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !activeBoard
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            Wszystkie
          </button>
          {boards.map((b) => (
            <button
              key={b.id}
              onClick={() => setActiveBoard(b.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeBoard === b.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Szukaj wątków..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {sortOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setActiveSort(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSort === opt.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground border border-border"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Thread List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Brak wątków. Bądź pierwszy i utwórz nowy!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => (
              <PostCard
                key={thread.id}
                id={thread.id}
                author={thread.profiles?.username ?? "Anonim"}
                avatarUrl={thread.profiles?.avatar_url}
                createdAt={thread.created_at}
                title={thread.title}
                content={thread.content}
                likes={thread.likes}
                comments={thread.comments}
                liked={thread.liked}
                tag={thread.tag}
                isPinned={thread.is_pinned}
                viewCount={(thread as any).view_count ?? 0}
                onClick={() => navigate(`/forum/${thread.id}`)}
                onLike={() => handleLike(thread.id)}
              />
            ))}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => setPage((p) => p + 1)} className="gap-2">
                  Załaduj więcej wątków
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Create Modal */}
        <CreatePostModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onCreated={loadThreads}
          boardId={activeBoard ?? defaultBoardId}
        />
      </div>
    </div>
  );
}
