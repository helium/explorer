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
  },
  fr: {
    hello: 'Bonjour',
    hotspots: {
      title: 'Chaudspots',
    },
  },
}

const I18n = createI18n(locales, translations)

export default I18n
