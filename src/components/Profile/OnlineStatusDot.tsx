interface OnlineStatusDotProps {
  status?: "online" | "offline";
  className?: string;
}

export default function OnlineStatusDot({
  status = "offline",
  className = "",
}: OnlineStatusDotProps) {
  const isOnline = status === "online";
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${
        isOnline ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
      } ${className}`}
      title={isOnline ? "Online" : "Offline"}
    />
  );
}
