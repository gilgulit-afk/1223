/* =============================================================
   אומנות העינוג הטנטרי — לוגיקת האתר
   ============================================================= */

/* ---------- הגדרות יצירת קשר ----------
   מלאו כאן את פרטי הקשר שלכן.
   אם WHATSAPP מלא — הטופס ייפתח כהודעת וואטסאפ מוכנה לשליחה.
   אחרת תיפתח הודעת אימייל.                                     */
const CONTACT = {
  WHATSAPP: '',                 // לדוגמה: '972501234567' (ללא + וללא מקפים)
  EMAIL: 'gilgulit@gmail.com'
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

/* ---------- טופס ההרשמה ---------- */
(function signup () {
  const form = document.getElementById('signupForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();

    if (!name || !phone) {
      status.textContent = 'נשמח לשם מלא ולטלפון כדי שנוכל לחזור אליכם.';
      status.classList.add('is-error');
      (name ? form.phone : form.name).focus();
      return;
    }

    status.classList.remove('is-error');

    const lines = [
      'היי, אשמח להירשם לסדנה 🌼',
      '',
      'שם: ' + name,
      'טלפון: ' + phone,
      data.email ? 'אימייל: ' + data.email.trim() : null,
      'סדנה: ' + data.workshop,
      (data.message || '').trim() ? 'הערות: ' + data.message.trim() : null
    ].filter(Boolean);

    const body = lines.join('\n');
    let url;

    if (CONTACT.WHATSAPP) {
      url = 'https://wa.me/' + CONTACT.WHATSAPP + '?text=' + encodeURIComponent(body);
      status.textContent = 'נפתח חלון וואטסאפ עם הפרטים — נותר רק לשלוח 🌼';
    } else {
      url = 'mailto:' + CONTACT.EMAIL +
            '?subject=' + encodeURIComponent('הרשמה לסדנה — ' + name) +
            '&body=' + encodeURIComponent(body);
      status.textContent = 'נפתחה הודעת מייל עם הפרטים — נותר רק לשלוח 🌼';
    }

    window.open(url, '_blank', 'noopener');
  });
})();
