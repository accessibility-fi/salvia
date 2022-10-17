import urljoin from 'url-join'
import { stringify } from 'query-string'
import { PageReport } from '../../../types/SalviaTest'

const functionAPI = process.env.REACT_APP_SALVIA_FUNCTION_URL ?? ''
const functionApiKey = process.env.REACT_APP_SALVIA_FUNCTION_KEY ?? ''

const storeReportURL = urljoin(functionAPI, 'api/store')

const reportAPI = '/api/reports'
const reportURL = urljoin(functionAPI, 'api/jsonreport')

/*Store Qualweb report to storage*/
export function storeQualwebReport(
  id: string,
  report: Record<string, PageReport>,
): Promise<{ id: string }> {
  return fetch(storeReportURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-functions-key': functionApiKey,
    },
    body: JSON.stringify({ id: id, report: report }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<{ id: string }>
  })
}

/*Get Qualweb report from storage by reportId*/
export function getQualwebReport(id: string): Promise<{ data: string }> {
  const url = urljoin(reportURL, `?id=${id}`)
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-functions-key': functionApiKey,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<{ data: string }>
  })
}

export function getPdfReport(
  id: number,
  language?: string,
  type?: string,
  reportId?: string,
): Promise<Blob> {
  const reportType = type === 'json' ? 'jsonpdf' : 'pdf'
  const url =
    `${reportAPI}/${id}/${reportType}?` +
    stringify({ lang: language, type: type, reportId: reportId })

  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.blob() as Promise<Blob>
  })
}
