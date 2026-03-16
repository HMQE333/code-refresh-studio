import IconImage from "@/components/IconImage";

interface FormOAuthButtonProps {
  icon: string;
  iconUrl: string;
  onClick: () => void;
}

export default function FormOAuthButton({
  icon,
  iconUrl,
  onClick,
}: FormOAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center rounded-xl border border-border bg-background p-3 hover:bg-muted transition-colors"
      aria-label={`Zaloguj się przez ${icon}`}
    >
      <IconImage src={iconUrl} alt={icon} width={20} height={20} className="w-5 h-5" />
    </button>
  );
}
