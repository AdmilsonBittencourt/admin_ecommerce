import { Sidebar } from "../components/sidebar"; 
import Dashboard from "../components/Dashboard"; 
import { Outlet, useLocation } from "react-router-dom"; 

export default function Home() {
    const location = useLocation();
    const isBaseHomeRoute = location.pathname === "/home" || location.pathname === "/home/";

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {isBaseHomeRoute && <Dashboard />}
                <Outlet /> 
            </main>
        </div>
    );
}