import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-1">
        <span>{label}</span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
