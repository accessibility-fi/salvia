import AccTestingArchive from './AccTestingArchive'
import SalviaSettingsPanel from './SalviaSettingsPanel'
import CreateSalviaTest from './CreateSalviaTest'
import SalviaHeader from './SalviaHeader'
import SalviaNavBar from './SalviaNavBar'
import { Route, Routes } from 'react-router-dom'
import SalviaHome from './SalviaHome'
import AccTestingPanel from './AccTestingPanel'
import SalviaFooter from './SalviaFooter'

const SalviaContainer = () => {
  return (
    <div className='salvia-container'>
      <SalviaHeader />
      <SalviaNavBar />
      <main id='main' role='main'>
        <Routes>
          <Route path='/' element={<SalviaHome />} />
          <Route path='completed-tests' element={<AccTestingArchive />} />
          <Route path='test' element={<AccTestingPanel />} />
          <Route path='create-test' element={<CreateSalviaTest />} />
          <Route path='settings' element={<SalviaSettingsPanel />} />
        </Routes>
      </main>
      <SalviaFooter />
    </div>
  )
}

export default SalviaContainer
