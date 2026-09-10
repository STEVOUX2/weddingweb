/* ═══════════════════════════════════════════════════════════════
   Devika & Nidheesh — Wedding Website Script
   Ultra-premium, GPU-optimized, smooth-scroll experience
   No jank. Only transform/opacity animated for compositor.
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── APPS SCRIPT URL ──────────────────────────────────────────
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZPGD-qPcMNvJOKXdqPFDB67rCd8r7b77iA6HnhsAKv3gCeaOQaSRrQGNf1EOlDSbF/exec';

  // ── UTILITIES ────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  var APP = $('app');

  // Force scroll to top on reload
  if (APP) {
    // Some browsers try to restore scroll on load; we override it.
    history.scrollRestoration = 'manual';
    APP.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  // ── LOADER ───────────────────────────────────────────────────
  // Hide loader after assets+animations settle (~2.4s)
  function hideLoader() {
    var loader = $('loader');
    if (!loader) return;
    setTimeout(function () {
      loader.classList.add('hide');
      // Trigger cinematic hero entrance on #hero element
      var hero = document.getElementById('hero');
      if (hero) {
        requestAnimationFrame(function () {
          hero.classList.add('loaded');
        });
      }
    }, 3000);
  }
  hideLoader();

  // ── HERO COUNTDOWN ───────────────────────────────────────────
  function initCountdown() {
    var dEl = $('cd-d'), hEl = $('cd-h'), mEl = $('cd-m'), sEl = $('cd-s');
    if (!dEl || !hEl || !mEl || !sEl) return;
    
    // Set target to October 24, 2026 09:00:00 (local time)
    var target = new Date(2026, 9, 24, 9, 0, 0).getTime();

    function update() {
      var now = new Date().getTime();
      var diff = target - now;

      if (diff <= 0) {
        dEl.innerText = '00'; hEl.innerText = '00'; mEl.innerText = '00'; sEl.innerText = '00';
        return;
      }

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);

      dEl.innerText = d < 10 ? '0' + d : d;
      hEl.innerText = h < 10 ? '0' + h : h;
      mEl.innerText = m < 10 ? '0' + m : m;
      sEl.innerText = s < 10 ? '0' + s : s;
    }
    
    update();
    setInterval(update, 1000);
  }
  initCountdown();
  // ── STORY SCROLLER DOTS ───────────────────────────────────────
  var storyScroller = document.getElementById('story-scroller');
  var ssDots = document.querySelectorAll('.ss-dot');

  if (storyScroller && ssDots.length) {
    // Update dots on scroll
    storyScroller.addEventListener('scroll', function () {
      var idx = Math.round(storyScroller.scrollLeft / storyScroller.offsetWidth);
      ssDots.forEach(function (d, i) {
        d.classList.toggle('active', i === idx);
      });
    }, { passive: true });

    // Dot click scrolls to panel
    ssDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.getAttribute('data-idx'), 10);
        storyScroller.scrollTo({ left: idx * storyScroller.offsetWidth, behavior: 'smooth' });
      });
    });

    // Drag to scroll on desktop
    var ssDown = false, ssStartX, ssScrollLeft;
    storyScroller.addEventListener('mousedown', function (e) {
      ssDown = true;
      ssStartX = e.pageX - storyScroller.offsetLeft;
      ssScrollLeft = storyScroller.scrollLeft;
      storyScroller.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', function () {
      if (!ssDown) return;
      ssDown = false;
      storyScroller.style.cursor = '';
    });
    storyScroller.addEventListener('mousemove', function (e) {
      if (!ssDown) return;
      e.preventDefault();
      var x = e.pageX - storyScroller.offsetLeft;
      storyScroller.scrollLeft = ssScrollLeft - (x - ssStartX);
    });
  }

  // ── SCROLL REVEAL (IntersectionObserver) ─────────────────────
  var revealEls = qsa('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── 3D TILT — Invitation Card ────────────────────────────────
  // GPU-only: only transforms, smooth, mobile-aware
  var invCard = $('inv-card');
  if (invCard && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    invCard.addEventListener('mousemove', function (e) {
      var rect  = invCard.getBoundingClientRect();
      var cx    = rect.left + rect.width / 2;
      var cy    = rect.top + rect.height / 2;
      var dx    = (e.clientX - cx) / (rect.width / 2);
      var dy    = (e.clientY - cy) / (rect.height / 2);
      var rotX  = -dy * 6;
      var rotY  =  dx * 6;
      invCard.style.transform =
        'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateZ(6px)';
      invCard.style.boxShadow =
        (rotY * -1.5) + 'px ' + (rotX * 1.5) + 'px 50px rgba(0,0,0,.12)';
    });
    invCard.addEventListener('mouseleave', function () {
      invCard.style.transform = '';
      invCard.style.boxShadow = '';
    });
  }

  // Gallery auto-carousel runs unconditionally without pausing on hover/touch

  // ── MUSIC TOGGLE & AUTO-PLAY ─────────────────────────────────
  //
  // Behaviour:
  //  • Page loads silent (muted) — bypasses browser autoplay block
  //  • EVERY reload: first interaction (touch/click/scroll) → music plays
  //  • The button is the ONLY way to pause or resume during a session
  // ─────────────────────────────────────────────────────────────
  var audio    = $('bg-audio');
  var musicBtn = $('music-toggle');
  var icPlay   = $('ic-play');
  var icPause  = $('ic-pause');

  // Tracks if audio has been unlocked this session
  var interacted = false;
  // Tracks if user manually paused via button during this session
  var userPaused = false;

  // Start silent to bypass browser autoplay block
  if (audio) {
    audio.muted  = true;
    audio.volume = 1;
  }

  // Update button icons
  function syncIcons(isPlaying) {
    if (icPlay)  icPlay.style.display  = isPlaying ? 'none' : '';
    if (icPause) icPause.style.display = isPlaying ? ''     : 'none';
  }
  syncIcons(false); // show play icon on load

  // Unlock and start audio — called on first real user gesture
  function unlockAudio() {
    if (interacted || userPaused) return;
    interacted = true;

    // Clean up ALL interaction listeners
    ['click', 'touchstart', 'keydown', 'pointerdown'].forEach(function (evt) {
      document.removeEventListener(evt, unlockAudio, true);
    });
    if (APP) APP.removeEventListener('scroll', unlockAudio, true);
    window.removeEventListener('scroll', unlockAudio, true);

    // Unmute and play
    audio.muted = false;
    var p = audio.play();
    if (p !== undefined) {
      p.then(function () {
        syncIcons(true);
      }).catch(function (err) {
        // Retry once on click-type events (some browsers need a second try)
        console.warn('Audio play blocked, will retry on next interaction:', err);
        interacted = false; // allow retry
      });
    }
  }

  // Register on DOCUMENT (capture phase) — catches clicks anywhere including
  // inside #app, iframes, shadow roots. Also listen on #app scroll since
  // it is the real scroll container, not window.
  ['click', 'touchstart', 'keydown', 'pointerdown'].forEach(function (evt) {
    document.addEventListener(evt, unlockAudio, { passive: true, capture: true });
  });
  if (APP) APP.addEventListener('scroll', unlockAudio, { passive: true });
  window.addEventListener('scroll', unlockAudio, { passive: true });

  // ── Button: ONLY toggle mechanism ──
  if (musicBtn && audio) {
    musicBtn.addEventListener('click', function (e) {
      e.stopPropagation();

      var isPlaying = !audio.paused && !audio.muted;

      if (isPlaying) {
        // Pause
        audio.pause();
        userPaused = true;
        syncIcons(false);
      } else {
        // Resume
        audio.muted = false;
        audio.play().then(function () {
          userPaused = false;
          interacted = true;
          syncIcons(true);
        }).catch(function (err) {
          console.warn('Audio resume failed:', err);
        });
      }
    });
  }

  // ── RSVP FORM ─────────────────────────────────────────────────
  var rsvpForm    = $('rsvp-form');
  var rsvpSuccess = $('rsvp-success');
  var rsvpSubmit  = $('rf-submit');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name      = ($('rf-name').value || '').trim();
      var guests    = ($('rf-guests').value || '').trim();
      var attending = '';
      qsa('input[name="attending"]').forEach(function (inp) {
        if (inp.checked) attending = inp.value;
      });
      var message = ($('rf-message').value || '').trim();

      // Validation
      if (!name) {
        $('rf-name').focus();
        $('rf-name').style.borderBottomColor = '#9B2226';
        return;
      }
      if (!guests) {
        $('rf-guests').focus();
        return;
      }
      if (!attending) {
        var firstLabel = qs('.rf-attend label');
        if (firstLabel) firstLabel.style.outline = '1px solid #9B2226';
        setTimeout(function () { if (firstLabel) firstLabel.style.outline = ''; }, 2000);
        return;
      }

      // Show loading
      rsvpSubmit.classList.add('loading');
      rsvpSubmit.disabled = true;

      var payload = JSON.stringify({
        name:      name,
        guests:    guests,
        attending: attending,
        message:   message,
      });

      fetch(APPS_SCRIPT_URL, {
        method:  'POST',
        mode:    'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body:    payload,
      })
      .then(function () {
        rsvpForm.style.display = 'none';
        rsvpSuccess.classList.add('show');
      })
      .catch(function (err) {
        console.error('RSVP error:', err);
        rsvpSubmit.classList.remove('loading');
        rsvpSubmit.disabled = false;
        alert('Could not submit RSVP. Please try calling us directly.');
      });
    });

    // Reset field error on input
    $('rf-name').addEventListener('input', function () {
      this.style.borderBottomColor = '';
    });
  }

  // ── STORY BLOCK PARALLAX ON SCROLL ───────────────────────────
  // Subtle depth — images shift slightly as they enter view
  var storyImgs = qsa('.story-block .story-img img');

  if (storyImgs.length && 'IntersectionObserver' in window) {
    var storyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transform = 'scale(1.0)';
        }
      });
    }, { threshold: 0.2 });
    storyImgs.forEach(function (img) {
      img.style.transform = 'scale(1.06)';
      img.style.transition = 'transform 1.2s cubic-bezier(.23,1,.32,1)';
      storyObs.observe(img);
    });
  }

  // ── TEXT PARALLAX (SYNC WITH SCROLL) ─────────────────────────
  var parallaxLayers = [
    { selector: '.story-caption .s-name, .story-panel .s-name', speed: 0.15 },
    { selector: '.story-caption .s-role, .story-panel .s-role, .story-panel .s-accent', speed: 0.08 },
    { selector: '.story-caption .s-num, .story-panel .s-num', speed: 0.03 }
  ];
  parallaxLayers.forEach(function(layer) { layer.els = qsa(layer.selector); });

  if (APP) {
    APP.addEventListener('scroll', function() {
      requestAnimationFrame(function() {
        var viewCenter = window.innerHeight / 2;
        parallaxLayers.forEach(function(layer) {
          layer.els.forEach(function(el) {
            var parent = el.closest('.story-block');
            if (!parent) return;
            var rect = parent.getBoundingClientRect();
            var parentCenter = rect.top + (rect.height / 2);
            var diff = parentCenter - viewCenter;
            
            // Constrain diff to avoid text flying completely out of bounds on long screens
            if (diff > 600) diff = 600;
            if (diff < -600) diff = -600;
            
            var yOffset = diff * layer.speed;
            el.style.transform = 'translate3d(0, ' + yOffset + 'px, 0)';
          });
        });
      });
    }, { passive: true });
  }

  // ── SCHEDULE ROW — tap / click highlight on mobile ────────────
  qsa('.sched-row').forEach(function (row) {
    row.addEventListener('click', function () {
      this.style.background = 'var(--parchment)';
      setTimeout(function () { row.style.background = ''; }, 800);
    });
  });

  // ── SMOOTH ANCHOR SCROLL ──────────────────────────────────────
  qsa('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── PEARL THREAD: stagger light animation on visibility ───────
  // Already handled by CSS animation-delay; JS does nothing extra.

})();
