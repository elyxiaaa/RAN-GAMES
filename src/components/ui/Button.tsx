import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type Variant = "primary" | "ghost" | "quiet";
type Size = "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-2.5 " +
  "whitespace-nowrap rounded-none border font-display font-bold uppercase " +
  "tracking-label transition-[transform,box-shadow,background-color,border-color] " +
  "duration-200 ease-out active:translate-y-px disabled:pointer-events-none " +
  "disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "border-crimson bg-crimson text-white shadow-cta hover:bg-crimson-hot " +
    "hover:border-crimson-hot hover:shadow-ctaHover hover:-translate-y-0.5",
  ghost:
    "border-burgundy-700 bg-ember/80 text-blush hover:border-crimson " +
    "hover:bg-burgundy-900 hover:-translate-y-0.5",
  quiet:
    "border-transparent bg-transparent text-rose hover:text-blush " +
    "hover:border-burgundy-700",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[12px]",
  lg: "h-14 px-7 text-[15px] sm:px-9",
};

type ButtonOwnProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonProps<T extends ElementType> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;

  return (
    <Tag
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="shrink-0 transition-transform duration-200 group-hover:scale-110"
        >
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </Tag>
  );
}
