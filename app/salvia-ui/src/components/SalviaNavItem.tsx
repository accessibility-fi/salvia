import { suomifiDesignTokens, Text, IconRegister, IconBook, IconFolder, IconCogwheel, IconFileCabinet, IconCatalog } from 'suomifi-ui-components'
import { default as styled } from 'styled-components'
import { Link } from 'react-router-dom'
import { StaticIconProps } from 'suomifi-icons'


type SalviaIconType = "register" | "folder" | "book" | "settings" | "catalog" | "archive"
type SalviaIconProps = StaticIconProps & {
    icon: SalviaIconType
}
const SalviaIcon = styled((props: SalviaIconProps) => {
    switch (props.icon) {

        case "register": return <IconRegister {...props} />
        case "folder": return <IconFolder {...props} />
        case "book": return <IconBook  {...props} />
        case "settings": return <IconCogwheel  {...props} />
        case "catalog": return <IconCatalog {...props} />
        case "archive": return <IconFileCabinet {...props} />
        default: return null
    }
})({
    height: '150px',
    width: 'auto',
    margin: `${suomifiDesignTokens.spacing.xs} 0 0 0`,
})

const SalviaNavItem = ({ icon, label, path }: { icon: SalviaIconType, label: string, path: string }) => (
  <Link to={path} className='salvia-nav'>
    <SalviaIcon
      icon={icon}
      ariaLabel={label}
      highlightColor={suomifiDesignTokens.colors.accentTertiaryDark1}
      mousePointer
      className="salvia-icon"
    />
    <Text variant='bold'>{label}</Text>
  </Link>
)

export default SalviaNavItem
