// app/form/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StepForm from '../../components/StepForm';

type TokenData = {
  token: string;
  nama_pengantin: string;
  no_wa: string;
  status: 'belum isi' | 'sudah isi';
};

export default function FormPage() {
  const params = useSearchParams();
  const token = params.get('token')!;
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost/undangansistem/backend/api/token.php?token=${encodeURIComponent(token)}`, {
      mode: 'cors',
    })
      .then(r => r.json())
      .then(j => {
        if (j.valid) {
          setTokenData({
            token: j.token,
            nama_pengantin: j.nama_pengantin,
            no_wa: j.no_wa,
            status: j.status,
          });
        } else {
          setError(j.message || 'Token tidak valid');
        }
      })
      .catch(() => setError('Gagal memeriksa token'));
  }, [token]);

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!tokenData) {
    return <div className="text-center py-10">Memeriksa token…</div>;
  }

  return (
    <main className="…">
      <StepForm tokenData={tokenData} />
    </main>
  );
}
