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
