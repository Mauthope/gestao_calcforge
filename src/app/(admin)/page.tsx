'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Contrato {
  id: string;
  cliente: string;
  vencimento: string;
  status: string;
}

export default function GestaoContratos() {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);

  // States for the calendar
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  useEffect(() => {
    async function fetchContratos() {
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('vencimento', { ascending: true });

      if (data && !error) {
        setContratos(data);
      }
      setLoading(false);
    }
    fetchContratos();
  }, []);

  const startDay = startOfMonth(currentMonth);
  const endDay = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: startDay, end: endDay });

  const contratosEmAtraso = contratos.filter(c => new Date(c.vencimento) < today && c.status === 'ativo');
  const contratosNoPrazo = contratos.filter(c => new Date(c.vencimento) >= today && c.status === 'ativo');

  // Simple padding for first day of week
  const startDayOfWeek = startDay.getDay(); 
  const paddingDays = Array.from({ length: startDayOfWeek }).map((_, i) => i);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Gestão de Contratos
          </h2>
          <p className="text-gray-500 mt-1">Acompanhe os prazos e calendários de renovação.</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total de Contratos</p>
            <p className="text-2xl font-bold text-gray-900">{contratos.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">No Prazo</p>
            <p className="text-2xl font-bold text-gray-900">{contratosNoPrazo.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Em Atraso</p>
            <p className="text-2xl font-bold text-gray-900">{contratosEmAtraso.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Carregando calendário...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                &larr; Anterior
              </button>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Próximo &rarr;
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
              <div key={dia} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {dia}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 ">
            {paddingDays.map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] p-2 border-r border-b border-gray-50 bg-gray-50/30"></div>
            ))}
            
            {days.map((day, dayIdx) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayContratos = contratos.filter(c => c.vencimento === dayStr);
              const isToday = isSameDay(day, today);

              return (
                <div 
                  key={day.toString()} 
                  className={`min-h-[120px] p-2 border-r border-b hover:bg-gray-50 transition-colors 
                    ${isToday ? 'bg-blue-50/30 font-semibold' : 'border-gray-100'}
                  `}
                >
                  <div className="text-right mb-2">
                    <span className={`inline-block w-7 h-7 leading-7 text-center rounded-full text-sm ${isToday ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayContratos.map(contrato => (
                      <div key={contrato.id} className="px-2 py-1 flex items-center gap-1.5 text-xs rounded border bg-blue-50 border-blue-100 text-blue-700 truncate shadow-sm">
                        <Clock size={12} className="shrink-0" />
                        <span className="truncate">{contrato.cliente}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
