import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Localize from './common/Localize'
import { isEmpty, includes } from 'rambda'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { selectStatus, selectTests, getTests } from '../redux/reducers/salvia/salviaSlice'
import {
  selectShowDownloadModal,
  showDownloadModal,
  selectShowErrorModal,
  showErrorModal,
} from '../redux/reducers/report/reportSlice'
import SalviaLoader from './common/SalviaLoader'
import SalviaTestResult from './SalviaTestResult'
import { Block, Heading, SearchInput, VisuallyHidden } from 'suomifi-ui-components'
import { Helmet } from 'react-helmet-async'
import i18n from '../i18n'
import SalviaDownloadModal from './SalviaDownloadModal'
import SalviaReportErrorModal from './SalviaReportErrorModal'

const AccTestingArchive = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [translate] = useTranslation()

  const tests = useAppSelector(selectTests)
  const loading = useAppSelector(selectStatus) === 'loading' ? true : false
  const dispatch = useAppDispatch()
  const downloadModalShow = useAppSelector(selectShowDownloadModal)
  const errorModalShow = useAppSelector(selectShowErrorModal)

  useEffect(() => {
    dispatch(getTests())
  }, [dispatch])

  return (
    <Fragment>
      <Helmet>
        <title lang={i18n.language}>{translate('salvia.archive')}</title>
      </Helmet>
      {loading ? (
        <SalviaLoader text={translate('salvia.archive-loader')} />
      ) : (
        <Block margin='l' className='acc-results-panel salvia-panel'>
          <Heading variant='h2' className='testing-info'>
            {translate('salvia.completed-tests')} ({tests.length})
          </Heading>
          {!isEmpty(tests) ? (
            <>
              <div className='search-tests'>
                <SearchInput
                  clearButtonLabel={translate('salvia.icon.clear')}
                  labelText={translate('salvia.search-tooltip')}
                  searchButtonLabel={translate('salvia.icon.search')}
                  visualPlaceholder={translate('salvia.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.toString() ?? '')}
                />
              </div>

              <VisuallyHidden role='region' aria-live='polite'>
                {!isEmpty(searchTerm)
                  ? tests.filter((item) => includes(searchTerm, item.domain)).length
                  : tests.length}
                {translate('salvia.n-testresults')}
              </VisuallyHidden>

              <div className='salvia-tests'>
                {Array.isArray(tests) &&
                  tests &&
                  tests.map((item) => (
                    <Fragment key={item.id}>
                      {(isEmpty(searchTerm) || includes(searchTerm, item.domain)) && (
                        <SalviaTestResult {...item} />
                      )}
                    </Fragment>
                  ))}
              </div>

              <SalviaDownloadModal
                visible={downloadModalShow}
                hide={() => dispatch(showDownloadModal(false))}
              />

              <SalviaReportErrorModal
                visible={errorModalShow}
                hide={() => dispatch(showErrorModal(false))}
              />
            </>
          ) : (
            <div className='salvia-message'>
              <Localize text='salvia.no-tests-found' />
            </div>
          )}
        </Block>
      )}
    </Fragment>
  )
}

export default AccTestingArchive
