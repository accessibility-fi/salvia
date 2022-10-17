import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { isTestRoute } from './utils'

const SalviaNavBar = () => {
  const [translate] = useTranslation()
  const { pathname } = useLocation()

  return (
    <nav className='salvia-navbar'>
      <NavLink
        to='/'
        className={({ isActive }) =>
          `nav-item nav-link ${isActive || isTestRoute(pathname) ? 'active' : ''}`
        }
        end
      >
        {translate('salvia.home')}
      </NavLink>
      <NavLink to='/completed-tests' className='nav-item nav-link'>
        {translate('salvia.archive')}
      </NavLink>
      <NavLink to='/settings' className='nav-item nav-link'>
        {translate('salvia.settings')}
      </NavLink>
    </nav>
  )
}

export default SalviaNavBar
