import { Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import ProdutosPage from './pages/Produtos'
import PedidosPage from './pages/Pedidos'
import PerfilPage from './pages/Perfil'
import { AppProvider } from './lib/context'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path='/home' element={<Home />}>
          <Route path="produtos" element={<ProdutosPage /> } />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          {/* <Route path="disciplinas" element={<Disciplinas />} /> */}
        </Route>
      </Routes>
    </AppProvider>
  )
}

export default App
