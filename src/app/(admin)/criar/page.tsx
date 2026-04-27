'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FilePlus2, Link as IconLink, User, CalendarDays } from 'lucide-react';

export default function CriarContrato() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ cliente: '', vencimento: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('contratos').insert([
      { cliente: form.cliente, vencimento: form.vencimento }
    ]);

    setLoading(false);
    if (!error) {
      router.push('/');
    } else {
      alert('Erro ao criar contrato.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-center">
        <div className="mx-auto bg-blue-50 text-blue-600 w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm mb-4">
          <FilePlus2 size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Novo Contrato</h2>
        <p className="text-gray-500 mt-2">Registre um novo cliente e sua data de vencimento.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] pointer-events-none"></div>
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Nome do Cliente / Empresa</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800"
                placeholder="Ex:: CalcForge Indústria"
                value={form.cliente}
                onChange={e => setForm({ ...form, cliente: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Data de Vencimento</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <CalendarDays size={18} className="text-gray-400" />
              </div>
              <input
                type="date"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-800"
                value={form.vencimento}
                onChange={e => setForm({ ...form, vencimento: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? 'Salvando...' : 'Salvar Contrato'}
          </button>
        </form>
      </div>
    </div>
  );
}
