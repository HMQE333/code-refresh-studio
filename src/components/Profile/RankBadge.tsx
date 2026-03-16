import { BadgeCheck } from "lucide-react";

interface RankBadgeProps {
  rank: string;
  color?: string | null;
}

export default function RankBadge({ rank, color }: RankBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-card"
      style={color ? { color, borderColor: `${color}40` } : undefined}
    >
      <BadgeCheck className="w-3.5 h-3.5" />
      {rank}
    </span>
  );
}
