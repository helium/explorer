// This file is a copy of https://github.com/react-component/picker/blob/26726d25a031275375b8cbf92f960e9594efa45c/src/generate/dateFns.ts
// But it only supports the en_US locale.
import {
  getDay,
  getYear,
  getMonth,
  getDate,
  endOfMonth,
  getHours,
  getMinutes,
  getSeconds,
  addYears,
  addMonths,
  addDays,
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
  isAfter,
  isValid,
  getWeek,
  startOfWeek,
  format as formatDate,
  parse as parseDate,
} from 'date-fns'
import enUS from 'date-fns/locale/en-US'

const localeParse = (format) => {
  return format
    .replace(/Y/g, 'y')
    .replace(/D/g, 'd')
    .replace(/gggg/, 'yyyy')
    .replace(/g/g, 'G')
    .replace(/([Ww])o/g, 'wo')
}

const generateConfig = {
  // get
  getNow: () => new Date(),
  getFixedDate: (string) => new Date(string),
  getEndDate: (date) => endOfMonth(date),
  getWeekDay: (date) => getDay(date),
  getYear: (date) => getYear(date),
  getMonth: (date) => getMonth(date),
  getDate: (date) => getDate(date),
  getHour: (date) => getHours(date),
  getMinute: (date) => getMinutes(date),
  getSecond: (date) => getSeconds(date),

  // set
  addYear: (date, diff) => addYears(date, diff),
  addMonth: (date, diff) => addMonths(date, diff),
  addDate: (date, diff) => addDays(date, diff),
  setYear: (date, year) => setYear(date, year),
  setMonth: (date, month) => setMonth(date, month),
  setDate: (date, num) => setDate(date, num),
  setHour: (date, hour) => setHours(date, hour),
  setMinute: (date, minute) => setMinutes(date, minute),
  setSecond: (date, second) => setSeconds(date, second),

  // Compare
  isAfter: (date1, date2) => isAfter(date1, date2),
  isValidate: (date) => isValid(date),

  locale: {
    getWeekFirstDay: (locale) => {
      return enUS.options.weekStartsOn
    },
    getWeekFirstDate: (locale, date) => {
      return startOfWeek(date, { locale: enUS })
    },
    getWeek: (locale, date) => {
      return getWeek(date, { locale: enUS })
    },
    getShortWeekDays: (locale) => {
      return Array.from({ length: 7 }).map((_, i) =>
        enUS.localize.day(i, { width: 'short' }),
      )
    },
    getShortMonths: (locale) => {
      return Array.from({ length: 12 }).map((_, i) =>
        enUS.localize.month(i, { width: 'abbreviated' }),
      )
    },
    format: (locale, date, format) => {
      if (!isValid(date)) {
        return null
      }
      return formatDate(date, localeParse(format), {
        locale: enUS,
      })
    },
    parse: (locale, text, formats) => {
      for (let i = 0; i < formats.length; i += 1) {
        const format = localeParse(formats[i])
        const formatText = text
        const date = parseDate(formatText, format, new Date(), {
          locale: enUS,
        })
        if (isValid(date)) {
          return date
        }
      }
      return null
    },
  },
}

export default generateConfig
