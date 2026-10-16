import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Users,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Power,
  Download,
  Upload,
  Calendar,
  FileSpreadsheet,
  Printer,
  X,
  Search,
  Sparkles,
  BookOpen,
  ShieldCheck,
  FileText,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import {
  Teacher,
  Staff,
  TeachingHour,
  PerformancePractice,
  PerformanceBerAKHLAK,
  AdditionalTask,
  TeacherReportCard,
  PerformancePredicate
} from '../types';
import {
  downloadTemplatePraktikKinerja,
  downloadTemplateBerAKHLAK,
  downloadTemplateTugasTambahan,
  downloadTemplateRapotKinerja,
  downloadWorkbook,
  readExcelFile
} from '../utils/excelUtils';
import { printOfficialDocument } from '../utils/pdfExport';

type StaffSubTab =
  | 'data-gtk'
  | 'jam-mengajar'
  | 'kinerja-praktik'
  | 'berakhlak'
  | 'tugas-tambahan'
  | 'rapot-kinerja';

export const StaffManagementView: React.FC = () => {
  const {
    teachers,
    staff,
    updateTeacher,
    deleteTeacher,
    toggleTeacherActive,
    updateStaff,
    deleteStaff,
    toggleStaffActive,
    teachingHours,
    addTeachingHour,
    updateTeachingHour,
    deleteTeachingHour,
    practices,
    addPractice,
    updatePractice,
    deletePractice,
    importPractices,
    berakhlakList,
    addBerAKHLAK,
    updateBerAKHLAK,
    deleteBerAKHLAK,
    importBerAKHLAK,
    additionalTasks,
    addAdditionalTask,
    updateAdditionalTask,
    deleteAdditionalTask,
    importAdditionalTasks,
    teacherReportCards,
    addTeacherReportCard,
    updateTeacherReportCard,
    deleteTeacherReportCard,
    importTeacherReportCards,
    classes,
    schoolProfile
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<StaffSubTab>('data-gtk');
  const [searchGtk, setSearchGtk] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'guru' | 'tu'>('all');

  // Semester Selector for Kinerja & Rapot TA 2026-2027
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap' | 'Tahunan'>('Ganjil');

  // Modal Editing States
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string; name: string; type: 'guru' | 'tu' } | null>(null);

  // Teaching Hour Form Modal
  const [hourModal, setHourModal] = useState<{
    isOpen: boolean;
    data: { id?: string; guruId: string; mataPelajaran: string; kelasId: string; jumlahJP: number; hari: string; jamMulai: string; jamSelesai: string };
  }>({
    isOpen: false,
    data: { guruId: teachers[0]?.id || '', mataPelajaran: 'Tematik / Guru Kelas', kelasId: classes.filter(c => c.jenis === 'Utama')[0]?.id || '', jumlahJP: 24, hari: 'Senin - Jumat', jamMulai: '07.00', jamSelesai: '12.00' }
  });

  const [practiceStageFilter, setPracticeStageFilter] = useState<'semua' | 'perencanaan' | 'pelaksanaan' | 'umpan-balik'>('semua');

  // Performance Practice Form Modal with 3 Kemdikbud Stages
  const [practiceModal, setPracticeModal] = useState<{
    isOpen: boolean;
    activeTabStage: 'perencanaan' | 'pelaksanaan' | 'umpan-balik';
    data: {
      id?: string;
      guruId: string;
      indikator: string;
      catatanGuru: string;
      statusObservasi: 'Sudah' | 'Belum';
      tanggalObservasi: string;
      catatanKepsek: string;
      // 1. Perencanaan
      targetPerilaku: string;
      upayaMempelajari: string;
      jadwalRencana: string;
      jamRencana: string;
      kelasTargetId: string;
      mapelTarget: string;
      // 2. Pelaksanaan
      ratingObservasi: 'Belum Dilakukan' | 'Dilakukan tapi Belum Efektif' | 'Dilakukan dan Efektif';
      fokusPengamatan: string;
      catatanPengamatanKepsek: string;
      // 3. Umpan Balik
      refleksiPascaObservasi: string;
      umpanBalikKepsek: string;
      rencanaTindakLanjut: string;
      skorTindakLanjut: number;
    };
  }>({
    isOpen: false,
    activeTabStage: 'perencanaan',
    data: {
      guruId: teachers[0]?.id || '',
      indikator: 'Penerapan Disiplin Positif',
      catatanGuru: '',
      statusObservasi: 'Belum',
      tanggalObservasi: '',
      catatanKepsek: '',
      targetPerilaku: 'Guru mengajak peserta didik menyepakati aturan dan konsekuensi positif secara partisipatif.',
      upayaMempelajari: 'Mempelajari modul Pelatihan Mandiri PMM Topik Disiplin Positif dan strategi restitusi.',
      jadwalRencana: '2026-10-20',
      jamRencana: '08.00 - 09.30 WIB',
      kelasTargetId: classes[0]?.id || '',
      mapelTarget: 'Tematik / Guru Kelas',
      ratingObservasi: 'Dilakukan dan Efektif',
      fokusPengamatan: 'Pengamatan suasana interaktif dan keterlibatan aktif peserta didik di kelas.',
      catatanPengamatanKepsek: 'Sangat baik, guru menerapkan kesepakatan kelas dengan bahasa afirmatif dan ramah anak.',
      refleksiPascaObservasi: 'Peserta didik antusias dan lebih percaya diri mengemukakan pendapat.',
      umpanBalikKepsek: 'Pertahankan pendekatan humanis ini dan bagikan praktik baik pada rapat dewan guru.',
      rencanaTindakLanjut: 'Mengikuti komunitas belajar gugus kecamatan Klapanunggal.',
      skorTindakLanjut: 100
    }
  });

  // BerAKHLAK Form Modal
  const [berakhlakModal, setBerakhlakModal] = useState<{
    isOpen: boolean;
    data: { id?: string; guruId: string; berorientasiPelayanan: string; akuntabel: string; kompeten: string; harmonis: string; loyal: string; adaptif: string; kolaboratif: string; catatan: string; statusEvaluasi: 'Memenuhi Ekspektasi' | 'Di Atas Ekspektasi' | 'Perlu Perbaikan' };
  }>({
    isOpen: false,
    data: {
      guruId: teachers[0]?.id || '',
      berorientasiPelayanan: '',
      akuntabel: '',
      kompeten: '',
      harmonis: '',
      loyal: '',
      adaptif: '',
      kolaboratif: '',
      catatan: '',
      statusEvaluasi: 'Memenuhi Ekspektasi'
    }
  });

  // Tugas Tambahan Form Modal
  const [taskModal, setTaskModal] = useState<{
    isOpen: boolean;
    data: { id?: string; guruId: string; namaTugas: string; refleksi: string; buktiDukung: string; status: 'Selesai' | 'Dalam Proses' | 'Belum' };
  }>({
    isOpen: false,
    data: { guruId: teachers[0]?.id || '', namaTugas: 'Wali Kelas', refleksi: '', buktiDukung: '', status: 'Selesai' }
  });

  // Rapot Kinerja Form Modal
  const [reportCardModal, setReportCardModal] = useState<{
    isOpen: boolean;
    data: {
      id?: string;
      guruId: string;
      tahunAjaran: string;
      semester: 'Ganjil' | 'Genap' | 'Tahunan';
      predikatKinerja: PerformancePredicate;
      nilaiSkorAkhir: number;
      catatanKepsek: string;
      rekomendasiKepsek: string;
      tanggalPenetapan: string;
    };
  }>({
    isOpen: false,
    data: {
      guruId: teachers[0]?.id || '',
      tahunAjaran: '2026-2027',
      semester: 'Ganjil',
      predikatKinerja: 'Sangat Baik (Di Atas Ekspektasi)',
      nilaiSkorAkhir: 95,
      catatanKepsek: 'Sangat baik, berdedikasi tinggi dalam peningkatan mutu peserta didik.',
      rekomendasiKepsek: 'Pertahankan keteladanan kepemimpinan pembelajaran.',
      tanggalPenetapan: '2026-12-15'
    }
  });

  // Selected Teacher for viewing synchronized Dossier/Rapot
  const [selectedTeacherForDossier, setSelectedTeacherForDossier] = useState<string>(teachers[0]?.id || '');

  const mainClasses = useMemo(() => classes.filter(c => c.jenis === 'Utama'), [classes]);

  // Combined and filtered staff/teachers list
  const filteredGtkList = useMemo(() => {
    const list: Array<{ type: 'guru' | 'tu'; item: Teacher | Staff }> = [];
    if (roleFilter === 'all' || roleFilter === 'guru') {
      teachers.forEach(t => list.push({ type: 'guru', item: t }));
    }
    if (roleFilter === 'all' || roleFilter === 'tu') {
      staff.forEach(s => list.push({ type: 'tu', item: s }));
    }

    return list.filter(({ item }) => {
      const matchSearch =
        searchGtk === '' ||
        item.nama.toLowerCase().includes(searchGtk.toLowerCase()) ||
        ('nip' in item && typeof item.nip === 'string' && item.nip.includes(searchGtk));
      return matchSearch;
    });
  }, [teachers, staff, roleFilter, searchGtk]);

  // Handle Save Teacher Edit
  const handleSaveTeacherEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    updateTeacher(editingTeacher.id, editingTeacher);
    setEditingTeacher(null);
  };

  // Handle Save Staff Edit
  const handleSaveStaffEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    updateStaff(editingStaff.id, editingStaff);
    setEditingStaff(null);
  };

  // Confirm Delete
  const confirmDeleteGtk = () => {
    if (!deletingItem) return;
    if (deletingItem.type === 'guru') {
      deleteTeacher(deletingItem.id);
    } else {
      deleteStaff(deletingItem.id);
    }
    setDeletingItem(null);
  };

  // Teaching Hour Submit
  const handleSaveTeachingHour = (e: React.FormEvent) => {
    e.preventDefault();
    const d = hourModal.data;
    if (d.id) {
      updateTeachingHour(d.id, {
        guruId: d.guruId,
        mataPelajaran: d.mataPelajaran,
        kelasId: d.kelasId,
        jumlahJP: Number(d.jumlahJP),
        hari: d.hari,
        jamMulai: d.jamMulai,
        jamSelesai: d.jamSelesai
      });
    } else {
      addTeachingHour({
        guruId: d.guruId,
        mataPelajaran: d.mataPelajaran,
        kelasId: d.kelasId,
        jumlahJP: Number(d.jumlahJP),
        hari: d.hari,
        jamMulai: d.jamMulai,
        jamSelesai: d.jamSelesai
      });
    }
    setHourModal({ isOpen: false, data: { ...hourModal.data, id: undefined } });
  };

  // Save Performance Practice (Perencanaan, Pelaksanaan, Umpan Balik)
  const handleSavePractice = (e: React.FormEvent) => {
    e.preventDefault();
    const d = practiceModal.data;
    let skor = 0;
    if (d.ratingObservasi === 'Dilakukan dan Efektif' || d.statusObservasi === 'Sudah') {
      skor = 100;
    } else if (d.ratingObservasi === 'Dilakukan tapi Belum Efektif') {
      skor = 75;
    } else {
      skor = Number(d.skorTindakLanjut) || 0;
    }

    const statusObs: 'Sudah' | 'Belum' =
      (d.statusObservasi === 'Sudah' || d.ratingObservasi === 'Dilakukan dan Efektif' || d.ratingObservasi === 'Dilakukan tapi Belum Efektif')
        ? 'Sudah'
        : 'Belum';

    const practicePayload = {
      guruId: d.guruId,
      indikator: d.indikator,
      catatanGuru: d.catatanGuru || d.refleksiPascaObservasi || '',
      statusObservasi: statusObs,
      skor,
      tanggalObservasi: d.tanggalObservasi || d.jadwalRencana || '',
      catatanKepsek: d.catatanKepsek || d.catatanPengamatanKepsek || '',
      periode: `Semester ${selectedSemester} 2026/2027`,
      // 1. Perencanaan
      targetPerilaku: d.targetPerilaku,
      upayaMempelajari: d.upayaMempelajari,
      jadwalRencana: d.jadwalRencana,
      jamRencana: d.jamRencana,
      kelasTargetId: d.kelasTargetId,
      mapelTarget: d.mapelTarget,
      // 2. Pelaksanaan
      ratingObservasi: d.ratingObservasi,
      fokusPengamatan: d.fokusPengamatan,
      catatanPengamatanKepsek: d.catatanPengamatanKepsek || d.catatanKepsek,
      // 3. Umpan Balik
      refleksiPascaObservasi: d.refleksiPascaObservasi || d.catatanGuru,
      umpanBalikKepsek: d.umpanBalikKepsek || d.catatanKepsek,
      rencanaTindakLanjut: d.rencanaTindakLanjut,
      skorTindakLanjut: skor
    };

    if (d.id) {
      updatePractice(d.id, practicePayload);
    } else {
      addPractice(practicePayload);
    }
    setPracticeModal(prev => ({ ...prev, isOpen: false }));
  };

  // Save BerAKHLAK
  const handleSaveBerAKHLAK = (e: React.FormEvent) => {
    e.preventDefault();
    const d = berakhlakModal.data;
    if (d.id) {
      updateBerAKHLAK(d.id, {
        guruId: d.guruId,
        berorientasiPelayanan: d.berorientasiPelayanan,
        akuntabel: d.akuntabel,
        kompeten: d.kompeten,
        harmonis: d.harmonis,
        loyal: d.loyal,
        adaptif: d.adaptif,
        kolaboratif: d.kolaboratif,
        catatan: d.catatan,
        statusEvaluasi: d.statusEvaluasi
      });
    } else {
      addBerAKHLAK({
        guruId: d.guruId,
        berorientasiPelayanan: d.berorientasiPelayanan,
        akuntabel: d.akuntabel,
        kompeten: d.kompeten,
        harmonis: d.harmonis,
        loyal: d.loyal,
        adaptif: d.adaptif,
        kolaboratif: d.kolaboratif,
        catatan: d.catatan,
        tanggal: new Date().toISOString().split('T')[0],
        statusEvaluasi: d.statusEvaluasi
      });
    }
    setBerakhlakModal({ isOpen: false, data: { ...berakhlakModal.data, id: undefined } });
  };

  // Save Tugas Tambahan
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const d = taskModal.data;
    if (d.id) {
      updateAdditionalTask(d.id, {
        guruId: d.guruId,
        namaTugas: d.namaTugas,
        refleksi: d.refleksi,
        buktiDukung: d.buktiDukung,
        status: d.status
      });
    } else {
      addAdditionalTask({
        guruId: d.guruId,
        namaTugas: d.namaTugas,
        refleksi: d.refleksi,
        buktiDukung: d.buktiDukung,
        status: d.status,
        tanggal: new Date().toISOString().split('T')[0]
      });
    }
    setTaskModal({ isOpen: false, data: { ...taskModal.data, id: undefined } });
  };

  // Save Rapot Kinerja Guru
  const handleSaveReportCard = (e: React.FormEvent) => {
    e.preventDefault();
    const d = reportCardModal.data;
    if (d.id) {
      updateTeacherReportCard(d.id, {
        guruId: d.guruId,
        tahunAjaran: d.tahunAjaran,
        semester: d.semester,
        predikatKinerja: d.predikatKinerja,
        nilaiSkorAkhir: Number(d.nilaiSkorAkhir),
        catatanKepsek: d.catatanKepsek,
        rekomendasiKepsek: d.rekomendasiKepsek,
        tanggalPenetapan: d.tanggalPenetapan,
        status: 'Disetujui Kepala Sekolah'
      });
    } else {
      addTeacherReportCard({
        guruId: d.guruId,
        tahunAjaran: d.tahunAjaran,
        semester: d.semester,
        predikatKinerja: d.predikatKinerja,
        nilaiSkorAkhir: Number(d.nilaiSkorAkhir),
        catatanKepsek: d.catatanKepsek,
        rekomendasiKepsek: d.rekomendasiKepsek,
        tanggalPenetapan: d.tanggalPenetapan,
        status: 'Disetujui Kepala Sekolah'
      });
    }
    setReportCardModal(prev => ({ ...prev, isOpen: false }));
  };

  // Import handler for performance sub-tabs
  const handlePerformanceImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'praktik' | 'berakhlak' | 'tugas' | 'rapot'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readExcelFile(file);
      if (type === 'praktik') {
        const res = importPractices(data);
        alert(`Berhasil mengimpor ${res.successCount} data praktik kinerja.`);
      } else if (type === 'berakhlak') {
        const res = importBerAKHLAK(data);
        alert(`Berhasil mengimpor ${res.successCount} data evaluasi BerAKHLAK.`);
      } else if (type === 'tugas') {
        const res = importAdditionalTasks(data);
        alert(`Berhasil mengimpor ${res.successCount} tugas tambahan refleksi.`);
      } else if (type === 'rapot') {
        const res = importTeacherReportCards(data);
        alert(`Berhasil mengimpor ${res.successCount} rapot evaluasi kinerja guru.`);
      }
    } catch (err: any) {
      alert(`Gagal mengimpor file: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  };

  // Export Rekap Rapot Kinerja Guru ke Excel
  const handleExportReportCardsExcel = () => {
    const rows = teachers.map((t, idx) => {
      const card = teacherReportCards.find(
        c => c.guruId === t.id && (c.semester === selectedSemester || selectedSemester === 'Tahunan')
      );
      const hours = teachingHours.filter(h => h.guruId === t.id);
      const totalJP = hours.reduce((acc, h) => acc + h.jumlahJP, 0);
      const practice = practices.find(p => p.guruId === t.id);
      const berakhlak = berakhlakList.find(b => b.guruId === t.id);
      const task = additionalTasks.find(a => a.guruId === t.id);

      return {
        No: idx + 1,
        NIP: t.nip,
        'Nama Guru': `${t.nama}, ${t.gelar}`,
        Jabatan: t.jabatan,
        'Status Kepegawaian': t.statusKepegawaian,
        'Beban Kerja (JP/Minggu)': `${totalJP} JP (${totalJP >= 24 ? 'Memenuhi Syarat' : 'Belum 24 JP'})`,
        'Praktik Kinerja (Observasi)': practice ? `${practice.indikator} (Skor: ${practice.skor})` : 'Belum Ada',
        'Evaluasi BerAKHLAK': berakhlak?.statusEvaluasi || 'Belum Dievaluasi',
        'Tugas Tambahan': task?.namaTugas || '-',
        'Tahun Ajaran': '2026-2027',
        Semester: selectedSemester,
        'Predikat Kinerja': card?.predikatKinerja || 'Baik (Memenuhi Ekspektasi)',
        'Nilai Skor Akhir': card?.nilaiSkorAkhir || (practice?.statusObservasi === 'Sudah' ? 95 : 88),
        'Catatan Kepala Sekolah': card?.catatanKepsek || 'Kinerja sangat baik dan akuntabel.',
        'Rekomendasi Kepala Sekolah': card?.rekomendasiKepsek || 'Pertahankan keteladanan pembelajaran.',
        'Tanggal Penetapan': card?.tanggalPenetapan || '2026-12-15'
      };
    });

    downloadWorkbook(rows, `Rekap_Rapot_Kinerja_Guru_SDN_Nambo_03_TA_2026_2027`, 'Rapot Kinerja Guru');
  };

  // Cetak Rapot Kinerja Resmi Per Guru (PDF)
  const handlePrintSingleTeacherReport = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    const card = teacherReportCards.find(
      c => c.guruId === teacher.id && (c.semester === selectedSemester || selectedSemester === 'Tahunan')
    );
    const hours = teachingHours.filter(h => h.guruId === teacher.id);
    const totalJP = hours.reduce((acc, h) => acc + h.jumlahJP, 0);
    const practice = practices.find(p => p.guruId === teacher.id);
    const berakhlak = berakhlakList.find(b => b.guruId === teacher.id);
    const task = additionalTasks.find(a => a.guruId === teacher.id);

    const headers = ['Komponen Penilaian', 'Uraian & Bukti Capaian', 'Hasil Evaluasi Kepala Sekolah'];
    const rows: (string | number)[][] = [
      ['Beban Jam Mengajar', `${totalJP} JP per minggu (${hours.map(h => `${h.mataPelajaran} di ${classes.find(c => c.id === h.kelasId)?.nama || '-'}`).join(', ')})`, totalJP >= 24 ? 'MEMENUHI BEBAN MINIMAL 24 JP' : 'BELUM MENCAPAI 24 JP'],
      ['Praktik Kinerja & Observasi', `Indikator: ${practice?.indikator || 'Penerapan Disiplin Positif'}\nRefleksi Guru: "${practice?.catatanGuru || '-'}"`, `Status: ${practice?.statusObservasi === 'Sudah' ? 'SUDAH DIOBSERVASI (100 POIN)' : 'BELUM OBSERVASI'}\nCatatan Kepsek: ${practice?.catatanKepsek || '-'}`],
      ['Perilaku BerAKHLAK', '7 Core Values ASN (Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif)', berakhlak?.statusEvaluasi || 'Memenuhi Ekspektasi'],
      ['Tugas Tambahan', `Tugas: ${task?.namaTugas || 'Wali Kelas'}\nRefleksi: "${task?.refleksi || '-'}"\nBukti Dukung: ${task?.buktiDukung || '-'}`, `Status: ${task?.status || 'Selesai'}`],
      ['NILAI SKOR AKHIR', 'Skor Komprehensif Seluruh Aspek', `${card?.nilaiSkorAkhir || (practice?.statusObservasi === 'Sudah' ? 95 : 88)} / 100`],
      ['PREDIKAT KINERJA', 'Penetapan Predikat Kerja Tahunan', card?.predikatKinerja || 'Baik (Memenuhi Ekspektasi)']
    ];

    const summaryNotes = [
      `Nama Pegawai / Guru: ${teacher.nama}, ${teacher.gelar}`,
      `NIP: ${teacher.nip} | Pangkat/Golongan: ${teacher.golongan} | Jabatan: ${teacher.jabatan}`,
      `Periode Penilaian: Tahun Ajaran ${schoolProfile.tahunAjaran} (Semester ${selectedSemester})`,
      `Catatan Khusus Kepala Sekolah: "${card?.catatanKepsek || 'Kinerja sangat baik dan akuntabel.'}"`,
      `Rekomendasi Tindak Lanjut: "${card?.rekomendasiKepsek || 'Pertahankan keteladanan pembelajaran dan terus menginspirasi rekan sejawat.'}"`
    ];

    printOfficialDocument({
      title: 'RAPOR EVALUASI KINERJA GURU (PMM & BERAKHLAK)',
      subtitle: `SD NEGERI NAMBO 03 KECAMATAN KLAPANUNGGAL KABUPATEN BOGOR`,
      documentNumber: `800/RAPOT-${teacher.nip !== '-' ? teacher.nip.slice(-4) : '001'}/SDN-N03/2026`,
      tableHeaders: headers,
      tableRows: rows,
      summaryNotes,
      schoolProfile
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Menu Kepegawaian & Kinerja Guru
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sinkronisasi beban kerja, praktik kinerja (observasi poin 100), perilaku BerAKHLAK, tugas tambahan, dan rapot kinerja guru
          </p>
        </div>

        {/* Global Academic Year & Semester Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-emerald-600 ml-1.5" />
          <span className="text-xs font-bold text-slate-700">Periode Evaluasi:</span>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value as any)}
            className="px-2.5 py-1 text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl text-emerald-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Ganjil">Semester Ganjil 2026/2027</option>
            <option value="Genap">Semester Genap 2026/2027</option>
            <option value="Tahunan">Tahun Penuh 2026-2027</option>
          </select>
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('data-gtk')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'data-gtk'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data GTK (Guru & TU)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {teachers.length + staff.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('jam-mengajar')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'jam-mengajar'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pembagian Jam Mengajar</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {teachingHours.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('kinerja-praktik')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'kinerja-praktik'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Praktik Kinerja (Observasi 100)</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {practices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('berakhlak')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'berakhlak'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Perilaku BerAKHLAK</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {berakhlakList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('tugas-tambahan')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'tugas-tambahan'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Tugas Tambahan & Refleksi</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            {additionalTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rapot-kinerja')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'rapot-kinerja'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-400/40'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Rapot Kinerja Guru Terpadu</span>
          <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded-full font-mono">
            Sinkron
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. SUB-TAB: DATA GTK (GURU & TU) */}
      {/* ========================================================= */}
      {activeSubTab === 'data-gtk' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama guru, NIP, atau staf TU..."
                value={searchGtk}
                onChange={e => setSearchGtk(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">Semua GTK (Guru & TU)</option>
                <option value="guru">Hanya Guru Pendidik</option>
                <option value="tu">Hanya Tenaga Kependidikan (TU)</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Nama & Gelar</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">NIP / NIK</th>
                    <th className="p-3.5">Jabatan / Tugas</th>
                    <th className="p-3.5">Status Kepegawaian</th>
                    <th className="p-3.5">Status Aktif</th>
                    <th className="p-3.5 text-center w-36">Aksi (Edit / Hapus)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGtkList.map(({ type, item }) => {
                    const isTeacher = type === 'guru';
                    const t = item as Teacher;
                    const s = item as Staff;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 text-sm">
                            {item.nama}
                            {isTeacher && t.gelar ? `, ${t.gelar}` : ''}
                          </div>
                          <div className="text-[11px] text-slate-500">{item.noHp}</div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                              isTeacher
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isTeacher ? 'Guru Pendidik' : 'Staf TU'}
                          </span>
                        </td>

                        <td className="p-3.5 font-mono text-[11px]">
                          {isTeacher ? t.nip || '-' : s.nik || '-'}
                        </td>

                        <td className="p-3.5 font-medium">
                          {isTeacher ? t.jabatan : s.tugas}
                        </td>

                        <td className="p-3.5">
                          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                            {item.statusKepegawaian}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() => (isTeacher ? toggleTeacherActive(t.id) : toggleStaffActive(s.id))}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors ${
                              item.statusAktif
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title="Klik untuk mengubah status aktif"
                          >
                            <Power className="w-3 h-3" />
                            <span>{item.statusAktif ? 'Aktif' : 'Non-Aktif'}</span>
                          </button>
                        </td>

                        {/* Action Edit & Hapus Berfungsi */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (isTeacher) setEditingTeacher(t);
                                else setEditingStaff(s);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Edit Data GTK"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingItem({ id: item.id, name: item.nama, type })}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="Hapus Data GTK"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SUB-TAB: PEMBAGIAN JAM MENGAJAR */}
      {/* ========================================================= */}
      {activeSubTab === 'jam-mengajar' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">
                Distribusi & Pembagian Jam Mengajar Guru TA 2026-2027
              </h3>
              <p className="text-xs text-slate-500">
                Beban kerja minimal 24 JP (Jam Pelajaran) per minggu untuk kelayakan tunjangan sertifikasi profesi guru
              </p>
            </div>

            <button
              onClick={() => setHourModal({ isOpen: true, data: { guruId: teachers[0]?.id || '', mataPelajaran: 'Tematik / Guru Kelas', kelasId: mainClasses[0]?.id || '', jumlahJP: 24, hari: 'Senin - Jumat', jamMulai: '07.00', jamSelesai: '12.00' } })}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jam Mengajar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map(teacher => {
              const teacherHours = teachingHours.filter(h => h.guruId === teacher.id);
              const totalJP = teacherHours.reduce((sum, h) => sum + h.jumlahJP, 0);
              const isEligibleCert = totalJP >= 24;

              return (
                <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{teacher.nama}, {teacher.gelar}</h4>
                      <div className="text-[11px] font-mono text-slate-500">NIP: {teacher.nip}</div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isEligibleCert
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                      title={isEligibleCert ? 'Memenuhi syarat sertifikasi min 24 JP' : 'Belum mencapai 24 JP'}
                    >
                      {totalJP} JP / Minggu
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {teacherHours.length > 0 ? (
                      teacherHours.map(th => {
                        const className = classes.find(c => c.id === th.kelasId)?.nama || '-';
                        return (
                          <div key={th.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-slate-800">{th.mataPelajaran}</div>
                              <div className="text-[11px] text-slate-500">
                                {className} • {th.hari} ({th.jamMulai || '07.00'} - {th.jamSelesai || '12.00'})
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                {th.jumlahJP} JP
                              </span>
                              <button
                                onClick={() => deleteTeachingHour(th.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-3 text-center text-slate-400 italic text-xs">
                        Belum ada jadwal mengajar diinput
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SUB-TAB: PRAKTIK KINERJA (PERENCANAAN, PELAKSANAAN, UMPAN BALIK) */}
      {/* ========================================================= */}
      {activeSubTab === 'kinerja-praktik' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-2xl border border-emerald-700/50 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pengelolaan Kinerja Guru Platform Merdeka Mengajar (PMM)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Praktik Kinerja & Siklus Observasi Kelas Lengkap
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Meliputi 3 tahapan resmi: <strong>1. Perencanaan (Pra-Observasi)</strong>, <strong>2. Pelaksanaan Observasi Kelas</strong>, hingga <strong>3. Umpan Balik & Tindak Lanjut</strong> bersama Kepala Sekolah <strong>{schoolProfile.kepalaSekolah}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadTemplatePraktikKinerja}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Template Praktik 3 Tahap (Excel)</span>
              </button>

              <label className="cursor-pointer px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Praktik</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handlePerformanceImport(e, 'praktik')}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setPracticeModal({
                  isOpen: true,
                  activeTabStage: 'perencanaan',
                  data: {
                    guruId: teachers[0]?.id || '',
                    indikator: 'Penerapan Disiplin Positif',
                    catatanGuru: '',
                    statusObservasi: 'Belum',
                    tanggalObservasi: '',
                    catatanKepsek: '',
                    targetPerilaku: 'Guru mengajak peserta didik menyepakati aturan dan konsekuensi positif secara partisipatif.',
                    upayaMempelajari: 'Mempelajari modul Pelatihan Mandiri PMM Topik Disiplin Positif dan strategi restitusi.',
                    jadwalRencana: '2026-10-20',
                    jamRencana: '08.00 - 09.30 WIB',
                    kelasTargetId: classes[0]?.id || '',
                    mapelTarget: 'Tematik / Guru Kelas',
                    ratingObservasi: 'Dilakukan dan Efektif',
                    fokusPengamatan: 'Pengamatan suasana interaktif dan keterlibatan aktif peserta didik di kelas.',
                    catatanPengamatanKepsek: '',
                    refleksiPascaObservasi: '',
                    umpanBalikKepsek: '',
                    rencanaTindakLanjut: '',
                    skorTindakLanjut: 100
                  }
                })}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Input Praktik Kinerja (3 Tahap)</span>
              </button>
            </div>
          </div>

          {/* 3-Stage Filter Navigation */}
          <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPracticeStageFilter('semua')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  practiceStageFilter === 'semua'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Semua Tahapan (Rangkuman)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                  {practices.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPracticeStageFilter('perencanaan')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  practiceStageFilter === 'perencanaan'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>1. Perencanaan (Pra-Observasi)</span>
              </button>

              <button
                type="button"
                onClick={() => setPracticeStageFilter('pelaksanaan')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  practiceStageFilter === 'pelaksanaan'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>2. Pelaksanaan Observasi Kelas</span>
              </button>

              <button
                type="button"
                onClick={() => setPracticeStageFilter('umpan-balik')}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  practiceStageFilter === 'umpan-balik'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>3. Umpan Balik & Pasca-Observasi</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-medium">
              Siklus Lengkap PMM • Terhubung ke Rapor Kinerja
            </div>
          </div>

          {/* Table Rendering Based on Selected Stage Filter */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
                  {practiceStageFilter === 'perencanaan' ? (
                    <tr>
                      <th className="p-3.5">Nama Guru</th>
                      <th className="p-3.5">Indikator Kinerja PMM</th>
                      <th className="p-3.5">Target Perilaku (Fokus Observasi)</th>
                      <th className="p-3.5">Upaya Mempelajari Target</th>
                      <th className="p-3.5">Rencana Jadwal & Waktu</th>
                      <th className="p-3.5">Rombel & Mapel</th>
                      <th className="p-3.5 text-center w-28">Aksi</th>
                    </tr>
                  ) : practiceStageFilter === 'pelaksanaan' ? (
                    <tr>
                      <th className="p-3.5">Nama Guru</th>
                      <th className="p-3.5">Indikator Kinerja</th>
                      <th className="p-3.5">Tanggal Observasi</th>
                      <th className="p-3.5">Rating Pelaksanaan (Kepsek)</th>
                      <th className="p-3.5">Fokus Pengamatan Perilaku</th>
                      <th className="p-3.5">Catatan Pengamatan Langsung Kepala Sekolah</th>
                      <th className="p-3.5">Skor Observasi</th>
                      <th className="p-3.5 text-center w-28">Aksi</th>
                    </tr>
                  ) : practiceStageFilter === 'umpan-balik' ? (
                    <tr>
                      <th className="p-3.5">Nama Guru</th>
                      <th className="p-3.5">Indikator Kinerja</th>
                      <th className="p-3.5">Refleksi Guru Pasca-Observasi</th>
                      <th className="p-3.5">Umpan Balik & Arahan Kepala Sekolah</th>
                      <th className="p-3.5">Rencana Aksi Tindak Lanjut Guru</th>
                      <th className="p-3.5">Skor Akhir</th>
                      <th className="p-3.5 text-center w-28">Aksi</th>
                    </tr>
                  ) : (
                    /* SEMUA (RANGKUMAN 3 TAHAP) */
                    <tr>
                      <th className="p-3.5">Nama Guru</th>
                      <th className="p-3.5">1. Perencanaan (Target Perilaku)</th>
                      <th className="p-3.5">2. Pelaksanaan (Rating & Catatan Kepsek)</th>
                      <th className="p-3.5">3. Umpan Balik (Refleksi & Tindak Lanjut)</th>
                      <th className="p-3.5">Skor Praktik</th>
                      <th className="p-3.5 text-center w-28">Aksi</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {practices.map(p => {
                    const guru = teachers.find(t => t.id === p.guruId);
                    const isObserved = p.statusObservasi === 'Sudah' || p.ratingObservasi === 'Dilakukan dan Efektif';
                    const targetClass = classes.find(c => c.id === p.kelasTargetId)?.nama || 'Kelas 1A';

                    const openEditModalWithTab = (stage: 'perencanaan' | 'pelaksanaan' | 'umpan-balik') => {
                      setPracticeModal({
                        isOpen: true,
                        activeTabStage: stage,
                        data: {
                          id: p.id,
                          guruId: p.guruId,
                          indikator: p.indikator,
                          catatanGuru: p.catatanGuru || p.refleksiPascaObservasi || '',
                          statusObservasi: p.statusObservasi,
                          tanggalObservasi: p.tanggalObservasi || p.jadwalRencana || '',
                          catatanKepsek: p.catatanKepsek || p.catatanPengamatanKepsek || '',
                          targetPerilaku: p.targetPerilaku || 'Guru mengajak peserta didik menyepakati aturan dan konsekuensi positif.',
                          upayaMempelajari: p.upayaMempelajari || 'Mempelajari modul Pelatihan Mandiri PMM Topik Disiplin Positif.',
                          jadwalRencana: p.jadwalRencana || p.tanggalObservasi || '2026-10-20',
                          jamRencana: p.jamRencana || '08.00 - 09.30 WIB',
                          kelasTargetId: p.kelasTargetId || classes[0]?.id || '',
                          mapelTarget: p.mapelTarget || 'Tematik / Guru Kelas',
                          ratingObservasi: p.ratingObservasi || (p.statusObservasi === 'Sudah' ? 'Dilakukan dan Efektif' : 'Belum Dilakukan'),
                          fokusPengamatan: p.fokusPengamatan || p.catatanGuru || '',
                          catatanPengamatanKepsek: p.catatanPengamatanKepsek || p.catatanKepsek || '',
                          refleksiPascaObservasi: p.refleksiPascaObservasi || p.catatanGuru || '',
                          umpanBalikKepsek: p.umpanBalikKepsek || p.catatanKepsek || '',
                          rencanaTindakLanjut: p.rencanaTindakLanjut || 'Mengikuti komunitas belajar gugus kecamatan.',
                          skorTindakLanjut: p.skor || 100
                        }
                      });
                    };

                    if (practiceStageFilter === 'perencanaan') {
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{guru?.nama || 'Guru'}</div>
                            <div className="text-[11px] font-mono text-slate-400">{guru?.nip}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                              {p.indikator}
                            </span>
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-700">
                            {p.targetPerilaku || p.catatanGuru || 'Guru memfasilitasi kesepakatan dan dinamika kelas aktif'}
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-600 text-[11px] italic">
                            {p.upayaMempelajari || 'Mempelajari modul Pelatihan Mandiri PMM'}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <div className="font-mono font-bold text-slate-800">{p.jadwalRencana || p.tanggalObservasi || '-'}</div>
                            <div className="text-[10px] text-slate-400">{p.jamRencana || '08.00 - 09.30'}</div>
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <div className="font-semibold text-slate-800">{targetClass}</div>
                            <div className="text-[11px] text-slate-500">{p.mapelTarget || 'Tematik'}</div>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditModalWithTab('perencanaan')}
                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                title="Edit Perencanaan"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePractice(p.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    if (practiceStageFilter === 'pelaksanaan') {
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{guru?.nama || 'Guru'}</div>
                            <div className="text-[11px] font-mono text-slate-400">{guru?.nip}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {p.indikator}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-700 whitespace-nowrap">
                            {p.tanggalObservasi || p.jadwalRencana || '-'}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[11px] inline-flex items-center gap-1.5 ${
                                p.ratingObservasi === 'Dilakukan dan Efektif' || isObserved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.ratingObservasi === 'Dilakukan tapi Belum Efektif'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{p.ratingObservasi || (isObserved ? 'Dilakukan dan Efektif' : 'Belum Dilakukan')}</span>
                            </span>
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-600">
                            {p.fokusPengamatan || p.catatanGuru || '-'}
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-600 italic text-[11px]">
                            "{p.catatanPengamatanKepsek || p.catatanKepsek || 'Belum ada catatan observasi'}"
                          </td>
                          <td className="p-3.5">
                            <span className={`font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg ${
                              isObserved ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {p.skor} Poin
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditModalWithTab('pelaksanaan')}
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                title="Edit Observasi Pelaksanaan"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePractice(p.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    if (practiceStageFilter === 'umpan-balik') {
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{guru?.nama || 'Guru'}</div>
                            <div className="text-[11px] font-mono text-slate-400">{guru?.nip}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                              {p.indikator}
                            </span>
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-700">
                            <p className="italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                              "{p.refleksiPascaObservasi || p.catatanGuru || '-'}"
                            </p>
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-700">
                            <p className="italic bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 text-emerald-950">
                              "{p.umpanBalikKepsek || p.catatanKepsek || '-'}"
                            </p>
                          </td>
                          <td className="p-3.5 max-w-xs text-slate-600 text-[11px]">
                            {p.rencanaTindakLanjut || 'Mengikuti pelatihan mandiri PMM dan berbagi praktik baik.'}
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg bg-emerald-700 text-white">
                              {p.skorTindakLanjut || p.skor || 100}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openEditModalWithTab('umpan-balik')}
                                className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50"
                                title="Edit Umpan Balik & Tindak Lanjut"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deletePractice(p.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    /* RANGKUMAN 3 TAHAPAN */
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900">{guru?.nama || 'Guru'}</div>
                          <div className="text-[11px] font-mono text-slate-400">{guru?.nip}</div>
                          <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                            {p.indikator}
                          </span>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <div className="text-slate-800 font-semibold text-xs line-clamp-2">
                            {p.targetPerilaku || p.catatanGuru || 'Fokus kesepakatan dan dinamika kelas'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            Rencana: {p.jadwalRencana || p.tanggalObservasi || 'Terjadwal'} ({p.jamRencana || '08.00'})
                          </div>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                                isObserved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{p.ratingObservasi || (isObserved ? 'Dilakukan & Efektif' : 'Belum Observasi')}</span>
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 italic line-clamp-2">
                            "{p.catatanPengamatanKepsek || p.catatanKepsek || 'Belum ada catatan'}"
                          </div>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <div className="text-[11px] text-slate-700 line-clamp-2">
                            <strong>Refleksi:</strong> "{p.refleksiPascaObservasi || p.catatanGuru || '-'}"
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5 line-clamp-1">
                            <strong>Tindak Lanjut:</strong> {p.rencanaTindakLanjut || 'Pelatihan Mandiri PMM'}
                          </div>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`font-mono font-extrabold text-sm px-2.5 py-1 rounded-lg ${
                              isObserved
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {p.skor} Poin
                          </span>
                        </td>

                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openEditModalWithTab('perencanaan')}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                              title="Kelola Siklus 3 Tahap"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deletePractice(p.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. SUB-TAB: PERILAKU BERAKHLAK */}
      {/* ========================================================= */}
      {activeSubTab === 'berakhlak' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-slate-50 p-5 rounded-2xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-800 text-base">
                  Evaluasi Perilaku Kerja ASN BerAKHLAK
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Penerapan 7 Core Values ASN di lingkungan SD Negeri Nambo 03: Berorientasi Pelayanan, Akuntabel, Kompeten, Harmonis, Loyal, Adaptif, dan Kolaboratif.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadTemplateBerAKHLAK}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Template BerAKHLAK (10 Dummy)</span>
              </button>

              <label className="cursor-pointer px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel BerAKHLAK</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handlePerformanceImport(e, 'berakhlak')}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setBerakhlakModal({
                  isOpen: true,
                  data: {
                    guruId: teachers[0]?.id || '',
                    berorientasiPelayanan: '',
                    akuntabel: '',
                    kompeten: '',
                    harmonis: '',
                    loyal: '',
                    adaptif: '',
                    kolaboratif: '',
                    catatan: '',
                    statusEvaluasi: 'Memenuhi Ekspektasi'
                  }
                })}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Manual BerAKHLAK</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {berakhlakList.map(item => {
              const guru = teachers.find(t => t.id === item.guruId);

              return (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{guru?.nama || 'Guru'}</h4>
                      <div className="text-[11px] font-mono text-slate-400">{guru?.nip}</div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.statusEvaluasi === 'Di Atas Ekspektasi'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.statusEvaluasi}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div><strong>1. Berorientasi Pelayanan:</strong> {item.berorientasiPelayanan || '-'}</div>
                    <div><strong>2. Akuntabel:</strong> {item.akuntabel || '-'}</div>
                    <div><strong>3. Kompeten:</strong> {item.kompeten || '-'}</div>
                    <div><strong>4. Harmonis:</strong> {item.harmonis || '-'}</div>
                    <div><strong>5. Loyal:</strong> {item.loyal || '-'}</div>
                    <div><strong>6. Adaptif:</strong> {item.adaptif || '-'}</div>
                    <div><strong>7. Kolaboratif:</strong> {item.kolaboratif || '-'}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono">{item.tanggal}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteBerAKHLAK(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. SUB-TAB: TUGAS TAMBAHAN */}
      {/* ========================================================= */}
      {activeSubTab === 'tugas-tambahan' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 via-teal-50 to-slate-50 p-5 rounded-2xl border border-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-700" />
                <h3 className="font-bold text-slate-800 text-base">
                  Pelaksanaan Tugas Tambahan & Refleksi Guru
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Pencatatan tugas tambahan (Wali Kelas, Pembina Pramuka, Tim Pengembang Kurikulum, Pengelola BOS, Koordinator P5) disertai refleksi guru.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadTemplateTugasTambahan}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-purple-800 border border-purple-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-purple-600" />
                <span>Template Tugas Tambahan (10 Dummy)</span>
              </button>

              <label className="cursor-pointer px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Tugas</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handlePerformanceImport(e, 'tugas')}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setTaskModal({ isOpen: true, data: { guruId: teachers[0]?.id || '', namaTugas: 'Wali Kelas', refleksi: '', buktiDukung: 'SK Pembagian Tugas No. 421.2/015/SDN-N03/VII/2026', status: 'Selesai' } })}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Manual Tugas</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalTasks.map(task => {
              const guru = teachers.find(t => t.id === task.guruId);

              return (
                <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{guru?.nama || 'Guru'}</h4>
                      <span className="text-xs font-bold text-emerald-700">{task.namaTugas}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="italic bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                      "{task.refleksi || 'Tidak ada catatan refleksi'}"
                    </p>
                    {task.buktiDukung && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        Bukti: {task.buktiDukung}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-[10px]">{task.tanggal}</span>
                    <button
                      onClick={() => deleteAdditionalTask(task.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. SUB-TAB: RAPOT KINERJA GURU TERPADU (SINKRON DENGAN KEPSEK) */}
      {/* ========================================================= */}
      {activeSubTab === 'rapot-kinerja' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 border border-emerald-700/50">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rapor Evaluasi Kinerja Guru Terpadu & Sah</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Sinkronisasi Kinerja Guru SD Negeri Nambo 03
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                Menghubungkan secara otomatis data guru, pembagian jam mengajar, skor praktik observasi (100 poin), evaluasi BerAKHLAK, dan tugas tambahan. Guru dapat menerima dan mencetak rapot kinerja resmi yang ditandatangani oleh Kepala Sekolah <strong>{schoolProfile.kepalaSekolah}</strong> (NIP: {schoolProfile.nipKepalaSekolah}).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={downloadTemplateRapotKinerja}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Template Excel Rapot (10 Dummy)</span>
              </button>

              <label className="cursor-pointer px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Rapot</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={e => handlePerformanceImport(e, 'rapot')}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportReportCardsExcel}
                className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download Semua Rapot (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Teacher Selector Toolbar & Dossier View */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-800 text-base">Pilih Guru untuk Pratinjau & Input Rapot</h4>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTeacherForDossier}
                  onChange={e => setSelectedTeacherForDossier(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 max-w-xs"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.nama}, {t.gelar} ({t.statusKepegawaian})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handlePrintSingleTeacherReport(selectedTeacherForDossier)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Rapot PDF Guru Ini</span>
                </button>
              </div>
            </div>

            {/* Synchronized Teacher Dossier Card */}
            {(() => {
              const currentTeacher = teachers.find(t => t.id === selectedTeacherForDossier) || teachers[0];
              if (!currentTeacher) return null;

              const teacherHours = teachingHours.filter(h => h.guruId === currentTeacher.id);
              const totalJP = teacherHours.reduce((sum, h) => sum + h.jumlahJP, 0);
              const currentPractice = practices.find(p => p.guruId === currentTeacher.id);
              const currentBerakhlak = berakhlakList.find(b => b.guruId === currentTeacher.id);
              const currentTask = additionalTasks.find(a => a.guruId === currentTeacher.id);
              const currentCard = teacherReportCards.find(
                c => c.guruId === currentTeacher.id && (c.semester === selectedSemester || selectedSemester === 'Tahunan')
              );

              return (
                <div className="space-y-5">
                  {/* Teacher Header Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {currentTeacher.statusKepegawaian} • Golongan {currentTeacher.golongan}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                        {currentTeacher.nama}, {currentTeacher.gelar}
                      </h3>
                      <p className="text-xs text-slate-600 font-mono">
                        NIP: {currentTeacher.nip} | NUPTK: {currentTeacher.nuptk || '-'} | Jabatan: {currentTeacher.jabatan}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Predikat Kinerja</div>
                        <div className="text-sm font-extrabold text-emerald-700">
                          {currentCard?.predikatKinerja || 'Baik (Memenuhi Ekspektasi)'}
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Skor Akhir</div>
                        <div className="text-lg font-mono font-extrabold text-slate-900">
                          {currentCard?.nilaiSkorAkhir || (currentPractice?.statusObservasi === 'Sudah' ? 95 : 88)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4 Synchronized Pillars Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Pillar 1: Beban Jam Mengajar */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span>1. Beban Jam Mengajar</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                          totalJP >= 24 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {totalJP} JP
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-600">
                        {teacherHours.length > 0 ? (
                          teacherHours.map(th => (
                            <div key={th.id} className="text-[11px] p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                              <strong>{th.mataPelajaran}</strong> ({classes.find(c => c.id === th.kelasId)?.nama || '-'}) - {th.jumlahJP} JP
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-400 italic">Belum ada beban mengajar</div>
                        )}
                      </div>
                    </div>

                    {/* Pillar 2: Praktik Kinerja (Observasi 100) */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>2. Praktik Kinerja</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                          currentPractice?.statusObservasi === 'Sudah'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {currentPractice?.statusObservasi === 'Sudah' ? '100 Poin' : '0 Poin'}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-600 text-[11px]">
                        <div><strong>Indikator:</strong> {currentPractice?.indikator || 'Penerapan Disiplin Positif'}</div>
                        <div className="truncate"><strong>Status:</strong> {currentPractice?.statusObservasi === 'Sudah' ? 'Sudah Diobservasi Kepala Sekolah' : 'Belum Observasi'}</div>
                        <div className="text-[10px] text-slate-500 italic truncate">
                          "{currentPractice?.catatanKepsek || 'Belum ada catatan observasi'}"
                        </div>
                      </div>
                    </div>

                    {/* Pillar 3: Perilaku BerAKHLAK */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>3. Nilai BerAKHLAK</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-purple-100 text-purple-800">
                          {currentBerakhlak?.statusEvaluasi || 'Memenuhi'}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-600 text-[11px]">
                        <div><strong>Pelayanan:</strong> {currentBerakhlak?.berorientasiPelayanan ? 'Aktif' : 'Baik'}</div>
                        <div><strong>Akuntabel:</strong> {currentBerakhlak?.akuntabel ? 'Tepat Waktu' : 'Disiplin'}</div>
                        <div><strong>Kolaboratif:</strong> {currentBerakhlak?.kolaboratif ? 'Sinergis' : 'Aktif'}</div>
                        <div className="text-[10px] text-slate-500 italic truncate">
                          "{currentBerakhlak?.catatan || 'Keteladanan kerja terbukti baik'}"
                        </div>
                      </div>
                    </div>

                    {/* Pillar 4: Tugas Tambahan */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                          <span>4. Tugas Tambahan</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-100 text-amber-800">
                          {currentTask?.status || 'Selesai'}
                        </span>
                      </div>
                      <div className="space-y-1 text-slate-600 text-[11px]">
                        <div><strong>Nama Tugas:</strong> {currentTask?.namaTugas || 'Wali Kelas'}</div>
                        <div className="text-[10px] text-slate-500 italic line-clamp-2">
                          "{currentTask?.refleksi || 'Telah melaksanakan tugas dengan penuh tanggung jawab'}"
                        </div>
                        {currentTask?.buktiDukung && (
                          <div className="text-[9px] text-slate-400 truncate">SK: {currentTask.buktiDukung}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Input Manual / Update Masukan Kepala Sekolah Form */}
                  <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-800" />
                        <h4 className="font-bold text-emerald-950 text-sm">
                          Masukan & Penetapan Rapot Kinerja oleh Kepala Sekolah ({schoolProfile.kepalaSekolah})
                        </h4>
                      </div>
                      <button
                        onClick={() => setReportCardModal({
                          isOpen: true,
                          data: {
                            id: currentCard?.id,
                            guruId: currentTeacher.id,
                            tahunAjaran: currentCard?.tahunAjaran || '2026-2027',
                            semester: (currentCard?.semester as any) || selectedSemester,
                            predikatKinerja: currentCard?.predikatKinerja || 'Sangat Baik (Di Atas Ekspektasi)',
                            nilaiSkorAkhir: currentCard?.nilaiSkorAkhir || (currentPractice?.statusObservasi === 'Sudah' ? 95 : 88),
                            catatanKepsek: currentCard?.catatanKepsek || 'Kinerja sangat baik dan akuntabel.',
                            rekomendasiKepsek: currentCard?.rekomendasiKepsek || 'Terus pertahankan dedikasi dalam KBM dan pembimbingan peserta didik.',
                            tanggalPenetapan: currentCard?.tanggalPenetapan || '2026-12-15'
                          }
                        })}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Input / Edit Masukan Kepala Sekolah</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                        <strong className="text-emerald-900 block mb-1">Catatan Evaluasi Kepala Sekolah:</strong>
                        <p className="text-slate-700 italic">
                          "{currentCard?.catatanKepsek || 'Guru bersangkutan menunjukkan komitmen tinggi dalam proses belajar mengajar serta kedisiplinan dan keteladanan yang baik.'}"
                        </p>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-emerald-200">
                        <strong className="text-emerald-900 block mb-1">Rekomendasi Tindak Lanjut:</strong>
                        <p className="text-slate-700 italic">
                          "{currentCard?.rekomendasiKepsek || 'Terus pertahankan dedikasi dalam KBM serta kembangkan asesmen pembelajaran yang adaptif.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INPUT / EDIT RAPOT KINERJA GURU */}
      {/* ========================================================= */}
      {reportCardModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">
              Penetapan Rapor Kinerja Guru oleh Kepala Sekolah
            </h3>
            <form onSubmit={handleSaveReportCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guru Yang Dinilai</label>
                <select
                  value={reportCardModal.data.guruId}
                  onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, guruId: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.nama}, {t.gelar}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={reportCardModal.data.tahunAjaran}
                    onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, tahunAjaran: e.target.value } }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={reportCardModal.data.semester}
                    onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, semester: e.target.value as any } }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                    <option value="Tahunan">Tahun Penuh 2026-2027</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Predikat Kinerja *</label>
                  <select
                    value={reportCardModal.data.predikatKinerja}
                    onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, predikatKinerja: e.target.value as any } }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Sangat Baik (Di Atas Ekspektasi)">Sangat Baik (Di Atas Ekspektasi)</option>
                    <option value="Baik (Memenuhi Ekspektasi)">Baik (Memenuhi Ekspektasi)</option>
                    <option value="Butuh Perbaikan">Butuh Perbaikan</option>
                    <option value="Kurang">Kurang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nilai Skor Akhir (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={reportCardModal.data.nilaiSkorAkhir}
                    onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, nilaiSkorAkhir: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Kepala Sekolah ({schoolProfile.kepalaSekolah}) *</label>
                <textarea
                  rows={2}
                  value={reportCardModal.data.catatanKepsek}
                  onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, catatanKepsek: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Catatan hasil pengamatan dan evaluasi kepsek"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Rekomendasi Tindak Lanjut *</label>
                <textarea
                  rows={2}
                  value={reportCardModal.data.rekomendasiKepsek}
                  onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, rekomendasiKepsek: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  placeholder="Rekomendasi pengembangan kompetensi guru"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Penetapan Rapor</label>
                <input
                  type="date"
                  value={reportCardModal.data.tanggalPenetapan}
                  onChange={e => setReportCardModal(prev => ({ ...prev, data: { ...prev.data, tanggalPenetapan: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReportCardModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan & Sahkan Rapor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT GURU */}
      {/* ========================================================= */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Edit Data Guru</h3>
            <form onSubmit={handleSaveTeacherEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingTeacher.nama}
                  onChange={e => setEditingTeacher({ ...editingTeacher, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gelar</label>
                  <input
                    type="text"
                    value={editingTeacher.gelar}
                    onChange={e => setEditingTeacher({ ...editingTeacher, gelar: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP</label>
                  <input
                    type="text"
                    value={editingTeacher.nip}
                    onChange={e => setEditingTeacher({ ...editingTeacher, nip: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Kepegawaian</label>
                  <select
                    value={editingTeacher.statusKepegawaian}
                    onChange={e => setEditingTeacher({ ...editingTeacher, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honorer / GTT">Honorer / GTT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Mapel</label>
                  <input
                    type="text"
                    value={editingTeacher.jabatan}
                    onChange={e => setEditingTeacher({ ...editingTeacher, jabatan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No HP</label>
                  <input
                    type="text"
                    value={editingTeacher.noHp}
                    onChange={e => setEditingTeacher({ ...editingTeacher, noHp: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Golongan</label>
                  <input
                    type="text"
                    value={editingTeacher.golongan}
                    onChange={e => setEditingTeacher({ ...editingTeacher, golongan: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT STAF TU */}
      {/* ========================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Edit Data Staf TU</h3>
            <form onSubmit={handleSaveStaffEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editingStaff.nama}
                  onChange={e => setEditingStaff({ ...editingStaff, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tugas / Jabatan</label>
                  <input
                    type="text"
                    value={editingStaff.tugas}
                    onChange={e => setEditingStaff({ ...editingStaff, tugas: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK</label>
                  <input
                    type="text"
                    value={editingStaff.nik}
                    onChange={e => setEditingStaff({ ...editingStaff, nik: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingStaff.statusKepegawaian}
                    onChange={e => setEditingStaff({ ...editingStaff, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="Honorer / PTT">Honorer / PTT</option>
                    <option value="PPPK">PPPK</option>
                    <option value="PNS">PNS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No HP</label>
                  <input
                    type="text"
                    value={editingStaff.noHp}
                    onChange={e => setEditingStaff({ ...editingStaff, noHp: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION GTK */}
      {/* ========================================================= */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-200 max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-rose-800 text-base">Hapus Data GTK</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus data {deletingItem.type === 'guru' ? 'guru' : 'staf'} <strong>"{deletingItem.name}"</strong>? Data penugasan terkait akan dibersihkan.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 text-sm text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteGtk}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INPUT / EDIT JAM MENGAJAR */}
      {/* ========================================================= */}
      {hourModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Atur Jadwal & Jam Mengajar</h3>
            <form onSubmit={handleSaveTeachingHour} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Guru</label>
                <select
                  value={hourModal.data.guruId}
                  onChange={e => setHourModal(prev => ({ ...prev, data: { ...prev.data, guruId: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.nama}, {t.gelar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={hourModal.data.mataPelajaran}
                  onChange={e => setHourModal(prev => ({ ...prev, data: { ...prev.data, mataPelajaran: e.target.value } }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelas Diampu</label>
                  <select
                    value={hourModal.data.kelasId}
                    onChange={e => setHourModal(prev => ({ ...prev, data: { ...prev.data, kelasId: e.target.value } }))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  >
                    {mainClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah JP (Per Minggu)</label>
                  <input
                    type="number"
                    value={hourModal.data.jumlahJP}
                    onChange={e => setHourModal(prev => ({ ...prev, data: { ...prev.data, jumlahJP: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hari</label>
                  <input
                    type="text"
                    value={hourModal.data.hari}
                    onChange={e => setHourModal(prev => ({ ...prev, data: { ...prev.data, hari: e.target.value } }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu KBM</label>
                  <input
                    type="text"
                    placeholder="07.00 - 11.30"
                    value={`${hourModal.data.jamMulai} - ${hourModal.data.jamSelesai}`}
                    onChange={e => {
                      const parts = e.target.value.split('-');
                      setHourModal(prev => ({ ...prev, data: { ...prev.data, jamMulai: parts[0]?.trim() || '', jamSelesai: parts[1]?.trim() || '' } }));
                    }}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setHourModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan Jam Mengajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INPUT / EDIT PRAKTIK KINERJA (3 TAHAPAN PMM LENGKAP) */}
      {/* ========================================================= */}
      {practiceModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Award className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {practiceModal.data.id ? 'Edit Praktik Kinerja & Siklus Observasi' : 'Formulir Praktik Kinerja Guru'}
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    SD Negeri Nambo 03 • Pengelolaan Kinerja Kemdikbudristek (PMM)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPracticeModal(prev => ({ ...prev, isOpen: false }))}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper / Tab Navigasi 3 Tahapan */}
            <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => setPracticeModal(prev => ({ ...prev, activeTabStage: 'perencanaan' }))}
                className={`py-3 px-2 border-b-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                  practiceModal.activeTabStage === 'perencanaan'
                    ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Tahap 1</span>
                <span>1. Perencanaan</span>
              </button>

              <button
                type="button"
                onClick={() => setPracticeModal(prev => ({ ...prev, activeTabStage: 'pelaksanaan' }))}
                className={`py-3 px-2 border-b-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                  practiceModal.activeTabStage === 'pelaksanaan'
                    ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Tahap 2</span>
                <span>2. Pelaksanaan</span>
              </button>

              <button
                type="button"
                onClick={() => setPracticeModal(prev => ({ ...prev, activeTabStage: 'umpan-balik' }))}
                className={`py-3 px-2 border-b-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                  practiceModal.activeTabStage === 'umpan-balik'
                    ? 'border-purple-600 text-purple-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider text-slate-400">Tahap 3</span>
                <span>3. Umpan Balik</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePractice} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* TAHAP 1: PERENCANAAN (PRA-OBSERVASI) */}
              {practiceModal.activeTabStage === 'perencanaan' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                    <strong>Tahap Perencanaan (Pra-Observasi):</strong> Guru bersama Kepala Sekolah menyepakati 1 target perilaku dan upaya mempelajarinya serta menetapkan jadwal pelaksanaan observasi kelas.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Guru / Pegawai *</label>
                    <select
                      value={practiceModal.data.guruId}
                      onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, guruId: e.target.value } }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold bg-white"
                      required
                    >
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.nama}, {t.gelar} ({t.jabatan})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Indikator Kinerja PMM Terpilih *</label>
                    <select
                      value={practiceModal.data.indikator}
                      onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, indikator: e.target.value } }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-semibold bg-white text-emerald-900"
                    >
                      <option value="Penerapan Disiplin Positif">1. Penerapan Disiplin Positif</option>
                      <option value="Keteraturan Suasana Kelas">2. Keteraturan Suasana Kelas</option>
                      <option value="Aktivitas Interaktif">3. Aktivitas Interaktif</option>
                      <option value="Instruksi yang Adaptif">4. Instruksi yang Adaptif</option>
                      <option value="Ekspektasi pada Peserta Didik">5. Ekspektasi pada Peserta Didik</option>
                      <option value="Perhatian dan Kepedulian">6. Perhatian dan Kepedulian</option>
                      <option value="Umpan Balik Konstruktif">7. Umpan Balik Konstruktif</option>
                      <option value="Instruksi Pembelajaran">8. Instruksi Pembelajaran</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">Target Perilaku (Fokus Observasi) *</label>
                      <button
                        type="button"
                        onClick={() => setPracticeModal(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            targetPerilaku: prev.data.indikator === 'Penerapan Disiplin Positif'
                              ? 'Guru memfasilitasi kesepakatan kelas positif dan menguatkan disiplin tanpa kekerasan/hukuman.'
                              : prev.data.indikator === 'Keteraturan Suasana Kelas'
                              ? 'Guru memberikan instruksi terstruktur dan sinyal transisi yang jelas saat berganti aktivitas.'
                              : 'Guru memfasilitasi kegiatan belajar yang memberi peran setara pada semua peserta didik.'
                          }
                        }))}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        + Gunakan Rekomendasi PMM
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={practiceModal.data.targetPerilaku}
                      onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, targetPerilaku: e.target.value } }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Contoh: Guru mengajak peserta didik menyepakati aturan dan konsekuensi secara partisipatif"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Upaya Mempelajari Target Perilaku</label>
                    <textarea
                      rows={2}
                      value={practiceModal.data.upayaMempelajari}
                      onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, upayaMempelajari: e.target.value } }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Contoh: Mempelajari modul Pelatihan Mandiri PMM Topik Disiplin Positif dan berdiskusi di KKG"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rencana Tanggal Observasi</label>
                      <input
                        type="date"
                        value={practiceModal.data.jadwalRencana}
                        onChange={e => setPracticeModal(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            jadwalRencana: e.target.value,
                            tanggalObservasi: e.target.value
                          }
                        }))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Waktu / Jam Pelaksanaan</label>
                      <input
                        type="text"
                        value={practiceModal.data.jamRencana}
                        onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, jamRencana: e.target.value } }))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        placeholder="Contoh: 08.00 - 09.30 WIB"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rombel / Kelas Target</label>
                      <select
                        value={practiceModal.data.kelasTargetId}
                        onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, kelasTargetId: e.target.value } }))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-semibold"
                      >
                        {classes.filter(c => c.jenis === 'Utama').map(c => (
                          <option key={c.id} value={c.id}>{c.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran / Topik KBM</label>
                      <input
                        type="text"
                        value={practiceModal.data.mapelTarget}
                        onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, mapelTarget: e.target.value } }))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white"
                        placeholder="Contoh: Tematik / Pendidikan Pancasila"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAHAP 2: PELAKSANAAN OBSERVASI KELAS */}
              {practiceModal.activeTabStage === 'pelaksanaan' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                    <strong>Tahap Pelaksanaan Observasi:</strong> Kepala Sekolah <strong>{schoolProfile.kepalaSekolah}</strong> hadir di ruang kelas untuk mengamati perilaku guru dan menetapkan penilaian rating observasi.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">
                        Status Observasi Kelas *
                      </label>
                      <select
                        value={practiceModal.data.statusObservasi}
                        onChange={e => setPracticeModal(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            statusObservasi: e.target.value as any,
                            ratingObservasi: e.target.value === 'Sudah' ? 'Dilakukan dan Efektif' : 'Belum Dilakukan'
                          }
                        }))}
                        className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-xl bg-white font-bold text-emerald-800"
                      >
                        <option value="Belum">Belum Observasi (0 Poin)</option>
                        <option value="Sudah">Sudah Diobservasi Kepala Sekolah</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-950 mb-1">Tanggal Realisasi Observasi</label>
                      <input
                        type="date"
                        value={practiceModal.data.tanggalObservasi}
                        onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, tanggalObservasi: e.target.value } }))}
                        className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-xl bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rating Ketercapaian Observasi (Penilaian Kepala Sekolah) *
                    </label>
                    <select
                      value={practiceModal.data.ratingObservasi}
                      onChange={e => setPracticeModal(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          ratingObservasi: e.target.value as any,
                          statusObservasi: e.target.value !== 'Belum Dilakukan' ? 'Sudah' : 'Belum'
                        }
                      }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-bold text-slate-800"
                    >
                      <option value="Dilakukan dan Efektif">Dilakukan dan Efektif (100 Poin - Maksimal)</option>
                      <option value="Dilakukan tapi Belum Efektif">Dilakukan tapi Belum Efektif (75 Poin)</option>
                      <option value="Belum Dilakukan">Belum Dilakukan (0 Poin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fokus Pengamatan Tindakan Guru</label>
                    <textarea
                      rows={2}
                      value={practiceModal.data.fokusPengamatan}
                      onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, fokusPengamatan: e.target.value } }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Uraian tindakan guru yang diamati selama kegiatan belajar berlangsung"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catatan Pengamatan Langsung Kepala Sekolah ({schoolProfile.kepalaSekolah})
                    </label>
                    <textarea
                      rows={3}
                      value={practiceModal.data.catatanPengamatanKepsek || practiceModal.data.catatanKepsek}
                      onChange={e => setPracticeModal(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          catatanPengamatanKepsek: e.target.value,
                          catatanKepsek: e.target.value
                        }
                      }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Catatan kelebihan, suasana belajar anak, dan aspek yang diobservasi oleh kepala sekolah"
                    />
                  </div>
                </div>
              )}

              {/* TAHAP 3: UMPAN BALIK & TINDAK LANJUT */}
              {practiceModal.activeTabStage === 'umpan-balik' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
                    <strong>Tahap Umpan Balik & Tindak Lanjut:</strong> Refleksi guru pasca-observasi, dialog umpan balik pembinaan dengan Kepala Sekolah, dan perumusan rencana peningkatan kompetensi berkelanjutan.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Refleksi Guru Pasca-Observasi *</label>
                    <textarea
                      rows={3}
                      value={practiceModal.data.refleksiPascaObservasi || practiceModal.data.catatanGuru}
                      onChange={e => setPracticeModal(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          refleksiPascaObservasi: e.target.value,
                          catatanGuru: e.target.value
                        }
                      }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Apa yang berjalan baik? Apa tantangan yang dialami saat mengajar dan bagaimana respon siswa?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Umpan Balik & Arahan Pembinaan Kepala Sekolah ({schoolProfile.kepalaSekolah})
                    </label>
                    <textarea
                      rows={3}
                      value={practiceModal.data.umpanBalikKepsek || practiceModal.data.catatanKepsek}
                      onChange={e => setPracticeModal(prev => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          umpanBalikKepsek: e.target.value,
                          catatanKepsek: e.target.value
                        }
                      }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Umpan balik apresiatif dan saran perbaikan dari kepala sekolah untuk guru"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rencana Aksi Tindak Lanjut Guru (PMM / Pelatihan Mandiri / KKG)
                    </label>
                    <textarea
                      rows={2}
                      value={practiceModal.data.rencanaTindakLanjut}
                      onChange={e => setPracticeModal(prev => ({ ...prev, data: { ...prev.data, rencanaTindakLanjut: e.target.value } }))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      placeholder="Contoh: Mempelajari modul topik diferensiasi proses di PMM dan sharing di KKG Gugus Klapanunggal"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Skor Capaian Praktik Kinerja:</span>
                      <span className="text-[11px] text-slate-500">Otomatis 100 Poin jika observasi efektif & tuntas</span>
                    </div>
                    <span className="text-base font-extrabold font-mono px-3 py-1 bg-emerald-600 text-white rounded-xl shadow-xs">
                      {practiceModal.data.ratingObservasi === 'Dilakukan dan Efektif' || practiceModal.data.statusObservasi === 'Sudah' ? '100 Poin' : practiceModal.data.ratingObservasi === 'Dilakukan tapi Belum Efektif' ? '75 Poin' : '0 Poin'}
                    </span>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                <div className="flex items-center gap-1.5">
                  {practiceModal.activeTabStage !== 'perencanaan' && (
                    <button
                      type="button"
                      onClick={() => setPracticeModal(prev => ({
                        ...prev,
                        activeTabStage: prev.activeTabStage === 'umpan-balik' ? 'pelaksanaan' : 'perencanaan'
                      }))}
                      className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      &larr; Tahap Sebelumnya
                    </button>
                  )}
                  {practiceModal.activeTabStage !== 'umpan-balik' && (
                    <button
                      type="button"
                      onClick={() => setPracticeModal(prev => ({
                        ...prev,
                        activeTabStage: prev.activeTabStage === 'perencanaan' ? 'pelaksanaan' : 'umpan-balik'
                      }))}
                      className="px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                    >
                      Tahap Berikutnya &rarr;
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPracticeModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Siklus Praktik Kinerja</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INPUT / EDIT BERAKHLAK */}
      {/* ========================================================= */}
      {berakhlakModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">Evaluasi 7 Nilai Dasar BerAKHLAK</h3>
            <form onSubmit={handleSaveBerAKHLAK} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Guru</label>
                <select
                  value={berakhlakModal.data.guruId}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, guruId: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.nama}, {t.gelar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">1. Berorientasi Pelayanan</label>
                <input
                  type="text"
                  placeholder="Apakah berkomitmen memberikan pelayanan prima?"
                  value={berakhlakModal.data.berorientasiPelayanan}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, berorientasiPelayanan: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2. Akuntabel</label>
                <input
                  type="text"
                  placeholder="Apakah bertanggung jawab atas kepercayaan yang diberikan?"
                  value={berakhlakModal.data.akuntabel}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, akuntabel: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">3. Kompeten</label>
                <input
                  type="text"
                  placeholder="Apakah terus belajar dan mengembangkan kapabilitas?"
                  value={berakhlakModal.data.kompeten}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, kompeten: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">4. Harmonis</label>
                <input
                  type="text"
                  placeholder="Apakah saling peduli dan menghargai perbedaan?"
                  value={berakhlakModal.data.harmonis}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, harmonis: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">5. Loyal</label>
                <input
                  type="text"
                  placeholder="Apakah berdedikasi dan mengutamakan kepentingan bangsa & sekolah?"
                  value={berakhlakModal.data.loyal}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, loyal: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">6. Adaptif</label>
                <input
                  type="text"
                  placeholder="Apakah terus berinovasi dan antusias menghadapi perubahan?"
                  value={berakhlakModal.data.adaptif}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, adaptif: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">7. Kolaboratif</label>
                <input
                  type="text"
                  placeholder="Apakah membangun kerja sama yang sinergis?"
                  value={berakhlakModal.data.kolaboratif}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, kolaboratif: e.target.value } }))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Predikat Evaluasi</label>
                <select
                  value={berakhlakModal.data.statusEvaluasi}
                  onChange={e => setBerakhlakModal(prev => ({ ...prev, data: { ...prev.data, statusEvaluasi: e.target.value as any } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Di Atas Ekspektasi">Di Atas Ekspektasi</option>
                  <option value="Memenuhi Ekspektasi">Memenuhi Ekspektasi</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBerakhlakModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan Evaluasi BerAKHLAK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: INPUT / EDIT TUGAS TAMBAHAN */}
      {/* ========================================================= */}
      {taskModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Tugas Tambahan & Refleksi Guru</h3>
            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Guru</label>
                <select
                  value={taskModal.data.guruId}
                  onChange={e => setTaskModal(prev => ({ ...prev, data: { ...prev.data, guruId: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.nama}, {t.gelar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Tugas Tambahan</label>
                <input
                  type="text"
                  placeholder="Contoh: Wali Kelas / Pembina Pramuka / Tim BOS"
                  value={taskModal.data.namaTugas}
                  onChange={e => setTaskModal(prev => ({ ...prev, data: { ...prev.data, namaTugas: e.target.value } }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Refleksi Pelaksanaan Guru *</label>
                <textarea
                  rows={3}
                  placeholder="Refleksi apa saja yang sudah dikerjakan dalam tugas ini..."
                  value={taskModal.data.refleksi}
                  onChange={e => setTaskModal(prev => ({ ...prev, data: { ...prev.data, refleksi: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bukti Dukung (SK / Dokumen)</label>
                <input
                  type="text"
                  placeholder="SK Pembagian Tugas No. 421.2/015/SDN-N03/VII/2026"
                  value={taskModal.data.buktiDukung}
                  onChange={e => setTaskModal(prev => ({ ...prev, data: { ...prev.data, buktiDukung: e.target.value } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Keterlaksanaan</label>
                <select
                  value={taskModal.data.status}
                  onChange={e => setTaskModal(prev => ({ ...prev, data: { ...prev.data, status: e.target.value as any } }))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                >
                  <option value="Selesai">Selesai</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Belum">Belum Terlaksana</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTaskModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-sm text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl"
                >
                  Simpan Tugas Tambahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
