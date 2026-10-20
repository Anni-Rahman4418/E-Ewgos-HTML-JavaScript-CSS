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
  track.style.transform = `translateX(${-index * (cards[0].offsetWidth + gap)}px)`;
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

// Progress bars animate when visible
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const track = e.target, fill = track.querySelector('i');
    const num = track.nextElementSibling;            // the "50%" / "90%" text next to the bar
    const target = +num.dataset.count;
    fill.style.width = fill.dataset.w + '%';
    let n = 0;
    const t = setInterval(() => {
      n += 2;
      if (n >= target) { n = target; clearInterval(t); }
      num.textContent = n + '%';
    }, 28);
    io.unobserve(track);
  });
}, { threshold: .4 });
document.querySelectorAll('.bar-track').forEach(b => io.observe(b));

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
orbit.addEventListener('pointermove', e => {
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
