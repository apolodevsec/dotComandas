import '../styles/kds.css';

export const metadata = {
  title: 'dotComandas - KDS Cozinha',
  description: 'Painel de Gerenciamento de Cozinha em Tempo Real',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
