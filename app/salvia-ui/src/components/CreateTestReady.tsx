import { useEffect, useRef } from 'react'
import { useAppSelector } from '../redux/hooks'
import { useTranslation } from 'react-i18next'
import { Button, Text } from 'suomifi-ui-components'
import { selectResponse } from '../redux/reducers/salvia/testSlice'

const CreateTestReady = ({ resetTest }: { resetTest: () => void }) => {
  const response = useAppSelector(selectResponse)
  const [translate] = useTranslation()
  const msgRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (msgRef && msgRef.current) {
      msgRef.current.focus()
    }
  }, [])

  const isSuccess = () => {
    return response === 'ok'
  }

  return (
    <div className='salvia-message'>
      <p tabIndex={-1} ref={msgRef}>
        <Text>
          {isSuccess()
            ? translate('salvia.save-test-success')
            : translate('salvia.save-test-failed')}
        </Text>
      </p>

      <Button id='salvia-reset-test' className='salvia-button' onClick={() => resetTest()}>
        Ok
      </Button>
    </div>
  )
}

export default CreateTestReady
