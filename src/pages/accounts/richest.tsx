import React from "react";
import Link from "next/link";
import { QueryCache } from "react-query";
import { dehydrate } from "react-query/hydration";

import { prefetchRichestAccounts, useRichestAccounts } from "../../api";
import { Container } from "../../components/Container";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Heading } from "../../components/Heading";
import { Page } from "../../components/Page";
import { Table } from "../../components/Table";
import { formatNumber } from "../../utils";

export default function Richest() {
  const accountsQuery = useRichestAccounts();

  return (
    <Page title="Richest Accounts">
      <Header />
      <section className="bg-helium-dark">
        <Container>
          <div className="py-12">
            <Heading type="h2" className="text-white">
              <span className="font-semibold">Rich</span>{" "}
              <span className="font-hairline">List</span>
            </Heading>
          </div>
        </Container>
      </section>
      <Container>
        <div className="bg-white p-6">
          <Heading type="h3">
            Accounts (Top {accountsQuery.data.length})
          </Heading>
        </div>
        <Table
          columns={[
            {
              heading: "Address",
              key: "address",
              render: (value: string) => (
                <Link href={`/account/${value}`}>
                  <a className="text-blue-500 hover:underline">{value}</a>
                </Link>
              ),
            },
            {
              heading: "HNT Balance",
              key: "balance",
              render: (value: number) => (
                <span>{formatNumber(value / 100000000)} HNT</span>
              ),
            },
            {
              heading: "HST Balance",
              key: "secBalance",
              render: (value: number) => (
                <span>{formatNumber(value / 100000000)} HST</span>
              ),
            },
          ]}
          data={accountsQuery.data}
        />
      </Container>
      <Footer />
    </Page>
  );
}

export async function getStaticProps() {
  const queryCache = new QueryCache();

  await prefetchRichestAccounts(queryCache);

  return {
    props: {
      dehydratedState: dehydrate(queryCache),
    },
  };
}
