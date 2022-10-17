import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

interface LocalizeProps {
  text: string
}

const Localize = (props: LocalizeProps) => {
  const [translate] = useTranslation()

  return <Fragment>{translate(props.text)}</Fragment>
}

export default Localize
