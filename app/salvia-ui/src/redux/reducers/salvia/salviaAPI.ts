import { StatReport, SalviaSaveTestCase, SalviaTest, Viewport } from '../../../types/SalviaTest'
import { UserInfo } from '../../../types/SalviaUser'

const testCasesURL = '/api/salvia/testcases'
const saveTestCaseURL = '/api/salvia/test'

export function getSalviaTests(): Promise<SalviaTest[]> {
  return fetch(testCasesURL).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<SalviaTest[]>
  })
}

export function saveSalviaTestCase(
  domain: string,
  reportId: string,
  report: Record<string, StatReport>,
  viewport: Viewport,
  user?: UserInfo | undefined,
): Promise<{ data: string }> {
  const newTestCase: SalviaSaveTestCase = {
    domain: domain,
    viewport: viewport,
    report: { data: report, reportId: reportId },
    user: user ? { userId: user.user_id, userName: user.userName } : undefined,
  }

  return fetch(saveTestCaseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTestCase),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json() as Promise<{ data: string }>
  })
}