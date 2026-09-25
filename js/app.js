/**
 * Dhaka College Photography Club (DCPC)
 * Enrollment Form Logic & Google Sheet Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;
  const totalSteps = 5;

  const form = document.getElementById('enrollmentForm');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  const progressBar = document.getElementById('progress-bar');
  const stepCount = document.getElementById('step-count');
  const stepTitle = document.getElementById('step-title');
  const successCard = document.getElementById('successCard');
  
  // Payment Copy Button
  const copyBtn = document.getElementById('copyNumberBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const paymentNumber = document.getElementById('paymentNumber');

  // Same as Mobile Checkbox
  const sameAsMobile = document.getElementById('sameAsMobile');
  const mobileInput = document.getElementById('mobileInput');
  const whatsappInput = document.getElementById('whatsappInput');

  const stepTitles = [
    "Step 1: Personal details",
    "Step 2: Academic details",
    "Step 3: Contact details",
    "Step 4: Photography",
    "Step 5: Payment"
  ];

  // Initialize payment number from config if available
  if (window.DCPC_CONFIG && window.DCPC_CONFIG.PAYMENT_NUMBERS) {
    paymentNumber.innerText = window.DCPC_CONFIG.PAYMENT_NUMBERS.bKash;
  }

  // 1. Copy Payment Number
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const num = paymentNumber.innerText.trim();
      try {
        await navigator.clipboard.writeText(num);
        copyBtnText.innerText = "কপি হয়েছে! ✓";
        copyBtn.classList.add('bg-emerald-600', 'text-white');
        setTimeout(() => {
          copyBtnText.innerText = "নম্বর কপি করুন";
          copyBtn.classList.remove('bg-emerald-600', 'text-white');
        }, 2500);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = num;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyBtnText.innerText = "কপি হয়েছে! ✓";
        setTimeout(() => {
          copyBtnText.innerText = "নম্বর কপি করুন";
        }, 2500);
      }
    });
  }

  // 2. Same as Mobile Toggle
  if (sameAsMobile) {
    sameAsMobile.addEventListener('change', () => {
      if (sameAsMobile.checked) {
        whatsappInput.value = mobileInput.value;
      }
    });
    mobileInput.addEventListener('input', () => {
      if (sameAsMobile.checked) {
        whatsappInput.value = mobileInput.value;
      }
    });
  }

  // 3. Web Audio Camera Shutter Sound Effect
  function playShutterSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Click 1 (Mirror up)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.05);

      // Click 2 (Shutter curtain release)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(320, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
        gain2.gain.setValueAtTime(0.4, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.08);
      }, 70);
    } catch (e) {
      // Audio not permitted or supported, silent ignore
    }
  }

  // 4. Validate Current Step
  function validateStep(step) {
    const stepEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (!stepEl) return true;

    let isValid = true;
    const inputs = stepEl.querySelectorAll('input, select, textarea');

    // Reset error styling
    stepEl.querySelectorAll('.field-error').forEach(el => el.classList.add('hidden'));
    stepEl.querySelectorAll('.glass-input').forEach(el => el.classList.remove('border-red-500'));

    inputs.forEach(input => {
      // Check required text / select / textarea
      if (input.required && !input.value.trim()) {
        isValid = false;
        highlightError(input);
      }

      // Check BD Mobile format if applicable
      if (input.name === 'mobile' && input.value.trim()) {
        const bdPhoneRegex = /^01[3-9]\d{8}$/;
        if (!bdPhoneRegex.test(input.value.trim().replace(/\D/g, ''))) {
          isValid = false;
          highlightError(input);
        }
      }

      // Check Email format
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          highlightError(input);
        }
      }
    });

    // Special validation for radios in Step 4
    if (step === 4) {
      const deviceChecked = stepEl.querySelector('input[name="device"]:checked');
      if (!deviceChecked) {
        isValid = false;
        stepEl.querySelector('input[name="device"]').closest('.custom-pill').parentElement.nextElementSibling.classList.remove('hidden');
      }

      const experienceChecked = stepEl.querySelector('input[name="experience"]:checked');
      if (!experienceChecked) {
        isValid = false;
        stepEl.querySelector('input[name="experience"]').closest('.custom-pill').parentElement.nextElementSibling.classList.remove('hidden');
      }

      const interestsChecked = stepEl.querySelectorAll('input[name="interests"]:checked');
      if (interestsChecked.length === 0) {
        isValid = false;
        document.getElementById('interestsContainer').nextElementSibling.classList.remove('hidden');
      }
    }

    // Special validation for payment method in Step 5
    if (step === 5) {
      const methodChecked = stepEl.querySelector('input[name="paymentMethod"]:checked');
      if (!methodChecked) {
        isValid = false;
        stepEl.querySelector('input[name="paymentMethod"]').closest('.custom-pill').parentElement.nextElementSibling.classList.remove('hidden');
      }
    }

    return isValid;
  }

  function highlightError(input) {
    input.classList.add('border-red-500');
    const container = input.closest('div');
    if (container) {
      const err = container.querySelector('.field-error');
      if (err) err.classList.remove('hidden');
    }
  }

  // 5. Update Step View
  function showStep(step) {
    document.querySelectorAll('.form-step').forEach(el => {
      el.classList.add('hidden');
    });

    const activeEl = document.querySelector(`.form-step[data-step="${step}"]`);
    if (activeEl) {
      activeEl.classList.remove('hidden');
    }

    // Progress Bar & Labels
    const progressPercent = (step / totalSteps) * 100;
    progressBar.style.width = `${progressPercent}%`;
    stepCount.innerText = `${step} / ${totalSteps}`;
    stepTitle.innerText = stepTitles[step - 1];

    // Navigation buttons visibility
    if (step === 1) {
      prevBtn.classList.add('opacity-0', 'pointer-events-none');
    } else {
      prevBtn.classList.remove('opacity-0', 'pointer-events-none');
    }

    if (step === totalSteps) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }

    // Scroll smoothly to form container
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Next Button Click
  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      playShutterSound();
      currentStep++;
      showStep(currentStep);
    }
  });

  // Prev Button Click
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }
  });

  // 6. Form Submission (Send to Google Sheets)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateStep(5)) {
      return;
    }

    playShutterSound();

    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>যাচাই ও সংরক্ষণ করা হচ্ছে...</span>
    `;

    // Extract form data
    const formData = new FormData(form);
    const interests = [];
    document.querySelectorAll('input[name="interests"]:checked').forEach(cb => {
      interests.push(cb.value);
    });

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
    const refCode = 'DCPC-' + now.getFullYear().toString().slice(-2) + 
                    String(now.getMonth() + 1).padStart(2, '0') + 
                    String(now.getDate()).padStart(2, '0') + '-' + 
                    Math.floor(100 + Math.random() * 900);

    const submissionPayload = {
      timestamp: now.toISOString(),
      referenceId: refCode,
      nameBn: formData.get('nameBn') || '',
      nameEn: (formData.get('nameEn') || '').toUpperCase(),
      dob: formData.get('dob') || '',
      bloodGroup: formData.get('bloodGroup') || '',
      classYear: formData.get('classYear') || '',
      department: formData.get('department') || '',
      session: formData.get('session') || '',
      collegeRoll: formData.get('collegeRoll') || '',
      section: formData.get('section') || '',
      mobile: formData.get('mobile') || '',
      whatsapp: formData.get('whatsapp') || '',
      email: formData.get('email') || '',
      presentAddress: formData.get('presentAddress') || '',
      permanentAddress: formData.get('permanentAddress') || '',
      guardianInfo: formData.get('guardianInfo') || '',
      facebookLink: formData.get('facebookLink') || '',
      device: formData.get('device') || '',
      cameraModel: formData.get('cameraModel') || 'N/A',
      experience: formData.get('experience') || '',
      interests: interests,
      reason: formData.get('reason') || '',
      paymentMethod: formData.get('paymentMethod') || '',
      trxId: (formData.get('trxId') || '').toUpperCase().trim(),
      status: 'Pending Verification'
    };

    // Save to LocalStorage Backup
    try {
      const stored = JSON.parse(localStorage.getItem('dcpc_enrollments_db') || '[]');
      stored.push(submissionPayload);
      localStorage.setItem('dcpc_enrollments_db', JSON.stringify(stored));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Send to Google Sheets Apps Script
    const scriptUrl = window.DCPC_CONFIG?.GOOGLE_SHEET_WEB_APP_URL;
    if (scriptUrl && scriptUrl.startsWith('http')) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', // Standard Google Apps Script cross-origin submission
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionPayload)
        });
      } catch (err) {
        console.warn('Google Sheet submission fetch notice (saved to local backup):', err);
      }
    } else {
      console.log('Running in local backup mode. Configure GOOGLE_SHEET_WEB_APP_URL in js/config.js to sync live.');
    }

    // Populate Print Slip
    document.getElementById('slipRefId').innerText = refCode;
    document.getElementById('slipName').innerText = `${submissionPayload.nameEn} (${submissionPayload.nameBn})`;
    document.getElementById('slipRoll').innerText = `${submissionPayload.classYear} | Roll: ${submissionPayload.collegeRoll}`;
    document.getElementById('slipMobile').innerText = submissionPayload.mobile;
    document.getElementById('slipTrxId').innerText = submissionPayload.trxId;
    document.getElementById('slipDate').innerText = dateFormatted;

    // Show Success Card
    form.classList.add('hidden');
    document.querySelector('.viewfinder-box .text-xs.font-semibold')?.parentElement?.classList.add('hidden');
    successCard.classList.remove('hidden');

    if (window.lucide) {
      lucide.createIcons();
    }
  });
});
