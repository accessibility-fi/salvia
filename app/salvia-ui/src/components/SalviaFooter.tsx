import { useTranslation } from 'react-i18next'
import i18n from '../i18n'

const SalviaFooter = () => {
  const [translate] = useTranslation()
  return (
    <footer className='salvia-footer'>
      <div>
        <a
          className='nav-item'
          target='_blank'
          rel='noreferrer'
          href={`/accessibility_statement_${i18n.language ?? 'fi'}.html`}
        >
          {translate('salvia.accessibility-statement')}
        </a>
      </div>
    </footer>
  )
}

export default SalviaFooter
