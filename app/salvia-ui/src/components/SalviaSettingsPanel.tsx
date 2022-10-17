import Localize from './common/Localize'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { useTranslation } from 'react-i18next'
import { selectReportSettings, setLanguage } from '../redux/reducers/settings/settingsSlice'
import i18n from '../i18n'
import { Helmet } from 'react-helmet-async'
import { Block, Heading, RadioButton, RadioButtonGroup } from 'suomifi-ui-components'

const SalviaSettingsPanel = () => {
  const reportSettings = useAppSelector(selectReportSettings)

  const dispatch = useAppDispatch()

  const [translate] = useTranslation()

  const reportLanguages = reportSettings.languages
  const language = reportSettings.language

  return (
    <>
      <Helmet>
        <title lang={i18n.language}>{translate('salvia.settings')}</title>
      </Helmet>
      <Block margin='l' className='salvia-settings-panel salvia-panel'>
        <Heading variant='h2'>
          <Localize text='salvia.settings' />
        </Heading>

        <div className='report-settings salvia-settings'>
          <form className='salvia-form'>
            <div className='report-language-settings'>
              <RadioButtonGroup
                labelText={translate('salvia.report-settings')}
                name='report-settings'
                value={language}
              >
                {reportLanguages.map((item) => (
                  <RadioButton key={item} value={item} onChange={() => dispatch(setLanguage(item))}>
                    {translate(`salvia.${item}`)}
                  </RadioButton>
                ))}
              </RadioButtonGroup>
            </div>
          </form>
        </div>
      </Block>
    </>
  )
}

export default SalviaSettingsPanel
