import { Route, Routes } from 'react-router-dom'
import './index.css'

import Professores from './components/professores'


function App() {
  return (
    <Routes>
      <Route path="/turmas" element={
        <><h1>tuemas</h1></>
      } />
      <Route path="/professores" element={<Professores />} />
      {/* <Route path="/locais" element={<Locais />} /> */}
    </Routes>  
  )
}

export default App
