import { Route, Routes } from 'react-router-dom'
import './index.css'

import Professores from './components/professores'
import Turmas from './components/turma'
import Salas from './components/salas'
import Disciplinas from './components/disciplinas'



function App() {
  return (
    <Routes>
      <Route path="/turmas" element={<Turmas /> } />
      <Route path="/professores" element={<Professores />} />
      <Route path="/locais" element={<Salas />} />
      <Route path="/disciplinas" element={<Disciplinas />} />
    </Routes>  
  )
}

export default App
