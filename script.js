/* Section views, Cebu clock and case study slide viewer. No other JavaScript on the site. */

(function () {
  /* ---------- Views: each menu link shows one section, like a separate page ---------- */
  // Address (#...) -> section id
  var routes = {
    'home': 'view-home',
    'services': 'view-services',
    'case-studies': 'view-case-studies',
    'how-i-work': 'view-how-i-work',
    'about': 'view-about',
    'contact': 'view-contact'
  };
  var titles = {
    'services': 'Services',
    'case-studies': 'Case studies',
    'how-i-work': 'How I work',
    'about': 'About',
    'contact': 'Contact'
  };
  var homeTitle = document.title;
  var views = document.querySelectorAll('.view');
  var routeLinks = document.querySelectorAll('[data-route]');

  function render(isFirstLoad) {
    var hash = location.hash.slice(1);
    try { hash = decodeURIComponent(hash); } catch (e) {}
    var route = hash || 'home';
    var target = null; // an element inside a section, e.g. #case-storm

    if (!routes[route]) {
      var el = document.getElementById(hash);
      var view = el && el.closest('.view');
      if (!view) return; // e.g. #main or #top: leave the current section alone
      route = view.getAttribute('data-view');
      target = el;
    }

    views.forEach(function (v) {
      v.classList.toggle('is-active', v.id === routes[route]);
    });

    routeLinks.forEach(function (a) {
      if (a.getAttribute('data-route') === route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.title = titles[route] ? titles[route] + ' | Mary Cris Tapic' : homeTitle;

    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
      if (!isFirstLoad) {
        var heading = document.getElementById(routes[route]).querySelector('.view-title');
        if (heading) heading.focus({ preventScroll: true });
      }
    }
  }

  window.addEventListener('hashchange', function () { render(false); });
  render(true);

  document.querySelector('.back-to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  });

  /* ---------- Tools card: "See all tools" / "Show less" ---------- */
  var toolsToggle = document.querySelector('.tools-toggle');
  var toolsAll = document.getElementById('tools-all');
  toolsToggle.addEventListener('click', function () {
    var open = toolsAll.hidden;
    toolsAll.hidden = !open;
    toolsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toolsToggle.textContent = open ? 'Show less' : 'See all tools';
  });

  /* ---------- Clock: time in Cebu, plus the visitor's own time ---------- */
  var clock = document.querySelector('.clock');
  var cebuEl = clock.querySelector('.clock-cebu');
  var localEl = clock.querySelector('.clock-local');
  var timeOpts = { hour: 'numeric', minute: '2-digit' };

  try {
    var cebuFmt = new Intl.DateTimeFormat('en-US', Object.assign({ timeZone: 'Asia/Manila' }, timeOpts));
    var localFmt = new Intl.DateTimeFormat('en-US', timeOpts);

    var tick = function () {
      var now = new Date();
      var cebu = cebuFmt.format(now);
      var local = localFmt.format(now);
      cebuEl.textContent = cebu;
      // Only show the visitor's time when it differs from Cebu
      localEl.textContent = local === cebu ? '' : '(' + local + ' your time)';
    };

    tick();
    clock.hidden = false;
    setInterval(tick, 15000);
  } catch (err) {
    // Very old browser without time zone support: leave the clock hidden
  }

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
