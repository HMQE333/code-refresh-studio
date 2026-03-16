interface FormInputProps {
  id: string;
  type: string;
  placeholder: string;
  defaultValue?: string;
  pattern?: string;
  title?: string;
  multiple?: boolean;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  ariaLabel?: string;
}

export default function FormInput({
  id,
  type,
  placeholder,
  defaultValue,
  pattern,
  title,
  multiple,
  required = true,
  minLength,
  maxLength,
  ariaLabel,
}: FormInputProps) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      pattern={pattern}
      title={title}
      multiple={multiple}
      required={required}
      minLength={minLength}
      maxLength={maxLength}
      aria-label={ariaLabel || placeholder}
      className="w-full rounded-lg border border-border bg-background px-[15px] py-2.5 text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
    />
  );
}
