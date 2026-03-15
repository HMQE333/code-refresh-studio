import { Heart, MessageSquare, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  onClick: () => void;
  onLike: () => void;
}

export default function PostCard({
  author, createdAt, title, content, likes, comments, liked, tag, onClick, onLike,
}: PostCardProps) {
  return (
    <article
      onClick={onClick}
      className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 interactive-press cursor-pointer"
    >
      <div className="flex gap-4">
        <Avatar className="w-10 h-10 mt-1 shrink-0">
          <AvatarFallback className="bg-secondary text-foreground text-sm">
            {author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-medium text-primary">{author}</span>
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
          </div>
        </div>
      </div>
    </article>
  );
}
