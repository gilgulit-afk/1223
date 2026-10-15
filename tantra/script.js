/* =============================================================
   אומנות העינוג הטנטרי — לוגיקת האתר
   ============================================================= */

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
  const closing = document.getElementById('registration');
  if (!cta || !closing) return;

  const isPhone = () => window.matchMedia('(max-width: 780px)').matches;
  let closingVisible = false;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      closingVisible = e.isIntersecting;
      update();
    }, { threshold: 0.08 }).observe(closing);
  }

  function update () {
    const show = isPhone() && !closingVisible && window.scrollY > window.innerHeight * 0.75;
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

/* ---------- קרוסלת הפידבקים ----------
   דפדוף בהחלקה, בחיצים, בנקודות ובמקלדת.
   המיקום מחושב לפי מרכזי הכרטיסים ולא לפי scrollLeft,
   כי ערכו הפוך בין דפדפנים כשכיוון הכתיבה מימין לשמאל.   */
(function voices () {
  const track = document.getElementById('voicesTrack');
  const dotsBox = document.getElementById('voicesDots');
  if (!track || !dotsBox) return;

  const cards = [...track.querySelectorAll('.voice')];
  if (!cards.length) return;

  const prev = document.querySelector('.voices__arrow--prev');
  const next = document.querySelector('.voices__arrow--next');
  let current = 0;

  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'פידבק ' + (i + 1));
    b.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(b);
    return b;
  });

  function goTo (i) {
    const target = cards[Math.max(0, Math.min(cards.length - 1, i))];
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function nearestIndex () {
    const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0, bestGap = Infinity;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const gap = Math.abs(r.left + r.width / 2 - mid);
      if (gap < bestGap) { bestGap = gap; best = i; }
    });
    return best;
  }

  function sync () {
    /* כששני כרטיסים נראים יחד, הראשון והאחרון לעולם לא מגיעים למרכז,
       ולכן בקצוות קובעים לפי קצה המסילה ולא לפי המרכז.
       הקצה נמדד מתיבות הגבול — ערכי scrollLeft הפוכים בין דפדפנים ב-RTL. */
    const rtl = getComputedStyle(track).direction === 'rtl';
    const tr = track.getBoundingClientRect();
    const first = cards[0].getBoundingClientRect();
    const last = cards[cards.length - 1].getBoundingClientRect();
    const atStart = Math.abs((rtl ? first.right : first.left) - (rtl ? tr.right : tr.left)) < 3;
    const atEnd = Math.abs((rtl ? last.left : last.right) - (rtl ? tr.left : tr.right)) < 3;

    current = atStart ? 0 : atEnd ? cards.length - 1 : nearestIndex();
    dots.forEach((d, i) => d.setAttribute('aria-selected', String(i === current)));
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === cards.length - 1;
  }

  if (prev) prev.addEventListener('click', () => goTo(current - 1));
  if (next) next.addEventListener('click', () => goTo(current + 1));

  track.addEventListener('keydown', (ev) => {
    // בכתיבה מימין לשמאל החץ השמאלי מתקדם קדימה
    if (ev.key === 'ArrowLeft')  { ev.preventDefault(); goTo(current + 1); }
    if (ev.key === 'ArrowRight') { ev.preventDefault(); goTo(current - 1); }
  });

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { sync(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', sync, { passive: true });

  sync();
})();
