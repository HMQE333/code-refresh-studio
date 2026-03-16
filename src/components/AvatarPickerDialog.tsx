import { useEffect, useMemo, useRef } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type DefaultAvatar = {
  id: string;
  src: string;
};

type AvatarPickerTab = "default" | "custom";

type AvatarPickerDialogProps = {
  open: boolean;
  activeTab: AvatarPickerTab;
  onTabChange: (tab: AvatarPickerTab) => void;
  onClose: () => void;
  defaultAvatars: DefaultAvatar[];
  selectedDefault: string;
  onSelectDefault: (src: string) => void;
  onSaveDefault: () => void;
  canSaveDefault: boolean;
  onSaveCustom: () => void;
  canSaveCustom: boolean;
  customContent: React.ReactNode;
};

const focusableSelector =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export default function AvatarPickerDialog({
  open,
  activeTab,
  onTabChange,
  onClose,
  defaultAvatars,
  selectedDefault,
  onSelectDefault,
  onSaveDefault,
  canSaveDefault,
  onSaveCustom,
  canSaveCustom,
  customContent,
}: AvatarPickerDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const bodyOverflowRef = useRef("");

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    bodyOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFirst = () => {
      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(focusableSelector)
      );
      if (items.length > 0) {
        items[0].focus();
      } else {
        root.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const root = dialogRef.current;
      if (!root) return;
      const items = Array.from(
        root.querySelectorAll<HTMLElement>(focusableSelector)
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!active || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const raf = requestAnimationFrame(focusFirst);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = bodyOverflowRef.current;
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  const saveDisabled = useMemo(() => {
    return activeTab === "default" ? !canSaveDefault : !canSaveCustom;
  }, [activeTab, canSaveDefault, canSaveCustom]);

  const handleSave = () => {
    if (activeTab === "default") {
      onSaveDefault();
    } else {
      onSaveCustom();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Zamknij"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Wybierz avatar</h3>
          <p className="text-sm text-muted-foreground">Domyślny lub własny obraz.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-full bg-muted p-1 mb-4">
          <button
            onClick={() => onTabChange("default")}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "default"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Domyślne
          </button>
          <button
            onClick={() => onTabChange("custom")}
            className={cn(
              "flex-1 rounded-full px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Własny
          </button>
        </div>

        {/* Content */}
        {activeTab === "default" ? (
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Wybierz jeden z domyślnych avatarów.
            </p>
            <div className="grid grid-cols-5 gap-2">
              {defaultAvatars.map((avatar, index) => {
                const isSelected = selectedDefault === avatar.src;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => onSelectDefault(avatar.src)}
                    aria-label={`Avatar ${index + 1}`}
                    aria-pressed={isSelected}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-full border-2 transition hover:border-primary/60",
                      isSelected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border"
                    )}
                  >
                    <img
                      src={avatar.src}
                      alt={`Avatar ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          customContent
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground mb-3">
            Zmiany zostaną zapisane po kliknięciu Zapisz.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Anuluj
            </button>
            <button
              onClick={handleSave}
              disabled={saveDisabled}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Zapisz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
