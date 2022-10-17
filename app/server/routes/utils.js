'use strict'
const i18n = require('i18n')
const { DateTime } = require('luxon')

function translate(key) {
  return i18n.__(key)
}

function formatDateTime(ts, format) {
  return DateTime.fromISO(ts).toFormat(format)
}

function formatLang(lang) {
  const ind = lang.indexOf('-')
  return ind > -1 ? lang.substring(0, ind) : lang
}

/*format WCAG TR link*/
function formatURL_TR(url, locale) {
  //only finnish translation availbale at the moment
  if (locale === 'fi') {
    return url.replace('TR/WCAG21', 'Translations/WCAG21-' + locale)
  }
  return url
}

module.exports = { translate, formatDateTime, formatLang, formatURL_TR }
