import { Link } from 'react-router-dom'
import type React from 'react'

export function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-full p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">E-commerce</h2>
        <h2 className="text-xl font-bold">Perfumes</h2>
      </div>

      <nav className="space-y-4 flex-grow">
        <SidebarItem
          to="/home"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-700"
            >
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
            </svg>
          }
          label="Home"
        />
        
        <SidebarItem
          to="/home/produtos"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M21 10c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM3.5 21h17M5.5 21V11c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v10m-8-4h4m-4-4h4m6.5-2c0-3.87-3.13-7-7-7s-7 3.13-7 7"/>
            </svg>
          }
          label="Produtos"
        />
        <SidebarItem
          to="/home/pedidos"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          }
          label="Pedidos"
        />
        <SidebarItem
          to="/home/perfil"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Perfil"
        />
      </nav>
      <div className="mt-auto">
        <button 
          onClick={() => console.log("Sair clicado")}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 w-full text-left text-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </div>
  )
}

interface SidebarItemProps {
  to: string
  icon: React.ReactNode
  label: string
  active?: boolean
}

function SidebarItem({ to, icon, label, active }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      {icon}
      <span className={active ? 'font-medium' : ''}>{label}</span>
    </Link>
  )
}
