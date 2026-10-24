document.documentElement.classList.add('js');
// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Carousel + category list (hover lights up a card / category)
const track = document.getElementById('track');
const cards = [...track.children];
const cats = [...document.querySelectorAll('#cats li')];
let index = 0;
function setActive(n) {            // n = the card to light up; -1 = none (all cards white)
  cards.forEach((c, k) => c.classList.toggle('on', k === n));
  cats.forEach((c, k) => c.classList.toggle('active', k === (n < 0 ? index : n)));
}
function go(i) {
  index = (i + cards.length) % cards.length;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = cards[0].offsetWidth + gap;                                   // one card + the gap
  const perView = Math.max(1, Math.floor((document.querySelector('.track-wrap').clientWidth + gap) / step));   // how many FULL cards fit
  const offset = Math.min(index, cards.length - perView);                    // never slide past the last full view
  track.style.transform = `translateX(${-offset * step}px)`;
  setActive(-1);
}
cards.forEach((c, n) => c.addEventListener('mouseenter', () => setActive(n)));
cats.forEach((li, n) => li.addEventListener('mouseenter', () => setActive(n)));
track.addEventListener('mouseleave', () => setActive(-1));
document.getElementById('cats').addEventListener('mouseleave', () => setActive(-1));
document.getElementById('next').addEventListener('click', () => go(index + 1));
document.getElementById('prev').addEventListener('click', () => go(index - 1));
cats.forEach((li, n) => li.querySelector('button').addEventListener('click', () => go(n)));
window.addEventListener('resize', () => go(index));
go(0);

// Progress bars: they play again every time you scroll to them (and when you point at them)
function runBar(bar) {
  const fill = bar.querySelector('i');
  const num = bar.nextElementSibling;                 // the "50%" / "90%" text next to the bar
  const target = +num.dataset.count;                  // number to count up to
  const dur = 1800;                                   // milliseconds
  cancelAnimationFrame(bar._raf);
  num.classList.remove('pop');
  const t0 = performance.now();
  (function tick(now) {
    const k = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);                 // starts fast, slows down at the end
    fill.style.width = (target * e) + '%';
    num.textContent = Math.round(target * e) + '%';
    if (k < 1) bar._raf = requestAnimationFrame(tick);
    else { void num.offsetWidth; num.classList.add('pop'); }
  })(t0);
}
function resetBar(bar) {
  cancelAnimationFrame(bar._raf);
  bar.querySelector('i').style.width = '0%';
  bar.nextElementSibling.textContent = '0%';
}
const io = new IntersectionObserver(entries => {
  entries.forEach(e => (e.isIntersecting ? runBar(e.target) : resetBar(e.target)));
}, { threshold: .6 });
document.querySelectorAll('.bar-track').forEach(b => {
  io.observe(b);
  b.addEventListener('mouseenter', () => runBar(b));  // point at a bar -> it plays again
});

// JOURNEY: picture 1 shows first. Moving the cursor onto an icon brings that icon's picture
// to the front (with a soft gradient). Leaving the icons returns to picture 1.
const orbit = document.getElementById('orbit');
const pics = [...document.querySelectorAll('.opic')];
const chips = [...document.querySelectorAll('.chip')];
let current = 0;
function showPic(i, hovered) {
  if (i === current && !hovered === !pics[i].classList.contains('grad')) return;
  pics.forEach((p, k) => {
    p.classList.remove('behind', 'anim');
    if (k !== i && k === current) p.classList.add('behind');   // old picture stays underneath
    if (k !== i) { p.classList.remove('front'); p.classList.remove('grad'); }
  });
  const p = pics[i];
  if (i !== current) { void p.offsetWidth; p.classList.add('anim'); }
  p.classList.add('front');
  p.classList.toggle('grad', hovered);
  chips.forEach((c, k) => c.classList.toggle('active', hovered && k === i));
  current = i;
}
chips.forEach((chip, i) => {
  chip.addEventListener('pointerenter', () => showPic(i, true));
  chip.addEventListener('focus', () => showPic(i, true));
  chip.addEventListener('click', () => showPic(i, true));          // tap on phones
});
// the big picture follows the cursor a little (moves while you move over it)
orbit.addEventListener('pointermove', e => {  if (e.pointerType !== 'mouse') return;                 // fingers don't move the picture
  const r = orbit.getBoundingClientRect();
  orbit.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5) * 2);
  orbit.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5) * 2);
});
orbit.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') showPic(0, false);
  orbit.style.setProperty('--mx', 0); orbit.style.setProperty('--my', 0);
});

// Contact form validation
const form = document.getElementById('form');
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('input, textarea').forEach(f => {
    const msg = f.parentElement.querySelector('.err');
    const bad = !f.value.trim();
    f.classList.toggle('invalid', bad);
    msg.textContent = bad ? 'This field is required' : '';
    if (bad) valid = false;
  });
  const ok = document.getElementById('ok');
  ok.hidden = !valid;
  if (valid) form.reset();
});

// Soft reveal when headings / text scroll into view
const rv = document.querySelectorAll('h2, .about .body, .champions .body, .premium .body, .contact .body, .av-text, .bar-t');
rv.forEach(el => el.classList.add('rv'));
const rvIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); rvIO.unobserve(e.target); }
}), { threshold: .15 });
rv.forEach(el => rvIO.observe(el));
// =====================================================================
// LAPTOP (mouse) or PHONE / TABLET (touch) ?  -> detected automatically
// =====================================================================
const touchQuery = window.matchMedia('(hover: none), (pointer: coarse)');
function markDevice() {
  document.documentElement.classList.toggle('touch', touchQuery.matches);
  document.documentElement.classList.toggle('mouse', !touchQuery.matches);
}
markDevice();
touchQuery.addEventListener('change', markDevice);        // e.g. a tablet with a keyboard attached

// ----- touch only: a tap lights a card up; tapping elsewhere switches things off -----
cards.forEach((c, n) => c.addEventListener('click', () => { if (touchQuery.matches) setActive(n); }));
document.addEventListener('touchstart', e => {
  if (!e.target.closest('.card, #cats')) setActive(-1);
  if (!e.target.closest('#orbit')) showPic(0, false);       // back to picture 1
}, { passive: true });

// =====================================================================
// 1) Links that go nowhere yet (href="#") must NOT jump to the top of the page
// =====================================================================
document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

// =====================================================================
// 2) Drag / swipe the slider: mouse on a laptop, finger on a phone or tablet
// =====================================================================
const slideWin = document.querySelector('.track-wrap');
let dragging = false, captured = false, dragStartX = 0, dragStartOffset = 0, dragMoved = 0, blockClick = false;

function slideInfo() {
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = cards[0].offsetWidth + gap;                                    // one card + gap
  const perView = Math.max(1, Math.floor((slideWin.clientWidth + gap) / step));
  return { step, max: cards.length - perView };                               // max = last full view
}
slideWin.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;                    // left button only
  const { step, max } = slideInfo();
  dragging = true; captured = false; dragMoved = 0; dragStartX = e.clientX;
  dragStartOffset = Math.min(index, max);
});
slideWin.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - dragStartX;
  dragMoved = Math.max(dragMoved, Math.abs(dx));
  if (!captured && dragMoved > 6) {                                           // real drag has started
    captured = true; slideWin.setPointerCapture(e.pointerId);
    slideWin.classList.add('grabbing'); track.style.transition = 'none';
  }
  if (!captured) return;
  const { step, max } = slideInfo();
  let x = -dragStartOffset * step + dx;
  x = Math.max(-max * step - step * .3, Math.min(step * .3, x));              // soft limits at both ends
  track.style.transform = `translateX(${x}px)`;
});
function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  const wasDrag = captured;
  captured = false; slideWin.classList.remove('grabbing'); track.style.transition = '';
  blockClick = wasDrag;                                                       // a drag must not count as a click
  const dx = e.clientX - dragStartX;
  const { step, max } = slideInfo();
  let target = Math.round(dragStartOffset - dx / step);                       // nearest card
  if (wasDrag && target === dragStartOffset && Math.abs(dx) > 40) target += dx < 0 ? 1 : -1;   // quick flick
  target = Math.max(0, Math.min(max, target));
  go(wasDrag ? target : index);
}
slideWin.addEventListener('pointerup', endDrag);
slideWin.addEventListener('pointercancel', endDrag);
slideWin.addEventListener('click', e => { if (blockClick) { e.preventDefault(); e.stopPropagation(); blockClick = false; } }, true);
slideWin.addEventListener('dragstart', e => e.preventDefault());
// =====================================================================
// 3) Laptop: scroll sideways over the slider (touchpad two-finger swipe, or Shift + mouse wheel)
//    -> the slider moves one card. Normal up/down scrolling still scrolls the page.
// =====================================================================
let wheelSum = 0, wheelLocked = false, wheelTimer;
slideWin.addEventListener('wheel', e => {
  const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
  if (!sideways) return;                                        // up/down = page keeps scrolling
  e.preventDefault();                                           // stop the page from moving sideways / going "back"
  const d = Math.abs(e.deltaX) >= Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => { wheelSum = 0; wheelLocked = false; }, 140);   // gesture finished -> ready again
  if (wheelLocked) return;                                      // one card per gesture (touchpads keep sending events)
  wheelSum += d;
  if (Math.abs(wheelSum) > 50) {
    go(Math.max(0, Math.min(cards.length - 1, index + (wheelSum > 0 ? 1 : -1))));
    wheelSum = 0; wheelLocked = true;
  }
}, { passive: false });