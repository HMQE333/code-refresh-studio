import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Send, Heart, Trash2, Pencil, X, Check, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTimeAgo } from "@/lib/timeAgo";
import { useAuth } from "@/contexts/AuthContext";

export interface CommentData {
  id: string;
  author: string;
  authorId?: string;
  avatarUrl?: string | null;
  createdAt: string;
  content: string;
  likes: number;
  liked?: boolean;
  parentId?: string | null;
}

interface CommentSectionProps {
  comments: CommentData[];
  onAddComment: (content: string, parentId?: string | null) => Promise<void>;
  onLikeComment: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onEditComment?: (commentId: string, newContent: string) => Promise<void>;
  canModerate?: boolean;
}

export default function CommentSection({ comments, onAddComment, onLikeComment, onDeleteComment, onEditComment, canModerate }: CommentSectionProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    await onAddComment(newComment.trim(), replyTo);
    setNewComment("");
    setReplyTo(null);
    setIsSubmitting(false);
  };

  const topLevel = comments.filter((c) => !c.parentId);
  const replies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const renderComment = (comment: CommentData, isReply = false) => (
    <div key={comment.id} className={`flex gap-3 ${isReply ? "ml-10 mt-3" : "mt-4"}`}>
      <Link to={`/profil/${comment.author}`} className="shrink-0">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.avatarUrl || undefined} />
          <AvatarFallback className="bg-secondary text-foreground text-xs">
            {comment.author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/profil/${comment.author}`} className="text-sm font-medium text-primary hover:underline">
            {comment.author}
          </Link>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
        </div>
        {editingId === comment.id ? (
          <div className="flex gap-2 items-center">
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              onKeyDown={(e) => {
                if (e.key === "Enter" && editContent.trim() && onEditComment) {
                  onEditComment(comment.id, editContent.trim());
                  setEditingId(null);
                }
              }}
            />
            <button
              onClick={() => { if (editContent.trim() && onEditComment) { onEditComment(comment.id, editContent.trim()); setEditingId(null); } }}
              className="text-primary hover:text-primary/80"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-foreground/90">{comment.content}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
          <button
            onClick={() => onLikeComment(comment.id)}
            className={`flex items-center gap-1 transition-colors ${comment.liked ? "text-red-400" : "hover:text-foreground"}`}
          >
            <Heart className={`w-3 h-3 ${comment.liked ? "fill-red-400" : ""}`} /> {comment.likes}
          </button>
          {!isReply && user && (
            <button onClick={() => setReplyTo(comment.id)} className="hover:text-foreground transition-colors">
              Odpowiedz
            </button>
          )}
          {onEditComment && user && comment.authorId === user.id && editingId !== comment.id && (
            <button
              onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }}
              className="hover:text-foreground transition-colors"
            >
              <Pencil className="w-3 h-3" />
            </button>
          )}
          {onDeleteComment && (canModerate || (user && comment.authorId === user.id)) && (
            <button
              onClick={() => { if (confirm("Usunąć ten komentarz?")) onDeleteComment(comment.id); }}
              className="hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
        {replies(comment.id).map((r) => renderComment(r, true))}
      </div>
    </div>
  );

  return (
    <div>
      {user && (
        <div className="flex gap-3 mt-4">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback className="bg-secondary text-foreground text-xs">
              {user.email?.slice(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
              placeholder={replyTo ? "Napisz odpowiedź..." : "Dodaj komentarz..."}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !newComment.trim()}
              className="rounded-xl bg-primary text-primary-foreground px-3 py-2 hover:brightness-110 disabled:opacity-50 transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
      {replyTo && (
        <div className="ml-11 mt-1">
          <button onClick={() => setReplyTo(null)} className="text-xs text-muted-foreground hover:text-foreground">
            ✕ Anuluj odpowiedź
          </button>
        </div>
      )}
      <div className="divide-y divide-border/50">
        {topLevel.map((c) => renderComment(c))}
      </div>
      {comments.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">Brak komentarzy. Bądź pierwszy!</p>
      )}
    </div>
  );
}
