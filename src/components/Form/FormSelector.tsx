import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface FormSelectorProps {
  id: string;
  placeholder: string;
  options: Option[];
  defaultValue?: string;
  value?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function FormSelector({
  id,
  placeholder,
  options,
  defaultValue,
  value,
  required = true,
  onChange,
}: FormSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultValue) {
      const defaultOption =
        options.find((opt) => opt.value === defaultValue) || null;
      setSelectedOption(defaultOption);
      if (defaultOption) onChange?.(defaultOption.value);
    }
  }, [defaultValue, options, onChange]);

  useEffect(() => {
    if (value === undefined) return;

    if (!value) {
      setSelectedOption(null);
      onChange?.("");
      return;
    }

    const opt = options.find((o) => o.value === value) || null;
    setSelectedOption(opt);
    if (opt) {
      onChange?.(opt.value);
    }
  }, [value, options, onChange]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange?.(option.value);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-[15px] py-2.5 text-[12px] text-muted-foreground bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 group"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-xl overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-[15px] py-2 text-left text-[12px] hover:bg-muted hover:text-primary flex flex-col gap-0.5 transition-colors"
              >
                <span>{option.label}</span>
                {option.description && (
                  <span className="text-[10px] text-muted-foreground">{option.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Hidden input for form validation */}
      <input
        type="hidden"
        name={id}
        value={selectedOption?.value ?? ""}
        required={required}
      />
    </div>
  );
}
