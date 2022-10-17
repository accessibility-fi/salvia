import { useTranslation } from 'react-i18next'
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalTitle,
  Paragraph,
  Text,
} from 'suomifi-ui-components'

const SalviaDownloadModal = ({ visible, hide }: { visible: boolean; hide: () => void }) => {
  const [translate] = useTranslation()

  return (
    <Modal appElementId='root' visible={visible} scrollable={false} onEscKeyDown={() => hide()}>
      <ModalContent className='salvia-modal'>
        <ModalTitle>{translate('salvia.wait-report-title')}</ModalTitle>

        <Paragraph>
          <Text>{translate('salvia.wait-report')}</Text>
        </Paragraph>
      </ModalContent>
      <ModalFooter>
        <Button className='salvia-button' onClick={() => hide()}>
          OK
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default SalviaDownloadModal
