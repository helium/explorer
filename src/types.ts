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
