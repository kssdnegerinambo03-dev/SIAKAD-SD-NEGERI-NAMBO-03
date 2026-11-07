import * as XLSX from 'xlsx';
import {
  DeepLearningModule,
  SchoolProfile,
  ProtaRecord,
  PromesRecord,
  LearningObjectiveTP,
  ProtaItem,
  AnalisisHariEfektifRecord,
  JadwalPelajaranRecord
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
        <div style="font-size: 12pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Times New Roman', serif;">PEMERINTAH KABUPATEN BOGOR</div>
        <div style="font-size: 12pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; font-family: 'Times New Roman', serif;">DINAS PENDIDIKAN</div>
        <div style="font-size: 16pt; font-weight: 900; color: #000000; margin: 2px 0; text-transform: uppercase; font-family: 'Times New Roman', serif;">SD NEGERI NAMBO 03</div>
        <div style="font-size: 10pt; font-family: 'Times New Roman', serif;">Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati</div>
        <div style="font-size: 10pt; font-family: 'Times New Roman', serif;">Kecamatan Klapanunggal Kabupaten Bogor 16871</div>
        <div style="font-size: 10pt; font-family: 'Times New Roman', serif;">Email.sdnnambo03bantarjati@gmail.com</div>
        <table style="width: 100%; margin-top: 4px; font-size: 9.5pt; font-family: 'Times New Roman', serif;">
          <tr>
            <td style="text-align: left; padding: 2px 4px; border: none; text-decoration: underline;">NPSN : ${schoolProfile.npsn || '20200352'}</td>
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

  <!-- 4. ASESMEN AUTENTIK & INSTRUMEN PENILAIAN LENGKAP -->
  <div class="section-title">IV. ASESMEN AUTENTIK, INSTRUMEN SOAL & LKPD LENGKAP</div>
  <p><strong>A. Asesmen Formatif Awal (Diagnostik):</strong> ${modul.asesmenAutentik.formatifAwal}</p>
  <p><strong>B. Asesmen Formatif Proses:</strong> ${modul.asesmenAutentik.formatifProses}</p>
  <p><strong>C. Asesmen Sumatif Akhir:</strong> ${modul.asesmenAutentik.sumatif}</p>

  ${modul.asesmenAutentik.bentukJenis ? `
  <p class="subsection-title">D. Bentuk & Jenis Instrumen Penilaian:</p>
  <table class="rubrik" style="margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="width: 25%;">Kategori Asesmen</th>
        <th style="width: 45%;">Deskripsi & Fokus Penilaian</th>
        <th style="width: 30%;">Bentuk & Teknik Instrumen</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Asesmen Diagnostik Awal</strong></td>
        <td>${modul.asesmenAutentik.bentukJenis.diagnostikAwal}</td>
        <td>Tanya Jawab Lisan & Observasi Kesiapan</td>
      </tr>
      <tr>
        <td><strong>Asesmen Formatif Proses</strong></td>
        <td>${modul.asesmenAutentik.bentukJenis.formatifProses}</td>
        <td>Checklist Observasi Sikap & Lembar Kinerja Unplugged</td>
      </tr>
      <tr>
        <td><strong>Asesmen Sumatif Lingkup Materi</strong></td>
        <td>${modul.asesmenAutentik.bentukJenis.sumatifAkhir}</td>
        <td>Tes Tertulis (PG & Uraian) serta Unjuk Kerja Proyek</td>
      </tr>
    </tbody>
  </table>
  <p style="font-size: 9.5pt; margin-bottom: 8px;"><strong>Teknik Penilaian yang Diterapkan:</strong></p>
  <ul>
    ${(modul.asesmenAutentik.bentukJenis.teknikInstrumen || []).map(t => `<li style="font-size: 9.5pt;">${t}</li>`).join('')}
  </ul>
  ` : ''}

  <p class="subsection-title">E. Rubrik Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</p>
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

  ${modul.asesmenAutentik.soalIndividu ? `
  <p class="subsection-title">F. Instrumen Soal & Asesmen Individu (Total Bobot Skor: ${modul.asesmenAutentik.soalIndividu.totalSkor || 100}):</p>
  <p style="font-size: 9.5pt; font-style: italic; margin-bottom: 6px;">Petunjuk: ${modul.asesmenAutentik.soalIndividu.petunjuk}</p>
  <table class="rubrik" style="margin-bottom: 12px;">
    <thead>
      <tr>
        <th style="width: 6%;">No</th>
        <th style="width: 16%;">Bentuk Soal</th>
        <th style="width: 48%;">Butir Pertanyaan & Pilihan</th>
        <th style="width: 20%;">Kunci Jawaban</th>
        <th style="width: 10%;">Skor</th>
      </tr>
    </thead>
    <tbody>
      ${modul.asesmenAutentik.soalIndividu.daftarSoal.map(s => `
        <tr>
          <td style="text-align: center;"><strong>${s.nomor}</strong></td>
          <td style="text-align: center;"><span style="background-color: #E5E7EB; padding: 2px 5px; font-size: 8.5pt;">${s.bentuk}</span></td>
          <td>
            <strong>${s.pertanyaan}</strong>
            ${s.pilihan && s.pilihan.length > 0 ? `
              <div style="margin-top: 4px; font-size: 9pt;">
                ${s.pilihan.map(p => `<div>${p}</div>`).join('')}
              </div>
            ` : ''}
          </td>
          <td><span style="font-weight: bold; color: #047857;">${s.kunciJawaban}</span></td>
          <td style="text-align: center;"><strong>${s.bobotSkor}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  ` : ''}

  ${modul.asesmenAutentik.soalKelompok ? `
  <p class="subsection-title">G. Instrumen Tantangan & Penilaian Proyek Kelompok:</p>
  <div style="border: 1px solid #9CA3AF; padding: 8px 10px; background-color: #F3F4F6; margin-bottom: 8px;">
    <p><strong>Judul Proyek:</strong> ${modul.asesmenAutentik.soalKelompok.judulTantangan}</p>
    <p><strong>Petunjuk Kelompok:</strong> ${modul.asesmenAutentik.soalKelompok.petunjukKelompok}</p>
    <p><strong>Skenario Kasus / Misi:</strong> ${modul.asesmenAutentik.soalKelompok.skenarioKasus}</p>
    <p><strong>Tugas Kolaboratif:</strong></p>
    <ul>
      ${modul.asesmenAutentik.soalKelompok.tugasKolaboratif.map(t => `<li>${t}</li>`).join('')}
    </ul>
    <p style="margin-top: 6px;"><strong>Kriteria Penilaian Kerja Kelompok:</strong></p>
    <table class="rubrik">
      <thead>
        <tr>
          <th style="width: 30%;">Aspek Penilaian</th>
          <th style="width: 15%;">Bobot</th>
          <th style="width: 55%;">Deskripsi Kriteria</th>
        </tr>
      </thead>
      <tbody>
        ${modul.asesmenAutentik.soalKelompok.kriteriaPenilaian.map(k => `
          <tr>
            <td><strong>${k.aspek}</strong></td>
            <td style="text-align: center;"><strong>${k.bobot}</strong></td>
            <td>${k.deskripsi}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  ${modul.asesmenAutentik.lkpdLengkap ? `
  <p class="subsection-title">H. Lembar Kerja Peserta Didik (LKPD) Lengkap Terstruktur:</p>
  <div style="border: 2px dashed #059669; padding: 10px 12px; background-color: #ECFDF5; margin-bottom: 12px;">
    <div style="text-align: center; font-weight: bold; font-size: 11pt; margin-bottom: 8px; color: #065F46;">
      ${modul.asesmenAutentik.lkpdLengkap.judulLKPD}
    </div>
    <table style="width: 100%; font-size: 9.5pt; margin-bottom: 8px;">
      <tr>
        <td style="width: 50%;">Kelompok / Kelas: ........................ / ${modul.kelasNama}</td>
        <td style="width: 50%;">Nama Anggota: .................................................</td>
      </tr>
      <tr>
        <td>Mata Pelajaran: ${modul.mataPelajaran}</td>
        <td>Hari / Tanggal: .................................................</td>
      </tr>
    </table>
    <p><strong>Tujuan Aktivitas:</strong> ${modul.asesmenAutentik.lkpdLengkap.tujuanAktivitas}</p>
    <p><strong>Alat & Bahan yang Digunakan:</strong></p>
    <ul>
      ${modul.asesmenAutentik.lkpdLengkap.alatDanBahan.map(ab => `<li>${ab}</li>`).join('')}
    </ul>
    <p><strong>Petunjuk Pengerjaan:</strong></p>
    <ol>
      ${modul.asesmenAutentik.lkpdLengkap.petunjukPengerjaan.map(p => `<li>${p}</li>`).join('')}
    </ol>
    <p><strong>Langkah Eksplorasi:</strong></p>
    <ol>
      ${modul.asesmenAutentik.lkpdLengkap.langkahEksplorasi.map(l => `<li>${l}</li>`).join('')}
    </ol>
    ${modul.asesmenAutentik.lkpdLengkap.tabelAktivitasKerja ? `
      <p><strong>Format Catatan / Checklist Uji Coba:</strong></p>
      <div class="box-content">${modul.asesmenAutentik.lkpdLengkap.tabelAktivitasKerja}</div>
    ` : ''}
    <p><strong>Pertanyaan Diskusi & Refleksi Kelompok:</strong></p>
    <ol>
      ${modul.asesmenAutentik.lkpdLengkap.pertanyaanDiskusiReflektif.map(pd => `<li>${pd}</li>`).join('')}
    </ol>
    <p><strong>Refleksi Diri:</strong> ${modul.asesmenAutentik.lkpdLengkap.refleksiDiri}</p>
  </div>
  ` : ''}

  <p class="subsection-title">I. Bahan Ajar Ringkas Guru & Peserta Didik:</p>
  <div class="box-content">${modul.asesmenAutentik.bahanAjarRingkas}</div>

  <p class="subsection-title">J. Lembar Kerja Peserta Didik (LKPD Harian / Ringkas):</p>
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
export function downloadCurriculumTemplate(type: 'tp' | 'prota' | 'promes' | 'hari-efektif' | 'jadwal-pelajaran') {
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
  } else if (type === 'promes') {
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
  } else if (type === 'hari-efektif') {
    const sampleHariEfektif = [
      {
        'Bulan': 'Juli 2026',
        'Kode Bulan': '2026-07',
        'Semester': 'Ganjil',
        'Hari Kalender': 31,
        'Minggu Efektif': 3,
        'Hari Efektif': 13,
        'Hari Libur': 18,
        'Keterangan Agenda': '15-21 Juli: MPLS Murid Baru; 22 Juli: Awal PBM'
      },
      {
        'Bulan': 'Agustus 2026',
        'Kode Bulan': '2026-08',
        'Semester': 'Ganjil',
        'Hari Kalender': 31,
        'Minggu Efektif': 4,
        'Hari Efektif': 19,
        'Hari Libur': 12,
        'Keterangan Agenda': '17 Agt: HUT RI ke-81; 18 Agt: Lomba Semarak'
      },
      {
        'Bulan': 'September 2026',
        'Kode Bulan': '2026-09',
        'Semester': 'Ganjil',
        'Hari Kalender': 30,
        'Minggu Efektif': 4,
        'Hari Efektif': 17,
        'Hari Libur': 13,
        'Keterangan Agenda': '14-18 September: STS Ganjil'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleHariEfektif);
    XLSX.utils.book_append_sheet(wb, ws, 'Template Hari Efektif');
    XLSX.writeFile(wb, 'Template_Import_Hari_Efektif_SDN_Nambo_03.xlsx');
  } else if (type === 'jadwal-pelajaran') {
    const sampleJadwal = [
      {
        'Hari': 'Senin',
        'Jam Ke': 0,
        'Jam Mulai': '07.00',
        'Jam Selesai': '07.30',
        'Mata Pelajaran': 'Upacara Bendera Merah Putih',
        'Guru Pengampu': 'Dewan Guru SDN Nambo 03',
        'Ruang': 'Lapangan Utama',
        'Istirahat (Ya/Tidak)': 'Tidak'
      },
      {
        'Hari': 'Senin',
        'Jam Ke': 1,
        'Jam Mulai': '07.30',
        'Jam Selesai': '08.05',
        'Mata Pelajaran': 'Pendidikan Pancasila',
        'Guru Pengampu': 'Nurhaeni, S.Pd.',
        'Ruang': 'Kelas 1A',
        'Istirahat (Ya/Tidak)': 'Tidak'
      },
      {
        'Hari': 'Senin',
        'Jam Ke': 2,
        'Jam Mulai': '08.05',
        'Jam Selesai': '08.40',
        'Mata Pelajaran': 'Pendidikan Pancasila',
        'Guru Pengampu': 'Nurhaeni, S.Pd.',
        'Ruang': 'Kelas 1A',
        'Istirahat (Ya/Tidak)': 'Tidak'
      },
      {
        'Hari': 'Senin',
        'Jam Ke': 0,
        'Jam Mulai': '09.15',
        'Jam Selesai': '09.35',
        'Mata Pelajaran': 'Istirahat I & Makan Sehat',
        'Guru Pengampu': '-',
        'Ruang': 'Halaman Kelas',
        'Istirahat (Ya/Tidak)': 'Ya'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleJadwal);
    XLSX.utils.book_append_sheet(wb, ws, 'Template Jadwal Pelajaran');
    XLSX.writeFile(wb, 'Template_Import_Jadwal_Pelajaran_SDN_Nambo_03.xlsx');
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

/**
 * Downloads Analisis Hari Efektif as official Microsoft Word (.doc) with Kop Surat
 */
export async function downloadHariEfektifWord(record: AnalisisHariEfektifRecord, schoolProfile: SchoolProfile) {
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
    console.warn('Could not encode logos:', err);
  }

  const rowsBulan = record.daftarBulan.map((b, idx) => `
    <tr>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 6px;">${idx + 1}</td>
      <td style="border: 1px solid #1f2937; padding: 6px; font-weight: bold;">${b.bulan}</td>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 6px;">${b.jumlahHariKalender}</td>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 6px; font-weight: bold; color: #1e3a8a;">${b.mingguEfektif}</td>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 6px; font-weight: bold; color: #047857; background: #ecfdf5;">${b.hariEfektif}</td>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 6px; color: #b91c1c;">${b.hariLibur}</td>
      <td style="border: 1px solid #1f2937; padding: 6px; font-size: 9.5pt;">${b.keteranganKegiatan.join('<br>• ') ? '• ' + b.keteranganKegiatan.join('<br>• ') : '-'}</td>
    </tr>
  `).join('');

  const rowsAgenda = record.agendaPendidikan.map((ag, idx) => `
    <tr>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 5px;">${idx + 1}</td>
      <td style="border: 1px solid #1f2937; padding: 5px; font-weight: 600;">${ag.tanggalMulai} ${ag.tanggalSelesai && ag.tanggalSelesai !== ag.tanggalMulai ? 's.d. ' + ag.tanggalSelesai : ''}</td>
      <td style="border: 1px solid #1f2937; padding: 5px;">${ag.kegiatan}</td>
      <td style="text-align: center; border: 1px solid #1f2937; padding: 5px;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 9pt;">${ag.kategori}</span></td>
    </tr>
  `).join('');

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Analisis Hari Efektif SDN Nambo 03 - Semester ${record.semester}</title>
  <style>
    @page { size: A4 portrait; margin: 2cm 2cm 2cm 2cm; }
    body { font-family: 'Times New Roman', Calibri, serif; font-size: 11pt; line-height: 1.3; color: #111827; }
    table.kop { width: 100%; border-collapse: collapse; border-bottom: 3px double #000000; margin-bottom: 16px; }
    table.kop td { vertical-align: middle; padding: 2px; }
    .kop-pemkab { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2; }
    .kop-dinas { font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2; }
    .kop-sekolah { font-size: 15pt; font-weight: bold; text-transform: uppercase; margin: 2px 0; letter-spacing: 0.5px; }
    .kop-alamat { font-size: 8.5pt; margin: 1px 0; line-height: 1.2; }
    .title-doc { text-align: center; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 10px 0 2px 0; text-decoration: underline; }
    .subtitle-doc { text-align: center; font-size: 10.5pt; font-weight: bold; margin-bottom: 14px; text-transform: uppercase; }
    table.data-table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 16px; font-size: 10pt; }
    table.data-table th { background: #f3f4f6; border: 1px solid #1f2937; padding: 6px; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  <table class="kop">
    <tr>
      <td style="width: 15%; text-align: center;">
        <img src="${logoBogorDataUrl}" width="82" height="82" alt="Logo Kab Bogor" />
      </td>
      <td style="width: 70%; text-align: center;">
        <div class="kop-pemkab">PEMERINTAH KABUPATEN BOGOR</div>
        <div class="kop-dinas">DINAS PENDIDIKAN</div>
        <div class="kop-sekolah">${schoolProfile.namaSekolah || 'SD NEGERI NAMBO 03'}</div>
        <div class="kop-dinas" style="font-size: 11pt;">KECAMATAN ${schoolProfile.kecamatan?.toUpperCase() || 'KLAPANUNGGAL'}</div>
        <div class="kop-alamat">${schoolProfile.alamat || 'Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati'}</div>
        <div class="kop-alamat">Email: ${schoolProfile.email || 'sdnnambo03bantarjati@gmail.com'}</div>
        <div class="kop-alamat" style="font-weight: bold; margin-top: 2px;">NPSN: ${schoolProfile.npsn || '20200352'} &nbsp;&nbsp;&nbsp;&nbsp; NSS: ${schoolProfile.nss || '101020232021'}</div>
      </td>
      <td style="width: 15%; text-align: center;">
        <img src="${logoNamboDataUrl}" width="84" height="84" alt="Logo SDN Nambo 03" />
      </td>
    </tr>
  </table>

  <div class="title-doc">ANALISIS HARI DAN MINGGU EFEKTIF BELAJAR</div>
  <div class="subtitle-doc">TAHUN AJARAN ${record.tahunAjaran} - SEMESTER ${record.semester.toUpperCase()}</div>

  <table style="width: 100%; margin-bottom: 12px; font-size: 10.5pt;">
    <tr>
      <td style="width: 25%; font-weight: bold;">Satuan Pendidikan</td>
      <td style="width: 2%;">:</td>
      <td style="width: 73%;">${schoolProfile.namaSekolah}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Tahun Ajaran / Semester</td>
      <td>:</td>
      <td>${record.tahunAjaran} / Semester ${record.semester}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Sasaran Pembelajaran</td>
      <td>:</td>
      <td>${record.kelasTarget} (${record.mataPelajaran || 'Semua Mata Pelajaran'})</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Alokasi Hari Efektif</td>
      <td>:</td>
      <td><strong style="color: #047857;">${record.totalHariEfektif} Hari Efektif</strong> (Minggu Efektif: <strong>${record.totalMingguEfektif} Minggu</strong>)</td>
    </tr>
  </table>

  <h4 style="margin: 8px 0 4px 0; font-size: 11pt; text-transform: uppercase;">I. RINCIAN JUMLAH HARI DAN MINGGU EFEKTIF PER BULAN</h4>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 18%;">Bulan & Tahun</th>
        <th style="width: 10%;">Hari Kalender (HK)</th>
        <th style="width: 10%;">Minggu Efektif (ME)</th>
        <th style="width: 10%;">Hari Efektif (HE)</th>
        <th style="width: 10%;">Hari Libur (HL)</th>
        <th style="width: 37%;">Keterangan Kegiatan / Agenda Sekolah</th>
      </tr>
    </thead>
    <tbody>
      ${rowsBulan}
      <tr style="background: #f3f4f6; font-weight: bold;">
        <td colspan="2" style="text-align: center; border: 1px solid #1f2937; padding: 6px;">JUMLAH TOTAL</td>
        <td style="text-align: center; border: 1px solid #1f2937; padding: 6px;">${record.daftarBulan.reduce((a, b) => a + b.jumlahHariKalender, 0)}</td>
        <td style="text-align: center; border: 1px solid #1f2937; padding: 6px; color: #1e3a8a;">${record.totalMingguEfektif}</td>
        <td style="text-align: center; border: 1px solid #1f2937; padding: 6px; color: #047857; background: #d1fae5;">${record.totalHariEfektif}</td>
        <td style="text-align: center; border: 1px solid #1f2937; padding: 6px; color: #b91c1c;">${record.daftarBulan.reduce((a, b) => a + b.hariLibur, 0)}</td>
        <td style="border: 1px solid #1f2937; padding: 6px; font-style: italic;">Sesuai Kalender Pendidikan Resmi SDN Nambo 03</td>
      </tr>
    </tbody>
  </table>

  <h4 style="margin: 12px 0 4px 0; font-size: 11pt; text-transform: uppercase;">II. KALENDER AGENDA KEGIATAN & ASESMEN PENDIDIKAN</h4>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 6%;">No</th>
        <th style="width: 25%;">Rentang Waktu / Tanggal</th>
        <th style="width: 50%;">Nama Kegiatan Pendidikan / Sekolah</th>
        <th style="width: 19%;">Kategori</th>
      </tr>
    </thead>
    <tbody>
      ${rowsAgenda}
    </tbody>
  </table>

  <div style="margin-top: 8px; font-size: 9.5pt; font-style: italic; color: #4b5563;">
    Catatan: ${record.catatan || 'Perhitungan alokasi waktu efektif pembelajaran disesuaikan dengan Kurikulum Merdeka dan Panduan Pembelajaran & Asesmen 2025.'}
  </div>

  <table style="width: 100%; margin-top: 32px; border-collapse: collapse; font-size: 10pt;">
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        Mengetahui,<br>
        Kepala SDN Nambo 03<br><br><br><br><br>
        <strong><u>${schoolProfile.kepalaSekolah || 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.'}</u></strong><br>
        NIP. ${schoolProfile.nipKepalaSekolah || '197008121993072001'}
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        Klapanunggal, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        Guru / Tim Pengembang Kurikulum<br><br><br><br><br>
        <strong><u>Nurhaeni, S.Pd.</u></strong><br>
        NIP. 198306172023212000
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Analisis_Hari_Efektif_SDN_Nambo_03_TA_2026_2027_Smt_${record.semester}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads Analisis Hari Efektif as Excel (.xlsx)
 */
export function downloadHariEfektifExcel(record: AnalisisHariEfektifRecord, schoolProfile: SchoolProfile) {
  const wb = XLSX.utils.book_new();

  const dataBulan = record.daftarBulan.map((b, idx) => ({
    'No': idx + 1,
    'Bulan & Tahun': b.bulan,
    'Hari Kalender (HK)': b.jumlahHariKalender,
    'Minggu Efektif (ME)': b.mingguEfektif,
    'Hari Efektif Belajar (HE)': b.hariEfektif,
    'Hari Libur (HL)': b.hariLibur,
    'Keterangan Agenda / Kegiatan': b.keteranganKegiatan.join('; ')
  }));

  const wsBulan = XLSX.utils.json_to_sheet(dataBulan);
  wsBulan['!cols'] = [{ wch: 5 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 18 }, { wch: 16 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, wsBulan, `Hari Efektif Smt ${record.semester}`);

  const dataAgenda = record.agendaPendidikan.map((ag, idx) => ({
    'No': idx + 1,
    'Tanggal Mulai': ag.tanggalMulai,
    'Tanggal Selesai': ag.tanggalSelesai || ag.tanggalMulai,
    'Nama Kegiatan / Agenda': ag.kegiatan,
    'Semester': ag.semester,
    'Kategori': ag.kategori
  }));
  const wsAgenda = XLSX.utils.json_to_sheet(dataAgenda);
  wsAgenda['!cols'] = [{ wch: 5 }, { wch: 14 }, { wch: 14 }, { wch: 45 }, { wch: 12 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wsAgenda, 'Agenda Pendidikan');

  XLSX.writeFile(wb, `Analisis_Hari_Efektif_SDN_Nambo_03_Smt_${record.semester}.xlsx`);
}

/**
 * Downloads Jadwal Pelajaran as official Microsoft Word (.doc) with Kop Surat
 */
export async function downloadJadwalPelajaranWord(record: JadwalPelajaranRecord, schoolProfile: SchoolProfile) {
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
    console.warn('Could not encode logos:', err);
  }

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] as const;

  const jadwalHtml = hariList.map(h => {
    const slots = record.slots.filter(s => s.hari === h);
    if (slots.length === 0) return '';

    const slotRows = slots.map(s => `
      <tr style="${s.isIstirahat ? 'background: #fef3c7; font-weight: bold;' : ''}">
        <td style="text-align: center; border: 1px solid #1f2937; padding: 5px;">${s.jamKe === 0 ? '-' : 'Jam ke-' + s.jamKe}</td>
        <td style="text-align: center; border: 1px solid #1f2937; padding: 5px; font-weight: 600;">${s.jamMulai} - ${s.jamSelesai}</td>
        <td style="border: 1px solid #1f2937; padding: 5px; font-weight: ${s.isIstirahat ? 'bold' : '600'}; color: ${s.isIstirahat ? '#92400e' : '#111827'};">${s.mataPelajaran}</td>
        <td style="border: 1px solid #1f2937; padding: 5px;">${s.guruPengampu}</td>
        <td style="text-align: center; border: 1px solid #1f2937; padding: 5px; font-size: 9pt;">${s.ruangan || '-'}</td>
      </tr>
    `).join('');

    return `
      <h4 style="margin: 14px 0 4px 0; font-size: 11pt; color: #1e3a8a; text-transform: uppercase;">• HARI ${h.toUpperCase()}</h4>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 12%;">Jam Pelajaran</th>
            <th style="width: 18%;">Waktu (WIB)</th>
            <th style="width: 38%;">Mata Pelajaran / Pembiasaan</th>
            <th style="width: 22%;">Guru Pengampu</th>
            <th style="width: 10%;">Ruang</th>
          </tr>
        </thead>
        <tbody>
          ${slotRows}
        </tbody>
      </table>
    `;
  }).join('');

  const htmlContent = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>Jadwal Pelajaran SDN Nambo 03 - ${record.kelasNama}</title>
  <style>
    @page { size: A4 portrait; margin: 2cm 2cm 2cm 2cm; }
    body { font-family: 'Times New Roman', Calibri, serif; font-size: 11pt; line-height: 1.3; color: #111827; }
    table.kop { width: 100%; border-collapse: collapse; border-bottom: 3px double #000000; margin-bottom: 16px; }
    table.kop td { vertical-align: middle; padding: 2px; }
    .kop-pemkab { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2; }
    .kop-dinas { font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 0; line-height: 1.2; }
    .kop-sekolah { font-size: 15pt; font-weight: bold; text-transform: uppercase; margin: 2px 0; letter-spacing: 0.5px; }
    .kop-alamat { font-size: 8.5pt; margin: 1px 0; line-height: 1.2; }
    .title-doc { text-align: center; font-size: 12pt; font-weight: bold; text-transform: uppercase; margin: 10px 0 2px 0; text-decoration: underline; }
    .subtitle-doc { text-align: center; font-size: 10.5pt; font-weight: bold; margin-bottom: 14px; text-transform: uppercase; }
    table.data-table { width: 100%; border-collapse: collapse; margin-top: 4px; margin-bottom: 12px; font-size: 9.5pt; }
    table.data-table th { background: #f3f4f6; border: 1px solid #1f2937; padding: 5px; font-weight: bold; text-align: center; }
  </style>
</head>
<body>
  <table class="kop">
    <tr>
      <td style="width: 15%; text-align: center;">
        <img src="${logoBogorDataUrl}" width="82" height="82" alt="Logo Kab Bogor" />
      </td>
      <td style="width: 70%; text-align: center;">
        <div class="kop-pemkab">PEMERINTAH KABUPATEN BOGOR</div>
        <div class="kop-dinas">DINAS PENDIDIKAN</div>
        <div class="kop-sekolah">${schoolProfile.namaSekolah || 'SD NEGERI NAMBO 03'}</div>
        <div class="kop-dinas" style="font-size: 11pt;">KECAMATAN ${schoolProfile.kecamatan?.toUpperCase() || 'KLAPANUNGGAL'}</div>
        <div class="kop-alamat">${schoolProfile.alamat || 'Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati'}</div>
        <div class="kop-alamat">Email: ${schoolProfile.email || 'sdnnambo03bantarjati@gmail.com'}</div>
        <div class="kop-alamat" style="font-weight: bold; margin-top: 2px;">NPSN: ${schoolProfile.npsn || '20200352'} &nbsp;&nbsp;&nbsp;&nbsp; NSS: ${schoolProfile.nss || '101020232021'}</div>
      </td>
      <td style="width: 15%; text-align: center;">
        <img src="${logoNamboDataUrl}" width="84" height="84" alt="Logo SDN Nambo 03" />
      </td>
    </tr>
  </table>

  <div class="title-doc">JADWAL PELAJARAN MINGGUAN KELAS</div>
  <div class="subtitle-doc">${record.kelasNama.toUpperCase()} - SEMESTER ${record.semester.toUpperCase()} TA ${record.tahunAjaran}</div>

  <table style="width: 100%; margin-bottom: 10px; font-size: 10.5pt;">
    <tr>
      <td style="width: 25%; font-weight: bold;">Rombongan Belajar</td>
      <td style="width: 2%;">:</td>
      <td style="width: 73%;">${record.kelasNama}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Wali Kelas</td>
      <td>:</td>
      <td>${record.waliKelas}</td>
    </tr>
    <tr>
      <td style="font-weight: bold;">Alokasi Waktu per JP</td>
      <td>:</td>
      <td><strong>${record.durasiPerJP} Menit per Jam Pelajaran</strong> (SD Standar Kurikulum Merdeka)</td>
    </tr>
  </table>

  ${jadwalHtml}

  <table style="width: 100%; margin-top: 32px; border-collapse: collapse; font-size: 10pt;">
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        Mengetahui,<br>
        Kepala SDN Nambo 03<br><br><br><br><br>
        <strong><u>${schoolProfile.kepalaSekolah || 'AM. MEGA PURNAMATATI, S. Pd.,M.Pd.'}</u></strong><br>
        NIP. ${schoolProfile.nipKepalaSekolah || '197008121993072001'}
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        Klapanunggal, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        Wali Kelas ${record.kelasNama}<br><br><br><br><br>
        <strong><u>${record.waliKelas}</u></strong><br>
        NIP. 196805121991032005
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Jadwal_Pelajaran_${record.kelasNama.replace(/\s+/g, '_')}_SDN_Nambo_03_TA_2026_2027.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Downloads Jadwal Pelajaran as Excel (.xlsx)
 */
export function downloadJadwalPelajaranExcel(record: JadwalPelajaranRecord, schoolProfile: SchoolProfile) {
  const wb = XLSX.utils.book_new();

  const dataJadwal = record.slots.map((s, idx) => ({
    'No': idx + 1,
    'Hari': s.hari,
    'Jam Ke': s.jamKe === 0 ? 'Pembiasaan' : s.jamKe,
    'Jam Mulai': s.jamMulai,
    'Jam Selesai': s.jamSelesai,
    'Mata Pelajaran': s.mataPelajaran,
    'Guru Pengampu': s.guruPengampu,
    'Ruang': s.ruangan || '-',
    'Kategori': s.isIstirahat ? 'Istirahat' : 'Pembelajaran'
  }));

  const ws = XLSX.utils.json_to_sheet(dataJadwal);
  ws['!cols'] = [{ wch: 5 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 35 }, { wch: 30 }, { wch: 16 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, ws, `Jadwal ${record.kelasNama}`);

  XLSX.writeFile(wb, `Jadwal_Pelajaran_${record.kelasNama.replace(/\s+/g, '_')}_SDN_Nambo_03.xlsx`);
}
