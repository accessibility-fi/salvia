import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text } from 'suomifi-ui-components'

const CrawlerFailed = ({ resetValues }: { resetValues: () => void }) => {
  const [translate] = useTranslation()
  const msgRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (msgRef && msgRef.current) {
      msgRef.current.focus()
    }
  }, [])

  return (
    <div className='salvia-message'>
      <p tabIndex={-1} ref={msgRef}>
        <Text>{translate('salvia.crawler-failed')}</Text>
      </p>

      <Button id='salvia-reset-test' className='salvia-button' onClick={() => resetValues()}>
        Ok
      </Button>
    </div>
  )
}

export default CrawlerFailed
