import { StaticIcon, suomifiDesignTokens, Text } from 'suomifi-ui-components'
import { default as styled } from 'styled-components'
import { Link } from 'react-router-dom'

const StyledStaticIcon = styled((props) => <StaticIcon {...props} />)({
  height: '150px',
  width: 'auto',
  margin: `${suomifiDesignTokens.spacing.xs} 0 0 0`,
})

const SalviaNavItem = ({ icon, label, path }: { icon: string; label: string; path: string }) => (
  <Link to={path} className='salvia-nav'>
    <StyledStaticIcon
      icon={icon}
      ariaLabel={label}
      highlightColor={suomifiDesignTokens.colors.accentTertiaryDark1}
      //baseColor={suomifiDesignTokens.colors.accentTertiary}
      mousePointer
    />
    <Text variant='bold'>{label}</Text>
  </Link>
)

export default SalviaNavItem
