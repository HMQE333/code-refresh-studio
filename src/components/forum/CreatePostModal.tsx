import { useState } from "react";
import { X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const POST_TYPES = [
  "Pytanie", "Relacja z łowiska", "Poradnik", "Test sprzętu",
  "Ogłoszenie", "Plan wyprawy", "Dyskusja ogólna",
];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  boardId: string;
}

export default function CreatePostModal({ isOpen, onClose, onCreated, boardId }: CreatePostModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState(POST_TYPES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Musisz być zalogowany, aby dodać post.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast.error("Tytuł i treść są wymagane.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("threads").insert({
      title: title.trim(),
      content: content.trim(),
      board_id: boardId,
      author_id: user.id,
      tag,
    });
    setIsSubmitting(false);

    if (error) {
      toast.error("Nie udało się utworzyć postu.");
      return;
    }

    toast.success("Post został utworzony!");
    setTitle("");
    setContent("");
    setTag(POST_TYPES[0]);
    onClose();
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground">Nowy post</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tytuł"
            maxLength={140}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />

          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  tag === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O czym chcesz napisać?"
            maxLength={5000}
            rows={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />

          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{content.length}/5000</span>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold px-5 py-2.5 text-sm hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Send size={14} />
              {isSubmitting ? "Publikowanie..." : "Opublikuj"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
