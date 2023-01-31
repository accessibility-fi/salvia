import { SalviaUser } from './SalviaUser'

export type SalviaTest = {
  id: number
  domain: string
  results: SalviaTestCase[]
}

export type SalviaTestCase = {
  id: number
  tester: string
  ts: string
  viewport: Viewport
  stats: SalviaTestStats
  report: { id: string }
}

export type SalviaTestStats = {
  passed: number
  warning: number
  failed: number
  pages: number
}

export type SalviaSaveTestCase = {
  domain: string
  viewport: Viewport
  report: { data: Record<string, StatReport>; reportId: string }
  user: SalviaUser | undefined
}

export type SalviaCreateTest = {
  domain: string
  viewport: Viewport
  report: Record<string, PageReport>
}

export type PageReport = {
  type: string
  system: {
    name: string
    description: string
    date: string
    url: { inputUrl: string; description?: string }
    page: unknown /*Object*/
  }
  metadata: ReportMetadata
  modules: Partial<Record<ModuleType, Module>>
}


export type StatReport = Omit<PageReport, 'modules'>

export type Module = {
    type: ModuleType
    metadata: ReportMetadata
    assertions: Record<string, ACTRule>

}

export type ModuleType = 'act-rules' | 'wcag-techniques' | 'best-practices'


export type ACTRule = {
  name: string
  code: string
  mapping: string
  description: string
  metadata: {
    target: string
    'success-criteria': SuccessCriteria[]
    url: string
    passed: number
    warning: number
    failed: number
    inapplicable: number
    outcome: string
    description: string
  }
  results: Result[]
}

export type Result = {
    verdict: string
    description: string
    resultCode: string
    elements: Element[]
    attributes: Object[]

}

export type Element = {

    htmlCode: string
    pointer: string
    accessibleName: string
}

export type SuccessCriteria = {
  name: string
  level: string
  principle: string
  url: string
  url_tr: string
}

export type ReportMetadata = {
  passed: number
  warning: number
  failed: number
  inapplicable: number
}

export type Viewport = 'mobile' | 'desktop'
