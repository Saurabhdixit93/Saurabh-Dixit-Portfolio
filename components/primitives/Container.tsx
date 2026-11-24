import * as React from "react";

export type ContainerSize = "default" | "narrow" | "wide" | "prose" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: ContainerSize;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  narrow: "max-w-4xl",
  prose: "max-w-3xl",
  default: "max-w-7xl",
  wide: "max-w-[1440px]",
  full: "max-w-full",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", size = "default", className = "", children, ...props }, ref) => {
    const Comp = Component as any;
    return (
      <Comp
        ref={ref}
        className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Container.displayName = "Container";

export default Container;

