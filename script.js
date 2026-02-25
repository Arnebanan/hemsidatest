const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const response = $('#response');
const avatar = $('#avatar');
const typed = $('#typed');
const terminal = $('#terminal');
const terminalForm = $('#terminalForm');
const terminalInput = $('#terminalInput');
const memeBar = $('#meme');
const chaosBar = $('#chaos');
const flexBar = $('#flex');
const fpsEl = $('#fps');
const velocityEl = $('#velocity');
const seedEl = $('#seed');
const audioToggle = $('#audioToggle');

$('#year').textContent = new Date().getFullYear();

const roastLines = [
  'Brutalt: du vill ha kaos men ändå pixelperfekt. Jag respekterar det.',
  'Sanningen: din backlog är en true crime-serie.',
  'Kod-roast: du kallar det scope creep, jag kallar det feature farming.',
  'Du bad om meme mode. Nu får du ingen warranty.'
];

const typedLines = [
  'Meme engineer.',
  'Gnome of chaos.',
  'No-BS? Not tonight.',
  'JavaScript maxed out.'
];

let typeIdx = 0;
let charIdx = 0;
let deleting = false;

function typeLoop() {
  const line = typedLines[typeIdx];
  typed.textContent = deleting ? line.slice(0, --charIdx) : line.slice(0, ++charIdx);

  let delay = deleting ? 42 : 70;
  if (!deleting && charIdx === line.length) {
    delay = 900;
    deleting = true;
  }
  if (deleting && charIdx === 0) {
    deleting = false;
    typeIdx = (typeIdx + 1) % typedLines.length;
    delay = 220;
  }
  setTimeout(typeLoop, delay);
}
typeLoop();

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

$$('[data-action]').forEach((btn) => {
  btn.addEventListener('click', () => runAction(btn.dataset.action));
});

function runAction(action) {
  if (action === 'roast') {
    response.textContent = rnd(roastLines);
    incBars(8, 10, 3);
    if (audio.enabled) audio.zap();
  }
  if (action === 'chaos') {
    chaosBurst();
    response.textContent = 'Chaos Burst aktiv. Frontenden skakar av stolthet.';
    incBars(12, 18, 5);
    if (audio.enabled) audio.boom();
  }
  if (action === 'matrix') {
    state.matrix = !state.matrix;
    document.body.classList.toggle('matrix', state.matrix);
    response.textContent = state.matrix ? 'Matrix Rain: ON' : 'Matrix Rain: OFF';
    if (audio.enabled) audio.blip();
  }
}

function incBars(m, c, f) {
  memeBar.value = clamp(memeBar.value + m, 0, 100);
  chaosBar.value = clamp(chaosBar.value + c, 0, 100);
  flexBar.value = clamp(flexBar.value + f, 0, 100);
}

let taps = 0;
avatar.addEventListener('click', () => {
  taps += 1;
  avatar.style.transform = `rotate(${taps * 7}deg) scale(${1 + taps * 0.02})`;
  avatar.classList.add('glitch');
  setTimeout(() => avatar.classList.remove('glitch'), 260);
  incBars(4, 5, 7);

  if (taps % 5 === 0) {
    response.textContent = 'Easter egg: Ben.exe unlocked “overclock mode”.';
    spawnFloating('🎅⚡');
    if (audio.enabled) audio.coin();
  }
  if (taps > 12) {
    taps = 0;
    avatar.style.transform = 'none';
  }
});

function spawnFloating(text) {
  const node = document.createElement('div');
  node.textContent = text;
  node.style.position = 'fixed';
  node.style.left = `${window.innerWidth * (0.2 + Math.random() * 0.6)}px`;
  node.style.top = `${window.innerHeight * (0.2 + Math.random() * 0.6)}px`;
  node.style.fontSize = `${22 + Math.random() * 32}px`;
  node.style.zIndex = 999;
  node.style.pointerEvents = 'none';
  node.style.transition = 'transform 1200ms ease, opacity 1200ms ease';
  document.body.appendChild(node);
  requestAnimationFrame(() => {
    node.style.transform = 'translateY(-70px) rotate(15deg)';
    node.style.opacity = '0';
  });
  setTimeout(() => node.remove(), 1300);
}

const commands = {
  help: 'Kommandon: help, roast, matrix, party, status, clear',
  roast: () => rnd(roastLines),
  matrix: () => {
    runAction('matrix');
    return `Matrix: ${state.matrix ? 'ON' : 'OFF'}`;
  },
  party: () => {
    chaosBurst();
    return 'Party mode engagerad. CPU ber om nåd.';
  },
  status: () => `meme=${memeBar.value} chaos=${chaosBar.value} flex=${flexBar.value}`
};

function tprint(text) {
  const row = document.createElement('div');
  row.textContent = text;
  terminal.appendChild(row);
  terminal.scrollTop = terminal.scrollHeight;
}

terminalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cmd = terminalInput.value.trim().toLowerCase();
  if (!cmd) return;
  tprint(`> ${cmd}`);
  if (cmd === 'clear') terminal.innerHTML = '';
  else {
    const out = commands[cmd];
    tprint(typeof out === 'function' ? out() : out || `Unknown cmd: ${cmd}`);
  }
  terminalInput.value = '';
});

tprint('Ben Terminal++ bootad. skriv "help"');

const state = {
  matrix: false,
  mouseX: innerWidth / 2,
  mouseY: innerHeight / 2,
  mouseVX: 0,
  mouseVY: 0,
  lastMX: innerWidth / 2,
  lastMY: innerHeight / 2
};

window.addEventListener('pointermove', (e) => {
  state.mouseVX = e.clientX - state.lastMX;
  state.mouseVY = e.clientY - state.lastMY;
  state.lastMX = e.clientX;
  state.lastMY = e.clientY;
  state.mouseX = e.clientX;
  state.mouseY = e.clientY;
  velocityEl.textContent = Math.round(Math.hypot(state.mouseVX, state.mouseVY));
});

const bg = $('#fx-bg');
const bgCtx = bg.getContext('2d');
const ol = $('#fx-overlay');
const olCtx = ol.getContext('2d');

let particles = [];
let matrixCols = [];

function resize() {
  bg.width = ol.width = window.innerWidth;
  bg.height = ol.height = window.innerHeight;
  particles = Array.from({ length: Math.min(180, Math.floor(innerWidth / 9)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    r: 0.8 + Math.random() * 2,
  }));

  const cols = Math.floor(innerWidth / 16);
  matrixCols = Array.from({ length: cols }, () => Math.random() * -innerHeight);

  seedEl.textContent = `BEN-${Math.floor(Math.random() * 9000 + 1000)}`;
}
window.addEventListener('resize', resize);
resize();

let last = performance.now();
let frameCount = 0;
let fpsClock = last;

function drawMatrix() {
  olCtx.fillStyle = 'rgba(5, 8, 16, 0.08)';
  olCtx.fillRect(0, 0, ol.width, ol.height);
  olCtx.fillStyle = '#5CFF90';
  olCtx.font = '14px ui-monospace, monospace';
  matrixCols.forEach((y, i) => {
    const char = String.fromCharCode(0x30A0 + Math.random() * 96);
    const x = i * 16;
    olCtx.fillText(char, x, y);
    matrixCols[i] = y > ol.height + Math.random() * 300 ? Math.random() * -200 : y + 15;
  });
}

function drawParticles(dt) {
  bgCtx.clearRect(0, 0, bg.width, bg.height);
  for (const p of particles) {
    const dx = state.mouseX - p.x;
    const dy = state.mouseY - p.y;
    const dist = Math.hypot(dx, dy) + 0.001;
    const force = Math.max(0, 140 - dist) / 140;

    p.vx += (dx / dist) * force * 0.05;
    p.vy += (dy / dist) * force * 0.05;
    p.vx *= 0.985;
    p.vy *= 0.985;

    p.x += p.vx * dt * 0.06;
    p.y += p.vy * dt * 0.06;

    if (p.x < -10) p.x = innerWidth + 10;
    if (p.x > innerWidth + 10) p.x = -10;
    if (p.y < -10) p.y = innerHeight + 10;
    if (p.y > innerHeight + 10) p.y = -10;

    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `hsla(${(p.x + p.y) % 360}, 90%, 70%, .8)`;
    bgCtx.fill();
  }
}

function loop(now) {
  const dt = now - last;
  last = now;
  frameCount++;

  drawParticles(dt);
  olCtx.clearRect(0, 0, ol.width, ol.height);
  if (state.matrix) drawMatrix();

  if (now - fpsClock > 500) {
    fpsEl.textContent = `${Math.round((frameCount * 1000) / (now - fpsClock))} fps`;
    frameCount = 0;
    fpsClock = now;
  }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

function chaosBurst() {
  document.body.classList.add('chaos');
  for (let i = 0; i < 14; i++) {
    setTimeout(() => spawnFloating(rnd(['💥','🎅','⚡','🤖','🔥','💀'])), i * 55);
  }
  setTimeout(() => document.body.classList.remove('chaos'), 1200);
}

const audio = {
  enabled: false,
  ctx: null,
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  tone(freq = 440, duration = 0.09, type = 'square', gain = 0.03) {
    this.ensure();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g).connect(this.ctx.destination);
    osc.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.stop(now + duration);
  },
  blip() { this.tone(780, 0.06, 'triangle', 0.025); },
  zap() { this.tone(620, 0.08, 'sawtooth', 0.03); this.tone(930, 0.05, 'square', 0.02); },
  boom() { this.tone(120, 0.18, 'sine', 0.05); },
  coin() { this.tone(660, 0.05, 'square', 0.02); setTimeout(() => this.tone(980, 0.07, 'square', 0.02), 60); }
};

audioToggle.addEventListener('click', async () => {
  audio.enabled = !audio.enabled;
  audioToggle.textContent = `Audio: ${audio.enabled ? 'ON' : 'OFF'}`;
  if (audio.enabled) {
    audio.ensure();
    if (audio.ctx.state === 'suspended') await audio.ctx.resume();
    audio.coin();
  }
});
