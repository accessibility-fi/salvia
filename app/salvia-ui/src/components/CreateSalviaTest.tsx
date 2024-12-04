import { Fragment, useEffect, useRef, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {
  Block,
  Button,
  Heading,
  Link,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  Text,
  TextInput,
  VisuallyHidden,
} from 'suomifi-ui-components'
import { useTranslation } from 'react-i18next'
import Localize from './common/Localize'
import { isEmpty, omit, startsWith } from 'rambda'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { selectStatus, createTest, resetTest } from '../redux/reducers/salvia/testSlice'
import SalviaLoader from './common/SalviaLoader'
import AddTestResult, { TestResult } from './AddTestResult'
import { ACTRule, PageReport, ReportMetadata, SuccessCriteria, Viewport } from '../types/SalviaTest'
import { formatDate, validateURL } from './utils'
import { getTests } from '../redux/reducers/salvia/salviaSlice'
import { Helmet } from 'react-helmet-async'
import i18n from '../i18n'
import CreateTestReady from './CreateTestReady'

const CreateSalviaTest = () => {
  const [domain, setDomain] = useState('')
  const [validURL, setValidURL] = useState(true)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [, setReport] = useState<Record<string, unknown>>({})
  const [addedTestResults, setAddedTestResults] = useState<TestResult[]>([])

  const [translate] = useTranslation()

  const loading = useAppSelector(selectStatus) === 'loading' ? true : false
  const status = useAppSelector(selectStatus)

  const dispatch = useAppDispatch()
  const headerRef = useRef<HTMLHeadingElement>(null)
  const [completed, setCompleted] = useState<boolean>(false)

  const resetValues = () => {
    setDomain('')
    setViewport('desktop')
    setAddedTestResults([])
    setReport({})
    setCompleted(true)
  }

  useEffect(() => {
    if (headerRef && headerRef.current) {
      headerRef.current.focus()
    }
  }, [completed])

  const addTestResult = (testResult: TestResult) => {
    if (addedTestResults.some((item) => item.url === testResult.url)) {
      testResult.uniqueUrl =
        testResult.url + '_' + addedTestResults.filter((item) => item.url === testResult.url).length
    }

    setAddedTestResults(addedTestResults.concat(testResult))
  }

  const isValidURL = () => {
    return !isEmpty(domain) && startsWith('http', domain)
  }

  const isReady = () => {
    return status === 'ready'
  }

  const resetCreateTest = () => {
    resetValues()
    dispatch(resetTest())
  }

  const createTestCase = async () => {
    const data: Record<string, PageReport> = {}

    addedTestResults.forEach((item) => {
      const url = item.url
      const uniqueUrl = item.uniqueUrl ?? url
      const report = item.report
      const metadata = report.summary
      const filteredRules = filterRules(report.act, metadata)
      data[uniqueUrl] = {
        type: 'manual_evaluation',
        system: {
          name: 'salvia',
          description:
            'This report in generated with Salvia using qualweb-extension reports provided by user',
          date: formatDate(new Date()),
          url: {
            inputUrl: url,
            description: item.description,
          },
          page: {
            viewport: {
              mobile: viewport === 'mobile',
              landscape: viewport === 'desktop',
              resolution: {
                width: viewport === 'mobile' ? 360 : 1920,
                height: viewport === 'mobile' ? 800 : 1080,
              },
            },
          },
        },
        metadata: filteredRules.metadata,
        modules: {
          'act-rules': {
            type: 'act-rules',
            metadata: filteredRules.metadata,
            assertions: filteredRules.assertions,
          },
        },
      }

      setReport(data)
    })

    await dispatch(
      createTest({
        test: { domain: domain, viewport: viewport, report: data },
        userInfo: undefined,
      }),
    )

    dispatch(getTests())
  }

  const filterRules = (act: Record<string, ACTRule>, metadata: ReportMetadata) => {
    const levelAAAItems: string[] = []
    Object.entries(act).forEach(([key, rule]) => {
      if (isAAALevelOnly(rule.metadata['success-criteria'])) {
        levelAAAItems.push(key)
        switch (rule.metadata.outcome) {
          case 'inapplicable':
            metadata.inapplicable = metadata.inapplicable - 1
            break
          case 'passed':
            metadata.passed = metadata.passed - 1
            break
          case 'failed':
            metadata.failed = metadata.failed - 1
            break
          case 'warning':
            metadata.warning = metadata.warning - 1
            break
        }
      }
    })

    return { assertions: omit(levelAAAItems, act), metadata: metadata }
  }

  const isAAALevelOnly = (sc: SuccessCriteria[]) => {
    const filtered = sc.filter((item) => item.level === 'AAA')
    return sc.length === 0 || sc.length === filtered?.length
  }

  return (
    <Fragment>
      <Helmet>
        <title lang={i18n.language}>{translate('salvia.manual-testing')}</title>
      </Helmet>
      {loading ? (
        <SalviaLoader text={translate('salvia.save-test')} />
      ) : (
        <Block margin='l' className='acc-testing-panel salvia-panel'>
          {isReady() ? (
            <CreateTestReady resetTest={resetCreateTest} />
          ) : (
            <>
              <Heading variant='h2' className='testing-info' tabIndex={-1} ref={headerRef}>
                <Localize text='salvia.manual-testing' />
              </Heading>
              <Paragraph mb='s' className='testing-info'>
                <Localize text='salvia.create-test-info' />
              </Paragraph>

              <Container className='salvia-testing-form' data-testid='salvia-testing-form'>
                <form className='salvia-form'>
                  <Row className='form-row'>
                    <Col xs={12} lg={6}>
                      <TextInput
                        fullWidth
                        labelText={translate('salvia.url')}
                        value={domain}
                        onChange={(value) => setDomain(value?.toString() ?? '')}
                        visualPlaceholder={translate('salvia.enter-url')}
                        hintText={translate('salvia.url-tooltip')}
                        statusText={!validURL ? translate('salvia.invalid-url') : undefined}
                        status={!validURL ? 'error' : 'default'}
                        onBlur={() => setValidURL(validateURL(domain))}
                      />
                    </Col>
                  </Row>

                  <RadioButtonGroup
                    labelText={translate('salvia.select-viewport')}
                    name='select-viewport'
                    value={viewport}
                    className='select-viewport'
                  >
                    <RadioButton value='desktop' onChange={() => setViewport('desktop')}>
                      {translate('salvia.desktop')}
                    </RadioButton>
                    <RadioButton value='mobile' onChange={() => setViewport('mobile')}>
                      {translate('salvia.mobile')}
                    </RadioButton>
                  </RadioButtonGroup>

                  {addedTestResults && addedTestResults.length > 0 && (
                    <div className='salvia-test-results'>
                      <Heading variant='h3' className='salvia-title' smallScreen>
                        <Localize text='salvia.added-test-results' />
                      </Heading>
                      <VisuallyHidden role='region' aria-live='polite'>
                        {addedTestResults.length > 0 ? (
                          <>
                            {addedTestResults.length} {translate('salvia.n-added-test-reports')}
                          </>
                        ) : (
                          ''
                        )}
                      </VisuallyHidden>

                      <ul className='salvia-list'>
                        {addedTestResults.map((item, index) => (
                          <li key={index}>
                            <Row key={index} className='salvia-test-result'>
                              <Col xs={12} lg={6}>
                                <Text>
                                  {item.title}{' '}
                                  {item.description !== '' && <span>({item.description})</span>}
                                </Text>
                                <div className='test-result-url'>
                                  <Link href={item.url} target='_blank'>
                                    {item.url}
                                  </Link>
                                </div>
                              </Col>
                              <Col xs={12} lg={2}>
                                {item.filename}
                              </Col>
                              <Col xs={6} lg={2}>
                                <Button
                                  id='remove-selected-file'
                                  className='salvia-button'
                                  onClick={() =>
                                    setAddedTestResults(
                                      addedTestResults.filter((it) => it.url !== item.url),
                                    )
                                  }
                                >
                                  <Localize text='salvia.remove-file' />
                                </Button>
                              </Col>
                            </Row>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <AddTestResult domain={domain} addTestResult={addTestResult} />

                  <Row className='form-row'>
                    <Col xs={12} lg={6}>
                      <Button
                        id='salvia-create-test'
                        className='salvia-button'
                        disabled={!isValidURL() || addedTestResults.length < 1}
                        onClick={() => createTestCase()}
                      >
                        <Localize text='salvia.create-test' />
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Container>
            </>
          )}
        </Block>
      )}
    </Fragment>
  )
}

export default CreateSalviaTest
