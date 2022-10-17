import './styles/common.scss'
import SalviaContainer from './components/SalviaContainer'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faAngleDown,
  faAngleRight,
  faCheck,
  faChevronDown,
  faChevronRight,
  faSearch,
  faTimes,
  faCopy,
  faExclamation,
  faPlus,
  faCogs,
  faArrowLeft,
  faMobileAlt,
  faDesktop,
  faBars,
  faUser,
  faQuestion,
} from '@fortawesome/free-solid-svg-icons'
import { suomifiDesignTokens, SuomifiThemeProvider } from 'suomifi-ui-components'
import {
  accentTertiaryLight1,
  accentTertiaryLight2,
  accentTertiaryLight3,
  accentTertiaryLight4,
} from './types/constants'

library.add(
  faSearch,
  faAngleRight,
  faAngleDown,
  faChevronRight,
  faChevronDown,
  faCheck,
  faTimes,
  faCopy,
  faExclamation,
  faPlus,
  faCogs,
  faArrowLeft,
  faMobileAlt,
  faDesktop,
  faBars,
  faUser,
  faQuestion,
)

function App() {
  const customTheme = {
    gradients: {
      highlightBaseToHighlightDark1: `linear-gradient(0deg, ${suomifiDesignTokens.colors.accentTertiaryDark1} 0%, ${suomifiDesignTokens.colors.accentTertiary} 100%)`,
      highlightLight1ToHighlightBase: `linear-gradient(0deg, ${suomifiDesignTokens.colors.accentTertiary} 0%, ${accentTertiaryLight1} 100%)`,
      depthSecondaryToDepthSecondaryDark1: `linear-gradient(0deg, ${accentTertiaryLight3}, ${accentTertiaryLight4})`,
    },
    colors: {
      highlightDark1: suomifiDesignTokens.colors.accentTertiaryDark1,
      highlightBase: suomifiDesignTokens.colors.accentTertiary,
      highlightLight1: accentTertiaryLight1, //hsl(284, 36%, 60%)
      highlightLight2: accentTertiaryLight2, //hsl(284, 36%, 70%)
      highlightLight3: accentTertiaryLight3, //hsl(284, 36%, 95%)
      highlightLight4: accentTertiaryLight4, //hsl(284, 36%, 98%)
      depthSecondary: accentTertiaryLight4,
      depthSecondaryDark1: accentTertiaryLight3,
    },
  }
  return (
    <SuomifiThemeProvider theme={customTheme}>
      <div className='container-white'>
        <BrowserRouter>
          <SalviaContainer />
        </BrowserRouter>
      </div>
    </SuomifiThemeProvider>
  )
}

export default App
