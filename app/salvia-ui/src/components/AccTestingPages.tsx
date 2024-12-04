import { Fragment, useEffect, useState, useRef } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Localize from './common/Localize'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { createTest, selectStatus, resetQualweb } from '../redux/reducers/qualweb/qualwebSlice'
import SalviaLoader from './common/SalviaLoader'
import { useTranslation } from 'react-i18next'
import { getTests } from '../redux/reducers/salvia/salviaSlice'
import { formatDomain, normalizeUrl } from './utils'
import { isEmpty } from 'rambda'
import { Viewport } from '../types/SalviaTest'
import {
  Block,
  Button,
  Checkbox,
  Expander,
  ExpanderContent,
  ExpanderTitleButton,
  Heading,
  IconArrowLeft,
  Paragraph,
} from 'suomifi-ui-components'
import urljoin from 'url-join'
import CustomTextInput from './common/CustomTextInput'
import TestingCompleted from './TestingCompleted'

interface AccTestingPagesProps {
  domain: string
  urls: string[]
  viewport: Viewport
  resetValues: () => void
  back: () => void
}

const AccTestingPages = (props: AccTestingPagesProps) => {
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const [addedPages, setAddedPages] = useState<string[]>([])

  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const [translate] = useTranslation()

  const isLoading = () => {
    return status === 'loading'
  }

  const isReady = () => {
    return status === 'ready'
  }

  const resetTest = () => {
    props.resetValues()
    dispatch(resetQualweb())
  }

  const runTest = async () => {
    await dispatch(
      createTest({
        domain: props.domain,
        urls: selectedPages,
        viewport: props.viewport,
        user: undefined,
      }),
    )
    dispatch(getTests())
  }

  const isAdded = (item: string) => {
    const fullURL = normalizeUrl(item.startsWith('http') ? item : urljoin(props.domain, item))
    return props.urls.includes(fullURL) || addedPages.includes(fullURL)
  }

  const headerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (headerRef && headerRef.current) {
      headerRef.current.focus()
    }
  }, [])

  return (
    <Fragment>
      {isLoading() ? (
        <SalviaLoader text={translate('salvia.start-testing-loader')} />
      ) : (
        <Fragment>
          {' '}
          {isReady() ? (
            <TestingCompleted resetTest={resetTest} />
          ) : (
            <Block margin='l' className='acc-testing-pages salvia-panel'>
              <Heading variant='h2' className='testing-info' tabIndex={-1} ref={headerRef}>
                <Localize text='salvia.automatic-testing' />
              </Heading>
              <Paragraph mb='s' className='testing-info'>
                <Localize text='salvia.testing-pages-info' />
              </Paragraph>

              <div className='salvia-testing-pages-form' data-testid='salvia-testing-pages-form'>
                <form className='salvia-form'>
                  <div className='salvia-row'>
                    <div className='selected-pages col-6' aria-live='polite'>
                      <Localize text='salvia.selected-pages' />
                      <span className='highlight'>
                        {' '}
                        {selectedPages.length} / {props.urls.length + addedPages.length}
                      </span>
                    </div>
                    <Button
                      id='salvia-start-testing'
                      className='salvia-button'
                      disabled={selectedPages.length === 0}
                      onClick={() => runTest()}
                    >
                      <Localize text='salvia.start' />
                    </Button>
                  </div>

                  {props.urls.map((item, index) => (
                    <Checkbox
                      id={`testing-url-${index}`}
                      key={index}
                      checked={selectedPages.includes(item)}
                      onClick={() =>
                        setSelectedPages((prevPages) =>
                          !prevPages.includes(item)
                            ? prevPages.concat(item)
                            : prevPages.filter((i) => item !== i),
                        )
                      }
                    >
                      {item}
                    </Checkbox>
                  ))}

                  {addedPages.map((item, index) => (
                    <Checkbox
                      id={`added-url-${index}`}
                      key={index}
                      checked={selectedPages.includes(item)}
                      onClick={() =>
                        setSelectedPages((prevPages) =>
                          !prevPages.includes(item)
                            ? prevPages.concat(item)
                            : prevPages.filter((i) => item !== i),
                        )
                      }
                    >
                      {item}
                    </Checkbox>
                  ))}

                  <Checkbox
                    id={`select-all`}
                    onClick={({ checkboxState }) =>
                      checkboxState
                        ? setSelectedPages(props.urls.concat(addedPages))
                        : setSelectedPages([])
                    }
                    defaultChecked={false}
                    checked={selectedPages.length === props.urls.length + addedPages.length}
                  >
                    {translate('salvia.select-all')}
                  </Checkbox>

                  <AddTestPage
                    addPage={(item: string) =>
                      setAddedPages((prevPages) =>
                        !prevPages.includes(item) && !props.urls.includes(item)
                          ? [...prevPages, item]
                          : prevPages,
                      )
                    }
                    isAdded={(item) => isAdded(item)}
                    domain={props.domain}
                  />

                   <Button variant='secondaryLight' icon={<IconArrowLeft />} onClick={() => props.back()}>
                    {translate('salvia.back-to-test')}
                  </Button>
                </form>
              </div>
            </Block>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

interface AddPageProps {
  addPage: (item: string) => void
  isAdded: (item: string) => boolean
  domain: string
}

const AddTestPage = (props: AddPageProps) => {
  const [url, setURL] = useState('')
  const [open, setOpen] = useState(false)
  const [translate] = useTranslation()

  const addPage = (item: string) => {
    props.addPage(normalizeUrl(item.startsWith('http') ? item : urljoin(props.domain, item)))
    setOpen(false)
    setURL('')
  }

  return (
    <div className='add-page-panel'>
      <Expander
        open={open}
        onOpenChange={(open) => {
          setOpen(!open)
        }}
      >
        <ExpanderTitleButton asHeading='h3'>{translate('salvia.add-page')}</ExpanderTitleButton>
        <ExpanderContent>
          <Container>
            <Row className='form-row'>
              <Col xs={12} lg={6}>
                <CustomTextInput
                  id='add-page-url'
                  labelText={translate('salvia.test-page-url')}
                  hintText={translate('salvia.add-page-tooltip')}
                  prepend={formatDomain(props.domain)}
                  value={url}
                  onChange={(value) => setURL(value?.toString() ?? '')}
                  statusText={props.isAdded(url) ? translate('salvia.is-added') : undefined}
                />
              </Col>
            </Row>
            <div>
              <Button
                id='salvia-add-page'
                className='salvia-button'
                disabled={isEmpty(url) || props.isAdded(url)}
                onClick={() => addPage(url)}
              >
                <Localize text='salvia.add-page' />
              </Button>
            </div>
          </Container>
        </ExpanderContent>
      </Expander>
    </div>
  )
}

export default AccTestingPages
