export const activityFiltersByContext = {
  hotspot: {
    all: { name: 'All Activity', types: [] },
    beacons: { name: 'Beacons', types: ['poc_receipts_v1', 'poc_receipts_v2'] },
    data: { name: 'Data', types: ['state_channel_close_v1'] },
    rewards: {
      name: 'Rewards',
      types: ['rewards_v1', 'rewards_v2', 'rewards_v3'],
    },
  },
  account: {
    all: { name: 'All Activity', types: [] },
    payments: { name: 'Payments', types: ['payment_v1', 'payment_v2'] },
    stakes: {
      name: 'Stakes',
      types: [
        'stake_validator_v1',
        'unstake_validator_v1',
        'transfer_validator_stake_v1',
      ],
    },
    transfers: {
      name: 'Hotspot Transfers',
      types: ['transfer_hotspot_v1', 'transfer_hotspot_v2'],
    },
    burns: { name: 'Token Burns', types: ['token_burn_v1'] },
    rewards: {
      name: 'Rewards',
      types: ['rewards_v1', 'rewards_v2', 'rewards_v3'],
    },
  },
  validator: {
    all: { name: 'All Activity', types: [] },
    heartbeats: { name: 'Heartbeats', types: ['validator_heartbeat_v1'] },
    rewards: {
      name: 'Rewards',
      types: ['rewards_v1', 'rewards_v2', 'rewards_v3'],
    },
    stakes: {
      name: 'Stakes',
      types: [
        'stake_validator_v1',
        'unstake_validator_v1',
        'transfer_validator_stake_v1',
      ],
    },
  },
}
