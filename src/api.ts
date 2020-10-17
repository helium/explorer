import { Client, Network } from "@helium/http";
import { useQuery, QueryCache } from "react-query";
import { ChainStats, MarketStats, Hotspot, Account } from "./types";

// TODO(ehesp): break this file out?

// TODO(ehesp): client based on dev/prod (dev crashes on chain stats)
export const client = new Client(Network.production);

const BLOCK_HEIGHT = "block-height";
const CHAIN_STATS = "chain-stats";
const MARKET_STATS = "market-stats";
const HOTSPOT = "hotspot";
const ACCOUNT = "account";

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
  const hotspot = await client.hotspots.get(address);

  // The HTTP client returns a class, which we need to serialize before
  // returning to allow for caching.
  const serialized: Hotspot = JSON.parse(JSON.stringify(hotspot));
  delete serialized["client"];

  return serialized;
}

export async function prefetchHotspot(queryCache: QueryCache, address: string) {
  await queryCache.prefetchQuery([HOTSPOT, address], () => getHotspot(address));
}

export function useHotspot(address?: string) {
  return useQuery<Hotspot>([HOTSPOT, address], () => getHotspot(address), {
    enabled: !!address,
    retry: 0,
  });
}

export async function getRichestAccounts(): Promise<Account[]> {
  // HTTP API doesn't support listing richest accounts?
  const accounts = await fetch(
    "https://api.helium.io/v1/accounts/rich"
  ).then(($) => $.json());

  return accounts.data.map((acc: any) => {
    return {
      secNonce: acc.sec_nonce,
      secBalance: acc.sec_balance,
      nonce: acc.nonce,
      dcNonce: acc.dc_nonce,
      block: acc.block,
      balance: acc.balance,
      address: acc.address,
    } as Account;
  });
}

export async function prefetchRichestAccounts(queryCache: QueryCache) {
  await queryCache.prefetchQuery([ACCOUNT, "richest"], () =>
    getRichestAccounts()
  );
}

export function useRichestAccounts() {
  return useQuery<Account[]>([ACCOUNT, "richest"], () => getRichestAccounts());
}

export async function getAccount(address: string): Promise<Account> {
  const account = await client.accounts.get(address);
  // The HTTP client returns a class, which we need to serialize before
  // returning to allow for caching.
  const serialized: Account = JSON.parse(JSON.stringify(account));
  delete serialized["client"];

  return serialized;
}

export async function prefetchAccount(queryCache: QueryCache, address: string) {
  await queryCache.prefetchQuery([ACCOUNT, address], () => getAccount(address));
}

export function useAccount(address: string) {
  return useQuery<Account>([ACCOUNT, address], () => getAccount(address), {
    enabled: !!address,
    retry: 0,
  });
}
