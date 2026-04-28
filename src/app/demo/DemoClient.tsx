'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, ShieldAlert, MonitorPlay, Lock } from 'lucide-react';

export default function DemoClient() {
  const searchParams = useSearchParams();
  const demoId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [demoData, setDemoData] = useState<{ video_url: string } | null>(null);
  
  const [form, setForm] = useState({ fullName: '', email: '', company: '', role: '', agreed: false });
  const [submitting, setSubmitting] = useState(false);
  const [granted, setGranted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchDemo() {
      if (!demoId) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('demos').select('video_url').eq('id', demoId).single();
      if (data) setDemoData(data);
      setLoading(false);
    }
    fetchDemo();
  }, [demoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validação de E-mail corporativo
    const forbiddenDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'bol.com.br'];
    const emailDomain = form.email.split('@')[1]?.toLowerCase();
    
    if (forbiddenDomains.includes(emailDomain)) {
      setErrorMsg('Por favor, utilize um e-mail corporativo válido ao invés de domínios públicos (+@gmail, @hotmail).');
      return;
    }

    if (!form.agreed) {
      setErrorMsg('Você precisa ler e concordar com o Termo de Confidencialidade para continuar.');
      return;
    }

    setSubmitting(true);
    
    // Obter IP (Simples fallback cross-browser)
    let ip = 'desconhecido';
    try {
      const resp = await fetch('https://api.ipify.org?format=json');
      const data = await resp.json();
      ip = data.ip;
    } catch (e) {
      // ignore
    }

    const { error } = await supabase.from('clickwrap_logs').insert([
      {
        full_name: form.fullName,
        email: form.email,
        company: form.company,
        role: form.role,
        agreed: form.agreed,
        ip_address: ip,
        user_agent: navigator.userAgent
      }
    ]);

    setSubmitting(false);

    if (!error) {
      setGranted(true);
    } else {
      setErrorMsg('Erro interno ao processar o aceite. Tente novamente.');
    }
  };

  const iframeContent = (url: string) => {
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) embedUrl = url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');

    return (
      <iframe 
        className="w-full h-full rounded-2xl shadow-2xl border border-gray-800"
        src={embedUrl} 
        title="Demonstração" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen
      ></iframe>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">Verificando token de acesso...</div>;
  if (!demoData) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">Link de demonstração inválido ou expirado.</div>;

  if (granted) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 lg:p-8 animate-in fade-in duration-1000">
        <div className="w-full max-w-5xl aspect-video relative">
          <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-white/50">
              <MonitorPlay size={18} />
              <span className="text-sm font-semibold tracking-widest uppercase">CalcForge Demonstração</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <Lock size={16} />
              <span className="text-xs font-mono">Acesso Seguro Autorizado via Click-wrap</span>
            </div>
          </div>
          {iframeContent(demoData.video_url)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 text-gray-800 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Lado do Termo */}
        <div className="bg-gray-900 text-gray-300 p-8 md:p-12 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 text-white mb-8">
            <ShieldAlert size={28} className="text-blue-500" />
            <h2 className="text-xl font-bold">Termo de Confidencialidade</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 space-y-4 text-sm font-medium leading-relaxed custom-scrollbar">
            <p className="text-gray-400 mb-6 uppercase tracking-wider text-xs font-bold">Leia atentamente antes de prosseguir</p>
            <p><strong>PROVEDOR:</strong> 59.845.833 MAURICIO PRESTES GRIGOL, inscrito no CNPJ sob o nº 59.845.833/0001-04.</p>
            <p>O <strong>USUÁRIO</strong> declara ciência de que o conteúdo a seguir é Propriedade Intelectual do PROVEDOR. Compromete-se a manter sigilo absoluto, não replicar a lógica de negócio e não utilizar as informações apresentadas para fins próprios ou para terceiros, concorrentes ou não.</p>
            <p>O PROVEDOR declara que a visualização deste vídeo não coleta dados sensíveis do USUÁRIO, e garante que em nenhuma hipótese utilizará informações reais da empresa do USUÁRIO para fins comerciais. Os dados do cliente são de sua propriedade exclusiva.</p>
            <p>O clique no botão "LI E CONCORDO / ASSISTIR DEMO" constitui assinatura eletrônica vinculante, registrando o IP, data e hora do acesso para fins de prova judicial, conforme o Art. 10 da MP 2.200-2/2001. A violação deste termo sujeitará o infrator ao pagamento de multas por quebra de sigilo e perdas e danos.</p>
          </div>
        </div>

        {/* Lado do Formulário e Marca */}
        <div className="p-8 md:p-12 flex flex-col justify-center bg-gray-50/50 relative overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-blue-600 mb-5 tracking-tight flex items-center gap-2">
              CalcForge<span className="text-gray-900">Tools</span>
            </h1>
            
            <div className="space-y-2 mb-8 bg-white p-5 rounded-xl border border-blue-100/50 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <ShieldAlert size={16} className="text-blue-500" /> Nossa Missão
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Foco em transparência e segurança. Buscamos traduzir a complexidade do mundo 
                trazendo soluções de alto nível para evoluir continuamente os processos dos nossos clientes.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">Acesso à Demonstração</h2>
            <p className="text-gray-500 text-sm">Identifique-se para validar a sessão e desbloquear o vídeo com segurança.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input type="text" placeholder="Nome Completo" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div>
              <input type="email" placeholder="E-mail Corporativo" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Empresa" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
              <input type="text" placeholder="Seu Cargo" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
            </div>

            <div className="py-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-1">
                  <input type="checkbox" required className="sr-only" checked={form.agreed} onChange={e => setForm({...form, agreed: e.target.checked})} />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${form.agreed ? 'bg-blue-600 border-blue-600' : 'bg-gray-100 border-gray-300 group-hover:border-blue-500'}`}>
                    {form.agreed && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </div>
                <span className="text-xs text-gray-600 font-medium leading-relaxed">
                  Li e concordo com o Termo de Confidencialidade e Não Utilização para acesso à demonstração técnica de MAURICIO PRESTES GRIGOL.
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-lg border border-red-100">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 group disabled:opacity-75"
            >
              {submitting ? 'Registrando Sessão...' : 'LI E CONCORDO / ASSISTIR DEMO'}
              {!submitting && <ShieldAlert size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
