import { Block } from 'suomifi-ui-components'
import SalviaNavItem from './SalviaNavItem'
import Col from 'react-bootstrap/Col'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import i18n from '../i18n'

const SalviaHome = () => {
  const [translate] = useTranslation()
  return (
    <>
      <Helmet>
        <title lang={i18n.language}>{translate('salvia.header')}</title>
      </Helmet>
      <Block className='salvia-panel' variant='section' padding='xs'>
        <Col xs={12} lg={6}>
          <SalviaNavItem
            icon='book'
            label={translate('salvia.home.qualweb-testing')}
            path={'/test'}
          />
          <SalviaNavItem
            icon='book'
            label={translate('salvia.home.manual-testing')}
            path={'/create-test'}
          />
        </Col>
      </Block>
    </>
  )
}

export default SalviaHome
