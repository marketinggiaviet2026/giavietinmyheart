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
  initFaq();
});

/* ===================================================================
   1. LIVE COUNTDOWN TIMER ("Thời gian nhận sản phẩm dự thi")
   - Bắt đầu nhận bài: 29/10/2026
   - Đóng cổng bình chọn & nhận bài: 23:59 ngày 20/11/2026
   =================================================================== */
function initCountdown() {
  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minutesEl = document.getElementById('minutesVal');
  const secondsEl = document.getElementById('secondsVal');
  const titleEl = document.querySelector('.countdown-title');
  const subEl = document.querySelector('.countdown-sub');
  const pillEl = document.querySelector('.countdown-date-pill');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const now = new Date();
  const targetYear = 2026;

  // Milestone 1: Bắt đầu nộp sản phẩm dự thi (29/10/2026 00:00:00)
  // (Month is 0-indexed: 9 = October, 10 = November)
  const submitStartDate = new Date(targetYear, 9, 29, 0, 0, 0);

  // Milestone 2: Đóng cổng bình chọn & nhận bài (20/11/2026 23:59:59)
  const closeVoteDate = new Date(targetYear, 10, 20, 23, 59, 59);

  let targetDate;
  if (now < submitStartDate) {
    // Đang đếm ngược đến ngày bắt đầu nộp bài (29/10/2026)
    targetDate = submitStartDate;
    if (titleEl) {
      titleEl.innerHTML = '<i class="fa-solid fa-stopwatch countdown-title-icon"></i> THỜI GIAN NHẬN SẢN PHẨM DỰ THI';
    }
    if (pillEl) {
      pillEl.innerHTML = '<i class="fa-regular fa-calendar-check"></i> Bắt đầu nộp bài: 29/10';
    }
    if (subEl) {
      subEl.innerHTML = 'Thời gian bắt đầu nộp sản phẩm dự thi: <strong>29/10/2026</strong>. Cổng bình chọn sẽ chính thức đóng vào lúc <strong>23:59 ngày 20/11/2026</strong>!';
    }
  } else if (now < closeVoteDate) {
    // Đang trong thời gian nộp bài, đếm ngược đến lúc đóng cổng bình chọn (20/11/2026 23:59:59)
    targetDate = closeVoteDate;
    if (titleEl) {
      titleEl.innerHTML = '<i class="fa-solid fa-stopwatch countdown-title-icon"></i> THỜI GIAN NHẬN SẢN PHẨM DỰ THI';
    }
    if (pillEl) {
      pillEl.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> Đóng cổng bình chọn: 23:59 ngày 20/11';
    }
    if (subEl) {
      subEl.innerHTML = 'Cổng nhận sản phẩm và bình chọn đang mở! Hạn chót đóng cổng lúc <strong>23:59 ngày 20/11/2026</strong>.';
    }
  } else {
    // Đã kết thúc
    targetDate = now;
    if (titleEl) {
      titleEl.innerHTML = '<i class="fa-solid fa-flag-checkered countdown-title-icon"></i> ĐÃ ĐÓNG CỔNG BÌNH CHỌN & NHẬN BÀI';
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
   4. INTERACTIVE CLASS LOOKUP & AUTO-DETECT BOARD (Kids, Teens+ADU, Staff)
   =================================================================== */
function initClassLookup() {
  const input = document.getElementById('classLookupInput');
  const btn = document.getElementById('classLookupBtn');
  const resultBox = document.getElementById('classLookupResult');

  if (!input || !btn || !resultBox) return;

  function evaluateClass(text) {
    const raw = text.trim().toLowerCase();
    if (!raw) return null;

    // 1. Kiểm tra Giáo viên & Nhân viên
    if (raw.includes('giáo viên') || raw.includes('giao vien') || raw.includes('nhân viên') ||
        raw.includes('nhan vien') || raw.includes('teacher') || raw.includes('staff') ||
        raw.includes('gv') || raw.includes('nv') || raw.includes('cán bộ') || raw.includes('can bo')) {
      return {
        board: 'Staff',
        name: 'BẢNG TEACHER & STAFF',
        note: 'Dành riêng cho Giáo viên & Nhân viên Hệ thống Anh ngữ Gia Việt'
      };
    }

    // 2. Normalize and check Teens + ADU (EFT-Foundation 1 đến IELTS, Global Teens, FF 4-6)
    const isEftFoundation = raw.includes('eft') || raw.includes('foundation');
    const isIelts = raw.includes('ielts');
    const isToeic = raw.includes('toeic');
    const isAdult = raw.includes('adu') || raw.includes('adult') || raw.includes('giao tiếp') || raw.includes('giao tiep');
    const isGlobalTeens = raw.includes('global') || raw.includes('teens') || raw.includes('gt');

    if (isEftFoundation || isIelts || isToeic || isAdult || isGlobalTeens) {
      return {
        board: 'Teens',
        name: 'BẢNG TEENS + ADU',
        note: 'Học viên các lớp từ EFT-Foundation 1 đến lớp IELTS'
      };
    }

    // 3. Family & Friends checks
    const isFamilyFriends = raw.includes('family') || raw.includes('f&f') || raw.includes('fnf') || raw.includes('ff');
    if (isFamilyFriends) {
      // Check 4, 5, 6 => Teens + ADU
      if (raw.match(/4[a-c]|5[a-c]|6[a-c]|ff4|ff5|ff6|lớp 4|lớp 5|lớp 6|level 4|level 5|level 6/)) {
        return {
          board: 'Teens',
          name: 'BẢNG TEENS + ADU',
          note: 'Học viên các lớp từ EFT-Foundation 1 đến lớp IELTS'
        };
      }
      // Check 1, 2, 3 => Kids
      if (raw.match(/1[a-c]|2[a-c]|3[a-c]|ff1|ff2|ff3|lớp 1|lớp 2|lớp 3|level 1|level 2|level 3/)) {
        return {
          board: 'Kids',
          name: 'BẢNG KIDS',
          note: 'Từ First Friends 1A → Family & Friends 3C'
        };
      }
      return {
        board: 'Kids',
        name: 'BẢNG KIDS hoặc BẢNG TEENS + ADU',
        note: 'Cấp độ 1–3 thuộc bảng Kids, cấp độ 4 trở lên thuộc bảng Teens + ADU'
      };
    }

    // 4. First Friends checks
    const isFirstFriends = raw.includes('first friends') || raw.includes('first');
    if (isFirstFriends) {
      return {
        board: 'Kids',
        name: 'BẢNG KIDS',
        note: 'Từ First Friends 1A → Family & Friends 3C'
      };
    }

    // Default heuristics based on keywords
    if (raw.includes('kid') || raw.includes('mầm non') || raw.includes('tiểu học')) {
      return {
        board: 'Kids',
        name: 'BẢNG KIDS',
        note: 'Phù hợp lứa tuổi Nhi đồng & Tiểu học'
      };
    }

    return {
      board: 'Unknown',
      name: 'Cần xác nhận',
      note: 'Vui lòng liên hệ quầy tư vấn hoặc hotline 0292.3831.000 để được xếp bảng chuẩn xác nhất!'
    };
  }

  function handleCheck() {
    const val = input.value;
    const res = evaluateClass(val);

    if (!res) {
      resultBox.style.display = 'flex';
      resultBox.className = 'checker-result-box unknown';
      resultBox.innerHTML = '<i class="fa-solid fa-circle-info"></i> Quý phụ huynh hoặc Thầy Cô hãy nhập tên lớp/khóa học hoặc chức danh (ví dụ: Family & Friends 2A, IELTS 5.5, Giáo viên...)';
      return;
    }

    resultBox.style.display = 'flex';
    if (res.board === 'Kids') {
      resultBox.className = 'checker-result-box kids';
      resultBox.innerHTML = `<i class="fa-solid fa-child-reaching" style="font-size: 1.3rem;"></i> <div>Lớp/Khóa <strong>${val}</strong> thuộc <strong>${res.name}</strong> (${res.note}). Hãy đăng ký bảng Kids nhé!</div>`;
    } else if (res.board === 'Teens') {
      resultBox.className = 'checker-result-box teens';
      resultBox.innerHTML = `<i class="fa-solid fa-user-graduate" style="font-size: 1.3rem;"></i> <div>Lớp/Khóa <strong>${val}</strong> thuộc <strong>${res.name}</strong> (${res.note}). Hãy đăng ký bảng Teens + ADU nhé!</div>`;
    } else if (res.board === 'Staff') {
      resultBox.className = 'checker-result-box teens';
      resultBox.style.borderColor = '#c4b5fd';
      resultBox.style.background = '#f5f3ff';
      resultBox.style.color = '#6b21a8';
      resultBox.innerHTML = `<i class="fa-solid fa-chalkboard-user" style="font-size: 1.3rem; color: #7c3aed;"></i> <div>Đội ngũ <strong>${val}</strong> thuộc <strong>${res.name}</strong> (${res.note}). Chào mừng Thầy Cô & Anh Chị tham gia!</div>`;
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

/* ===================================================================
   10. FAQ / Q&A CARDS INTERACTION ("Giải đáp thắc mắc")
   =================================================================== */
function initFaq() {
  const cards = document.querySelectorAll('.faq-card-simple, .faq-card');
  const toggleAllBtn = document.getElementById('faqToggleAllBtn');
  const toggleAllText = document.getElementById('faqToggleAllText');
  const searchInput = document.getElementById('faqSearchInput');
  const searchClear = document.getElementById('faqSearchClear');
  const filterPills = document.querySelectorAll('#faqFilterPills button');
  const countStatus = document.getElementById('faqCountStatus');
  const noResults = document.getElementById('faqNoResults');

  if (!cards.length) return;

  // Mở sẵn câu đầu tiên để người dùng thấy tương tác
  if (cards[0]) {
    cards[0].classList.add('open');
    const h0 = cards[0].querySelector('.faq-header-simple, .faq-card-header');
    if (h0) h0.setAttribute('aria-expanded', 'true');
  }

  // Sự kiện bấm mở/đóng từng thẻ câu hỏi
  cards.forEach(card => {
    const header = card.querySelector('.faq-header-simple, .faq-card-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      if (isOpen) {
        card.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
      updateToggleAllBtnState();
    });
  });

  function updateToggleAllBtnState() {
    if (!toggleAllBtn || !toggleAllText) return;
    const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
    if (!visibleCards.length) return;
    const allOpen = visibleCards.every(c => c.classList.contains('open'));
    if (allOpen) {
      toggleAllText.textContent = 'Thu gọn';
      const icon = toggleAllBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-chevron-up';
    } else {
      toggleAllText.textContent = 'Mở tất cả';
      const icon = toggleAllBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-chevron-down';
    }
  }

  // Nút mở tất cả / thu gọn tất cả
  if (toggleAllBtn) {
    toggleAllBtn.addEventListener('click', () => {
      const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
      const allOpen = visibleCards.every(c => c.classList.contains('open'));
      visibleCards.forEach(c => {
        const header = c.querySelector('.faq-header-simple, .faq-card-header');
        if (allOpen) {
          c.classList.remove('open');
          if (header) header.setAttribute('aria-expanded', 'false');
        } else {
          c.classList.add('open');
          if (header) header.setAttribute('aria-expanded', 'true');
        }
      });
      updateToggleAllBtnState();
    });
  }

  let activeCategory = 'all';

  // Bộ lọc danh mục (Tabs)
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter') || 'all';
      applyFilterAndSearch();
    });
  });

  function removeVietnameseTones(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase();
  }

  function applyFilterAndSearch() {
    const rawQuery = searchInput ? searchInput.value.trim() : '';
    const query = removeVietnameseTones(rawQuery);

    if (searchClear) {
      searchClear.style.display = rawQuery.length > 0 ? 'inline-flex' : 'none';
    }

    let matchCount = 0;

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const categoryMatches = activeCategory === 'all' || cardCategory === activeCategory;

      if (!categoryMatches) {
        card.style.display = 'none';
        return;
      }

      if (!query) {
        card.style.display = 'block';
        matchCount++;
        return;
      }

      const qText = removeVietnameseTones(card.querySelector('.faq-title-simple, .faq-question-text')?.textContent || '');
      const aText = removeVietnameseTones(card.querySelector('.faq-answer-simple, .faq-answer-content')?.textContent || '');
      const stt = card.getAttribute('data-stt') || '';

      const textMatches = qText.includes(query) || aText.includes(query) || stt === query;

      if (textMatches) {
        card.style.display = 'block';
        card.classList.add('open');
        const header = card.querySelector('.faq-header-simple, .faq-card-header');
        if (header) header.setAttribute('aria-expanded', 'true');
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countStatus) {
      countStatus.innerHTML = `Hiển thị <strong>${matchCount}</strong> / 28 câu`;
    }

    if (noResults) {
      noResults.style.display = matchCount === 0 ? 'block' : 'none';
    }

    updateToggleAllBtnState();
  }

  // Ô tìm kiếm câu hỏi
  if (searchInput) {
    searchInput.addEventListener('input', applyFilterAndSearch);
  }

  // Nút xóa tìm kiếm
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      applyFilterAndSearch();
    });
  }
}


