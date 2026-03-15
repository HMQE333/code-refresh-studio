import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatTimeAgo } from "@/lib/timeAgo";

type ThreadPreview = {
  id: string;
  title: string;
  created_at: string;
  author_name: string | null;
  likes: number;
  comments: number;
};

const MOCK_THREADS = [
  { id: "1", title: "Jak złapać suma na rzece?", author_name: "Wędkarz123", likes: 18, comments: 24, created_at: "" },
  { id: "2", title: "Najlepsze przynęty na szczupaka", author_name: "ProAngler", likes: 42, comments: 31, created_at: "" },
  { id: "3", title: "Porady dla początkujących – od czego zacząć?", author_name: "StartFishing", likes: 89, comments: 56, created_at: "" },
];

export default function Tutorials() {
  const [threads, setThreads] = useState<ThreadPreview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: threadsData } = await supabase
        .from("threads")
        .select("id, title, created_at, author_id")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!threadsData || threadsData.length === 0) {
        setThreads(MOCK_THREADS);
        setLoaded(true);
        return;
      }

      const threadIds = threadsData.map((t) => t.id);
      const authorIds = [...new Set(threadsData.map((t) => t.author_id))];

      const [likesRes, commentsRes, profilesRes] = await Promise.all([
        supabase.from("reactions").select("thread_id").in("thread_id", threadIds).eq("type", "like"),
        supabase.from("posts").select("thread_id").in("thread_id", threadIds),
        supabase.from("profiles").select("user_id, username").in("user_id", authorIds),
      ]);

      const likeCounts: Record<string, number> = {};
      const commentCounts: Record<string, number> = {};
      const authorMap = new Map((profilesRes.data || []).map((p) => [p.user_id, p.username]));

      (likesRes.data || []).forEach((r) => {
        likeCounts[r.thread_id] = (likeCounts[r.thread_id] || 0) + 1;
      });
      (commentsRes.data || []).forEach((p) => {
        commentCounts[p.thread_id] = (commentCounts[p.thread_id] || 0) + 1;
      });

      setThreads(
        threadsData.map((t) => ({
          id: t.id,
          title: t.title,
          created_at: t.created_at,
          author_name: authorMap.get(t.author_id) || "Anonim",
          likes: likeCounts[t.id] || 0,
          comments: commentCounts[t.id] || 0,
        }))
      );
      setLoaded(true);
    })();
  }, []);

  return (
    <section className="py-16 px-4 bg-background-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Popularne wątki</h2>
          <p className="text-foreground-2 text-sm">Dołącz do dyskusji na naszym forum.</p>
        </motion.div>

        <div className="grid gap-4">
          {threads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
            >
              <Link
                to={thread.created_at ? `/forum/${thread.id}` : "/forum"}
                className="interactive-card rounded-2xl border border-border bg-background-3 p-5 flex items-center justify-between gap-4 block"
              >
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1 truncate">{thread.title}</h3>
                  <p className="text-xs text-foreground-2">przez {thread.author_name}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-foreground-2">
                  <span className="flex items-center gap-1 text-xs">
                    <MessageSquare size={14} /> {thread.comments}
                  </span>
                  <span className="flex items-center gap-1 text-xs">
                    <ThumbsUp size={14} /> {thread.likes}
                  </span>
                  {thread.created_at && (
                    <span className="flex items-center gap-1 text-xs hidden sm:flex">
                      <Clock size={14} /> {formatTimeAgo(thread.created_at)}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/forum" className="text-sm text-primary hover:underline font-medium">
            Przejdź do forum →
          </Link>
        </div>
      </div>
    </section>
  );
}
