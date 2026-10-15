import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Student,
  ClassGroup,
  Teacher,
  Staff,
  TeachingHour,
  PerformancePractice,
  PerformanceBerAKHLAK,
  AdditionalTask,
  AttendanceRecord,
  SchoolProfile,
  TeacherReportCard,
  ManualAgeRecap
} from '../types';
import {
  initialSchoolProfile,
  initialClasses,
  initialTeachers,
  initialStaff,
  initialStudents,
  initialTeachingHours,
  initialPractices,
  initialBerAKHLAK,
  initialAdditionalTasks,
  initialAttendanceRecords,
  initialTeacherReportCards,
  initialManualAgeRecaps
} from '../data/initialData';
import { downloadMasterExcelArchive } from '../utils/excelUtils';

interface DuplicateAlertModalData {
  isOpen: boolean;
  title: string;
  message: string;
  duplicateNisns: { nisn: string; nama?: string; context?: string }[];
}

interface SchoolContextType {
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  // Classes & Ekskul
  classes: ClassGroup[];
  addClass: (cls: Omit<ClassGroup, 'id'>) => boolean;
  updateClass: (id: string, cls: Partial<ClassGroup>) => void;
  deleteClass: (id: string) => void;
  importClasses: (classList: any[]) => { successCount: number; errors: string[] };

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'createdAt' | 'updatedAt'>) => { success: boolean; error?: string };
  updateStudent: (nisn: string, updated: Partial<Student>) => void;
  deleteStudent: (nisn: string) => void;
  deleteStudentsBulk: (nisnList: string[]) => void;
  moveStudentClass: (nisn: string, targetKelasId: string) => void;
  moveStudentsClassBulk: (nisnList: string[], targetKelasId: string) => void;
  setStudentPIP: (nisn: string, isPIP: boolean) => void;
  setStudentsPIPBulk: (nisnList: string[], isPIP: boolean) => void;
  setStudentDO: (nisn: string, reason: string, tanggal: string) => void;
  setStudentMutasiKeluar: (nisn: string, sekolahTujuan: string, reason: string, tanggal: string, noSurat?: string) => void;
  reactivateStudent: (nisn: string, targetKelasId: string) => void;
  importStudents: (studentList: any[], isTransfer?: boolean) => { successCount: number; duplicateCount: number; errors: string[] };

  // Teachers
  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => boolean;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  toggleTeacherActive: (id: string) => void;
  importTeachers: (teacherList: any[]) => { successCount: number; errors: string[] };

  // Staff
  staff: Staff[];
  addStaff: (stf: Omit<Staff, 'id'>) => boolean;
  updateStaff: (id: string, updated: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  toggleStaffActive: (id: string) => void;
  importStaff: (staffList: any[]) => { successCount: number; errors: string[] };

  // Teaching Hours
  teachingHours: TeachingHour[];
  addTeachingHour: (hour: Omit<TeachingHour, 'id'>) => void;
  updateTeachingHour: (id: string, updated: Partial<TeachingHour>) => void;
  deleteTeachingHour: (id: string) => void;

  // Performance Practices
  practices: PerformancePractice[];
  addPractice: (practice: Omit<PerformancePractice, 'id'>) => void;
  updatePractice: (id: string, updated: Partial<PerformancePractice>) => void;
  deletePractice: (id: string) => void;
  importPractices: (list: any[]) => { successCount: number; errors: string[] };

  // Performance BerAKHLAK
  berakhlakList: PerformanceBerAKHLAK[];
  addBerAKHLAK: (record: Omit<PerformanceBerAKHLAK, 'id'>) => void;
  updateBerAKHLAK: (id: string, updated: Partial<PerformanceBerAKHLAK>) => void;
  deleteBerAKHLAK: (id: string) => void;
  importBerAKHLAK: (list: any[]) => { successCount: number; errors: string[] };

  // Additional Tasks
  additionalTasks: AdditionalTask[];
  addAdditionalTask: (task: Omit<AdditionalTask, 'id'>) => void;
  updateAdditionalTask: (id: string, updated: Partial<AdditionalTask>) => void;
  deleteAdditionalTask: (id: string) => void;
  importAdditionalTasks: (list: any[]) => { successCount: number; errors: string[] };

  // Attendance
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendanceRecord: (id: string, updated: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  importAttendanceRecords: (list: any[]) => { successCount: number; errors: string[] };

  // Teacher Report Cards (Rapot Kinerja Guru)
  teacherReportCards: TeacherReportCard[];
  addTeacherReportCard: (card: Omit<TeacherReportCard, 'id'>) => void;
  updateTeacherReportCard: (id: string, updated: Partial<TeacherReportCard>) => void;
  deleteTeacherReportCard: (id: string) => void;
  importTeacherReportCards: (list: any[]) => { successCount: number; errors: string[] };

  // Manual Age Recap
  manualAgeRecaps: ManualAgeRecap[];
  saveManualAgeRecap: (recap: Omit<ManualAgeRecap, 'id' | 'updatedAt'>) => void;
  deleteManualAgeRecap: (id: string) => void;
  importManualAgeRecaps: (list: any[]) => { successCount: number; errors: string[] };

  // Popup Modal
  duplicateAlert: DuplicateAlertModalData;
  closeDuplicateAlert: () => void;
  showDuplicateAlert: (title: string, message: string, duplicates: { nisn: string; nama?: string; context?: string }[]) => void;
  // Central Server Synchronization & Full Academic Year Archives
  syncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime: string | null;
  forceSyncNow: () => Promise<void>;
  downloadFullDatabaseJSON: () => void;
  downloadMasterExcelArchive: () => void;
  restoreDatabaseFromJSON: (file: File) => Promise<{ success: boolean; error?: string }>;

  // General App Helpers
  resetAllToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'sdn_nambo03_siakad_';

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}profile`);
    return saved ? JSON.parse(saved) : initialSchoolProfile;
  });

  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}classes`);
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}teachers`);
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}staff`);
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}students`);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachingHours, setTeachingHours] = useState<TeachingHour[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}teaching_hours`);
    return saved ? JSON.parse(saved) : initialTeachingHours;
  });

  const [practices, setPractices] = useState<PerformancePractice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}practices`);
    return saved ? JSON.parse(saved) : initialPractices;
  });

  const [berakhlakList, setBerakhlakList] = useState<PerformanceBerAKHLAK[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}berakhlak`);
    return saved ? JSON.parse(saved) : initialBerAKHLAK;
  });

  const [additionalTasks, setAdditionalTasks] = useState<AdditionalTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}tasks`);
    return saved ? JSON.parse(saved) : initialAdditionalTasks;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}attendance`);
    return saved ? JSON.parse(saved) : initialAttendanceRecords;
  });

  const [teacherReportCards, setTeacherReportCards] = useState<TeacherReportCard[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}report_cards`);
    return saved ? JSON.parse(saved) : initialTeacherReportCards;
  });

  const [manualAgeRecaps, setManualAgeRecaps] = useState<ManualAgeRecap[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}manual_age_recaps`);
    return saved ? JSON.parse(saved) : initialManualAgeRecaps;
  });

  // Duplicate NISN Alert Modal state
  const [duplicateAlert, setDuplicateAlert] = useState<DuplicateAlertModalData>({
    isOpen: false,
    title: '',
    message: '',
    duplicateNisns: []
  });

  const showDuplicateAlert = (
    title: string,
    message: string,
    duplicates: { nisn: string; nama?: string; context?: string }[]
  ) => {
    setDuplicateAlert({
      isOpen: true,
      title,
      message,
      duplicateNisns: duplicates
    });
  };

  const closeDuplicateAlert = () => {
    setDuplicateAlert(prev => ({ ...prev, isOpen: false }));
  };

  // Central Server Synchronization State
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const lastServerUpdateRef = useRef<string | null>(null);
  const isHydratedFromServerRef = useRef<boolean>(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}profile`, JSON.stringify(schoolProfile));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}classes`, JSON.stringify(classes));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}teachers`, JSON.stringify(teachers));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}staff`, JSON.stringify(staff));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}students`, JSON.stringify(students));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}teaching_hours`, JSON.stringify(teachingHours));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}practices`, JSON.stringify(practices));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}berakhlak`, JSON.stringify(berakhlakList));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}tasks`, JSON.stringify(additionalTasks));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}attendance`, JSON.stringify(attendanceRecords));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}report_cards`, JSON.stringify(teacherReportCards));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}manual_age_recaps`, JSON.stringify(manualAgeRecaps));
  }, [
    schoolProfile,
    classes,
    teachers,
    staff,
    students,
    teachingHours,
    practices,
    berakhlakList,
    additionalTasks,
    attendanceRecords,
    teacherReportCards,
    manualAgeRecaps
  ]);

  // Initial load from central server + background polling for collaborative sync
  useEffect(() => {
    let isMounted = true;

    const fetchServerData = async () => {
      try {
        setSyncStatus('syncing');
        const res = await fetch('/api/school-data');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            if (isMounted) {
              if (d.schoolProfile) setSchoolProfile(d.schoolProfile);
              if (d.classes && Array.isArray(d.classes)) setClasses(d.classes);
              if (d.teachers && Array.isArray(d.teachers)) setTeachers(d.teachers);
              if (d.staff && Array.isArray(d.staff)) setStaff(d.staff);
              if (d.students && Array.isArray(d.students)) setStudents(d.students);
              if (d.teachingHours && Array.isArray(d.teachingHours)) setTeachingHours(d.teachingHours);
              if (d.practices && Array.isArray(d.practices)) setPractices(d.practices);
              if (d.berakhlakList && Array.isArray(d.berakhlakList)) setBerakhlakList(d.berakhlakList);
              if (d.additionalTasks && Array.isArray(d.additionalTasks)) setAdditionalTasks(d.additionalTasks);
              if (d.attendanceRecords && Array.isArray(d.attendanceRecords)) setAttendanceRecords(d.attendanceRecords);
              if (d.teacherReportCards && Array.isArray(d.teacherReportCards)) setTeacherReportCards(d.teacherReportCards);
              if (d.manualAgeRecaps && Array.isArray(d.manualAgeRecaps)) setManualAgeRecaps(d.manualAgeRecaps);
              lastServerUpdateRef.current = d.serverUpdatedAt || null;
              setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
              setSyncStatus('synced');
            }
          } else {
            // Server database is empty: initialize server with initial seed data
            const payload = {
              schoolProfile,
              classes,
              teachers,
              staff,
              students,
              teachingHours,
              practices,
              berakhlakList,
              additionalTasks,
              attendanceRecords,
              teacherReportCards,
              manualAgeRecaps
            };
            await fetch('/api/school-data/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            setSyncStatus('synced');
            setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
          }
        } else {
          setSyncStatus('offline');
        }
      } catch (e) {
        console.warn('Central server sync offline, falling back to local database:', e);
        setSyncStatus('offline');
      } finally {
        isHydratedFromServerRef.current = true;
      }
    };

    fetchServerData();

    // Background sync polling every 10 seconds to merge updates from other teachers / devices
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/school-data');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.serverUpdatedAt) {
            if (json.data.serverUpdatedAt !== lastServerUpdateRef.current) {
              const d = json.data;
              if (d.schoolProfile) setSchoolProfile(d.schoolProfile);
              if (d.classes && Array.isArray(d.classes)) setClasses(d.classes);
              if (d.teachers && Array.isArray(d.teachers)) setTeachers(d.teachers);
              if (d.staff && Array.isArray(d.staff)) setStaff(d.staff);
              if (d.students && Array.isArray(d.students)) setStudents(d.students);
              if (d.teachingHours && Array.isArray(d.teachingHours)) setTeachingHours(d.teachingHours);
              if (d.practices && Array.isArray(d.practices)) setPractices(d.practices);
              if (d.berakhlakList && Array.isArray(d.berakhlakList)) setBerakhlakList(d.berakhlakList);
              if (d.additionalTasks && Array.isArray(d.additionalTasks)) setAdditionalTasks(d.additionalTasks);
              if (d.attendanceRecords && Array.isArray(d.attendanceRecords)) setAttendanceRecords(d.attendanceRecords);
              if (d.teacherReportCards && Array.isArray(d.teacherReportCards)) setTeacherReportCards(d.teacherReportCards);
              if (d.manualAgeRecaps && Array.isArray(d.manualAgeRecaps)) setManualAgeRecaps(d.manualAgeRecaps);
              lastServerUpdateRef.current = d.serverUpdatedAt;
              setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
              setSyncStatus('synced');
            }
          }
        }
      } catch {
        // silent polling error
      }
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Continuous auto-save to central server (debounced by 800ms)
  useEffect(() => {
    if (!isHydratedFromServerRef.current) return;

    const timer = setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        const payload = {
          schoolProfile,
          classes,
          teachers,
          staff,
          students,
          teachingHours,
          practices,
          berakhlakList,
          additionalTasks,
          attendanceRecords,
          teacherReportCards,
          manualAgeRecaps
        };
        const res = await fetch('/api/school-data/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          lastServerUpdateRef.current = json.serverUpdatedAt;
          setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
          setSyncStatus('synced');
        } else {
          setSyncStatus('error');
        }
      } catch {
        setSyncStatus('offline');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    schoolProfile,
    classes,
    teachers,
    staff,
    students,
    teachingHours,
    practices,
    berakhlakList,
    additionalTasks,
    attendanceRecords,
    teacherReportCards,
    manualAgeRecaps
  ]);

  const forceSyncNow = async () => {
    try {
      setSyncStatus('syncing');
      const payload = {
        schoolProfile,
        classes,
        teachers,
        staff,
        students,
        teachingHours,
        practices,
        berakhlakList,
        additionalTasks,
        attendanceRecords,
        teacherReportCards,
        manualAgeRecaps
      };
      const res = await fetch('/api/school-data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        lastServerUpdateRef.current = json.serverUpdatedAt;
        setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch {
      setSyncStatus('offline');
    }
  };

  const downloadFullDatabaseJSON = () => {
    const payload = {
      schoolProfile,
      classes,
      teachers,
      staff,
      students,
      teachingHours,
      practices,
      berakhlakList,
      additionalTasks,
      attendanceRecords,
      teacherReportCards,
      manualAgeRecaps,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Database_SIAKAD_SDN_Nambo_03_TA_2026_2027.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMasterExcel = () => {
    downloadMasterExcelArchive({
      schoolProfile,
      classes,
      students,
      teachers,
      staff,
      teachingHours,
      attendanceRecords,
      teacherReportCards,
      manualAgeRecaps
    });
  };

  const restoreDatabaseFromJSON = async (file: File): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
          if (parsed.classes && Array.isArray(parsed.classes)) setClasses(parsed.classes);
          if (parsed.teachers && Array.isArray(parsed.teachers)) setTeachers(parsed.teachers);
          if (parsed.staff && Array.isArray(parsed.staff)) setStaff(parsed.staff);
          if (parsed.students && Array.isArray(parsed.students)) setStudents(parsed.students);
          if (parsed.teachingHours && Array.isArray(parsed.teachingHours)) setTeachingHours(parsed.teachingHours);
          if (parsed.practices && Array.isArray(parsed.practices)) setPractices(parsed.practices);
          if (parsed.berakhlakList && Array.isArray(parsed.berakhlakList)) setBerakhlakList(parsed.berakhlakList);
          if (parsed.additionalTasks && Array.isArray(parsed.additionalTasks)) setAdditionalTasks(parsed.additionalTasks);
          if (parsed.attendanceRecords && Array.isArray(parsed.attendanceRecords)) setAttendanceRecords(parsed.attendanceRecords);
          if (parsed.teacherReportCards && Array.isArray(parsed.teacherReportCards)) setTeacherReportCards(parsed.teacherReportCards);
          if (parsed.manualAgeRecaps && Array.isArray(parsed.manualAgeRecaps)) setManualAgeRecaps(parsed.manualAgeRecaps);

          // Sync to server immediately
          await fetch('/api/school-data/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parsed)
          });

          setLastSyncTime(new Date().toLocaleTimeString('id-ID'));
          setSyncStatus('synced');
          resolve({ success: true });
        } catch (err: any) {
          resolve({ success: false, error: err.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Gagal membaca file backup' });
      reader.readAsText(file);
    });
  };

  const updateSchoolProfile = (updated: Partial<SchoolProfile>) => {
    setSchoolProfile(prev => ({ ...prev, ...updated }));
  };

  // =====================
  // CLASSES & EKSKUL
  // =====================
  const addClass = (cls: Omit<ClassGroup, 'id'>): boolean => {
    const newId = `c-${Date.now()}`;
    const newGroup: ClassGroup = { id: newId, ...cls };
    setClasses(prev => [...prev, newGroup]);
    return true;
  };

  const updateClass = (id: string, updated: Partial<ClassGroup>) => {
    setClasses(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const importClasses = (classList: any[]) => {
    let successCount = 0;
    const errors: string[] = [];

    classList.forEach((row, idx) => {
      const nama = row['Nama'] || row['Nama Kelas'] || row['nama'];
      const jenisRaw = (row['Jenis'] || row['jenis'] || 'Utama').toLowerCase();
      const jenis: 'Utama' | 'Ekskul' = jenisRaw.includes('ekskul') ? 'Ekskul' : 'Utama';
      const kapasitas = Number(row['Kapasitas'] || row['kapasitas']) || 32;
      const deskripsi = row['Deskripsi'] || row['deskripsi'] || '';

      if (!nama) {
        errors.push(`Baris ${idx + 1}: Nama kelas atau ekskul tidak boleh kosong.`);
        return;
      }

      const newId = `c-imp-${Date.now()}-${idx}`;
      setClasses(prev => [...prev, { id: newId, nama, jenis, kapasitas, deskripsi }]);
      successCount++;
    });

    return { successCount, errors };
  };

  // =====================
  // STUDENTS (STRICT NISN CHECK)
  // =====================
  const addStudent = (studentData: Omit<Student, 'createdAt' | 'updatedAt'>) => {
    const cleanNisn = String(studentData.nisn).trim();

    // Check if NISN already exists
    const existing = students.find(s => s.nisn.trim() === cleanNisn);
    if (existing) {
      showDuplicateAlert(
        'Peringatan: NISN Sudah Terdaftar!',
        `Data siswa dengan NISN "${cleanNisn}" sudah ada dalam database sekolah atas nama "${existing.nama}" (${classes.find(c => c.id === existing.kelasId)?.nama || 'Kelas Lain'}). Sistem tidak mengizinkan NISN ganda karena NISN adalah identitas tunggal nasional siswa.`,
        [{ nisn: cleanNisn, nama: existing.nama, context: `Sudah terdaftar di ${classes.find(c => c.id === existing.kelasId)?.nama || 'Kelas'}` }]
      );
      return {
        success: false,
        error: `NISN ${cleanNisn} sudah digunakan oleh ${existing.nama}`
      };
    }

    const now = new Date().toISOString();
    const newStudent: Student = {
      ...studentData,
      nisn: cleanNisn,
      createdAt: now,
      updatedAt: now
    };

    setStudents(prev => [newStudent, ...prev]);
    return { success: true };
  };

  const updateStudent = (nisn: string, updated: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.nisn === nisn) {
          return { ...s, ...updated, updatedAt: new Date().toISOString() };
        }
        return s;
      })
    );
  };

  const deleteStudent = (nisn: string) => {
    setStudents(prev => prev.filter(s => s.nisn !== nisn));
  };

  const deleteStudentsBulk = (nisnList: string[]) => {
    const set = new Set(nisnList);
    setStudents(prev => prev.filter(s => !set.has(s.nisn)));
  };

  const moveStudentClass = (nisn: string, targetKelasId: string) => {
    updateStudent(nisn, { kelasId: targetKelasId });
  };

  const moveStudentsClassBulk = (nisnList: string[], targetKelasId: string) => {
    const set = new Set(nisnList);
    setStudents(prev =>
      prev.map(s => (set.has(s.nisn) ? { ...s, kelasId: targetKelasId, updatedAt: new Date().toISOString() } : s))
    );
  };

  const setStudentPIP = (nisn: string, isPIP: boolean) => {
    updateStudent(nisn, { isPIP });
  };

  const setStudentsPIPBulk = (nisnList: string[], isPIP: boolean) => {
    const set = new Set(nisnList);
    setStudents(prev =>
      prev.map(s => (set.has(s.nisn) ? { ...s, isPIP, updatedAt: new Date().toISOString() } : s))
    );
  };

  const setStudentDO = (nisn: string, reason: string, tanggal: string) => {
    updateStudent(nisn, {
      status: 'Berhenti DO',
      exitInfo: {
        tanggalKeluar: tanggal,
        alasan: reason,
        nomorSurat: `421.2/DO-${Date.now().toString().slice(-4)}/SDN-N03`
      }
    });
  };

  const setStudentMutasiKeluar = (
    nisn: string,
    sekolahTujuan: string,
    reason: string,
    tanggal: string,
    noSurat?: string
  ) => {
    updateStudent(nisn, {
      status: 'Mutasi Keluar',
      exitInfo: {
        sekolahTujuan,
        tanggalKeluar: tanggal,
        alasan: reason,
        nomorSurat: noSurat || `421.2/MUT-${Date.now().toString().slice(-4)}/SDN-N03`
      }
    });
  };

  const reactivateStudent = (nisn: string, targetKelasId: string) => {
    updateStudent(nisn, {
      status: 'Aktif',
      kelasId: targetKelasId
    });
  };

  const importStudents = (studentList: any[], isTransfer: boolean = false) => {
    let successCount = 0;
    const errors: string[] = [];
    const duplicates: { nisn: string; nama?: string; context?: string }[] = [];
    const existingNisns = new Map<string, Student>();
    students.forEach(s => existingNisns.set(s.nisn.trim(), s));

    const newStudentsToAdd: Student[] = [];
    const now = new Date().toISOString();

    studentList.forEach((row, idx) => {
      const nisnRaw = String(row['NISN'] || row['nisn'] || '').trim();
      const nama = String(row['Nama Lengkap'] || row['Nama'] || row['nama'] || '').trim();

      if (!nisnRaw) {
        errors.push(`Baris ${idx + 1}: Kolom NISN kosong.`);
        return;
      }

      if (!nama) {
        errors.push(`Baris ${idx + 1}: Nama siswa kosong.`);
        return;
      }

      // Check if already in DB
      if (existingNisns.has(nisnRaw)) {
        const existingStudent = existingNisns.get(nisnRaw)!;
        duplicates.push({
          nisn: nisnRaw,
          nama,
          context: `Sama dengan data database: ${existingStudent.nama} (${existingStudent.nisn})`
        });
        return;
      }

      // Check if duplicate within this import file itself
      if (newStudentsToAdd.some(s => s.nisn === nisnRaw)) {
        duplicates.push({
          nisn: nisnRaw,
          nama,
          context: `Duplikat berulang di dalam file Excel yang diunggah (baris ${idx + 1})`
        });
        return;
      }

      // Find matching class
      const targetClassName = String(row['Nama Kelas'] || row['Kelas Tujuan'] || row['Kelas'] || '').trim();
      let matchedClass = classes.find(c => c.nama.toLowerCase() === targetClassName.toLowerCase());
      if (!matchedClass) {
        // Fallback to first available main class
        matchedClass = classes.find(c => c.jenis === 'Utama') || classes[0];
      }

      const jkRaw = String(row['Jenis Kelamin (L/P)'] || row['Jenis Kelamin'] || 'L').toUpperCase().trim();
      const jenisKelamin: 'L' | 'P' = jkRaw.startsWith('P') ? 'P' : 'L';

      const agamaRaw = String(row['Agama'] || 'Islam').trim();
      const validAgama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].includes(agamaRaw)
        ? (agamaRaw as any)
        : 'Islam';

      const student: Student = {
        nisn: nisnRaw,
        nis: String(row['NIS'] || row['nis'] || `${Math.floor(1000 + Math.random() * 9000)}`),
        nama,
        tempatLahir: String(row['Tempat Lahir'] || 'Bogor'),
        tanggalLahir: String(row['Tanggal Lahir (YYYY-MM-DD)'] || row['Tanggal Lahir'] || '2018-01-01'),
        agama: validAgama,
        jenisKelamin,
        nik: String(row['NIK'] || '3201240000000000'),
        alamat: String(row['Alamat'] || 'Bantarjati Klapanunggal Bogor'),
        tinggiBadan: row['Tinggi Badan (cm)'] ? Number(row['Tinggi Badan (cm)']) : undefined,
        beratBadan: row['Berat Badan (kg)'] ? Number(row['Berat Badan (kg)']) : undefined,
        kelasId: matchedClass.id,
        status: isTransfer ? 'Pindahan Masuk' : 'Aktif',
        isPIP: false,
        ekskulIds: ['e-pramuka'],
        createdAt: now,
        updatedAt: now
      };

      if (isTransfer) {
        student.transferInfo = {
          asalSekolah: String(row['Asal Sekolah'] || 'Sekolah Asal'),
          tanggalPindah: String(row['Tanggal Pindah (YYYY-MM-DD)'] || '2026-08-01'),
          nomorSurat: String(row['Nomor Surat Pindah'] || `421.2/PND-${Date.now().toString().slice(-4)}`),
          alasan: String(row['Alasan Pindah'] || 'Pindah domisili keluarga'),
          kelasTujuanId: matchedClass.id
        };
      }

      newStudentsToAdd.push(student);
      successCount++;
    });

    if (duplicates.length > 0) {
      showDuplicateAlert(
        'Pemberitahuan: Terdeteksi NISN Ganda pada Berkas Import!',
        `Ditemukan ${duplicates.length} data dengan NISN yang sudah terdaftar atau duplikat dalam file. Data dengan NISN duplikat telah dilewati untuk menjaga keaslian data siswa. Sebanyak ${successCount} siswa baru berhasil diimport.`,
        duplicates
      );
    }

    if (newStudentsToAdd.length > 0) {
      setStudents(prev => [...newStudentsToAdd, ...prev]);
    }

    return {
      successCount,
      duplicateCount: duplicates.length,
      errors
    };
  };

  // =====================
  // TEACHERS
  // =====================
  const addTeacher = (tData: Omit<Teacher, 'id'>) => {
    const id = `t-${Date.now()}`;
    setTeachers(prev => [{ id, ...tData }, ...prev]);
    return true;
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    // Clear references from classes
    setClasses(prev =>
      prev.map(c => {
        if (c.waliKelasId === id) return { ...c, waliKelasId: undefined };
        if (c.pembinaId === id) return { ...c, pembinaId: undefined };
        return c;
      })
    );
  };

  const toggleTeacherActive = (id: string) => {
    setTeachers(prev => prev.map(t => (t.id === id ? { ...t, statusAktif: !t.statusAktif } : t)));
  };

  const importTeachers = (teacherList: any[]) => {
    let successCount = 0;
    const errors: string[] = [];

    const newTeachers: Teacher[] = [];
    teacherList.forEach((row, idx) => {
      const nama = String(row['Nama Lengkap'] || row['Nama'] || '').trim();
      if (!nama) {
        errors.push(`Baris ${idx + 1}: Nama guru kosong.`);
        return;
      }

      const jk = String(row['Jenis Kelamin (L/P)'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L';
      const statusRaw = String(row['Status Kepegawaian'] || 'PNS');
      const statusKepegawaian = statusRaw.includes('PPPK')
        ? 'PPPK'
        : statusRaw.includes('Honorer') || statusRaw.includes('GTT')
        ? 'Honorer / GTT'
        : 'PNS';

      newTeachers.push({
        id: `t-imp-${Date.now()}-${idx}`,
        nip: String(row['NIP'] || '-'),
        nuptk: String(row['NUPTK'] || ''),
        nama,
        gelar: String(row['Gelar'] || 'S.Pd.'),
        jabatan: String(row['Jabatan'] || 'Guru Kelas'),
        jenisKelamin: jk,
        statusKepegawaian,
        golongan: String(row['Golongan'] || '-'),
        noHp: String(row['Nomor HP'] || '081200000000'),
        email: String(row['Email'] || `${nama.toLowerCase().replace(/[^a-z]/g, '')}@sdnnambo03.sch.id`),
        statusAktif: true
      });
      successCount++;
    });

    if (newTeachers.length > 0) {
      setTeachers(prev => [...prev, ...newTeachers]);
    }
    return { successCount, errors };
  };

  // =====================
  // STAFF (TU & TENDIK)
  // =====================
  const addStaff = (sData: Omit<Staff, 'id'>) => {
    const id = `s-${Date.now()}`;
    setStaff(prev => [{ id, ...sData }, ...prev]);
    return true;
  };

  const updateStaff = (id: string, updated: Partial<Staff>) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, ...updated } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  const toggleStaffActive = (id: string) => {
    setStaff(prev => prev.map(s => (s.id === id ? { ...s, statusAktif: !s.statusAktif } : s)));
  };

  const importStaff = (staffList: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newStaff: Staff[] = [];

    staffList.forEach((row, idx) => {
      const nama = String(row['Nama Lengkap'] || row['Nama'] || '').trim();
      if (!nama) {
        errors.push(`Baris ${idx + 1}: Nama staf kosong.`);
        return;
      }

      const statusRaw = String(row['Status Kepegawaian'] || 'Honorer / PTT');
      const statusKepegawaian = statusRaw.includes('PNS')
        ? 'PNS'
        : statusRaw.includes('PPPK')
        ? 'PPPK'
        : 'Honorer / PTT';

      newStaff.push({
        id: `s-imp-${Date.now()}-${idx}`,
        nik: String(row['NIK'] || `320124${Math.floor(1000000000 + Math.random() * 9000000000)}`),
        nip: String(row['NIP'] || '-'),
        nama,
        tugas: String(row['Tugas'] || row['Jabatan'] || 'Staf Tata Usaha'),
        statusKepegawaian,
        pendidikan: String(row['Pendidikan'] || 'SMA/SMK'),
        noHp: String(row['Nomor HP'] || '081200000000'),
        statusAktif: true
      });
      successCount++;
    });

    if (newStaff.length > 0) {
      setStaff(prev => [...prev, ...newStaff]);
    }
    return { successCount, errors };
  };

  // =====================
  // TEACHING HOURS
  // =====================
  const addTeachingHour = (hour: Omit<TeachingHour, 'id'>) => {
    const id = `th-${Date.now()}`;
    setTeachingHours(prev => [...prev, { id, ...hour }]);
  };

  const updateTeachingHour = (id: string, updated: Partial<TeachingHour>) => {
    setTeachingHours(prev => prev.map(h => (h.id === id ? { ...h, ...updated } : h)));
  };

  const deleteTeachingHour = (id: string) => {
    setTeachingHours(prev => prev.filter(h => h.id !== id));
  };

  // =====================
  // PERFORMANCE: PRAKTIK
  // =====================
  const addPractice = (practice: Omit<PerformancePractice, 'id'>) => {
    const id = `pp-${Date.now()}`;
    const skor = practice.statusObservasi === 'Sudah' ? 100 : practice.skor || 0;
    setPractices(prev => [{ id, ...practice, skor }, ...prev]);
  };

  const updatePractice = (id: string, updated: Partial<PerformancePractice>) => {
    setPractices(prev =>
      prev.map(p => {
        if (p.id === id) {
          const status = updated.statusObservasi || p.statusObservasi;
          const skor = status === 'Sudah' ? 100 : (updated.skor !== undefined ? updated.skor : p.skor);
          return { ...p, ...updated, skor };
        }
        return p;
      })
    );
  };

  const deletePractice = (id: string) => {
    setPractices(prev => prev.filter(p => p.id !== id));
  };

  const importPractices = (list: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newItems: PerformancePractice[] = [];

    list.forEach((row, idx) => {
      const guruName = String(row['Nama Guru'] || '').trim();
      const matchingTeacher = teachers.find(
        t => t.nama.toLowerCase().includes(guruName.toLowerCase()) || guruName.toLowerCase().includes(t.nama.toLowerCase())
      ) || teachers[0];

      if (!matchingTeacher) {
        errors.push(`Baris ${idx + 1}: Guru tidak ditemukan.`);
        return;
      }

      const statusObs = String(row['Status Observasi (Sudah/Belum)'] || '').toLowerCase().includes('sudah') ? 'Sudah' : 'Belum';
      const skor = statusObs === 'Sudah' ? 100 : 0;

      newItems.push({
        id: `pp-imp-${Date.now()}-${idx}`,
        guruId: matchingTeacher.id,
        indikator: String(row['Indikator'] || 'Penerapan Disiplin Positif'),
        catatanGuru: String(row['Catatan Refleksi Guru'] || ''),
        statusObservasi: statusObs,
        skor,
        tanggalObservasi: String(row['Tanggal Observasi (YYYY-MM-DD)'] || ''),
        catatanKepsek: String(row['Catatan Kepala Sekolah'] || ''),
        periode: 'Semester Ganjil 2026/2027'
      });
      successCount++;
    });

    if (newItems.length > 0) {
      setPractices(prev => [...newItems, ...prev]);
    }
    return { successCount, errors };
  };

  // =====================
  // PERFORMANCE: BERAKHLAK
  // =====================
  const addBerAKHLAK = (record: Omit<PerformanceBerAKHLAK, 'id'>) => {
    const id = `ba-${Date.now()}`;
    setBerakhlakList(prev => [{ id, ...record }, ...prev]);
  };

  const updateBerAKHLAK = (id: string, updated: Partial<PerformanceBerAKHLAK>) => {
    setBerakhlakList(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
  };

  const deleteBerAKHLAK = (id: string) => {
    setBerakhlakList(prev => prev.filter(b => b.id !== id));
  };

  const importBerAKHLAK = (list: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newItems: PerformanceBerAKHLAK[] = [];

    list.forEach((row, idx) => {
      const guruName = String(row['Nama Guru'] || '').trim();
      const matchingTeacher = teachers.find(
        t => t.nama.toLowerCase().includes(guruName.toLowerCase()) || guruName.toLowerCase().includes(t.nama.toLowerCase())
      ) || teachers[0];

      if (!matchingTeacher) {
        errors.push(`Baris ${idx + 1}: Guru tidak ditemukan.`);
        return;
      }

      const evalRaw = String(row['Evaluasi'] || 'Memenuhi Ekspektasi');
      const statusEvaluasi = evalRaw.includes('Diatas') || evalRaw.includes('Di Atas')
        ? 'Di Atas Ekspektasi'
        : evalRaw.includes('Perlu')
        ? 'Perlu Perbaikan'
        : 'Memenuhi Ekspektasi';

      newItems.push({
        id: `ba-imp-${Date.now()}-${idx}`,
        guruId: matchingTeacher.id,
        berorientasiPelayanan: String(row['Berorientasi Pelayanan'] || 'Memberikan pelayanan terbaik.'),
        akuntabel: String(row['Akuntabel'] || 'Tepat waktu dan bertanggung jawab.'),
        kompeten: String(row['Kompeten'] || 'Terus belajar meningkatkan ilmu.'),
        harmonis: String(row['Harmonis'] || 'Menghargai keragaman warga sekolah.'),
        loyal: String(row['Loyal'] || 'Menjaga integritas instansi.'),
        adaptif: String(row['Adaptif'] || 'Inovatif terhadap media pembelajaran.'),
        kolaboratif: String(row['Kolaboratif'] || 'Bekerja sama secara aktif.'),
        catatan: 'Import otomatis dari berkas excel',
        tanggal: '2026-10-15',
        statusEvaluasi
      });
      successCount++;
    });

    if (newItems.length > 0) {
      setBerakhlakList(prev => [...newItems, ...prev]);
    }
    return { successCount, errors };
  };

  // =====================
  // PERFORMANCE: TUGAS TAMBAHAN
  // =====================
  const addAdditionalTask = (task: Omit<AdditionalTask, 'id'>) => {
    const id = `at-${Date.now()}`;
    setAdditionalTasks(prev => [{ id, ...task }, ...prev]);
  };

  const updateAdditionalTask = (id: string, updated: Partial<AdditionalTask>) => {
    setAdditionalTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteAdditionalTask = (id: string) => {
    setAdditionalTasks(prev => prev.filter(t => t.id !== id));
  };

  const importAdditionalTasks = (list: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newItems: AdditionalTask[] = [];

    list.forEach((row, idx) => {
      const guruName = String(row['Nama Guru'] || '').trim();
      const matchingTeacher = teachers.find(
        t => t.nama.toLowerCase().includes(guruName.toLowerCase()) || guruName.toLowerCase().includes(t.nama.toLowerCase())
      ) || teachers[0];

      if (!matchingTeacher) {
        errors.push(`Baris ${idx + 1}: Guru tidak ditemukan.`);
        return;
      }

      const statusRaw = String(row['Status'] || 'Selesai');
      const status: 'Selesai' | 'Dalam Proses' | 'Belum' = statusRaw.includes('Proses')
        ? 'Dalam Proses'
        : statusRaw.includes('Belum')
        ? 'Belum'
        : 'Selesai';

      newItems.push({
        id: `at-imp-${Date.now()}-${idx}`,
        guruId: matchingTeacher.id,
        namaTugas: String(row['Nama Tugas Tambahan'] || 'Wali Kelas'),
        refleksi: String(row['Refleksi Pelaksanaan'] || 'Tugas telah terlaksana.'),
        buktiDukung: String(row['Bukti Dukung'] || 'SK Pembagian Tugas TA 2026/2027'),
        status,
        tanggal: '2026-10-15'
      });
      successCount++;
    });

    if (newItems.length > 0) {
      setAdditionalTasks(prev => [...newItems, ...prev]);
    }
    return { successCount, errors };
  };

  // =====================
  // ATTENDANCE
  // =====================
  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const id = `att-${Date.now()}`;
    setAttendanceRecords(prev => [
      { id, ...record },
      ...prev.filter(r => !(r.tanggal === record.tanggal && r.kelasId === record.kelasId))
    ]);
  };

  const updateAttendanceRecord = (id: string, updated: Partial<AttendanceRecord>) => {
    setAttendanceRecords(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)));
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords(prev => prev.filter(r => r.id !== id));
  };

  const importAttendanceRecords = (list: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newRecords: AttendanceRecord[] = [];

    list.forEach((row, idx) => {
      const tanggal = String(row['Tanggal (YYYY-MM-DD)'] || row['Tanggal'] || '2026-10-15').trim();
      const namaKelas = String(row['Nama Kelas'] || row['Kelas'] || '').trim();

      const matchedClass = classes.find(c => c.nama.toLowerCase() === namaKelas.toLowerCase()) || classes[0];
      const hadir = Number(row['Hadir']) || 0;
      const sakit = Number(row['Sakit']) || 0;
      const izin = Number(row['Izin']) || 0;
      const alpa = Number(row['Alpa']) || 0;
      const totalSiswa = Number(row['Total Siswa']) || (hadir + sakit + izin + alpa) || 32;
      const catatan = String(row['Catatan'] || '');
      const bulan = tanggal.substring(0, 7);

      newRecords.push({
        id: `att-imp-${Date.now()}-${idx}`,
        tanggal,
        bulan,
        kelasId: matchedClass.id,
        hadir,
        sakit,
        izin,
        alpa,
        totalSiswa,
        catatan
      });
      successCount++;
    });

    if (newRecords.length > 0) {
      setAttendanceRecords(prev => [...newRecords, ...prev]);
    }
    return { successCount, errors };
  };

  // =====================
  // TEACHER REPORT CARDS
  // =====================
  const addTeacherReportCard = (card: Omit<TeacherReportCard, 'id'>) => {
    const id = `rc-${Date.now()}`;
    setTeacherReportCards(prev => [
      { id, ...card },
      ...prev.filter(r => !(r.guruId === card.guruId && r.tahunAjaran === card.tahunAjaran && r.semester === card.semester))
    ]);
  };

  const updateTeacherReportCard = (id: string, updated: Partial<TeacherReportCard>) => {
    setTeacherReportCards(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)));
  };

  const deleteTeacherReportCard = (id: string) => {
    setTeacherReportCards(prev => prev.filter(r => r.id !== id));
  };

  const importTeacherReportCards = (list: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newCards: TeacherReportCard[] = [];

    list.forEach((row, idx) => {
      const guruName = String(row['Nama Guru'] || row['Nama'] || '').trim();
      const matchedTeacher = teachers.find(
        t => t.nama.toLowerCase().includes(guruName.toLowerCase()) || guruName.toLowerCase().includes(t.nama.toLowerCase())
      ) || teachers[0];

      if (!matchedTeacher) {
        errors.push(`Baris ${idx + 1}: Guru tidak ditemukan.`);
        return;
      }

      const tahunAjaran = String(row['Tahun Ajaran'] || '2026-2027').trim();
      const semRaw = String(row['Semester'] || 'Ganjil').trim();
      const semester: 'Ganjil' | 'Genap' | 'Tahunan' = semRaw.includes('Genap')
        ? 'Genap'
        : semRaw.includes('Tahun')
        ? 'Tahunan'
        : 'Ganjil';

      const predRaw = String(row['Predikat Kinerja'] || 'Baik (Memenuhi Ekspektasi)').trim();
      const predikatKinerja: any = predRaw.includes('Sangat')
        ? 'Sangat Baik (Di Atas Ekspektasi)'
        : predRaw.includes('Butuh') || predRaw.includes('Perbaikan')
        ? 'Butuh Perbaikan'
        : predRaw.includes('Kurang')
        ? 'Kurang'
        : 'Baik (Memenuhi Ekspektasi)';

      const nilaiSkorAkhir = Number(row['Nilai Skor Akhir']) || (predikatKinerja.startsWith('Sangat') ? 95 : 90);
      const catatanKepsek = String(row['Catatan Kepala Sekolah'] || 'Kinerja sangat baik dan akuntabel.');
      const rekomendasiKepsek = String(row['Rekomendasi Kepala Sekolah'] || 'Terus pertahankan dedikasi dalam KBM.');
      const tanggalPenetapan = String(row['Tanggal Penetapan'] || '2026-12-15');

      newCards.push({
        id: `rc-imp-${Date.now()}-${idx}`,
        guruId: matchedTeacher.id,
        tahunAjaran,
        semester,
        predikatKinerja,
        nilaiSkorAkhir,
        catatanKepsek,
        rekomendasiKepsek,
        tanggalPenetapan,
        status: 'Disetujui Kepala Sekolah'
      });
      successCount++;
    });

    if (newCards.length > 0) {
      setTeacherReportCards(prev => [...newCards, ...prev]);
    }
    return { successCount, errors };
  };

  // =====================
  // MANUAL AGE RECAP
  // =====================
  const saveManualAgeRecap = (recap: Omit<ManualAgeRecap, 'id' | 'updatedAt'>) => {
    const id = `ar-${recap.bulan}-${recap.kelasId}`;
    const now = new Date().toISOString();
    setManualAgeRecaps(prev => [
      { id, ...recap, updatedAt: now },
      ...prev.filter(r => !(r.bulan === recap.bulan && r.kelasId === recap.kelasId))
    ]);
  };

  const deleteManualAgeRecap = (id: string) => {
    setManualAgeRecaps(prev => prev.filter(r => r.id !== id));
  };

  const importManualAgeRecaps = (list: any[]) => {
    let successCount = 0;
    const errors: string[] = [];
    const newRecaps: ManualAgeRecap[] = [];
    const now = new Date().toISOString();

    list.forEach((row, idx) => {
      const bulan = String(row['Bulan (YYYY-MM)'] || row['Bulan'] || '2026-10').trim();
      const namaKelas = String(row['Nama Kelas'] || row['Kelas'] || '').trim();
      const matchedClass = classes.find(c => c.nama.toLowerCase() === namaKelas.toLowerCase()) || classes[0];

      newRecaps.push({
        id: `ar-imp-${Date.now()}-${idx}`,
        bulan,
        kelasId: matchedClass.id,
        lessThan6L: Number(row['<6 Th L']) || 0,
        lessThan6P: Number(row['<6 Th P']) || 0,
        age6L: Number(row['6 Th L']) || 0,
        age6P: Number(row['6 Th P']) || 0,
        age7L: Number(row['7 Th L']) || 0,
        age7P: Number(row['7 Th P']) || 0,
        age8L: Number(row['8 Th L']) || 0,
        age8P: Number(row['8 Th P']) || 0,
        age9L: Number(row['9 Th L']) || 0,
        age9P: Number(row['9 Th P']) || 0,
        age10L: Number(row['10 Th L']) || 0,
        age10P: Number(row['10 Th P']) || 0,
        age11L: Number(row['11 Th L']) || 0,
        age11P: Number(row['11 Th P']) || 0,
        age12L: Number(row['12 Th L']) || 0,
        age12P: Number(row['12 Th P']) || 0,
        moreThan12L: Number(row['>12 Th L']) || 0,
        moreThan12P: Number(row['>12 Th P']) || 0,
        updatedAt: now
      });
      successCount++;
    });

    if (newRecaps.length > 0) {
      setManualAgeRecaps(prev => [...newRecaps, ...prev]);
    }
    return { successCount, errors };
  };

  // =====================
  // RESET DEFAULTS
  // =====================
  const resetAllToDefaults = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke data default bawaan SD Negeri Nambo 03? Semua perubahan akan dikembalikan ke data awal.')) {
      setSchoolProfile(initialSchoolProfile);
      setClasses(initialClasses);
      setTeachers(initialTeachers);
      setStaff(initialStaff);
      setStudents(initialStudents);
      setTeachingHours(initialTeachingHours);
      setPractices(initialPractices);
      setBerakhlakList(initialBerAKHLAK);
      setAdditionalTasks(initialAdditionalTasks);
      setAttendanceRecords(initialAttendanceRecords);
      setTeacherReportCards(initialTeacherReportCards);
      setManualAgeRecaps(initialManualAgeRecaps);
      localStorage.clear();
      fetch('/api/school-data/reset', { method: 'POST' }).catch(() => {});
      alert('Data berhasil direset ke pengaturan awal SD Negeri Nambo 03.');
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolProfile,
        updateSchoolProfile,
        classes,
        addClass,
        updateClass,
        deleteClass,
        importClasses,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        deleteStudentsBulk,
        moveStudentClass,
        moveStudentsClassBulk,
        setStudentPIP,
        setStudentsPIPBulk,
        setStudentDO,
        setStudentMutasiKeluar,
        reactivateStudent,
        importStudents,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        toggleTeacherActive,
        importTeachers,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffActive,
        importStaff,
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
        attendanceRecords,
        addAttendanceRecord,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        importAttendanceRecords,
        teacherReportCards,
        addTeacherReportCard,
        updateTeacherReportCard,
        deleteTeacherReportCard,
        importTeacherReportCards,
        manualAgeRecaps,
        saveManualAgeRecap,
        deleteManualAgeRecap,
        importManualAgeRecaps,
        duplicateAlert,
        closeDuplicateAlert,
        showDuplicateAlert,
        resetAllToDefaults,
        syncStatus,
        lastSyncTime,
        forceSyncNow,
        downloadFullDatabaseJSON,
        downloadMasterExcelArchive: handleDownloadMasterExcel,
        restoreDatabaseFromJSON
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
