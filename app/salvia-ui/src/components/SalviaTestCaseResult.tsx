import { SalviaTestCase, SalviaTestStats } from '../types/SalviaTest'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import {
  getTestReport,
  getPDFReport,
  getJSONTestReport,
} from '../redux/reducers/report/reportSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  buildJSONReportName,
  buildPDFReportName,
  buildReportName,
  formatDateTime,
  getLanguageCode,
} from './utils'
import { selectReportSettings } from '../redux/reducers/settings/settingsSlice'
import { useTranslation } from 'react-i18next'
import SalviaIcon from './common/SalviaIcon'
import { Button } from 'suomifi-ui-components'

interface SalviaTestCaseResultProps {
  domain: string
  salviaTestCase: SalviaTestCase
}

const SalviaTestCaseResult = ({ domain, salviaTestCase }: SalviaTestCaseResultProps) => {
  const dispatch = useAppDispatch()
  const reportSettings = useAppSelector(selectReportSettings)
  const language = getLanguageCode(reportSettings.language)

  const [translate] = useTranslation()
  const { id, ts, viewport, stats, report } = salviaTestCase

  return (
    <Row className='salvia-test-case'>
      <Col className='test-case-ts' xs={6} md={2} lg={2}>
        {formatDateTime(ts)}
      </Col>
      <Col className='viewport' xs={6} md={1} lg={1}>
        {viewport === 'mobile' ? (
          <SalviaIcon icon='mobile-alt' label={translate(`salvia.icon.mobile`)} />
        ) : (
          <SalviaIcon icon='desktop' label={translate(`salvia.icon.desktop`)} />
        )}
      </Col>

      <Col className='salvia-stats' xs={12} md={4} lg={4}>
        <SalviaTestStatsComponent {...stats} />
      </Col>
      <Col className='test-case-reports' xs={12} md={8} lg={4}>
        <div className='json-report'>
          <Button
            id={'salvia-test-json-' + id}
            className='salvia-button'
            onClick={() =>
              dispatch(
                getTestReport({
                  type: 'json',
                  id: id,
                  reportName: buildReportName(domain, ts, 'json'),
                  reportId: report.id,
                }),
              )
            }
          >
            JSON
          </Button>
        </div>
        <div className='json-report'>
          <Button
            id={'salvia-test-json-pdf' + id}
            className='salvia-button'
            onClick={() =>
              dispatch(
                getJSONTestReport({
                  type: 'json',
                  id: id,
                  reportName: buildJSONReportName(domain, ts),
                  language: language,
                  reportId: report.id,
                }),
              )
            }
          >
            JSON (PDF)
          </Button>
        </div>

        <div className='pdf-report'>
          <Button
            id={'salvia-test-pdf-' + id}
            className='salvia-button'
            onClick={() =>
              dispatch(
                getPDFReport({
                  type: 'pdf',
                  id: id,
                  reportName: buildPDFReportName(domain, ts, language),
                  language: language,
                  reportId: report.id,
                }),
              )
            }
          >
            PDF
          </Button>
        </div>
      </Col>
    </Row>
  )
}

const SalviaTestStatsComponent = (props: SalviaTestStats) => {
  const [translate] = useTranslation()

  return (
    <div className='test-case-stats'>
      <div className='tests-pages'>
        <SalviaIcon icon='copy' label={translate(`salvia.icon.pages`)} />
        {props.pages}
      </div>
      <div className='tests-passed'>
        <SalviaIcon icon='check' label={translate(`salvia.icon.passed`)} />
        {props.passed}
      </div>
      <div className='tests-warning'>
        <SalviaIcon icon='question' label={translate(`salvia.icon.warning`)} />
        {props.warning}
      </div>
      <div className='tests-failed'>
        <SalviaIcon icon='times' label={translate(`salvia.icon.failed`)} />
        {props.failed}
      </div>
    </div>
  )
}

export default SalviaTestCaseResult
