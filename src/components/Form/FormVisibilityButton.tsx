import { Eye, EyeOff } from "lucide-react";

interface FormVisibilityButtonProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FormVisibilityButton({
  visible,
  setVisible,
}: FormVisibilityButtonProps) {
  return (
    <button
      type="button"
      onClick={() => setVisible(!visible)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
    >
      {visible ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );
}
