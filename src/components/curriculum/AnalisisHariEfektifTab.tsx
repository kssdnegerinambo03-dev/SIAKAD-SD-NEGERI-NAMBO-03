import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  Printer,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Clock,
  Sparkles,
  Info,
  CalendarCheck2,
  Save
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AnalisisHariEfektifRecord, BulanHariEfektif, AgendaPendidikan } from '../../types';
import {
  downloadHariEfektifWord,
  downloadHariEfektifExcel,
  downloadCurriculumTemplate,
  parseCurriculumExcel
} from '../../utils/curriculumExportUtils';
import { OfficialKopSurat } from '../OfficialKopSurat';

interface AnalisisHariEfektifTabProps {
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

export const AnalisisHariEfektifTab: React.FC<AnalisisHariEfektifTabProps> = ({
  onNavigateNext,
  onNavigatePrev
}) => {
  const {
    schoolProfile,
    analisisHariEfektifList,
    saveAnalisisHariEfektif,
    deleteAnalisisHariEfektif,
    importAnalisisHariEfektif,
    currentActiveUser
  } = useSchool();

  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap' | 'Setahun'>('Ganjil');
  const [selectedTargetKelas, setSelectedTargetKelas] = useState<string>('Semua Kelas');
  const [showKopSuratPreview, setShowKopSuratPreview] = useState<boolean>(false);

  // Modals state
  const [isEditMonthModalOpen, setIsEditMonthModalOpen] = useState<boolean>(false);
  const [editingMonthIndex, setEditingMonthIndex] = useState<number | null>(null);
  const [monthFormData, setMonthFormData] = useState<BulanHariEfektif>({
    bulan: '',
    kodeBulan: '',
    semester: 'Ganjil',
    jumlahHariKalender: 30,
    mingguEfektif: 4,
    hariEfektif: 18,
    hariLibur: 12,
    keteranganKegiatan: []
  });
  const [agendaInputText, setAgendaInputText] = useState<string>('');

  // Agenda Modal
  const [isAgendaModalOpen, setIsAgendaModalOpen] = useState<boolean>(false);
  const [agendaFormData, setAgendaFormData] = useState<Omit<AgendaPendidikan, 'id'>>({
    tanggalMulai: '',
    tanggalSelesai: '',
    kegiatan: '',
    semester: 'Ganjil',
    kategori: 'Kegiatan Khusus'
  });

  // Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importPreviewData, setImportPreviewData] = useState<any[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Active record based on selected semester
  const activeRecord = useMemo(() => {
    if (selectedSemester === 'Setahun') {
      const ganjil = analisisHariEfektifList.find(r => r.semester === 'Ganjil') || analisisHariEfektifList[0];
      const genap = analisisHariEfektifList.find(r => r.semester === 'Genap') || analisisHariEfektifList[1];

      const combinedBulan: BulanHariEfektif[] = [
        ...(ganjil?.daftarBulan || []),
        ...(genap?.daftarBulan || [])
      ];

      const combinedAgenda: AgendaPendidikan[] = [
        ...(ganjil?.agendaPendidikan || []),
        ...(genap?.agendaPendidikan || [])
      ];

      const combined: AnalisisHariEfektifRecord = {
        id: 'he-2026-2027-setahun',
        tahunAjaran: ganjil?.tahunAjaran || '2026-2027',
        semester: 'Setahun',
        kelasTarget: selectedTargetKelas,
        totalHariEfektif: combinedBulan.reduce((a, b) => a + b.hariEfektif, 0),
        totalMingguEfektif: combinedBulan.reduce((a, b) => a + b.mingguEfektif, 0),
        totalJamEfektif: combinedBulan.reduce((a, b) => a + b.hariEfektif, 0) * 5,
        daftarBulan: combinedBulan,
        agendaPendidikan: combinedAgenda,
        catatan: 'Analisis Hari Efektif Akumulasi 1 Tahun Pelajaran (102 HE Semester 1 + 75 HE Semester 2 = 177 Hari Efektif).',
        updatedAt: new Date().toISOString()
      };
      return combined;
    }

    const found = analisisHariEfektifList.find(r => r.semester === selectedSemester);
    if (found) return found;

    return (
      analisisHariEfektifList[0] || {
        id: 'he-default',
        tahunAjaran: '2026-2027',
        semester: selectedSemester,
        kelasTarget: 'Semua Kelas',
        totalHariEfektif: selectedSemester === 'Ganjil' ? 102 : 75,
        totalMingguEfektif: selectedSemester === 'Ganjil' ? 19 : 15,
        daftarBulan: [],
        agendaPendidikan: [],
        updatedAt: new Date().toISOString()
      }
    );
  }, [analisisHariEfektifList, selectedSemester, selectedTargetKelas]);

  // Statistics
  const totalHariKalender = useMemo(() => {
    return activeRecord.daftarBulan.reduce((acc, b) => acc + (Number(b.jumlahHariKalender) || 0), 0);
  }, [activeRecord]);

  const totalMingguEfektif = useMemo(() => {
    return activeRecord.daftarBulan.reduce((acc, b) => acc + (Number(b.mingguEfektif) || 0), 0);
  }, [activeRecord]);

  const totalHariEfektif = useMemo(() => {
    return activeRecord.daftarBulan.reduce((acc, b) => acc + (Number(b.hariEfektif) || 0), 0);
  }, [activeRecord]);

  const totalHariLibur = useMemo(() => {
    return activeRecord.daftarBulan.reduce((acc, b) => acc + (Number(b.hariLibur) || 0), 0);
  }, [activeRecord]);

  // Open Edit Month Modal
  const handleOpenEditMonth = (b: BulanHariEfektif, idx: number) => {
    setEditingMonthIndex(idx);
    setMonthFormData({ ...b });
    setAgendaInputText(b.keteranganKegiatan.join('\n'));
    setIsEditMonthModalOpen(true);
  };

  // Open Add Month Modal
  const handleOpenAddMonth = () => {
    setEditingMonthIndex(null);
    setMonthFormData({
      bulan: '',
      kodeBulan: '',
      semester: selectedSemester === 'Genap' ? 'Genap' : 'Ganjil',
      jumlahHariKalender: 30,
      mingguEfektif: 4,
      hariEfektif: 18,
      hariLibur: 12,
      keteranganKegiatan: []
    });
    setAgendaInputText('');
    setIsEditMonthModalOpen(true);
  };

  // Save Month
  const handleSaveMonth = () => {
    if (!monthFormData.bulan.trim()) {
      alert('Nama bulan tidak boleh kosong!');
      return;
    }

    const agendaList = agendaInputText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedMonth: BulanHariEfektif = {
      ...monthFormData,
      jumlahHariKalender: Number(monthFormData.jumlahHariKalender) || 30,
      mingguEfektif: Number(monthFormData.mingguEfektif) || 4,
      hariEfektif: Number(monthFormData.hariEfektif) || 18,
      hariLibur: Number(monthFormData.hariLibur) || 12,
      keteranganKegiatan: agendaList
    };

    let newDaftarBulan = [...activeRecord.daftarBulan];
    if (editingMonthIndex !== null && editingMonthIndex >= 0) {
      newDaftarBulan[editingMonthIndex] = updatedMonth;
    } else {
      newDaftarBulan.push(updatedMonth);
    }

    const updatedRecord: AnalisisHariEfektifRecord = {
      ...activeRecord,
      totalHariEfektif: newDaftarBulan.reduce((a, b) => a + b.hariEfektif, 0),
      totalMingguEfektif: newDaftarBulan.reduce((a, b) => a + b.mingguEfektif, 0),
      daftarBulan: newDaftarBulan,
      updatedAt: new Date().toISOString()
    };

    saveAnalisisHariEfektif(updatedRecord);
    setIsEditMonthModalOpen(false);
  };

  // Delete Month
  const handleDeleteMonth = (idx: number) => {
    if (!window.confirm('Hapus rincian bulan ini dari analisis hari efektif?')) return;
    const newDaftarBulan = activeRecord.daftarBulan.filter((_, i) => i !== idx);
    const updatedRecord: AnalisisHariEfektifRecord = {
      ...activeRecord,
      totalHariEfektif: newDaftarBulan.reduce((a, b) => a + b.hariEfektif, 0),
      totalMingguEfektif: newDaftarBulan.reduce((a, b) => a + b.mingguEfektif, 0),
      daftarBulan: newDaftarBulan,
      updatedAt: new Date().toISOString()
    };
    saveAnalisisHariEfektif(updatedRecord);
  };

  // Add Agenda
  const handleSaveAgenda = () => {
    if (!agendaFormData.kegiatan.trim() || !agendaFormData.tanggalMulai) {
      alert('Tanggal mulai dan nama kegiatan wajib diisi!');
      return;
    }

    const newAgenda: AgendaPendidikan = {
      ...agendaFormData,
      id: `ag-${Date.now()}`
    };

    const updatedRecord: AnalisisHariEfektifRecord = {
      ...activeRecord,
      agendaPendidikan: [...activeRecord.agendaPendidikan, newAgenda],
      updatedAt: new Date().toISOString()
    };

    saveAnalisisHariEfektif(updatedRecord);
    setIsAgendaModalOpen(false);
    setAgendaFormData({
      tanggalMulai: '',
      tanggalSelesai: '',
      kegiatan: '',
      semester: selectedSemester === 'Genap' ? 'Genap' : 'Ganjil',
      kategori: 'Kegiatan Khusus'
    });
  };

  // Delete Agenda
  const handleDeleteAgenda = (id: string) => {
    if (!window.confirm('Hapus kegiatan ini dari kalender pendidikan?')) return;
    const updatedRecord: AnalisisHariEfektifRecord = {
      ...activeRecord,
      agendaPendidikan: activeRecord.agendaPendidikan.filter(a => a.id !== id),
      updatedAt: new Date().toISOString()
    };
    saveAnalisisHariEfektif(updatedRecord);
  };

  // Import handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccessMsg(null);

    try {
      if (file.name.endsWith('.json')) {
        const text = await file.text();
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          setImportPreviewData(json);
        } else if (json.daftarBulan) {
          setImportPreviewData([json]);
        } else {
          setImportError('Format berkas JSON tidak sesuai struktur Analisis Hari Efektif.');
        }
      } else {
        const parsed = await parseCurriculumExcel(file);
        if (parsed.length === 0) {
          setImportError('Berkas Excel kosong atau tidak terbaca.');
          return;
        }
        setImportPreviewData(parsed);
      }
    } catch (err: any) {
      setImportError(`Gagal membaca berkas: ${err.message || 'Format tidak didukung'}`);
    }
  };

  const handleConfirmImport = () => {
    if (!importPreviewData || importPreviewData.length === 0) return;

    try {
      // If it's already an array of AnalisisHariEfektifRecord
      if (importPreviewData[0].daftarBulan && Array.isArray(importPreviewData[0].daftarBulan)) {
        importAnalisisHariEfektif(importPreviewData);
        setImportSuccessMsg(`Berhasil mengimpor ${importPreviewData.length} data analisis hari efektif!`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportPreviewData(null);
        }, 1200);
        return;
      }

      // Convert rows from template Excel to BulanHariEfektif
      const newBulanList: BulanHariEfektif[] = importPreviewData.map((row: any, idx: number) => {
        const bulan = row['Bulan'] || row['Bulan & Tahun'] || row['bulan'] || `Bulan ${idx + 1}`;
        const kodeBulan = row['Kode Bulan'] || row['kodeBulan'] || `2026-${String(idx + 7).padStart(2, '0')}`;
        const semester = (row['Semester'] || selectedSemester) === 'Genap' ? 'Genap' : 'Ganjil';
        const hk = Number(row['Hari Kalender'] || row['Hari Kalender (HK)'] || row['HK'] || 30);
        const me = Number(row['Minggu Efektif'] || row['Minggu Efektif (ME)'] || row['ME'] || 4);
        const he = Number(row['Hari Efektif'] || row['Hari Efektif Belajar (HE)'] || row['HE'] || 18);
        const hl = Number(row['Hari Libur'] || row['Hari Libur (HL)'] || row['HL'] || (hk - he));
        const rawKet = row['Keterangan Agenda'] || row['Keterangan Agenda / Kegiatan'] || row['keterangan'] || '';
        const keteranganKegiatan = typeof rawKet === 'string'
          ? rawKet.split(';').map(s => s.trim()).filter(Boolean)
          : Array.isArray(rawKet) ? rawKet : [];

        return {
          bulan,
          kodeBulan,
          semester,
          jumlahHariKalender: hk,
          mingguEfektif: me,
          hariEfektif: he,
          hariLibur: hl,
          keteranganKegiatan
        };
      });

      const updatedRecord: AnalisisHariEfektifRecord = {
        ...activeRecord,
        totalHariEfektif: newBulanList.reduce((a, b) => a + b.hariEfektif, 0),
        totalMingguEfektif: newBulanList.reduce((a, b) => a + b.mingguEfektif, 0),
        daftarBulan: newBulanList,
        updatedAt: new Date().toISOString()
      };

      saveAnalisisHariEfektif(updatedRecord);
      setImportSuccessMsg(`Berhasil mengimpor ${newBulanList.length} bulan ke Analisis Hari Efektif!`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportPreviewData(null);
      }, 1200);
    } catch (err: any) {
      setImportError(`Gagal menyimpan data import: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-semibold backdrop-blur-sm">
              <CalendarCheck2 className="w-4 h-4 text-emerald-200" />
              <span>Tahap 6: Analisis Alokasi Waktu Pembelajaran</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Analisis Hari Efektif Belajar (HEB)
            </h2>
            <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              Penetapan resmi alokasi minggu efektif dan hari belajar aktif Kurikulum Merdeka TA 2026/2027 SD Negeri Nambo 03, terintegrasi langsung dengan Prota, Promes, dan Modul Ajar Deep Learning.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => downloadHariEfektifWord(activeRecord, schoolProfile)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              title="Download dokumen resmi format Word dengan Kop Surat dan Logo Sekolah"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Download Word (.doc)</span>
            </button>

            <button
              onClick={() => downloadHariEfektifExcel(activeRecord, schoolProfile)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs sm:text-sm border border-emerald-400/40 shadow-md active:scale-95 transition-all cursor-pointer"
              title="Download berkas spreadsheet format Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Cetak Berkas"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar & Filter */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Semester selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Semester:</span>
          {(['Ganjil', 'Genap', 'Setahun'] as const).map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSemester(sem)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedSemester === sem
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {sem === 'Ganjil' && 'Semester 1 (Ganjil - 102 HE)'}
              {sem === 'Genap' && 'Semester 2 (Genap - 75 HE)'}
              {sem === 'Setahun' && '1 Tahun Ajaran (177 HE)'}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowKopSuratPreview(!showKopSuratPreview)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showKopSuratPreview
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {showKopSuratPreview ? 'Sembunyikan Kop Surat' : 'Tinjau Kop Surat'}
          </button>

          <button
            onClick={() => downloadCurriculumTemplate('hari-efektif')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            title="Download template format pengisian Excel untuk Hari Efektif"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Template Excel</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-600" />
            <span>Import Berkas</span>
          </button>

          <button
            onClick={handleOpenAddMonth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Input Bulan Manual</span>
          </button>
        </div>
      </div>

      {/* Official Kop Surat Preview */}
      {showKopSuratPreview && (
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Pratinjau Kop Surat Resmi Hasil Download Word & Cetak
            </span>
            <button
              onClick={() => setShowKopSuratPreview(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <OfficialKopSurat />
        </div>
      )}

      {/* Summary KPI Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Hari Kalender</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-800">{totalHariKalender} <span className="text-xs font-medium text-slate-500">Hari</span></div>
          <div className="text-[11px] text-slate-500 mt-0.5">Total hari dalam kalender</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm bg-blue-50/20">
          <div className="flex items-center justify-between text-blue-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Minggu Efektif</span>
            <CalendarCheck2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-900">{totalMingguEfektif} <span className="text-xs font-medium text-blue-600">Minggu</span></div>
          <div className="text-[11px] text-blue-600 mt-0.5">Pekan aktif tatap muka</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm bg-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Hari Efektif (HE)</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-900">{totalHariEfektif} <span className="text-xs font-bold text-emerald-700">Hari Aktif</span></div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            {selectedSemester === 'Ganjil' ? '102 HE (Sesuai Lampiran)' : selectedSemester === 'Genap' ? '75 HE (Sesuai Lampiran)' : '177 HE (Sesuai Lampiran)'}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Hari Libur</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-900">{totalHariLibur} <span className="text-xs font-medium text-rose-600">Hari</span></div>
          <div className="text-[11px] text-rose-600 mt-0.5">Hari Minggu & Libur Nasional</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm bg-purple-50/20 col-span-2 sm:col-span-4 xl:col-span-1">
          <div className="flex items-center justify-between text-purple-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Jam Efektif</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-900">{totalHariEfektif * 5} <span className="text-xs font-medium text-purple-600">JP</span></div>
          <div className="text-[11px] text-purple-600 mt-0.5">@ 35 Menit per Jam Pelajaran</div>
        </div>
      </div>

      {/* Main Table: Rincian Hari Efektif per Bulan */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              Tabel Analisis Alokasi Waktu per Bulan ({selectedSemester.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian Hari Kalender (HK), Minggu Efektif (ME), Hari Efektif Belajar (HE), dan Hari Libur (HL)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full border border-emerald-300">
              {activeRecord.daftarBulan.length} Bulan Terdaftar
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-100/80 text-slate-800 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-center w-12">No</th>
                <th className="px-5 py-3 w-40">Bulan & Tahun</th>
                <th className="px-4 py-3 text-center w-24">Hari Kalender</th>
                <th className="px-4 py-3 text-center w-28">Minggu Efektif</th>
                <th className="px-4 py-3 text-center w-28">Hari Efektif</th>
                <th className="px-4 py-3 text-center w-24">Hari Libur</th>
                <th className="px-5 py-3">Keterangan Kegiatan / Agenda Sekolah</th>
                <th className="px-4 py-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {activeRecord.daftarBulan.map((b, idx) => (
                <tr key={b.kodeBulan || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 text-center font-bold text-slate-500">{idx + 1}</td>
                  <td className="px-5 py-3.5 font-extrabold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{b.bulan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{b.jumlahHariKalender}</td>
                  <td className="px-4 py-3.5 text-center font-bold text-blue-700 bg-blue-50/40">
                    {b.mingguEfektif} Minggu
                  </td>
                  <td className="px-4 py-3.5 text-center font-extrabold text-emerald-800 bg-emerald-50/60">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-200/80 font-black text-emerald-950">
                      {b.hariEfektif} Hari
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center font-semibold text-rose-700 bg-rose-50/30">
                    {b.hariLibur} Hari
                  </td>
                  <td className="px-5 py-3.5">
                    {b.keteranganKegiatan && b.keteranganKegiatan.length > 0 ? (
                      <ul className="space-y-1">
                        {b.keteranganKegiatan.map((ket, kIdx) => (
                          <li key={kIdx} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <span className="text-emerald-600 font-black">•</span>
                            <span>{ket}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400 italic text-xs">PBM Efektif Reguler</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditMonth(b, idx)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit data bulan ini"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMonth(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus bulan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="bg-slate-100/90 font-black text-slate-900 border-t-2 border-slate-300">
                <td colSpan={2} className="px-5 py-4 text-center tracking-wider text-xs uppercase">
                  JUMLAH TOTAL ({selectedSemester.toUpperCase()})
                </td>
                <td className="px-4 py-4 text-center">{totalHariKalender} Hari</td>
                <td className="px-4 py-4 text-center text-blue-900">{totalMingguEfektif} Minggu</td>
                <td className="px-4 py-4 text-center text-emerald-950 bg-emerald-200/90 text-sm">
                  {totalHariEfektif} HARI EFEKTIF
                </td>
                <td className="px-4 py-4 text-center text-rose-900">{totalHariLibur} Hari</td>
                <td colSpan={2} className="px-5 py-4 text-xs font-semibold text-slate-600 italic">
                  Sesuai Kalender Pendidikan Resmi SD Negeri Nambo 03
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Agenda Pendidikan & Asesmen Card Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
              <span>Kalender Agenda Khusus, Asesmen & Libur Sekolah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal pelaksanaan MPLS, STS, ASAS, SANLAT Ramadhan, ASAJ, dan pembagian rapor resmi
            </p>
          </div>
          <button
            onClick={() => setIsAgendaModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Agenda Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {activeRecord.agendaPendidikan.map(ag => {
            const isLibur = ag.kategori === 'Libur';
            const isAsesmen = ag.kategori === 'STS' || ag.kategori === 'ASAS' || ag.kategori === 'ASAJ';
            const isMPLS = ag.kategori === 'MPLS';

            return (
              <div
                key={ag.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isLibur
                    ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
                    : isAsesmen
                    ? 'bg-indigo-50/50 border-indigo-200 hover:border-indigo-300'
                    : isMPLS
                    ? 'bg-sky-50/50 border-sky-200 hover:border-sky-300'
                    : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isLibur
                        ? 'bg-rose-200 text-rose-900'
                        : isAsesmen
                        ? 'bg-indigo-200 text-indigo-900'
                        : isMPLS
                        ? 'bg-sky-200 text-sky-900'
                        : 'bg-emerald-200 text-emerald-900'
                    }`}
                  >
                    {ag.kategori}
                  </span>

                  <button
                    onClick={() => handleDeleteAgenda(ag.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                    title="Hapus agenda ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="font-extrabold text-sm text-slate-800 mt-2 line-clamp-2">
                  {ag.kegiatan}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-2.5 pt-2.5 border-t border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {ag.tanggalMulai}
                    {ag.tanggalSelesai && ag.tanggalSelesai !== ag.tanggalMulai ? ` s.d. ${ag.tanggalSelesai}` : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stepper Navigation Footer Banner */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onNavigatePrev}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
        >
          <span>← Kembali ke Langkah 5: Promes</span>
        </button>

        <div className="text-center text-xs text-slate-500 font-medium hidden sm:block">
          Langkah 6 dari 8: Analisis Alokasi Waktu Hari Efektif
        </div>

        <button
          onClick={onNavigateNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 7: Jadwal Pelajaran (35 Menit) →</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: EDIT / TAMBAH BULAN HARI EFEKTIF                */}
      {/* ======================================================== */}
      {isEditMonthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                {editingMonthIndex !== null ? 'Edit Rincian Bulan Hari Efektif' : 'Tambah Bulan Baru'}
              </h3>
              <button
                onClick={() => setIsEditMonthModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Bulan & Tahun</label>
                  <input
                    type="text"
                    value={monthFormData.bulan}
                    onChange={e => setMonthFormData({ ...monthFormData, bulan: e.target.value })}
                    placeholder="Contoh: Juli 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kode Bulan</label>
                  <input
                    type="text"
                    value={monthFormData.kodeBulan}
                    onChange={e => setMonthFormData({ ...monthFormData, kodeBulan: e.target.value })}
                    placeholder="Contoh: 2026-07"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari Kalender</label>
                  <input
                    type="number"
                    value={monthFormData.jumlahHariKalender}
                    onChange={e => setMonthFormData({ ...monthFormData, jumlahHariKalender: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minggu Efektif</label>
                  <input
                    type="number"
                    value={monthFormData.mingguEfektif}
                    onChange={e => setMonthFormData({ ...monthFormData, mingguEfektif: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari Efektif</label>
                  <input
                    type="number"
                    value={monthFormData.hariEfektif}
                    onChange={e => setMonthFormData({ ...monthFormData, hariEfektif: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari Libur</label>
                  <input
                    type="number"
                    value={monthFormData.hariLibur}
                    onChange={e => setMonthFormData({ ...monthFormData, hariLibur: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Agenda / Kegiatan Sekolah (Pisahkan baris baru per kegiatan)
                </label>
                <textarea
                  rows={4}
                  value={agendaInputText}
                  onChange={e => setAgendaInputText(e.target.value)}
                  placeholder="Contoh:&#10;15 - 21 Juli: MPLS Murid Baru&#10;22 Juli: Awal PBM Efektif"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsEditMonthModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveMonth}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Simpan Rincian
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TAMBAH AGENDA PENDIDIKAN                        */}
      {/* ======================================================== */}
      {isAgendaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                Tambah Agenda / Kegiatan Sekolah
              </h3>
              <button
                onClick={() => setIsAgendaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kegiatan / Agenda</label>
                <input
                  type="text"
                  value={agendaFormData.kegiatan}
                  onChange={e => setAgendaFormData({ ...agendaFormData, kegiatan: e.target.value })}
                  placeholder="Contoh: Sumatif Tengah Semester (STS) Ganjil"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={agendaFormData.tanggalMulai}
                    onChange={e => setAgendaFormData({ ...agendaFormData, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Selesai (Opsional)</label>
                  <input
                    type="date"
                    value={agendaFormData.tanggalSelesai}
                    onChange={e => setAgendaFormData({ ...agendaFormData, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <select
                  value={agendaFormData.kategori}
                  onChange={e => setAgendaFormData({ ...agendaFormData, kategori: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                >
                  <option value="MPLS">MPLS (Masa Pengenalan Lingkungan Sekolah)</option>
                  <option value="STS">STS (Sumatif Tengah Semester)</option>
                  <option value="ASAS">ASAS (Asesmen Sumatif Akhir Semester)</option>
                  <option value="ASAJ">ASAJ (Asesmen Akhir Jenjang/Tahun)</option>
                  <option value="Rapor">Pembagian Rapor</option>
                  <option value="Libur">Libur Sekolah / Semester</option>
                  <option value="Kegiatan Khusus">Kegiatan Khusus / Peringatan</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsAgendaModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAgenda}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Simpan Agenda
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: IMPORT BERKAS (EXCEL / CSV / JSON)              */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Import Berkas Hari Efektif Belajar
                  </h3>
                  <p className="text-xs text-slate-500">Mendukung berkas Excel (.xlsx), CSV, dan JSON</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreviewData(null);
                  setImportError(null);
                  setImportSuccessMsg(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {importSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {importError && (
              <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                id="file-upload-he"
                accept=".xlsx,.xls,.csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload-he"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-10 h-10 text-emerald-600" />
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Pilih berkas Excel / JSON dari perangkat Anda
                </span>
                <span className="text-[11px] text-slate-500">
                  Gunakan format sesuai template resmi SDN Nambo 03
                </span>
              </label>
            </div>

            {importPreviewData && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Pratinjau Data ({importPreviewData.length} baris terbaca):</span>
                </div>
                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 text-[11px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-slate-600 text-left">
                        <th className="p-1">#</th>
                        <th className="p-1">Bulan</th>
                        <th className="p-1 text-center">HK</th>
                        <th className="p-1 text-center">ME</th>
                        <th className="p-1 text-center">HE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreviewData.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b border-slate-200/50">
                          <td className="p-1">{i + 1}</td>
                          <td className="p-1 font-bold">{row['Bulan'] || row['Bulan & Tahun'] || row['bulan'] || '-'}</td>
                          <td className="p-1 text-center">{row['Hari Kalender'] || row['jumlahHariKalender'] || '-'}</td>
                          <td className="p-1 text-center text-blue-700 font-bold">{row['Minggu Efektif'] || row['mingguEfektif'] || '-'}</td>
                          <td className="p-1 text-center text-emerald-700 font-bold">{row['Hari Efektif'] || row['hariEfektif'] || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importPreviewData.length > 10 && (
                    <div className="text-center text-[10px] text-slate-500 py-1 font-semibold">
                      ... dan {importPreviewData.length - 10} baris data lainnya
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsImportModalOpen(false);
                  setImportPreviewData(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                disabled={!importPreviewData}
                onClick={handleConfirmImport}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Terapkan & Simpan ke Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
