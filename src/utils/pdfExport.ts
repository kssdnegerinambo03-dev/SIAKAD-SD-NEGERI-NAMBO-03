import { SchoolProfile } from '../types';

export interface PrintReportOptions {
  title: string;
  subtitle?: string;
  documentNumber?: string;
  tableHeaders: string[];
  tableRows: (string | number)[][];
  summaryNotes?: string[];
  schoolProfile: SchoolProfile;
  dateStr?: string;
}

export function printOfficialDocument(options: PrintReportOptions) {
  const {
    title,
    subtitle,
    documentNumber = '421.2/088/SDN-N03/TA-2026-2027',
    tableHeaders,
    tableRows,
    summaryNotes = [],
    schoolProfile,
    dateStr
  } = options;

  const today = dateStr || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Jendela pop-up cetak terblokir oleh peramban. Mohon izinkan pop-up untuk mencetak dokumen resmi.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title} - ${schoolProfile.namaSekolah}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 20mm 15mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #000;
      background: #fff;
      margin: 0;
      padding: 20px;
      line-height: 1.35;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2px;
    }
    .header-table td {
      vertical-align: middle;
    }
    .logo-cell {
      width: 90px;
      text-align: center;
    }
    .logo-img {
      width: 75px;
      height: 75px;
      object-fit: contain;
    }
    .instansi-cell {
      text-align: center;
    }
    .instansi-1 {
      font-size: 15pt;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 0;
    }
    .instansi-2 {
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 1.5px;
      margin: 2px 0;
    }
    .sekolah-name {
      font-size: 18pt;
      font-weight: 900;
      letter-spacing: 2px;
      margin: 2px 0;
    }
    .instansi-address {
      font-size: 9.5pt;
      font-style: italic;
      margin: 2px 0 0 0;
    }
    .instansi-meta {
      font-size: 9pt;
      margin: 2px 0 0 0;
    }
    .double-line {
      border: none;
      border-top: 3px double #000;
      margin: 8px 0 16px 0;
    }
    .doc-meta {
      text-align: center;
      margin-bottom: 20px;
    }
    .doc-title {
      font-size: 13pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      margin: 0;
    }
    .doc-no {
      font-size: 10pt;
      margin: 3px 0 0 0;
    }
    .doc-subtitle {
      font-size: 10.5pt;
      font-style: italic;
      margin: 4px 0 0 0;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      margin-bottom: 20px;
    }
    table.data-table th, table.data-table td {
      border: 1px solid #000;
      padding: 5px 6px;
    }
    table.data-table th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
    }
    table.data-table td {
      vertical-align: top;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .summary-box {
      font-size: 9.5pt;
      margin-bottom: 20px;
      background: #f8fafc;
      border: 1px dashed #64748b;
      padding: 8px 12px;
    }
    .ttd-container {
      width: 100%;
      margin-top: 25px;
      page-break-inside: avoid;
    }
    .ttd-table {
      width: 100%;
      border-collapse: collapse;
    }
    .ttd-table td {
      vertical-align: top;
    }
    .ttd-box {
      width: 260px;
      text-align: center;
      font-size: 10pt;
      float: right;
    }
    .ttd-space {
      height: 65px;
      position: relative;
    }
    .stamp-badge {
      position: absolute;
      top: 5px;
      left: 15px;
      border: 2px solid #2563eb;
      color: #2563eb;
      font-size: 8pt;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 6px;
      opacity: 0.75;
      transform: rotate(-8deg);
      text-transform: uppercase;
    }
    .kepsek-name {
      font-weight: bold;
      text-decoration: underline;
      font-size: 11pt;
    }
    .kepsek-nip {
      font-size: 9.5pt;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <!-- KOP SURAT RESMI PEMERINTAH KABUPATEN BOGOR & SD NEGERI NAMBO 03 -->
  <table class="header-table" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="width: 85px; text-align: center; vertical-align: middle;">
        <img src="/logo_kab_bogor.png" alt="Lambang Kabupaten Bogor" style="width: 75px; height: 95px; object-fit: contain;" />
      </td>
      <td class="instansi-cell" style="text-align: center; vertical-align: middle; padding: 0 10px;">
        <div style="font-size: 13pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">PEMERINTAH KABUPATEN BOGOR</div>
        <div style="font-size: 13pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">DINAS PENDIDIKAN</div>
        <div style="font-size: 18pt; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; margin: 2px 0;">SD NEGERI NAMBO 03</div>
        <div style="font-size: 14pt; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase;">KECAMATAN KLAPANUNGGAL</div>
        <div style="font-size: 9.5pt; margin-top: 2px;">Jln. Raya Nambo Bantarkopo RT 01 RW 04 Desa Bantarjati</div>
        <div style="font-size: 9.5pt;">Kecamatan Klapanunggal Kabupaten Bogor 16871</div>
        <div style="font-size: 9.5pt;">Email: sdnnambo03bantarjati@gmail.com</div>
        <table style="width: 100%; margin-top: 3px; border-top: 1px solid #000000; font-size: 9.5pt; font-weight: bold;">
          <tr>
            <td style="text-align: left; padding: 2px 4px; border: none;">NPSN : ${schoolProfile.npsn || '20200352'}</td>
            <td style="text-align: right; padding: 2px 4px; border: none;">NSS : ${schoolProfile.nss || '101020232021'}</td>
          </tr>
        </table>
      </td>
      <td style="width: 85px; text-align: center; vertical-align: middle;">
        <img src="/logo_nambo_03.jpg" alt="Lambang Resmi SD Negeri Nambo 03" style="width: 75px; height: 75px; object-fit: contain;" />
      </td>
    </tr>
  </table>
  <div style="width: 100%; border-top: 3px solid #000000; margin-top: 2px;"></div>
  <div style="width: 100%; border-top: 1px solid #000000; margin-top: 2px; margin-bottom: 16px;"></div>

  <!-- DOKUMEN JUDUL -->
  <div class="doc-meta">
    <div class="doc-title">${title}</div>
    <div class="doc-no">Nomor: ${documentNumber}</div>
    ${subtitle ? `<div class="doc-subtitle">${subtitle} - Tahun Ajaran ${schoolProfile.tahunAjaran}</div>` : ''}
  </div>

  ${summaryNotes.length > 0 ? `
    <div class="summary-box">
      <strong>Catatan / Ringkasan Dokumen:</strong>
      <ul style="margin: 4px 0 0 16px; padding: 0;">
        ${summaryNotes.map(n => `<li>${n}</li>`).join('')}
      </ul>
    </div>
  ` : ''}

  <!-- TABEL DATA -->
  <table class="data-table">
    <thead>
      <tr>
        ${tableHeaders.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${tableRows.length > 0 ? tableRows.map((row) => `
        <tr>
          ${row.map((cell, idx) => `
            <td class="${idx === 0 ? 'text-center' : ''}">${cell}</td>
          `).join('')}
        </tr>
      `).join('') : `
        <tr>
          <td colspan="${tableHeaders.length}" class="text-center" style="padding: 16px;">Tidak ada data untuk filter yang dipilih.</td>
        </tr>
      `}
    </tbody>
  </table>

  <!-- TANDA TANGAN KEPALA SEKOLAH -->
  <div class="ttd-container">
    <table class="ttd-table">
      <tr>
        <td style="width: 50%;">
          <div style="font-size: 9.5pt; color: #475569; padding-top: 30px;">
            Dicetak secara sistem otomatis pada:<br/>
            <strong>${new Date().toLocaleString('id-ID')} WIB</strong><br/>
            SIAKAD SDN Nambo 03 Kab. Bogor
          </div>
        </td>
        <td style="width: 50%;">
          <div class="ttd-box">
            <div>Klapanunggal, ${today}</div>
            <div>Kepala SD Negeri Nambo 03,</div>
            <div class="ttd-space">
              <div class="stamp-badge">
                TERVERIFIKASI DIGITAL<br/>
                SDN NAMBO 03
              </div>
            </div>
            <div class="kepsek-name">${schoolProfile.kepalaSekolah}</div>
            <div class="kepsek-nip">NIP. ${schoolProfile.nipKepalaSekolah}</div>
          </div>
        </td>
      </tr>
    </table>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
