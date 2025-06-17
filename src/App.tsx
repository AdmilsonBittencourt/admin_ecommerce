import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import ProdutosPage from './pages/Produtos'



function App() {
  return (
    <Routes>
      <Route path='/home' element={<Home />}>
        <Route path="produtos" element={<ProdutosPage /> } />
        {/* <Route path="professores" element={<Professores />} />
        <Route path="locais" element={<Salas />} />
        <Route path="disciplinas" element={<Disciplinas />} /> */}
      </Route>
    </Routes>  
  )
}

export default App
