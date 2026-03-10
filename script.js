// PARTICLES
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [], W, H;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4; this.vy = -Math.random() * 0.5 - 0.1;
    this.r = Math.random() * 2 + 0.5; this.alpha = Math.random() * 0.45 + 0.1;
    this.color = ['#4f8ef7','#7c5cfc','#c355f5','#22d3ee','#f5c518'][Math.floor(Math.random()*5)];
    this.life = 0; this.maxLife = Math.random() * 200 + 100;
  }
  update() { this.x += this.vx; this.y += this.vy; this.life++; if (this.life > this.maxLife || this.y < 0) this.reset(); }
  draw() {
    ctx.save(); ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
    ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
}

function initP() { particles = []; for (let i = 0; i < 90; i++) particles.push(new Particle()); }

function animP() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx+dy*dy);
      if (d < 110) { ctx.save(); ctx.globalAlpha = (1-d/110)*0.06; ctx.strokeStyle='#7c5cfc'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.stroke(); ctx.restore(); }
    }
    particles[i].update(); particles[i].draw();
  }
  requestAnimationFrame(animP);
}

resize(); initP(); animP();
window.addEventListener('resize', resize);

// COUNTDOWN
function tick() {
  const diff = new Date('2026-03-13T09:00:00+05:30') - Date.now();
  if (diff <= 0) { ['days','hours','mins','secs'].forEach(k => document.getElementById('cd-'+k).textContent='00'); return; }
  document.getElementById('cd-days').textContent  = String(Math.floor(diff/86400000)).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(Math.floor(diff%86400000/3600000)).padStart(2,'0');
  document.getElementById('cd-mins').textContent  = String(Math.floor(diff%3600000/60000)).padStart(2,'0');
  document.getElementById('cd-secs').textContent  = String(Math.floor(diff%60000/1000)).padStart(2,'0');
}
tick(); setInterval(tick, 1000);

// SCROLL REVEAL
const obs = new IntersectionObserver(entries => {
  entries.forEach((e,i) => { if(e.isIntersecting) setTimeout(()=>e.target.classList.add('visible'), i*70); });
}, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// HAMBURGER
const hb = document.getElementById('hamburger'), mm = document.getElementById('mobileMenu');
hb.addEventListener('click', () => mm.classList.toggle('open'));
function closeMobile() { mm.classList.remove('open'); }
document.addEventListener('click', e => { if (!hb.contains(e.target) && !mm.contains(e.target)) mm.classList.remove('open'); });

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

// DEPARTMENT DETAILS
function openDept(dept) {
  document.getElementById('dept-details-container').style.display = 'block';
  document.querySelectorAll('.dept-details').forEach(d => d.style.display = 'none');
  document.getElementById('dept-' + dept).style.display = 'block';
  document.getElementById('dept-' + dept).scrollIntoView({behavior:'smooth'});
}
function closeDept() {
  document.getElementById('dept-details-container').style.display = 'none';
}
