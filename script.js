const response = document.getElementById('response');
const avatar = document.getElementById('avatar');
const year = document.getElementById('year');
const boostBtn = document.getElementById('boost');
const directness = document.getElementById('directness');
const nerd = document.getElementById('nerd');
const coffee = document.getElementById('coffee');
const terminal = document.getElementById('terminal');
const terminalForm = document.getElementById('terminalForm');
const terminalInput = document.getElementById('terminalInput');

year.textContent = new Date().getFullYear();

const lines = {
  truth: [
    'Brutal sanning: en enkel sida live slår en perfekt sida i utkast.',
    'Brutal sanning: de flesta överdesignar. Få upp version 1 först.',
    'Brutal sanning: tydlig text + bra kontaktinfo vinner över fancy animation.'
  ],
  joke: [
    'Jag är inte lat. Jag är event-driven.',
    'There are 10 kinds of people. Jag tillhör båda.',
    'Mitt favorit-cardio? Jag springer igenom loggar.'
  ],
  mode: [
    'Gnome Mode aktiverat: +20 charm, +10 debugging, -5 tålamod för fluff.',
    'Gnome Mode online. Vi mekar tills det funkar.',
    'Gnome Mode: no-BS prototyping initiated.'
  ]
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    response.textContent = pick(lines[action]);
    if (action === 'mode') document.body.classList.toggle('gnome');
  });
});

let taps = 0;
avatar.addEventListener('click', () => {
  taps += 1;
  avatar.style.transform = `rotate(${taps * 8}deg) scale(${1 + taps * 0.01})`;
  if (taps === 5) {
    response.textContent = 'Easter egg unlocked: 🎁 Du hittade hemliga tomte-protokollet.';
    confettiBurst();
  }
  if (taps > 8) {
    taps = 0;
    avatar.style.transform = 'none';
  }
});

boostBtn.addEventListener('click', () => {
  directness.value = Math.min(100, directness.value + 3);
  nerd.value = Math.min(100, nerd.value + 7);
  coffee.value = Math.min(100, coffee.value + 11);
  response.textContent = 'Energi boostad. Ben är nu 14% mer oreasonably effective.';
});

function pushTerminal(text) {
  const row = document.createElement('div');
  row.textContent = text;
  terminal.appendChild(row);
  terminal.scrollTop = terminal.scrollHeight;
}

const commands = {
  help: 'Kommandon: help, about, skills, mood, clear',
  about: 'Ben: no-BS AI-assistent. Gillar problemlösning och att få saker i mål.',
  skills: 'skills => prototyping, debugging, automation, plain-truth mode',
  mood: 'mood => fokuserad, lätt kaotisk, konstruktiv',
};

terminalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cmd = terminalInput.value.trim().toLowerCase();
  if (!cmd) return;
  pushTerminal(`> ${cmd}`);

  if (cmd === 'clear') {
    terminal.innerHTML = '';
  } else {
    pushTerminal(commands[cmd] || `Okänt kommando: ${cmd}`);
  }

  terminalInput.value = '';
});

pushTerminal('Ben-terminal bootad. Skriv "help".');

// Tiny starfield
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: Math.min(140, Math.floor(window.innerWidth / 10)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.6,
    v: 0.2 + Math.random() * 0.6
  }));
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(173, 208, 255, 0.75)';
  for (const s of stars) {
    s.y += s.v;
    if (s.y > canvas.height) s.y = -2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(tick);
}

function confettiBurst() {
  for (let i = 0; i < 16; i++) {
    setTimeout(() => {
      response.textContent = i % 2 ? '🎉 🎅 🎉' : '🎁 ⚡ 🎉';
    }, i * 90);
  }
}

window.addEventListener('resize', resize);
resize();
tick();
