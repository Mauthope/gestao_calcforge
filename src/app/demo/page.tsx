import { Metadata } from 'next';
import DemoClient from './DemoClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Demonstração Técnica | CalcForgeTools',
  description: 'Acesso restrito a demonstração',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-400">Carregando ambiente seguro...</div>}>
      <DemoClient />
    </Suspense>
  );
}
