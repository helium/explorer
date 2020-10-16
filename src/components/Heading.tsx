import React, { CSSProperties, ReactNode } from "react";
import cx from "classnames";

type HeadingType = "h1" | "h2" | "h3";

export interface HeadingProps {
  type?: HeadingType;
  children: ReactNode | ReactNode[];
  className?: string;
  style?: CSSProperties;
}

const sizeStyles: { [key in HeadingType]: string } = {
  h1: "text-5xl",
  h2: "text-4xl",
  h3: "text-3xl",
};

function Heading({ type, children, className, style }: HeadingProps) {
  return React.createElement(type, {
    children,
    className: cx(sizeStyles[type], "font-thin", className),
    style,
  });
}

export { Heading };
