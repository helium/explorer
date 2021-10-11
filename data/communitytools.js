// Hi there! You're probably here to add a Helium community tool to the list below.
// At the bottom of the list is a template for how a new list item should be added.

// When you're ready to submit, if you're using the GitHub editing interface,
// select the second option at the bottom ("Create a new branch for this commit and
// start a pull request") and then click "Propose changes" and one of the core
// contributors will review it as soon as possible.

// Please make sure your app is in ALPHABETICAL order

export const types = {
  monitoring: {
    label: 'Monitoring',
    foregroundColor: '#474DFF',
    backgroundColor: '#d4d4ff',
  },
  export: {
    label: 'Data Export',
    foregroundColor: '#A667F6',
    backgroundColor: '#e4d5fd',
  },
  ios: {
    label: 'iOS',
    foregroundColor: '#32C48D',
    backgroundColor: '#ccf1e8',
  },
  planning: {
    label: 'Planning',
    foregroundColor: '#F0BB32',
    backgroundColor: '#f7ebc6',
  },
}

export const communityToolsList = [
  {
    name: 'Bobcat Diagnoser',
    url: 'https://www.bobcatminer.com/post/bobcat-diagnoser-user-guide',
    description:
      'This utility reports miner temp, firmware updates, syncing blocks and more for Bobcat Hotspots.',
    tags: [types.monitoring, types.export],
  },
  {
    name: 'DeWi Rewards Report',
    url: 'https://etl.dewi.org/dashboard/11-rewards-report-for-an-account',
    description:
      'A free rewards report for accounts to tabulate mining earnings.',
    tags: [types.export],
  },
  {
    name: 'Fairspot CSV Export',
    url: 'https://www.fairspot.host/hnt-export-mining-tax',
    description: 'A tool to export transactions from your Helium wallet.',
    tags: [types.export],
  },
  {
    name: 'HDS - Hotspot Discord Status',
    url: 'https://www.github.com/co8/hds',
    description:
      'Activity and Reward Notifications sent to your Discord Channel',
    tags: [types.monitoring],
  },
  {
    name: 'Helistats',
    url: 'https://apps.apple.com/us/app/helistats/id1573119107',
    description:
      'Monitor your account and devices on your iOS devices, incl. widgets.',
    tags: [types.monitoring, types.ios],
  },
  {
    name: 'Helisum',
    url: 'https://helisum.com',
    description: 'Hotspot Monitoring and Dashboard solution',
    tags: [types.monitoring, types.export],
  },
  {
    name: 'Heliumbot.io',
    url: 'https://heliumbot.io',
    description:
      'Managed hotspot monitoring and profit calculation service providing push notifications',
    tags: [types.monitoring],
  },
  {
    name: 'Helium Hosts',
    url: 'https://heliumhosts.com/',
    description: 'Network with other Hotspot owners in your area',
    tags: [types.planning],
  },
  {
    name: 'helium-tax',
    url: 'https://davetapley.com/helium-tax/',
    description: 'Export CSV for mining and staking rewards',
    tags: [types.export],
  },
  {
    name: 'HeliumVision',
    url: 'https://helium.vision',
    description: 'Helium Network Planning, Optimization and Simulations',
    tags: [types.monitoring, types.planning],
  },
  {
    name: 'HNT-tracker',
    url: 'https://hnt-tracker.fifu-verein.de/',
    description:
      'Free CSV exports for HNT rewards, balance and payments. Conversion into all major currencies. Useful for taxes.',
    tags: [types.export],
  },  
  {
    name: 'Hotsbot',
    url: 'https://hotsbot.net/',
    description: 'Hotspot monitoring and event tracking via Telegram',
    tags: [types.monitoring],
  },
  {
    name: 'Hotspot Utility',
    url: 'https://apps.apple.com/us/app/helium-hotspot-utility/id1527367455',
    description:
      'This App allows you to easily configure your Hotspot WiFi and view Ethernet status.',
    tags: [types.ios],
  },
  {
    name: 'HotspotRF',
    url: 'https://hotspotrf.com',
    description:
      'Improve and optimize Helium hotspot placement using Radio Frequency (RF) modeling.',
    tags: [types.planning],
  },
  {
    name: 'Hotspotty',
    url: 'https://hotspotty.net',
    description: 'Hotspot Monitoring and Dashboard solution',
    tags: [types.monitoring, types.export],
  },
  {
    name: 'Kudzu',
    url: 'https://analytics.kudzu.gr/',
    description: 'Advanced placement and monitoring tool',
    tags: [types.monitoring, types.planning],
  },
  {
    name: 'MinerTax',
    url: 'https://www.minertax.com/home?symbol=HNT',
    description: 'Export CSV for mining and staking rewards',
    tags: [types.export],
  },
  {
    name: 'Nebra Dashboard',
    url: 'https://dashboard.nebra.com',
    description:
      'Control and monitor your Nebra (and in future other branded) Hotspots remotely including host tools.',
    tags: [types.monitoring],
  },
  {
    name: 'Nebra Diagnostics',
    url: 'https://helium.nebra.com/handy-guides/local-diagnostics',
    description:
      'Local diagnostics utility for Nebra Hotspots including syncing, firmware, and other useful info.',
    tags: [types.monitoring],
  },
  {
    name: 'ZenLedger',
    url: 'https://www.zenledger.io',
    description: 'Simplifying Helium taxes for investors and miners',
    tags: [types.export]
  },

  // The lines below are a template that you can copy and paste and then populate
  // to add a new tool to the list. All the possible tags are included in the
  // template, so just remove the ones that don't apply, and please don't make up
  // new ones. Make sure to remove the "//" at the beginning of each line before
  // you finish, and please leave the template here for the next person to use.

  // {
  //   name: 'Example Tool Name',
  //   url: 'https://www.example.com',
  //   description: 'Easily get the animal name of a given hotspot address',
  //   tags: [types.export, types.monitoring, types.planning, types.ios],
  // },
]
