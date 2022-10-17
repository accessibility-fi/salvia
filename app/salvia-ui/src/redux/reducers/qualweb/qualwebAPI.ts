import urljoin from 'url-join'
import { PageReport, Viewport } from '../../../types/SalviaTest'

const functionAPI = process.env.REACT_APP_SALVIA_FUNCTION_URL ?? ''
const functionApiKey = process.env.REACT_APP_SALVIA_FUNCTION_KEY ?? ''
const qualwebURL = urljoin(functionAPI, 'api/qualweb')

export function runQualweb(
  domain: string,
  urls: string[],
  viewport: Viewport,
): Promise<{ data: Record<string, PageReport> }> {
  return fetch(qualwebURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-functions-key': functionApiKey,
    },
    body: JSON.stringify({ domain: domain, urls: urls, viewport: viewport }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<{ data: Record<string, PageReport> }>
  })
}
