export const changelogContent = {
  'activity-v2': {
    title: 'Activity V2',
    description: [
      {
        type: 'paragraph',
        content:
          'Activity feeds have been upgraded for hotspots, accounts, and validators. Activity details now load significantly faster, and further details for each transaction can be shown by tapping or clicking to expand.',
      },
      {
        type: 'paragraph',
        content: 'All Activity is also now the default tab.',
      },
      {
        type: 'image',
        content: '/images/changelog-images/activity-v2.png',
      },
    ],
    active: false,
  },
  'witnessed': {
    title: 'Witnesses -> Witnessed',
    description: [{
      type: 'paragraph', content:
        "Now updated with new and more relevant information, the witnessed list shows the Hotspots that you've seen beacon (i.e. Hotspots you've witnessed). The bigger this list is and the higher the average transmit scale of these Hotspots, the more HNT you can mine"
    },],
    active: true,
  },
}
