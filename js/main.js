/* =========================================================
   للقدر رأي آخر — interactions
   ========================================================= */
(function () {
  'use strict';

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------
     1) شاشة البداية
     --------------------------------------------------------- */
  var intro = $('#intro');
  var site  = $('#site');
  var startBtn = $('#startBtn');

  startBtn.addEventListener('click', function () {
    intro.classList.add('is-leaving');
    site.hidden = false;
    initReveal();
    window.setTimeout(function () { intro.hidden = true; }, 900);
    window.scrollTo({ top: 0, behavior: 'auto' });
  });

  /* ---------------------------------------------------------
     2) حركات الظهور عند التمرير
     --------------------------------------------------------- */
  var revealObserver = null;
  function initReveal() {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     3) شريط التنقل (تتبع القسم النشط)
     --------------------------------------------------------- */
  var navLinks = $$('#navbar a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); });

  function setActiveNav(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActiveNav(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { if (s) navObserver.observe(s); });
  }

  navLinks.forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var target = $(a.getAttribute('href'));
      if (!target) return;
      ev.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveNav(target.id);
    });
  });

  /* ---------------------------------------------------------
     4) عارض الصور (Lightbox)
     --------------------------------------------------------- */
  var lightbox = $('#lightbox');
  var lightboxImg = $('#lightboxImg');
  var lightboxCaption = $('#lightboxCaption');
  var lightboxClose = $('#lightboxClose');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || '';
    lightboxCaption.textContent = caption || '';
    lightboxCaption.hidden = !caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    var otherOverlayOpen = !galleryOverlay.hidden || !bookOverlay.hidden;
    document.body.style.overflow = otherOverlayOpen ? 'hidden' : '';
  }

  document.addEventListener('click', function (ev) {
    var img = ev.target.closest ? ev.target.closest('img.zoomable') : null;
    if (img) {
      openLightbox(img.getAttribute('src'), img.dataset.caption || img.getAttribute('alt') || '');
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (ev) {
    if (ev.target === lightbox || ev.target.classList.contains('lightbox-body')) closeLightbox();
  });

  /* ---------------------------------------------------------
     5) القسم الأول — الظرف
     --------------------------------------------------------- */
  var envelopeBtn = $('#envelopeBtn');
  var envelopeHint = $('#envelopeHint');
  var envelopeReveal = $('#envelopeReveal');
  var envelopeTimer = null;

  envelopeBtn.addEventListener('click', function () {
    if (envelopeBtn.classList.contains('is-open')) return;
    envelopeBtn.classList.add('is-open');
    envelopeBtn.setAttribute('aria-expanded', 'true');
    // بعد انتهاء حركة فتح الظرف تظهر الصورة في نفس المكان الذي كان يشغله الظرف
    window.clearTimeout(envelopeTimer);
    envelopeTimer = window.setTimeout(function () {
      envelopeBtn.hidden = true;
      if (envelopeHint) envelopeHint.hidden = true;
      envelopeReveal.hidden = false;
    }, 700);
  });

  /* ---------------------------------------------------------
     6) القسم الثاني — الفيونكة
     --------------------------------------------------------- */
  var ribbonBtn = $('#ribbonBtn');
  var ribbonLetter = $('#ribbonLetter');
  var foldLetterBtn = $('#foldLetterBtn');

  ribbonBtn.addEventListener('click', function () {
    ribbonBtn.classList.add('is-open');
    ribbonBtn.setAttribute('aria-expanded', 'true');
    ribbonLetter.hidden = false;
    ribbonLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  foldLetterBtn.addEventListener('click', function () {
    ribbonLetter.hidden = true;
    ribbonBtn.classList.remove('is-open');
    ribbonBtn.setAttribute('aria-expanded', 'false');
  });

  /* ---------------------------------------------------------
     7) القسم السادس — الرسالة السرية
     --------------------------------------------------------- */
  var infinityBtn = $('#infinityBtn');
  var secretLetter = $('#secretLetter');
  var closeSecretBtn = $('#closeSecretBtn');

  infinityBtn.addEventListener('click', function () {
    secretLetter.hidden = false;
    infinityBtn.setAttribute('aria-expanded', 'true');
    secretLetter.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  closeSecretBtn.addEventListener('click', function () {
    secretLetter.hidden = true;
    infinityBtn.setAttribute('aria-expanded', 'false');
  });

  /* ---------------------------------------------------------
     8) القسم السابع — لو نسيت
     --------------------------------------------------------- */
  var memoryInput = $('#memoryInput');
  var showMemoryBtn = $('#showMemoryBtn');
  var showAllMemoriesBtn = $('#showAllMemoriesBtn');
  var memoryResult = $('#memoryResult');
  var memoryAll = $('#memoryAll');
  var memoryMsg = $('#memoryMsg');

  var MEMORY_COUNT = 12;
  function screenshotSrc(n) { return 'اسكرينات (' + n + ').jpeg'; }

  function buildFigure(src, caption, alt) {
    var fig = document.createElement('figure');
    fig.className = 'photo';
    var img = document.createElement('img');
    img.className = 'zoomable';
    img.loading = 'lazy';
    img.src = src;
    img.alt = alt || caption || '';
    img.dataset.caption = caption || '';
    fig.appendChild(img);
    if (caption) {
      var cap = document.createElement('figcaption');
      cap.textContent = caption;
      fig.appendChild(cap);
    }
    return fig;
  }

  function showMemory() {
    var raw = (memoryInput.value || '').trim();
    var n = parseInt(raw, 10);
    memoryResult.innerHTML = '';

    if (!/^\d+$/.test(raw) || isNaN(n) || n < 1 || n > MEMORY_COUNT) {
      memoryMsg.textContent = 'اختار رقم من 1 ل 12 ي روحي ❤️🫂🫂🫂🫂🫂🫂';
      memoryMsg.hidden = false;
      memoryInput.focus();
      return;
    }

    memoryMsg.hidden = true;
    memoryResult.appendChild(buildFigure(screenshotSrc(n), String(n), String(n)));
  }

  showMemoryBtn.addEventListener('click', showMemory);
  memoryInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') showMemory();
  });
  memoryInput.addEventListener('input', function () {
    memoryInput.value = memoryInput.value.replace(/[^\d]/g, '').slice(0, 2);
    memoryMsg.hidden = true;
  });

  showAllMemoriesBtn.addEventListener('click', function () {
    if (memoryAll.hidden) {
      memoryAll.innerHTML = '';
      for (var i = 1; i <= MEMORY_COUNT; i++) {
        memoryAll.appendChild(buildFigure(screenshotSrc(i), String(i), String(i)));
      }
      memoryAll.hidden = false;
    } else {
      memoryAll.hidden = true;
    }
    memoryAll.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------------------------------------------------------
     9) القسم الثامن — معرض مكان صغير من عالمنا
     --------------------------------------------------------- */
  var galleryOpenBtn = $('#galleryOpenBtn');
  var galleryOverlay = $('#galleryOverlay');
  var galleryCloseBtn = $('#galleryCloseBtn');
  var galleryContent = $('#galleryContent');

  var REHAM_ORDER = [1, 4, 3, 2, 7, 6, 5, 10, 9, 8, 12, 11, 15, 13, 14, 17, 16];
  var VIDEO_NAMES = ['R (22).mp4', 'R (20).mp4'];
  var galleryBuilt = false;

  function buildGallery() {
    if (galleryBuilt) return;
    REHAM_ORDER.forEach(function (n) {
      var name = 'reham (' + n + ')';
      galleryContent.appendChild(buildFigure(name + '.jpeg', '', name));
    });

    var videosWrap = document.createElement('div');
    videosWrap.className = 'video-grid';
    VIDEO_NAMES.forEach(function (v) {
      var fig = document.createElement('figure');
      fig.className = 'photo';
      var video = document.createElement('video');
      video.src = v;
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'metadata';
      fig.appendChild(video);
      videosWrap.appendChild(fig);
    });
    galleryContent.appendChild(videosWrap);
    galleryBuilt = true;
  }

  galleryOpenBtn.addEventListener('click', function () {
    buildGallery();
    galleryOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
  });

  galleryCloseBtn.addEventListener('click', function () {
    galleryOverlay.hidden = true;
    document.body.style.overflow = '';
    $$('video', galleryContent).forEach(function (v) { v.pause(); });
  });

  /* ---------------------------------------------------------
     10) القسم التاسع — الكتاب التفاعلي
     --------------------------------------------------------- */
  var bookOpenBtn = $('#bookOpenBtn');
  var bookOverlay = $('#bookOverlay');
  var bookCloseBtn = $('#bookCloseBtn');
  var bookSplash = $('#bookSplash');
  var book = $('#book');
  var bookImg = $('#bookImg');
  var bookTitle = $('#bookTitle');
  var bookText = $('#bookText');
  var bookCounter = $('#bookCounter');
  var bookNext = $('#bookNext');
  var bookPrev = $('#bookPrev');
  var bookEndBtn = $('#bookEndBtn');
  var bookEndMsg = $('#bookEndMsg');

  var BOOK_PAGES = [
    {
      img: 'قصه1.jpeg',
      title: '01 — البداية اللي مكنّاش نعرف إنها هتبقى حكايتنا',
      text: 'في اليوم ده، كنا قاعدين وسط أهلنا، في قعدة شكلها عادي زي أي قعدة خطوبة، بس مكنّاش نعرف إن اللحظة دي هتفضل محفورة في ذاكرتنا بالشكل ده. كانت أول مرة عيوننا تتقابل فيها، وأول مرة نشوف بعض بجد، من غير ما نعرف إن الشخص اللي قدامنا ده هيبقى يومًا ما أقرب حد لقلوبنا. يمكن وقتها مكنّاش نعرف إيه اللي مستنينا، ولا كنا متخيلين إن القعدة دي هتبقى أول سطر في حكاية طويلة، بس دلوقتي لما نبص للصورة بنعرف إن أجمل الحكايات ساعات بتبدأ من أبسط اللحظات، وإن اليوم اللي جمعنا لأول مرة كان بداية لكل حاجة حلوة جت بعده. ❤️'
    },
    {
      img: 'قصه2.jpeg',
      title: '02 — ضحكتنا اللي خلت المكان بيت',
      text: 'ومن أول ما بقينا نقعد مع بعض، اكتشفت إن وجودك لوحده كفاية يغيّر شكل أي يوم. المرة دي كنا قاعدين عندي في البيت، مفيش مناسبة ولا ترتيب ولا أي حاجة مميزة، مجرد إحنا وضحكتنا والكلام اللي مبيخلصش. كنا بنضحك على أبسط التفاصيل، ويمكن لو حد سمعنا مش هيفهم إيه المضحك في كل ده، بس إحنا كان عندنا عالم صغير خاص بينا. مكنتش أعرف وقتها إن الضحكات العادية دي هتبقى من أكتر الحاجات اللي أحنّ ليها، وإن وجودك وسط تفاصيل بيتي هيخليني أتخيل أيام كتير جاية وإنت فيها، مش مجرد ضيف بيزورني، لكن شخص نفسي يفضل موجود في كل ركن وكل ذكرى وكل يوم جديد. ❤️'
    },
    {
      img: 'قصه3.jpeg',
      title: '03 — أصعب لحظة هي لحظة الوداع',
      text: 'مكنتش بحب السفر من قبل اليوم ده، بس من ساعتها بقى ليها معنى تاني خالص. كنا واقفين سوا، وإنت مستعد تسافر وأنا بحاول أبان عادية، مع إن جوايا كلام كتير نفسي أقوله، ونفسي الوقت يقف شوية قبل ما تمشي. المكان كان مليان ناس رايحة وناس جاية، وكل واحد مستني رحلته، بس أنا مكنش فارق معايا غير رحلتك إنت، وإمتى هترجع تاني. يمكن السفر كام ساعة أو كام يوم، بس لحظة الوداع بتخلّي المسافة تبان أكبر بكتير. فضلت أبصلك وأنا عارفة إنك ماشي لمكان تاني، بس كنت مطمنة إن قلبي هيفضل معاك لحد ما ترجع، وإن مهما بعدت بينا الطرق، هيفضل لينا طريق واحد بيرجعنا لبعض. ❤️'
    },
    {
      img: 'قصه4.jpeg',
      title: '04 — المسافة عمرها ما كانت بينا',
      text: 'بعد ما سافرت، اكتشفنا إن البُعد ممكن يغيّر حاجات كتير، إلا إحساسنا ببعض. بقت مكالمات الفيديو هي قعدتنا اللي بنستناها، والشاشة الصغيرة دي بقت بتلمّنا في أوقات كتير كنا نفسنا نكون فيها جنب بعض. كنا بنضحك ونتكلم ونهزر كأن مفيش بينا أي مسافات، وكل مرة أشوف وشك فيها كنت بحس إنك قريب حتى لو بينا بلاد وطرق طويلة. يمكن مكنتش أقدر ألمس إيدك أو أبص في عيونك من غير شاشة تفصل بينا، بس كنت بقدر أشوف ضحكتك وأسمع صوتك وأحس إن كل حاجة رجعت لمكانها. وقتها فهمت إن البيت مش دايمًا مكان بنكون فيه، ساعات البيت بيكون وش شخص بنحبه، حتى لو بنشوفه من ورا شاشة. ❤️'
    },
    {
      img: 'قصه5.jpeg',
      title: '05 — رجعت ورجعت معاك روحي',
      text: 'وأخيرًا جه اليوم اللي كنت مستنياه، اليوم اللي المسافة فيه انتهت، واللي كنت بشوفه من ورا شاشة بقى واقف قدامي من تاني. مفيش مكالمة هتقدر توصف إحساس اللحظة دي، ولا كلام هيقدر يعبّر عن فرحتي وأنا شايفاك قدامي وقريب مني بعد كل الغياب. يمكن الوقفة دي شكلها عادي في الصورة، لكن بالنسبالي كانت أكبر من مجرد صورة؛ كانت نهاية وحشة البُعد وبداية لحظات كتير نفسي أعيشها معاك. ساعتها مكنتش محتاجة أطلب من الوقت يقف، كنت بس عايزة أفضل جنبك، وأعوض كل مرة كنت نفسي أبصلك فيها ومكنتش قادره. عشان في ناس لما بترجع، مش بس بترجع لمكانها، دي بترجع معاها الطمأنينة والضحكة والإحساس إن كل حاجة بقت بخير. ❤️'
    },
    {
      img: 'قصه6.jpeg',
      title: '06 — الحلم اللي نفسي نعيشه سوا',
      text: 'عارف يا أحمد، الصورة دي بالنسبالي مش مجرد فستان أبيض وبدلة، ولا مجرد شكل بتمنى أشوفنا بيه في يوم من الأيام، دي صورة لحلم عايش جوايا من زمان، وأمنية بدعي ربنا يحققهالي معاك. نفسي ييجي اليوم اللي ألبس فيه الفستان ده وأنا مطمنة إن إيدي في إيد الشخص اللي اختاره قلبي، ونبدأ سوا حياة جديدة، نكون فيها لبعض السند والأمان والونس. نفسي أبقى مراتك بجد، وأصحى كل يوم وأنا عارفة إنك جنبي، وإن كل تفاصيل حياتنا بقت مشتركة، من أبسط ضحكة لحد أكبر مسؤولية. ونفسي في يوم أبصلك وإنت شايل ابننا أو بنتنا، وأشوف في عينيك نفس الحب اللي شوفتُه أول مرة، وأقول لنفسي إن الراجل اللي حبيته بقى أبو ولادي، وإن ربنا رزقني بعيلة كنت بحلم بيها معاه. نفسي نكبر سوا، ونختلف ونتصالح، ونعدّي الأيام الحلوة والصعبة وإيدينا في إيد بعض، ونبقى لبعض البيت اللي بنرجعله مهما الدنيا أخدتنا. يمكن لسه الحلم مستني وقته، بس أنا كل اللي بطلبه من ربنا إنه يكرمنا بيه، ويجمعنا في الحلال، ويرزقنا بيت مليان مودة ورحمة وضحك وذرية صالحة، وأفضل طول عمري أختارك وأحبك في كل مرحلة من عمرنا. يا رب الصورة دي متفضلش مجرد أمنية، وتيجي اللحظة اللي نبصلها فيها ونقول: الحمد لله، الحلم بقى حقيقة. ❤️'
    }
  ];

  var bookIndex = 0;
  var bookTimers = [];

  function clearBookTimers() {
    bookTimers.forEach(function (t) { window.clearTimeout(t); });
    bookTimers = [];
  }

  function renderBookPage() {
    var page = BOOK_PAGES[bookIndex];
    bookImg.src = page.img;
    bookImg.alt = page.title;
    bookTitle.textContent = page.title;
    bookText.textContent = page.text;
    bookCounter.textContent = (bookIndex + 1) + ' / ' + BOOK_PAGES.length;
    bookPrev.disabled = bookIndex === 0;
    bookNext.disabled = bookIndex === BOOK_PAGES.length - 1;
  }

  function openBook() {
    bookOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    bookEndMsg.hidden = true;
    book.hidden = true;
    bookSplash.hidden = false;
    // restart splash animation
    bookSplash.style.animation = 'none';
    void bookSplash.offsetWidth;
    bookSplash.style.animation = '';

    clearBookTimers();
    bookTimers.push(window.setTimeout(function () {
      bookSplash.hidden = true;
      book.hidden = false;
      // restart the "opening" animation each time the book is opened
      book.style.animation = 'none';
      void book.offsetWidth;
      book.style.animation = '';
      bookIndex = 0;
      renderBookPage();
    }, 2400));
  }

  function closeBook() {
    clearBookTimers();
    bookOverlay.hidden = true;
    book.hidden = true;
    bookSplash.hidden = true;
    bookEndMsg.hidden = true;
    document.body.style.overflow = '';
  }

  bookOpenBtn.addEventListener('click', openBook);
  bookCloseBtn.addEventListener('click', closeBook);

  if (bookNext) bookNext.addEventListener('click', function () {
    if (bookIndex < BOOK_PAGES.length - 1) { bookIndex++; renderBookPage(); }
  });
  if (bookPrev) bookPrev.addEventListener('click', function () {
    if (bookIndex > 0) { bookIndex--; renderBookPage(); }
  });

  bookEndBtn.addEventListener('click', function () {
    book.hidden = true;
    bookEndMsg.hidden = false;
    bookEndMsg.style.animation = 'none';
    void bookEndMsg.offsetWidth;
    bookEndMsg.style.animation = '';
    clearBookTimers();
    bookTimers.push(window.setTimeout(closeBook, 3200));
  });

  /* ---------------------------------------------------------
     11) Escape يغلق الطبقات المفتوحة
     --------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!lightbox.hidden) { closeLightbox(); return; }
    if (!bookOverlay.hidden) { closeBook(); return; }
    if (!galleryOverlay.hidden) { galleryCloseBtn.click(); }
  });

  /* ---------------------------------------------------------
     12) التنقل بين صفحات الكتاب بلوحة المفاتيح
     --------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (bookOverlay.hidden || book.hidden) return;
    if (e.key === 'ArrowLeft')  { if (bookIndex < BOOK_PAGES.length - 1) { bookIndex++; renderBookPage(); } }
    if (e.key === 'ArrowRight') { if (bookIndex > 0) { bookIndex--; renderBookPage(); } }
  });

})();
