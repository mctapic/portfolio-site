/* Mobile menu + case study slide viewer. No other JavaScript on the site. */

(function () {
  /* ---------- Menu ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var links = document.getElementById('nav-links');

  function closeMenu() {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (links.classList.contains('is-open') && !e.target.closest('.site-nav')) closeMenu();
  });

  /* ---------- Slide viewer ---------- */
  // Each deck: title shown in the viewer, image file prefix and number of slides.
  var decks = {
    storm:     { title: 'Storm Operations Case Study',  file: 'storm-operations',  count: 6 },
    payment:   { title: 'Payment Matching Case Study',  file: 'payment-matching',  count: 12 },
    yearend:   { title: 'Year-End Admin Case Study',    file: 'year-end-admin',    count: 6 },
    executive: { title: 'Executive Support Case Study', file: 'executive-support', count: 5 }
  };

  var viewer = document.getElementById('viewer');
  var titleEl = viewer.querySelector('.viewer-title');
  var img = viewer.querySelector('.viewer-img');
  var counter = viewer.querySelector('.viewer-count');
  var prevBtn = viewer.querySelector('.viewer-prev');
  var nextBtn = viewer.querySelector('.viewer-next');
  var closeBtn = viewer.querySelector('.viewer-close');

  var deck = null;
  var index = 0;
  var opener = null;

  function src(d, i) {
    var n = i + 1;
    return 'images/case-studies/' + d.file + '-' + (n < 10 ? '0' + n : n) + '.webp';
  }

  function preload(i) {
    if (i >= 0 && i < deck.count) new Image().src = src(deck, i);
  }

  function show(i) {
    index = Math.max(0, Math.min(deck.count - 1, i));
    img.src = src(deck, index);
    img.alt = deck.title + ', slide ' + (index + 1) + ' of ' + deck.count;
    counter.textContent = (index + 1) + ' of ' + deck.count;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === deck.count - 1;
    preload(index + 1);
    preload(index - 1);
  }

  function open(key, button) {
    deck = decks[key];
    if (!deck) return;
    opener = button;
    titleEl.textContent = deck.title;
    show(0);
    document.body.classList.add('viewer-open');
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    closeBtn.focus();
  }

  function close() {
    if (typeof viewer.close === 'function' && viewer.open) viewer.close();
    else viewer.removeAttribute('open');
  }

  viewer.addEventListener('close', function () {
    document.body.classList.remove('viewer-open');
    img.removeAttribute('src');
    if (opener) opener.focus();
  });

  document.querySelectorAll('[data-deck]').forEach(function (btn) {
    btn.addEventListener('click', function () { open(btn.getAttribute('data-deck'), btn); });
  });

  prevBtn.addEventListener('click', function () { show(index - 1); });
  nextBtn.addEventListener('click', function () { show(index + 1); });
  closeBtn.addEventListener('click', close);

  // Click on the backdrop closes the viewer
  viewer.addEventListener('click', function (e) {
    if (e.target === viewer) close();
  });

  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { show(index - 1); e.preventDefault(); }
    else if (e.key === 'Escape' && !viewer.showModal) close();
  });

  // Swipe on phones
  var startX = null, startY = null;
  var stage = viewer.querySelector('.viewer-stage');

  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { startX = null; return; }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    startX = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      show(dx < 0 ? index + 1 : index - 1);
    }
  }, { passive: true });
})();
