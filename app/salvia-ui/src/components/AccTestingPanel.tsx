import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Localize from './common/Localize'
import { isEmpty, startsWith } from 'rambda'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import {
  selectPages,
  selectStatus,
  crawlDomain,
  resetCrawler,
} from '../redux/reducers/crawler/crawlerSlice'
import AccTestingPages from './AccTestingPages'
import SalviaLoader from './common/SalviaLoader'
import { Viewport } from '../types/SalviaTest'
import i18n from '../i18n'
import { Helmet } from 'react-helmet-async'
import {
  Block,
  Button,
  Dropdown,
  DropdownItem,
  Heading,
  Paragraph,
  RadioButton,
  RadioButtonGroup,
  TextInput,
} from 'suomifi-ui-components'
import CrawlerFailed from './CrawlerFailed'
import { validateURL } from './utils'

const AccTestingPanel = () => {
  const [url, setURL] = useState('')
  const [depth, setDepth] = useState(2)
  const [width, setWidth] = useState(20)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [activePage, setActivePage] = useState('test')

  const [translate] = useTranslation()

  const pages = useAppSelector(selectPages)
  const loading = useAppSelector(selectStatus) === 'loading' ? true : false
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStatus)
  const [validURL, setValidURL] = useState(true)

  const isValidURL = () => {
    return !isEmpty(url) && startsWith('http', url)
  }

  const resetValues = () => {
    setURL('')
    setDepth(2)
    setWidth(20)
    setViewport('desktop')
    dispatch(resetCrawler())
    setActivePage('test')
  }

  const crawl = () => {
    setActivePage('crawler')
    dispatch(crawlDomain({ url: url, depth: depth, width: width, viewport: viewport }))
  }

  const isFailed = () => {
    return status === 'failed'
  }

  const headerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (headerRef && headerRef.current) {
      headerRef.current.focus()
    }
  }, [activePage])

  return (
    <Fragment>
      <Helmet>
        <title lang={i18n.language}>{translate('salvia.automatic-testing')}</title>
      </Helmet>
      {loading ? (
        <SalviaLoader text={translate('salvia.crawling-loader')} />
      ) : isFailed() ? (
        <CrawlerFailed resetValues={resetValues} />
      ) : isEmpty(pages) || activePage === 'test' ? (
        <Block margin='l' className='acc-testing-panel salvia-panel'>
          {/* <TestingActions/>*/}
          <Heading variant='h2' className='testing-info' tabIndex={-1} ref={headerRef}>
            <Localize text='salvia.automatic-testing' />
          </Heading>
          <Paragraph marginBottomSpacing='s' className='testing-info'>
            <Localize text='salvia.testing-info' />
          </Paragraph>

          <div className='salvia-testing-form' data-testid='salvia-testing-form'>
            <form className='salvia-form'>
              <div className='form-row'>
                <TextInput
                  fullWidth
                  className='form-group'
                  labelText={translate('salvia.url')}
                  value={url}
                  onChange={(value) => setURL(value?.toString() ?? '')}
                  visualPlaceholder={translate('salvia.enter-url')}
                  hintText={translate('salvia.url-tooltip')}
                  wrapperProps={{ style: { maxWidth: '400px' } }}
                  statusText={!validURL ? translate('salvia.invalid-url') : undefined}
                  status={!validURL ? 'error' : 'default'}
                  onBlur={() => setValidURL(validateURL(url))}
                />
              </div>

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

              <Dropdown
                value={`${depth}`}
                name='depth'
                visualPlaceholder={translate('salvia.depth')}
                labelText={translate('salvia.depth')}
                onChange={(value) => setDepth(parseInt(value))}
                className='form-group'
              >
                {Array.from(Array(5).keys()).map((item) => (
                  <DropdownItem key={item + 1} value={`${item + 1}`}>
                    {item + 1}
                  </DropdownItem>
                ))}
              </Dropdown>

              <TextInput
                className='form-group'
                labelText={translate('salvia.width')}
                type='number'
                value={width}
                onChange={(value) => setWidth(value ? parseInt(value?.toString()) : 20)}
                hintText={translate('salvia.width-tooltip')}
                statusText={width <= 0 ? translate('salvia.invalid-value') : ''}
                status={width >= 0 ? 'default' : 'error'}
              />

              <div className='form-row'>
                <Button
                  id='salvia-start-crawl'
                  className='salvia-button'
                  disabled={!isValidURL() || width <= 0 || depth <= 0}
                  onClick={() => crawl()}
                >
                  {translate('salvia.start')}
                </Button>
              </div>
            </form>
          </div>
        </Block>
      ) : (
        <AccTestingPages
          domain={url}
          urls={pages}
          viewport={viewport}
          resetValues={resetValues}
          back={() => setActivePage('test')}
        />
      )}
    </Fragment>
  )
}

export default AccTestingPanel
