import { Route, Routes, Navigate } from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import ProdutosPage from './pages/Produtos'
import PedidosPage from './pages/Pedidos'
import PerfilPage from './pages/Perfil'
import LoginPage from './pages/Login'
import RecuperarSenhaPage from './pages/RecuperarSenha'
import ProtectedRoute from './components/ProtectedRoute'
import { AppProvider } from './lib/context'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }>
          <Route path="produtos" element={<ProdutosPage /> } />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AppProvider>
  )
}

export default App
