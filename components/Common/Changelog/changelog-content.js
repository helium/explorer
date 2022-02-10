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
  witnessed: {
    title: 'Witnesses is now Witnessed',
    description: [
      {
        type: 'paragraph',
        content:
          "The new witnessed list shows the Hotspots that you've seen beacon (i.e. Hotspots you've witnessed).",
      },
      {
        type: 'paragraph',
        content:
          'How does the new list differ from the old? The old list showed the Hotspots that saw you and had no impact on your earnings whether there were 0 or 50 Hotspots on the list. ',
      },
      {
        type: 'paragraph',
        content:
          'The bigger this new witnessed list is and the higher the average transmit scale of these Hotspots, the more HNT you can mine.',
      },
      {
        type: 'link',
        content:
          'https://docs.helium.com/troubleshooting/understanding-witnesses#transmit-scale-and-witnessed-list',
      },
    ],
    active: false,
  },
}
