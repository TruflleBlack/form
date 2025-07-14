'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Token tidak boleh kosong');
      return;
    }
    // Navigasi ke /form?token=…
    router.push(`/form?token=${encodeURIComponent(token.trim())}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Selamat Datang</h1>
        <p className="text-gray-600 mb-6 text-center">Masukkan token undangan untuk melanjutkan</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            Token Undangan
          </label>
          <input
            id="token"
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Contoh: 1a2b3c4d"
            value={token}
            onChange={e => { setToken(e.target.value); setError(''); }}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
          >
            Mulai Isi Formulir
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-6">© 2025 UndanganMu Digital</p>
      </div>
    </main>
  );
}
