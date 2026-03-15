import { Eye, Heart, MessageSquare, Share2, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatTimeAgo } from "@/lib/timeAgo";

interface PostCardProps {
  id: string;
  author: string;
  avatarUrl?: string | null;
  createdAt: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  liked?: boolean;
  tag?: string | null;
  isPinned?: boolean;
  viewCount?: number;
  onClick: () => void;
  onLike: () => void;
}

export default function PostCard({
  id, author, avatarUrl, createdAt, title, content, likes, comments, liked, tag, isPinned, viewCount, onClick, onLike,
}: PostCardProps) {
  return (
    <article
      onClick={onClick}
      className={`rounded-xl border bg-card p-5 transition-all hover:border-primary/30 interactive-press cursor-pointer ${
        isPinned ? "border-primary/40 bg-primary/5" : "border-border"
      }`}
    >
      <div className="flex gap-4">
        <Link
          to={`/profil/${author}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        >
          <Avatar className="w-10 h-10 mt-1">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback className="bg-secondary text-foreground text-sm">
              {author.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isPinned && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0">📌 Przypięty</Badge>
            )}
            <Link
              to={`/profil/${author}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium text-primary hover:underline"
            >
              {author}
            </Link>
            <span className="text-xs text-muted-foreground">• {formatTimeAgo(createdAt)}</span>
            {tag && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1 leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{content}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <button
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              className={`flex items-center gap-1 transition-colors ${liked ? "text-red-400" : "hover:text-foreground"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-400" : ""}`} /> {likes}
            </button>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" /> {comments}
            </span>
            {viewCount !== undefined && viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {viewCount}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(`${window.location.origin}/forum/${id}`);
              }}
              className="flex items-center gap-1 hover:text-foreground transition-colors ml-auto"
              title="Udostępnij"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
