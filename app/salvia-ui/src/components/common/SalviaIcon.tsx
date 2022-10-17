import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SalviaIcon = ({ icon, label }: { icon: IconName; label: string }) => (
  <span className='salvia-icon'>
    <FontAwesomeIcon icon={['fas', icon]} title={label} />
  </span>
)

export default SalviaIcon
