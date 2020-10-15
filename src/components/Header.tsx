import React from "react";
import Link from "next/link";

import { useBlockHeight } from "../api";
import { Container } from "./Container";
import { formatNumber } from "../utils";

function Header() {
  const blockHeightQuery = useBlockHeight();

  return (
    <header className="bg-helium sticky top-0 flex items-center text-white py-3 px-2 space-x-2">
      <div className="flex items-center">
        <Link href="/">
          <a
            className="w-64 inline-flex items-center hover:opacity-75 transition-opacity duration-100"
          >
            <img
              src="https://explorer.helium.com/static/media/helium-logo-white.c25e6e80.svg"
              alt="Helium Explorer"
              className="h-8"
            />
          </a>
        </Link>
      </div>
      <div className="flex-1">
        <Container>
          <div className="flex items-center">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-tl rounded-bl font-thin"
              placeholder="Search for a block height, hash, transaction, or address"
            />
            <div
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-400 transition-bg duration-100 flex h-full px-3 py-2 rounded-tr rounded-br"
              role="button"
            >
              <svg
                width="24"
                height="24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </Container>
      </div>

      <div className="w-64 flex justify-end">
        {formatNumber(blockHeightQuery.data)}
      </div>
    </header>
  );
}

export { Header };
