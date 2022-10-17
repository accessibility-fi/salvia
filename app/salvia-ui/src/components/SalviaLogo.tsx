import { ReactComponent as SalviaLogoIcon } from '../images/salvia-logo.svg'
import { Link } from 'react-router-dom'

const SalviaLogo = () => {
  return (
    <Link to={'/'} className='salvia-logo'>
      <SalviaLogoIcon title='Salvia logo' className='salvia-logo' />
    </Link>
  )
}

export default SalviaLogo
