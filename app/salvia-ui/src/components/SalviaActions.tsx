import { useNavigate } from 'react-router-dom'
import { Button, IconEdit, IconUpload, IconArrowLeft, IconHistory, IconRegisters } from 'suomifi-ui-components'

import { useTranslation } from 'react-i18next'

type ActionIcon = 'registers' | 'edit' | 'upload' | 'arrowLeft' | 'history'

export type NavigateAction = {
  text: string
  icon: ActionIcon
  path: string
}

const SalviaActionIcon = ({ icon }: { icon: ActionIcon }) => {
    switch (icon) {
        case 'registers': return <IconRegisters />
        case 'edit': return <IconEdit />
        case 'upload': return <IconUpload />
        case 'arrowLeft': return <IconArrowLeft />
        case 'history': return <IconHistory />
        default: return null;

    }
}


const SalviaActions = (actions: NavigateAction[]) => {
  const navigate = useNavigate()

  return (
    <div className='actions'>
      {actions.map((item, index) => (
        <Button
          key={index}
          onClick={() => navigate(`${item.path}`)}
          variant='secondaryLight'
          icon={<SalviaActionIcon icon={item.icon} />}
        >
          {item.text}
        </Button>
      ))}
    </div>
  )
}

export const TestingActions = () => {
  const [translate] = useTranslation()
  const testActions: NavigateAction[] = [
    { text: translate('salvia.completed-tests'), icon: 'history', path: `/completed-tests` },
  ]

  return SalviaActions(testActions)
}

export default SalviaActions
