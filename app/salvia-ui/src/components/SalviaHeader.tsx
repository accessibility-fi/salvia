import { Heading, SkipLink } from 'suomifi-ui-components'
import Localize from './common/Localize'
import LanguageSelector from './LanguageSelector'
import { useTranslation } from 'react-i18next'
import SalviaLogo from './SalviaLogo'

const SalviaHeader = () => {
  const [translate] = useTranslation()
  return (
    <header className='salvia-header'>
      <SkipLink className='skip-to-content screen-reader-text screen-reader-focus' href='#main'>
        {translate('salvia.to-main')}
      </SkipLink>
      <div className='logo-container'>
        <SalviaLogo />
        <Heading variant='h1hero' smallScreen>
          <Localize text='salvia.header' />
        </Heading>
      </div>
      <div className='lang-user-container'>
        <LanguageSelector />
      </div>
    </header>
  )
}

export default SalviaHeader
