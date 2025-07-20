// components/StepForm.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Floating } from './Floating';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export type TokenData = {
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
type StepFormProps = { tokenData: TokenData };

type Acara = { nama: string; tanggal: string; waktu: string; tempat: string; link: string; zona: string; };
type Story = { judul: string; tanggal: string; deskripsi: string; };

// Fungsi konversi "00:00:24" ke detik (24)
// function timeStringToSeconds(str: string) {
//   if (!str) return '';
//   const parts = str.split(':').map(Number);
//   if (parts.length === 3) {
//     return parts[0] * 3600 + parts[1] * 60 + parts[2];
//   } else if (parts.length === 2) {
//     return parts[0] * 60 + parts[1];
//   } else if (parts.length === 1) {
//     return parts[0];
//   }
//   return '';
// }

export default function StepForm({ tokenData }: StepFormProps) {
  const steps = [
    'Tema & Paket',
    'Data Mempelai',
    'Detail Acara',
    'Musik',
    'Love Story',
    'Amplop & Live Streaming',
    'Review & Kirim',
    'Selesai'
  ];
  const [current, setCurrent] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // === form state (omitted here for brevity, same as before) ===
  // STEP 1
  const [temaUndangan, setTemaUndangan] = useState('');
  const [subTema, setSubTema] = useState('');
  const [temaLink, setTemaLink] = useState('');
  const [paketUndangan, setPaketUndangan] = useState('');
  const [pilihanTanpaFoto, setPilihanTanpaFoto] = useState('');
  const [urutanMempelai, setUrutanMempelai] = useState<'pria'|'wanita'|''>('');
  const [valid1, setValid1] = useState(true); // always true
  type LuxuryTheme = 'Luxury 01' | 'Luxury 02' | 'Luxury 03' | 'Luxury 04' | 'Luxury 05';
  const luxuryLinks = useMemo<Record<LuxuryTheme, string>>(() => ({
    'Luxury 01': 'https://lovestory.id/?elementor_library=minimalist-luxury-01',
    'Luxury 02': 'https://lovestory.id/?elementor_library=minimalist-luxury-02',
    'Luxury 03': 'https://lovestory.id/?elementor_library=minimalist-luxury-03',
    'Luxury 04': 'https://lovestory.id/?elementor_library=minimalist-luxury-04',
    'Luxury 05': 'https://lovestory.id/?elementor_library=minimalist-luxury-05',
  }), []);

  // --- NEW: Define image links for themes and sub-themes ---
  const themePreviews = useMemo(() => ({
    'Tema Spesial': {
      description: 'Tema spesial dengan desain unik dan fitur eksklusif.',
      image: '/images/themes/tema-spesial.jpg', // Example image path
      link: 'https://lovestory.id/preview/tema-spesial' // Example preview link
    },
    'Minimalist Luxury': {
      description: 'Desain mewah dan elegan dengan sentuhan minimalis.',
      image: '/images/themes/minimalist-luxury.jpg', // Example image path
      link: 'https://lovestory.id/preview/minimalist-luxury', // Base link for luxury
      subThemes: {
        'Luxury 01': {
          description: 'Luxury 01: Keanggunan klasik dengan sentuhan modern.',
          image: '/images/subthemes/luxury-01.jpg',
          link: luxuryLinks['Luxury 01']
        },
        'Luxury 02': {
          description: 'Luxury 02: Desain minimalis dengan detail emas.',
          image: '/images/subthemes/luxury-02.jpg',
          link: luxuryLinks['Luxury 02']
        },
        'Luxury 03': {
          description: 'Luxury 03: Elegan dengan palet warna lembut.',
          image: '/images/subthemes/luxury-03.jpg',
          link: luxuryLinks['Luxury 03']
        },
        'Luxury 04': {
          description: 'Luxury 04: Modern dan chic dengan tipografi berani.',
          image: '/images/subthemes/luxury-04.jpg',
          link: luxuryLinks['Luxury 04']
        },
        'Luxury 05': {
          description: 'Luxury 05: Sentuhan artistik dengan ilustrasi halus.',
          image: '/images/subthemes/luxury-05.jpg',
          link: luxuryLinks['Luxury 05']
        },
      }
    },
    'Premium Vintage': {
      description: 'Gaya klasik dengan nuansa retro yang hangat.',
      image: '/images/themes/premium-vintage.jpg',
      link: 'https://lovestory.id/preview/premium-vintage'
    },
    'Adat': {
      description: 'Desain tradisional yang kaya akan budaya.',
      image: '/images/themes/adat.jpg',
      link: 'https://lovestory.id/preview/adat'
    },
  }), [luxuryLinks]);
  // --- END NEW ---

  // Luxury SubThemes
  const luxurySubThemes = Array.from({length: 11}, (_, i) => ({
    key: `LUXURY-${String(i+1).padStart(2, '0')}`,
    label: `Luxury ${String(i+1).padStart(2, '0')}`,
    image: `/images/subthemes/LUXURY-${String(i+1).padStart(2, '0')}.jpg`,
  }));
  // Luxury Animasi
  const animasiThemes = Array.from({length: 11}, (_, i) => ({
    key: `LUXURY-${String(i+1).padStart(2, '0')}-ANIMASI`,
    label: `Luxury ${String(i+1).padStart(2, '0')}`,
    image: `/images/subthemes/LUXURY-${String(i+1).padStart(2, '0')}-ANIMASI.jpg`,
  }));
  // Spesial SubThemes
  const spesialSubThemes = Array.from({length: 10}, (_, i) => ({
    key: `SPESIAL-${String(i+1).padStart(2, '0')}`,
    label: `Spesial ${String(i+1).padStart(2, '0')}`,
    image: `/images/subthemes/SPESIAL-${String(i+1).padStart(2, '0')}.jpg`,
  }));
  // Spesial Animasi
  const spesialAnimasiThemes = Array.from({length: 10}, (_, i) => ({
    key: `SPESIAL-${String(i+1).padStart(2, '0')}-ANIMASI`,
    label: `Spesial ${String(i+1).padStart(2, '0')}`,
    image: `/images/subthemes/SPESIAL-${String(i+1).padStart(2, '0')}-ANIMASI.jpg`,
  }));
  // Premium Vintage SubThemes
  const premiumVintageSubThemes = Array.from({length: 8}, (_, i) => ({
    key: `Premium-Vintage-${String(i+1).padStart(2, '0')}`,
    label: `Vintage ${String(i+1).padStart(2, '0')}`,
    image: `/images/subthemes/Premium-Vintage-${String(i+1).padStart(2, '0')}.jpg`,
    link: `https://inv.wekita.id/vintage-${String(i+1).padStart(2, '0')}/`
  }));
  // Premium Vintage Animasi
  const premiumVintageAnimasiThemes = Array.from({length: 8}, (_, i) => ({
    key: `Premium-Vintage-${String(i+1).padStart(2, '0')}-ANIMASI`,
    label: `Vintage ${String(i+1).padStart(2, '0')}`,
    image: `/images/subthemes/Premium-Vintage-${String(i+1).padStart(2, '0')}-ANIMASI.jpg`,
    link: `https://inv.wekita.id/vintage-${String(i+1).padStart(2, '0')}-animasi/`
  }));
  // Adat SubThemes
  const adatLabels = [
    'TEMA-BALI',
    'TEMA-BATAK',
    'TEMA-BUGIS',
    'TEMA-CHINESE',
    'TEMA-MELAYU',
    'TEMA-MINANG',
    'TEMA-WAYANG-01',
    'TEMA-WAYANG-02',
    'TEMA-WAYANG-03',
    'TEMA-WAYANG-04',
  ];
  const adatSubThemes = adatLabels.map(label => ({
    key: label,
    label: label.replace('TEMA-', 'Tema '),
    image: `/images/subthemes/${label}.jpg`,
    link: `https://inv.wekita.id/${label.replace('TEMA-', '').toLowerCase()}`
  }));
  const adatAnimasiSubThemes = adatLabels.map(label => ({
    key: `${label}-ANIMASI`,
    label: label.replace('TEMA-', 'Tema '),
    image: `/images/subthemes/${label}-ANIMASI.jpg`,
    link: `https://inv.wekita.id/animasi-${label.replace('TEMA-', '').toLowerCase()}`
  }));

  // Load existing data if token has been used before
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE}/cek_token.php?token=${encodeURIComponent(tokenData.token)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log("Data loaded from API:", data);
        
        if (data.success) {
          // Populate form with existing data
          const formData = data;
          
          // Step 1: Tema & Paket
          setTemaUndangan(formData.tema_undangan || '');
          setSubTema(formData.sub_tema || '');
          setTemaLink(formData.tema_link || '');
          setPaketUndangan(formData.paket_undangan || '');
          setPilihanTanpaFoto(formData.pilihan_paket_tanpa_foto || '');
          setUrutanMempelai(formData.urutan_mempelai || '');
          
          // Step 2: Data Mempelai
          if (formData.pria) {
            setPria({
              panggilan: formData.pria.panggilan || '',
              lengkap: formData.pria.lengkap || '',
              anakKe: formData.pria.anakKe || 1,
              ayah: formData.pria.ayah || '',
              ibu: formData.pria.ibu || '',
              sosmed: formData.pria.sosmed?.replace(/^@/, '') || ''
            });
          }
          
          if (formData.wanita) {
            setWanita({
              panggilan: formData.wanita.panggilan || '',
              lengkap: formData.wanita.lengkap || '',
              anakKe: formData.wanita.anakKe || 1,
              ayah: formData.wanita.ayah || '',
              ibu: formData.wanita.ibu || '',
              sosmed: formData.wanita.sosmed?.replace(/^@/, '') || ''
            });
          }
          
          // Step 3: Detail Acara
          if (formData.acara_list && formData.acara_list.length > 0) {
            setAcaraList(formData.acara_list);
          }
          
          // Step 4: Musik
          setBacksound(formData.musik || '');
          setMulaiMusik(formData.mulai_musik ? String(formData.mulai_musik) : '');
          
          // Step 5: Love Story
          if (formData.stories && formData.stories.length > 0) {
            setStories(formData.stories);
          }
          
          // Step 6: Amplop & Live Streaming
          if (formData.angpao) {
            setAngpao({
              bank: formData.angpao.bank || '',
              rekening: formData.angpao.rekening || '',
              atasNama: formData.angpao.atasNama || ''
            });
          }
          
          if (formData.live) {
            setLive({
              link: formData.live.link || '',
              tanggal: formData.live.tanggal || '',
              waktu: formData.live.waktu || '',
              zona: formData.live.zona || 'WIB'
            });
          }
          
          console.log('Form data loaded successfully!');
        }
      } catch (error) {
        console.error('Error fetching existing data:', error);
        alert('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExistingData();
  }, [tokenData.token]);

  useEffect(() => {
    setValid1(true); // always valid, no required fields
  }, [temaUndangan, subTema, paketUndangan, pilihanTanpaFoto, urutanMempelai]);

  useEffect(() => {
    if (temaUndangan === 'Minimalist Luxury') {
      setTemaLink(luxuryLinks[subTema as LuxuryTheme] || '');
    } else {
      const selectedTheme = themePreviews[temaUndangan as keyof typeof themePreviews];
      if (selectedTheme && selectedTheme.link) {
        setTemaLink(selectedTheme.link);
      } else {
        setTemaLink('');
      }
    }
  }, [temaUndangan, subTema, luxuryLinks, themePreviews]);

  // STEP 2
  const [pria, setPria] = useState({ panggilan:'', lengkap:'', anakKe:1, ayah:'', ibu:'', sosmed:'' });
  const [wanita, setWanita] = useState({ panggilan:'', lengkap:'', anakKe:1, ayah:'', ibu:'', sosmed:'' });
  const [valid2, setValid2] = useState(true); // always true
  useEffect(() => {
    setValid2(true); // always valid
  }, [pria, wanita]);

  // STEP 3
  const [acaraList, setAcaraList] = useState<Acara[]>([
    { nama:'', tanggal:'', waktu:'', tempat:'', link:'', zona:'WIB' },
    { nama:'', tanggal:'', waktu:'', tempat:'', link:'', zona:'WIB' },
  ]);
  const [valid3, setValid3] = useState(true); // always true
  useEffect(() => {
    setValid3(true); // always valid
  }, [acaraList]);
  const addAcara = () => setAcaraList([...acaraList, { nama:'', tanggal:'', waktu:'', tempat:'', link:'', zona:'WIB' }]);
  const removeAcara = (i:number) => setAcaraList(acaraList.filter((_,idx)=>idx!==i));

  // STEP 4
  const [backsound, setBacksound] = useState('');
  const [mulaiMusik, setMulaiMusik] = useState('');
  const [valid4, setValid4] = useState(true); // always true
  useEffect(() => { setValid4(true); }, [backsound]);

  // STEP 5
  const [stories, setStories] = useState<Story[]>([{ judul:'', tanggal:'', deskripsi:'' }]);
  const [valid5, setValid5] = useState(true); // always true
  useEffect(() => {
    setValid5(true); // always valid
  }, [stories]);
  const addStory = () => setStories([...stories, { judul:'', tanggal:'', deskripsi:'' }]);
  const removeStory = (i:number) => setStories(stories.filter((_,idx)=>idx!==i));

  // STEP 6
  const [angpao, setAngpao] = useState({ bank:'', rekening:'', atasNama:'' });
  const [live, setLive] = useState({ link:'', tanggal:'', waktu:'', zona:'WIB' });
  const [valid6, setValid6] = useState(true); // always true
  useEffect(() => {
    setValid6(true); // always valid
  }, [angpao, live]);

  // STEP 7
  const [agreed, setAgreed] = useState(true); // always true so user can always submit
  const canNext = [valid1,valid2,valid3,valid4,valid5,valid6,agreed][current];
  const next = () => canNext && setCurrent(c=>c+1);
  const prev = () => setCurrent(c=>c-1);
  const formatTime = (t:string) => t ? dayjs(t,'HH:mm').format('h:mm A') : '';

  // Prepare full payload for review & submit
    const payload = {
      token: tokenData.token,
      tema_undangan: temaUndangan,
      sub_tema: subTema,
      tema_link: temaLink,
      paket_undangan: paketUndangan,
      pilihan_paket_tanpa_foto: pilihanTanpaFoto,
      urutan_mempelai: urutanMempelai,
      mulai_musik: parseInt(mulaiMusik, 10) || 0,
      musik: backsound,
      nama_panggilan_pria: pria.panggilan,
      nama_lengkap_pria: pria.lengkap,
      putra_ke: pria.anakKe,
      ayah_pria: pria.ayah,
      ibu_pria: pria.ibu,
    sosmed_pria: pria.sosmed.startsWith('@')?pria.sosmed:'@'+pria.sosmed,
      nama_panggilan_wanita: wanita.panggilan,
      nama_lengkap_wanita: wanita.lengkap,
      putri_ke: wanita.anakKe,
      ayah_wanita: wanita.ayah,
      ibu_wanita: wanita.ibu,
    sosmed_wanita: wanita.sosmed.startsWith('@')?wanita.sosmed:'@'+wanita.sosmed,
    acara_list: acaraList,
    stories: stories,
    no_rekening: angpao.rekening,
    bank: angpao.bank,
    nama_pemilik_rek: angpao.atasNama,
    link_streaming: live.link,
    tanggal_streaming: live.tanggal,
    waktu_streaming: live.waktu,
      zona_waktu_streaming: live.zona,
    };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE}/submit_form.php`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        setShowSuccess(true);
        // Keep animation visible for 3 seconds, then move to final step
        setTimeout(() => {
          setShowSuccess(false);
          setCurrent(steps.length-1);
        }, 3000);
      } else {
        alert(`❌ ${json.message}`);
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      alert(`❌ Submit error: ${errorMessage}`);
    }
  };

  // WhatsApp redirect handler
  const handleWhatsAppRedirect = () => {
    // Format: country code (62) + number without leading zero
    const adminPhone = "6285329776096";
    const message = encodeURIComponent(generateWhatsAppMessage());
    window.location.href = `https://wa.me/${adminPhone}?text=${message}`;
  };

  // Generate WhatsApp message with form data recap
  const generateWhatsAppMessage = () => {
    let msg = `Halo min, saya ${pria.panggilan} & ${wanita.panggilan} sudah mengisi form dengan rekap data seperti berikut:\n\n`;

    // Tema & Paket
    msg += `*Tema:* ${temaUndangan}\n`;
    if (subTema) msg += `*Sub Tema:* ${subTema}\n`;
    msg += `*Paket:* ${paketUndangan}\n`;
    if (pilihanTanpaFoto) msg += `*Pilihan:* ${pilihanTanpaFoto}\n`;
    msg += `*Urutan Mempelai:* ${urutanMempelai === 'pria' ? 'Pria Didahulukan' : urutanMempelai === 'wanita' ? 'Wanita Didahulukan' : ''}\n\n`;

    // Data Mempelai
    msg += `*Mempelai Pria:*\n`;
    msg += `- Nama Panggilan: ${pria.panggilan}\n`;
    msg += `- Nama Lengkap: ${pria.lengkap}\n`;
    msg += `- Putra ke: ${pria.anakKe}\n`;
    msg += `- Ayah: ${pria.ayah}\n`;
    msg += `- Ibu: ${pria.ibu}\n`;
    if (pria.sosmed) msg += `- Sosmed: @${pria.sosmed}\n`;

    msg += `\n*Mempelai Wanita:*\n`;
    msg += `- Nama Panggilan: ${wanita.panggilan}\n`;
    msg += `- Nama Lengkap: ${wanita.lengkap}\n`;
    msg += `- Putri ke: ${wanita.anakKe}\n`;
    msg += `- Ayah: ${wanita.ayah}\n`;
    msg += `- Ibu: ${wanita.ibu}\n`;
    if (wanita.sosmed) msg += `- Sosmed: @${wanita.sosmed}\n`;

    // Acara
    msg += `\n*Detail Acara:*\n`;
    acaraList.forEach((a, i) => {
      msg += `- Acara ${i+1}: ${a.nama}, ${a.tanggal} ${a.waktu} ${a.zona}`;
      if (a.tempat) msg += `, Tempat: ${a.tempat}`;
      if (a.link) msg += `, Maps: ${a.link}`;
      msg += `\n`;
    });

    // Musik
    msg += `\n*Musik:*\n- URL: ${backsound}\n- Mulai di detik ke: ${mulaiMusik}\n`;

    // Love Story
    if (stories.length) {
      msg += `\n*Love Story:*\n`;
      stories.forEach((s, i) => {
        msg += `- Story ${i+1}: ${s.judul} (${s.tanggal})\n  ${s.deskripsi}\n`;
      });
    }

    // Amplop & Streaming
    msg += `\n*Amplop:*\n- Bank: ${angpao.bank}\n- No. Rekening: ${angpao.rekening}\n- Atas Nama: ${angpao.atasNama}\n`;
    msg += `\n*Live Streaming:*\n- Link: ${live.link}\n- Tanggal: ${live.tanggal}\n- Waktu: ${live.waktu} ${live.zona}\n`;

    msg += `\n---\nMohon informasi langkah selanjutnya ya min 🙏`;

    return msg;
  };

  // Render
  return (
    <div className="min-h-screen bg-[#8A2D3B] py-10 px-4 relative">
      {/* Success animation overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-scale-in">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" className="animate-checkmark" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Berhasil!</h2>
            <p className="text-gray-600">Data undangan Anda telah tersimpan.</p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-scale-in">
            <div className="w-24 h-24 mx-auto flex items-center justify-center mb-4">
              <div className="w-16 h-16 border-4 border-[#B03052] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-[#B03052] mb-2">Memuat data...</h2>
            <p className="text-gray-600">Silakan tunggu sebentar</p>
          </div>
        </div>
      )}

      <form className="max-w-3xl mx-auto bg-[#EBE8DB] rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#B03052]">Form Undangan Digital</h1>

        {/* Editing notification for returning users */}
        {tokenData.status === 'sudah isi' && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  Anda sedang mengedit data yang sudah pernah diisi sebelumnya. Perubahan yang Anda lakukan akan menimpa data yang lama.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        <div>
          <h2 className="text-xl font-semibold text-[#B03052]">{steps[current]}</h2>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#B03052] to-[#D76C82] transition-all"
              style={{ width:`${((current+1)/steps.length)*100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Tema & Paket */}
        {current===0 && (
          <div className="grid gap-6">
            {/* Tema Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
              <label className="block mb-4 text-lg font-medium text-[#B03052]">
                Pilihan Tema Undangan *
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82] bg-white"
                value={temaUndangan}
                onChange={e=>{ setTemaUndangan(e.target.value); setSubTema(''); setPilihanTanpaFoto(''); }}
              >
                <option value="">Pilih Tema</option>
                {Object.keys(themePreviews).map(themeName => (
                  <option key={themeName} value={themeName}>{themeName}</option>
                ))}
              </select>
            </div>

            {/* Paket Selection */}
            {temaUndangan && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Paket Undangan *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82] bg-white"
                  value={paketUndangan}
                  onChange={e=>{ setPaketUndangan(e.target.value); setPilihanTanpaFoto(''); setSubTema(''); }}
                >
                  <option value="">Pilih Paket</option>
                  <option value="Dengan Foto">Dengan Foto</option>
                  <option value="Tanpa Foto">Tanpa Foto</option>
                </select>

                {paketUndangan === 'Tanpa Foto' && (
                  <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-[#B03052]">
                      Pilihan Animasi / Inisial *
                    </label>
                    <select
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82] bg-white"
                      value={pilihanTanpaFoto}
                      onChange={e=>{ setPilihanTanpaFoto(e.target.value); setSubTema(''); }}
                    >
                      <option value="">Pilih</option>
                      <option value="Animasi">Animasi</option>
                      <option value="Inisial">Inisial</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Sub Tema Luxury: Grid Gambar + Preview Button (khusus Dengan Foto) */}
            {temaUndangan === 'Minimalist Luxury' && paketUndangan === 'Dengan Foto' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Sub Tema Luxury *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {luxurySubThemes.map((sub, idx) => (
                    <div key={sub.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(sub.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 ${subTema===sub.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={sub.image} alt={sub.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===sub.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{sub.label}</div>
                      </button>
                      <a
                        href={`https://lovestory.id/?elementor_library=minimalist-luxury-${String(idx+1).padStart(2, '0')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temaUndangan === 'Tema Spesial' && paketUndangan === 'Dengan Foto' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Sub Tema Spesial *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {spesialSubThemes.map((sub, idx) => (
                    <div key={sub.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(sub.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 ${subTema===sub.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={sub.image} alt={sub.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===sub.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{sub.label}</div>
                      </button>
                      <a
                        href={`https://inv.wekita.id/spesial-${String(idx+1).padStart(2, '0')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Animasi: Grid Gambar (khusus Tanpa Foto & Animasi) */}
            {temaUndangan === 'Minimalist Luxury' && paketUndangan==='Tanpa Foto' && pilihanTanpaFoto==='Animasi' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-2 text-lg font-medium text-[#B03052]">
                  Pilihan Animasi Luxury *
                </label>
                <p className="text-xs text-pink-700 mb-4">Animasi khusus untuk tema Minimalist Luxury.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {animasiThemes.map((anim, idx) => (
                    <div key={anim.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(anim.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 ${subTema===anim.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={anim.image} alt={anim.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===anim.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{`Luxury Animasi ${String(idx+1).padStart(2, '0')}`}</div>
                      </button>
                      <a
                        href={`https://inv.wekita.id/luxury-${String(idx+1).padStart(2, '0')}-animasi/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temaUndangan === 'Tema Spesial' && paketUndangan === 'Tanpa Foto' && pilihanTanpaFoto === 'Animasi' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-2 text-lg font-medium text-[#B03052]">
                  Pilihan Animasi Spesial *
                </label>
                <p className="text-xs text-pink-700 mb-4">Animasi khusus untuk tema Spesial</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {spesialAnimasiThemes.map((anim, idx) => (
                    <div key={anim.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(anim.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 ${subTema===anim.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={anim.image} alt={anim.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===anim.label ? 'text-xs text-pink-700 mb-4' : 'text-gray-700'}`}>{`Spesial Animasi ${String(idx+1).padStart(2, '0')}`}</div>
                      </button>
                      <a
                        href={`https://inv.wekita.id/spesial-${String(idx+1).padStart(2, '0')}-animasi/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            
            {temaUndangan === 'Premium Vintage' && paketUndangan === 'Dengan Foto' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Sub Tema Premium Vintage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {premiumVintageSubThemes.map((sub) => (
                    <div key={sub.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(sub.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 bg-white max-w-[160px] mx-auto ${subTema===sub.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={sub.image} alt={sub.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===sub.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{sub.label}</div>
                      </button>
                      <a
                        href={sub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temaUndangan === 'Premium Vintage' && paketUndangan==='Tanpa Foto' && pilihanTanpaFoto==='Animasi' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Animasi Premium Vintage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {premiumVintageAnimasiThemes.map((anim) => (
                    <div key={anim.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(anim.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 bg-white max-w-[160px] mx-auto ${subTema===anim.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={anim.image} alt={anim.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===anim.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{anim.label}</div>
                      </button>
                      <a
                        href={anim.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temaUndangan === 'Adat' && paketUndangan === 'Dengan Foto' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Sub Tema Adat
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {adatSubThemes.map((sub) => (
                    <div key={sub.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(sub.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 bg-white max-w-[160px] mx-auto ${subTema===sub.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={sub.image} alt={sub.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===sub.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{sub.label}</div>
                      </button>
                      <a
                        href={sub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {temaUndangan === 'Adat' && paketUndangan==='Tanpa Foto' && pilihanTanpaFoto==='Animasi' && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Animasi Adat
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {adatAnimasiSubThemes.map((anim) => (
                    <div key={anim.key} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={()=>setSubTema(anim.label)}
                        className={`group focus:outline-none border-2 rounded-xl overflow-hidden transition-all duration-200 p-1 bg-white max-w-[160px] mx-auto ${subTema===anim.label ? 'border-[#B03052] shadow-lg' : 'border-transparent'}`}
                      >
                        <img src={anim.image} alt={anim.label} className="w-full h-28 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200" />
                        <div className={`mt-2 text-center text-sm font-medium ${subTema===anim.label ? 'text-[#B03052]' : 'text-gray-700'}`}>{anim.label}</div>
                      </button>
                      <a
                        href={anim.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block px-3 py-1 bg-[#B03052] text-white rounded-lg text-xs hover:bg-[#D76C82] transition-colors duration-200"
                      >
                        Preview
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inisial: Tidak tampilkan menu apapun setelah memilih inisial */}
            {/* Tidak ada select inisial a/b/c dst */}

            {/* Urutan Mempelai Selection */}
            {temaUndangan && paketUndangan && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <label className="block mb-4 text-lg font-medium text-[#B03052]">
                  Pilihan Urutan Mempelai *
                </label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82] bg-white"
                  value={urutanMempelai}
                  onChange={e=>setUrutanMempelai(e.target.value as 'pria'|'wanita'|'')}
                >
                  <option value="">Pilih Urutan</option>
                  <option value="pria">Pria Didahulukan</option>
                  <option value="wanita">Wanita Didahulukan</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Data Mempelai */}
        {current===1 && (
          <div className="grid gap-4 md:grid-cols-2">
            {(['wanita','pria'] as const).map(role=>{
              const data = role==='wanita'?wanita:pria;
              const setter = role==='wanita'?setWanita:setPria;
              return (
                <div key={role} className="space-y-4">
                  <h4 className="font-semibold text-[#B03052]">
                    Data Mempelai {role==='wanita'?'Wanita':'Pria'}
                  </h4>
                  <Floating id={`${role}-panggilan`} label="Nama Panggilan *">
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={data.panggilan}
                      onChange={e=>setter({...data,panggilan:e.target.value})}
                    />
                  </Floating>
                  <Floating id={`${role}-lengkap`} label="Nama Lengkap *">
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={data.lengkap}
                      onChange={e=>setter({...data,lengkap:e.target.value})}
                    />
                  </Floating>
                  <Floating id={`${role}-anakKe`} label="Anak ke- *">
                    <input
                      type="number" min={1}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={data.anakKe}
                      onChange={e=>setter({...data,anakKe:parseInt(e.target.value,10)||1})}
                    />
                  </Floating>
                  <Floating id={`${role}-ayah`} label="Nama Ayah *">
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={data.ayah}
                      onChange={e=>setter({...data,ayah:e.target.value})}
                    />
                  </Floating>
                  <Floating id={`${role}-ibu`} label="Nama Ibu *">
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={data.ibu}
                      onChange={e=>setter({...data,ibu:e.target.value})}
                    />
                  </Floating>
                  <Floating id={`${role}-sosmed`} label="@Sosial Media">
                    <input
                      type="text" placeholder="@username"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={data.sosmed}
                      onChange={e=>setter({...data,sosmed:e.target.value.replace(/^@*/,'')})}
                    />
                  </Floating>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 3: Detail Acara */}
        {current === 2 && (
          <div className="space-y-6">
            {acaraList.map((a, i) => (
              <div key={i} className="space-y-2 border p-4 rounded-lg bg-white">
                <h4 className="font-semibold text-[#B03052]">Acara {i + 1}</h4>
                <Floating id={`acara${i}-nama`} label="Nama Acara *">
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={a.nama}
                    onChange={e => {
                      const tmp = [...acaraList]; tmp[i].nama = e.target.value; setAcaraList(tmp);
                    }}
                  />
                </Floating>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Floating id={`acara${i}-tanggal`} label="Tanggal *">
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={a.tanggal}
                      onChange={e => {
                        const tmp = [...acaraList]; tmp[i].tanggal = e.target.value; setAcaraList(tmp);
                      }}
                    />
                  </Floating>
                  <Floating id={`acara${i}-waktu`} label="Jam *">
                    <input
                      type="time"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                      value={a.waktu}
                      onChange={e => {
                        const tmp = [...acaraList]; tmp[i].waktu = e.target.value; setAcaraList(tmp);
                      }}
                    />
                  </Floating>
                </div>
                <Floating id={`acara${i}-tempat`} label="Tempat Acara">
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={a.tempat}
                    onChange={e => {
                      const tmp = [...acaraList]; tmp[i].tempat = e.target.value; setAcaraList(tmp);
                    }}
                  />
                </Floating>
                <Floating id={`acara${i}-link`} label="Link Google Maps">
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={a.link}
                    onChange={e => {
                      const tmp = [...acaraList]; tmp[i].link = e.target.value; setAcaraList(tmp);
                    }}
                  />
                </Floating>
                <Floating id={`acara${i}-zona`} label="Zona Waktu">
                  <select
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={a.zona}
                    onChange={e => {
                      const tmp = [...acaraList]; tmp[i].zona = e.target.value; setAcaraList(tmp);
                    }}
                  >
                    <option value="WIB">WIB</option>
                    <option value="WITA">WITA</option>
                    <option value="WIT">WIT</option>
                  </select>
                </Floating>
                <p className="text-sm text-gray-600">
                  Preview: {formatTime(a.waktu)} — {a.zona}
                </p>
                {acaraList.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeAcara(i)}
                    className="text-sm text-red-600"
                  >
                    Hapus Acara
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAcara}
              className="px-4 py-2 bg-[#B03052] text-white rounded-lg"
            >
              + Tambah Acara
            </button>
          </div>
        )}

        {/* STEP 4: Musik */}
        {current === 3 && (
          <div className="space-y-4">
          <Floating id="backsound" label="Pilihan Backing Sound *">
            <input
              type="text"
              placeholder="URL YouTube"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
              value={backsound}
              onChange={e => setBacksound(e.target.value)}
            />
          </Floating>
            <Floating id="mulai_musik" label="Mulai Musik (detik) *">
              <input
                type="number"
                placeholder="Contoh: 30"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                value={mulaiMusik}
                onChange={e => setMulaiMusik(e.target.value)}
              />
            </Floating>
          </div>
        )}

        {/* STEP 5: Love Story */}
        {current === 4 && (
          <div className="space-y-4">
            {stories.map((s, i) => (
              <div key={i} className="border p-4 rounded-lg bg-white">
                <h4 className="font-semibold text-[#B03052]">Story {i + 1}</h4>
                <Floating id={`lsJudul${i}`} label="Judul Love Story *">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={s.judul}
                    onChange={e => {
                      const tmp = [...stories]; tmp[i].judul = e.target.value; setStories(tmp);
                    }}
                />
            </Floating>
                <Floating id={`lsTanggal${i}`} label="Tanggal Love Story">
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={s.tanggal}
                    onChange={e => {
                      const tmp = [...stories]; tmp[i].tanggal = e.target.value; setStories(tmp);
                    }}
              />
            </Floating>
                <Floating id={`lsDeskripsi${i}`} label="Deskripsi Love Story *">
              <textarea
                    rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                    value={s.deskripsi}
                    onChange={e => {
                      const tmp = [...stories]; tmp[i].deskripsi = e.target.value; setStories(tmp);
                    }}
              />
            </Floating>
                {stories.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStory(i)}
                    className="text-sm text-red-600"
                  >
                    Hapus Story
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStory}
              className="px-4 py-2 bg-[#B03052] text-white rounded-lg"
            >
              + Tambah Story
            </button>
          </div>
        )}

        {/* STEP 6: Amplop & Live Streaming */}
        {current === 5 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Floating id="apBank" label="Nama Bank *">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                value={angpao.bank}
                onChange={e => setAngpao(p => ({ ...p, bank: e.target.value }))}
              />
            </Floating>
            <Floating id="apRek" label="No. Rekening *">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                value={angpao.rekening}
                onChange={e => setAngpao(p => ({ ...p, rekening: e.target.value }))}
              />
            </Floating>
            <Floating id="apNama" label="Atas Nama *">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]}"
                value={angpao.atasNama}
                onChange={e => setAngpao(p => ({ ...p, atasNama: e.target.value }))}
              />
            </Floating>
            <Floating id="liveLink" label="Link Streaming *">
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]}"
                value={live.link}
                onChange={e => setLive(p => ({ ...p, link: e.target.value }))}
              />
            </Floating>
            <Floating id="liveTanggal" label="Tanggal Streaming *">
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]}"
                value={live.tanggal}
                onChange={e => setLive(p => ({ ...p, tanggal: e.target.value }))}
              />
            </Floating>
            <Floating id="liveWaktu" label="Jam Streaming *">
              <input
                type="time"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]}"
                value={live.waktu}
                onChange={e => setLive(p => ({ ...p, waktu: e.target.value }))}
              />
            </Floating>
            <Floating id="liveZona" label="Zona Waktu *">
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]}"
                value={live.zona}
                onChange={e => setLive(p => ({ ...p, zona: e.target.value }))}
              >
                <option value="WIB">WIB</option>
                <option value="WITA">WITA</option>
                <option value="WIT">WIT</option>
              </select>
            </Floating>
            <p className="text-sm text-gray-600">
              Preview: {formatTime(live.waktu)} — {live.zona}
            </p>
          </div>
        )}

        {/* STEP 7: Review & Kirim */}
        {current === 6 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#B03052] flex items-center mb-3">
              <svg className="w-6 h-6 mr-2 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Review Data
            </h3>
            
            <div className="bg-white rounded-xl p-5 max-h-96 overflow-y-auto divide-y divide-pink-100 shadow-sm border border-pink-50">
              {/* Tema & Paket */}
              <div className="py-3">
                <h4 className="font-semibold text-[#B03052] mb-3 flex items-center">
                  <div className="bg-[#F9EDF0] p-2 rounded-full mr-2">
                    <svg className="w-5 h-5 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  Tema & Paket
                </h4>
                <div className="flex flex-col space-y-2 text-sm bg-[#FDFAFC] p-4 rounded-xl shadow-sm border border-pink-50 hover:bg-[#FEF6FA] transition-all duration-300">
                      <div className="flex items-center">
                    <div className="w-28 md:w-32 text-right font-medium text-gray-600">Tema</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                    <div className="flex-1 font-medium text-gray-800">{temaUndangan}</div>
                      </div>
                  
                  {subTema && (
                      <div className="flex items-center">
                      <div className="w-28 md:w-32 text-right font-medium text-gray-600">Sub Tema</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                      <div className="flex-1 font-medium text-gray-800">{subTema}</div>
                      </div>
                  )}
                  
                      <div className="flex items-center">
                    <div className="w-28 md:w-32 text-right font-medium text-gray-600">Paket</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                    <div className="flex-1 font-medium text-gray-800">{paketUndangan}</div>
                      </div>
                  
                  {pilihanTanpaFoto && (
                      <div className="flex items-center">
                      <div className="w-28 md:w-32 text-right font-medium text-gray-600">Pilihan</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                      <div className="flex-1 font-medium text-gray-800">{pilihanTanpaFoto}</div>
                      </div>
                  )}
                  
                      <div className="flex items-center">
                    <div className="w-28 md:w-32 text-right font-medium text-gray-600">Urutan</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                    <div className="flex-1 font-medium text-gray-800">{urutanMempelai === 'pria' ? 'Pria Didahulukan' : 'Wanita Didahulukan'}</div>
                      </div>
                        </div>
                    </div>
                    
                    {/* Data Mempelai */}
                    <div className="py-3">
                      <h4 className="font-semibold text-[#B03052] mb-3 flex items-center">
                  <div className="bg-[#F9EDF0] p-2 rounded-full mr-2">
                          <svg className="w-5 h-5 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                  Data Mempelai
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-[#FDFAFC] p-4 rounded-xl shadow-sm border border-pink-50 hover:bg-[#FEF6FA] transition-all duration-300">
                          <div className="font-semibold flex items-center mb-3 text-[#B03052] border-b border-pink-100 pb-2">
                            <div className="bg-[#F9EDF0] p-1.5 rounded-full mr-2">
                              <svg className="w-4 h-4 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            Mempelai Pria
                          </div>
                          <div className="flex flex-col space-y-2 mt-3">
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Nama Panggilan</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 font-semibold text-gray-800">{pria.panggilan}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Nama Lengkap</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 font-medium text-gray-800">{pria.lengkap}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Putra ke</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 text-gray-800">{pria.anakKe}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Ayah</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 text-gray-800">{pria.ayah}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Ibu</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 text-gray-800">{pria.ibu}</div>
                            </div>
                            {pria.sosmed && (
                              <div className="flex items-center">
                                <div className="w-28 md:w-32 text-right text-gray-600">Sosmed</div>
                                <div className="w-5 text-center text-pink-300">:</div>
                                <div className="flex-1 text-gray-800">{pria.sosmed}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-[#FDFAFC] p-4 rounded-xl shadow-sm border border-pink-50 hover:bg-[#FEF6FA] transition-all duration-300">
                          <div className="font-semibold flex items-center mb-3 text-[#B03052] border-b border-pink-100 pb-2">
                            <div className="bg-[#F9EDF0] p-1.5 rounded-full mr-2">
                              <svg className="w-4 h-4 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            Mempelai Wanita
                          </div>
                          <div className="flex flex-col space-y-2 mt-3">
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Nama Panggilan</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 font-semibold text-gray-800">{wanita.panggilan}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Nama Lengkap</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 font-medium text-gray-800">{wanita.lengkap}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Putri ke</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 text-gray-800">{wanita.anakKe}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Ayah</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 text-gray-800">{wanita.ayah}</div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-28 md:w-32 text-right text-gray-600">Ibu</div>
                              <div className="w-5 text-center text-pink-300">:</div>
                              <div className="flex-1 text-gray-800">{wanita.ibu}</div>
                            </div>
                            {wanita.sosmed && (
                              <div className="flex items-center">
                                <div className="w-28 md:w-32 text-right text-gray-600">Sosmed</div>
                                <div className="w-5 text-center text-pink-300">:</div>
                                <div className="flex-1 text-gray-800">{wanita.sosmed}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Acara */}
                    <div className="py-3">
                      <h4 className="font-semibold text-[#B03052] mb-3 flex items-center">
                  <div className="bg-[#F9EDF0] p-2 rounded-full mr-2">
                          <svg className="w-5 h-5 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                  Detail Acara
                      </h4>
                      <div className="space-y-3 text-sm">
                        {acaraList.map((acara, i) => (
                          <div key={i} className="p-4 border border-pink-100 rounded-xl bg-[#FDFAFC] hover:bg-[#FEF6FA] shadow-sm transition-all duration-300">
                            <div className="font-semibold text-[#B03052] flex items-center border-b border-pink-100 pb-2 mb-2">
                              <span className="flex items-center justify-center w-6 h-6 bg-[#B03052] text-white rounded-full text-xs mr-2 shadow-sm">{i+1}</span>
                              {acara.nama}
                            </div>
                            <div className="flex flex-col space-y-2 mt-3">
                              <div className="flex items-center">
                                <div className="w-20 md:w-24 text-right text-gray-600">Tanggal</div>
                                <div className="w-5 text-center text-pink-300">:</div>
                                <div className="flex-1 font-medium text-gray-800">{acara.tanggal}</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-20 md:w-24 text-right text-gray-600">Waktu</div>
                                <div className="w-5 text-center text-pink-300">:</div>
                                <div className="flex-1 font-medium text-gray-800">{formatTime(acara.waktu)} {acara.zona}</div>
                              </div>
                              {acara.tempat && (
                                <div className="flex items-center">
                                  <div className="w-20 md:w-24 text-right text-gray-600">Tempat</div>
                                  <div className="w-5 text-center text-pink-300">:</div>
                                  <div className="flex-1 text-gray-800">{acara.tempat}</div>
                                </div>
                              )}
                              {acara.link && (
                                <div className="flex items-center">
                                  <div className="w-20 md:w-24 text-right text-gray-600">Maps</div>
                                  <div className="w-5 text-center text-pink-300">:</div>
                                  <div className="flex-1">
                                    <a href={acara.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                      Lihat Lokasi
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Musik */}
                    <div className="py-3">
                      <h4 className="font-semibold text-[#B03052] mb-3 flex items-center">
                  <div className="bg-[#F9EDF0] p-2 rounded-full mr-2">
                          <svg className="w-5 h-5 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                  Musik
                      </h4>
                      <div className="text-sm break-words bg-[#FDFAFC] p-4 rounded-xl shadow-sm border border-pink-50 hover:bg-[#FEF6FA] transition-all duration-300">
                        <div className="mb-2">
                          <span className="font-medium">URL:</span> {backsound}
                        </div>
                        <div>
                          <span className="font-medium">Mulai di detik ke:</span> {mulaiMusik}
                        </div>
                      </div>
                    </div>
                    
                    {/* Love Story */}
                    <div className="py-3">
                      <h4 className="font-semibold text-[#B03052] mb-3 flex items-center">
                  <div className="bg-[#F9EDF0] p-2 rounded-full mr-2">
                          <svg className="w-5 h-5 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                  Love Story
                      </h4>
                      <div className="space-y-3 text-sm">
                        {stories.map((s, i) => (
                          <div key={i} className="border p-4 rounded-lg bg-white">
                            <h4 className="font-semibold text-[#B03052]">Story {i + 1}</h4>
                            <Floating id={`lsJudul${i}`} label="Judul Love Story *">
                          <input
                            type="text"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                                value={s.judul}
                                onChange={e => {
                                  const tmp = [...stories]; tmp[i].judul = e.target.value; setStories(tmp);
                                }}
                            />
                        </Floating>
                            <Floating id={`lsTanggal${i}`} label="Tanggal Love Story">
                          <input
                            type="date"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                                value={s.tanggal}
                                onChange={e => {
                                  const tmp = [...stories]; tmp[i].tanggal = e.target.value; setStories(tmp);
                                }}
                          />
                        </Floating>
                            <Floating id={`lsDeskripsi${i}`} label="Deskripsi Love Story *">
                          <textarea
                                rows={3}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#D76C82]"
                                value={s.deskripsi}
                                onChange={e => {
                                  const tmp = [...stories]; tmp[i].deskripsi = e.target.value; setStories(tmp);
                                }}
                          />
                        </Floating>
                            {stories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStory(i)}
                                className="text-sm text-red-600"
                              >
                                Hapus Story
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addStory}
                          className="px-4 py-2 bg-[#B03052] text-white rounded-lg"
                        >
                          + Tambah Story
                        </button>
                      </div>
                    </div>
                    
                    {/* Amplop & Streaming */}
                    <div className="py-3">
                      <h4 className="font-semibold text-[#B03052] mb-3 flex items-center">
                  <div className="bg-[#F9EDF0] p-2 rounded-full mr-2">
                          <svg className="w-5 h-5 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  Amplop & Live Streaming
                </h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {/* Rekening Section */}
                  <div className="bg-[#FDFAFC] p-4 rounded-xl shadow-sm border border-pink-50 hover:bg-[#FEF6FA] transition-all duration-300">
                    <div className="font-medium flex items-center mb-2">
                      <div className="bg-[#F9EDF0] p-1.5 rounded-full mr-1">
                        <svg className="w-4 h-4 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      </div>
                      Rekening
                    </div>
                    <div className="flex flex-col space-y-2 mt-3">
                      <div className="flex items-center">
                        <div className="w-20 md:w-24 text-right text-gray-600">Bank</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                        <div className="flex-1 font-medium text-gray-800">{angpao.bank}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-20 md:w-24 text-right text-gray-600">No. Rekening</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                        <div className="flex-1 font-medium text-gray-800">{angpao.rekening}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-20 md:w-24 text-right text-gray-600">Atas Nama</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                        <div className="flex-1 font-medium text-gray-800">{angpao.atasNama}</div>
                      </div>
                    </div>
                  </div>

                  {/* Live Streaming Section */}
                    <div className="bg-[#FDFAFC] p-4 rounded-xl shadow-sm border border-pink-50 hover:bg-[#FEF6FA] transition-all duration-300">
                      <div className="font-medium flex items-center mb-2">
                        <div className="bg-[#F9EDF0] p-1.5 rounded-full mr-1">
                          <svg className="w-4 h-4 text-[#D76C82]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        Live Streaming
                      </div>
                    <div className="flex flex-col space-y-2 mt-3">
                      <div className="flex items-center">
                        <div className="w-20 md:w-24 text-right text-gray-600">Link</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                        <div className="flex-1">
                          <a href={live.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            Lihat Link
                          </a>
                    </div>
                  </div>
                      <div className="flex items-center">
                        <div className="w-20 md:w-24 text-right text-gray-600">Tanggal</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                        <div className="flex-1 font-medium text-gray-800">{live.tanggal}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-20 md:w-24 text-right text-gray-600">Waktu</div>
                        <div className="w-5 text-center text-pink-300">:</div>
                        <div className="flex-1 font-medium text-gray-800">{formatTime(live.waktu)} {live.zona}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <label className="inline-flex items-center space-x-2 mt-4 p-2 bg-[#f9f5f6] rounded-lg border border-[#e6d9dd]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="form-checkbox h-5 w-5 text-[#B03052]"
              />
              <span>Saya sudah memeriksa dan setuju mengirim data</span>
            </label>
          </div>
        )}

        {/* STEP 8: Selesai */}
        {current === 7 && (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#B03052] mb-2">Terima Kasih!</h3>
            <p className="mb-4">Data undangan Anda telah berhasil disimpan.</p>
            <p className="text-sm text-gray-600 mb-6">Untuk informasi lebih lanjut, silakan hubungi admin kami melalui WhatsApp.</p>
            
            <button 
              type="button"
              onClick={handleWhatsAppRedirect}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex mx-auto items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Hubungi Admin WhatsApp
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-[#6B1B26]">
          {current === 7 ? (
            <div></div> // Empty div to maintain flex layout when button is hidden
          ) : (
            <button type="button" onClick={prev} disabled={current === 0}
            className="px-6 py-2 bg-gray-300 rounded disabled:opacity-50">
            Sebelumnya
          </button>
          )}
          {current < 6 ? (
            <button type="button" onClick={next} disabled={!canNext}
              className={`px-6 py-2 rounded ${
                canNext ? 'bg-[#6B1B26] text-white' : 'bg-gray-400 text-gray-200'
              }`}>
              Lanjut
            </button>
          ) : current === 6 ? (
            <button type="button" onClick={handleSubmit} disabled={!agreed}
              className={`px-6 py-2 rounded ${
                agreed ? 'bg-[#D76C82] text-white' : 'bg-gray-400 text-gray-200'
              }`}>
              Kirim
            </button>
          ) : (
            <button type="button" 
              onClick={handleWhatsAppRedirect}
              className="px-6 py-2 bg-[#6B1B26] text-white rounded">
              Selesai
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
