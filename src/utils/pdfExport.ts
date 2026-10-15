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
  <!-- KOP SURAT RESMI -->
  <table class="header-table">
    <tr>
      <td class="logo-cell">
        <svg viewBox="0 0 200 200" class="logo-img" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="94" fill="#0B2F64" stroke="#EAB308" stroke-width="6"/>
          <path d="M 100 40 L 148 68 L 132 136 L 100 156 L 68 136 L 52 68 Z" fill="#D97706" stroke="#FACC15" stroke-width="4"/>
          <path d="M 100 46 L 142 71 L 128 131 L 100 149 L 72 131 L 58 71 Z" fill="#0284C7" stroke="#FFFFFF" stroke-width="1.5"/>
          <path d="M 78 116 C 88 112 96 112 100 118 C 104 112 112 112 122 116 L 122 130 C 112 126 104 126 100 131 C 96 126 88 126 78 130 Z" fill="#FFFFFF" stroke="#1E293B" stroke-width="2"/>
          <path d="M 100 68 C 94 77 91 85 95 94 C 97 99 100 101 100 101 C 100 101 103 99 105 94 C 109 85 106 77 100 68 Z" fill="#EF4444"/>
          <text x="100" y="180" fill="#FFFFFF" font-size="12" font-weight="bold" text-anchor="middle">SDN NAMBO 03</text>
        </svg>
      </td>
      <td class="instansi-cell">
        <div class="instansi-1">PEMERINTAH KABUPATEN BOGOR</div>
        <div class="instansi-2">DINAS PENDIDIKAN</div>
        <div class="sekolah-name">${schoolProfile.namaSekolah.toUpperCase()}</div>
        <div class="instansi-address">${schoolProfile.alamat}</div>
        <div class="instansi-meta">NPSN: <strong>${schoolProfile.npsn}</strong> | Kode Pos: ${schoolProfile.kodePos} | Email: ${schoolProfile.email}</div>
      </td>
    </tr>
  </table>
  <hr class="double-line" />

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
