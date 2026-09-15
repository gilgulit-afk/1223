/* =============================================================
   אומנות העינוג הטנטרי — לוגיקת האתר
   ============================================================= */

/* ---------- הגדרות יצירת קשר ---------- */
const CONTACT = {
  WHATSAPP: '972544799145',                          // 054-4799145
  EMAIL: 'gilgulit@gmail.com',                       // יעד הטופס
  FORM_ENDPOINT: 'https://formsubmit.co/ajax/gilgulit@gmail.com'
};
/* ------------------------------------------------------------ */

document.documentElement.classList.add('js');

/* ---------- אנימציית כניסה לאלמנטים ---------- */
(function reveals () {
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  items.forEach(el => io.observe(el));
})();

/* ---------- כפתור הרשמה צף (מובייל) ---------- */
(function floatingCta () {
  const cta = document.querySelector('.cta-float');
  const form = document.getElementById('registration');
  if (!cta || !form) return;

  const isPhone = () => window.matchMedia('(max-width: 780px)').matches;
  let formVisible = false;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      formVisible = e.isIntersecting;
      update();
    }, { threshold: 0.08 }).observe(form);
  }

  function update () {
    const show = isPhone() && !formVisible && window.scrollY > window.innerHeight * 0.75;
    cta.classList.toggle('is-visible', show);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ---------- מסך המעבר לוואטסאפ ----------
   כל קישור עם data-wa נפתח דרך מסך ביניים מעוצב,
   כדי שלא ייפתח ישירות המסך הגנרי של וואטסאפ.         */
(function whatsappHandoff () {
  const overlay = document.getElementById('waOverlay');
  const msgBox  = document.getElementById('waMsg');
  const goBtn   = document.getElementById('waGo');
  if (!overlay || !msgBox || !goBtn) return;

  let lastFocus = null;

  function waLink (message) {
    return 'https://wa.me/' + CONTACT.WHATSAPP + '?text=' + encodeURIComponent(message);
  }

  function open (message, trigger) {
    lastFocus = trigger || null;
    msgBox.textContent = message;
    goBtn.href = waLink(message);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    goBtn.focus();
  }

  function close () {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', (ev) => {
    const link = ev.target.closest('[data-wa]');
    if (!link) return;
    ev.preventDefault();
    open(link.dataset.msg || '', link);
  });

  document.getElementById('waClose').addEventListener('click', close);
  document.getElementById('waBack').addEventListener('click', close);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && !overlay.hidden) close();
  });
  // אחרי שוואטסאפ נפתח — סוגרים את המסך מאחורי המשתמש
  goBtn.addEventListener('click', () => setTimeout(close, 400));
})();

/* ---------- טופס ההרשמה — שליחה אמיתית למייל ---------- */
(function signup () {
  const form   = document.getElementById('signupForm');
  const status = document.getElementById('formStatus');
  const waBtn  = document.getElementById('formWa');
  if (!form) return;

  const btn = form.querySelector('button[type="submit"]');
  const btnText = btn ? btn.textContent : '';

  function say (text, isError) {
    status.textContent = text;
    status.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const data  = Object.fromEntries(new FormData(form).entries());
    const name  = (data.name || '').trim();
    const phone = (data.phone || '').trim();

    if (!name || !phone) {
      say('נשמח לשם מלא ולטלפון כדי שנוכל לחזור אליכם.', true);
      (name ? form.elements.phone : form.elements.name).focus();
      return;
    }

    if (waBtn) waBtn.hidden = true;
    if (btn) { btn.disabled = true; btn.textContent = 'שולחים…'; }
    say('');

    const payload = {
      _subject: 'הרשמה לסדנה — ' + name,
      _template: 'table',
      _captcha: 'false',
      'שם מלא': name,
      'טלפון': phone,
      'אימייל': data.email ? data.email.trim() : '—',
      'סדנה': data.workshop,
      'הערות': (data.message || '').trim() || '—'
    };

    let delivered = false;
    try {
      const res = await fetch(CONTACT.FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const out = await res.json().catch(() => ({}));
      // השרת מאשר מסירה רק כאשר success אמיתי חוזר
      delivered = res.ok && String(out.success) === 'true';
    } catch (err) {
      delivered = false;
    }

    if (btn) { btn.disabled = false; btn.textContent = btnText; }

    if (delivered) {
      form.reset();
      say('הפרטים נשלחו, תודה מכל הלב 🌼 נחזור אליכם באופן אישי בהקדם.');
      return;
    }

    /* לא הצלחנו למסור — לא מציגים הצלחה כוזבת,
       ומציעים את הערוץ שעובד תמיד, עם הפרטים כבר בפנים. */
    const lines = [
      'היי, אשמח להירשם לסדנה',
      'שם: ' + name,
      'טלפון: ' + phone,
      data.email ? 'אימייל: ' + data.email.trim() : null,
      'סדנה: ' + data.workshop,
      (data.message || '').trim() ? 'הערות: ' + data.message.trim() : null
    ].filter(Boolean).join('\n');

    say('השליחה מכאן לא צלחה כרגע. הפרטים שמורים בטופס — אפשר לשלוח אותם אלינו בוואטסאפ בלחיצה אחת:', true);
    if (waBtn) {
      waBtn.hidden = false;
      waBtn.dataset.wa = '';
      waBtn.dataset.msg = lines;
      waBtn.href = 'https://wa.me/' + CONTACT.WHATSAPP + '?text=' + encodeURIComponent(lines);
      waBtn.focus();
    }
  });
})();
