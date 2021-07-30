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
        "Hotspot locations are scaled up to the nearest resolution 8 hexagon and anonymized to the center of that hexagon. Distances between Hotspots are then calculated from the center of a resolution 8 hexagon that the Hotspot occupies to the other. e.g. If the distance is 0 m, it's because they are in the same hexagon.",
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
