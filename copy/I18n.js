import { createI18n } from 'react-router-i18n'

// Array of supported locales
// The first in the array is treated as the default locale
const locales = ['en', 'fr']

// Dictionary of translations
const translations = {
  en: {
    hello: 'Hello',
    hotspots: {
      title: 'Hotspots',
    },
    blocks: {
      title: 'Blocks',
      block: 'Block',
    },
    tooltips: {
      distance:
        "Helium uses hexagons from the H3 library to store Hotspot locations. This distance is a rough approximation of how far apart two Hotspots are based on the distance between the H3 cells (hexagons) they are located in. E.g. If the distance is 0 m, it's because they are in the same cell.",
    },
  },
  fr: {
    hello: 'Bonjour',
    hotspots: {
      title: 'Chaudspots',
    },
    blocks: {
      title: 'Blocks',
      block: 'Block',
    },
  },
}

const I18n = createI18n(locales, translations)

export default I18n
