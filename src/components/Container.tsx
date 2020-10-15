import React, { ReactNode } from "react";

function Container({ children }: { children: ReactNode | ReactNode[] }) {
  return <div className="max-w-5xl mx-auto">{children}</div>;
}

export { Container };
