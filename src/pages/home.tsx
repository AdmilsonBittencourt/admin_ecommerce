import { Sidebar } from "../components/sidebar"; 
import Dashboard from "../components/Dashboard"; 
import { Outlet, useLocation } from "react-router-dom"; 

export default function Home() {
    const location = useLocation();
    // Verifica se a rota atual é exatamente "/home" ou "/home/"
    const isBaseHomeRoute = location.pathname === "/home" || location.pathname === "/home/";

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {/* Renderiza o Dashboard somente se estiver na rota base /home */}
                {isBaseHomeRoute && <Dashboard />}
                {/* Outlet renderizará componentes de rotas filhas como /home/produtos */}
                <Outlet /> 
            </main>
        </div>
    );
}