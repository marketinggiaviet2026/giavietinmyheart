/**
 * GIAVIET IN MY HEART 2026 - OFFICIAL SCRIPT
 * Trung tâm Anh ngữ Gia Việt
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initStickyHeader();
  initMobileMenu();
  initClassLookup();
  initSocialCalculator();
  initRegistrationForm();
  initModal();
  initBackToTop();
  initQuickActions();
});

/* ===================================================================
   1. LIVE COUNTDOWN TIMER (Opening Registration Date: 21/10)
   =================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minutesEl = document.getElementById('minutesVal');
  const secondsEl = document.getElementById('secondsVal');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Target: 21 October 08:00:00
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetDate = new Date(targetYear, 9, 21, 8, 0, 0); // Month is 0-indexed: 9 = October

  // If already past this year's 21/10, target next year or keep active
  if (now > targetDate) {
    // If within competition range (21/10 to 30/11), show active countdown to next milestone (29/10 nộp bài or 20/11 đóng bình chọn)
    const subCloseDate = new Date(targetYear, 10, 20, 23, 59, 59); // 20/11
    if (now < subCloseDate) {
      targetDate = subCloseDate;
      const tag = document.querySelector('.countdown-tag');
      const title = document.querySelector('.countdown-title');
      if (tag) tag.innerHTML = '<i class="fa-solid fa-stopwatch"></i> Thời điểm đóng bình chọn';
      if (title) title.textContent = 'Đếm ngược đóng bình chọn (20/11)';
    } else {
      targetDate = new Date(targetYear + 1, 9, 21, 8, 0, 0);
    }
  }

  function update() {
    const currentTime = new Date().getTime();
    const distance = targetDate.getTime() - currentTime;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ===================================================================
   2. STICKY HEADER & SCROLL BEHAVIOR
   =================================================================== */
function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ===================================================================
   3. MOBILE NAVIGATION MENU
   =================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.getElementById('navLinks');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  // Close mobile menu on clicking any link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}

/* ===================================================================
   4. INTERACTIVE CLASS LOOKUP & AUTO-DETECT BOARD
   =================================================================== */
function initClassLookup() {
  const input = document.getElementById('classLookupInput');
  const btn = document.getElementById('classLookupBtn');
  const resultBox = document.getElementById('classLookupResult');

  if (!input || !btn || !resultBox) return;

  function evaluateClass(text) {
    const raw = text.trim().toLowerCase();
    if (!raw) return null;

    // Normalize
    const isFirstFriends = raw.includes('first friends') || raw.includes('ff 1') || raw.includes('ff1');
    const isFamilyFriends = raw.includes('family') || raw.includes('f&f') || raw.includes('fnf');
    const isGlobalTeens = raw.includes('global') || raw.includes('teens') || raw.includes('gt');

    if (isFirstFriends) {
      return { board: 'Kids', name: 'BẢNG KIDS', note: 'Từ First Friends 1A → Family & Friends 3C' };
    }

    if (isFamilyFriends) {
      // Check level 1, 2, 3 => Kids; 4, 5, 6 => Teens
      if (raw.match(/1[a-c]|2[a-c]|3[a-c]|ff1|ff2|ff3|lớp 1|lớp 2|lớp 3/)) {
        return { board: 'Kids', name: 'BẢNG KIDS', note: 'Từ First Friends 1A → Family & Friends 3C' };
      }
      if (raw.match(/4[a-c]|5[a-c]|6[a-c]|ff4|ff5|ff6|lớp 4|lớp 5|lớp 6/)) {
        return { board: 'Teens', name: 'BẢNG TEENS', note: 'Từ Family & Friends 4A → Global Teens 4B' };
      }
      // If just generic Family & Friends without level, prompt user
      return { board: 'Kids', name: 'BẢNG KIDS hoặc BẢNG TEENS', note: 'Cấp độ 1–3 thuộc bảng Kids, cấp độ 4 trở lên thuộc bảng Teens' };
    }

    if (isGlobalTeens) {
      return { board: 'Teens', name: 'BẢNG TEENS', note: 'Từ Family & Friends 4A → Global Teens 4B' };
    }

    // Default heuristics based on numbers
    if (raw.includes('kid') || raw.includes('mầm non') || raw.includes('tiểu học')) {
      return { board: 'Kids', name: 'BẢNG KIDS', note: 'Phù hợp lứa tuổi Nhi đồng & Tiểu học' };
    }

    return { board: 'Unknown', name: 'Cần xác nhận', note: 'Vui lòng liên hệ quầy tư vấn hoặc hotline 0292.3831.000 để được xếp bảng chuẩn xác nhất!' };
  }

  function handleCheck() {
    const val = input.value;
    const res = evaluateClass(val);

    if (!res) {
      resultBox.style.display = 'flex';
      resultBox.className = 'checker-result-box unknown';
      resultBox.innerHTML = '<i class="fa-solid fa-circle-info"></i> Ba mẹ hãy nhập tên lớp hoặc khóa con đang học (ví dụ: Family & Friends 2A, Global Teens 1...)';
      return;
    }

    resultBox.style.display = 'flex';
    if (res.board === 'Kids') {
      resultBox.className = 'checker-result-box kids';
      resultBox.innerHTML = `<i class="fa-solid fa-child-reaching" style="font-size: 1.3rem;"></i> <div>Lớp <strong>${val}</strong> thuộc <strong>${res.name}</strong> (${res.note}). Hãy đăng ký bảng Kids cho con nhé!</div>`;
    } else if (res.board === 'Teens') {
      resultBox.className = 'checker-result-box teens';
      resultBox.innerHTML = `<i class="fa-solid fa-user-graduate" style="font-size: 1.3rem;"></i> <div>Lớp <strong>${val}</strong> thuộc <strong>${res.name}</strong> (${res.note}). Hãy đăng ký bảng Teens cho con nhé!</div>`;
    } else {
      resultBox.className = 'checker-result-box unknown';
      resultBox.innerHTML = `<i class="fa-solid fa-circle-question" style="font-size: 1.3rem;"></i> <div>${res.note}</div>`;
    }
  }

  btn.addEventListener('click', handleCheck);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  });
}

/* ===================================================================
   5. LIVE FANPAGE SOCIAL SCORE CALCULATOR SIMULATOR
   =================================================================== */
function initSocialCalculator() {
  const likesInput = document.getElementById('calcLikes');
  const commentsInput = document.getElementById('calcComments');
  const sharesInput = document.getElementById('calcShares');
  const totalScoreEl = document.getElementById('calcTotalPoints');

  if (!likesInput || !commentsInput || !sharesInput || !totalScoreEl) return;

  function calculate() {
    const likes = parseInt(likesInput.value, 10) || 0;
    const comments = parseInt(commentsInput.value, 10) || 0;
    const shares = parseInt(sharesInput.value, 10) || 0;

    // Formula: 1 pt per like + 2 pts per comment + 3 pts per public share
    const total = (likes * 1) + (comments * 2) + (shares * 3);
    totalScoreEl.textContent = total.toLocaleString('vi-VN');
  }

  // Stepper buttons
  document.querySelectorAll('.calc-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const action = btn.dataset.action;
      const targetInput = document.getElementById(targetId);

      if (!targetInput) return;

      let val = parseInt(targetInput.value, 10) || 0;
      const step = targetId === 'calcLikes' ? 10 : 5;

      if (action === 'plus') {
        val += step;
      } else if (action === 'minus') {
        val = Math.max(0, val - step);
      }

      targetInput.value = val;
      calculate();
    });
  });

  [likesInput, commentsInput, sharesInput].forEach(inp => {
    inp.addEventListener('input', calculate);
  });

  calculate();
}

/* ===================================================================
   6. REGISTRATION FORM & CONFETTI CELEBRATION
   =================================================================== */
function initRegistrationForm() {
  const form = document.getElementById('contestRegisterForm');
  const classInput = document.getElementById('studentClass');
  const boardSelect = document.getElementById('targetBoard');
  const successAlert = document.getElementById('formSuccessAlert');

  if (!form) return;

  // Auto-fill target board when typing class
  if (classInput && boardSelect) {
    classInput.addEventListener('input', () => {
      const val = classInput.value.toLowerCase();
      if (val.includes('first') || val.includes('ff 1') || val.includes('ff 2') || val.includes('ff 3') || val.includes('friends 1') || val.includes('friends 2') || val.includes('friends 3')) {
        boardSelect.value = 'Kids';
      } else if (val.includes('teens') || val.includes('global') || val.includes('friends 4') || val.includes('friends 5') || val.includes('ff 4') || val.includes('ff 5')) {
        boardSelect.value = 'Teens';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('studentName')?.value.trim();
    const dob = document.getElementById('studentDob')?.value;
    const phone = document.getElementById('parentPhone')?.value.trim();
    const email = document.getElementById('parentEmail')?.value.trim();
    const sClass = document.getElementById('studentClass')?.value.trim();
    const board = document.getElementById('targetBoard')?.value;

    if (!name || !dob || !phone || !email || !sClass || !board) {
      alert('Quý phụ huynh vui lòng điền đầy đủ các mục thông tin bắt buộc (*)!');
      return;
    }

    // Trigger Firework Confetti
    fireCelebrationConfetti();

    // Show inline alert
    if (successAlert) {
      successAlert.style.display = 'flex';
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Open friendly popup modal
    const modal = document.getElementById('successModal');
    const modalMsg = document.getElementById('modalMsg');
    if (modal && modalMsg) {
      modalMsg.innerHTML = `
        Chúc mừng học viên <strong>${name}</strong> (Lớp <strong>${sClass}</strong> - <strong>Bảng ${board}</strong>) đã được đăng ký thành công vào cuộc thi <strong>"GiaViet in my heart"</strong>!<br><br>
        Quý phụ huynh hãy tham gia ngay <strong>Nhóm Zalo cuộc thi</strong> để nhận thông báo mới nhất từ Ban Tổ Chức:<br>
        👉 <a href="https://zalo.me/g/7v01nppsfdhtdlxkas2v" target="_blank" rel="noopener noreferrer" style="color: #0284c7; font-weight: 800; word-break: break-all;">https://zalo.me/g/7v01nppsfdhtdlxkas2v</a>
      `;
      modal.classList.add('active');
    }

    // Reset form after short delay
    form.reset();
  });
}

/* Confetti Burst Function */
function fireCelebrationConfetti() {
  if (typeof confetti === 'function') {
    // Left cannon
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.8 },
      colors: ['#2563eb', '#ec4899', '#38bdf8', '#fbbf24', '#f43f5e']
    });
    // Right cannon
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#2563eb', '#ec4899', '#38bdf8', '#fbbf24', '#f43f5e']
    });
    // Center stars
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        shapes: ['circle', 'square']
      });
    }, 250);
  }
}

/* ===================================================================
   7. MODAL HANDLING
   =================================================================== */
function initModal() {
  const modal = document.getElementById('successModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const okBtn = document.getElementById('modalOkBtn');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('active');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (okBtn) okBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ===================================================================
   8. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0.5';
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===================================================================
   9. QUICK ACTIONS (Zalo & Hotline)
   =================================================================== */
function handleZaloJoin(e) {
  if (e) e.preventDefault();
  window.open('https://zalo.me/g/7v01nppsfdhtdlxkas2v', '_blank', 'noopener,noreferrer');
}

function initQuickActions() {
  const zaloBtn = document.getElementById('joinZaloBtn');
  if (zaloBtn) {
    zaloBtn.addEventListener('click', handleZaloJoin);
  }

  const heroZaloBtn = document.getElementById('heroZaloBtn');
  if (heroZaloBtn) {
    heroZaloBtn.addEventListener('click', handleZaloJoin);
  }

  const callBtn = document.getElementById('callHotlineBtn');
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      window.location.href = 'tel:02923831000';
    });
  }
}

