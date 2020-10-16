import RawHotspot from "@helium/http/build/models/Hotspot";
import RawAccount from "@helium/http/build/models/Account";

export interface ChainStats {
  circulatingSupply: number;
  blockTime: number;
  electionTime: number;
  packetsTransferred: number;
  dataCredits: number;
  totalHotspots: number;
}

export interface MarketStats {
  volume: number;
  price: number;
  priceChange: number;
}

export type Hotspot = Omit<RawHotspot, "activity" | "witnesses">;

export type Account = RawAccount;