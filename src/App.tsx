import { Route, Routes } from 'react-router-dom'
import './index.css'

import Professores from './components/professores'
import Turmas from './components/turma'
import Salas from './components/salas'
import Disciplinas from './components/disciplinas'
import Home from './components/home'



function App() {
  return (
    <Routes>
      <Route path='/home' element={<Home />}>
        <Route path="turmas" element={<Turmas /> } />
        <Route path="professores" element={<Professores />} />
        <Route path="locais" element={<Salas />} />
        <Route path="disciplinas" element={<Disciplinas />} />
      </Route>
    </Routes>  
  )
}

export default App
