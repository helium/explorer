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
