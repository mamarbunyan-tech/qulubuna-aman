/**
 * مبادرة «قلوبنا أمان» — مدرسة متوسطة 92
 * الموجهة الطلابية: إيمان العمري | مديرة المدرسة: سارة الكلثم
 * نظام تفاعلي ذكي يشمل: محرك أصوات، أنيميشن، جدارية تفاعلية، وشهادات معتمدة
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. نظام الصوت التفاعلي (Web Audio API Synthesizer)
  // =========================================================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // نغمة بسيطة ومرنة
  function playBeep(freq, type, duration, delay = 0, volume = 0.15) {
    if (!isSoundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      const startTime = audioCtx.currentTime + delay;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      // Audio not permitted yet
    }
  }

  // أصوات المبادرة المميزة
  const SFX = {
    click: function () {
      playBeep(520, 'sine', 0.08, 0, 0.12);
    },
    star: function () {
      // نغمة هارب صاعدة متلألئة
      playBeep(523.25, 'triangle', 0.22, 0, 0.18); // C5
      playBeep(659.25, 'triangle', 0.24, 0.1, 0.2); // E5
      playBeep(783.99, 'triangle', 0.28, 0.2, 0.22); // G5
      playBeep(1046.50, 'triangle', 0.45, 0.32, 0.25); // C6
    },
    success: function () {
      // نغمة إنجاز دافئة
      playBeep(440.00, 'sine', 0.2, 0, 0.18);
      playBeep(554.37, 'sine', 0.25, 0.12, 0.2);
      playBeep(659.25, 'sine', 0.4, 0.24, 0.22);
    },
    fanfare: function () {
      // احتفال فتح الشهادة
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((f, idx) => {
        playBeep(f, 'triangle', 0.4, idx * 0.12, 0.22);
      });
    },
    heartbeat: function () {
      // نبض القلب للتعهد والميثاق
      playBeep(120, 'sine', 0.18, 0, 0.3);
      playBeep(95, 'sine', 0.25, 0.2, 0.35);
    },
    stamp: function () {
      // صوت الختم الرسمي
      playBeep(85, 'sine', 0.35, 0, 0.4);
      playBeep(140, 'triangle', 0.25, 0.04, 0.25);
    },
    guidance: function () {
      // صوت التنبيه اللطيف
      playBeep(330, 'sine', 0.22, 0, 0.15);
      playBeep(392, 'sine', 0.3, 0.12, 0.15);
    }
  };

  // تبديل الصوت
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      isSoundEnabled = !isSoundEnabled;
      soundBtn.classList.toggle('muted', !isSoundEnabled);
      const textSpan = soundBtn.querySelector('.sound-btn-text');
      if (textSpan) {
        textSpan.textContent = isSoundEnabled ? 'الأصوات مفعلة' : 'الأصوات مكتومة';
      }
      if (isSoundEnabled) {
        SFX.click();
      }
    });
  }

  // تفعيل محرك الصوت بسلاسة عند أول لمس أو تفاعل على كافة الأجهزة وخاصة هواتف iPhone (iOS Safari)
  function unlockAudio() {
    initAudio();
    ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(ev => {
      document.removeEventListener(ev, unlockAudio);
    });
  }
  ['click', 'touchstart', 'touchend', 'pointerdown'].forEach(ev => {
    document.addEventListener(ev, unlockAudio, { passive: true, once: true });
  });


  // =========================================================================
  // 2. محرك الجسيمات التفاعلية الخلفية (Ambient Canvas)
  // =========================================================================
  const canvas = document.getElementById('ambientCanvas');
  let ctx = null;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  if (canvas) {
    ctx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const symbols = ['♥', '★', '🌿', '✦', '🌸'];
    const colors = ['rgba(207,115,107,0.4)', 'rgba(212,159,63,0.38)', 'rgba(68,126,95,0.35)', 'rgba(232,149,142,0.35)'];

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 14 + 10,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: (Math.random() - 0.5) * 0.6 - 0.2,
        char: symbols[Math.floor(Math.random() * symbols.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.x < -30) p.x = canvas.width + 30;
        if (p.x > canvas.width + 30) p.x = -30;
        if (p.y < -30) p.y = canvas.height + 30;
        if (p.y > canvas.height + 30) p.y = -30;

        // تفاعل خفيف مع مؤشر الماوس
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 3;
          p.y += (dy / dist) * force * 3;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px "Tajawal", serif`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      }
      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }


  // =========================================================================
  // 3. محرك الألعاب النارية والقصاصات الملونة (Confetti FX)
  // =========================================================================
  function launchConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 3) {
    const confettiCanvas = document.createElement('canvas');
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.inset = '0';
    confettiCanvas.style.width = '100vw';
    confettiCanvas.style.height = '100vh';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '99999';
    document.body.appendChild(confettiCanvas);

    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const cctx = confettiCanvas.getContext('2d');

    const confettiPieces = [];
    const colors = ['#2d5e46', '#cf736b', '#d49f3f', '#447e5f', '#e8958e', '#f5c871', '#3b82f6'];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      confettiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.4 ? 'rect' : 'heart',
        life: 1,
        decay: Math.random() * 0.015 + 0.012
      });
    }

    function animateConfetti() {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let aliveCount = 0;

      for (const p of confettiPieces) {
        if (p.life <= 0) continue;
        aliveCount++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.vx *= 0.98; // air resistance
        p.rotation += p.rotationSpeed;
        p.life -= p.decay;

        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation * Math.PI) / 180);
        cctx.globalAlpha = Math.max(0, p.life);
        cctx.fillStyle = p.color;

        if (p.shape === 'heart') {
          cctx.font = `${p.size * 1.6}px sans-serif`;
          cctx.textAlign = 'center';
          cctx.textBaseline = 'middle';
          cctx.fillText('♥', 0, 0);
        } else {
          cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        }
        cctx.restore();
      }

      if (aliveCount > 0) {
        requestAnimationFrame(animateConfetti);
      } else {
        confettiCanvas.remove();
      }
    }
    animateConfetti();
  }


  // =========================================================================
  // 4. نظام تقدم رحلة النجوم الخمس (Stars & Milestones Journey)
  // =========================================================================
  const STORAGE_KEY = 'qulubuna_aman_progress_v2';
  let state = {
    stars: 0,
    steps: {
      bullying: false,
      situations: false,
      kindness: false,
      pledge: false,
      wall: false
    },
    studentName: ''
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.stars === 'number') {
        state = { ...state, ...parsed };
      }
    }
  } catch (e) {}

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function awardStep(stepKey) {
    if (!state.steps[stepKey]) {
      state.steps[stepKey] = true;
      if (state.stars < 5) {
        state.stars++;
      }
      saveState();
      updateUI();
      SFX.star();
      launchConfetti();
      return true;
    }
    return false;
  }

  function updateUI() {
    // 1. تحديث النجوم
    for (let i = 1; i <= 5; i++) {
      const slot = document.getElementById(`starSlot${i}`);
      if (slot) {
        slot.classList.toggle('earned', i <= state.stars);
        slot.textContent = i <= state.stars ? '★' : '☆';
      }
    }

    // 2. شارة الهيدر
    const miniStars = document.getElementById('headerStarsText');
    if (miniStars) {
      miniStars.textContent = `${state.stars}/٥ نجوم`;
    }

    // 3. شريط التقدم
    const percent = state.stars * 20;
    const bar = document.getElementById('progressBarFill');
    if (bar) {
      bar.style.width = `${percent}%`;
    }

    // 4. نصوص الحالة
    const statusText = document.getElementById('progressStatusText');
    if (statusText) {
      if (state.stars === 5) {
        statusText.innerHTML = '🎉 <b style="color:var(--primary)">ألف مبارك! اكتملت رحلتكِ للأمان (٥ من ٥)</b>. يمكنكِ الآن استلام شهادتكِ المعتمدة.';
      } else {
        statusText.innerHTML = `أحرزتِ <b>${state.stars} من ٥ نجوم</b>. أكملي الأنشطة لتفتحي وسام وشهادة الأمان المعتمدة.`;
      }
    }

    // 5. خطوات الرحلة
    const stepChips = {
      bullying: 'chipBullying',
      situations: 'chipSituations',
      kindness: 'chipKindness',
      pledge: 'chipPledge',
      wall: 'chipWall'
    };
    for (const [key, id] of Object.entries(stepChips)) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('done', Boolean(state.steps[key]));
      }
    }

    // 6. زر الشهادة
    const certBtn = document.getElementById('certificateTriggerBtn');
    if (certBtn) {
      if (state.stars >= 5) {
        certBtn.disabled = false;
        certBtn.innerHTML = '👑 افتحي شهادة التكريم الرسمية ♥';
        certBtn.classList.remove('btn-outline');
        certBtn.classList.add('btn-gold');
      } else {
        certBtn.disabled = true;
        certBtn.innerHTML = `اجمعي ٥ نجوم لفتح الشهادة (${state.stars}/٥)`;
        certBtn.classList.remove('btn-gold');
        certBtn.classList.add('btn-outline');
      }
    }

    // 7. عداد الإحصائيات وشارة الجوال
    const statStars = document.getElementById('statStarsCount');
    if (statStars) {
      statStars.textContent = `${state.stars} / 5`;
    }
    const mobBadge = document.getElementById('mobStarsBadge');
    if (mobBadge) {
      mobBadge.textContent = `${state.stars}/5`;
    }
  }


  // =========================================================================
  // 5. نظام النوافذ المنبثقة التفاعلية (Modal System)
  // =========================================================================
  const modalOverlay = document.getElementById('modalOverlay');
  const modalContentArea = document.getElementById('modalContentArea');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(html) {
    if (!modalOverlay || !modalContentArea) return;
    modalContentArea.innerHTML = html;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    SFX.click();
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    SFX.click();
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });


  // =========================================================================
  // 6. محتوى الأنشطة التفاعلية والتربوية (Educational Modules)
  // =========================================================================

  // النشاط 1: مقياس «هل هذا تنمّر؟»
  function openBullyingQuiz() {
    const questions = [
      {
        text: 'طالبة في المجموعة تتعمد استبعاد زميلتها كل يوم وتقول للجميع: "لا تجلسن معها".',
        isBullying: true,
        reason: 'هذا <b>تنمر اجتماعي</b> متكرر ومقصود يهدف إلى عزل الطالبة وإشعارها بالضعف.'
      },
      {
        text: 'اختلفت صديقتان حول فكرة مشروع مدرسي، وعلت أصواتهما لكن انتهى الموقف بحوار وتفاهم.',
        isBullying: false,
        reason: 'هذا <b>خلاف طبيعي عابر</b> بين طرفين متكافئين يمكن حله بهدوء واحترام دون قصد الأذى.'
      },
      {
        text: 'كتابة تعليق ساخر متكرر عن مظهر طالبة في قروب الواتساب وتكرار الضحك عليها.',
        isBullying: true,
        reason: 'هذا <b>تنمر لفظي وإلكتروني</b>؛ المزاح الذي يؤلم الآخرين ليس مزاحاً بل أذى.'
      }
    ];

    let currentQ = 0;

    function renderQuestion() {
      const q = questions[currentQ];
      return `
        <div class="modal-quiz">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="eyebrow-tag" style="margin:0;">🌱 مقياس الوعي المدرسي</span>
            <span style="font-weight:bold; color:var(--primary); font-size:0.9rem;">حالة ${currentQ + 1} من ${questions.length}</span>
          </div>
          <h2>هل هذا تنمّر أم خلاف عابر؟</h2>
          <div style="background:var(--bg-card-alt); border:1.5px solid var(--border); border-radius:var(--radius-md); padding:20px; margin:16px 0; font-size:1.15rem; font-weight:700; color:var(--primary-dark); line-height:1.7;">
            « ${q.text} »
          </div>
          <p style="margin-bottom:15px; color:var(--text-muted);">حللي الموقف واختاري التصنيف التربوي الصحيح:</p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button class="btn-outline quiz-answer-btn" data-choice="true" style="border-color:#e8a29b; color:#a34239;">🚨 نعم، هذا تنمّر</button>
            <button class="btn-outline quiz-answer-btn" data-choice="false" style="border-color:#9abfa5; color:#275b3c;">🤝 لا، هذا خلاف أو موقف عابر</button>
          </div>
          <div id="quizFeedbackArea" style="margin-top:16px;"></div>
        </div>
      `;
    }

    openModal(renderQuestion());

    modalContentArea.onclick = (e) => {
      const btn = e.target.closest('.quiz-answer-btn');
      if (btn) {
        const choice = btn.dataset.choice === 'true';
        const q = questions[currentQ];
        const isCorrect = choice === q.isBullying;
        const feedback = document.getElementById('quizFeedbackArea');

        if (isCorrect) {
          SFX.success();
          feedback.innerHTML = `
            <div class="feedback-banner success">
              <b>إجابة ممتازة ووعي رائع! 👏</b>
              <p style="margin:6px 0 0;">${q.reason}</p>
            </div>
            <button id="nextQuizBtn" class="btn-primary" style="width:100%; margin-top:10px;">
              ${currentQ + 1 < questions.length ? 'انتقلي للحالة التالية ←' : '✨ أكملت المقياس! اكسبِ نجمة الأمان'}
            </button>
          `;
          document.querySelectorAll('.quiz-answer-btn').forEach(b => b.disabled = true);
          document.getElementById('nextQuizBtn').onclick = () => {
            currentQ++;
            if (currentQ < questions.length) {
              modalContentArea.innerHTML = renderQuestion();
            } else {
              awardStep('bullying');
              openSuccessModal('وعيكِ حماية لكِ ولصديقاتكِ!', 'أكملتِ مقياس التنمّر بنجاح وفهمتِ الفرق بدقة. تمت إضافة النجمة الأولى ⭐ إلى رصيدكِ.');
            }
          };
        } else {
          SFX.guidance();
          feedback.innerHTML = `
            <div class="feedback-banner notice">
              <b>فكّري مجدداً بروية 💡:</b>
              <p style="margin:6px 0 0;">تذكري: التنمّر يتصف بـ (التكرار، القصد بالإيذاء، واختلال القوة). جربي اختيار الإجابة الأخرى.</p>
            </div>
          `;
        }
      }
    };
  }

  // النشاط 2: محاكي القرارات «ماذا لو كنتِ مكاني؟»
  function openSituationsSimulator() {
    const scenarios = [
      {
        title: 'موقف في قروب الواتساب المدرسي 💬',
        desc: 'أرسلت إحدى الزميلات صورة لطالبة غائبة وأرفقت معها عبارة استهزاء وسخرية، وبدأت الردود بالضحك.',
        choices: [
          {
            text: 'أرسل ملصقاً وأشارك الضحك حتى لا أكون غريبة بينهن.',
            correct: false,
            msg: 'المشاركة في الضحك تُشجع المعتدي وتضاعف ألم الطالبة. تذكري: الصمت أو مجاملة الخطأ يصنع بيئة غير آمنة.'
          },
          {
            text: 'أكتب في القروب بلطف وحزم: "يا بنات هذا ما يليق بنا، خلونا نحذف الرسالة"، وأبلغ الموجهة الطلابية.',
            correct: true,
            msg: 'موقف شجاع وبطولي! كلمة واحدة حازمة ولطيفة قد توقف الإساءة وتلهم الزميلات لحذفها.'
          }
        ]
      },
      {
        title: 'موقف في ساحة المدرسة أثناء الفسحة 🌿',
        desc: 'طالبة جديدة في المدرسة تقف وحيدة في الزاوية، وهناك زميلات يتهامسن ويشرن إليها بسخرية.',
        choices: [
          {
            text: 'أقترب منها بابتسامة، أحييها، وأدعوها لتناول الإفطار معنا ومشاركتنا.',
            correct: true,
            msg: 'صنيع نبيل يعكس كرم أخلاقكِ! الاحتواء والإحسان يحطمان التهميش ويشعران الزميلة الجديدة بالأمان.'
          },
          {
            text: 'أتجاهل الأمر تماماً لأنني لا أعرفها.',
            correct: false,
            msg: 'التجاهل يترك الطالبة فريسة للوحدة والألم. التفاتة بسيطة منكِ تصنع فرقاً لا يُنسى في يومها.'
          }
        ]
      }
    ];

    let currentS = 0;

    function renderScenario() {
      const s = scenarios[currentS];
      return `
        <div class="modal-sim">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="eyebrow-tag" style="margin:0;">💬 محاكي المواقف</span>
            <span style="font-weight:bold; color:var(--primary); font-size:0.9rem;">موقف ${currentS + 1} من ${scenarios.length}</span>
          </div>
          <h2>${s.title}</h2>
          <div style="background:var(--bg-card-alt); border:1.5px solid var(--border); border-radius:var(--radius-md); padding:18px; margin:16px 0; font-size:1.05rem; color:var(--primary-dark); line-height:1.7;">
            ${s.desc}
          </div>
          <p style="font-weight:700; color:var(--primary); margin-bottom:10px;">ما هو تصرفكِ الأفضل والأكثر شجاعة؟</p>
          <div class="sim-choices">
            ${s.choices.map((c, i) => `
              <button class="modal-choice-btn sim-choice-btn" data-idx="${i}">
                ${c.text}
              </button>
            `).join('')}
          </div>
          <div id="simFeedbackArea"></div>
        </div>
      `;
    }

    openModal(renderScenario());

    modalContentArea.onclick = (e) => {
      const btn = e.target.closest('.sim-choice-btn');
      if (btn) {
        const idx = parseInt(btn.dataset.idx, 10);
        const s = scenarios[currentS];
        const choice = s.choices[idx];
        const feedback = document.getElementById('simFeedbackArea');

        if (choice.correct) {
          SFX.success();
          feedback.innerHTML = `
            <div class="feedback-banner success">
              <b>اختيار حكيم ومسؤول! 🌟</b>
              <p style="margin:6px 0 0;">${choice.msg}</p>
            </div>
            <button id="nextSimBtn" class="btn-primary" style="width:100%; margin-top:10px;">
              ${currentS + 1 < scenarios.length ? 'الموقف التالي ←' : '🎉 اكسبِ نجمة المحاكاة والأمان'}
            </button>
          `;
          document.querySelectorAll('.sim-choice-btn').forEach(b => b.disabled = true);
          document.getElementById('nextSimBtn').onclick = () => {
            currentS++;
            if (currentS < scenarios.length) {
              modalContentArea.innerHTML = renderScenario();
            } else {
              awardStep('situations');
              openSuccessModal('شجاعتكِ تصنع الأمان!', 'أثبتِ قدرتكِ على اختيار اللطف والمساندة في المواقف الصعبة. تمت إضافة نجمة الأمان الثانية ⭐!');
            }
          };
        } else {
          SFX.guidance();
          feedback.innerHTML = `
            <div class="feedback-banner notice">
              <b>تأملي أثر هذا القرار:</b>
              <p style="margin:6px 0 0;">${choice.msg}</p>
            </div>
          `;
        }
      }
    };
  }

  // النشاط 3: تحدي اللطف المدرسي «شجرة اللطف المثمرة»
  function openKindnessChallenge() {
    const challenges = [
      { id: 1, title: 'رسالة امتنان خفية 💌', desc: 'اكتبي بطاقة شكر قصيرة لمعلمة أو عاملة المدرسة وضعيها في مكان لطيف.' },
      { id: 2, title: 'ابتسامة وكلمة ترحيبية 🌸', desc: 'ألقِ التحية بابتسامة دافئة على زميلة لم تعتادي الحديث معها من قبل.' },
      { id: 3, title: 'يد العون والمشاركة 📚', desc: 'ساندي زميلتكِ في حمل حقيبتها أو مشاركتها قلماً أو مساندتها في فهم مسألة.' },
      { id: 4, title: 'درع الدفاع عن الغائبة 🛡️', desc: 'إذا ذُكرت زميلة بغيبة أو تقليل، قولي بلطف: "اذكروها بالخير، ما ترضى لنفسك هذا الكلام".' }
    ];

    const html = `
      <div class="modal-kindness">
        <span class="eyebrow-tag">☀️ شجرة اللطف اليومية</span>
        <h2>اختاري تحدي اللطف الخاص بكِ</h2>
        <p>اللطف معدٍ… خطوة صغيرة تصنع أثراً يمتد في أروقة مدرستنا. اختاري تحدياً لتنفيذه اليوم:</p>
        <div style="display:grid; grid-template-columns:1fr; gap:12px; margin:20px 0;">
          ${challenges.map(c => `
            <div class="kindness-quest-card" style="background:#fff; border:1.5px solid var(--border); border-radius:var(--radius-md); padding:18px; text-align:right; transition:all 0.25s; cursor:pointer;" data-id="${c.id}">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <b style="font-size:1.1rem; color:var(--primary-dark);">${c.title}</b>
                <span style="font-size:1.4rem;">🌱</span>
              </div>
              <p style="margin:6px 0 12px; font-size:0.95rem; color:var(--text-muted);">${c.desc}</p>
              <button class="btn-outline accept-quest-btn" style="padding:8px 18px; font-size:0.88rem; width:100%;">
                أنا قبلت هذا التحدي وسأنفذه اليوم ✓
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    openModal(html);

    modalContentArea.onclick = (e) => {
      const btn = e.target.closest('.accept-quest-btn');
      if (btn) {
        awardStep('kindness');
        openSuccessModal('أنتِ منارة للطف في مدرستنا!', 'عقدتِ العزم على نشر الجمال والمساندة. تمت إضافة نجمة اللطف الثالثة ⭐!');
      }
    };
  }

  // النشاط 4: ميثاق قلوبنا أمان
  function openPledgeModal() {
    const html = `
      <div class="modal-pledge" style="text-align:center;">
        <span class="eyebrow-tag">📜 ميثاق الشرف المدرسي</span>
        <h2 style="margin:10px 0 15px;">ميثاق «قلوبنا أمان» ♥</h2>
        <div style="background:#fff; border:2px dashed var(--primary-border); border-radius:var(--radius-md); padding:25px; text-align:right; margin:18px 0; font-size:1.05rem; line-height:1.9; color:var(--primary-dark);">
          <p>أنا طالبة مدرسة <b>متوسطة 92</b>، أؤمن بأن لكل فتاة حقاً في بيئة مدرسية آمنة يسودها الاحترام، وأتعهد أمام الله ثم نفسي بما يلي:</p>
          <ul style="padding-right:24px; margin-top:10px;">
            <li>أن أصون لساني عن السخرية والهمز واللمز والغيبة.</li>
            <li>أن أحترم خصوصية زميلاتي ولا أشارك في نشر أي صورة أو إساءة.</li>
            <li>ألا أكون متفرجة سلبية عند رؤية الأذى، بل أساند وأطلب المساعدة.</li>
            <li>أن أنشر روح المحبة والتآخي وأكون عوناً لكل محتاجة.</li>
          </ul>
        </div>
        <div style="margin:20px 0;">
          <label style="display:block; text-align:right; font-weight:700; margin-bottom:6px; color:var(--text-main);">اكتبي اسمكِ الثلاثي للتوقيع على الميثاق:</label>
          <input type="text" id="pledgeNameInput" placeholder="اسم الطالبة الثلاثي..." value="${state.studentName || ''}" 
            style="width:100%; padding:14px 18px; border-radius:var(--radius-full); border:1.5px solid var(--border); font-family:'Tajawal'; font-size:1.05rem; outline:none; text-align:center;" />
        </div>
        <button id="signPledgeSubmitBtn" class="btn-primary" style="width:100%; padding:15px; font-size:1.15rem;">
          🔏 أختم الميثاق وأتعهد بنشر الأمان
        </button>
      </div>
    `;

    openModal(html);

    const submitBtn = document.getElementById('signPledgeSubmitBtn');
    if (submitBtn) {
      submitBtn.onclick = () => {
        const inp = document.getElementById('pledgeNameInput');
        const name = inp ? inp.value.trim() : '';
        if (!name) {
          alert('لطفاً اكتبي اسمكِ للتوقيع على الميثاق');
          return;
        }
        state.studentName = name;
        saveState();

        SFX.heartbeat();
        setTimeout(() => SFX.stamp(), 300);

        // تحديث إجمالي الطالبات الموقعات في قاعدة البيانات المدرسية الحية
        incrementGlobalPledges();

        awardStep('pledge');
        openSuccessModal(`تم توثيق عهدكِ يا ${name}!`, 'وقّعتِ ميثاق قلوبنا أمان بمدرسة متوسطة 92، وأصبحتِ سفيرة رسمية للأمان واللطف. تمت إضافة النجمة الرابعة ⭐!');
      };
    }
  }

  // =========================================================================
  // 5. قاعدة البيانات السحابية الحية وجدارية الكلمات (Cloud Realtime Database)
  // =========================================================================
  const FIREBASE_BASE = 'https://waer-579c6-default-rtdb.firebaseio.com/qulubuna_aman';

  // تحديث إجمالي الطالبات الموقعات في قاعدة البيانات
  async function incrementGlobalPledges() {
    try {
      const res = await fetch(`${FIREBASE_BASE}/stats/totalPledges.json`);
      let count = 142;
      if (res.ok) {
        const val = await res.json();
        if (typeof val === 'number') count = val;
      }
      const newCount = count + 1;
      await fetch(`${FIREBASE_BASE}/stats/totalPledges.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCount)
      });
      const el = document.getElementById('globalPledgesCount');
      if (el) el.textContent = newCount;
    } catch (e) {
      console.warn('Firebase pledges update error:', e);
    }
  }

  // جلب الإحصائيات العامة المحدثة
  async function fetchGlobalStats() {
    try {
      const res = await fetch(`${FIREBASE_BASE}/stats.json`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          if (data.totalPledges) {
            const el = document.getElementById('globalPledgesCount');
            if (el) el.textContent = data.totalPledges;
          }
        }
      }
    } catch (e) {}
  }

  // النشاط 5: جدارية الكلمات الطيبة المتصلة بقاعدة البيانات السحابية
  function setupStickyWall() {
    const WALL_STORAGE = 'qulubuna_sticky_notes_v2';
    const defaultNotes = [
      { id: 'note_1', text: '«ابتسامتكِ تضيء فناء مدرستنا كل صباح يا صديقتي» 🌸', author: 'طالبة من الصف الثاني', color: 'yellow', likes: 18, timestamp: 1730900000000 },
      { id: 'note_2', text: '«شكراً لأستاذة إيمان العمري على استماعها الدائم واحتوائها لقلوبنا» ♥', author: 'طالبة ممتنة', color: 'pink', likes: 29, timestamp: 1730901000000 },
      { id: 'note_3', text: '«أنتِ قوية ومميزة كما أنتِ، ولا تدعي أي كلمة عابرة تطفئ بريقكِ» ✨', author: 'سفيرة الأمان', color: 'green', likes: 22, timestamp: 1730902000000 },
      { id: 'note_4', text: '«مدرستنا مكان للحب والأمان، كلنا معكِ ولن ندع أحداً يؤذيكِ» 🤍', author: 'صديقة مخلصة', color: 'blue', likes: 25, timestamp: 1730903000000 }
    ];

    let notes = defaultNotes;
    try {
      const saved = localStorage.getItem(WALL_STORAGE);
      if (saved) {
        notes = JSON.parse(saved);
      }
    } catch (e) {}

    function saveNotes() {
      try {
        localStorage.setItem(WALL_STORAGE, JSON.stringify(notes));
      } catch (e) {}
    }

    const container = document.getElementById('stickyNotesGrid');
    const syncText = document.getElementById('wallLiveSyncText');

    function updateSyncStatus(connected, msg) {
      if (!syncText) return;
      syncText.textContent = msg;
    }

    function renderNotes() {
      if (!container) return;
      container.innerHTML = notes.map((n, idx) => `
        <div class="sticky-note ${n.color || 'yellow'}" style="transform: rotate(${(idx % 2 === 0 ? -1.5 : 1.5)}deg);">
          <div class="note-pin"></div>
          <div class="note-text">${escapeHtml(n.text)}</div>
          <div class="note-footer">
            <span>✍️ ${escapeHtml(n.author || 'طالبة أمان')}</span>
            <button class="note-like-btn" data-id="${n.id}">
              <span>♥</span> <b class="like-num">${n.likes || 0}</b>
            </button>
          </div>
        </div>
      `).join('');
    }
    renderNotes();

    // 1. جلب البيانات من قاعدة البيانات السحابية (Firebase Realtime DB)
    async function fetchFromCloud() {
      try {
        const resp = await fetch(`${FIREBASE_BASE}/notes.json`);
        if (!resp.ok) throw new Error('Cloud fetch failed');
        const data = await resp.json();
        if (data && typeof data === 'object') {
          const list = Object.keys(data).map(k => ({
            id: k,
            text: data[k].text || '',
            author: data[k].author || 'طالبة أمان',
            color: data[k].color || 'yellow',
            likes: data[k].likes || 0,
            timestamp: data[k].timestamp || Date.now()
          }));
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          if (list.length > 0) {
            notes = list;
            saveNotes();
            renderNotes();
            updateSyncStatus(true, 'قاعدة بيانات مباشرة متصلة بجميع الطالبات 🟢');
          }
        }
      } catch (err) {
        console.warn('Firebase sync notice:', err);
        updateSyncStatus(false, 'الملاحظات محفوظة في الجهاز محلياً');
      }
    }
    fetchFromCloud();

    // 2. الاستماع الفوري للتحديثات الحية عبر تقنية Server-Sent Events (SSE)
    if (window.EventSource) {
      try {
        const sse = new EventSource(`${FIREBASE_BASE}/notes.json`);
        sse.addEventListener('put', (e) => {
          try {
            const payload = JSON.parse(e.data);
            if (payload && payload.path === '/' && payload.data) {
              const cloudList = Object.keys(payload.data).map(k => ({
                id: k,
                text: payload.data[k].text || '',
                author: payload.data[k].author || 'طالبة أمان',
                color: payload.data[k].color || 'yellow',
                likes: payload.data[k].likes || 0,
                timestamp: payload.data[k].timestamp || Date.now()
              }));
              cloudList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
              notes = cloudList;
              saveNotes();
              renderNotes();
            } else if (payload && payload.path && payload.data !== undefined) {
              const segs = payload.path.replace(/^\//, '').split('/');
              const noteKey = segs[0];
              const item = notes.find(n => n.id === noteKey);
              if (item) {
                if (segs[1] === 'likes') {
                  item.likes = payload.data;
                } else if (typeof payload.data === 'object') {
                  Object.assign(item, payload.data);
                }
                renderNotes();
              } else if (typeof payload.data === 'object' && payload.data.text) {
                notes.unshift({ id: noteKey, ...payload.data });
                renderNotes();
              }
            }
          } catch (err) {}
        });
      } catch (err) {}
    }

    // 3. محدد ألوان البطاقات
    let activeColor = 'yellow';
    const colorButtons = document.querySelectorAll('.color-opt-btn');
    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        colorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeColor = btn.dataset.color || 'yellow';
        SFX.click();
      });
    });

    // 4. إضافة ملاحظة جديدة ونشرها في قاعدة البيانات الحية
    const addBtn = document.getElementById('addStickyNoteBtn');
    const textInput = document.getElementById('stickyTextInput');
    const authorInput = document.getElementById('stickyAuthorInput');

    if (addBtn && textInput) {
      addBtn.onclick = async () => {
        const text = textInput.value.trim();
        const author = authorInput ? authorInput.value.trim() : '';
        if (!text) {
          alert('اكتبي كلمة طيبة أو رسالة لطيفة أولاً!');
          return;
        }

        const noteId = `note_${Date.now()}`;
        const newNote = {
          id: noteId,
          text: text,
          author: author || (state.studentName || 'طالبة أمان'),
          color: activeColor,
          likes: 1,
          timestamp: Date.now()
        };

        // إضافة محلية فورية للاستجابة السريعة
        notes.unshift(newNote);
        saveNotes();
        renderNotes();

        textInput.value = '';
        if (authorInput) authorInput.value = '';

        SFX.success();
        launchConfetti();
        awardStep('wall');

        // الحفظ في قاعدة البيانات السحابية الحية لتظهر للجميع فوراً
        try {
          await fetch(`${FIREBASE_BASE}/notes/${noteId}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
          });
        } catch (err) {
          console.warn('Firebase write notice:', err);
        }
      };
    }

    // 5. زر الإعجاب بالبطاقات وتحديثه في قاعدة البيانات
    if (container) {
      container.onclick = async (e) => {
        const likeBtn = e.target.closest('.note-like-btn');
        if (likeBtn) {
          const id = likeBtn.dataset.id;
          const item = notes.find(n => String(n.id) === String(id));
          if (item) {
            item.likes = (item.likes || 0) + 1;
            saveNotes();
            renderNotes();
            SFX.click();

            // إرسال الإعجاب لقاعدة البيانات لتحديث الرقم عند بقية الطالبات
            try {
              await fetch(`${FIREBASE_BASE}/notes/${id}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ likes: item.likes })
              });
            } catch (err) {}
          }
        }
      };
    }
  }

  // نجاح إنجاز الخطوة
  function openSuccessModal(title, msg) {
    const html = `
      <div style="text-align:center; padding:15px;">
        <div style="font-size:3.5rem; animation:popStar 0.6s ease;">⭐</div>
        <h2 style="font-family:'Amiri'; font-size:2.4rem; color:var(--primary); margin:10px 0;">${title}</h2>
        <p style="font-size:1.15rem; color:var(--text-muted); max-width:480px; margin:0 auto 25px;">${msg}</p>
        <button class="btn-primary" onclick="document.getElementById('modalOverlay').classList.remove('active'); document.body.style.overflow='';" style="padding:12px 35px;">
          متابعة الرحلة ←
        </button>
      </div>
    `;
    openModal(html);
  }

  // نافذة كيف أبدأ الحديث؟
  function openTalkGuide() {
    const html = `
      <div>
        <span class="eyebrow-tag">💬 الشجاعة في طلب العون</span>
        <h2>كيف أبدأ الحديث مع الموجهة أو والدتي؟</h2>
        <p>طلب المساعدة ليس ضعفاً بل شجاعة تحميكِ. إذا شعرتِ بالارتباك، يمكنكِ استخدام إحدى هذه الجمل البسيطة:</p>
        <div class="feedback-banner notice" style="margin:16px 0;">
          <b>نموذج 1 (مع الموجهة الطلابية أ. إيمان العمري):</b>
          <p style="margin:4px 0 0; color:#52330a;">«أستاذة إيمان، أحتاج دقائق من وقتكِ على انفراد للحديث عن موقف يضايقني ويشعرني بعدم الأمان في المدرسة، وأحتاج مساعدتكِ وتوجيهكِ.»</p>
        </div>
        <div class="feedback-banner success" style="margin:16px 0;">
          <b>نموذج 2 (مع والدتي أو شخص بالغ أثق به):</b>
          <p style="margin:4px 0 0; color:#18421d;">«أمي الحبيبة، حدث معي اليوم موقف في المدرسة أحتاج أن أشارككِ إياه لأنني لا أعرف كيف أتصرف معه، وأريد دعمكِ.»</p>
        </div>
        <div style="background:#fff; border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-top:20px;">
          <h4 style="color:var(--primary-dark); margin-bottom:5px;">💡 نصائح ذهبية قبل الحديث:</h4>
          <ul style="padding-right:20px; font-size:0.95rem; color:var(--text-muted);">
            <li>لا تخافي من التهديدات؛ المعتدي يعتمد على خوفكِ وصمتكِ.</li>
            <li>إذا كان التنمّر إلكترونياً، التقطي لقطة شاشة (Screenshot) كدليل بمساعدة والدتكِ.</li>
            <li>التوجيه الطلابي بمدرسة متوسطة 92 مساحة سرية وآمنة تماماً تضمن حمايتكِ.</li>
          </ul>
        </div>
      </div>
    `;
    openModal(html);
  }

  // نافذة رسالة الأسرة والمعلمة
  function openFamilyGuide() {
    const html = `
      <div>
        <span class="eyebrow-tag">🤝 شراكة البيت والمدرسة</span>
        <h2>دليل المساندة الفعّال للأسرة والمعلمة</h2>
        <p>عندما تشارككِ الطالبة تعرضها للأذى أو الخوف، فإن استجابتكِ الأولى هي حجر الأساس لأمانها النفسي:</p>
        <ol style="padding-right:22px; line-height:1.9; color:var(--text-muted); font-size:1.02rem;">
          <li><b>الإنصات باهتمام وتفهم:</b> تجنبي لوم الطالبة بعبارات مثل "لماذا سكتِّ؟" أو "أنتِ السبب".</li>
          <li><b>التطمين الصادق:</b> أكدي لها: «أنا فخورة بشجاعتكِ، ولستِ مسؤولة عما حدث، وسنحل المشكلة معاً».</li>
          <li><b>توثيق الواقعة بهدوء:</b> معرفة الزمان والمكان وأسماء المتورطين دون تضخيم أو هلع.</li>
          <li><b>التواصل مع التوجيه الطلابي:</b> إشعار الموجهة الطلابية أ. إيمان العمري وإدارة المدرسة للتعامل التربوي الوقائي.</li>
          <li><b>المتابعة والاحتواء:</b> مراقبة الحالة المزاجية للطالبة وتعزيز ثقتها بنفسها باستمرار.</li>
        </ol>
      </div>
    `;
    openModal(html);
  }


  // =========================================================================
  // 7. نظام الشهادة الرسمية الفخمة (Royal Official Certificate)
  // =========================================================================
  function openCertificateModal() {
    if (state.stars < 5) {
      alert('يجب إكمال الخطوات الخمس أولاً لفتح شهادة التكريم الرسمية!');
      return;
    }

    SFX.fanfare();
    launchConfetti();

    const todayHijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    const serialNum = `QA-92-${Date.now().toString().slice(-6)}`;

    const certHtml = `
      <div id="certPrintArea">
        <div class="certificate-frame">
          <div class="cert-corner-flower cert-tl">✦</div>
          <div class="cert-corner-flower cert-tr">✦</div>
          <div class="cert-corner-flower cert-bl">✦</div>
          <div class="cert-corner-flower cert-br">✦</div>

          <div class="cert-header-meta">
            المملكة العربية السعودية · وزارة التعليم · مدرسة متوسطة 92
          </div>

          <div class="cert-subtitle">مبادرة «قلوبنا أمان» المدرسية 🌿</div>
          <h2 class="cert-main-title">شهادة فخر ومساندة</h2>

          <p class="cert-given-to">تتشرف إدارة المدرسة والتوجيه الطلابي بمنح هذه الشهادة للطالبة المتميزة:</p>

          <div style="margin:12px 0;">
            <input type="text" id="certLiveNameInput" placeholder="اكتبي اسمكِ الثلاثي للشهادة..." 
              value="${state.studentName || ''}" class="name-input no-print" 
              style="max-width:380px; text-align:center; font-weight:bold; font-size:1.15rem; border-color:var(--gold);" />
            <div id="certNameDisplay" class="cert-student-name">${escapeHtml(state.studentName || 'صديقة الأمان واللطف')}</div>
          </div>

          <p class="cert-body-p">
            تقديراً لوعيها المتميز، وإكمالها محطات رحلة الأمان الخمس، وتوقيعها ميثاق الاحترام والمساندة، 
            ومساهمتها الإيجابية في صناعة بيئة مدرسية يسودها اللطف والأمان.
          </p>

          <div class="cert-seal-badge">
            <span class="seal-icon">👑</span>
            <span>سفيرة الأمان</span>
            <span>١٤٤٨هـ</span>
          </div>

          <div class="cert-signatures">
            <div>
              <span>الموجهة الطلابية</span>
              <b>أ. إيمان العمري</b>
            </div>
            <div>
              <span>التاريخ</span>
              <b>${todayHijri}</b>
            </div>
            <div>
              <span>مديرة المدرسة</span>
              <b>أ. سارة الكلثم</b>
            </div>
          </div>

          <div class="cert-serial-footer">
            رمز التحقق الرسمي: ${serialNum} · مدرسة متوسطة 92
          </div>
        </div>
      </div>

      <div class="no-print" style="display:flex; justify-content:center; gap:12px; margin-top:25px; flex-wrap:wrap;">
        <button id="downloadCertImageBtn" class="btn-primary" style="background:linear-gradient(135deg, var(--gold-dark), var(--gold));">
          📸 تنزيل الشهادة كصورة عالية الدقة (PNG)
        </button>
        <button id="printCertPdfBtn" class="btn-outline">
          🖨️ طباعة رسمية / حفظ PDF
        </button>
      </div>
    `;

    openModal(certHtml);

    const nameInput = document.getElementById('certLiveNameInput');
    const nameDisplay = document.getElementById('certNameDisplay');

    if (nameInput && nameDisplay) {
      nameInput.oninput = () => {
        const val = nameInput.value.trim();
        nameDisplay.textContent = val || 'صديقة الأمان واللطف';
        state.studentName = val;
        saveState();
      };
    }

    const printBtn = document.getElementById('printCertPdfBtn');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }

    const downloadBtn = document.getElementById('downloadCertImageBtn');
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        generateCertCanvas(nameDisplay.textContent, serialNum, todayHijri);
      };
    }
  }

  // رسم وتنزيل الشهادة عبر HTML5 Canvas بدقة 1600×1100 فائقة الوضوح
  function generateCertCanvas(studentName, serial, dateStr) {
    const c = document.getElementById('certCanvas') || document.createElement('canvas');
    c.id = 'certCanvas';
    c.width = 1600;
    c.height = 1100;
    const ctx = c.getContext('2d');

    // خلفية راقية مذهبة
    const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1100);
    bgGrad.addColorStop(0, '#fefdfa');
    bgGrad.addColorStop(0.5, '#ffffff');
    bgGrad.addColorStop(1, '#f9f6ee');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1600, 1100);

    // إطار ملكي مزدوج
    ctx.strokeStyle = '#caa45d';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 1040);

    ctx.strokeStyle = '#2d5e46';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, 1504, 1004);

    ctx.strokeStyle = '#caa45d';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(58, 58, 1484, 984);

    // زخارف الزوايا
    ctx.fillStyle = '#caa45d';
    ctx.font = '36px "Tajawal", sans-serif';
    ctx.fillText('✦', 80, 100);
    ctx.fillText('✦', 1520, 100);
    ctx.fillText('✦', 80, 1020);
    ctx.fillText('✦', 1520, 1020);

    ctx.textAlign = 'center';

    // الترويسة
    ctx.fillStyle = '#6e634a';
    ctx.font = 'bold 24px "Tajawal", sans-serif';
    ctx.fillText('المملكة العربية السعودية · وزارة التعليم · مدرسة متوسطة 92', 800, 125);

    ctx.fillStyle = '#cf736b';
    ctx.font = 'bold 30px "Tajawal", sans-serif';
    ctx.fillText('مبادرة «قلوبنا أمان» المدرسية 🌿', 800, 185);

    // عنوان الشهادة
    ctx.fillStyle = '#1c3d2d';
    ctx.font = 'bold 72px "Amiri", serif';
    ctx.fillText('شهادة فخر ومساندة', 800, 280);

    ctx.fillStyle = '#5d6961';
    ctx.font = '28px "Tajawal", sans-serif';
    ctx.fillText('تتشرف إدارة المدرسة والتوجيه الطلابي بمنح هذه الشهادة للطالبة المتميزة:', 800, 360);

    // اسم الطالبة
    ctx.fillStyle = '#244b36';
    ctx.font = 'bold 64px "Amiri", serif';
    ctx.fillText(studentName, 800, 460);

    // خط زخرفي تحت الاسم
    ctx.strokeStyle = '#caa45d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(500, 485);
    ctx.lineTo(1100, 485);
    ctx.stroke();

    // نص التقدير
    ctx.fillStyle = '#3c4d42';
    ctx.font = '26px "Tajawal", sans-serif';
    ctx.fillText('تقديراً لوعيها التربوي، وإكمالها محطات رحلة الأمان الخمس بنجاح، وتوقيعها ميثاق الشرف المدرسي،', 800, 560);
    ctx.fillText('ومساهمتها الفاعلة في نشر ثقافة اللطف ونبذ التنمر وصناعة بيئة مدرسية آمنة.', 800, 605);

    // رسم ختم ملكي مذهب
    const sealX = 800;
    const sealY = 720;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 65, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, 65);
    sealGrad.addColorStop(0, '#faebb8');
    sealGrad.addColorStop(1, '#caa45d');
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    ctx.fillStyle = '#382500';
    ctx.font = '36px sans-serif';
    ctx.fillText('👑', sealX, sealY - 10);
    ctx.font = 'bold 18px "Tajawal", sans-serif';
    ctx.fillText('سفيرة الأمان', sealX, sealY + 22);

    // التواقيع
    ctx.fillStyle = '#223d30';
    ctx.font = '24px "Tajawal", sans-serif';
    ctx.fillText('الموجهة الطلابية', 320, 840);
    ctx.font = 'bold 28px "Tajawal", sans-serif';
    ctx.fillText('أ. إيمان العمري', 320, 885);

    ctx.font = '24px "Tajawal", sans-serif';
    ctx.fillText('تاريخ الاعتماد', 800, 840);
    ctx.font = 'bold 26px "Tajawal", sans-serif';
    ctx.fillText(dateStr, 800, 885);

    ctx.font = '24px "Tajawal", sans-serif';
    ctx.fillText('مديرة المدرسة', 1280, 840);
    ctx.font = 'bold 28px "Tajawal", sans-serif';
    ctx.fillText('أ. سارة الكلثم', 1280, 885);

    // الحاشية والتسلسل
    ctx.fillStyle = '#9aa59d';
    ctx.font = '20px "Tajawal", sans-serif';
    ctx.fillText(`كود التحقق والتوثيق: ${serial} · مدرسة متوسطة 92`, 800, 970);

    // تصدير وتنزيل الصورة
    const dataUrl = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `شهادة_قلوبنا_أمان_${studentName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    SFX.success();
  }


  // =========================================================================
  // 8. ربط أحداث الصفحة وعناصر التفاعل
  // =========================================================================
  function bindPageEvents() {
    // كروت التعلّم
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
      card.addEventListener('click', () => {
        const t = card.dataset.topic;
        if (t === 'bullying') openBullyingQuiz();
        else if (t === 'situations') openSituationsSimulator();
        else if (t === 'kindness') openKindnessChallenge();
      });
    });

    // كبسولات خطوات الرحلة
    const chipBullying = document.getElementById('chipBullying');
    if (chipBullying) chipBullying.onclick = openBullyingQuiz;
    const chipSituations = document.getElementById('chipSituations');
    if (chipSituations) chipSituations.onclick = openSituationsSimulator;
    const chipKindness = document.getElementById('chipKindness');
    if (chipKindness) chipKindness.onclick = openKindnessChallenge;
    const chipPledge = document.getElementById('chipPledge');
    if (chipPledge) chipPledge.onclick = openPledgeModal;
    const chipWall = document.getElementById('chipWall');
    if (chipWall) {
      chipWall.onclick = () => {
        const wall = document.getElementById('stickyWallSection');
        if (wall) wall.scrollIntoView({ behavior: 'smooth' });
      };
    }

    // زر الميثاق
    const pledgeBtn = document.getElementById('pledgeActionBtn');
    if (pledgeBtn) pledgeBtn.onclick = openPledgeModal;

    // زر كيف أبدأ الحديث
    const talkBtn = document.getElementById('talkGuideBtn');
    if (talkBtn) talkBtn.onclick = openTalkGuide;

    // زر دليل الأسرة والمعلمة
    const familyBtn = document.getElementById('familyGuideBtn');
    if (familyBtn) familyBtn.onclick = openFamilyGuide;

    // زر الشهادة الرئيسي
    const certTrigger = document.getElementById('certificateTriggerBtn');
    if (certTrigger) certTrigger.onclick = openCertificateModal;

    // تجربة الاحتفال
    const celebrateDemo = document.getElementById('celebrateDemoBtn');
    if (celebrateDemo) {
      celebrateDemo.onclick = () => {
        SFX.fanfare();
        launchConfetti();
      };
    }

    // زر القلب في الهيرو
    const heroHeart = document.getElementById('heroBigHeart');
    if (heroHeart) {
      heroHeart.onclick = () => {
        SFX.heartbeat();
        launchConfetti(window.innerWidth * 0.7, window.innerHeight * 0.35);
      };
    }

    // شريط التنقل السفلي لهواتف iPhone
    setupMobileNav();

    // جلب الإحصائيات العامة المدرسية الحية
    fetchGlobalStats();

    // إخفاء شاشة البداية
    setTimeout(() => {
      const splash = document.getElementById('appSplash');
      if (splash) splash.classList.add('hidden');
    }, 600);
  }

  // إدارة شريط التنقل السفلي الخاص بالجوال والآيفون
  function setupMobileNav() {
    const navItems = document.querySelectorAll('.mob-nav-item[data-section]');
    const certMobBtn = document.getElementById('mobNavCertBtn');

    if (certMobBtn) {
      certMobBtn.onclick = () => {
        if (state.stars >= 5) {
          openCertificateModal();
        } else {
          const journey = document.getElementById('journey');
          if (journey) journey.scrollIntoView({ behavior: 'smooth' });
          SFX.guidance();
        }
      };
    }

    // تتبع موقع التمرير لتنشيط الأيقونة النشطة
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 220;
      navItems.forEach(item => {
        const sec = document.getElementById(item.dataset.section);
        if (sec) {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
          }
        }
      });
    }, { passive: true });
  }

  // مساعد لتهريب نصوص HTML
  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  // بدء تشغيل الصفحة
  document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    setupStickyWall();
    bindPageEvents();
  });

})();
