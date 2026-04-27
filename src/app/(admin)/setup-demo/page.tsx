'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Settings, Video, Link as IconLink } from 'lucide-react';

export default function SetupDemo() {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [demoLink, setDemoLink] = useState('');

  const handleSaveDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from('demos').insert([
      { video_url: videoUrl }
    ]).select().single();

    setLoading(false);
    if (!error && data) {
      const fullLink = `${window.location.origin}/demo?id=${data.id}`;
      setDemoLink(fullLink);
    } else {
      alert('Erro ao configurar demonstração.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-center">
        <div className="mx-auto bg-purple-50 text-purple-600 w-16 h-16 flex items-center justify-center rounded-2xl shadow-sm mb-4">
          <Settings size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Configurar Demonstração</h2>
        <p className="text-gray-500 mt-2">Gere um link seguro (Click-wrap) para enviar aos clientes.</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-bl-[100px] pointer-events-none"></div>
        <form onSubmit={handleSaveDemo} className="space-y-6 relative z-10">
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">URL do Vídeo (YouTube, Vimeo, etc)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Video size={18} className="text-gray-400" />
              </div>
              <input
                type="url"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-gray-800"
                placeholder="Ex:: https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400">Certifique-se de que o vídeo seja Não Listado para maior segurança.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? 'Gerando Link...' : 'Gerar Link Seguro'}
          </button>
        </form>

        {demoLink && (
          <div className="mt-8 p-6 bg-purple-50 border border-purple-100 rounded-2xl animate-in fade-in duration-300">
            <h4 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
              <IconLink size={16} /> Link de Demonstração Gerado!
            </h4>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={demoLink} 
                className="flex-1 bg-white border border-purple-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(demoLink);
                  alert('Copiado para área de transferência!');
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
              >
                Copiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
