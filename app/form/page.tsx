// app/form/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import StepForm from '../../components/StepForm';

type TokenData = {
  token: string;
  nomor_order: string;
  status: string;
  tema_undangan: string;
  sub_tema: string;
  paket_undangan: string;
  pilihan_paket_tanpa_foto: string;
  urutan_mempelai: string;
  mulai_musik: number;
  musik: string;
  tema_link: string;
  pria: {
    panggilan: string;
    lengkap: string;
    anakKe: number;
    ayah: string;
    ibu: string;
    sosmed: string;
  };
  wanita: {
    panggilan: string;
    lengkap: string;
    anakKe: number;
    ayah: string;
    ibu: string;
    sosmed: string;
  };
  acara_list: Array<{
    nama: string;
    tanggal: string;
    waktu: string;
    tempat: string;
    link: string;
    zona: string;
  }>;
  stories: Array<{
    judul: string;
    tanggal: string;
    deskripsi: string;
  }>;
  angpao: {
    bank: string;
    rekening: string;
    atasNama: string;
  };
  live: {
    link: string;
    tanggal: string;
    waktu: string;
    zona: string;
  };
};

function FormPageInner() {
  const params = useSearchParams();
  const token = params.get('token')!;
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://localhost/undangansistem/backend/api/cek_token.php?token=${encodeURIComponent(token)}`, {
      mode: 'cors',
    })
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setTokenData(j);
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

export default function FormPage() {
  return (
    <Suspense>
      <FormPageInner />
    </Suspense>
  );
}
