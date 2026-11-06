import React, { useState, useMemo } from 'react';
import {
  BookOpenCheck,
  Code2,
  Calendar,
  Sparkles,
  Printer,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Edit3,
  Save,
  FileText,
  Lightbulb,
  HeartHandshake,
  Cpu,
  Layers,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronDown,
  Upload,
  FileSpreadsheet,
  FileCode,
  HelpCircle,
  X,
  Route,
  ListOrdered,
  CheckCircle2,
  ArrowLeft,
  Workflow,
  Users,
  Award,
  ClipboardCheck
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import {
  MATA_PELAJARAN_LIST,
  FASE_MAP,
  KELAS_LABEL_MAP,
  DIMENSI_PROFIL_LULUSAN,
  initialCapaianPembelajaran
} from '../data/curriculumData';
import {
  CurriculumFase,
  LearningObjectiveTP,
  ProtaRecord,
  ProtaItem,
  PromesRecord,
  PromesItem,
  DeepLearningModule,
  AssessmentRubricLevel
} from '../types';
import { OfficialLogo } from './OfficialLogo';
import { OfficialKopSurat } from './OfficialKopSurat';
import {
  downloadModulAjarWord,
  downloadCurriculumExcelWorkbook,
  downloadCurriculumTemplate,
  parseCurriculumExcel
} from '../utils/curriculumExportUtils';

type SubTab =
  | 'capaian-pembelajaran'
  | 'alur-tujuan-pembelajaran'
  | 'tujuan-pembelajaran'
  | 'modul-ajar'
  | 'promes'
  | 'prota';

export const PerangkatAjarView: React.FC = () => {
  const {
    schoolProfile,
    classes,
    teachers,
    currentActiveUser,
    tujuanList,
    addTujuanPembelajaran,
    updateTujuanPembelajaran,
    deleteTujuanPembelajaran,
    protaList,
    saveProtaRecord,
    promesList,
    savePromesRecord,
    modulAjarList,
    saveModulAjar,
    deleteModulAjar,
    addSyncLog
  } = useSchool();

  // Selection states (Sequential pedagogical workflow starts from Capaian Pembelajaran)
  const [selectedSubTab, setSelectedSubTab] = useState<SubTab>('capaian-pembelajaran');
  const [selectedKelasId, setSelectedKelasId] = useState<string>('c-1a');
  const [selectedMapel, setSelectedMapel] = useState<string>('Koding & Kecerdasan Artifisial');
  const [selectedSemester, setSelectedSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');

  // Copy notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Active Phase and Class Label
  const currentFase: CurriculumFase = FASE_MAP[selectedKelasId] || 'Fase A';
  const currentKelasLabel = KELAS_LABEL_MAP[selectedKelasId] || 'Kelas 1A';

  // Find Homeroom Teacher for this class
  const currentClassObj = classes.find(c => c.id === selectedKelasId);
  const waliKelasTeacher = teachers.find(t => t.id === currentClassObj?.waliKelasId);
  const defaultTeacherName = waliKelasTeacher ? waliKelasTeacher.nama : (currentActiveUser.role.startsWith('Guru') ? currentActiveUser.name : 'Hj. Siti Rohmah, S.Pd.SD');
  const defaultTeacherNIP = waliKelasTeacher?.nip && waliKelasTeacher.nip !== '-' ? waliKelasTeacher.nip : (waliKelasTeacher?.nuptk || '196811121991032007');

  // Filter CP for current fase & mapel
  const activeCP = useMemo(() => {
    return initialCapaianPembelajaran.filter(
      cp => cp.mataPelajaran === selectedMapel && cp.fase === currentFase
    );
  }, [selectedMapel, currentFase]);

  // Filter TP for current fase, mapel & semester
  const activeTPList = useMemo(() => {
    return tujuanList.filter(
      tp => tp.mataPelajaran === selectedMapel && tp.fase === currentFase
    );
  }, [tujuanList, selectedMapel, currentFase]);

  // Active Prota for selected class & mapel
  const currentProta = useMemo(() => {
    return protaList.find(
      p => p.kelasId === selectedKelasId && p.mataPelajaran === selectedMapel
    );
  }, [protaList, selectedKelasId, selectedMapel]);

  // Active Promes for selected class, mapel & semester (Ganjil & Genap)
  const currentPromes = useMemo(() => {
    return promesList.find(
      p => p.kelasId === selectedKelasId && p.mataPelajaran === selectedMapel && p.semester === selectedSemester
    );
  }, [promesList, selectedKelasId, selectedMapel, selectedSemester]);

  const promesGanjil = useMemo(() => {
    return promesList.find(
      p => p.kelasId === selectedKelasId && p.mataPelajaran === selectedMapel && p.semester === 'Ganjil'
    );
  }, [promesList, selectedKelasId, selectedMapel]);

  const promesGenap = useMemo(() => {
    return promesList.find(
      p => p.kelasId === selectedKelasId && p.mataPelajaran === selectedMapel && p.semester === 'Genap'
    );
  }, [promesList, selectedKelasId, selectedMapel]);

  // Modul Ajar list for current class & mapel
  const filteredModules = useMemo(() => {
    return modulAjarList.filter(
      m => m.kelasId === selectedKelasId && m.mataPelajaran === selectedMapel
    );
  }, [modulAjarList, selectedKelasId, selectedMapel]);

  // Active displayed module
  const [selectedModulId, setSelectedModulId] = useState<string>('');
  const activeModul = useMemo(() => {
    if (selectedModulId) {
      const found = filteredModules.find(m => m.id === selectedModulId);
      if (found) return found;
    }
    return filteredModules[0] || null;
  }, [filteredModules, selectedModulId]);

  // ==========================================
  // MODALS STATE
  // ==========================================

  // 1. TP Modal
  const [isTPModalOpen, setIsTPModalOpen] = useState(false);
  const [editingTP, setEditingTP] = useState<LearningObjectiveTP | null>(null);
  const [tpFormData, setTpFormData] = useState({
    kodeTP: '',
    materiPokok: '',
    tujuanDeskripsi: '',
    alokasiJP: 4,
    semester: 'Ganjil' as 'Ganjil' | 'Genap',
    dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas'],
    indikatorKetercapaianText: ''
  });

  // 2. Modul Ajar Manual Editor Modal
  const [isModulEditorOpen, setIsModulEditorOpen] = useState(false);
  const [modulEditorForm, setModulEditorForm] = useState<DeepLearningModule | null>(null);

  // 3. Prota Row Modal
  const [isProtaRowModalOpen, setIsProtaRowModalOpen] = useState(false);
  const [editingProtaRowId, setEditingProtaRowId] = useState<string | null>(null);
  const [protaRowForm, setProtaRowForm] = useState({
    kodeTP: '',
    materiPokok: '',
    semester: 'Ganjil' as 'Ganjil' | 'Genap',
    alokasiJP: 4,
    perkiraanBulan: 'Juli - Agustus'
  });

  // 4. Promes Row Modal
  const [isPromesRowModalOpen, setIsPromesRowModalOpen] = useState(false);
  const [promesRowForm, setPromesRowForm] = useState({
    kodeTP: '',
    materiPokok: '',
    alokasiJP: 4
  });

  // 5. Import Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'tp' | 'prota' | 'promes' | 'modul-json'>('tp');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Helper to copy text to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Helper to print specific clean lesson plan format
  const handlePrint = () => {
    window.print();
  };

  // Download Modul Ajar as Word (.doc)
  const handleDownloadWord = async () => {
    if (!activeModul) return;
    await downloadModulAjarWord(activeModul, schoolProfile);
  };

  // Download Full Curriculum Excel Workbook (.xlsx)
  const handleDownloadExcelWorkbook = () => {
    downloadCurriculumExcelWorkbook({
      prota: currentProta,
      promesGanjil,
      promesGenap,
      tpList: activeTPList,
      schoolProfile,
      kelasLabel: currentKelasLabel,
      mapel: selectedMapel
    });
  };

  // Download Modul Ajar as JSON
  const handleDownloadModulJSON = () => {
    if (!activeModul) return;
    const blob = new Blob([JSON.stringify(activeModul, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Modul_Ajar_${activeModul.kodeModul}_SDN_Nambo_03.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================
  // HANDLERS FOR TP
  // ==========================================
  const handleOpenTPModal = (tpToEdit?: LearningObjectiveTP) => {
    if (tpToEdit) {
      setEditingTP(tpToEdit);
      setTpFormData({
        kodeTP: tpToEdit.kodeTP,
        materiPokok: tpToEdit.materiPokok,
        tujuanDeskripsi: tpToEdit.tujuanDeskripsi,
        alokasiJP: tpToEdit.alokasiJP,
        semester: tpToEdit.semester,
        dimensiProfilLulusan: tpToEdit.dimensiProfilLulusan,
        indikatorKetercapaianText: tpToEdit.indikatorKetercapaian.join('\n')
      });
    } else {
      setEditingTP(null);
      const nextNum = activeTPList.length + 1;
      const mapelCode = selectedMapel.includes('Koding') ? 'KA' : selectedMapel.slice(0, 3).toUpperCase();
      const gradeNum = currentKelasLabel.replace('Kelas ', '').charAt(0);
      setTpFormData({
        kodeTP: `TP-${mapelCode}.${gradeNum}.${nextNum}`,
        materiPokok: '',
        tujuanDeskripsi: '',
        alokasiJP: 4,
        semester: selectedSemester,
        dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas', 'Kolaborasi (Gotong Royong)'],
        indikatorKetercapaianText: '1. Mengidentifikasi konsep secara terstruktur.\n2. Mempraktikkan keterampilan melalui unjuk kerja nyata.\n3. Merefleksikan hasil belajar dengan santun.'
      });
    }
    setIsTPModalOpen(true);
  };

  const handleSaveTPModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tpFormData.materiPokok || !tpFormData.tujuanDeskripsi) {
      alert('Mohon isi materi pokok dan deskripsi tujuan pembelajaran');
      return;
    }

    const indikatorArray = tpFormData.indikatorKetercapaianText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const gradeNum = currentKelasLabel.replace('Kelas ', '').charAt(0);

    if (editingTP) {
      updateTujuanPembelajaran(editingTP.id, {
        kodeTP: tpFormData.kodeTP,
        materiPokok: tpFormData.materiPokok,
        tujuanDeskripsi: tpFormData.tujuanDeskripsi,
        alokasiJP: Number(tpFormData.alokasiJP),
        semester: tpFormData.semester,
        dimensiProfilLulusan: tpFormData.dimensiProfilLulusan,
        indikatorKetercapaian: indikatorArray
      });
    } else {
      addTujuanPembelajaran({
        cpId: activeCP[0]?.id || 'cp-general',
        kodeTP: tpFormData.kodeTP,
        mataPelajaran: selectedMapel,
        fase: currentFase,
        kelasTarget: `Kelas ${gradeNum}`,
        semester: tpFormData.semester,
        materiPokok: tpFormData.materiPokok,
        tujuanDeskripsi: tpFormData.tujuanDeskripsi,
        alokasiJP: Number(tpFormData.alokasiJP),
        dimensiProfilLulusan: tpFormData.dimensiProfilLulusan,
        indikatorKetercapaian: indikatorArray,
        urutanATP: activeTPList.length + 1
      });
    }

    setIsTPModalOpen(false);
  };

  // ==========================================
  // HANDLERS FOR MODUL AJAR MANUAL EDITOR
  // ==========================================
  const handleOpenModulEditor = (modulToEdit?: DeepLearningModule | null) => {
    if (modulToEdit) {
      setModulEditorForm(JSON.parse(JSON.stringify(modulToEdit)));
    } else {
      // Create empty template for manual input
      const nextNum = filteredModules.length + 1;
      const gradeNum = currentKelasLabel.replace('Kelas ', '').charAt(0);
      const isCoding = selectedMapel.includes('Koding');

      const template: DeepLearningModule = {
        id: `ma-manual-${Date.now()}`,
        tpId: activeTPList[0]?.id || 'tp-custom',
        kodeModul: `MA-DL-${isCoding ? 'KA' : 'MAPEL'}-${currentKelasLabel.replace(' ', '')}-0${nextNum}`,
        mataPelajaran: selectedMapel,
        kelasId: selectedKelasId,
        kelasNama: currentKelasLabel,
        fase: currentFase,
        alokasiWaktu: '2 JP (2 x 35 Menit)',
        pertemuanKe: nextNum,
        tahunAjaran: schoolProfile.tahunAjaran,
        semester: selectedSemester,
        tanggalAjar: new Date().toISOString().slice(0, 10),

        guruPenyusun: defaultTeacherName,
        nipGuruPenyusun: defaultTeacherNIP,
        kepalaSekolah: schoolProfile.kepalaSekolah,
        nipKepalaSekolah: schoolProfile.nipKepalaSekolah,
        kesiapanBelajarMurid: `Peserta didik di ${currentKelasLabel} memiliki antusiasme belajar tinggi dan minat eksplorasi aktif. Memerlukan bimbingan bertahap dan penguatan konsep konkret.`,
        dimensiProfilLulusan: ['Penalaran Kritis', 'Kreativitas', 'Kolaborasi (Gotong Royong)'],
        prinsipDeepLearning: {
          mindful: 'Peserta didik berkesadaran penuh memahami tujuan dan manfaat materi ini bagi kehidupannya.',
          meaningful: `Mengaitkan materi pokok secara kontekstual dengan kehidupan nyata di lingkungan sekitar sekolah.`,
          joyful: 'Pembelajaran disajikan menyenangkan, interaktif, tanpa ketakutan salah dan penuh semangat gotong royong.',
          olahDimensi: ['Olahpikir', 'Olahhati', 'Olahrasa']
        },

        desainPembelajaran: {
          tujuanSpesifik: activeTPList[0]?.tujuanDeskripsi || 'Peserta didik mampu memahami dan mempraktikkan materi pembelajaran.',
          praktikPedagogis: isCoding ? 'Problem-Based Learning & Pemrograman Blok Visual / Unplugged' : 'Inkuiri Terbimbing & Diskusi Kolaboratif',
          lingkunganBelajar: 'Ruang kelas ramah anak, bersih, inklusif, dan mendukung kolaborasi tim.',
          kemitraan: 'Melibatkan orang tua untuk mendampingi pembiasaan belajar mandiri di rumah.',
          pemanfaatanDigitalAI: isCoding ? 'Menggunakan simulator koding visual ramah anak & pengenalan etika teknologi.' : 'Menayangkan video edukatif dan media peraga interaktif.'
        },

        pengalamanBelajar: {
          kegiatanAwal: {
            alokasiMenit: 10,
            langkah: [
              'Guru menyapa ramah, mengajak berdoa bersama, dan memeriksa kehadiran murid.',
              'Mindful Check-in: Latihan olah nafas sejenak untuk memusatkan perhatian belajar.',
              'Apersepsi dan pengaitan pengalaman sehari-hari.',
              'Menyampaikan tujuan pembelajaran dan memotivasi murid.'
            ],
            pertanyaanPemantik: [
              'Apa yang kalian bayangkan saat mendengar materi hari ini?',
              'Mengapa materi ini penting untuk kita pelajari bersama?'
            ]
          },
          kegiatanInti: {
            alokasiMenit: 50,
            memahami: [
              'Murid mengamati stimulus visual/konkret yang diberikan guru.',
              'Murid berdiskusi aktif menguraikan konsep utama dan bertanya jawab.'
            ],
            mengaplikasi: [
              'Murid bekerja dalam kelompok mempraktikkan langkah penyelesaian tugas.',
              'Guru memfasilitasi dan membimbing kelompok yang memerlukan scaffolding.'
            ],
            merefleksi: [
              'Perwakilan kelompok mempresentasikan hasil karyanya di depan kelas.',
              'Murid lain memberikan apresiasi tepuk tangan dan masukan membangun.'
            ]
          },
          kegiatanPenutup: {
            alokasiMenit: 10,
            langkah: [
              'Guru bersama murid merumuskan kesimpulan pembelajaran.',
              'Refleksi emosi perasaan murid hari ini.',
              'Doa dan salam penutup.'
            ],
            tindakLanjut: 'Mempraktikkan kebiasaan baik di rumah.'
          }
        },

        asesmenAutentik: {
          formatifAwal: 'Tanya jawab diagnostik di awal pembelajaran.',
          formatifProses: 'Observasi keaktifan diskusi dan kerja sama kelompok.',
          sumatif: 'Unjuk kerja / tes pemahaman akhir materi.',
          rubrik: [
            {
              aspek: 'Penguasaan Konsep Dasar',
              perluBimbingan: 'Belum memahami konsep dasar; butuh bantuan penuh (< 70).',
              cukup: 'Memahami sebagian konsep dengan bimbingan berkala (70-79).',
              baik: 'Memahami konsep dengan baik dan mandiri (80-89).',
              sangatBaik: 'Sangat menguasai konsep dan dapat membimbing teman sebaya (90-100).'
            },
            {
              aspek: 'Keterampilan Praktik & Pemecahan Masalah',
              perluBimbingan: 'Belum mampu menyelesaikan tantangan tugas (< 70).',
              cukup: 'Menyelesaikan sebagian tugas dengan arahan (70-79).',
              baik: 'Menyelesaikan tugas secara mandiri dan runtut (80-89).',
              sangatBaik: 'Sangat kreatif dan memberikan solusi orisinal (90-100).'
            },
            {
              aspek: 'Kolaborasi & Nilai Berkesadaran',
              perluBimbingan: 'Kurang bekerja sama dalam tim (< 70).',
              cukup: 'Cukup bekerja sama bila diingatkan (70-79).',
              baik: 'Aktif berkolaborasi dan menghargai teman (80-89).',
              sangatBaik: 'Sangat empatik, komunikatif, dan memimpin secara suportif (90-100).'
            }
          ],
          bahanAjarRingkas: `RINGKASAN BAHAN AJAR GURU & MURID\nSD NEGERI NAMBO 03\nMata Pelajaran: ${selectedMapel} | Kelas: ${currentKelasLabel}\n\n1. Konsep Utama:\nPembelajaran terpadu berkesadaran, bermakna, dan menyenangkan.\n2. Ringkasan Materi:\nPenjelasan materi terstruktur untuk pendampingan belajar di kelas dan rumah.`,
          lembarKerjaSiswa: `LEMBAR KERJA PESERTA DIDIK (LKPD)\nNama: ____________________ Kelas: ${currentKelasLabel}\nMata Pelajaran: ${selectedMapel}\n\nPetunjuk:\n1. Diskusikan bersama kelompokmu!\n2. Selesaikan tantangan langkah demi langkah!\n[ Ruang Jawaban ]`,
          bentukJenis: {
            diagnostikAwal: 'Asesmen diagnostik non-kognitif & kognitif kesiapan belajar.',
            formatifProses: 'Observasi keaktifan diskusi dan kerja sama kelompok.',
            sumatifAkhir: 'Tes tertulis (Pilihan Ganda & HOTS) serta unjuk pemahaman autentik.',
            teknikInstrumen: [
              'Teknik Observasi Sikap Profil Lulusan & BerAKHLAK',
              'Teknik Praktik / Kinerja Pemecahan Masalah',
              'Teknik Tes Tertulis Evaluasi Mandiri',
              'Teknik Portofolio LKPD Terstruktur'
            ]
          },
          soalIndividu: {
            petunjuk: 'Jawablah pertanyaan berikut dengan teliti, cermat, dan mandiri!',
            daftarSoal: [
              {
                nomor: 1,
                bentuk: 'Pilihan Ganda',
                pertanyaan: 'Manfaat utama penerapan materi ini dalam kehidupan sehari-hari adalah...',
                pilihan: ['A. Mempermudah pemecahan masalah secara teratur', 'B. Menjadi sombong', 'C. Menghindari belajar', 'D. Tidak tahu apa-apa'],
                kunciJawaban: 'A. Mempermudah pemecahan masalah secara teratur',
                bobotSkor: 20
              },
              {
                nomor: 2,
                bentuk: 'Uraian Singkat',
                pertanyaan: 'Tuliskan pemahamanmu tentang materi pokok yang telah dipelajari!',
                kunciJawaban: 'Penerapan konsep secara runtut dan terarah.',
                bobotSkor: 40
              },
              {
                nomor: 3,
                bentuk: 'HOTS',
                pertanyaan: 'Bagaimana cara kamu membantu teman yang kesulitan memahami materi ini?',
                kunciJawaban: 'Membantunya dengan sabar, empati, dan penjelasan runtut.',
                bobotSkor: 40
              }
            ],
            totalSkor: 100
          },
          soalKelompok: {
            judulTantangan: 'Proyek Kolaborasi Kelompok: Pemecahan Masalah Kontekstual',
            petunjukKelompok: 'Bekerja samalah dalam kelompok 3-4 murid dan bagi peran secara adil.',
            skenarioKasus: 'Selesaikan studi kasus yang disajikan dengan menerapkan konsep materi secara kreatif.',
            tugasKolaboratif: [
              'Diskusikan ide solusi pemecahan masalah.',
              'Tuangkan rancangan pada lembar kerja tim.',
              'Presentasikan hasil di hadapan kelas.'
            ],
            kriteriaPenilaian: [
              { aspek: 'Kekompakan & Pembagian Peran', bobot: '30%', deskripsi: 'Seluruh anggota aktif dan saling menghargai.' },
              { aspek: 'Ketepatan Solusi', bobot: '40%', deskripsi: 'Solusi runtut dan tepat konsep.' },
              { aspek: 'Presentasi & Komunikasi', bobot: '30%', deskripsi: 'Penyampaian percaya diri dan jelas.' }
            ]
          },
          lkpdLengkap: {
            judulLKPD: `LEMBAR KERJA PESERTA DIDIK (LKPD) TERSTRUKTUR: ${selectedMapel.toUpperCase()}`,
            identitasKelompok: true,
            tujuanAktivitas: 'Peserta didik memahami konsep secara bermakna dan berkesadaran penuh.',
            alatDanBahan: ['Buku sumber belajar', 'Alat tulis', 'Lembar kerja aktivitas'],
            petunjukPengerjaan: [
              'Berdoalah sebelum memulai kegiatan bersama.',
              'Tuliskan identitas kelompok dan anggota.',
              'Diskusikan dan selesaikan tantangan bersama teman.'
            ],
            langkahEksplorasi: [
              'Langkah 1: Amati permasalahan yang diberikan guru.',
              'Langkah 2: Rencanakan langkah-langkah solusi.',
              'Langkah 3: Uji coba solusi dan catat hasilnya.'
            ],
            tabelAktivitasKerja: 'Tabel Checklist: [ ] Mengamati [ ] Mengerjakan [ ] Merefleksikan',
            pertanyaanDiskusiReflektif: [
              'Apa hal yang paling menarik dari pelajaran hari ini?',
              'Bagaimana kelompokmu menyelesaikan kendala?'
            ],
            refleksiDiri: 'Perasaanku hari ini: [ ] Sangat Bahagia  [ ] Bahagia  [ ] Perlu Latihan Lagi'
          }
        },

        updatedAt: new Date().toISOString()
      };
      setModulEditorForm(template);
    }
    setIsModulEditorOpen(true);
  };

  const handleSaveModulEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modulEditorForm) return;

    saveModulAjar(modulEditorForm);
    setSelectedModulId(modulEditorForm.id);
    setIsModulEditorOpen(false);
    alert(`Modul Ajar "${modulEditorForm.kodeModul}" berhasil disimpan ke sistem!`);
  };

  // Generate / Instantiate Deep Learning Modul Ajar from TP
  const handleGenerateModulFromTP = (tp: LearningObjectiveTP) => {
    const isCoding = selectedMapel.includes('Koding');
    const gradeNum = currentKelasLabel.replace('Kelas ', '').charAt(0);

    const newModul: DeepLearningModule = {
      id: `ma-${Date.now()}`,
      tpId: tp.id,
      kodeModul: `MA-DL-${isCoding ? 'KA' : 'MAPEL'}-${currentKelasLabel.replace(' ', '')}-${Math.floor(10 + Math.random() * 90)}`,
      mataPelajaran: selectedMapel,
      kelasId: selectedKelasId,
      kelasNama: currentKelasLabel,
      fase: currentFase,
      alokasiWaktu: `${tp.alokasiJP} JP (${tp.alokasiJP} x 35 Menit)`,
      pertemuanKe: filteredModules.length + 1,
      tahunAjaran: schoolProfile.tahunAjaran,
      semester: selectedSemester,
      tanggalAjar: new Date().toISOString().slice(0, 10),

      guruPenyusun: defaultTeacherName,
      nipGuruPenyusun: defaultTeacherNIP,
      kepalaSekolah: schoolProfile.kepalaSekolah,
      nipKepalaSekolah: schoolProfile.nipKepalaSekolah,
      kesiapanBelajarMurid: `Berdasarkan asesmen diagnostik awal di ${currentKelasLabel}, peserta didik sangat antusias dengan media interaktif dan eksplorasi visual. Sebagian besar murid memiliki pemahaman konkret awal dan memerlukan bimbingan bertahap (scaffolding) melalui aktivitas kelompok kolaboratif.`,
      dimensiProfilLulusan: tp.dimensiProfilLulusan.length > 0 ? tp.dimensiProfilLulusan : ['Penalaran Kritis', 'Kreativitas', 'Kolaborasi (Gotong Royong)'],
      prinsipDeepLearning: {
        mindful: 'Peserta didik menyadari penuh tujuan dan makna setiap kegiatan belajar, menumbuhkan rasa ingin tahu dan fokus berkesadaran (olahpikir & olahrasa).',
        meaningful: `Peserta didik mengaitkan materi "${tp.materiPokok}" dengan kehidupan nyata di lingkungan sekitar sekolah SDN Nambo 03 dan rumah.`,
        joyful: 'Pembelajaran berlangsung hangat, interaktif, menggembirakan tanpa rasa takut salah, diwarnai apresiasi dan kolaborasi aktif.',
        olahDimensi: ['Olahpikir', 'Olahhati', 'Olahrasa']
      },

      desainPembelajaran: {
        tujuanSpesifik: tp.tujuanDeskripsi,
        praktikPedagogis: isCoding
          ? (currentFase === 'Fase A' ? 'Pembelajaran Berbasis Permainan Unplugged (Logika Gerak, Kartu Instruksi, Simulasi Robot)' : 'Problem-Based Learning & Pemrograman Blok Visual Interaktif')
          : 'Inkuiri Terbimbing, Eksplorasi Konsep Nyata, & Diskusi Kolaboratif Kelompok',
        lingkunganBelajar: 'Ruang kelas yang ramah anak, inklusif, tertata rapi untuk kerja tim berpasangan/kelompok, serta aman dan suportif.',
        kemitraan: 'Melibatkan komunikasi dengan orang tua untuk menguatkan pembiasaan positif dan rasa ingin tahu murid di rumah.',
        pemanfaatanDigitalAI: isCoding
          ? 'Memanfaatkan simulasi koding visual, media grafis anak, serta pengenalan konsep AI etis ramah anak.'
          : 'Pemanfaatan slide interaktif dan video edukatif kontekstual.'
      },

      pengalamanBelajar: {
        kegiatanAwal: {
          alokasiMenit: 10,
          langkah: [
            'Guru menyapa murid dengan hangat, senyum, menanyakan kabar, dan memimpin doa pembuka.',
            'Mindful check-in: Melakukan "Tepuk Fokus & Olah Nafas Tenang" untuk memusatkan perhatian murid.',
            `Apersepsi: Mengaitkan pengalaman sehari-hari murid dengan materi "${tp.materiPokok}".`,
            'Menyampaikan tujuan pembelajaran hari ini dan kesepakatan belajar yang menggembirakan.'
          ],
          pertanyaanPemantik: [
            `Pernahkah kalian melihat atau mengalami hal yang berkaitan dengan ${tp.materiPokok}?`,
            'Mengapa penting bagi kita untuk mempelajari hal ini bersama-sama hari ini?'
          ]
        },
        kegiatanInti: {
          alokasiMenit: 50,
          memahami: [
            'Tahap 1 (Memahami - Mindful & Bermakna): Murid mengamati stimulus (gambar/benda konkret/kartu) yang disediakan guru.',
            'Murid berdiskusi mengidentifikasi pola, konsep utama, dan mengajukan pertanyaan kritis.',
            'Guru memberikan penguatan konsep secara terstruktur dan dialogis.'
          ],
          mengaplikasi: [
            'Tahap 2 (Mengaplikasi - Bermakna & Menggembirakan): Murid bekerja dalam kelompok kecil menyelesaikan lembar aktivitas.',
            isCoding
              ? 'Murid mempraktikkan susunan instruksi algoritma (kartu langkah / blok koding visual) bersama anggota timnya.'
              : 'Murid menerapkan konsep ke dalam pemecahan masalah konkret secara kolaboratif.',
            'Guru berkeliling memberikan bimbingan sesuai kebutuhan belajar murid (diferensiasi proses).'
          ],
          merefleksi: [
            'Tahap 3 (Merefleksi - Mindful & Joyful): Setiap perwakilan kelompok berbagi hasil karyanya.',
            'Murid lain memberikan apresiasi tepuk tangan dan umpan balik yang membangun.',
            'Murid mendiskusikan apa saja yang berhasil dipelajari dan apa yang perlu diperbaiki jika terjadi kendala.'
          ]
        },
        kegiatanPenutup: {
          alokasiMenit: 10,
          langkah: [
            'Guru bersama peserta didik membuat rangkuman kesimpulan inti pembelajaran.',
            'Refleksi emosi: Murid mengangkat kartu emoji perasaan atau menceritakan bagian yang paling disukai.',
            'Guru memberikan apresiasi setinggi-tingginya atas partisipasi aktif seluruh murid.',
            'Menutup kegiatan dengan doa dan salam penutup.'
          ],
          tindakLanjut: 'Murid diajak menerapkan nilai kebaikan/keterampilan yang telah dipelajari dalam keseharian di rumah.'
        }
      },

      asesmenAutentik: {
        formatifAwal: 'Tanya jawab diagnostik dan pengamatan kesiapan belajar pada sesi apersepsi awal.',
        formatifProses: 'Lembar observasi keterlibatan diskusi, kerja sama tim, dan ketepatan langkah pengerjaan aktivitas.',
        sumatif: `Unjuk kerja / tes unjuk pemahaman autentik terkait ketercapaian TP: ${tp.kodeTP}.`,
        rubrik: [
          {
            aspek: `Penguasaan Konsep (${tp.materiPokok})`,
            perluBimbingan: 'Belum mampu menjelaskan konsep dasar; memerlukan bimbingan guru secara penuh (Skor < 70).',
            cukup: 'Mampu menjelaskan sebagian konsep namun belum konsisten dalam menerapkannya (Skor 70-79).',
            baik: 'Mampu memahami dan menerapkan konsep secara runtut dengan bantuan minimal (Skor 80-89).',
            sangatBaik: 'Sangat menguasai konsep secara mendalam, mandiri, dan mampu menjelaskan kepada temannya (Skor 90-100).'
          },
          {
            aspek: 'Kreativitas & Keterampilan Praktik / Koding',
            perluBimbingan: 'Membutuhkan bantuan pada setiap tahapan praktik/penyusunan langkah (Skor < 70).',
            cukup: 'Dapat menyelesaikan tugas praktik dengan beberapa kali arahan teman/guru (Skor 70-79).',
            baik: 'Menyelesaikan praktik secara mandiri dengan hasil yang rapi dan logis (Skor 80-89).',
            sangatBaik: 'Sangat kreatif, memberikan ide-ide orisinal dan solusi cerdas dalam memecahkan masalah (Skor 90-100).'
          },
          {
            aspek: 'Kolaborasi & Nilai Berkesadaran (Mindful & Joyful)',
            perluBimbingan: 'Kurang fokus atau pasif dalam kerja kelompok (Skor < 70).',
            cukup: 'Cukup aktif bekerja sama jika diarahkan oleh teman sebaya (Skor 70-79).',
            baik: 'Bekerja sama dengan antusias, menghargai pendapat orang lain, dan berbahagia (Skor 80-89).',
            sangatBaik: 'Menjadi teladan kerja sama, sangat empatik, santun, dan menciptakan atmosfer ceria di kelas (Skor 90-100).'
          }
        ],
        bahanAjarRingkas: `RINGKASAN BAHAN AJAR GURU & MURID\nSD NEGERI NAMBO 03 KLAPANUNGGAL\nMATA PELAJARAN: ${selectedMapel} | KELAS: ${currentKelasLabel}\nMATERI: ${tp.materiPokok}\n\n1. KONSEP DASAR:\n${tp.tujuanDeskripsi}\n\n2. POIN PENTING PEMBELAJARAN:\n- Menghubungkan logika berpikir runtut dan pemecahan masalah dengan kehidupan sehari-hari.\n- Mengutamakan kerja sama, kejujuran, dan rasa ingin tahu yang tinggi.\n- Setiap murid berhak belajar dengan gembira, saling menghargai, dan tidak takut membuat kesalahan.`,
        lembarKerjaSiswa: `LEMBAR KERJA PESERTA DIDIK (LKPD) PEMBELAJARAN MENDALAM\nSD NEGERI NAMBO 03\nNama Peserta Didik : ________________________\nKelas / No. Absen  : ${currentKelasLabel} / ______\nMata Pelajaran     : ${selectedMapel}\nMateri Pokok       : ${tp.materiPokok}\n\nTUGAS / AKTIVITAS KELOMPOK:\n1. Bacalah petunjuk bersama teman kelompokmu dengan teliti!\n2. Selesaikan tantangan pemecahan masalah di bawah ini secara bersama-sama!\n3. Tuliskan atau gambarkan langkah penyelesaianmu di kolom jawaban berikut:\n[ Kotak Jawaban / Gambar Solusi ]\n\nREFLEKSI DIRI HARI INI:\n- Hal paling seru yang kupelajari hari ini adalah: _______________________\n- Perasaanku saat belajar bersama teman: [ ] Sangat Senang  [ ] Senang  [ ] Butuh Bimbingan`,

        bentukJenis: {
          diagnostikAwal: `Asesmen diagnostik: Mengidentifikasi pemahaman awal dan kesiapan belajar murid mengenai ${tp.materiPokok}.`,
          formatifProses: 'Asesmen formatif: Observasi keaktifan diskusi, kemampuan pemecahan masalah, dan kerja sama gotong royong.',
          sumatifAkhir: `Asesmen sumatif: Tes tertulis (Pilihan Ganda & HOTS) serta unjuk pemahaman autentik ketercapaian ${tp.kodeTP}.`,
          teknikInstrumen: [
            'Teknik Observasi: Rubrik Sikap Bernalar Kritis & Bergotong Royong',
            `Teknik Praktik / Kinerja: Demonstrasi & Pemecahan Masalah Materi ${tp.materiPokok}`,
            'Teknik Tes Tertulis: Lembar Soal Evaluasi Individu (5 Butir Soal Terstruktur)',
            'Teknik Portofolio: Hasil Pengerjaan LKPD Terstruktur & Refleksi Mandiri'
          ]
        },
        soalIndividu: {
          petunjuk: 'Jawablah pertanyaan berikut dengan cermat, teliti, dan mandiri!',
          daftarSoal: [
            {
              nomor: 1,
              bentuk: 'Pilihan Ganda',
              pertanyaan: `Manfaat utama memahami ${tp.materiPokok} dalam kehidupan sehari-hari adalah...`,
              pilihan: ['A. Mempermudah pemecahan masalah secara teratur', 'B. Menjadi sombong', 'C. Menghindari belajar', 'D. Tidak tahu apa-apa'],
              kunciJawaban: 'A. Mempermudah pemecahan masalah secara teratur',
              bobotSkor: 20
            },
            {
              nomor: 2,
              bentuk: 'Pilihan Ganda',
              pertanyaan: `Langkah awal yang paling tepat ketika menghadapi persoalan ${tp.materiPokok} adalah...`,
              pilihan: ['A. Mengamati dan memahami informasi yang ada', 'B. Langsung menebak', 'C. Menyerah', 'D. Mengabaikan masalah'],
              kunciJawaban: 'A. Mengamati dan memahami informasi yang ada',
              bobotSkor: 20
            },
            {
              nomor: 3,
              bentuk: 'Uraian Singkat',
              pertanyaan: `Jelaskan secara ringkas menurut pemahamanmu apa yang dimaksud dengan ${tp.materiPokok}!`,
              kunciJawaban: `${tp.tujuanDeskripsi}`,
              bobotSkor: 30
            },
            {
              nomor: 4,
              bentuk: 'HOTS',
              pertanyaan: `Jika dalam kelompokmu terdapat teman yang belum memahami langkah pengerjaan ${tp.materiPokok}, bagaimana cara terbaikmu membantunya dengan sikap berkesadaran?`,
              kunciJawaban: 'Mengajaknya berdiskusi dengan sabar, menjelaskan langkah demi langkah secara runtut, dan memberikannya kesempatan mencoba sendiri dengan penuh empati.',
              bobotSkor: 30
            }
          ],
          totalSkor: 100
        },
        soalKelompok: {
          judulTantangan: `Proyek Kolaborasi Kelompok: Eksplorasi Kreatif ${tp.materiPokok}`,
          petunjukKelompok: 'Bentuklah kelompok 3-4 peserta didik. Bagilah peran: Ketua Tim, Pencatat/Notulis, dan Penyaji.',
          skenarioKasus: `Kelompok ditantang untuk merancang solusi kontekstual penerapan ${tp.materiPokok} di lingkungan sekolah atau rumah.`,
          tugasKolaboratif: [
            'Diskusikan konsep pokok dan kumpulkan ide pemecahan masalah dari seluruh anggota tim.',
            'Susun langkah solusi secara sistematis dan tuangkan ke dalam lembar kerja kelompok.',
            'Presentasikan hasil diskusi secara bergantian dengan santun dan percaya diri.',
            'Berikan tanggapan positif atas hasil karya kelompok lain.'
          ],
          kriteriaPenilaian: [
            { aspek: 'Kekompakan & Pembagian Peran', bobot: '30%', deskripsi: 'Seluruh anggota terlibat aktif dan saling menghargai pendapat.' },
            { aspek: 'Ketepatan Konsep & Solusi', bobot: '40%', deskripsi: 'Solusi yang diajukan tepat dan sesuai dengan indikator pembelajaran.' },
            { aspek: 'Kreativitas & Komunikasi Presentasi', bobot: '30%', deskripsi: 'Penyampaian jelas, percaya diri, dan responsif terhadap masukan.' }
          ]
        },
        lkpdLengkap: {
          judulLKPD: `LEMBAR KERJA PESERTA DIDIK (LKPD) DEEP LEARNING: ${tp.materiPokok.toUpperCase()}`,
          identitasKelompok: true,
          tujuanAktivitas: tp.tujuanDeskripsi,
          alatDanBahan: ['Buku sumber belajar siswa', 'Alat tulis dan lembar kerja', 'Media kartu petunjuk / peraga'],
          petunjukPengerjaan: [
            'Berdoa sebelum memulai kegiatan bersama tim.',
            'Tuliskan identitas kelompok dan anggota pada bagian atas.',
            'Ikuti langkah demi langkah dengan teliti dan gotong royong.',
            'Tanyakan kepada guru bila ada langkah yang belum dipahami.'
          ],
          langkahEksplorasi: [
            'Langkah 1: Baca dan pahami konsep masalah yang disajikan guru.',
            'Langkah 2: Diskusikan bersama rekan sekelompok mengenai alternatif solusi terbaik.',
            'Langkah 3: Tuliskan kesepakatan langkah pemecahan pada tabel kerja.',
            'Langkah 4: Lakukan uji coba bersama dan simpulkan hasil belajarmu.'
          ],
          tabelAktivitasKerja: `Tabel Checklist Aktivitas Kelompok:\n1. Tahap Memahami Konsep: [ Terlaksana / Bimbingan ]\n2. Tahap Diskusi & Praktik: [ Terlaksana / Bimbingan ]\n3. Tahap Presentasi & Refleksi: [ Terlaksana / Bimbingan ]`,
          pertanyaanDiskusiReflektif: [
            'Apa hal terpenting yang kalian pelajari hari ini?',
            'Apa tantangan tersulit yang berhasil kalian selesaikan bersama teman?',
            'Bagaimana cara kalian saling membantu selama kegiatan berlangsung?'
          ],
          refleksiDiri: 'Beri tanda centang (√) perasaanmu belajar hari ini: [ ] Sangat Bahagia & Paham  [ ] Bahagia  [ ] Butuh Latihan Tambahan'
        }
      },

      updatedAt: new Date().toISOString()
    };

    saveModulAjar(newModul);
    setSelectedModulId(newModul.id);
    setSelectedSubTab('modul-ajar');
    alert(`Modul Ajar Deep Learning untuk ${tp.kodeTP} berhasil dibuat secara otomatis dan tersimpan ke sistem database!`);
  };

  // ==========================================
  // HANDLERS FOR PROTA & PROMES
  // ==========================================
  const handleGenerateProta = () => {
    const items = activeTPList.map(tp => ({
      id: `prow-${tp.id}`,
      kodeTP: tp.kodeTP,
      materiPokok: tp.materiPokok,
      semester: tp.semester,
      alokasiJP: tp.alokasiJP,
      perkiraanBulan: tp.semester === 'Ganjil' ? 'Juli - November' : 'Januari - Mei'
    }));

    const totalJP = items.reduce((acc, curr) => acc + curr.alokasiJP, 0);

    const newProta: ProtaRecord = {
      id: `prota-${selectedKelasId}-${selectedMapel.replace(/\s+/g, '-').toLowerCase()}`,
      kelasId: selectedKelasId,
      mataPelajaran: selectedMapel,
      tahunAjaran: schoolProfile.tahunAjaran,
      guruPengampu: defaultTeacherName,
      totalJPEfektif: totalJP,
      items,
      catatan: `Disusun berdasarkan Capaian Pembelajaran Kurikulum Merdeka TA ${schoolProfile.tahunAjaran} SDN Nambo 03.`,
      updatedAt: new Date().toISOString()
    };

    saveProtaRecord(newProta);
    alert('Program Tahunan (Prota) berhasil disinkronkan dari daftar Tujuan Pembelajaran!');
  };

  const handleOpenProtaRowModal = (rowId?: string) => {
    if (rowId && currentProta) {
      const row = currentProta.items.find(r => r.id === rowId);
      if (row) {
        setEditingProtaRowId(row.id);
        setProtaRowForm({
          kodeTP: row.kodeTP,
          materiPokok: row.materiPokok,
          semester: row.semester,
          alokasiJP: row.alokasiJP,
          perkiraanBulan: row.perkiraanBulan
        });
      }
    } else {
      setEditingProtaRowId(null);
      setProtaRowForm({
        kodeTP: `TP-${selectedMapel.includes('Koding') ? 'KA' : 'MAPEL'}.${currentKelasLabel.replace('Kelas ', '').charAt(0)}.${(currentProta?.items.length || 0) + 1}`,
        materiPokok: '',
        semester: selectedSemester,
        alokasiJP: 4,
        perkiraanBulan: selectedSemester === 'Ganjil' ? 'Juli - Agustus' : 'Januari - Maret'
      });
    }
    setIsProtaRowModalOpen(true);
  };

  const handleSaveProtaRowModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!protaRowForm.materiPokok) return;

    const baseProta = currentProta || {
      id: `prota-${selectedKelasId}-${selectedMapel.replace(/\s+/g, '-').toLowerCase()}`,
      kelasId: selectedKelasId,
      mataPelajaran: selectedMapel,
      tahunAjaran: schoolProfile.tahunAjaran,
      guruPengampu: defaultTeacherName,
      totalJPEfektif: 0,
      items: [],
      updatedAt: new Date().toISOString()
    };

    let updatedItems = [...baseProta.items];
    if (editingProtaRowId) {
      updatedItems = updatedItems.map(item => item.id === editingProtaRowId ? { ...item, ...protaRowForm, alokasiJP: Number(protaRowForm.alokasiJP) } : item);
    } else {
      updatedItems.push({
        id: `prow-${Date.now()}`,
        ...protaRowForm,
        alokasiJP: Number(protaRowForm.alokasiJP)
      });
    }

    const totalJP = updatedItems.reduce((acc, curr) => acc + curr.alokasiJP, 0);
    saveProtaRecord({
      ...baseProta,
      totalJPEfektif: totalJP,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });

    setIsProtaRowModalOpen(false);
  };

  const handleDeleteProtaRow = (rowId: string) => {
    if (!currentProta) return;
    if (window.confirm('Hapus baris Prota ini?')) {
      const updatedItems = currentProta.items.filter(item => item.id !== rowId);
      const totalJP = updatedItems.reduce((acc, curr) => acc + curr.alokasiJP, 0);
      saveProtaRecord({
        ...currentProta,
        totalJPEfektif: totalJP,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleGeneratePromes = () => {
    const semesterTPs = activeTPList.filter(tp => tp.semester === selectedSemester);
    if (semesterTPs.length === 0) {
      alert(`Belum ada Tujuan Pembelajaran yang ditugaskan untuk Semester ${selectedSemester}. Silakan tambah TP terlebih dahulu.`);
      return;
    }

    const items = semesterTPs.map((tp, idx) => {
      const monthIndex = Math.min(Math.floor(idx / 2) + 1, 5);
      return {
        id: `prom-${tp.id}`,
        kodeTP: tp.kodeTP,
        materiPokok: tp.materiPokok,
        alokasiJP: tp.alokasiJP,
        distribusiMingguan: {
          [`M${monthIndex}_W1`]: Math.ceil(tp.alokasiJP / 2),
          [`M${monthIndex}_W2`]: Math.floor(tp.alokasiJP / 2)
        }
      };
    });

    const totalJP = items.reduce((acc, curr) => acc + curr.alokasiJP, 0);

    const newPromes: PromesRecord = {
      id: `promes-${selectedKelasId}-${selectedMapel.replace(/\s+/g, '-').toLowerCase()}-${selectedSemester.toLowerCase()}`,
      kelasId: selectedKelasId,
      mataPelajaran: selectedMapel,
      tahunAjaran: schoolProfile.tahunAjaran,
      semester: selectedSemester,
      guruPengampu: defaultTeacherName,
      totalJPSemester: totalJP,
      items,
      agendaKhusus: selectedSemester === 'Ganjil' ? {
        'M1_W1': 'MPLS & Pembiasaan Karakter SDN Nambo 03',
        'M3_W3': 'Sumatif Tengah Semester (STS) Ganjil',
        'M6_W2': 'Sumatif Akhir Semester (SAS)',
        'M6_W3': 'Pembagian Rapor & Libur Semester'
      } : {
        'M1_W1': 'Awal Masuk Semester Genap',
        'M3_W3': 'Sumatif Tengah Semester (STS) Genap',
        'M6_W2': 'Sumatif Akhir Jenjang / Tahun (SAT)',
        'M6_W3': 'Rapor Kenaikan Kelas & Libur Panjang'
      },
      catatan: `Minggu efektif Semester ${selectedSemester} TA ${schoolProfile.tahunAjaran}.`,
      updatedAt: new Date().toISOString()
    };

    savePromesRecord(newPromes);
    alert(`Program Semester (${selectedSemester}) berhasil diperbarui dan disinkronkan!`);
  };

  const handleOpenPromesRowModal = () => {
    setPromesRowForm({
      kodeTP: `TP-${selectedMapel.includes('Koding') ? 'KA' : 'MAPEL'}.${currentKelasLabel.replace('Kelas ', '').charAt(0)}.${(currentPromes?.items.length || 0) + 1}`,
      materiPokok: '',
      alokasiJP: 4
    });
    setIsPromesRowModalOpen(true);
  };

  const handleSavePromesRowModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promesRowForm.materiPokok) return;

    const basePromes = currentPromes || {
      id: `promes-${selectedKelasId}-${selectedMapel.replace(/\s+/g, '-').toLowerCase()}-${selectedSemester.toLowerCase()}`,
      kelasId: selectedKelasId,
      mataPelajaran: selectedMapel,
      tahunAjaran: schoolProfile.tahunAjaran,
      semester: selectedSemester,
      guruPengampu: defaultTeacherName,
      totalJPSemester: 0,
      items: [],
      updatedAt: new Date().toISOString()
    };

    const newItem = {
      id: `prom-${Date.now()}`,
      kodeTP: promesRowForm.kodeTP,
      materiPokok: promesRowForm.materiPokok,
      alokasiJP: Number(promesRowForm.alokasiJP),
      distribusiMingguan: {
        'M1_W3': Number(promesRowForm.alokasiJP)
      }
    };

    const updatedItems = [...basePromes.items, newItem];
    const totalJP = updatedItems.reduce((acc, curr) => acc + curr.alokasiJP, 0);

    savePromesRecord({
      ...basePromes,
      totalJPSemester: totalJP,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });

    setIsPromesRowModalOpen(false);
  };

  const handleDeletePromesRow = (rowId: string) => {
    if (!currentPromes) return;
    if (window.confirm('Hapus baris Promes ini?')) {
      const updatedItems = currentPromes.items.filter(item => item.id !== rowId);
      const totalJP = updatedItems.reduce((acc, curr) => acc + curr.alokasiJP, 0);
      savePromesRecord({
        ...currentPromes,
        totalJPSemester: totalJP,
        items: updatedItems,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleUpdatePromesCell = (itemId: string, weekKey: string, val: number) => {
    if (!currentPromes) return;
    const updatedItems = currentPromes.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          distribusiMingguan: {
            ...item.distribusiMingguan,
            [weekKey]: val
          }
        };
      }
      return item;
    });

    savePromesRecord({
      ...currentPromes,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  // ==========================================
  // HANDLERS FOR IMPORT FILE
  // ==========================================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('Membaca berkas...');
      if (importType === 'modul-json') {
        const text = await file.text();
        const json = JSON.parse(text);
        if (json && json.kodeModul && json.pengalamanBelajar) {
          saveModulAjar({
            ...json,
            id: `ma-${Date.now()}`,
            kelasId: selectedKelasId,
            mataPelajaran: selectedMapel
          });
          setImportStatus('Berhasil mengimpor Modul Ajar JSON!');
          setTimeout(() => {
            setIsImportModalOpen(false);
            setImportStatus(null);
          }, 1500);
        } else {
          alert('Format JSON modul ajar tidak valid.');
          setImportStatus(null);
        }
        return;
      }

      const rows = await parseCurriculumExcel(file);
      if (!rows || rows.length === 0) {
        alert('File kosong atau tidak dapat dibaca.');
        setImportStatus(null);
        return;
      }

      if (importType === 'tp') {
        let count = 0;
        rows.forEach((r, idx) => {
          const kodeTP = String(r['Kode TP'] || `TP-IMP.${idx + 1}`).trim();
          const materiPokok = String(r['Materi Pokok'] || r['Materi'] || '').trim();
          const tujuanDeskripsi = String(r['Deskripsi Tujuan Pembelajaran'] || r['Tujuan'] || '').trim();
          const alokasiJP = Number(r['Alokasi JP']) || 4;
          const semester = (String(r['Semester'] || '').toLowerCase().includes('genap') ? 'Genap' : 'Ganjil') as 'Ganjil' | 'Genap';
          const dplRaw = String(r['Dimensi Profil Lulusan (Pisahkan koma)'] || r['Dimensi'] || '');
          const indRaw = String(r['Indikator Ketercapaian (Pisahkan titik koma)'] || r['Indikator'] || '');

          if (materiPokok || tujuanDeskripsi) {
            addTujuanPembelajaran({
              cpId: activeCP[0]?.id || 'cp-imp',
              kodeTP,
              mataPelajaran: selectedMapel,
              fase: currentFase,
              kelasTarget: currentKelasLabel.slice(0, 7),
              semester,
              materiPokok: materiPokok || 'Materi Pembelajaran',
              tujuanDeskripsi: tujuanDeskripsi || materiPokok,
              alokasiJP,
              dimensiProfilLulusan: dplRaw ? dplRaw.split(',').map(s => s.trim()).filter(Boolean) : ['Penalaran Kritis', 'Kreativitas'],
              indikatorKetercapaian: indRaw ? indRaw.split(';').map(s => s.trim()).filter(Boolean) : ['Menjelaskan konsep', 'Mempraktikkan keterampilan'],
              urutanATP: activeTPList.length + count + 1
            });
            count++;
          }
        });
        setImportStatus(`Berhasil mengimpor ${count} Tujuan Pembelajaran!`);
      } else if (importType === 'prota') {
        const baseProta = currentProta || {
          id: `prota-${selectedKelasId}-${selectedMapel.replace(/\s+/g, '-').toLowerCase()}`,
          kelasId: selectedKelasId,
          mataPelajaran: selectedMapel,
          tahunAjaran: schoolProfile.tahunAjaran,
          guruPengampu: defaultTeacherName,
          totalJPEfektif: 0,
          items: [],
          updatedAt: new Date().toISOString()
        };

        const newItems: ProtaItem[] = rows.map((r, idx) => ({
          id: `prow-imp-${Date.now()}-${idx}`,
          kodeTP: String(r['Kode TP'] || `TP.${idx + 1}`).trim(),
          materiPokok: String(r['Materi Pokok'] || r['Materi'] || `Materi ${idx + 1}`).trim(),
          semester: (String(r['Semester'] || '').toLowerCase().includes('genap') ? 'Genap' : 'Ganjil') as 'Ganjil' | 'Genap',
          alokasiJP: Number(r['Alokasi JP']) || 4,
          perkiraanBulan: String(r['Perkiraan Bulan'] || 'Juli - Agustus').trim()
        }));

        const totalJP = newItems.reduce((acc, curr) => acc + curr.alokasiJP, 0);
        saveProtaRecord({
          ...baseProta,
          totalJPEfektif: totalJP,
          items: newItems,
          updatedAt: new Date().toISOString()
        });
        setImportStatus(`Berhasil mengimpor ${newItems.length} baris Prota!`);
      } else if (importType === 'promes') {
        const basePromes = currentPromes || {
          id: `promes-${selectedKelasId}-${selectedMapel.replace(/\s+/g, '-').toLowerCase()}-${selectedSemester.toLowerCase()}`,
          kelasId: selectedKelasId,
          mataPelajaran: selectedMapel,
          tahunAjaran: schoolProfile.tahunAjaran,
          semester: selectedSemester,
          guruPengampu: defaultTeacherName,
          totalJPSemester: 0,
          items: [],
          updatedAt: new Date().toISOString()
        };

        const newItems = rows.map((r, idx) => ({
          id: `prom-imp-${Date.now()}-${idx}`,
          kodeTP: String(r['Kode TP'] || `TP.${idx + 1}`).trim(),
          materiPokok: String(r['Materi Pokok'] || `Materi ${idx + 1}`).trim(),
          alokasiJP: Number(r['Alokasi JP']) || 4,
          distribusiMingguan: {
            'M1_W3': Number(r['Bulan 1 Mg 3']) || 2,
            'M1_W4': Number(r['Bulan 1 Mg 4']) || 2
          }
        }));

        const totalJP = newItems.reduce((acc, curr) => acc + curr.alokasiJP, 0);
        savePromesRecord({
          ...basePromes,
          totalJPSemester: totalJP,
          items: newItems,
          updatedAt: new Date().toISOString()
        });
        setImportStatus(`Berhasil mengimpor ${newItems.length} baris Promes!`);
      }

      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus(null);
      }, 1500);
    } catch (err: any) {
      alert(`Gagal memproses file: ${err.message}`);
      setImportStatus(null);
    }
  };

  // Month labels for Promes
  const monthsForSemester = selectedSemester === 'Ganjil'
    ? [
        { key: 'M1', label: 'Juli' },
        { key: 'M2', label: 'Agustus' },
        { key: 'M3', label: 'September' },
        { key: 'M4', label: 'Oktober' },
        { key: 'M5', label: 'November' },
        { key: 'M6', label: 'Desember' }
      ]
    : [
        { key: 'M1', label: 'Januari' },
        { key: 'M2', label: 'Februari' },
        { key: 'M3', label: 'Maret' },
        { key: 'M4', label: 'April' },
        { key: 'M5', label: 'Mei' },
        { key: 'M6', label: 'Juni' }
      ];

  return (
    <div className="space-y-6 pb-28 lg:pb-12">
      {/* 1. Header Banner & Identity */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <Code2 className="w-80 h-80 text-emerald-300" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Kurikulum Merdeka 2025/2026/2027
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-300/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Terintegrasi Koding & Kecerdasan Artifisial
              </span>
              <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {currentFase}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Perangkat Pembelajaran Mendalam (Deep Learning)
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Panduan terpadu Program Tahunan (Prota), Program Semester (Promes), Capaian Pembelajaran (CP),
              Alur Tujuan Pembelajaran (ATP), dan Modul Ajar Mendalam (Mindful, Meaningful, Joyful) berbobot 8 Dimensi Profil Lulusan & Koding untuk SD Negeri Nambo 03.
            </p>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-500/30 shrink-0 text-right space-y-1">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
              Satuan Pendidikan
            </div>
            <div className="text-sm font-extrabold text-white flex items-center justify-end gap-2">
              <OfficialLogo size={24} customLogoUrl={schoolProfile.logoUrl} />
              <span>{schoolProfile.namaSekolah}</span>
            </div>
            <div className="text-xs text-amber-300 font-mono">
              NPSN: {schoolProfile.npsn} • Klapanunggal
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              Kepsek: {schoolProfile.kepalaSekolah}
            </div>
          </div>
        </div>

        {/* Global Action Bar: Import, Master Excel Download, New Manual Module */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold border border-emerald-500/40 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Import Tujuan Pembelajaran, Prota, atau Promes dari file Excel/JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Berkas (Excel / JSON)</span>
            </button>

            <button
              onClick={handleDownloadExcelWorkbook}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white rounded-xl text-xs font-bold border border-blue-600/40 shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Unduh satu paket lengkap Excel berisi Prota, Promes Ganjil, Promes Genap, dan ATP"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-300" />
              <span>Unduh Master Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => handleOpenModulEditor(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Buat Modul Ajar Deep Learning baru secara manual dari nol"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Modul Ajar Manual</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 font-medium">
            Tahun Ajaran: <strong className="text-white">TA {schoolProfile.tahunAjaran}</strong>
          </div>
        </div>

        {/* 2. Interactive Selector Controls Bar */}
        <div className="mt-4 pt-4 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Class Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Pilih Rombongan Belajar / Kelas
            </label>
            <div className="relative">
              <select
                value={selectedKelasId}
                onChange={e => setSelectedKelasId(e.target.value)}
                className="w-full bg-slate-900/90 text-white border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              >
                {classes.filter(c => c.jenis === 'Utama').map(cls => (
                  <option key={cls.id} value={cls.id} className="bg-slate-900 text-white">
                    {cls.nama} ({FASE_MAP[cls.id] || 'Fase A'})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Subject Selector */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Mata Pelajaran</span>
              {selectedMapel.includes('Koding') && (
                <span className="text-amber-300 text-[10px] font-bold">★ Unggulan Koding & AI</span>
              )}
            </label>
            <div className="relative">
              <select
                value={selectedMapel}
                onChange={e => setSelectedMapel(e.target.value)}
                className="w-full bg-slate-900/90 text-white border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              >
                {MATA_PELAJARAN_LIST.map(mapel => (
                  <option key={mapel} value={mapel} className="bg-slate-900 text-white">
                    {mapel}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Semester Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Semester (TA {schoolProfile.tahunAjaran})
            </label>
            <div className="relative">
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value as 'Ganjil' | 'Genap')}
                className="w-full bg-slate-900/90 text-white border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              >
                <option value="Ganjil" className="bg-slate-900 text-white">Semester Ganjil (Juli - Des)</option>
                <option value="Genap" className="bg-slate-900 text-white">Semester Genap (Jan - Juni)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Pedagogical Workflow Stepper Bar (Langkah 1 s.d. 6 Berurutan) */}
      <div className="bg-white rounded-2xl p-2.5 border border-slate-200/90 shadow-sm sticky top-16 z-20 backdrop-blur-md bg-white/95 space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5 text-emerald-600" />
            <span>Alur Urutan Penyusunan Perangkat Pembelajaran:</span>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
            6 Tahapan Pedagogis Terpadu
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          {/* Step 1: CP */}
          <button
            onClick={() => setSelectedSubTab('capaian-pembelajaran')}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedSubTab === 'capaian-pembelajaran'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selectedSubTab === 'capaian-pembelajaran' ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              1
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">1. Capaian (CP)</div>
              <div className={`text-[10px] truncate ${selectedSubTab === 'capaian-pembelajaran' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {activeCP.length} Elemen BSKAP
              </div>
            </div>
          </button>

          {/* Step 2: ATP */}
          <button
            onClick={() => setSelectedSubTab('alur-tujuan-pembelajaran')}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedSubTab === 'alur-tujuan-pembelajaran'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selectedSubTab === 'alur-tujuan-pembelajaran' ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              2
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">2. Alur Tujuan (ATP)</div>
              <div className={`text-[10px] truncate ${selectedSubTab === 'alur-tujuan-pembelajaran' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {activeTPList.length} Trajektori Alur
              </div>
            </div>
          </button>

          {/* Step 3: TP */}
          <button
            onClick={() => setSelectedSubTab('tujuan-pembelajaran')}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedSubTab === 'tujuan-pembelajaran'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selectedSubTab === 'tujuan-pembelajaran' ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              3
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">3. Tujuan Belajar (TP)</div>
              <div className={`text-[10px] truncate ${selectedSubTab === 'tujuan-pembelajaran' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {activeTPList.length} TP Terstruktur
              </div>
            </div>
          </button>

          {/* Step 4: Modul Ajar */}
          <button
            onClick={() => setSelectedSubTab('modul-ajar')}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedSubTab === 'modul-ajar'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selectedSubTab === 'modul-ajar' ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              4
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">4. Modul Ajar (RPP)</div>
              <div className={`text-[10px] truncate ${selectedSubTab === 'modul-ajar' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {filteredModules.length} Modul DL
              </div>
            </div>
          </button>

          {/* Step 5: Promes */}
          <button
            onClick={() => setSelectedSubTab('promes')}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedSubTab === 'promes'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selectedSubTab === 'promes' ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              5
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">5. Promes</div>
              <div className={`text-[10px] truncate ${selectedSubTab === 'promes' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {currentPromes?.totalJPSemester || 0} JP Semester
              </div>
            </div>
          </button>

          {/* Step 6: Prota */}
          <button
            onClick={() => setSelectedSubTab('prota')}
            className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
              selectedSubTab === 'prota'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/25 ring-2 ring-emerald-500/50'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/90 border border-slate-200/60'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
              selectedSubTab === 'prota' ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
            }`}>
              6
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold leading-tight truncate">6. Prota</div>
              <div className={`text-[10px] truncate ${selectedSubTab === 'prota' ? 'text-emerald-100' : 'text-slate-500'}`}>
                {currentProta?.totalJPEfektif || 0} JP Setahun
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LANGKAH 1: CAPAIAN PEMBELAJARAN (CP) SESUAI BSKAP 046/H/KR/2025 */}
      {/* ========================================================================= */}
      {selectedSubTab === 'capaian-pembelajaran' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      Langkah 1 dari 6
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {currentFase} • {currentKelasLabel}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-xl">
                    Capaian Pembelajaran (CP) Resmi Kurikulum Merdeka
                  </h3>
                  <p className="text-xs text-slate-500">
                    Berdasarkan Keputusan Kepala BSKAP Kemendikbudristek No. 046/H/KR/2025 & Dokumen Analisis CP SD Negeri Nambo 03
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const allCPText = activeCP.map(c => `[Elemen: ${c.elemen}]\n${c.deskripsiCP}`).join('\n\n');
                    navigator.clipboard.writeText(allCPText);
                    setCopiedId('all-cp');
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                  title="Salin seluruh teks Capaian Pembelajaran mata pelajaran ini"
                >
                  {copiedId === 'all-cp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'all-cp' ? 'Tersalin!' : 'Salin Teks CP'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                  title="Cetak Dokumen Capaian Pembelajaran Resmi"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak CP</span>
                </button>
              </div>
            </div>

            {/* Sub-header info panel */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 border border-emerald-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                  Mata Pelajaran & Jenjang
                </span>
                <div className="text-lg font-black">{selectedMapel}</div>
                <div className="text-xs text-slate-300">
                  Fokus Penguatan: Penalaran Kritis, Karakter Berkesadaran, serta Koding & Kecerdasan Artifisial Sekolah Dasar
                </div>
              </div>
              <div className="text-right shrink-0 bg-slate-950/60 p-3 rounded-xl border border-emerald-500/30">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Total Elemen CP</div>
                <div className="text-xl font-extrabold text-amber-300">{activeCP.length} Elemen Resmi</div>
              </div>
            </div>

            {/* Grid of Elemen CP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCP.map((cp, idx) => (
                <div
                  key={cp.id}
                  className="bg-slate-50 hover:bg-emerald-50/30 p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-lg border border-emerald-300">
                        Elemen: {cp.elemen}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-bold">
                      {cp.kelas.join(', ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed text-justify">
                    {cp.deskripsiCP}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px]">
                    <span className="text-slate-500 font-medium">SK BSKAP 046/H/KR/2025</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(cp.deskripsiCP);
                        setCopiedId(cp.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === cp.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === cp.id ? 'Tersalin' : 'Salin Elemen'}</span>
                    </button>
                  </div>
                </div>
              ))}

              {activeCP.length === 0 && (
                <div className="col-span-2 p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <p>Capaian Pembelajaran untuk {selectedMapel} ({currentFase}) siap ditelaah.</p>
                </div>
              )}
            </div>

            {/* Stepper Navigation Footer Banner */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <div className="text-xs font-extrabold text-emerald-950 flex items-center justify-center sm:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tahap 1 Capaian Pembelajaran Selesai Ditelaah</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Lanjutkan penurunan kompetensi CP menjadi Alur Tujuan Pembelajaran (ATP) berurutan.
                </p>
              </div>

              <button
                onClick={() => setSelectedSubTab('alur-tujuan-pembelajaran')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjut ke Langkah 2: Alur Tujuan Pembelajaran (ATP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 2: ALUR TUJUAN PEMBELAJARAN (ATP) */}
      {/* ========================================================================= */}
      {selectedSubTab === 'alur-tujuan-pembelajaran' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl shrink-0">
                  <Route className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      Langkah 2 dari 6
                    </span>
                    <span className="bg-blue-50 text-blue-800 border border-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Trajektori {currentFase} • {currentKelasLabel}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-xl">
                    Alur Tujuan Pembelajaran (ATP)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pemetaan rangkaian alur pencapaian kompetensi secara terstruktur dari awal fase sampai akhir fase
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadExcelWorkbook}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download Excel ATP (.xlsx)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                  title="Cetak Dokumen ATP Resmi"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak ATP</span>
                </button>
              </div>
            </div>

            {/* Visual Trajectory Progression Bar */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Visual Alur Trajektori Kompetensi ({activeTPList.length} Tahapan)</span>
                </div>
                <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-md text-slate-300 font-mono">
                  {currentFase} • {selectedMapel}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
                {activeTPList.map((tp, idx) => (
                  <div
                    key={tp.id}
                    className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 p-2.5 rounded-xl space-y-1 relative"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-amber-300">Tahap {idx + 1}</span>
                      <span className="text-slate-400 font-mono">{tp.alokasiJP} JP</span>
                    </div>
                    <div className="text-xs font-bold text-white truncate" title={tp.materiPokok}>
                      {tp.materiPokok}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {tp.kodeTP}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabel Rinci Alur Tujuan Pembelajaran (ATP) */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
                  Matriks Pemetaan Alur Tujuan Pembelajaran (ATP) Terpadu
                </div>
                <div className="text-xs text-slate-600 font-semibold">
                  Mata Pelajaran: <span className="text-emerald-800 font-bold">{selectedMapel}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="p-3 font-bold w-14 text-center border-r border-slate-700">Urutan</th>
                      <th className="p-3 font-bold w-24 border-r border-slate-700">Kode TP</th>
                      <th className="p-3 font-bold w-48 border-r border-slate-700">Materi Pokok</th>
                      <th className="p-3 font-bold border-r border-slate-700">Deskripsi Alur Tujuan Pembelajaran (ATP)</th>
                      <th className="p-3 font-bold w-16 text-center border-r border-slate-700">JP</th>
                      <th className="p-3 font-bold w-20 text-center border-r border-slate-700">Sem.</th>
                      <th className="p-3 font-bold w-48">8 Dimensi Profil Lulusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activeTPList.map((tp, idx) => (
                      <tr key={tp.id} className="hover:bg-slate-50/80">
                        <td className="p-3 text-center font-black text-slate-700 border-r border-slate-200 bg-slate-50">
                          {idx + 1}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-800 border-r border-slate-200">
                          {tp.kodeTP}
                        </td>
                        <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                          {tp.materiPokok}
                        </td>
                        <td className="p-3 text-slate-700 leading-relaxed border-r border-slate-200">
                          {tp.tujuanDeskripsi}
                        </td>
                        <td className="p-3 text-center font-black text-slate-900 border-r border-slate-200 bg-slate-50">
                          {tp.alokasiJP}
                        </td>
                        <td className="p-3 text-center border-r border-slate-200">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${tp.semester === 'Ganjil' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                            {tp.semester}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {tp.dimensiProfilLulusan.map(dim => (
                              <span key={dim} className="text-[9px] font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                {dim}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeTPList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs text-slate-500">
                          Belum ada data ATP untuk kelas dan mata pelajaran ini. Silakan input TP di langkah selanjutnya.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stepper Navigation Footer Banner */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setSelectedSubTab('capaian-pembelajaran')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Langkah 1: CP</span>
              </button>

              <button
                onClick={() => setSelectedSubTab('tujuan-pembelajaran')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjut ke Langkah 3: Tujuan Pembelajaran (TP)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 3: TUJUAN PEMBELAJARAN (TP) */}
      {/* ========================================================================= */}
      {selectedSubTab === 'tujuan-pembelajaran' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl shrink-0">
                  <ListOrdered className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      Langkah 3 dari 6
                    </span>
                    <span className="bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Operasional • {currentKelasLabel}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-xl">
                    Tujuan Pembelajaran (TP) Operasional
                  </h3>
                  <p className="text-xs text-slate-500">
                    Daftar TP terstruktur lengkap dengan alokasi JP, Dimensi Profil Lulusan, dan Indikator Ketercapaian
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenTPModal()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah TP Baru Manual</span>
                </button>

                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import TP</span>
                </button>
              </div>
            </div>

            {/* List of TP Cards */}
            <div className="divide-y divide-slate-200">
              {activeTPList.map((tp, idx) => (
                <div key={tp.id} className="py-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-extrabold text-emerald-800 text-xs sm:text-sm font-mono bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300">
                        {tp.kodeTP}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {tp.materiPokok}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Sem. {tp.semester}
                      </span>
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {tp.alokasiJP} JP
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pl-8">
                    {tp.tujuanDeskripsi}
                  </p>

                  {/* Dimensi Profil Lulusan & Indikator */}
                  <div className="pl-8 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400">Profil Lulusan:</span>
                    {tp.dimensiProfilLulusan.map(dim => (
                      <span key={dim} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {dim}
                      </span>
                    ))}
                  </div>

                  <div className="pl-8 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <strong className="text-slate-800 block text-[10px] uppercase tracking-wider">
                      Indikator Ketercapaian Tujuan Pembelajaran:
                    </strong>
                    {tp.indikatorKetercapaian.map((ind, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons for this TP */}
                  <div className="pl-8 flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleGenerateModulFromTP(tp);
                          setSelectedSubTab('modul-ajar');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 transition-colors cursor-pointer"
                        title="Langsung hasilkan Modul Ajar Deep Learning dari TP ini"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>⚡ Buat Modul Ajar dari TP Ini</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenTPModal(tp)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit TP"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus ${tp.kodeTP}?`)) {
                            deleteTujuanPembelajaran(tp.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus TP"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {activeTPList.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500">
                  Belum ada Tujuan Pembelajaran yang terdaftar untuk {selectedMapel} ({currentFase}).
                  Klik "Tambah TP Baru Manual" di atas untuk menambahkan.
                </div>
              )}
            </div>

            {/* Stepper Navigation Footer Banner */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setSelectedSubTab('alur-tujuan-pembelajaran')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Langkah 2: ATP</span>
              </button>

              <button
                onClick={() => setSelectedSubTab('modul-ajar')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjut ke Langkah 4: Modul Ajar Deep Learning</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 4: MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING RPP) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {selectedSubTab === 'modul-ajar' && (
        <div className="space-y-6">
          {/* Action Row: Module Selector + Generate + Export Options */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-xs font-bold text-slate-600 shrink-0">
                Pilih Modul Aktif:
              </div>
              <div className="w-full sm:w-auto flex-1 max-w-md">
                <select
                  value={activeModul?.id || ''}
                  onChange={e => setSelectedModulId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {filteredModules.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.kodeModul} - Pertemuan {m.pertemuanKe} ({m.alokasiWaktu})
                    </option>
                  ))}
                  {filteredModules.length === 0 && (
                    <option value="">Belum ada modul ajar tersimpan untuk kelas & mapel ini</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Input Manual / Edit Modul Button */}
              <button
                onClick={() => handleOpenModulEditor(activeModul)}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Edit rincian modul ajar secara manual"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{activeModul ? 'Edit Modul Ini' : 'Input Modul Manual'}</span>
              </button>

              {activeTPList.length > 0 && (
                <button
                  onClick={() => handleGenerateModulFromTP(activeTPList[0])}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  title="Generate otomatis modul ajar dari TP pertama"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generate dari TP</span>
                </button>
              )}

              {activeModul && (
                <>
                  {/* Download Microsoft Word (.doc) */}
                  <button
                    onClick={handleDownloadWord}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    title="Unduh dokumen resmi Microsoft Word (.doc) lengkap dengan Kop & Logo Resmi"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download Word (.doc)</span>
                  </button>

                  {/* Print / PDF Button */}
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                    title="Cetak format resmi atau simpan sebagai PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Cetak / PDF</span>
                  </button>

                  {/* Download JSON Backup */}
                  <button
                    onClick={handleDownloadModulJSON}
                    className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                    title="Download arsip JSON modul ajar ini"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">JSON</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus modul ajar ${activeModul.kodeModul}?`)) {
                        deleteModulAjar(activeModul.id);
                      }
                    }}
                    className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Hapus Modul"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Module Content Display: 4 Building Blocks Format */}
          {activeModul ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden print:border-none print:shadow-none">
              {/* Document Header for Print & Review */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
                <div className="space-y-4">
                  {/* Official Kop Surat matching user reference */}
                  <OfficialKopSurat schoolProfile={schoolProfile} />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <div className="text-center sm:text-left">
                      <div className="text-[11px] font-bold text-emerald-800 tracking-wider uppercase">
                        KURIKULUM MERDEKA • PEMBELAJARAN MENDALAM (DEEP LEARNING)
                      </div>
                      <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight uppercase">
                        {activeModul.mataPelajaran} — {activeModul.kelasNama}
                      </h2>
                      <div className="text-xs text-slate-600 font-medium">
                        Tahun Ajaran {schoolProfile.tahunAjaran} • Semester {activeModul.semester}
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-right shrink-0 print:border-slate-800">
                      <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        KODE MODUL RESMI
                      </div>
                      <div className="text-sm font-black text-emerald-900">
                        {activeModul.kodeModul}
                      </div>
                      <div className="text-xs text-emerald-700 font-semibold">
                        Pertemuan Ke-{activeModul.pertemuanKe} • {activeModul.alokasiWaktu}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity Matrix */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mata Pelajaran</span>
                    <strong className="text-slate-900 text-sm">{activeModul.mataPelajaran}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Kelas / Fase</span>
                    <strong className="text-slate-900 text-sm">{activeModul.kelasNama} ({activeModul.fase})</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Semester & TA</span>
                    <strong className="text-slate-900 text-sm">Sem. {activeModul.semester} • {activeModul.tahunAjaran}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Guru Pengampu</span>
                    <strong className="text-slate-900 text-sm truncate block">{activeModul.guruPenyusun}</strong>
                  </div>
                </div>
              </div>

              {/* 4 Building Blocks Container */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* 1. IDENTIFIKASI PEMBELAJARAN */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b-2 border-emerald-500">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                      I
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      IDENTIFIKASI PEMBELAJARAN & PROFIL MURID
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                        <span>Analisis Kesiapan Belajar Peserta Didik</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeModul.kesiapanBelajarMurid}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>8 Dimensi Profil Lulusan (DPL) yang Disasar</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeModul.dimensiProfilLulusan.map(dpl => (
                          <span
                            key={dpl}
                            className="bg-emerald-100/80 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-300"
                          >
                            ✓ {dpl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3 Prinsip Deep Learning & 4 Olah Pilar */}
                  <div className="bg-emerald-950/90 text-white rounded-2xl p-5 border border-emerald-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Prinsip Pembelajaran Mendalam (Mindful, Meaningful, Joyful)</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-200">
                        {activeModul.prinsipDeepLearning.olahDimensi.map(olah => (
                          <span key={olah} className="bg-emerald-800/80 px-2 py-0.5 rounded-sm">
                            {olah}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white/10 rounded-xl p-3 space-y-1">
                        <span className="text-emerald-300 font-extrabold block text-[11px]">1. Mindful (Berkesadaran)</span>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          {activeModul.prinsipDeepLearning.mindful}
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 space-y-1">
                        <span className="text-amber-300 font-extrabold block text-[11px]">2. Meaningful (Bermakna)</span>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          {activeModul.prinsipDeepLearning.meaningful}
                        </p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 space-y-1">
                        <span className="text-cyan-300 font-extrabold block text-[11px]">3. Joyful (Menggembirakan)</span>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          {activeModul.prinsipDeepLearning.joyful}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 2. DESAIN PEMBELAJARAN */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b-2 border-teal-500">
                    <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-sm flex items-center justify-center">
                      II
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      DESAIN PEMBELAJARAN
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                      <span className="font-bold text-teal-900 block text-xs">A. Tujuan Pembelajaran Spesifik:</span>
                      <p className="text-slate-700 leading-relaxed">
                        {activeModul.desainPembelajaran.tujuanSpesifik}
                      </p>
                    </div>

                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                      <span className="font-bold text-teal-900 block text-xs">B. Praktik Pedagogis:</span>
                      <p className="text-slate-700 leading-relaxed">
                        {activeModul.desainPembelajaran.praktikPedagogis}
                      </p>
                    </div>

                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                      <span className="font-bold text-teal-900 block text-xs">C. Lingkungan Belajar & Kemitraan:</span>
                      <p className="text-slate-700 leading-relaxed">
                        {activeModul.desainPembelajaran.lingkunganBelajar} • {activeModul.desainPembelajaran.kemitraan}
                      </p>
                    </div>

                    <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200 space-y-1.5">
                      <span className="font-bold text-teal-900 block text-xs flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-teal-700" />
                        <span>D. Pemanfaatan Teknologi Digital & AI:</span>
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {activeModul.desainPembelajaran.pemanfaatanDigitalAI}
                      </p>
                    </div>
                  </div>
                </section>

                {/* 3. PENGALAMAN BELAJAR MENDALAM (SIKLUS 3 TAHAP) */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b-2 border-blue-500">
                    <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                      III
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                      PENGALAMAN BELAJAR MENDALAM (SIKLUS MEMAHAMI - MENGAPLIKASI - MEREFLEKSI)
                    </h2>
                  </div>

                  {/* Kegiatan Awal */}
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        1. KEGIATAN AWAL ({activeModul.pengalamanBelajar.kegiatanAwal.alokasiMenit} Menit)
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-sm border border-slate-300">
                        Orientasi & Mindful Check-in
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      {activeModul.pengalamanBelajar.kegiatanAwal.langkah.map((l, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{l}</span>
                        </div>
                      ))}
                    </div>

                    {activeModul.pengalamanBelajar.kegiatanAwal.pertanyaanPemantik.length > 0 && (
                      <div className="mt-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs">
                        <strong className="text-amber-900 block mb-1">Pertanyaan Pemantik:</strong>
                        <ul className="list-disc list-inside text-amber-800 space-y-0.5">
                          {activeModul.pengalamanBelajar.kegiatanAwal.pertanyaanPemantik.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Kegiatan Inti (3 Tahap) */}
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        2. KEGIATAN INTI ({activeModul.pengalamanBelajar.kegiatanInti.alokasiMenit} Menit)
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-200">
                        Siklus Eksplorasi Mendalam
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Tahap 1: Memahami */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 pb-1 border-b border-emerald-100">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">A</span>
                          <span>Tahap 1: Memahami</span>
                        </div>
                        <div className="text-[11px] text-slate-700 space-y-1.5">
                          {activeModul.pengalamanBelajar.kegiatanInti.memahami.map((step, idx) => (
                            <p key={idx} className="leading-relaxed">• {step}</p>
                          ))}
                        </div>
                      </div>

                      {/* Tahap 2: Mengaplikasikan */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5 pb-1 border-b border-blue-100">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">B</span>
                          <span>Tahap 2: Mengaplikasi</span>
                        </div>
                        <div className="text-[11px] text-slate-700 space-y-1.5">
                          {activeModul.pengalamanBelajar.kegiatanInti.mengaplikasi.map((step, idx) => (
                            <p key={idx} className="leading-relaxed">• {step}</p>
                          ))}
                        </div>
                      </div>

                      {/* Tahap 3: Merefleksikan */}
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="text-xs font-bold text-purple-700 flex items-center gap-1.5 pb-1 border-b border-purple-100">
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">C</span>
                          <span>Tahap 3: Merefleksi</span>
                        </div>
                        <div className="text-[11px] text-slate-700 space-y-1.5">
                          {activeModul.pengalamanBelajar.kegiatanInti.merefleksi.map((step, idx) => (
                            <p key={idx} className="leading-relaxed">• {step}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kegiatan Penutup */}
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <HeartHandshake className="w-4 h-4 text-rose-600" />
                        3. KEGIATAN PENUTUP ({activeModul.pengalamanBelajar.kegiatanPenutup.alokasiMenit} Menit)
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-sm border border-slate-300">
                        Refleksi, Apresiasi & Doa
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-700">
                      {activeModul.pengalamanBelajar.kegiatanPenutup.langkah.map((l, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{l}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <strong>Tindak Lanjut Pembiasaan di Rumah:</strong> {activeModul.pengalamanBelajar.kegiatanPenutup.tindakLanjut}
                    </div>
                  </div>
                </section>

                {/* 4. ASESMEN AUTENTIK, RUBRIK PENILAIAN & BAHAN AJAR */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2.5 pb-2 border-b-2 border-purple-500">
                    <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-sm flex items-center justify-center">
                      IV
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900">
                        ASESMEN AUTENTIK, INSTRUMEN SOAL & LKPD LENGKAP
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        Instrumen Evaluasi Menyeluruh Kurikulum Merdeka Mendalam (Deep Learning) TA 2026-2027
                      </p>
                    </div>
                  </div>

                  {/* 1. Ringkasan Tiga Jenis Asesmen Pokok */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-1">
                      <strong className="text-purple-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Asesmen Formatif Awal (Diagnostik):</span>
                      </strong>
                      <p className="text-slate-700 leading-relaxed">{activeModul.asesmenAutentik.formatifAwal}</p>
                    </div>
                    <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-1">
                      <strong className="text-purple-900 flex items-center gap-1.5">
                        <Workflow className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Asesmen Formatif Proses (Berkelanjutan):</span>
                      </strong>
                      <p className="text-slate-700 leading-relaxed">{activeModul.asesmenAutentik.formatifProses}</p>
                    </div>
                    <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 space-y-1">
                      <strong className="text-purple-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Asesmen Sumatif Lingkup Materi:</span>
                      </strong>
                      <p className="text-slate-700 leading-relaxed">{activeModul.asesmenAutentik.sumatif}</p>
                    </div>
                  </div>

                  {/* 2. Bentuk & Jenis Instrumen Penilaian */}
                  {activeModul.asesmenAutentik.bentukJenis && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4 sm:p-5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                              Bentuk & Jenis Instrumen Penilaian
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Kombinasi asesmen kognitif, afektif, dan psikomotorik peserta didik
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                              <th className="p-3 font-bold w-1/4">Kategori Asesmen</th>
                              <th className="p-3 font-bold w-1/2">Fokus & Deskripsi Instrumen</th>
                              <th className="p-3 font-bold w-1/4">Bentuk & Teknik</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="p-3 font-bold text-purple-900 align-top">Asesmen Diagnostik Awal</td>
                              <td className="p-3 text-slate-700 align-top">{activeModul.asesmenAutentik.bentukJenis.diagnostikAwal}</td>
                              <td className="p-3 text-slate-600 align-top">Tanya Jawab & Pengamatan Awal</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-blue-900 align-top">Asesmen Formatif Proses</td>
                              <td className="p-3 text-slate-700 align-top">{activeModul.asesmenAutentik.bentukJenis.formatifProses}</td>
                              <td className="p-3 text-slate-600 align-top">Checklist Sikap & Kinerja Unplugged</td>
                            </tr>
                            <tr>
                              <td className="p-3 font-bold text-emerald-900 align-top">Asesmen Sumatif Akhir</td>
                              <td className="p-3 text-slate-700 align-top">{activeModul.asesmenAutentik.bentukJenis.sumatifAkhir}</td>
                              <td className="p-3 text-slate-600 align-top">Tes Tertulis & Unjuk Kerja Proyek</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {activeModul.asesmenAutentik.bentukJenis.teknikInstrumen && (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
                          <strong className="text-slate-800 block text-[11px] uppercase tracking-wider">
                            Teknik Penilaian yang Digunakan:
                          </strong>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {activeModul.asesmenAutentik.bentukJenis.teknikInstrumen.map((tek, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                <span>{tek}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Rubrik Penilaian Table KKTP */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-800 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                        Rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
                      </span>
                      <span className="text-[10px] text-emerald-300 font-normal">Kriteria 4 Level Ketercapaian</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                            <th className="p-3 font-bold w-1/4">Aspek Penilaian</th>
                            <th className="p-3 font-bold w-1/5 text-rose-700 bg-rose-50/50">Perlu Bimbingan (&lt; 70)</th>
                            <th className="p-3 font-bold w-1/5 text-amber-700 bg-amber-50/50">Cukup (70 - 79)</th>
                            <th className="p-3 font-bold w-1/5 text-blue-700 bg-blue-50/50">Baik (80 - 89)</th>
                            <th className="p-3 font-bold w-1/5 text-emerald-700 bg-emerald-50/50">Sangat Baik (90 - 100)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {activeModul.asesmenAutentik.rubrik.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3 font-bold text-slate-900 align-top">{r.aspek}</td>
                              <td className="p-3 text-slate-600 align-top bg-rose-50/20">{r.perluBimbingan}</td>
                              <td className="p-3 text-slate-600 align-top bg-amber-50/20">{r.cukup}</td>
                              <td className="p-3 text-slate-600 align-top bg-blue-50/20">{r.baik}</td>
                              <td className="p-3 text-slate-600 align-top bg-emerald-50/20 font-medium">{r.sangatBaik}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 4. Instrumen Soal & Asesmen Individu */}
                  {activeModul.asesmenAutentik.soalIndividu && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ListOrdered className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                              Instrumen Soal & Asesmen Mandiri Peserta Didik
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              Pilihan Ganda & Uraian HOTS beserta Kunci Jawaban dan Bobot Skor
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Total Skor: {activeModul.asesmenAutentik.soalIndividu.totalSkor || 100}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 italic">
                        <strong>Petunjuk Pengerjaan:</strong> {activeModul.asesmenAutentik.soalIndividu.petunjuk}
                      </div>

                      <div className="space-y-3">
                        {activeModul.asesmenAutentik.soalIndividu.daftarSoal.map(soal => (
                          <div key={soal.nomor} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0">
                                  {soal.nomor}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  soal.bentuk === 'Pilihan Ganda'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : soal.bentuk === 'HOTS'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                                }`}>
                                  {soal.bentuk}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                Bobot: {soal.bobotSkor} Poin
                              </span>
                            </div>

                            <p className="font-semibold text-slate-900 leading-relaxed pl-8">
                              {soal.pertanyaan}
                            </p>

                            {soal.pilihan && soal.pilihan.length > 0 && (
                              <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                {soal.pilihan.map((pil, idx) => (
                                  <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                                    {pil}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="pl-8 pt-1">
                              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-emerald-950">Kunci Jawaban & Panduan Penskoran:</strong> {soal.kunciJawaban}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Instrumen Tantangan & Penilaian Proyek Kelompok */}
                  {activeModul.asesmenAutentik.soalKelompok && (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">
                      <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                            Instrumen Tantangan & Penilaian Kelompok (Gotong Royong)
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Studi kasus kolaboratif dan rubrik penilaian dinamika tim
                          </p>
                        </div>
                      </div>

                      <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-200 space-y-2 text-xs">
                        <h4 className="font-bold text-teal-950 text-sm">
                          {activeModul.asesmenAutentik.soalKelompok.judulTantangan}
                        </h4>
                        <p className="text-teal-900 leading-relaxed">
                          <strong>Petunjuk Tim:</strong> {activeModul.asesmenAutentik.soalKelompok.petunjukKelompok}
                        </p>
                        <div className="p-3 bg-white rounded-lg border border-teal-200/80 text-slate-700 space-y-1">
                          <strong className="text-slate-900 block text-xs">Skenario Misi Kelompok:</strong>
                          <p className="leading-relaxed">{activeModul.asesmenAutentik.soalKelompok.skenarioKasus}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <strong className="text-slate-800 block text-xs font-bold">
                          Rincian Tugas Kolaboratif:
                        </strong>
                        <div className="space-y-1.5">
                          {activeModul.asesmenAutentik.soalKelompok.tugasKolaboratif.map((tugas, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                              <span className="w-4 h-4 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{tugas}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <strong className="text-slate-800 block text-xs font-bold">
                          Rubrik Penilaian Kinerja Tim:
                        </strong>
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                                <th className="p-2.5 font-bold w-1/3">Aspek Penilaian</th>
                                <th className="p-2.5 font-bold w-1/6 text-center">Bobot</th>
                                <th className="p-2.5 font-bold w-1/2">Kriteria Penilaian</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeModul.asesmenAutentik.soalKelompok.kriteriaPenilaian.map((k, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-semibold text-slate-900">{k.aspek}</td>
                                  <td className="p-2.5 font-bold text-center text-teal-700">{k.bobot}</td>
                                  <td className="p-2.5 text-slate-600">{k.deskripsi}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Lembar Kerja Peserta Didik (LKPD) Lengkap Terstruktur */}
                  {activeModul.asesmenAutentik.lkpdLengkap && (
                    <div className="bg-emerald-50/40 rounded-3xl border-2 border-emerald-500/40 p-5 sm:p-6 space-y-4 shadow-sm relative">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-300/60 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                              Lembar Kerja Peserta Didik (LKPD) Terstruktur
                            </span>
                            <h3 className="text-sm sm:text-base font-black text-emerald-950 mt-1">
                              {activeModul.asesmenAutentik.lkpdLengkap.judulLKPD}
                            </h3>
                          </div>
                        </div>

                        <button
                          onClick={() => handleCopy(
                            JSON.stringify(activeModul.asesmenAutentik.lkpdLengkap, null, 2),
                            'lkpd-lengkap'
                          )}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedId === 'lkpd-lengkap' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === 'lkpd-lengkap' ? 'LKPD Disalin' : 'Salin Teks LKPD'}</span>
                        </button>
                      </div>

                      {/* Info Bar LKPD */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-3 rounded-2xl border border-emerald-200">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Satuan Pendidikan:</span>
                          <strong className="text-slate-800 text-[11px]">SDN Nambo 03</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Kelas & Fase:</span>
                          <strong className="text-slate-800 text-[11px]">{activeModul.kelasNama} ({activeModul.fase})</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Mata Pelajaran:</span>
                          <strong className="text-slate-800 text-[11px] truncate block">{activeModul.mataPelajaran}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Alokasi Waktu:</span>
                          <strong className="text-slate-800 text-[11px]">{activeModul.alokasiWaktu}</strong>
                        </div>
                      </div>

                      {/* Tujuan & Alat Bahan */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                          <strong className="text-emerald-900 block text-xs">Tujuan Aktivitas Pembelajaran:</strong>
                          <p className="text-slate-700 leading-relaxed">{activeModul.asesmenAutentik.lkpdLengkap.tujuanAktivitas}</p>
                        </div>
                        <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                          <strong className="text-emerald-900 block text-xs">Alat & Bahan Praktik:</strong>
                          <div className="space-y-1">
                            {activeModul.asesmenAutentik.lkpdLengkap.alatDanBahan.map((ab, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>{ab}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Petunjuk & Langkah Kerja */}
                      <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-3 text-xs">
                        <div>
                          <strong className="text-slate-900 block mb-1">Petunjuk Pengerjaan:</strong>
                          <div className="space-y-1 pl-1">
                            {activeModul.asesmenAutentik.lkpdLengkap.petunjukPengerjaan.map((pet, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-slate-700">
                                <span className="font-bold text-emerald-700">{idx + 1}.</span>
                                <span>{pet}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                          <strong className="text-slate-900 block mb-1">Langkah Eksplorasi Peserta Didik:</strong>
                          <div className="space-y-1.5 pl-1">
                            {activeModul.asesmenAutentik.lkpdLengkap.langkahEksplorasi.map((langkah, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <span className="font-bold text-emerald-800">{idx + 1}.</span>
                                <span>{langkah}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {activeModul.asesmenAutentik.lkpdLengkap.tabelAktivitasKerja && (
                          <div className="border-t border-slate-100 pt-3">
                            <strong className="text-slate-900 block mb-1">Tabel Catatan / Format Aktivitas:</strong>
                            <pre className="text-[11px] font-mono text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">
                              {activeModul.asesmenAutentik.lkpdLengkap.tabelAktivitasKerja}
                            </pre>
                          </div>
                        )}

                        <div className="border-t border-slate-100 pt-3">
                          <strong className="text-slate-900 block mb-1">Pertanyaan Diskusi & Refleksi Bersama:</strong>
                          <div className="space-y-1 pl-1">
                            {activeModul.asesmenAutentik.lkpdLengkap.pertanyaanDiskusiReflektif.map((pert, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-slate-700">
                                <span className="font-bold text-purple-700">{idx + 1}.</span>
                                <span>{pert}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                          <strong className="block text-xs mb-0.5">Refleksi Diri Murid:</strong>
                          <p>{activeModul.asesmenAutentik.lkpdLengkap.refleksiDiri}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Bahan Ajar Ringkas & LKPD Harian */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>Bahan Ajar Ringkas Guru & Murid</span>
                        </strong>
                        <button
                          onClick={() => handleCopy(activeModul.asesmenAutentik.bahanAjarRingkas, 'bahan-ajar')}
                          className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === 'bahan-ajar' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'bahan-ajar' ? 'Disalin' : 'Salin'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] text-slate-700 font-mono whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                        {activeModul.asesmenAutentik.bahanAjarRingkas}
                      </pre>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Lembar Kerja Siswa (Versi Singkat)</span>
                        </strong>
                        <button
                          onClick={() => handleCopy(activeModul.asesmenAutentik.lembarKerjaSiswa, 'lkpd')}
                          className="text-[11px] text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedId === 'lkpd' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === 'lkpd' ? 'Disalin' : 'Salin'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] text-slate-700 font-mono whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                        {activeModul.asesmenAutentik.lembarKerjaSiswa}
                      </pre>
                    </div>
                  </div>
                </section>

                {/* Official Signatures for School Validation */}
                <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-800">
                  <div className="space-y-1">
                    <div>Mengetahui,</div>
                    <div className="font-bold">Kepala Sekolah SD Negeri Nambo 03</div>
                    <div className="h-16"></div>
                    <div className="font-black underline">{activeModul.kepalaSekolah}</div>
                    <div className="text-[11px] text-slate-600">NIP. {activeModul.nipKepalaSekolah}</div>
                  </div>

                  <div className="space-y-1">
                    <div>Klapanunggal, {activeModul.tanggalAjar || 'Juli 2026'}</div>
                    <div className="font-bold">Guru Pengampu / Kelas</div>
                    <div className="h-16"></div>
                    <div className="font-black underline">{activeModul.guruPenyusun}</div>
                    <div className="text-[11px] text-slate-600">NIP. {activeModul.nipGuruPenyusun}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <BookOpenCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-extrabold text-slate-900">
                  Belum Ada Modul Ajar Tersimpan
                </h3>
                <p className="text-xs text-slate-500">
                  Silakan buat modul ajar baru dari daftar Capaian Pembelajaran atau buat secara manual dari nol untuk {currentKelasLabel} - {selectedMapel}.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleOpenModulEditor(null)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Input Modul Ajar Manual</span>
                </button>
                {activeTPList.length > 0 && (
                  <button
                    onClick={() => handleGenerateModulFromTP(activeTPList[0])}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Modul dari TP: {activeTPList[0].kodeTP}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer Banner for Modul Ajar */}
          <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setSelectedSubTab('tujuan-pembelajaran')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Langkah 3: TP</span>
            </button>

            <button
              onClick={() => setSelectedSubTab('promes')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Lanjut ke Langkah 5: Program Semester (Promes)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 5: PROGRAM SEMESTER (PROMES) */}
      {/* ========================================================================= */}
      {selectedSubTab === 'promes' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      Langkah 5 dari 6
                    </span>
                    <span className="bg-purple-50 text-purple-800 border border-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Semester {selectedSemester} • TA {schoolProfile.tahunAjaran}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-xl">
                    Program Semester (Promes) - {currentKelasLabel}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distribusi alokasi jam tatap muka mingguan per bulan dan kalender agenda khusus
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleGeneratePromes}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <RefreshCW className="w-3.5 h-3.5 text-white" />
                  <span>Generate Promes dari TP</span>
                </button>

                <button
                  onClick={handleOpenPromesRowModal}
                  className="flex items-center gap-1 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold border border-purple-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Promes</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak Promes</span>
                </button>
              </div>
            </div>

            {/* Matriks Mingguan Promes */}
            {currentPromes ? (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse min-w-[850px]">
                    <thead>
                      <tr className="bg-slate-800 text-white">
                        <th className="p-3 font-bold border-r border-slate-700 w-12 text-center" rowSpan={2}>No</th>
                        <th className="p-3 font-bold border-r border-slate-700 w-24" rowSpan={2}>Kode TP</th>
                        <th className="p-3 font-bold border-r border-slate-700 min-w-[200px]" rowSpan={2}>Materi Pokok / Agenda</th>
                        <th className="p-3 font-bold border-r border-slate-700 w-16 text-center" rowSpan={2}>JP</th>
                        {monthsForSemester.map(m => (
                          <th key={m.key} className="p-2 font-bold text-center border-r border-slate-700" colSpan={5}>
                            {m.label}
                          </th>
                        ))}
                        <th className="p-3 font-bold text-center w-12" rowSpan={2}>Aksi</th>
                      </tr>
                      <tr className="bg-slate-700 text-slate-200 text-[10px]">
                        {monthsForSemester.map(m => (
                          <React.Fragment key={m.key}>
                            {[1, 2, 3, 4, 5].map(w => (
                              <th key={`${m.key}_W${w}`} className="p-1 text-center border-r border-slate-600 w-6">
                                {w}
                              </th>
                            ))}
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentPromes.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-2.5 text-center font-bold text-slate-600 border-r border-slate-200">{idx + 1}</td>
                          <td className="p-2.5 font-mono font-bold text-emerald-800 border-r border-slate-200">{item.kodeTP}</td>
                          <td className="p-2.5 font-medium text-slate-900 border-r border-slate-200">{item.materiPokok}</td>
                          <td className="p-2.5 text-center font-extrabold text-slate-800 border-r border-slate-200 bg-slate-50">{item.alokasiJP}</td>
                          {monthsForSemester.map(m => (
                            <React.Fragment key={m.key}>
                              {[1, 2, 3, 4, 5].map(w => {
                                const cellKey = `${m.key}_W${w}`;
                                const val = item.distribusiMingguan[cellKey] || 0;
                                return (
                                  <td key={cellKey} className="p-1 text-center border-r border-slate-200">
                                    <input
                                      type="number"
                                      min="0"
                                      max="8"
                                      value={val || ''}
                                      onChange={e => handleUpdatePromesCell(item.id, cellKey, Number(e.target.value) || 0)}
                                      className={`w-7 text-center rounded-sm py-0.5 text-xs font-bold border ${
                                        val > 0
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                                          : 'border-transparent text-slate-400 hover:border-slate-300'
                                      }`}
                                    />
                                  </td>
                                );
                              })}
                            </React.Fragment>
                          ))}
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeletePromesRow(item.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                              title="Hapus Baris Promes"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Agenda Khusus Info */}
                {currentPromes.agendaKhusus && (
                  <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs space-y-1.5">
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider">
                      Catatan Kegiatan Khusus / Non-KBM Semester {selectedSemester}:
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(currentPromes.agendaKhusus).map(([k, v]) => (
                        <div key={k} className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 font-mono text-[10px] block">{k}</span>
                          <span className="text-slate-700 font-semibold text-[11px]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <p>Belum ada data Program Semester {selectedSemester} untuk {currentKelasLabel} - {selectedMapel}.</p>
                <button
                  onClick={handleGeneratePromes}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-700 transition-colors"
                >
                  Generate Promes Otomatis
                </button>
              </div>
            )}

            {/* Official Signatures */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-800">
              <div className="space-y-1">
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala Sekolah SD Negeri Nambo 03</div>
                <div className="h-16"></div>
                <div className="font-black underline">{schoolProfile.kepalaSekolah}</div>
                <div className="text-[11px] text-slate-600">NIP. {schoolProfile.nipKepalaSekolah}</div>
              </div>

              <div className="space-y-1">
                <div>Klapanunggal, Juli 2026</div>
                <div className="font-bold">Guru Kelas / Mata Pelajaran</div>
                <div className="h-16"></div>
                <div className="font-black underline">{defaultTeacherName}</div>
                <div className="text-[11px] text-slate-600">NIP. {defaultTeacherNIP}</div>
              </div>
            </div>

            {/* Stepper Navigation Footer Banner */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setSelectedSubTab('modul-ajar')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Langkah 4: Modul Ajar</span>
              </button>

              <button
                onClick={() => setSelectedSubTab('prota')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Lanjut ke Langkah 6: Program Tahunan (Prota)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LANGKAH 6: PROGRAM TAHUNAN (PROTA) */}
      {/* ========================================================================= */}
      {selectedSubTab === 'prota' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-indigo-100 text-indigo-800 rounded-2xl shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                      Langkah 6 dari 6 (Final)
                    </span>
                    <span className="bg-indigo-50 text-indigo-800 border border-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Rekap Tahunan • TA {schoolProfile.tahunAjaran}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-xl">
                    Program Tahunan (Prota) - {currentKelasLabel}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rekapitulasi alokasi jam pelajaran efektif dan beban belajar selama 1 tahun ajaran penuh (Ganjil & Genap)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadExcelWorkbook}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Master Excel (.xlsx)</span>
                </button>

                <button
                  onClick={handleGenerateProta}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                >
                  <RefreshCW className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sinkronkan Prota dari TP</span>
                </button>

                <button
                  onClick={() => handleOpenProtaRowModal()}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold border border-blue-300 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Baris Prota</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak Prota</span>
                </button>
              </div>
            </div>

            {/* Total JP info banner */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider block">Total Jam Pelajaran Efektif Setahun</span>
                <div className="text-2xl font-black text-amber-300">{currentProta?.totalJPEfektif || 0} JP</div>
              </div>
              <div className="text-right text-xs text-slate-300">
                SD Negeri Nambo 03 • Klapanunggal<br />
                Tahun Ajaran {schoolProfile.tahunAjaran}
              </div>
            </div>

            {/* Table Prota */}
            {currentProta ? (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
                      <th className="p-3 font-bold w-12 text-center">No</th>
                      <th className="p-3 font-bold w-24">Kode TP</th>
                      <th className="p-3 font-bold">Materi Pokok / Lingkup Materi</th>
                      <th className="p-3 font-bold w-24 text-center">Semester</th>
                      <th className="p-3 font-bold w-20 text-center">Alokasi JP</th>
                      <th className="p-3 font-bold w-36">Perkiraan Bulan</th>
                      <th className="p-3 font-bold w-16 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentProta.items.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center font-bold text-slate-600">{idx + 1}</td>
                        <td className="p-3 font-mono font-bold text-emerald-800">{p.kodeTP}</td>
                        <td className="p-3 font-semibold text-slate-900">{p.materiPokok}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.semester === 'Ganjil' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                            {p.semester}
                          </span>
                        </td>
                        <td className="p-3 text-center font-extrabold text-slate-800">{p.alokasiJP} JP</td>
                        <td className="p-3 text-slate-600">{p.perkiraanBulan}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenProtaRowModal(p.id)}
                              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-sm transition-colors cursor-pointer"
                              title="Edit Baris Prota"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProtaRow(p.id)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-sm transition-colors cursor-pointer"
                              title="Hapus Baris Prota"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                <p>Belum ada data Program Tahunan (Prota) tersimpan.</p>
                <button
                  onClick={handleGenerateProta}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Sinkronkan Prota Sekarang
                </button>
              </div>
            )}

            {/* Official Signatures */}
            <div className="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-800">
              <div className="space-y-1">
                <div>Mengetahui,</div>
                <div className="font-bold">Kepala Sekolah SD Negeri Nambo 03</div>
                <div className="h-16"></div>
                <div className="font-black underline">{schoolProfile.kepalaSekolah}</div>
                <div className="text-[11px] text-slate-600">NIP. {schoolProfile.nipKepalaSekolah}</div>
              </div>

              <div className="space-y-1">
                <div>Klapanunggal, Juli 2026</div>
                <div className="font-bold">Guru Kelas / Mata Pelajaran</div>
                <div className="h-16"></div>
                <div className="font-black underline">{defaultTeacherName}</div>
                <div className="text-[11px] text-slate-600">NIP. {defaultTeacherNIP}</div>
              </div>
            </div>

            {/* Stepper Navigation Footer Banner */}
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setSelectedSubTab('promes')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Langkah 5: Promes</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Seluruh 6 Perangkat Pembelajaran Telah Lengkap!</span>
                </div>
                <button
                  onClick={handleDownloadExcelWorkbook}
                  className="px-4 py-2.5 bg-blue-800 hover:bg-blue-900 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download Master Excel</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TAMBAH / EDIT TUJUAN PEMBELAJARAN (TP) */}
      {/* ========================================================================= */}
      {isTPModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingTP ? 'Edit Tujuan Pembelajaran' : 'Tambah Tujuan Pembelajaran (TP) Baru'}
              </h3>
              <button
                onClick={() => setIsTPModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTPModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode TP</label>
                  <input
                    type="text"
                    value={tpFormData.kodeTP}
                    onChange={e => setTpFormData(prev => ({ ...prev, kodeTP: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alokasi Jam (JP)</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={tpFormData.alokasiJP}
                    onChange={e => setTpFormData(prev => ({ ...prev, alokasiJP: Number(e.target.value) || 2 }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materi Pokok / Lingkup Materi</label>
                <input
                  type="text"
                  value={tpFormData.materiPokok}
                  onChange={e => setTpFormData(prev => ({ ...prev, materiPokok: e.target.value }))}
                  placeholder="Contoh: Logika Navigasi Robot & Percabangan"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Tujuan Pembelajaran (TP)</label>
                <textarea
                  rows={3}
                  value={tpFormData.tujuanDeskripsi}
                  onChange={e => setTpFormData(prev => ({ ...prev, tujuanDeskripsi: e.target.value }))}
                  placeholder="Peserta didik mampu..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  8 Dimensi Profil Lulusan (Pilih yang relevan):
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {DIMENSI_PROFIL_LULUSAN.map(dpl => {
                    const isChecked = tpFormData.dimensiProfilLulusan.includes(dpl);
                    return (
                      <label key={dpl} className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setTpFormData(prev => ({ ...prev, dimensiProfilLulusan: [...prev.dimensiProfilLulusan, dpl] }));
                            } else {
                              setTpFormData(prev => ({ ...prev, dimensiProfilLulusan: prev.dimensiProfilLulusan.filter(d => d !== dpl) }));
                            }
                          }}
                          className="rounded-sm text-emerald-600"
                        />
                        <span className="truncate">{dpl}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Indikator Ketercapaian TP (Satu per baris):
                </label>
                <textarea
                  rows={3}
                  value={tpFormData.indikatorKetercapaianText}
                  onChange={e => setTpFormData(prev => ({ ...prev, indikatorKetercapaianText: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTPModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Tujuan Pembelajaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INPUT / EDIT MANUAL MODUL AJAR DEEP LEARNING */}
      {/* ========================================================================= */}
      {isModulEditorOpen && modulEditorForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Input & Edit Modul Ajar Deep Learning (4 Pilar Lengkap)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {modulEditorForm.mataPelajaran} • {modulEditorForm.kelasNama} ({modulEditorForm.fase})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModulEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModulEditor} className="space-y-6 text-xs">
              {/* Identitas Umum */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
                  Identitas Modul Ajar
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kode Modul</label>
                    <input
                      type="text"
                      value={modulEditorForm.kodeModul}
                      onChange={e => setModulEditorForm({ ...modulEditorForm, kodeModul: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pertemuan Ke-</label>
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={modulEditorForm.pertemuanKe}
                      onChange={e => setModulEditorForm({ ...modulEditorForm, pertemuanKe: Number(e.target.value) || 1 })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Alokasi Waktu</label>
                    <input
                      type="text"
                      value={modulEditorForm.alokasiWaktu}
                      onChange={e => setModulEditorForm({ ...modulEditorForm, alokasiWaktu: e.target.value })}
                      placeholder="2 JP (2 x 35 Menit)"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Tanggal KBM</label>
                    <input
                      type="date"
                      value={modulEditorForm.tanggalAjar || ''}
                      onChange={e => setModulEditorForm({ ...modulEditorForm, tanggalAjar: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Guru Pengampu</label>
                    <input
                      type="text"
                      value={modulEditorForm.guruPenyusun}
                      onChange={e => setModulEditorForm({ ...modulEditorForm, guruPenyusun: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">NIP Guru</label>
                    <input
                      type="text"
                      value={modulEditorForm.nipGuruPenyusun}
                      onChange={e => setModulEditorForm({ ...modulEditorForm, nipGuruPenyusun: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 1. Identifikasi */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider block">
                  I. Identifikasi Pembelajaran & 8 Dimensi Profil Lulusan
                </span>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Analisis Kesiapan Belajar Murid</label>
                  <textarea
                    rows={2}
                    value={modulEditorForm.kesiapanBelajarMurid}
                    onChange={e => setModulEditorForm({ ...modulEditorForm, kesiapanBelajarMurid: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">8 Dimensi Profil Lulusan (DPL):</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-2.5 bg-white rounded-xl border border-slate-200">
                    {DIMENSI_PROFIL_LULUSAN.map(dpl => {
                      const isChecked = modulEditorForm.dimensiProfilLulusan.includes(dpl);
                      return (
                        <label key={dpl} className="flex items-center gap-1.5 text-[11px] cursor-pointer text-slate-700">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setModulEditorForm({ ...modulEditorForm, dimensiProfilLulusan: [...modulEditorForm.dimensiProfilLulusan, dpl] });
                              } else {
                                setModulEditorForm({ ...modulEditorForm, dimensiProfilLulusan: modulEditorForm.dimensiProfilLulusan.filter(d => d !== dpl) });
                              }
                            }}
                            className="rounded-sm text-emerald-600"
                          />
                          <span className="truncate">{dpl}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mindful (Berkesadaran)</label>
                    <textarea
                      rows={2}
                      value={modulEditorForm.prinsipDeepLearning.mindful}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        prinsipDeepLearning: { ...modulEditorForm.prinsipDeepLearning, mindful: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Meaningful (Bermakna)</label>
                    <textarea
                      rows={2}
                      value={modulEditorForm.prinsipDeepLearning.meaningful}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        prinsipDeepLearning: { ...modulEditorForm.prinsipDeepLearning, meaningful: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Joyful (Menggembirakan)</label>
                    <textarea
                      rows={2}
                      value={modulEditorForm.prinsipDeepLearning.joyful}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        prinsipDeepLearning: { ...modulEditorForm.prinsipDeepLearning, joyful: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Desain Pembelajaran */}
              <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200 space-y-3">
                <span className="font-bold text-teal-900 text-xs uppercase tracking-wider block">
                  II. Desain Pembelajaran
                </span>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tujuan Pembelajaran Spesifik</label>
                  <textarea
                    rows={2}
                    value={modulEditorForm.desainPembelajaran.tujuanSpesifik}
                    onChange={e => setModulEditorForm({
                      ...modulEditorForm,
                      desainPembelajaran: { ...modulEditorForm.desainPembelajaran, tujuanSpesifik: e.target.value }
                    })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Praktik Pedagogis</label>
                    <input
                      type="text"
                      value={modulEditorForm.desainPembelajaran.praktikPedagogis}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        desainPembelajaran: { ...modulEditorForm.desainPembelajaran, praktikPedagogis: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pemanfaatan Digital & AI</label>
                    <input
                      type="text"
                      value={modulEditorForm.desainPembelajaran.pemanfaatanDigitalAI}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        desainPembelajaran: { ...modulEditorForm.desainPembelajaran, pemanfaatanDigitalAI: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Pengalaman Belajar Siklus Memahami-Mengaplikasi-Merefleksi */}
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3">
                <span className="font-bold text-blue-900 text-xs uppercase tracking-wider block">
                  III. Pengalaman Belajar (Awal, Inti 3 Tahap, Penutup)
                </span>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Langkah Kegiatan Awal (Pisahkan per baris)</label>
                  <textarea
                    rows={3}
                    value={modulEditorForm.pengalamanBelajar.kegiatanAwal.langkah.join('\n')}
                    onChange={e => setModulEditorForm({
                      ...modulEditorForm,
                      pengalamanBelajar: {
                        ...modulEditorForm.pengalamanBelajar,
                        kegiatanAwal: {
                          ...modulEditorForm.pengalamanBelajar.kegiatanAwal,
                          langkah: e.target.value.split('\n').filter(Boolean)
                        }
                      }
                    })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-emerald-800 mb-1">Tahap 1: Memahami</label>
                    <textarea
                      rows={3}
                      value={modulEditorForm.pengalamanBelajar.kegiatanInti.memahami.join('\n')}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        pengalamanBelajar: {
                          ...modulEditorForm.pengalamanBelajar,
                          kegiatanInti: {
                            ...modulEditorForm.pengalamanBelajar.kegiatanInti,
                            memahami: e.target.value.split('\n').filter(Boolean)
                          }
                        }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-blue-800 mb-1">Tahap 2: Mengaplikasi</label>
                    <textarea
                      rows={3}
                      value={modulEditorForm.pengalamanBelajar.kegiatanInti.mengaplikasi.join('\n')}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        pengalamanBelajar: {
                          ...modulEditorForm.pengalamanBelajar,
                          kegiatanInti: {
                            ...modulEditorForm.pengalamanBelajar.kegiatanInti,
                            mengaplikasi: e.target.value.split('\n').filter(Boolean)
                          }
                        }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-purple-800 mb-1">Tahap 3: Merefleksi</label>
                    <textarea
                      rows={3}
                      value={modulEditorForm.pengalamanBelajar.kegiatanInti.merefleksi.join('\n')}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        pengalamanBelajar: {
                          ...modulEditorForm.pengalamanBelajar,
                          kegiatanInti: {
                            ...modulEditorForm.pengalamanBelajar.kegiatanInti,
                            merefleksi: e.target.value.split('\n').filter(Boolean)
                          }
                        }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Langkah Kegiatan Penutup (Pisahkan per baris)</label>
                  <textarea
                    rows={2}
                    value={modulEditorForm.pengalamanBelajar.kegiatanPenutup.langkah.join('\n')}
                    onChange={e => setModulEditorForm({
                      ...modulEditorForm,
                      pengalamanBelajar: {
                        ...modulEditorForm.pengalamanBelajar,
                        kegiatanPenutup: {
                          ...modulEditorForm.pengalamanBelajar.kegiatanPenutup,
                          langkah: e.target.value.split('\n').filter(Boolean)
                        }
                      }
                    })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-[11px]"
                  />
                </div>
              </div>

              {/* 4. Asesmen, Bahan Ajar, LKPD */}
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 space-y-3">
                <span className="font-bold text-purple-900 text-xs uppercase tracking-wider block">
                  IV. Asesmen Autentik, Bahan Ajar & Lembar Kerja (LKPD)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bahan Ajar Ringkas Guru & Murid</label>
                    <textarea
                      rows={4}
                      value={modulEditorForm.asesmenAutentik.bahanAjarRingkas}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        asesmenAutentik: { ...modulEditorForm.asesmenAutentik, bahanAjarRingkas: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lembar Kerja Peserta Didik (LKPD Harian)</label>
                    <textarea
                      rows={4}
                      value={modulEditorForm.asesmenAutentik.lembarKerjaSiswa}
                      onChange={e => setModulEditorForm({
                        ...modulEditorForm,
                        asesmenAutentik: { ...modulEditorForm.asesmenAutentik, lembarKerjaSiswa: e.target.value }
                      })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModulEditorOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer shadow-md"
                >
                  Simpan Modul Ajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INPUT / EDIT BARIS PROTA MANUAL */}
      {/* ========================================================================= */}
      {isProtaRowModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingProtaRowId ? 'Edit Baris Program Tahunan' : 'Tambah Baris Program Tahunan (Prota) Manual'}
              </h3>
              <button
                onClick={() => setIsProtaRowModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProtaRowModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode TP</label>
                  <input
                    type="text"
                    value={protaRowForm.kodeTP}
                    onChange={e => setProtaRowForm({ ...protaRowForm, kodeTP: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alokasi JP</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={protaRowForm.alokasiJP}
                    onChange={e => setProtaRowForm({ ...protaRowForm, alokasiJP: Number(e.target.value) || 2 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materi Pokok / Lingkup Materi</label>
                <input
                  type="text"
                  value={protaRowForm.materiPokok}
                  onChange={e => setProtaRowForm({ ...protaRowForm, materiPokok: e.target.value })}
                  placeholder="Contoh: Logika Algoritma & Robot Sahabat"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={protaRowForm.semester}
                    onChange={e => setProtaRowForm({ ...protaRowForm, semester: e.target.value as 'Ganjil' | 'Genap' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perkiraan Bulan</label>
                  <input
                    type="text"
                    value={protaRowForm.perkiraanBulan}
                    onChange={e => setProtaRowForm({ ...protaRowForm, perkiraanBulan: e.target.value })}
                    placeholder="Juli - Agustus"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsProtaRowModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Baris Prota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: INPUT BARIS PROMES MANUAL */}
      {/* ========================================================================= */}
      {isPromesRowModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-slate-900 text-base">
                Tambah Baris Program Semester ({selectedSemester}) Manual
              </h3>
              <button
                onClick={() => setIsPromesRowModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePromesRowModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode TP / Agenda</label>
                  <input
                    type="text"
                    value={promesRowForm.kodeTP}
                    onChange={e => setPromesRowForm({ ...promesRowForm, kodeTP: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alokasi Total JP</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={promesRowForm.alokasiJP}
                    onChange={e => setPromesRowForm({ ...promesRowForm, alokasiJP: Number(e.target.value) || 2 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materi Pokok / Agenda</label>
                <input
                  type="text"
                  value={promesRowForm.materiPokok}
                  onChange={e => setPromesRowForm({ ...promesRowForm, materiPokok: e.target.value })}
                  placeholder="Contoh: Praktik Koding Scratch & Pameran Mini"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPromesRowModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan ke Promes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: IMPORT BERKAS (EXCEL / JSON) + DOWNLOAD TEMPLATE */}
      {/* ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Import Berkas Perangkat Ajar
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Import data secara cepat dari file Excel (.xlsx) atau JSON
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Jenis Data yang Diimpor:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportType('tp')}
                    className={`py-2 px-3 rounded-xl font-bold border text-left transition-all ${
                      importType === 'tp'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    1. Tujuan Pembelajaran (TP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('prota')}
                    className={`py-2 px-3 rounded-xl font-bold border text-left transition-all ${
                      importType === 'prota'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    2. Program Tahunan (Prota)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('promes')}
                    className={`py-2 px-3 rounded-xl font-bold border text-left transition-all ${
                      importType === 'promes'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    3. Program Semester (Promes)
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportType('modul-json')}
                    className={`py-2 px-3 rounded-xl font-bold border text-left transition-all ${
                      importType === 'modul-json'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    4. Modul Ajar (JSON)
                  </button>
                </div>
              </div>

              {/* Download Template button */}
              {importType !== 'modul-json' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600">Belum memiliki format berkas?</span>
                  <button
                    type="button"
                    onClick={() => downloadCurriculumTemplate(importType as 'tp' | 'prota' | 'promes')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-emerald-700 font-bold rounded-lg border border-emerald-300 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Template Excel</span>
                  </button>
                </div>
              )}

              {/* Upload Input */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 hover:border-emerald-500 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-600">
                  <label className="font-bold text-emerald-700 hover:underline cursor-pointer">
                    <span>Pilih Berkas dari Perangkat</span>
                    <input
                      type="file"
                      accept={importType === 'modul-json' ? '.json' : '.xlsx, .xls'}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format didukung: {importType === 'modul-json' ? '.json' : '.xlsx / .xls'}
                  </p>
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-center font-bold">
                  {importStatus}
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for refresh icon
const RefreshCW: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);
