interface TagPillProps {
  label: string;
}

export default function TagPill({ label }: TagPillProps) {
  return (
    <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
      {label}
    </span>
  );
}
