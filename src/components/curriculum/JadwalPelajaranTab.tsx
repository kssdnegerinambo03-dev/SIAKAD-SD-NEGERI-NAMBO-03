import React, { useState, useMemo } from 'react';
import {
  Clock,
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
  X,
  Sparkles,
  BookOpen,
  User,
  MapPin,
  Coffee,
  CalendarDays,
  Layers
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { JadwalPelajaranRecord, JadwalSlot, HariBelajar } from '../../types';
import {
  downloadJadwalPelajaranWord,
  downloadJadwalPelajaranExcel,
  downloadCurriculumTemplate,
  parseCurriculumExcel
} from '../../utils/curriculumExportUtils';
import { OfficialKopSurat } from '../OfficialKopSurat';

interface JadwalPelajaranTabProps {
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

const HARI_LIST: HariBelajar[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const JadwalPelajaranTab: React.FC<JadwalPelajaranTabProps> = ({
  onNavigateNext,
  onNavigatePrev
}) => {
  const {
    schoolProfile,
    classes,
    teachers,
    jadwalPelajaranList,
    saveJadwalPelajaran,
    deleteJadwalPelajaran,
    importJadwalPelajaran,
    currentActiveUser
  } = useSchool();

  const [selectedKelasId, setSelectedKelasId] = useState<string>('c-1a');
  const [selectedHariFilter, setSelectedHariFilter] = useState<string>('Semua');
  const [showKopSuratPreview, setShowKopSuratPreview] = useState<boolean>(false);

  // Modal slot editor
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [slotFormData, setSlotFormData] = useState<Omit<JadwalSlot, 'id'>>({
    hari: 'Senin',
    jamKe: 1,
    jamMulai: '07.30',
    jamSelesai: '08.05',
    mataPelajaran: 'Pendidikan Pancasila',
    guruPengampu: 'Nurhaeni, S.Pd.',
    isIstirahat: false,
    ruangan: 'Ruang Kelas 1A',
    catatan: ''
  });

  // Modal import
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importPreviewData, setImportPreviewData] = useState<any[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  // Active class object & wali kelas
  const currentClassObj = useMemo(() => {
    return classes.find(c => c.id === selectedKelasId) || classes[0];
  }, [classes, selectedKelasId]);

  const waliKelasTeacher = useMemo(() => {
    return teachers.find(t => t.id === currentClassObj?.waliKelasId);
  }, [teachers, currentClassObj]);

  const defaultTeacherName = waliKelasTeacher
    ? waliKelasTeacher.nama
    : (currentActiveUser.role.startsWith('Guru') ? currentActiveUser.name : (teachers[0]?.nama || 'Nurhaeni, S.Pd.'));

  // Active schedule record for selected class
  const activeJadwal = useMemo(() => {
    const found = jadwalPelajaranList.find(j => j.kelasId === selectedKelasId);
    if (found) return found;

    // Fallback: create default schedule for this class
    const defaultRecord: JadwalPelajaranRecord = {
      id: `jadwal-${selectedKelasId}`,
      kelasId: selectedKelasId,
      kelasNama: currentClassObj?.nama || 'Kelas 1A',
      waliKelas: defaultTeacherName,
      tahunAjaran: schoolProfile.tahunAjaran || '2026-2027',
      semester: schoolProfile.semester || 'Ganjil',
      durasiPerJP: 35,
      slots: [
        { id: `s-${selectedKelasId}-1`, hari: 'Senin', jamKe: 0, jamMulai: '07.00', jamSelesai: '07.30', mataPelajaran: 'Upacara Bendera Merah Putih', guruPengampu: 'Dewan Guru SDN Nambo 03', ruangan: 'Lapangan Utama' },
        { id: `s-${selectedKelasId}-2`, hari: 'Senin', jamKe: 1, jamMulai: '07.30', jamSelesai: '08.05', mataPelajaran: 'Pendidikan Pancasila', guruPengampu: defaultTeacherName, ruangan: currentClassObj?.nama || 'Kelas' },
        { id: `s-${selectedKelasId}-3`, hari: 'Senin', jamKe: 2, jamMulai: '08.05', jamSelesai: '08.40', mataPelajaran: 'Pendidikan Pancasila', guruPengampu: defaultTeacherName, ruangan: currentClassObj?.nama || 'Kelas' },
        { id: `s-${selectedKelasId}-4`, hari: 'Senin', jamKe: 3, jamMulai: '08.40', jamSelesai: '09.15', mataPelajaran: 'Bahasa Indonesia', guruPengampu: defaultTeacherName, ruangan: currentClassObj?.nama || 'Kelas' },
        { id: `s-${selectedKelasId}-ist1`, hari: 'Senin', jamKe: 0, jamMulai: '09.15', jamSelesai: '09.35', mataPelajaran: 'Istirahat I & Makan Sehat', guruPengampu: '-', isIstirahat: true },
        { id: `s-${selectedKelasId}-5`, hari: 'Senin', jamKe: 4, jamMulai: '09.35', jamSelesai: '10.10', mataPelajaran: 'Bahasa Indonesia', guruPengampu: defaultTeacherName, ruangan: currentClassObj?.nama || 'Kelas' },
        { id: `s-${selectedKelasId}-6`, hari: 'Senin', jamKe: 5, jamMulai: '10.10', jamSelesai: '10.45', mataPelajaran: 'Matematika', guruPengampu: defaultTeacherName, ruangan: currentClassObj?.nama || 'Kelas' },
        { id: `s-${selectedKelasId}-7`, hari: 'Senin', jamKe: 6, jamMulai: '10.45', jamSelesai: '11.20', mataPelajaran: 'Matematika', guruPengampu: defaultTeacherName, ruangan: currentClassObj?.nama || 'Kelas' }
      ],
      updatedAt: new Date().toISOString()
    };
    return defaultRecord;
  }, [jadwalPelajaranList, selectedKelasId, currentClassObj, defaultTeacherName, schoolProfile]);

  // Statistics
  const totalSlotsCount = activeJadwal.slots.length;
  const totalBelajarSlots = activeJadwal.slots.filter(s => !s.isIstirahat && s.jamKe > 0).length;
  const totalPembiasaanSlots = activeJadwal.slots.filter(s => s.jamKe === 0 && !s.isIstirahat).length;

  // Filtered days
  const displayedDays = useMemo(() => {
    if (selectedHariFilter !== 'Semua') {
      return HARI_LIST.filter(h => h === selectedHariFilter);
    }
    return HARI_LIST;
  }, [selectedHariFilter]);

  // Open slot modal for add
  const handleOpenAddSlot = (defaultHari?: HariBelajar) => {
    setEditingSlotId(null);
    setSlotFormData({
      hari: defaultHari || (selectedHariFilter !== 'Semua' ? (selectedHariFilter as HariBelajar) : 'Senin'),
      jamKe: 1,
      jamMulai: '07.30',
      jamSelesai: '08.05',
      mataPelajaran: 'Bahasa Indonesia',
      guruPengampu: defaultTeacherName,
      isIstirahat: false,
      ruangan: currentClassObj?.nama ? `Ruang ${currentClassObj.nama}` : 'Ruang Kelas',
      catatan: ''
    });
    setIsSlotModalOpen(true);
  };

  // Open slot modal for edit
  const handleOpenEditSlot = (slot: JadwalSlot) => {
    setEditingSlotId(slot.id);
    setSlotFormData({
      hari: slot.hari,
      jamKe: slot.jamKe,
      jamMulai: slot.jamMulai,
      jamSelesai: slot.jamSelesai,
      mataPelajaran: slot.mataPelajaran,
      guruPengampu: slot.guruPengampu,
      isIstirahat: Boolean(slot.isIstirahat),
      ruangan: slot.ruangan || '',
      catatan: slot.catatan || ''
    });
    setIsSlotModalOpen(true);
  };

  // Save slot
  const handleSaveSlot = () => {
    if (!slotFormData.mataPelajaran.trim()) {
      alert('Nama mata pelajaran wajib diisi!');
      return;
    }

    let updatedSlots = [...activeJadwal.slots];

    if (editingSlotId) {
      const idx = updatedSlots.findIndex(s => s.id === editingSlotId);
      if (idx >= 0) {
        updatedSlots[idx] = {
          ...slotFormData,
          id: editingSlotId,
          jamKe: Number(slotFormData.jamKe) || 0
        };
      }
    } else {
      const newSlot: JadwalSlot = {
        ...slotFormData,
        id: `slot-${Date.now()}`,
        jamKe: Number(slotFormData.jamKe) || 0
      };
      updatedSlots.push(newSlot);
    }

    // Sort slots by day and time
    updatedSlots.sort((a, b) => {
      const dayDiff = HARI_LIST.indexOf(a.hari) - HARI_LIST.indexOf(b.hari);
      if (dayDiff !== 0) return dayDiff;
      return a.jamMulai.localeCompare(b.jamMulai);
    });

    const updatedRecord: JadwalPelajaranRecord = {
      ...activeJadwal,
      kelasId: selectedKelasId,
      kelasNama: currentClassObj?.nama || 'Kelas',
      waliKelas: defaultTeacherName,
      slots: updatedSlots,
      updatedAt: new Date().toISOString()
    };

    saveJadwalPelajaran(updatedRecord);
    setIsSlotModalOpen(false);
  };

  // Delete slot
  const handleDeleteSlot = (slotId: string) => {
    if (!window.confirm('Hapus slot pelajaran ini dari jadwal?')) return;
    const updatedSlots = activeJadwal.slots.filter(s => s.id !== slotId);
    const updatedRecord: JadwalPelajaranRecord = {
      ...activeJadwal,
      slots: updatedSlots,
      updatedAt: new Date().toISOString()
    };
    saveJadwalPelajaran(updatedRecord);
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
        } else if (json.slots) {
          setImportPreviewData([json]);
        } else {
          setImportError('Format berkas JSON tidak sesuai struktur Jadwal Pelajaran.');
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
      if (importPreviewData[0].slots && Array.isArray(importPreviewData[0].slots)) {
        importJadwalPelajaran(importPreviewData);
        setImportSuccessMsg(`Berhasil mengimpor ${importPreviewData.length} jadwal pelajaran kelas!`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setImportPreviewData(null);
        }, 1200);
        return;
      }

      // Convert rows from template Excel to JadwalSlot
      const newSlots: JadwalSlot[] = importPreviewData.map((row: any, idx: number) => {
        const rawHari = String(row['Hari'] || row['hari'] || 'Senin').trim();
        const validHari = HARI_LIST.find(h => h.toLowerCase() === rawHari.toLowerCase()) || 'Senin';
        const jamKe = Number(row['Jam Ke'] || row['jamKe']) || 0;
        const jamMulai = String(row['Jam Mulai'] || row['jamMulai'] || '07.30');
        const jamSelesai = String(row['Jam Selesai'] || row['jamSelesai'] || '08.05');
        const mapel = String(row['Mata Pelajaran'] || row['mataPelajaran'] || 'Pembelajaran');
        const guru = String(row['Guru Pengampu'] || row['guruPengampu'] || defaultTeacherName);
        const ruang = String(row['Ruang'] || row['ruangan'] || currentClassObj?.nama || '-');
        const isIst = String(row['Istirahat (Ya/Tidak)'] || row['isIstirahat'] || '').toLowerCase().includes('ya');

        return {
          id: `imp-${Date.now()}-${idx}`,
          hari: validHari,
          jamKe,
          jamMulai,
          jamSelesai,
          mataPelajaran: mapel,
          guruPengampu: guru,
          isIstirahat: isIst,
          ruangan: ruang
        };
      });

      newSlots.sort((a, b) => {
        const dayDiff = HARI_LIST.indexOf(a.hari) - HARI_LIST.indexOf(b.hari);
        if (dayDiff !== 0) return dayDiff;
        return a.jamMulai.localeCompare(b.jamMulai);
      });

      const updatedRecord: JadwalPelajaranRecord = {
        ...activeJadwal,
        kelasId: selectedKelasId,
        kelasNama: currentClassObj?.nama || 'Kelas',
        waliKelas: defaultTeacherName,
        slots: newSlots,
        updatedAt: new Date().toISOString()
      };

      saveJadwalPelajaran(updatedRecord);
      setImportSuccessMsg(`Berhasil mengimpor ${newSlots.length} slot mata pelajaran!`);
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
      <div className="bg-gradient-to-r from-blue-900 via-indigo-800 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-100 text-xs font-semibold backdrop-blur-sm">
              <Clock className="w-4 h-4 text-blue-200" />
              <span>Tahap 7: Distribusi Harian & Jam Pelajaran (35 Menit)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Jadwal Pelajaran Mingguan SD
            </h2>
            <p className="text-blue-100/90 text-sm sm:text-base max-w-2xl leading-relaxed">
              Jadwal tatap muka harian (Senin - Sabtu) berdurasi standar 35 menit per Jam Pelajaran (JP), dilengkapi waktu pembiasaan pagi, literasi/numerasi, upacara, dan kepramukaan terpadu SD Negeri Nambo 03.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => downloadJadwalPelajaranWord(activeJadwal, schoolProfile)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-950 hover:bg-blue-50 rounded-xl font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              title="Download dokumen resmi format Word dengan Kop Surat dan Logo Sekolah"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Download Word (.doc)</span>
            </button>

            <button
              onClick={() => downloadJadwalPelajaranExcel(activeJadwal, schoolProfile)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs sm:text-sm border border-blue-400/40 shadow-md active:scale-95 transition-all cursor-pointer"
              title="Download berkas spreadsheet format Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer"
              title="Cetak Jadwal Pelajaran"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar & Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Class selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Rombel / Kelas:</span>
          </div>
          <select
            value={selectedKelasId}
            onChange={e => setSelectedKelasId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-extrabold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {classes.filter(c => c.jenis === 'Utama').map(c => (
              <option key={c.id} value={c.id}>
                {c.nama} {c.waliKelasId ? `(${teachers.find(t => t.id === c.waliKelasId)?.nama || ''})` : ''}
              </option>
            ))}
          </select>

          {/* Day filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedHariFilter('Semua')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedHariFilter === 'Semua'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              Semua Hari
            </button>
            {HARI_LIST.map(h => (
              <button
                key={h}
                onClick={() => setSelectedHariFilter(h)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedHariFilter === h
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
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
            {showKopSuratPreview ? 'Sembunyikan Kop' : 'Tinjau Kop Surat'}
          </button>

          <button
            onClick={() => downloadCurriculumTemplate('jadwal-pelajaran')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            title="Download format Excel untuk import jadwal pelajaran"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Template Excel</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" />
            <span>Import Berkas</span>
          </button>

          <button
            onClick={() => handleOpenAddSlot()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jam Pelajaran</span>
          </button>
        </div>
      </div>

      {/* Official Kop Surat Preview */}
      {showKopSuratPreview && (
        <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm animate-fadeIn">
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

      {/* Class & Schedule Info Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl font-black text-lg">
            {currentClassObj?.nama?.split(' ')[1] || '1'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-800 text-base">{currentClassObj?.nama || 'Kelas 1A'}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                Durasi: 35 Menit / JP
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Wali Kelas: <strong className="text-slate-700">{defaultTeacherName}</strong> &bull; Semester {activeJadwal.semester} TA {activeJadwal.tahunAjaran}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold border border-slate-200">
            {totalSlotsCount} Total Slot Waktu
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 font-bold border border-blue-200">
            {totalBelajarSlots} Jam Pelajaran Aktif
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-800 font-bold border border-purple-200">
            {totalPembiasaanSlots} Sesi Karakter / Upacara
          </div>
        </div>
      </div>

      {/* Daily Timetable Cards */}
      <div className="space-y-5">
        {displayedDays.map(hari => {
          const slotsThisDay = activeJadwal.slots.filter(s => s.hari === hari);

          return (
            <div
              key={hari}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden"
            >
              {/* Day Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    {hari.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">
                      Hari {hari}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {slotsThisDay.length} kegiatan terdaftar
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenAddSlot(hari)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Jam di {hari}</span>
                </button>
              </div>

              {/* Day Slots List */}
              {slotsThisDay.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  Belum ada slot pelajaran yang dijadwalkan untuk hari {hari}. Klik "Tambah Jam" untuk mulai menyusun.
                </div>
              ) : (
                <div className="divide-y divide-slate-200/70">
                  {slotsThisDay.map((slot, sIdx) => {
                    const isIst = slot.isIstirahat;
                    const isPembiasaan = slot.jamKe === 0 && !isIst;

                    return (
                      <div
                        key={slot.id || sIdx}
                        className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors ${
                          isIst ? 'bg-amber-50/50' : isPembiasaan ? 'bg-purple-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                          {/* Time badge */}
                          <div className={`px-3 py-1.5 rounded-xl font-black text-xs shrink-0 flex items-center gap-1.5 ${
                            isIst
                              ? 'bg-amber-200 text-amber-900 border border-amber-300'
                              : isPembiasaan
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{slot.jamMulai} - {slot.jamSelesai}</span>
                          </div>

                          {/* Jam ke indicator */}
                          <div className="w-20 text-[11px] font-bold text-slate-500 shrink-0">
                            {isIst ? (
                              <span className="text-amber-800 font-extrabold flex items-center gap-1">
                                <Coffee className="w-3 h-3" /> Istirahat
                              </span>
                            ) : slot.jamKe === 0 ? (
                              <span className="text-purple-700 font-extrabold">Pembiasaan</span>
                            ) : (
                              <span>Jam ke-{slot.jamKe}</span>
                            )}
                          </div>

                          {/* Mapel & details */}
                          <div className="min-w-0">
                            <div className="font-extrabold text-sm text-slate-800 leading-snug truncate">
                              {slot.mataPelajaran}
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 mt-0.5">
                              {!isIst && (
                                <span className="flex items-center gap-1 text-slate-600">
                                  <User className="w-3 h-3 text-slate-400" />
                                  <span>{slot.guruPengampu}</span>
                                </span>
                              )}
                              {slot.ruangan && (
                                <span className="flex items-center gap-1 text-slate-500">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  <span>{slot.ruangan}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleOpenEditSlot(slot)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit slot ini"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus slot ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stepper Navigation Footer Banner */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onNavigatePrev}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
        >
          <span>← Kembali ke Langkah 6: Hari Efektif</span>
        </button>

        <div className="text-center text-xs text-slate-500 font-medium hidden sm:block">
          Langkah 7 dari 8: Jadwal Pelajaran Mingguan (35 Menit/JP)
        </div>

        <button
          onClick={onNavigateNext}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
        >
          <span>Lanjut ke Langkah 8: Modul Ajar Deep Learning (LKPD & Rubrik) →</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODAL: EDIT / TAMBAH SLOT JADWAL                         */}
      {/* ======================================================== */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                {editingSlotId ? 'Edit Jam Pelajaran' : 'Tambah Jam Pelajaran Baru'}
              </h3>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari Belajar</label>
                  <select
                    value={slotFormData.hari}
                    onChange={e => setSlotFormData({ ...slotFormData, hari: e.target.value as HariBelajar })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold"
                  >
                    {HARI_LIST.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Jam Pelajaran</label>
                  <select
                    value={slotFormData.jamKe}
                    onChange={e => setSlotFormData({ ...slotFormData, jamKe: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value={0}>0 (Pembiasaan / Upacara / Senam)</option>
                    <option value={1}>Jam ke-1</option>
                    <option value={2}>Jam ke-2</option>
                    <option value={3}>Jam ke-3</option>
                    <option value={4}>Jam ke-4</option>
                    <option value={5}>Jam ke-5</option>
                    <option value={6}>Jam ke-6</option>
                    <option value={7}>Jam ke-7</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Mulai (WIB)</label>
                  <input
                    type="text"
                    value={slotFormData.jamMulai}
                    onChange={e => setSlotFormData({ ...slotFormData, jamMulai: e.target.value })}
                    placeholder="Contoh: 07.30"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Selesai (WIB)</label>
                  <input
                    type="text"
                    value={slotFormData.jamSelesai}
                    onChange={e => setSlotFormData({ ...slotFormData, jamSelesai: e.target.value })}
                    placeholder="Contoh: 08.05 (35 mnt)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran / Kegiatan</label>
                <input
                  type="text"
                  value={slotFormData.mataPelajaran}
                  onChange={e => setSlotFormData({ ...slotFormData, mataPelajaran: e.target.value })}
                  placeholder="Contoh: Pendidikan Pancasila / Koding Unplugged"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guru Pengampu</label>
                  <input
                    type="text"
                    value={slotFormData.guruPengampu}
                    onChange={e => setSlotFormData({ ...slotFormData, guruPengampu: e.target.value })}
                    placeholder="Nama guru pengampu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ruangan / Tempat</label>
                  <input
                    type="text"
                    value={slotFormData.ruangan}
                    onChange={e => setSlotFormData({ ...slotFormData, ruangan: e.target.value })}
                    placeholder="Contoh: Ruang Kelas 1A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slotFormData.isIstirahat}
                    onChange={e => setSlotFormData({ ...slotFormData, isIstirahat: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Tandai sebagai Waktu Istirahat</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveSlot}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Simpan Jam Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: IMPORT JADWAL (EXCEL / CSV / JSON)                */}
      {/* ======================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Import Berkas Jadwal Pelajaran
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

            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                id="file-upload-jadwal"
                accept=".xlsx,.xls,.csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload-jadwal"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-10 h-10 text-blue-600" />
                <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                  Pilih berkas Excel / JSON Jadwal Pelajaran
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
                        <th className="p-1">Hari</th>
                        <th className="p-1">Waktu</th>
                        <th className="p-1">Mata Pelajaran</th>
                        <th className="p-1">Guru</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreviewData.slice(0, 10).map((row, i) => (
                        <tr key={i} className="border-b border-slate-200/50">
                          <td className="p-1">{i + 1}</td>
                          <td className="p-1 font-bold">{row['Hari'] || row['hari'] || '-'}</td>
                          <td className="p-1 text-blue-700 font-bold">
                            {row['Jam Mulai'] || row['jamMulai'] || ''} - {row['Jam Selesai'] || row['jamSelesai'] || ''}
                          </td>
                          <td className="p-1 font-semibold">{row['Mata Pelajaran'] || row['mataPelajaran'] || '-'}</td>
                          <td className="p-1 text-slate-600">{row['Guru Pengampu'] || row['guruPengampu'] || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Terapkan & Simpan ke Kelas Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
