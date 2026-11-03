import * as XLSX from 'xlsx';
import {
  DeepLearningModule,
  SchoolProfile,
  ProtaRecord,
  PromesRecord,
  LearningObjectiveTP,
  ProtaItem
} from '../types';

/**
 * Downloads a Deep Learning Lesson Plan (Modul Ajar) as an official Microsoft Word (.doc) document
 * with Kop Surat, school emblem logo, 4 Building Blocks, 8 DPL, Rubrics, Teaching Materials, and LKPD.
 */
export async function downloadModulAjarWord(modul: DeepLearningModule, schoolProfile: SchoolProfile) {
  let logoNamboDataUrl = schoolProfile.logoUrl || '/logo_nambo_03.jpg';
  let logoBogorDataUrl = '/logo_kab_bogor.png';

  const toBase64 = async (url: string): Promise<string> => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(url);
        reader.readAsDataURL(blob);
      });
    } catch {
      return url;
    }
  };

  try {
    const [namboBase64, bogorBase64] = await Promise.all([
      toBase64(logoNamboDataUrl),
      toBase64(logoBogorDataUrl)
    ]);
    logoNamboDataUrl = namboBase64;
    logoBogorDataUrl = bogorBase64;
  } catch (err) {
    console.warn('Could not encode logos as base64 for Word export:', err);
  }

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Modul Ajar Deep Learning - ${modul.kodeModul}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4 portrait;
      margin: 2cm 2cm 2cm 2cm;
      mso-page-orientation: portrait;
    }
    body {
      font-family: 'Calibri', 'Times New Roman', sans-serif;
      font-size: 11pt;
      line-height: 1.35;
      color: #111827;
    }
    table.kop {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 3px double #000000;
      margin-bottom: 18px;
    }
    table.kop td {
      vertical-align: middle;
      padding: 4px;
    }
    .kop-text {
      text-align: center;
    }
    .kop-text h4 {
      margin: 0;
      font-size: 11pt;
      font-weight: bold;
      letter-spacing: 0.5px;
    }
    .kop-text h2 {
      margin: 2px 0;
      font-size: 15pt;
      font-weight: 900;
      color: #064E3B;
    }
    .kop-text h3 {
      margin: 0;
      font-size: 13pt;
      font-weight: 800;
      color: #047857;
    }
    .kop-text p {
      margin: 2px 0 0 0;
      font-size: 9pt;
      color: #4B5563;
    }
    .doc-title {
      text-align: center;
      margin: 14px 0;
    }
    .doc-title h3 {
      margin: 0;
      font-size: 13pt;
      font-weight: 900;
      text-decoration: underline;
      text-transform: uppercase;
    }
    .doc-title p {
      margin: 2px 0 0 0;
      font-size: 10pt;
      font-weight: bold;
      color: #047857;
    }
    table.info {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 14px;
    }
    table.info td {
      padding: 3px 6px;
      font-size: 10.5pt;
      vertical-align: top;
    }
    .section-title {
      background-color: #ECFDF5;
      border-left: 4px solid #059669;
      padding: 4px 8px;
      font-size: 11pt;
      font-weight: bold;
      color: #065F46;
      margin: 12px 0 6px 0;
      text-transform: uppercase;
    }
    .subsection-title {
      font-weight: bold;
      color: #1F2937;
      margin: 8px 0 3px 0;
      font-size: 10.5pt;
    }
    table.rubrik {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 9.5pt;
    }
    table.rubrik th, table.rubrik td {
      border: 1px solid #9CA3AF;
      padding: 5px 6px;
      vertical-align: top;
    }
    table.rubrik th {
      background-color: #1F2937;
      color: #FFFFFF;
      text-align: center;
      font-weight: bold;
    }
    .box-content {
      border: 1px solid #D1D5DB;
      background-color: #F9FAFB;
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 10pt;
      white-space: pre-wrap;
      margin: 4px 0 10px 0;
    }
    table.ttd {
      width: 100%;
      margin-top: 24px;
      border-collapse: collapse;
      page-break-inside: avoid;
    }
    table.ttd td {
      width: 50%;
      text-align: center;
      font-size: 10.5pt;
      vertical-align: top;
    }
  </style>
</head>
<body>
  <!-- KOP SURAT RESMI PEMKAB BOGOR & SD NEGERI NAMBO 03 -->
  <table class="kop" style="width: 100%; border-collapse: collapse; margin-bottom: 4px;">
    <tr>
      <td style="width: 85px; text-align: center; vertical-align: middle;">
        <img src="${logoBogorDataUrl}" alt="Lambang Kabupaten Bogor" width="75" height="90" style="display: block; margin: auto;" />
      </td>
      <td class="kop-text" style="text-align: center; vertical-align: middle; padding: 0 10px;">
        <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">PEMERINTAH KABUPATEN BOGOR</div>
        <div style="font-size: 11pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">DINAS PENDIDIKAN</div>
        <div style="font-size: 16pt; font-weight: 900; color: #000000; margin: 2px 0; text-transform: uppercase;">SD NEGERI NAMBO 03</div>
        <div style="font-size: 13pt; font-weight: 900; color: #000000; text-transform: uppercase;">KECAMATAN KLAPANUNGGAL</div>
        <div style="font-size: 9.5pt; margin-top: 3px;">Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati</div>
        <div style="font-size: 9.5pt;">Kecamatan Klapanunggal Kabupaten Bogor 16871</div>
        <div style="font-size: 9.5pt;">Email.sdnnambo03bantarjati@gmail.com</div>
        <table style="width: 100%; margin-top: 4px; border-top: 1px solid #000000; font-size: 9.5pt; font-weight: bold;">
          <tr>
            <td style="text-align: left; padding: 2px 4px; border: none;">NPSN : ${schoolProfile.npsn || '20200352'}</td>
            <td style="text-align: right; padding: 2px 4px; border: none;">NSS : ${schoolProfile.nss || '101020232021'}</td>
          </tr>
        </table>
      </td>
      <td style="width: 85px; text-align: center; vertical-align: middle;">
        <img src="${logoNamboDataUrl}" alt="Lambang Resmi SDN Nambo 03" width="75" height="75" style="display: block; margin: auto;" />
      </td>
    </tr>
  </table>
  <div style="width: 100%; border-top: 3px solid #000000; margin-top: 2px;"></div>
  <div style="width: 100%; border-top: 1px solid #000000; margin-top: 2px; margin-bottom: 18px;"></div>

  <!-- JUDUL DOKUMEN -->
  <div class="doc-title">
    <h3>MODUL AJAR PEMBELAJARAN MENDALAM (DEEP LEARNING)</h3>
    <p>NOMOR MODUL: ${modul.kodeModul} • FASE ${modul.fase.replace('Fase ', '')} (TA ${modul.tahunAjaran})</p>
  </div>

  <!-- IDENTITAS PEMBELAJARAN -->
  <table class="info">
    <tr>
      <td style="width: 25%;"><strong>Satuan Pendidikan</strong></td>
      <td style="width: 2%;">:</td>
      <td style="width: 33%;">${schoolProfile.namaSekolah}</td>
      <td style="width: 20%;"><strong>Semester</strong></td>
      <td style="width: 2%;">:</td>
      <td style="width: 18%;">${modul.semester}</td>
    </tr>
    <tr>
      <td><strong>Mata Pelajaran</strong></td>
      <td>:</td>
      <td><strong>${modul.mataPelajaran}</strong></td>
      <td><strong>Alokasi Waktu</strong></td>
      <td>:</td>
      <td>${modul.alokasiWaktu}</td>
    </tr>
    <tr>
      <td><strong>Kelas / Fase</strong></td>
      <td>:</td>
      <td>${modul.kelasNama} (${modul.fase})</td>
      <td><strong>Pertemuan Ke-</strong></td>
      <td>:</td>
      <td>${modul.pertemuanKe}</td>
    </tr>
    <tr>
      <td><strong>Guru Pengampu</strong></td>
      <td>:</td>
      <td>${modul.guruPenyusun}</td>
      <td><strong>Tanggal KBM</strong></td>
      <td>:</td>
      <td>${modul.tanggalAjar || 'Juli 2026'}</td>
    </tr>
  </table>

  <!-- 1. IDENTIFIKASI PEMBELAJARAN -->
  <div class="section-title">I. IDENTIFIKASI PEMBELAJARAN & PROFIL MURID</div>
  <p><strong>A. Analisis Kesiapan Belajar Murid:</strong><br />${modul.kesiapanBelajarMurid}</p>
  <p><strong>B. 8 Dimensi Profil Lulusan (DPL):</strong><br />${modul.dimensiProfilLulusan.map(d => '• ' + d).join('<br />')}</p>
  <p><strong>C. Prinsip Pembelajaran Mendalam (Mindful, Meaningful, Joyful):</strong></p>
  <ul>
    <li><strong>Mindful (Berkesadaran):</strong> ${modul.prinsipDeepLearning.mindful}</li>
    <li><strong>Meaningful (Bermakna):</strong> ${modul.prinsipDeepLearning.meaningful}</li>
    <li><strong>Joyful (Menggembirakan):</strong> ${modul.prinsipDeepLearning.joyful}</li>
    <li><strong>4 Pilar Olah:</strong> ${modul.prinsipDeepLearning.olahDimensi.join(', ')}</li>
  </ul>

  <!-- 2. DESAIN PEMBELAJARAN -->
  <div class="section-title">II. DESAIN PEMBELAJARAN</div>
  <p><strong>A. Tujuan Pembelajaran Spesifik:</strong><br />${modul.desainPembelajaran.tujuanSpesifik}</p>
  <p><strong>B. Praktik Pedagogis:</strong><br />${modul.desainPembelajaran.praktikPedagogis}</p>
  <p><strong>C. Lingkungan Belajar:</strong><br />${modul.desainPembelajaran.lingkunganBelajar}</p>
  <p><strong>D. Kemitraan Pembelajaran:</strong><br />${modul.desainPembelajaran.kemitraan}</p>
  <p><strong>E. Pemanfaatan Teknologi Digital & AI:</strong><br />${modul.desainPembelajaran.pemanfaatanDigitalAI}</p>

  <!-- 3. PENGALAMAN BELAJAR MENDALAM -->
  <div class="section-title">III. PENGALAMAN BELAJAR MENDALAM (SIKLUS MEMAHAMI - MENGAPLIKASI - MEREFLEKSI)</div>
  <p class="subsection-title">1. Kegiatan Awal (${modul.pengalamanBelajar.kegiatanAwal.alokasiMenit} Menit):</p>
  <ul>
    ${modul.pengalamanBelajar.kegiatanAwal.langkah.map(l => `<li>${l}</li>`).join('')}
  </ul>
  <p style="margin-left: 20px;"><em>Pertanyaan Pemantik:</em><br />${modul.pengalamanBelajar.kegiatanAwal.pertanyaanPemantik.map(q => `• "${q}"`).join('<br />')}</p>

  <p class="subsection-title">2. Kegiatan Inti (${modul.pengalamanBelajar.kegiatanInti.alokasiMenit} Menit):</p>
  <p style="margin-left: 10px;"><strong>Tahap 1: Memahami (Mindful & Bermakna):</strong></p>
  <ul>
    ${modul.pengalamanBelajar.kegiatanInti.memahami.map(s => `<li>${s}</li>`).join('')}
  </ul>
  <p style="margin-left: 10px;"><strong>Tahap 2: Mengaplikasikan (Bermakna & Menggembirakan):</strong></p>
  <ul>
    ${modul.pengalamanBelajar.kegiatanInti.mengaplikasi.map(s => `<li>${s}</li>`).join('')}
  </ul>
  <p style="margin-left: 10px;"><strong>Tahap 3: Merefleksikan (Berkesadaran & Menggembirakan):</strong></p>
  <ul>
    ${modul.pengalamanBelajar.kegiatanInti.merefleksi.map(s => `<li>${s}</li>`).join('')}
  </ul>

  <p class="subsection-title">3. Kegiatan Penutup (${modul.pengalamanBelajar.kegiatanPenutup.alokasiMenit} Menit):</p>
  <ul>
    ${modul.pengalamanBelajar.kegiatanPenutup.langkah.map(l => `<li>${l}</li>`).join('')}
  </ul>
  <p style="margin-left: 20px;"><strong>Tindak Lanjut & Pembiasaan Rumah:</strong> ${modul.pengalamanBelajar.kegiatanPenutup.tindakLanjut}</p>

  <!-- 4. ASESMEN AUTENTIK & BAHAN AJAR -->
  <div class="section-title">IV. ASESMEN AUTENTIK & RUBRIK PENILAIAN BERTINGKAT</div>
  <p><strong>A. Asesmen Formatif Awal:</strong> ${modul.asesmenAutentik.formatifAwal}</p>
  <p><strong>B. Asesmen Formatif Proses:</strong> ${modul.asesmenAutentik.formatifProses}</p>
  <p><strong>C. Asesmen Sumatif Akhir:</strong> ${modul.asesmenAutentik.sumatif}</p>

  <p class="subsection-title">D. Rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</p>
  <table class="rubrik">
    <thead>
      <tr>
        <th style="width: 25%;">Aspek Penilaian</th>
        <th style="width: 18%;">Perlu Bimbingan (&lt; 70)</th>
        <th style="width: 18%;">Cukup (70 - 79)</th>
        <th style="width: 19%;">Baik (80 - 89)</th>
        <th style="width: 20%;">Sangat Baik (90 - 100)</th>
      </tr>
    </thead>
    <tbody>
      ${modul.asesmenAutentik.rubrik.map(r => `
        <tr>
          <td><strong>${r.aspek}</strong></td>
          <td>${r.perluBimbingan}</td>
          <td>${r.cukup}</td>
          <td>${r.baik}</td>
          <td>${r.sangatBaik}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <p class="subsection-title">E. Bahan Ajar Ringkas Guru & Peserta Didik:</p>
  <div class="box-content">${modul.asesmenAutentik.bahanAjarRingkas}</div>

  <p class="subsection-title">F. Lembar Kerja Peserta Didik (LKPD Harian):</p>
  <div class="box-content">${modul.asesmenAutentik.lembarKerjaSiswa}</div>

  <!-- TANDA TANGAN VALIDASI -->
  <table class="ttd">
    <tr>
      <td>
        Mengetahui,<br />
        <strong>Kepala Sekolah SD Negeri Nambo 03</strong>
        <br /><br /><br /><br /><br />
        <strong><u>${modul.kepalaSekolah}</u></strong><br />
        NIP. ${modul.nipKepalaSekolah}
      </td>
      <td>
        Klapanunggal, ${modul.tanggalAjar || 'Juli 2026'}<br />
        <strong>Guru Pengampu / Wali Kelas</strong>
        <br /><br /><br /><br /><br />
        <strong><u>${modul.guruPenyusun}</u></strong><br />
        NIP. ${modul.nipGuruPenyusun}
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Modul_Ajar_Mendalam_${modul.kodeModul}_SDN_Nambo_03.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads comprehensive Curriculum Master Excel with Prota, Promes, and TP sheets
 */
export function downloadCurriculumExcelWorkbook(options: {
  prota: ProtaRecord | undefined;
  promesGanjil: PromesRecord | undefined;
  promesGenap: PromesRecord | undefined;
  tpList: LearningObjectiveTP[];
  schoolProfile: SchoolProfile;
  kelasLabel: string;
  mapel: string;
}) {
  const { prota, promesGanjil, promesGenap, tpList, schoolProfile, kelasLabel, mapel } = options;
  const wb = XLSX.utils.book_new();

  // 1. Sheet Prota
  const protaData = (prota?.items || []).map((p, idx) => ({
    'No': idx + 1,
    'Kode TP': p.kodeTP,
    'Materi Pokok / Lingkup Materi': p.materiPokok,
    'Semester': p.semester,
    'Alokasi JP': p.alokasiJP,
    'Perkiraan Bulan Pelaksanaan': p.perkiraanBulan
  }));
  const wsProta = XLSX.utils.json_to_sheet(protaData.length > 0 ? protaData : [{ No: 1, 'Kode TP': '-', 'Materi Pokok / Lingkup Materi': 'Belum ada data', Semester: 'Ganjil', 'Alokasi JP': 0, 'Perkiraan Bulan Pelaksanaan': '-' }]);
  wsProta['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 40 }, { wch: 12 }, { wch: 12 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(wb, wsProta, 'PROTA TA 2026-2027');

  // 2. Sheet Promes Ganjil
  const promesGanjilData = (promesGanjil?.items || []).map((item, idx) => {
    const row: any = {
      'No': idx + 1,
      'Kode TP': item.kodeTP,
      'Materi Pokok': item.materiPokok,
      'Total JP': item.alokasiJP
    };
    ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].forEach((bln, mIdx) => {
      [1, 2, 3, 4, 5].forEach(w => {
        const key = `M${mIdx + 1}_W${w}`;
        row[`${bln} M${w}`] = item.distribusiMingguan[key] || '';
      });
    });
    return row;
  });
  const wsPromesGanjil = XLSX.utils.json_to_sheet(promesGanjilData.length > 0 ? promesGanjilData : [{ No: 1, 'Kode TP': '-', 'Materi Pokok': 'Belum ada data', 'Total JP': 0 }]);
  XLSX.utils.book_append_sheet(wb, wsPromesGanjil, 'PROMES GANJIL');

  // 3. Sheet Promes Genap
  const promesGenapData = (promesGenap?.items || []).map((item, idx) => {
    const row: any = {
      'No': idx + 1,
      'Kode TP': item.kodeTP,
      'Materi Pokok': item.materiPokok,
      'Total JP': item.alokasiJP
    };
    ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'].forEach((bln, mIdx) => {
      [1, 2, 3, 4, 5].forEach(w => {
        const key = `M${mIdx + 1}_W${w}`;
        row[`${bln} M${w}`] = item.distribusiMingguan[key] || '';
      });
    });
    return row;
  });
  const wsPromesGenap = XLSX.utils.json_to_sheet(promesGenapData.length > 0 ? promesGenapData : [{ No: 1, 'Kode TP': '-', 'Materi Pokok': 'Belum ada data', 'Total JP': 0 }]);
  XLSX.utils.book_append_sheet(wb, wsPromesGenap, 'PROMES GENAP');

  // 4. Sheet ATP & TP
  const tpData = tpList.map((tp, idx) => ({
    'No': idx + 1,
    'Kode TP': tp.kodeTP,
    'Fase': tp.fase,
    'Kelas': tp.kelasTarget,
    'Semester': tp.semester,
    'Materi Pokok': tp.materiPokok,
    'Deskripsi Tujuan Pembelajaran': tp.tujuanDeskripsi,
    'Alokasi JP': tp.alokasiJP,
    'Dimensi Profil Lulusan': tp.dimensiProfilLulusan.join(', '),
    'Indikator Ketercapaian': tp.indikatorKetercapaian.join('; ')
  }));
  const wsTP = XLSX.utils.json_to_sheet(tpData.length > 0 ? tpData : [{ No: 1, 'Kode TP': '-', 'Materi Pokok': 'Belum ada data' }]);
  wsTP['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 10 }, { wch: 35 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsTP, 'ATP & TUJUAN PEMBELAJARAN');

  const cleanMapel = mapel.replace(/[^a-zA-Z0-9]/g, '_');
  XLSX.writeFile(wb, `Perangkat_Ajar_${kelasLabel.replace(/\s+/g, '_')}_${cleanMapel}_SDN_Nambo_03_TA_2026_2027.xlsx`);
}

/**
 * Downloads standard templates for teachers to fill out
 */
export function downloadCurriculumTemplate(type: 'tp' | 'prota' | 'promes') {
  const wb = XLSX.utils.book_new();

  if (type === 'tp') {
    const sampleTP = [
      {
        'Kode TP': 'TP-KA.1.1',
        'Mata Pelajaran': 'Koding & Kecerdasan Artifisial',
        'Fase': 'Fase A',
        'Kelas': 'Kelas 1',
        'Semester': 'Ganjil',
        'Materi Pokok': 'Logika Langkah Terarah & Robot Sahabat (Unplugged)',
        'Deskripsi Tujuan Pembelajaran': 'Peserta didik mampu menyusun 4 langkah kartu arah instruksi secara logis.',
        'Alokasi JP': 4,
        'Dimensi Profil Lulusan (Pisahkan koma)': 'Penalaran Kritis, Kreativitas, Kolaborasi (Gotong Royong)',
        'Indikator Ketercapaian (Pisahkan titik koma)': 'Menyebutkan arah dasar; Menyusun kartu langkah urut; Memperbaiki kesalahan'
      },
      {
        'Kode TP': 'TP-KA.1.2',
        'Mata Pelajaran': 'Koding & Kecerdasan Artifisial',
        'Fase': 'Fase A',
        'Kelas': 'Kelas 1',
        'Semester': 'Ganjil',
        'Materi Pokok': 'Pola Warna & Bentuk Berulang (Pattern Recognition)',
        'Deskripsi Tujuan Pembelajaran': 'Peserta didik mampu menemukan aturan pola warna berulang sebagai pondasi looping.',
        'Alokasi JP': 4,
        'Dimensi Profil Lulusan (Pisahkan koma)': 'Penalaran Kritis, Kemandirian',
        'Indikator Ketercapaian (Pisahkan titik koma)': 'Menemukan pola AB dan AAB; Membuat kalung pola warna'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleTP);
    XLSX.utils.book_append_sheet(wb, ws, 'Template TP');
    XLSX.writeFile(wb, 'Template_Import_Tujuan_Pembelajaran_SDN_Nambo_03.xlsx');
  } else if (type === 'prota') {
    const sampleProta = [
      {
        'No': 1,
        'Kode TP': 'TP-KA.1.1',
        'Materi Pokok': 'Logika Langkah Terarah & Robot Sahabat (Unplugged)',
        'Semester': 'Ganjil',
        'Alokasi JP': 8,
        'Perkiraan Bulan': 'Juli - Agustus'
      },
      {
        'No': 2,
        'Kode TP': 'TP-KA.1.2',
        'Materi Pokok': 'Pengenalan Pola Warna & Bentuk Berulang',
        'Semester': 'Ganjil',
        'Alokasi JP': 8,
        'Perkiraan Bulan': 'September - Oktober'
      },
      {
        'No': 3,
        'Kode TP': 'TP-KA.1.3',
        'Materi Pokok': 'Mengenal Komputer & Asisten Pintar AI',
        'Semester': 'Genap',
        'Alokasi JP': 10,
        'Perkiraan Bulan': 'Januari - Maret'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleProta);
    XLSX.utils.book_append_sheet(wb, ws, 'Template Prota');
    XLSX.writeFile(wb, 'Template_Import_Prota_SDN_Nambo_03.xlsx');
  } else {
    const samplePromes = [
      {
        'No': 1,
        'Kode TP': 'TP-KA.1.1',
        'Materi Pokok': 'Logika Langkah Terarah & Robot Sahabat',
        'Alokasi JP': 8,
        'Bulan 1 Mg 3': 2,
        'Bulan 1 Mg 4': 2,
        'Bulan 2 Mg 1': 2,
        'Bulan 2 Mg 2': 2
      },
      {
        'No': 2,
        'Kode TP': 'TP-KA.1.2',
        'Materi Pokok': 'Pengenalan Pola Warna & Bentuk Berulang',
        'Alokasi JP': 8,
        'Bulan 2 Mg 4': 2,
        'Bulan 3 Mg 1': 2,
        'Bulan 3 Mg 2': 2,
        'Bulan 3 Mg 4': 2
      }
    ];
    const ws = XLSX.utils.json_to_sheet(samplePromes);
    XLSX.utils.book_append_sheet(wb, ws, 'Template Promes');
    XLSX.writeFile(wb, 'Template_Import_Promes_SDN_Nambo_03.xlsx');
  }
}

/**
 * Parses uploaded Excel file for curriculum import
 */
export async function parseCurriculumExcel(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsBinaryString(file);
  });
}
