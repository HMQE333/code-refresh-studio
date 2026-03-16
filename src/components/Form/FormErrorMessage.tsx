interface FormErrorMessageProps {
  message: string;
  title?: string;
}

export default function FormErrorMessage({
  message,
  title,
}: FormErrorMessageProps) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3">
      {title && (
        <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      )}
      <p className={title ? "text-xs text-muted-foreground" : "text-sm text-foreground"}>
        {message}
      </p>
    </div>
  );
}
