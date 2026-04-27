'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, FilePlus2, Settings, MonitorPlay } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Gestão de Contratos', icon: CalendarDays },
    { href: '/criar', label: 'Criar Contrato', icon: FilePlus2 },
    { href: '/setup-demo', label: 'Configurar Demo', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen flex flex-col p-4 shadow-xl">
      <div className="flex items-center gap-3 mb-10 mt-4 px-2">
        <MonitorPlay className="text-blue-500 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight text-white">CalcForge<span className="text-blue-500">Tools</span></h1>
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Administrativo</div>
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 font-medium border-l-2 border-blue-500 rounded-l-none'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-500' : 'text-gray-500'} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2 py-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <p className="text-sm font-semibold text-white mb-1">Click-wrap Demo</p>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">Compartilhe o link do portal para clientes.</p>
          <a href="/demo" target="_blank" className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg block text-center transition-colors">
            Acessar /demo
          </a>
        </div>
      </div>
    </aside>
  );
}
