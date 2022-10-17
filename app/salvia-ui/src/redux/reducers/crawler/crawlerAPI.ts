import { stringify } from 'query-string'
import urljoin from 'url-join'
import { Viewport } from '../../../types/SalviaTest'

const functionAPI = process.env.REACT_APP_SALVIA_FUNCTION_URL ?? ''
const crawlURL = urljoin(functionAPI, 'api/crawler')
const functionApiKey = process.env.REACT_APP_SALVIA_FUNCTION_KEY ?? ''

//fetch pages
export function fetchPages(
  url: string,
  depth: number,
  width: number,
  viewport: Viewport,
): Promise<{ data: string[] }> {
  return fetch(
    urljoin(
      crawlURL,
      `?${stringify({ url: url, depth: depth, width: width, viewport: viewport })}`,
    ),
    {
      headers: {
        'x-functions-key': functionApiKey,
      },
    },
  ).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<{ data: string[] }>
  })
}
