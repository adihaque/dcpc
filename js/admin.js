/**
 * DCPC Executive Admin Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('adminPasswordInput');
  const loginError = document.getElementById('loginError');
  const adminDashboard = document.getElementById('adminDashboard');
  const tableBody = document.getElementById('applicantTableBody');
  const noDataRow = document.getElementById('noDataRow');
  const searchInput = document.getElementById('searchInput');
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  const addSampleBtn = document.getElementById('addSampleBtn');

  // Metrics
  const metricTotal = document.getElementById('metricTotal');
  const metricFees = document.getElementById('metricFees');
  const metricProGear = document.getElementById('metricProGear');

  let applicants = [];

  if (sessionStorage.getItem('dcpc_admin_authenticated') === 'true') {
    unlock();
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const passwordHash = await sha256(passwordInput.value);
    const expectedHash = window.DCPC_CONFIG?.ADMIN_PASSWORD_HASH;

    if (expectedHash && passwordHash === expectedHash) {
      sessionStorage.setItem('dcpc_admin_authenticated', 'true');
      unlock();
      return;
    }

    loginError.classList.remove('hidden');
    passwordInput.value = '';
    passwordInput.focus();
  });

  function unlock() {
    loginModal.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    loadApplicants();
  }

  async function sha256(value) {
    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  function safeExternalUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : '#';
    } catch {
      return '#';
    }
  }

  // Load from LocalStorage
  function loadApplicants() {
    try {
      applicants = JSON.parse(localStorage.getItem('dcpc_enrollments_db') || '[]');
    } catch (err) {
      applicants = [];
    }

    renderTable(applicants);
    updateMetrics(applicants);
  }

  // Update Metrics
  function updateMetrics(list) {
    metricTotal.innerText = list.length;
    const fee = window.DCPC_CONFIG?.MEMBERSHIP_FEE || 0;
    metricFees.innerText = `৳ ${(list.length * fee).toLocaleString()}`;
    const proCount = list.filter(item => item.device === 'DSLR' || item.device === 'Mirrorless').length;
    metricProGear.innerText = proCount;
  }

  // Render Table
  function renderTable(list) {
    tableBody.innerHTML = '';
    if (list.length === 0) {
      noDataRow.classList.remove('hidden');
      return;
    }
    noDataRow.classList.add('hidden');

    list.slice().reverse().forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-white/[0.02] transition-colors';
      tr.innerHTML = `
        <td class="p-3.5 font-mono text-slate-400">
          <div class="font-bold text-brand-cyan">${escapeHtml(item.referenceId || 'DCPC-REF')}</div>
          <div class="text-[10px] text-slate-500">${escapeHtml(new Date(item.timestamp).toLocaleDateString())}</div>
        </td>
        <td class="p-3.5">
          <div class="font-bold text-white">${escapeHtml(item.nameEn || item.nameBn)}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(item.nameBn || '')}</div>
        </td>
        <td class="p-3.5">
          <div class="text-slate-200">${escapeHtml(item.classYear || '-')}</div>
          <div class="text-[11px] text-slate-400">Roll: ${escapeHtml(item.collegeRoll || '-')} (${escapeHtml(item.department || '-')})</div>
        </td>
        <td class="p-3.5">
          <div class="text-white font-mono">${escapeHtml(item.mobile || '-')}</div>
          <a href="${safeExternalUrl(item.facebookLink)}" target="_blank" rel="noopener noreferrer" class="text-[11px] text-blue-400 hover:underline">Facebook</a>
        </td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-200">${escapeHtml(item.device || '-')}</span>
          <div class="text-[10px] text-slate-400 mt-0.5">${escapeHtml(item.cameraModel || '')}</div>
        </td>
        <td class="p-3.5">
          <span class="text-slate-300">${escapeHtml(item.experience || '-')}</span>
        </td>
        <td class="p-3.5 font-mono">
          <div class="font-bold text-amber-400">${escapeHtml(item.trxId || '-')}</div>
          <div class="text-[10px] text-slate-400">${escapeHtml(item.paymentMethod || 'bKash')}</div>
        </td>
        <td class="p-3.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // Search filter
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderTable(applicants);
      return;
    }
    const filtered = applicants.filter(item => {
      return (
        (item.nameEn && item.nameEn.toLowerCase().includes(q)) ||
        (item.nameBn && item.nameBn.toLowerCase().includes(q)) ||
        (item.collegeRoll && item.collegeRoll.toLowerCase().includes(q)) ||
        (item.trxId && item.trxId.toLowerCase().includes(q)) ||
        (item.mobile && item.mobile.includes(q))
      );
    });
    renderTable(filtered);
  });

  // Export to CSV
  exportCsvBtn.addEventListener('click', () => {
    if (applicants.length === 0) {
      alert('No applicant data available to export yet.');
      return;
    }

    const headers = [
      "Timestamp", "Ref ID", "Name (Bengali)", "Name (English)", "DOB", "Blood Group",
      "Class/Year", "Department", "Session", "Roll", "Section", "Mobile", "WhatsApp",
      "Email", "Present Address", "Permanent Address", "Guardian Info", "Facebook Link",
      "Device", "Camera Model", "Experience", "Interests", "Reason", "Payment Method", "TrxID", "Status"
    ];

    const rows = applicants.map(a => [
      a.timestamp,
      a.referenceId,
      `"${(a.nameBn || '').replace(/"/g, '""')}"`,
      `"${(a.nameEn || '').replace(/"/g, '""')}"`,
      a.dob,
      a.bloodGroup,
      `"${(a.classYear || '').replace(/"/g, '""')}"`,
      `"${(a.department || '').replace(/"/g, '""')}"`,
      a.session,
      a.collegeRoll,
      a.section,
      a.mobile,
      a.whatsapp,
      a.email,
      `"${(a.presentAddress || '').replace(/"/g, '""')}"`,
      `"${(a.permanentAddress || '').replace(/"/g, '""')}"`,
      `"${(a.guardianInfo || '').replace(/"/g, '""')}"`,
      `"${(a.facebookLink || '').replace(/"/g, '""')}"`,
      a.device,
      `"${(a.cameraModel || '').replace(/"/g, '""')}"`,
      a.experience,
      `"${(Array.isArray(a.interests) ? a.interests.join(', ') : (a.interests || '')).replace(/"/g, '""')}"`,
      `"${(a.reason || '').replace(/"/g, '""')}"`,
      a.paymentMethod,
      a.trxId,
      a.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8,﻿" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DCPC_Enrollments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // Add Demo Row for demonstration
  addSampleBtn.addEventListener('click', () => {
    const demo = {
      timestamp: new Date().toISOString(),
      referenceId: 'DCPC-260923-' + Math.floor(100 + Math.random() * 900),
      nameBn: 'তাসিনুল হক আদি',
      nameEn: 'TASINUL HAQUE ADI',
      dob: '2008-01-11',
      bloodGroup: 'B+',
      classYear: 'Class 12',
      department: 'বিজ্ঞান (Science)',
      session: '2025-2026',
      collegeRoll: '108',
      section: 'Science-A',
      mobile: '01842599516',
      whatsapp: '01842599516',
      email: 'adihaque15@gmail.com',
      presentAddress: 'Panthapath, Dhaka',
      permanentAddress: 'Brahmanbaria, Chittagong',
      guardianInfo: 'Rownakul Haque (01711000000)',
      facebookLink: 'https://facebook.com/adihaquexv',
      device: 'DSLR',
      cameraModel: 'Nikon D5300 + 50mm f/1.8G',
      experience: 'অভিজ্ঞ',
      interests: ['ইভেন্ট', 'পোর্ট্রেট', 'স্ট্রিট'],
      reason: 'Passionate about campus journalism and event photography.',
      paymentMethod: 'বিকাশ (bKash)',
      trxId: 'BKK' + Math.floor(100000 + Math.random() * 900000),
      status: 'Pending Verification'
    };

    applicants.push(demo);
    localStorage.setItem('dcpc_enrollments_db', JSON.stringify(applicants));
    renderTable(applicants);
    updateMetrics(applicants);
  });
});
