import { round } from 'lodash'
// Data taken from https://www.kaggle.com/andradaolteanu/country-mapping-iso-continent-region
import countries from '../data/countries.json'

export const formatLargeNumber = (number) => {
  const BILLION = 1_000_000_000
  const MILLION = 1_000_000

  if (number >= BILLION) {
    return [round(number / BILLION, 3), 'B'].join('')
  }

  return [round(number / MILLION, 3), 'M'].join('')
}

export const formatPercent = (number, digits = 2) =>
  number.toLocaleString(undefined, {
    style: 'percent',
    maximumFractionDigits: digits,
  })

export const truncateHash = (hashToTruncate, truncateAmount = 10) =>
  `${hashToTruncate.slice(0, truncateAmount)}...${hashToTruncate.slice(
    -truncateAmount,
  )}`

export const parseAddress = (addrString) => {
  addrString = addrString.replaceAll(';', '');
  var addrSplit = addrString.split();
  var country = "";
  for (var i = 0; i < countries.length; i++) {
    const [countryName, code2, code3] = countries[i];
    const possibleCountry = addrSplit[addrSplit.length-1].toLowerCase();
    if (possibleCountry === countryName.toLowerCase() ||
        possibleCountry === code2.toLowerCase() ||
        possibleCountry === code3.toLowerCase()) {
      country = code2.toLowerCase();
      addrSplit = addrSplit.slice(0, addrSplit.length - 1);
      addrString = addrSplit.join(' ');
      break
    }
  }
  const parsed = {
    address: addrString
  }
  if (country !== "") {
    parsed.country = country;
  }
  return parsed;
}
