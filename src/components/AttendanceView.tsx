import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Calendar,
  Users,
  Download,
  Upload,
  Plus,
  FileSpreadsheet,
  Printer,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart3,
  Filter,
  CheckCircle2,
  Trash2,
  Edit,
  Baby,
  X,
  RotateCcw,
  Check
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { AttendanceRecord, ClassGroup } from '../types';
import {
  downloadTemplateAbsensiHarian,
  downloadTemplateRekapUmur,
  downloadWorkbook,
  readExcelFile
} from '../utils/excelUtils';
import { printOfficialDocument } from '../utils/pdfExport';

type AttendanceSubTab = 'absensi-harian' | 'rekap-umur';

export const AttendanceView: React.FC = () => {
  const {
    attendanceRecords,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    importAttendanceRecords,
    classes,
    students,
    schoolProfile
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<AttendanceSubTab>('absensi-harian');

  // Filters for daily attendance
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-10'); // Default October 2026
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-15');
  const [filterMode, setFilterMode] = useState<'harian' | 'bulanan' | 'semua'>('harian');

  // Manual Attendance Form
  const [inputClassId, setInputClassId] = useState<string>(classes.filter(c => c.jenis === 'Utama')[0]?.id || '');
  const [inputDate, setInputDate] = useState<string>('2026-10-15');
  const [inputSakit, setInputSakit] = useState<number>(0);
  const [inputIzin, setInputIzin] = useState<number>(0);
  const [inputAlpa, setInputAlpa] = useState<number>(0);
  const [inputCatatan, setInputCatatan] = useState<string>('');

  // Age Recap state
  const [ageRecapMonth, setAgeRecapMonth] = useState<string>('2026-10');
  const [ageRecapClassId, setAgeRecapClassId] = useState<string>('all');

  // Manual & Imported Age Recap state stored with localStorage persistence
  const [manualAgeRecap, setManualAgeRecap] = useState<Record<string, {
    counts: Record<string, { L: number; P: number; total: number }>;
    totalL: number;
    totalP: number;
    grandTotal: number;
  }>>(() => {
    try {
      const saved = localStorage.getItem('sdn_nambo_manual_age_recap');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveManualAgeRecap = (updated: Record<string, any>) => {
    setManualAgeRecap(updated);
    try {
      localStorage.setItem('sdn_nambo_manual_age_recap', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Age Recap Manual Form Modal state
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [ageModalClassId, setAgeModalClassId] = useState<string>('');
  const [ageModalMonth, setAgeModalMonth] = useState<string>('2026-10');
  const [ageFormCounts, setAgeFormCounts] = useState<{
    '<6 th': { L: number; P: number };
    '6 th': { L: number; P: number };
    '7 th': { L: number; P: number };
    '8 th': { L: number; P: number };
    '9 th': { L: number; P: number };
    '10 th': { L: number; P: number };
    '11 th': { L: number; P: number };
    '12 th': { L: number; P: number };
    '>12 th': { L: number; P: number };
  }>({
    '<6 th': { L: 0, P: 0 },
    '6 th': { L: 0, P: 0 },
    '7 th': { L: 0, P: 0 },
    '8 th': { L: 0, P: 0 },
    '9 th': { L: 0, P: 0 },
    '10 th': { L: 0, P: 0 },
    '11 th': { L: 0, P: 0 },
    '12 th': { L: 0, P: 0 },
    '>12 th': { L: 0, P: 0 }
  });

  const mainClasses = useMemo(() => classes.filter(c => c.jenis === 'Utama'), [classes]);

  // All Academic Year 2026-2027 Months (July 2026 to June 2027)
  const academicYearMonths = [
    { key: '2026-07', label: 'Juli 2026' },
    { key: '2026-08', label: 'Agustus 2026' },
    { key: '2026-09', label: 'September 2026' },
    { key: '2026-10', label: 'Oktober 2026' },
    { key: '2026-11', label: 'November 2026' },
    { key: '2026-12', label: 'Desember 2026' },
    { key: '2027-01', label: 'Januari 2027' },
    { key: '2027-02', label: 'Februari 2027' },
    { key: '2027-03', label: 'Maret 2027' },
    { key: '2027-04', label: 'April 2027' },
    { key: '2027-05', label: 'Mei 2027' },
    { key: '2027-06', label: 'Juni 2027' }
  ];

  // Calculate current total students in selected class
  const classStudentCount = useMemo(() => {
    if (!inputClassId) return 32;
    const count = students.filter(
      s => s.kelasId === inputClassId && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
    ).length;
    return count > 0 ? count : 32;
  }, [inputClassId, students]);

  // Handle Save Attendance
  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    const hadir = Math.max(classStudentCount - (inputSakit + inputIzin + inputAlpa), 0);
    const bulan = inputDate.substring(0, 7);

    addAttendanceRecord({
      tanggal: inputDate,
      bulan,
      kelasId: inputClassId,
      hadir,
      sakit: Number(inputSakit),
      izin: Number(inputIzin),
      alpa: Number(inputAlpa),
      totalSiswa: classStudentCount,
      catatan: inputCatatan
    });

    setInputCatatan('');
    alert('Data presensi harian kelas berhasil disimpan!');
  };

  // Filtered Attendance List
  const displayedRecords = useMemo(() => {
    return attendanceRecords.filter(r => {
      // Class filter
      if (selectedClassFilter !== 'all' && r.kelasId !== selectedClassFilter) {
        return false;
      }
      // Mode filter
      if (filterMode === 'harian') {
        return r.tanggal === selectedDate;
      }
      if (filterMode === 'bulanan') {
        return r.bulan === selectedMonth;
      }
      // 'semua' => all months of 2026-2027
      return true;
    });
  }, [attendanceRecords, selectedClassFilter, filterMode, selectedDate, selectedMonth]);

  // Import handler
  const handleImportAttendance = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readExcelFile(file);
      const res = importAttendanceRecords(data);
      alert(`Berhasil mengimpor ${res.successCount} data presensi harian.`);
    } catch (err: any) {
      alert(`Gagal membaca file: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  };

  // Real-time Export Excel (Harian / Bulanan / Semua Bulan TA 2026-2027)
  const handleExportAttendanceExcel = () => {
    const scopeLabel =
      filterMode === 'harian'
        ? `Tanggal_${selectedDate}`
        : filterMode === 'bulanan'
        ? `Bulan_${selectedMonth}`
        : `Semua_Bulan_TA_2026_2027`;

    const rows = displayedRecords.map((r, idx) => {
      const cls = classes.find(c => c.id === r.kelasId)?.nama || '-';
      const pct = r.totalSiswa > 0 ? Math.round((r.hadir / r.totalSiswa) * 100) : 0;
      return {
        No: idx + 1,
        Tanggal: r.tanggal,
        Bulan: r.bulan,
        Kelas: cls,
        'Jumlah Siswa': r.totalSiswa,
        Hadir: r.hadir,
        Sakit: r.sakit,
        Izin: r.izin,
        Alpa: r.alpa,
        'Persentase Kehadiran (%)': `${pct}%`,
        Catatan: r.catatan || '-'
      };
    });

    downloadWorkbook(rows, `Rekap_Presensi_${scopeLabel}_SDN_Nambo_03`, 'Presensi Siswa');
  };

  // Real-time Print PDF Kop Surat Resmi
  const handlePrintAttendancePDF = () => {
    const scopeLabel =
      filterMode === 'harian'
        ? `Tanggal ${selectedDate}`
        : filterMode === 'bulanan'
        ? `Bulan ${academicYearMonths.find(m => m.key === selectedMonth)?.label || selectedMonth}`
        : `Tahun Ajaran Penuh 2026-2027 (Juli 2026 - Juni 2027)`;

    const headers = ['No', 'Tanggal', 'Kelas', 'Total', 'Hadir', 'Sakit', 'Izin', 'Alpa', '% Kehadiran', 'Keterangan'];
    const rows = displayedRecords.map((r, idx) => {
      const cls = classes.find(c => c.id === r.kelasId)?.nama || '-';
      const pct = r.totalSiswa > 0 ? Math.round((r.hadir / r.totalSiswa) * 100) : 0;
      return [
        idx + 1,
        r.tanggal,
        cls,
        r.totalSiswa,
        r.hadir,
        r.sakit,
        r.izin,
        r.alpa,
        `${pct}%`,
        r.catatan || '-'
      ];
    });

    const totalHadir = displayedRecords.reduce((sum, r) => sum + r.hadir, 0);
    const totalSakit = displayedRecords.reduce((sum, r) => sum + r.sakit, 0);
    const totalIzin = displayedRecords.reduce((sum, r) => sum + r.izin, 0);
    const totalAlpa = displayedRecords.reduce((sum, r) => sum + r.alpa, 0);
    const grandTotal = totalHadir + totalSakit + totalIzin + totalAlpa;
    const avgPct = grandTotal > 0 ? Math.round((totalHadir / grandTotal) * 100) : 0;

    const summaryNotes = [
      `Cakupan Laporan: ${scopeLabel}`,
      `Total Kehadiran Efektif: ${totalHadir} siswa (${avgPct}%)`,
      `Rekapitulasi Ketidakhadiran: Sakit = ${totalSakit}, Izin = ${totalIzin}, Alpa = ${totalAlpa}`,
      `Dicetak otomatis oleh Sistem SIAKAD SD Negeri Nambo 03, Klapanunggal, Kab. Bogor`
    ];

    printOfficialDocument({
      title: 'REKAPITULASI PRESENSI KEHADIRAN SISWA GLOBAL',
      subtitle: `SD NEGERI NAMBO 03 - TAHUN AJARAN 2026-2027 (${scopeLabel})`,
      documentNumber: `421.2/095/SDN-N03/ABS/2026`,
      tableHeaders: headers,
      tableRows: rows,
      summaryNotes,
      schoolProfile
    });
  };

  // =========================================================
  // REKAPITULASI UMUR SISWA CALCULATIONS
  // Age groups: <6, 6, 7, 8, 9, 10, 11, 12, >12 th per L/P
  // =========================================================
  const ageRecapData = useMemo(() => {
    // Reference date based on ageRecapMonth (e.g. 2026-10-15)
    const refYear = parseInt(ageRecapMonth.substring(0, 4), 10) || 2026;
    const refMonth = parseInt(ageRecapMonth.substring(5, 7), 10) || 10;

    const targetClasses = ageRecapClassId === 'all'
      ? mainClasses
      : mainClasses.filter(c => c.id === ageRecapClassId);

    return targetClasses.map(cls => {
      const manualKey = `${ageRecapMonth}_${cls.id}`;
      if (manualAgeRecap[manualKey]) {
        return {
          classId: cls.id,
          className: cls.nama,
          counts: manualAgeRecap[manualKey].counts,
          totalL: manualAgeRecap[manualKey].totalL,
          totalP: manualAgeRecap[manualKey].totalP,
          grandTotal: manualAgeRecap[manualKey].grandTotal,
          isManual: true
        };
      }

      const classStudents = students.filter(
        s => s.kelasId === cls.id && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
      );

      const counts: Record<string, { L: number; P: number; total: number }> = {
        '<6 th': { L: 0, P: 0, total: 0 },
        '6 th': { L: 0, P: 0, total: 0 },
        '7 th': { L: 0, P: 0, total: 0 },
        '8 th': { L: 0, P: 0, total: 0 },
        '9 th': { L: 0, P: 0, total: 0 },
        '10 th': { L: 0, P: 0, total: 0 },
        '11 th': { L: 0, P: 0, total: 0 },
        '12 th': { L: 0, P: 0, total: 0 },
        '>12 th': { L: 0, P: 0, total: 0 }
      };

      let totalL = 0;
      let totalP = 0;

      classStudents.forEach(s => {
        const birthDate = new Date(s.tanggalLahir);
        let age = refYear - birthDate.getFullYear();
        const mDiff = refMonth - (birthDate.getMonth() + 1);
        if (mDiff < 0) {
          age--;
        }

        let ageGroup = '';
        if (age < 6) ageGroup = '<6 th';
        else if (age === 6) ageGroup = '6 th';
        else if (age === 7) ageGroup = '7 th';
        else if (age === 8) ageGroup = '8 th';
        else if (age === 9) ageGroup = '9 th';
        else if (age === 10) ageGroup = '10 th';
        else if (age === 11) ageGroup = '11 th';
        else if (age === 12) ageGroup = '12 th';
        else ageGroup = '>12 th';

        if (s.jenisKelamin === 'L') {
          counts[ageGroup].L++;
          totalL++;
        } else {
          counts[ageGroup].P++;
          totalP++;
        }
        counts[ageGroup].total++;
      });

      return {
        classId: cls.id,
        className: cls.nama,
        counts,
        totalL,
        totalP,
        grandTotal: classStudents.length,
        isManual: false
      };
    });
  }, [students, mainClasses, ageRecapMonth, ageRecapClassId, manualAgeRecap]);

  // Open Manual Age modal prefilled
  const handleOpenAgeModal = (classIdToEdit?: string) => {
    const targetClassId = classIdToEdit || (mainClasses[0]?.id || '');
    setAgeModalClassId(targetClassId);
    setAgeModalMonth(ageRecapMonth);

    const manualKey = `${ageRecapMonth}_${targetClassId}`;
    if (manualAgeRecap[manualKey]) {
      const existing = manualAgeRecap[manualKey].counts;
      setAgeFormCounts({
        '<6 th': { L: existing['<6 th']?.L || 0, P: existing['<6 th']?.P || 0 },
        '6 th': { L: existing['6 th']?.L || 0, P: existing['6 th']?.P || 0 },
        '7 th': { L: existing['7 th']?.L || 0, P: existing['7 th']?.P || 0 },
        '8 th': { L: existing['8 th']?.L || 0, P: existing['8 th']?.P || 0 },
        '9 th': { L: existing['9 th']?.L || 0, P: existing['9 th']?.P || 0 },
        '10 th': { L: existing['10 th']?.L || 0, P: existing['10 th']?.P || 0 },
        '11 th': { L: existing['11 th']?.L || 0, P: existing['11 th']?.P || 0 },
        '12 th': { L: existing['12 th']?.L || 0, P: existing['12 th']?.P || 0 },
        '>12 th': { L: existing['>12 th']?.L || 0, P: existing['>12 th']?.P || 0 }
      });
    } else {
      populateFormFromClassStudents(targetClassId, ageRecapMonth);
    }
    setIsAgeModalOpen(true);
  };

  const populateFormFromClassStudents = (targetClassId: string, month: string) => {
    const refYear = parseInt(month.substring(0, 4), 10) || 2026;
    const refMonth = parseInt(month.substring(5, 7), 10) || 10;
    const classStudents = students.filter(
      s => s.kelasId === targetClassId && (s.status === 'Aktif' || s.status === 'Pindahan Masuk')
    );

    const initCounts = {
      '<6 th': { L: 0, P: 0 },
      '6 th': { L: 0, P: 0 },
      '7 th': { L: 0, P: 0 },
      '8 th': { L: 0, P: 0 },
      '9 th': { L: 0, P: 0 },
      '10 th': { L: 0, P: 0 },
      '11 th': { L: 0, P: 0 },
      '12 th': { L: 0, P: 0 },
      '>12 th': { L: 0, P: 0 }
    };

    classStudents.forEach(s => {
      const birthDate = new Date(s.tanggalLahir);
      let age = refYear - birthDate.getFullYear();
      const mDiff = refMonth - (birthDate.getMonth() + 1);
      if (mDiff < 0) age--;

      let ageGroup: keyof typeof initCounts = '>12 th';
      if (age < 6) ageGroup = '<6 th';
      else if (age === 6) ageGroup = '6 th';
      else if (age === 7) ageGroup = '7 th';
      else if (age === 8) ageGroup = '8 th';
      else if (age === 9) ageGroup = '9 th';
      else if (age === 10) ageGroup = '10 th';
      else if (age === 11) ageGroup = '11 th';
      else if (age === 12) ageGroup = '12 th';

      if (s.jenisKelamin === 'L') {
        initCounts[ageGroup].L++;
      } else {
        initCounts[ageGroup].P++;
      }
    });

    setAgeFormCounts(initCounts);
  };

  const handleSaveManualAgeForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageModalClassId) {
      alert('Pilih kelas terlebih dahulu!');
      return;
    }

    const counts: Record<string, { L: number; P: number; total: number }> = {};
    let totalL = 0;
    let totalP = 0;

    (Object.keys(ageFormCounts) as (keyof typeof ageFormCounts)[]).forEach(k => {
      const l = Number(ageFormCounts[k].L) || 0;
      const p = Number(ageFormCounts[k].P) || 0;
      counts[k] = { L: l, P: p, total: l + p };
      totalL += l;
      totalP += p;
    });

    const key = `${ageModalMonth}_${ageModalClassId}`;
    const updated = {
      ...manualAgeRecap,
      [key]: {
        counts,
        totalL,
        totalP,
        grandTotal: totalL + totalP
      }
    };

    saveManualAgeRecap(updated);
    setIsAgeModalOpen(false);
    alert('Rekapitulasi umur berhasil disimpan secara manual!');
  };

  const handleResetClassToAuto = (classId: string) => {
    const key = `${ageRecapMonth}_${classId}`;
    if (manualAgeRecap[key]) {
      const updated = { ...manualAgeRecap };
      delete updated[key];
      saveManualAgeRecap(updated);
      alert('Data rekapitulasi umur kelas ini telah dikembalikan ke perhitungan otomatis dari profil siswa!');
    }
  };

  const handleImportAgeRecap = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readExcelFile(file);
      const updated = { ...manualAgeRecap };
      let successCount = 0;

      data.forEach((row: any) => {
        const rowMonth = String(row['Bulan (YYYY-MM)'] || row['Bulan'] || ageRecapMonth).trim();
        const rowClassStr = String(row['Nama Kelas'] || row['Kelas'] || '').trim();
        const foundCls = mainClasses.find(
          c => c.nama.toLowerCase() === rowClassStr.toLowerCase() || c.id === rowClassStr
        );

        if (foundCls && rowMonth) {
          const l_under6 = Number(row['<6 Th L'] || row['<6 Th (L)'] || 0);
          const p_under6 = Number(row['<6 Th P'] || row['<6 Th (P)'] || 0);
          const l_6 = Number(row['6 Th L'] || row['6 Th (L)'] || 0);
          const p_6 = Number(row['6 Th P'] || row['6 Th (P)'] || 0);
          const l_7 = Number(row['7 Th L'] || row['7 Th (L)'] || 0);
          const p_7 = Number(row['7 Th P'] || row['7 Th (P)'] || 0);
          const l_8 = Number(row['8 Th L'] || row['8 Th (L)'] || 0);
          const p_8 = Number(row['8 Th P'] || row['8 Th (P)'] || 0);
          const l_9 = Number(row['9 Th L'] || row['9 Th (L)'] || 0);
          const p_9 = Number(row['9 Th P'] || row['9 Th (P)'] || 0);
          const l_10 = Number(row['10 Th L'] || row['10 Th (L)'] || 0);
          const p_10 = Number(row['10 Th P'] || row['10 Th (P)'] || 0);
          const l_11 = Number(row['11 Th L'] || row['11 Th (L)'] || 0);
          const p_11 = Number(row['11 Th P'] || row['11 Th (P)'] || 0);
          const l_12 = Number(row['12 Th L'] || row['12 Th (L)'] || 0);
          const p_12 = Number(row['12 Th P'] || row['12 Th (P)'] || 0);
          const l_over12 = Number(row['>12 Th L'] || row['>12 Th (L)'] || 0);
          const p_over12 = Number(row['>12 Th P'] || row['>12 Th (P)'] || 0);

          const counts: Record<string, { L: number; P: number; total: number }> = {
            '<6 th': { L: l_under6, P: p_under6, total: l_under6 + p_under6 },
            '6 th': { L: l_6, P: p_6, total: l_6 + p_6 },
            '7 th': { L: l_7, P: p_7, total: l_7 + p_7 },
            '8 th': { L: l_8, P: p_8, total: l_8 + p_8 },
            '9 th': { L: l_9, P: p_9, total: l_9 + p_9 },
            '10 th': { L: l_10, P: p_10, total: l_10 + p_10 },
            '11 th': { L: l_11, P: p_11, total: l_11 + p_11 },
            '12 th': { L: l_12, P: p_12, total: l_12 + p_12 },
            '>12 th': { L: l_over12, P: p_over12, total: l_over12 + p_over12 }
          };

          const totalL = l_under6 + l_6 + l_7 + l_8 + l_9 + l_10 + l_11 + l_12 + l_over12;
          const totalP = p_under6 + p_6 + p_7 + p_8 + p_9 + p_10 + p_11 + p_12 + p_over12;

          updated[`${rowMonth}_${foundCls.id}`] = {
            counts,
            totalL,
            totalP,
            grandTotal: totalL + totalP
          };
          successCount++;
        }
      });

      saveManualAgeRecap(updated);
      alert(`Berhasil mengimpor data rekapitulasi umur untuk ${successCount} kelas/bulan!`);
    } catch (err: any) {
      alert(`Gagal membaca file Excel: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  };

  // Export Age Recap Excel
  const handleExportAgeRecapExcel = () => {
    const monthLabel = academicYearMonths.find(m => m.key === ageRecapMonth)?.label || ageRecapMonth;
    const flatRows: any[] = [];

    ageRecapData.forEach((row, idx) => {
      flatRows.push({
        No: idx + 1,
        Kelas: row.className,
        Bulan: monthLabel,
        '<6 Th (L)': row.counts['<6 th'].L,
        '<6 Th (P)': row.counts['<6 th'].P,
        '6 Th (L)': row.counts['6 th'].L,
        '6 Th (P)': row.counts['6 th'].P,
        '7 Th (L)': row.counts['7 th'].L,
        '7 Th (P)': row.counts['7 th'].P,
        '8 Th (L)': row.counts['8 th'].L,
        '8 Th (P)': row.counts['8 th'].P,
        '9 Th (L)': row.counts['9 th'].L,
        '9 Th (P)': row.counts['9 th'].P,
        '10 Th (L)': row.counts['10 th'].L,
        '10 Th (P)': row.counts['10 th'].P,
        '11 Th (L)': row.counts['11 th'].L,
        '11 Th (P)': row.counts['11 th'].P,
        '12 Th (L)': row.counts['12 th'].L,
        '12 Th (P)': row.counts['12 th'].P,
        '>12 Th (L)': row.counts['>12 th'].L,
        '>12 Th (P)': row.counts['>12 th'].P,
        'Total L': row.totalL,
        'Total P': row.totalP,
        'Jumlah Total': row.grandTotal
      });
    });

    downloadWorkbook(flatRows, `Rekapitulasi_Umur_Siswa_${ageRecapMonth}_SDN_Nambo_03`, 'Rekap Umur Siswa');
  };

  // Print Age Recap PDF
  const handlePrintAgeRecapPDF = () => {
    const monthLabel = academicYearMonths.find(m => m.key === ageRecapMonth)?.label || ageRecapMonth;
    const headers = [
      'No', 'Kelas', '<6th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '>12th', 'L', 'P', 'Total'
    ];

    const rows = ageRecapData.map((d, idx) => [
      idx + 1,
      d.className,
      d.counts['<6 th'].total,
      d.counts['6 th'].total,
      d.counts['7 th'].total,
      d.counts['8 th'].total,
      d.counts['9 th'].total,
      d.counts['10 th'].total,
      d.counts['11 th'].total,
      d.counts['12 th'].total,
      d.counts['>12 th'].total,
      d.totalL,
      d.totalP,
      d.grandTotal
    ]);

    const grandTotalSiswa = ageRecapData.reduce((sum, d) => sum + d.grandTotal, 0);
    const summaryNotes = [
      `Bulan Rekapitulasi: ${monthLabel} (Tahun Ajaran 2026-2027)`,
      `Total Peserta Didik Direkapitulasi: ${grandTotalSiswa} siswa`,
      `Dihitung berdasarkan tanggal lahir aktual seluruh siswa terdaftar di SDN Nambo 03`
    ];

    printOfficialDocument({
      title: 'REKAPITULASI UMUR SISWA PER KELAS DAN PER BULAN',
      subtitle: `SD NEGERI NAMBO 03 KLAPANUNGGAL BOGOR (${monthLabel})`,
      documentNumber: `421.2/098/SDN-N03/UMUR/2026`,
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
            Menu Absensi Harian & Rekapitulasi Umur Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pencatatan presensi harian per kelas TA 2026-2027 (Juli 2026 s/d Juni 2027) & rekapitulasi distribusi usia siswa
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('absensi-harian')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'absensi-harian'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Tab Input Absensi Harian Global</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            TA 2026-2027
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('rekap-umur')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
            activeSubTab === 'rekap-umur'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>Tab Rekapitulasi Umur Siswa</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
            Per Bulan Per Kelas
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. TAB INPUT ABSENSI HARIAN GLOBAL PER KELAS */}
      {/* ========================================================= */}
      {activeSubTab === 'absensi-harian' && (
        <div className="space-y-6">
          {/* Action Header & Import Template */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-5 rounded-2xl border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-base">
                  Presensi Harian Global Per Kelas (Tahun Ajaran 2026-2027)
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Pencatatan harian Hadir (H), Sakit (S), Izin (I), dan Alpa (A). Mendukung ekspor real-time per hari, per bulan, atau semua bulan aktif (Jul 2026 - Jun 2027).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={downloadTemplateAbsensiHarian}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download Template Absensi (10 Dummy)</span>
              </button>

              <label className="cursor-pointer px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Excel Absensi</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportAttendance}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Input Harian Guru & Realtime Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Input Presensi Harian Kelas</h4>
                  <p className="text-[11px] text-slate-500">Diisi oleh guru kelas setiap hari KBM</p>
                </div>
              </div>

              <form onSubmit={handleSaveAttendance} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelas *</label>
                  <select
                    value={inputClassId}
                    onChange={e => setInputClassId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    {mainClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Absensi *</label>
                  <input
                    type="date"
                    value={inputDate}
                    onChange={e => setInputDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-medium"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Tahun Ajaran 2026/2027</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Total Siswa di Kelas:</span>
                    <span className="font-mono text-emerald-700 font-extrabold">{classStudentCount} Siswa</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-amber-700 mb-0.5">Sakit (S)</label>
                      <input
                        type="number"
                        min={0}
                        value={inputSakit}
                        onChange={e => setInputSakit(Math.max(0, Number(e.target.value)))}
                        className="w-full px-2 py-1.5 text-xs text-center border border-amber-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-blue-700 mb-0.5">Izin (I)</label>
                      <input
                        type="number"
                        min={0}
                        value={inputIzin}
                        onChange={e => setInputIzin(Math.max(0, Number(e.target.value)))}
                        className="w-full px-2 py-1.5 text-xs text-center border border-blue-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-rose-700 mb-0.5">Alpa (A)</label>
                      <input
                        type="number"
                        min={0}
                        value={inputAlpa}
                        onChange={e => setInputAlpa(Math.max(0, Number(e.target.value)))}
                        className="w-full px-2 py-1.5 text-xs text-center border border-rose-300 rounded-lg font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-emerald-800">
                    <span>Otomatis Hadir (H):</span>
                    <span className="font-mono text-sm">
                      {Math.max(classStudentCount - (inputSakit + inputIzin + inputAlpa), 0)} Siswa
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Tambahan</label>
                  <input
                    type="text"
                    placeholder="Contoh: 1 siswa izin berobat, KBM tertib"
                    value={inputCatatan}
                    onChange={e => setInputCatatan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Presensi Harian</span>
                </button>
              </form>
            </div>

            {/* Attendance Filter & Real-Time Records Table (2 Columns) */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              {/* Controls Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                {/* Filter Mode Selector */}
                <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterMode('harian')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                      filterMode === 'harian' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Per Hari
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('bulanan')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                      filterMode === 'bulanan' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Per Bulan
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('semua')}
                    className={`px-3 py-1.5 font-bold rounded-lg transition-all ${
                      filterMode === 'semua' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Semua Bulan (2026-2027)
                  </button>
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportAttendanceExcel}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    title="Unduh Excel Real-time"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Download Excel</span>
                  </button>

                  <button
                    onClick={handlePrintAttendancePDF}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    title="Cetak PDF Kop Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Filter Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                {filterMode === 'harian' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Tanggal:</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                )}

                {(filterMode === 'bulanan' || filterMode === 'harian') && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Bulan (TA 2026-2027):</label>
                    <select
                      value={selectedMonth}
                      onChange={e => setSelectedMonth(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold"
                    >
                      {academicYearMonths.map(m => (
                        <option key={m.key} value={m.key}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Filter Rombel:</label>
                  <select
                    value={selectedClassFilter}
                    onChange={e => setSelectedClassFilter(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  >
                    <option value="all">Semua Kelas</option>
                    {mainClasses.map(c => (
                      <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600 sticky top-0">
                    <tr>
                      <th className="p-2.5">Tanggal</th>
                      <th className="p-2.5">Kelas</th>
                      <th className="p-2.5 text-center">Hadir</th>
                      <th className="p-2.5 text-center">Sakit</th>
                      <th className="p-2.5 text-center">Izin</th>
                      <th className="p-2.5 text-center">Alpa</th>
                      <th className="p-2.5 text-center">% Kehadiran</th>
                      <th className="p-2.5">Catatan</th>
                      <th className="p-2.5 text-center w-12">Hapus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedRecords.length > 0 ? (
                      displayedRecords.map(r => {
                        const cls = classes.find(c => c.id === r.kelasId)?.nama || '-';
                        const pct = r.totalSiswa > 0 ? Math.round((r.hadir / r.totalSiswa) * 100) : 0;

                        return (
                          <tr key={r.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono text-[11px]">{r.tanggal}</td>
                            <td className="p-2.5 font-bold text-slate-800">{cls}</td>
                            <td className="p-2.5 text-center font-bold text-emerald-700 bg-emerald-50/50">
                              {r.hadir}
                            </td>
                            <td className="p-2.5 text-center font-semibold text-amber-700">{r.sakit}</td>
                            <td className="p-2.5 text-center font-semibold text-blue-700">{r.izin}</td>
                            <td className="p-2.5 text-center font-semibold text-rose-700">{r.alpa}</td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                  pct >= 95
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : pct >= 85
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {pct}%
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-500 max-w-xs truncate">{r.catatan || '-'}</td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => deleteAttendanceRecord(r.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-6 text-center text-slate-400">
                          Tidak ada rekaman presensi pada filter yang dipilih.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. TAB REKAPITULASI UMUR SISWA */}
      {/* ========================================================= */}
      {activeSubTab === 'rekap-umur' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-slate-50 p-5 rounded-2xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Baby className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-slate-800 text-base">
                  Rekapitulasi Umur Siswa Per Bulan Per Kelas
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Klasifikasi rentang umur (&lt;6 th, 6, 7, 8, 9, 10, 11, 12, &gt;12 th) per jenis kelamin Laki-laki / Perempuan secara otomatis & akurat.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleOpenAgeModal()}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Input Manual Umur</span>
              </button>

              <label className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import Excel Umur</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleImportAgeRecap}
                  className="hidden"
                />
              </label>

              <button
                onClick={downloadTemplateRekapUmur}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5"
                title="Download template Excel dengan 10 data dummy"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Template Excel</span>
              </button>

              <button
                onClick={handleExportAgeRecapExcel}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download Excel</span>
              </button>

              <button
                onClick={handlePrintAgeRecapPDF}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap PDF</span>
              </button>
            </div>
          </div>

          {/* Selector Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Bulan Acuan Hitung Umur:</label>
                <select
                  value={ageRecapMonth}
                  onChange={e => setAgeRecapMonth(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"
                >
                  {academicYearMonths.map(m => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pilih Kelas:</label>
                <select
                  value={ageRecapClassId}
                  onChange={e => setAgeRecapClassId(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800"
                >
                  <option value="all">Semua Rombel (1A s/d 6B)</option>
                  {mainClasses.map(c => (
                    <option key={c.id} value={c.id}>{c.nama}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Otomatis (Profil Siswa)</span>
              </span>
              <span className="flex items-center gap-1 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Manual / Import Guru</span>
              </span>
            </div>
          </div>

          {/* Comprehensive Age Matrix Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left">Nama Kelas</th>
                    <th className="p-3 bg-blue-50/50">&lt;6 th</th>
                    <th className="p-3">6 th</th>
                    <th className="p-3 bg-blue-50/50">7 th</th>
                    <th className="p-3">8 th</th>
                    <th className="p-3 bg-blue-50/50">9 th</th>
                    <th className="p-3">10 th</th>
                    <th className="p-3 bg-blue-50/50">11 th</th>
                    <th className="p-3">12 th</th>
                    <th className="p-3 bg-blue-50/50">&gt;12 th</th>
                    <th className="p-3 bg-emerald-50 text-emerald-800">L</th>
                    <th className="p-3 bg-pink-50 text-pink-800">P</th>
                    <th className="p-3 bg-slate-200 font-extrabold text-slate-900">Total</th>
                    <th className="p-3 text-center">Status & Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ageRecapData.map(row => (
                    <tr key={row.classId} className="hover:bg-slate-50">
                      <td className="p-3 text-left font-bold text-slate-900">{row.className}</td>
                      <td className="p-3 bg-blue-50/20 font-mono">{row.counts['<6 th'].total}</td>
                      <td className="p-3 font-mono">{row.counts['6 th'].total}</td>
                      <td className="p-3 bg-blue-50/20 font-mono">{row.counts['7 th'].total}</td>
                      <td className="p-3 font-mono">{row.counts['8 th'].total}</td>
                      <td className="p-3 bg-blue-50/20 font-mono">{row.counts['9 th'].total}</td>
                      <td className="p-3 font-mono">{row.counts['10 th'].total}</td>
                      <td className="p-3 bg-blue-50/20 font-mono">{row.counts['11 th'].total}</td>
                      <td className="p-3 font-mono">{row.counts['12 th'].total}</td>
                      <td className="p-3 bg-blue-50/20 font-mono">{row.counts['>12 th'].total}</td>
                      <td className="p-3 bg-emerald-50/40 font-bold text-blue-700 font-mono">{row.totalL}</td>
                      <td className="p-3 bg-pink-50/40 font-bold text-pink-700 font-mono">{row.totalP}</td>
                      <td className="p-3 bg-slate-100 font-extrabold font-mono text-slate-900">{row.grandTotal}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {row.isManual ? (
                            <>
                              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-800">
                                Manual
                              </span>
                              <button
                                onClick={() => handleOpenAgeModal(row.classId)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                                title="Edit Manual"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleResetClassToAuto(row.classId)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Reset ke Profil Siswa Otomatis"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                Otomatis
                              </span>
                              <button
                                onClick={() => handleOpenAgeModal(row.classId)}
                                className="p-1 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                title="Sesuaikan Manual"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100/90 font-extrabold text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    <td className="p-3 text-left">TOTAL KESELURUHAN</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['<6 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['6 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['7 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['8 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['9 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['10 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['11 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['12 th'].total, 0)}</td>
                    <td className="p-3 font-mono">{ageRecapData.reduce((s, r) => s + r.counts['>12 th'].total, 0)}</td>
                    <td className="p-3 font-mono text-blue-700">{ageRecapData.reduce((s, r) => s + r.totalL, 0)}</td>
                    <td className="p-3 font-mono text-pink-700">{ageRecapData.reduce((s, r) => s + r.totalP, 0)}</td>
                    <td className="p-3 font-mono bg-slate-200">{ageRecapData.reduce((s, r) => s + r.grandTotal, 0)}</td>
                    <td className="p-3 text-center text-slate-400 font-normal text-[11px]">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Modal Input / Edit Manual Rekapitulasi Umur */}
          {isAgeModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-teal-700 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Baby className="w-5 h-5 text-teal-200" />
                    <div>
                      <h3 className="font-bold text-sm">Input & Penyesuaian Manual Rekapitulasi Umur</h3>
                      <p className="text-[11px] text-teal-100">SD Negeri Nambo 03 - TA 2026-2027</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAgeModalOpen(false)}
                    className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <form onSubmit={handleSaveManualAgeForm} className="p-6 overflow-y-auto space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kelas / Rombel:</label>
                      <select
                        value={ageModalClassId}
                        onChange={e => {
                          setAgeModalClassId(e.target.value);
                          populateFormFromClassStudents(e.target.value, ageModalMonth);
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                        required
                      >
                        {mainClasses.map(c => (
                          <option key={c.id} value={c.id}>{c.nama}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Bulan Acuan Hitung:</label>
                      <select
                        value={ageModalMonth}
                        onChange={e => {
                          setAgeModalMonth(e.target.value);
                          if (ageModalClassId) {
                            populateFormFromClassStudents(ageModalClassId, e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                        required
                      >
                        {academicYearMonths.map(m => (
                          <option key={m.key} value={m.key}>{m.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900">
                    <span>Ingin mengambil angka awal dari profil siswa terdaftar saat ini?</span>
                    <button
                      type="button"
                      onClick={() => populateFormFromClassStudents(ageModalClassId, ageModalMonth)}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Salin dari Profil Siswa</span>
                    </button>
                  </div>

                  {/* Age Input Rows */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    <div className="grid grid-cols-4 bg-slate-100 font-bold text-slate-700 p-2.5 text-center text-[11px] uppercase">
                      <div className="text-left col-span-2">Rentang Umur</div>
                      <div className="text-blue-700">Laki-laki (L)</div>
                      <div className="text-pink-700">Perempuan (P)</div>
                    </div>

                    <div className="divide-y divide-slate-100 p-1">
                      {(Object.keys(ageFormCounts) as (keyof typeof ageFormCounts)[]).map(ageKey => (
                        <div key={ageKey} className="grid grid-cols-4 items-center p-2 hover:bg-slate-50">
                          <div className="col-span-2 font-semibold text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>{ageKey}</span>
                          </div>

                          <div className="px-1">
                            <input
                              type="number"
                              min="0"
                              value={ageFormCounts[ageKey].L}
                              onChange={e => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setAgeFormCounts(prev => ({
                                  ...prev,
                                  [ageKey]: { ...prev[ageKey], L: val }
                                }));
                              }}
                              className="w-full text-center px-2 py-1.5 bg-blue-50/50 border border-blue-200 rounded-lg font-mono font-bold text-blue-900"
                            />
                          </div>

                          <div className="px-1">
                            <input
                              type="number"
                              min="0"
                              value={ageFormCounts[ageKey].P}
                              onChange={e => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setAgeFormCounts(prev => ({
                                  ...prev,
                                  [ageKey]: { ...prev[ageKey], P: val }
                                }));
                              }}
                              className="w-full text-center px-2 py-1.5 bg-pink-50/50 border border-pink-200 rounded-lg font-mono font-bold text-pink-900"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Total Badge */}
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-100 rounded-xl text-center text-xs">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Total L</span>
                      <span className="font-extrabold text-blue-700 text-sm">
                        {Object.values(ageFormCounts).reduce((s, v) => s + (Number(v.L) || 0), 0)} siswa
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Total P</span>
                      <span className="font-extrabold text-pink-700 text-sm">
                        {Object.values(ageFormCounts).reduce((s, v) => s + (Number(v.P) || 0), 0)} siswa
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">Grand Total</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {Object.values(ageFormCounts).reduce((s, v) => s + (Number(v.L) || 0) + (Number(v.P) || 0), 0)} siswa
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsAgeModalOpen(false)}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan Rekap Umur</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
