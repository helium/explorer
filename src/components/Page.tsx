import React, { ReactNode } from "react";
import Head from "next/head";

export interface PageProps {
  title?: string;
  children: ReactNode | ReactNode[];
}

function Page({ title, children }: PageProps) {
  return (
    <>
      <Head>
        <title>{`${title ? `${title} | ` : ""}Helium Explorer`}</title>
      </Head>
      <main>{children}</main>
    </>
  );
}

export { Page };
