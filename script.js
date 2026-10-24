(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  function setMenu(open) {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
  }
  toggle.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  /* ---------- Active nav link while scrolling ---------- */
  var navMap = {};
  links.querySelectorAll('a').forEach(function (a) { navMap[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      Object.keys(navMap).forEach(function (k) { navMap[k].classList.toggle('active', k === en.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['home', 'about', 'unity', 'roblox', 'phaser', 'personal', 'contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- YouTube: thumbnail first, load player on click ---------- */
  document.querySelectorAll('.yt').forEach(function (box) {
    var id = box.dataset.id;
    var title = box.dataset.title || 'video';
    box.style.backgroundImage = 'url(https://i.ytimg.com/vi/' + id + '/hqdefault.jpg)';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Play ' + title + ' video');
    btn.innerHTML = '<span>&#9654;&nbsp; Watch video</span>';
    btn.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      f.title = title;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      box.replaceChildren(f);
    });
    box.appendChild(btn);
  });

  /* ---------- Galleries ---------- */
  var lightbox = document.querySelector('.lightbox');
  var lbImg = lightbox.querySelector('img');
  var lbSet = [], lbIndex = 0;

  function showLightbox(i) {
    lbIndex = (i + lbSet.length) % lbSet.length;
    lbImg.src = lbSet[lbIndex].src;
    lbImg.alt = lbSet[lbIndex].alt;
  }

  document.querySelectorAll('.gallery').forEach(function (gallery) {
    var track = gallery.querySelector('.gallery-track');
    var imgs = Array.prototype.slice.call(track.querySelectorAll('img'));
    if (imgs.length < 2) return;

    var bar = document.createElement('div');
    bar.className = 'gallery-bar';
    var prev = document.createElement('button');
    var next = document.createElement('button');
    prev.className = 'gallery-btn'; prev.innerHTML = '&larr;'; prev.setAttribute('aria-label', 'Previous image');
    next.className = 'gallery-btn'; next.innerHTML = '&rarr;'; next.setAttribute('aria-label', 'Next image');
    var count = document.createElement('span');
    count.className = 'gallery-count';
    var thumbs = document.createElement('div');
    thumbs.className = 'gallery-thumbs';

    imgs.forEach(function (img, i) {
      var t = document.createElement('button');
      t.type = 'button';
      t.setAttribute('aria-label', 'Show image ' + (i + 1));
      var ti = document.createElement('img');
      ti.src = img.getAttribute('src'); ti.alt = ''; ti.loading = 'lazy';
      t.appendChild(ti);
      t.addEventListener('click', function () { go(i); });
      thumbs.appendChild(t);

      img.addEventListener('click', function () {
        lbSet = imgs;
        showLightbox(i);
        lightbox.showModal();
      });
    });

    bar.append(prev, count, next, thumbs);
    gallery.after(bar);

    function current() { return Math.round(track.scrollLeft / track.clientWidth); }
    function go(i) {
      i = Math.max(0, Math.min(imgs.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth });
    }
    function update() {
      var i = current();
      prev.disabled = i === 0;
      next.disabled = i === imgs.length - 1;
      count.textContent = (i + 1) + ' / ' + imgs.length;
      thumbs.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-current', j === i); });
    }
    prev.addEventListener('click', function () { go(current() - 1); });
    next.addEventListener('click', function () { go(current() + 1); });
    var raf;
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Lightbox ---------- */
  lightbox.querySelector('.lightbox-close').addEventListener('click', function () { lightbox.close(); });
  lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', function () { showLightbox(lbIndex - 1); });
  lightbox.querySelector('.lightbox-nav.next').addEventListener('click', function () { showLightbox(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') showLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(lbIndex + 1);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
