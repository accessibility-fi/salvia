import { useTranslation } from 'react-i18next'
import FadeLoader from 'react-spinners/FadeLoader'
import { suomifiDesignTokens, Text } from 'suomifi-ui-components'
import { useEffect, useRef } from 'react'

interface LoaderProps {
  text?: string
}

const SalviaLoader = (props: LoaderProps) => {
  const [translate] = useTranslation()
  const msgRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (msgRef && msgRef.current) {
      msgRef.current.focus()
    }
  }, [])

  return (
    <div className='salvia-loader'>
      <FadeLoader loading={true} color={suomifiDesignTokens.colors.accentTertiaryDark1} />
      <p tabIndex={-1} ref={msgRef}>
        <Text>{props.text ?? translate('salvia.loading')}</Text>
      </p>
    </div>
  )
}

export default SalviaLoader
