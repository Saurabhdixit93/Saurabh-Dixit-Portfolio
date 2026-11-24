import * as React from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  download?: boolean | string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-[var(--accent-contrast)] font-medium hover:opacity-90 active:scale-[0.98] border border-accent shadow-sm",
  secondary:
    "bg-surface text-text font-normal border border-hairline hover:border-accent hover:bg-surface/80 active:scale-[0.98]",
  ghost:
    "bg-transparent text-text hover:bg-surface hover:text-accent border border-transparent active:scale-[0.98]",
  outline:
    "bg-transparent text-text border border-hairline hover:border-accent hover:text-accent active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external,
      download,
      target,
      rel,
      icon,
      iconPosition = "left",
      loading = false,
      fullWidth = false,
      children,
      className = "",
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      inline-flex items-center justify-center font-mono rounded-sm transition-all duration-150
      focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2
      disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed
      cursor-pointer select-none
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `.trim();

    const content = (
      <>
        {loading ? (
          <span
            className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : icon && iconPosition === "left" ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}

        <span>{children}</span>

        {!loading && icon && iconPosition === "right" ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </>
    );

    if (href) {
      const isLinkDisabled = Boolean(disabled || loading);

      const linkClasses = `
        ${baseClasses}
        ${isLinkDisabled ? "pointer-events-none opacity-40 cursor-not-allowed" : ""}
      `.trim();

      const linkProps = {
        ...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>),
        className: linkClasses,
        "aria-disabled": isLinkDisabled ? true : undefined,
        tabIndex: isLinkDisabled ? -1 : props.tabIndex,
        role: isLinkDisabled ? "link" : undefined,
        onClick: isLinkDisabled
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : (props.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>),
      };

      if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return (
          <a
            {...linkProps}
            href={isLinkDisabled ? undefined : href}
            target={target ?? (external || href.startsWith("http") ? "_blank" : undefined)}
            rel={rel ?? (external || href.startsWith("http") ? "noopener noreferrer" : undefined)}
            download={download}
          >
            {content}
          </a>
        );
      }

      if (isLinkDisabled) {
        return (
          <a
            {...linkProps}
            href={undefined}
            download={download}
          >
            {content}
          </a>
        );
      }

      return (
        <Link
          {...linkProps}
          href={href}
          download={download}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

