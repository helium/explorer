import React from "react";
import { QueryCache } from "react-query";
import { dehydrate } from "react-query/hydration";

import { Page } from "../components/Page";
import { Header } from "../components/Header";
import { Heading } from "../components/Heading";
import { Footer } from "../components/Footer";
import { Container } from "../components/Container";
import {
  prefetchBlockHeight,
  prefetchChainStats,
  prefetchMarketStats,
  useBlockHeight,
  useChainStats,
  useMarketStats,
} from "../api";
import { formatNumber } from "../utils";

export default function Home() {
  return (
    <Page>
      <Header />
      <Hero />
      <section>
        <Container>
          <div className="bg-white">
            <div className="p-6">
              <Heading type="h2">Latest Blocks</Heading>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </Page>
  );
}

function Hero() {
  const blockHeightQuery = useBlockHeight();
  const chainStatsQuery = useChainStats();
  const marketStatsQuery = useMarketStats();

  return (
    <section className="bg-helium-dark py-20">
      <Container>
        <h1 className="text-white text-5xl">
          <span className="font-bold">Helium</span>{" "}
          <span className="font-hairline">Explorer</span>
        </h1>
        <div className="mt-8 bg-helium-light p-6 rounded-lg flex">
          <div className="flex-1">
            <div className="text-blue-500 font-thin tracking-wider">
              BLOCKCHAIN STATS
            </div>
            <div className="mt-6 text-white text-sm space-y-1">
              <Statistic
                title="Block Height"
                value={formatNumber(blockHeightQuery.data)}
              />
              <Statistic
                title="Total Hotspots"
                value={formatNumber(chainStatsQuery.data.totalHotspots)}
              />
              <Statistic
                title="LongFi data (30d)"
                value={`${(
                  (chainStatsQuery.data.dataCredits * 24) /
                  10e8
                ).toLocaleString()}`}
              />
              <Statistic
                title="Avg Election Time (24hr)"
                value={`${Math.floor(chainStatsQuery.data.electionTime / 60)}m`}
              />
              <Statistic
                title="Avg Block Time (24hr)"
                value={`${Math.round(
                  (chainStatsQuery.data.blockTime * 10) / 10
                )}s`}
              />
            </div>
          </div>
          <div className="flex-1 text-blue-500 font-thin tracking-wider">
            <div className="text-blue-500 font-thin tracking-wider">
              Market Stats
            </div>
            <div className="mt-6 text-white text-sm space-y-1">
              <Statistic
                title="Market Price"
                value={`${marketStatsQuery.data.price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })} 
                  (${marketStatsQuery.data.priceChange > 0 ? "+" : ""}
                  ${marketStatsQuery.data.priceChange.toLocaleString()}%)`}
              />
              <Statistic
                title="Volume (24hr)"
                value={marketStatsQuery.data.volume.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              />
              <Statistic
                title="Circulating Supply"
                value={`${chainStatsQuery.data.circulatingSupply.toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }
                )} HNT`}
              />
              <Statistic
                title="Data Credits spent (30d)"
                value={formatNumber(blockHeightQuery.data)}
              />
              <Statistic
                title="Market Cap"
                value={`${(
                  chainStatsQuery.data.circulatingSupply *
                  marketStatsQuery.data.price
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}`}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Statistic({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="flex">
      <div className="flex-1 font-hairline">{title}:</div>
      <div className="flex-1">{value}</div>
    </div>
  );
}

export async function getStaticProps() {
  const queryCache = new QueryCache();

  await prefetchBlockHeight(queryCache);
  await prefetchChainStats(queryCache);
  await prefetchMarketStats(queryCache);

  return {
    props: {
      dehydratedState: dehydrate(queryCache),
    },
  };
}
