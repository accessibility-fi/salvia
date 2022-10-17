import { useNavigate } from 'react-router-dom'
import { Button } from 'suomifi-ui-components'
import { useTranslation } from 'react-i18next'

export type NavigateAction = {
  text: string
  icon: 'registers' | 'edit' | 'upload' | 'arrowLeft' | 'history'
  path: string
}

const SalviaActions = (actions: NavigateAction[]) => {
  const navigate = useNavigate()

  return (
    <div className='actions'>
      {actions.map((item, index) => (
        <Button
          key={index}
          onClick={() => navigate(`${item.path}`)}
          variant='link'
          icon={item.icon}
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
