import { DateTime } from 'luxon'
import { isEmpty, startsWith } from 'rambda'
import normalizeURL from 'normalize-url'

export function buildReportName(domain: string, ts: string, type: string) {
  return (
    'testreport_' + removeSubdomain(domain) + '_' + dateTime2format(ts, 'yyyyMMddHHmm') + '.' + type
  )
}

export function buildPDFReportName(domain: string, ts: string, lang: string) {
  return (
    'testreport_' +
    removeSubdomain(domain) +
    '_' +
    dateTime2format(ts, 'yyyyMMddHHmm') +
    '_' +
    formatLang(lang) +
    '.pdf'
  )
}

export function buildJSONReportName(domain: string, ts: string) {
  return (
    'testreport_' +
    removeSubdomain(domain) +
    '_' +
    dateTime2format(ts, 'yyyyMMddHHmm') +
    '_json.pdf'
  )
}

function removeSubdomain(domain: string) {
  return domain.replace('www.', '')
}

export function formatLang(lang: string) {
  const ind = lang.indexOf('-')
  return ind > -1 ? lang.substring(0, ind) : lang
}

export function formatDateTime(ts: string) {
  return DateTime.fromISO(ts).toFormat('dd.MM.yyyy HH.mm')
}

export function formatDate(date: Date) {
  return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd HH:mm:ss')
}

export function dateTime2format(ts: string, format: string) {
  return DateTime.fromISO(ts).toFormat(format)
}

export function isValidURL(url: string) {
  return !isEmpty(url) && startsWith('https://', url)
}

/*format domain for prepending*/
export function formatDomain(domain: string) {
  return domain.endsWith('/') ? domain : domain + '/'
}

export function formatSubpage(domain: string, path: string) {
  return formatDomain(domain) + (path.startsWith('/') ? path.substring(1) : path)
}

export function getLanguageCode(language: string) {
  switch (language) {
    case 'finnish':
      return 'fi-FI'
    case 'swedish':
      return 'sv-SE'
    default:
      return 'en-US'
  }
}

export function isDevelopmentMode() {
  return !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
}

const testRoutes = ['/test', '/create-test']

export function isTestRoute(path: string) {
  return testRoutes.includes(path)
}

export function normalizeUrl(url: string) {
  return normalizeURL(url, { stripWWW: false, removeTrailingSlash: true })
}

export const validateURL = (url: string) => {
  return startsWith('http://', url) || startsWith('https://', url)
}
