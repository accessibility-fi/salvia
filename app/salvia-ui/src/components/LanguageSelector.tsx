import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Block, LanguageMenu, LanguageMenuItem } from 'suomifi-ui-components'
import i18n from '../i18n'

const LanguageSelector = () => {
  const [translate] = useTranslation()

  return (
    <>
      <Helmet htmlAttributes={{ lang: i18n.language }}>
        <title lang={i18n.language}>{translate('salvia.title')}</title>
      </Helmet>
      <Block margin='xxs'>
        <LanguageMenu name={i18n.language.toUpperCase()} className='language-container'>
          <LanguageMenuItem
            onSelect={() => i18n.changeLanguage('fi')}
            selected={i18n.language === 'fi'}
          >
            Suomeksi (FI)
          </LanguageMenuItem>

          <LanguageMenuItem
            onSelect={() => i18n.changeLanguage('en')}
            selected={i18n.language === 'en'}
          >
            In English (EN)
          </LanguageMenuItem>

          <LanguageMenuItem
            onSelect={() => i18n.changeLanguage('sv')}
            selected={i18n.language === 'sv'}
          >
            På Svenska (SV)
          </LanguageMenuItem>
        </LanguageMenu>
      </Block>
    </>
  )
}

export default LanguageSelector
