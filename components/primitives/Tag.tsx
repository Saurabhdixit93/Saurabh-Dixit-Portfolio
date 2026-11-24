import * as React from "react";

export type TagVariant = "default" | "accent" | "secondary" | "muted" | "outline";
export type TagSize = "sm" | "md";
export type TagIndicator = boolean | "green" | "orange" | "cyan" | "muted";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  size?: TagSize;
  indicator?: TagIndicator;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

const variantStyles: Record<TagVariant, string> = {
  default: "bg-surface text-text border-hairline",
  accent: "bg-accent/10 text-accent border-accent/30",
  secondary: "bg-accent2/10 text-accent2 border-accent2/30",
  muted: "bg-surface/40 text-muted border-hairline",
  outline: "bg-transparent text-text border-hairline",
};

const sizeStyles: Record<TagSize, string> = {
  sm: "px-2 py-0.5 text-[10px] tracking-wider",
  md: "px-2.5 py-1 text-xs tracking-wide",
};

const indicatorColorMap: Record<string, string> = {
  green: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]",
  orange: "bg-accent shadow-[0_0_6px_rgba(255,106,43,0.7)]",
  cyan: "bg-accent2 shadow-[0_0_6px_rgba(77,225,193,0.7)]",
  muted: "bg-muted",
};

export const Tag: React.FC<TagProps> = ({
  variant = "default",
  size = "md",
  indicator = false,
  icon,
  children,
  className = "",
  onClick,
  ...props
}) => {
  const isInteractive = Boolean(onClick);

  const indicatorColor =
    typeof indicator === "string"
      ? indicatorColorMap[indicator] || indicatorColorMap.orange
      : indicator
      ? variant === "secondary"
        ? indicatorColorMap.cyan
        : indicatorColorMap.orange
      : null;

  const content = (
    <>
      {indicatorColor && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${indicatorColor}`}
          aria-hidden="true"
        />
      )}

      {icon && (
        <span className="shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick as any}
        className={`inline-flex items-center gap-1.5 font-mono uppercase rounded-sm border cursor-pointer hover:border-accent transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...(props as any)}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase rounded-sm border select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {content}
    </span>
  );
};

export default Tag;

