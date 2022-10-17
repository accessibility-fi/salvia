import { useEffect, useRef } from 'react'
import { useAppSelector } from '../redux/hooks'
import { selectResponse } from '../redux/reducers/qualweb/qualwebSlice'
import { useTranslation } from 'react-i18next'
import { Block, Button, Text } from 'suomifi-ui-components'

const TestingCompleted = ({ resetTest }: { resetTest: () => void }) => {
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
    <Block margin='l'>
      <div className='salvia-message'>
        <p tabIndex={-1} ref={msgRef}>
          <Text>
            {isSuccess() ? translate('salvia.qualweb-success') : translate('salvia.qualweb-failed')}
          </Text>
        </p>

        <Button id='salvia-reset-test' className='salvia-button' onClick={() => resetTest()}>
          Ok
        </Button>
      </div>
    </Block>
  )
}

export default TestingCompleted
