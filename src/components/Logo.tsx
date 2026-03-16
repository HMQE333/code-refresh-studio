interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="RybiaPaka.pl logo"
      width={size}
      height={size}
      className={className}
    />
  );
}
