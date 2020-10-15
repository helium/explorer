import { Client, Network } from "@helium/http";
import Hotspot from "@helium/http/build/models/Hotspot";
import { useQuery, QueryCache } from "react-query";
import { ChainStats, MarketStats } from "./types";

// TODO(ehesp): break this file out?

// TODO(ehesp): client based on dev/prod (dev crashes on chain stats)
const client = new Client(Network.production);

const BLOCK_HEIGHT = "block-height";
const CHAIN_STATS = "chain-stats";
const MARKET_STATS = "market-stats";
const HOTSPOT = "hotspot";

export function getBlockHeight(): Promise<number> {
  return client.blocks.getHeight();
}

export async function prefetchBlockHeight(queryCache: QueryCache) {
  await queryCache.prefetchQuery(BLOCK_HEIGHT, getBlockHeight);
}

export function useBlockHeight() {
  return useQuery<number>(BLOCK_HEIGHT, () => getBlockHeight());
}

export async function getChainStats(): Promise<ChainStats> {
  const stats = await client.stats.get();

  return {
    circulatingSupply: stats.tokenSupply,
    blockTime: stats.blockTimes.lastDay.avg,
    electionTime: stats.electionTimes.lastDay.avg,
    packetsTransferred: stats.stateChannelCounts.lastMonth.numPackets,
    dataCredits: stats.stateChannelCounts.lastMonth.numDcs,
    totalHotspots: stats.counts.hotspots,
  };
}

export async function prefetchChainStats(queryCache: QueryCache) {
  await queryCache.prefetchQuery(CHAIN_STATS, getChainStats);
}

export function useChainStats() {
  return useQuery<ChainStats>(CHAIN_STATS, () => getChainStats());
}

export async function getMarketStats(): Promise<MarketStats> {
  const data = await fetch(
    "https://api.coingecko.com/api/v3/coins/helium"
  ).then(($) => $.json());

  let newVolume = 0;
  data.tickers.forEach((t: any) => {
    newVolume += t.converted_volume.usd;
  });

  return {
    volume: newVolume,
    price: data.market_data.current_price.usd,
    priceChange: data.market_data.price_change_percentage_24h,
  };
}

export async function prefetchMarketStats(queryCache: QueryCache) {
  await queryCache.prefetchQuery(MARKET_STATS, getMarketStats);
}

export function useMarketStats() {
  return useQuery<MarketStats>(MARKET_STATS, () => getMarketStats());
}

export async function getHotspot(address: string): Promise<Hotspot> {
  if (!address) {
    return null;
  }

  return client.hotspots.get(address);
}

export async function prefetchHotspot(queryCache: QueryCache, address: string) {
  await queryCache.prefetchQuery([HOTSPOT, address], getHotspot);
}

export function useHotspot(address: string) {
  return useQuery<Hotspot>([HOTSPOT, address], () => getHotspot(address));
}
