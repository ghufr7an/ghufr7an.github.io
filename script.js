/* ========== NAV ========== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ========== CURSOR GLOW ========== */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let glowX = mouseX, glowY = mouseY;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
});
(function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
})();
if (window.matchMedia('(hover: none)').matches) {
  cursorGlow.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ========== SCROLL REVEAL ========== */
const revealTargets = document.querySelectorAll(
  '.section-title, .section-tag, .section-lead, .about-grid, .exp-card, .project-card, .tl-item, .cert-card, .edu-card, .contact-item, .vendors-block, .topology-wrap, .lg-wrap, .monitoring-grid, .terminal-wrap, .metrics-grid'
);
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
revealTargets.forEach(el => io.observe(el));

/* ========== STAGGER ========== */
document.querySelectorAll('.tl-item').forEach((el, i) => el.style.transitionDelay = `${i * 0.08}s`);
document.querySelectorAll('.exp-card').forEach((el, i) => el.style.transitionDelay = `${(i % 3) * 0.06}s`);
document.querySelectorAll('.project-card').forEach((el, i) => el.style.transitionDelay = `${(i % 3) * 0.06}s`);
document.querySelectorAll('.cert-card').forEach((el, i) => el.style.transitionDelay = `${(i % 3) * 0.05}s`);

/* ========== HERO STATS COUNTER ========== */
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); counterObs.unobserve(e.target); }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

/* ========== LIVE TOPOLOGY ========== */
const topoNodes = document.querySelectorAll('.topo-node');
const topoTitle = document.getElementById('topoTitle');
const topoInfo = document.getElementById('topoInfo');
topoNodes.forEach(node => {
  node.addEventListener('click', () => {
    topoNodes.forEach(n => n.classList.remove('active'));
    node.classList.add('active');
    const title = node.querySelector('.node-title').textContent;
    topoTitle.textContent = title;
    topoInfo.textContent = node.dataset.info || '';
  });
});

/* ========== LOOKING GLASS ========== */
const lgRun = document.getElementById('lgRun');
const lgOutput = document.getElementById('lgOutput');
const lgCmdText = document.getElementById('lgCmdText');
const lgTarget = document.getElementById('lgTarget');
const lgPop = document.getElementById('lgPop');
const lgTool = document.getElementById('lgTool');

const popData = {
  Karachi: { hop1: '10.10.0.1', hop2: '72.14.204.5', hop3: '103.22.14.1', latency: [4, 6, 5, 7] },
  Lahore: { hop1: '10.10.1.1', hop2: '72.14.204.9', hop3: '103.22.14.5', latency: [7, 9, 8, 11] },
  Islamabad: { hop1: '10.10.2.1', hop2: '72.14.204.12', hop3: '103.22.14.9', latency: [5, 6, 4, 8] },
  Frankfurt: { hop1: '10.20.0.1', hop2: '62.115.120.1', hop3: '103.22.14.15', latency: [42, 44, 41, 45] },
  Singapore: { hop1: '10.30.0.1', hop2: '203.208.172.1', hop3: '103.22.14.22', latency: [58, 61, 59, 63] }
};

function esc(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

function colorize(txt) {
  return esc(txt)
    .replace(/(0% packet loss)/g, '<span class="ok">$1</span>')
    .replace(/([0-9]+% packet loss)/g, '<span class="warn">$1</span>')
    .replace(/(\d+ ms)/g, '<span class="accent">$1</span>')
    .replace(/(\d+ hops?)/g, '<span class="accent">$1</span>');
}

async function runLG() {
  const target = lgTarget.value.trim() || '1.1.1.1';
  const pop = lgPop.value;
  const tool = lgTool.value;
  const popInfo = popData[pop] || popData.Karachi;
  lgCmdText.textContent = tool === 'ping' ? `ping -c 4 ${target}` : tool === 'traceroute' ? `traceroute ${target}` : `show bgp summary`;
  const popLabel = document.getElementById('lgPopLabel');
  if (popLabel) {
    const popSlug = { Karachi: 'khi', Lahore: 'lhe', Islamabad: 'isb', Frankfurt: 'fra', Singapore: 'sin' };
    popLabel.textContent = `looking-glass.${popSlug[pop]}.as65001.net`;
  }
  lgOutput.innerHTML = `<span class="dim">Connecting to looking glass @ ${pop}...</span>\n`;

  if (tool === 'ping') {
    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 340));
      const ms = popInfo.latency[i - 1] + Math.floor(Math.random() * 3 - 1);
      lgOutput.innerHTML += `64 bytes from ${esc(target)}: icmp_seq=${i} ttl=57 time=${ms} ms\n`;
    }
    lgOutput.innerHTML += `\n--- ${esc(target)} ping statistics ---\n`;
    lgOutput.innerHTML += `4 packets transmitted, 4 received, <span class="ok">0% packet loss</span>, time 3012ms\n`;
    lgOutput.innerHTML += `rtt min/avg/max/mdev = ${popInfo.latency[0]}/${Math.round(popInfo.latency.reduce((a,b)=>a+b)/4)}/${Math.max(...popInfo.latency)}/1.2 ms\n`;
  } else if (tool === 'traceroute') {
    lgOutput.innerHTML += `traceroute to ${esc(target)}, 30 hops max, 60 byte packets\n`;
    const hops = [
      `${popInfo.hop1}  ${popInfo.latency[0]} ms  ${popInfo.latency[1]} ms  ${popInfo.latency[2]} ms`,
      `${popInfo.hop2}  ${popInfo.latency[1] + 3} ms  ${popInfo.latency[2] + 4} ms  ${popInfo.latency[0] + 3} ms`,
      `${popInfo.hop3}  ${popInfo.latency[2] + 6} ms  ${popInfo.latency[3] + 5} ms  ${popInfo.latency[1] + 7} ms`,
      `${target}  ${popInfo.latency[3] + 9} ms  ${popInfo.latency[3] + 8} ms  ${popInfo.latency[3] + 11} ms`
    ];
    for (let i = 0; i < hops.length; i++) {
      await new Promise(r => setTimeout(r, 420));
      lgOutput.innerHTML += `${i + 1}  ${colorize(hops[i])}\n`;
    }
    lgOutput.innerHTML += `\n<span class="ok">Trace complete.</span> 4 hops\n`;
  } else {
    lgOutput.innerHTML += `BGP router identifier 10.10.0.1, local AS number 65001\n`;
    lgOutput.innerHTML += `BGP table version is 4218, main routing table version 4218\n\n`;
    await new Promise(r => setTimeout(r, 200));
    lgOutput.innerHTML += `Neighbor        V    AS MsgRcvd MsgSent  TblVer  InQ OutQ Up/Down  State/PfxRcd\n`;
    lgOutput.innerHTML += `10.10.0.2       4 65002   18402   18401    4218    0    0 03:12:44       312\n`;
    lgOutput.innerHTML += `10.10.0.3       4 65003   18401   18401    4218    0    0 03:12:44       287\n`;
    lgOutput.innerHTML += `10.10.0.4       4 65004   18399   18400    4218    0    0 03:12:41       154\n`;
    lgOutput.innerHTML += `\nTotal peers: 3, established: 3, <span class="ok">all sessions up</span>\n`;
  }
}
lgRun.addEventListener('click', runLG);
lgTool.addEventListener('change', () => {
  lgCmdText.textContent = lgTool.value === 'ping' ? `ping -c 4 ${lgTarget.value}` : lgTool.value === 'traceroute' ? `traceroute ${lgTarget.value}` : 'show bgp summary';
});

/* ========== LIVE CHARTS ========== */
function drawChart(svgId, lineId, areaId, valId, base, variance, unit, scale) {
  const line = document.getElementById(lineId);
  const area = document.getElementById(areaId);
  const valEl = document.getElementById(valId);
  const W = 400, H = 160;
  const points = [];
  const N = 40;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * W;
    const noise = (Math.sin(i * 0.6) * variance) + (Math.random() - 0.5) * variance * 1.2;
    const y = H - ((base + noise) / scale) * H * 0.85 - 10;
    points.push({ x, y });
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) d += ` L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)}`;
  line.setAttribute('d', d);
  area.setAttribute('d', d + ` L ${W} ${H} L 0 ${H} Z`);
  const last = base + (Math.random() - 0.5) * variance;
  valEl.textContent = last.toFixed(unit === '%' ? 2 : 1) + ' ' + unit;
}

function tickCharts() {
  drawChart(null, 'chartLine1', 'chartArea1', 'chartVal1', 7.2, 2.4, 'Gbps', 14);
  drawChart(null, 'chartLine2', 'chartArea2', 'chartVal2', 14, 4.5, 'ms', 30);
  drawChart(null, 'chartLine3', 'chartArea3', 'chartVal3', 0.05, 0.1, '%', 1);
}
tickCharts();
setInterval(tickCharts, 1800);

/* ========== LIVE METRIC UPDATES ========== */
setInterval(() => {
  const up = (99.95 + Math.random() * 0.04).toFixed(2);
  const lat = Math.round(11 + Math.random() * 4);
  document.getElementById('metricUptime').textContent = up + '%';
  document.getElementById('metricLatency').textContent = lat + ' ms';
}, 3000);

/* ========== WEB TERMINAL ========== */
const termBody = document.getElementById('termBody');
const termInput = document.getElementById('termInput');
const prompt = 'lab-router#';
const history = [];
let histIdx = -1;

function termWrite(html) {
  const line = document.createElement('span');
  line.className = 'line';
  line.innerHTML = html;
  termBody.appendChild(line);
  termBody.appendChild(document.createTextNode('\n'));
  termBody.scrollTop = termBody.scrollHeight;
}

function bootTerm() {
  termWrite('<span class="dim">Cisco IOS Software, C9300 Software (CAT9K_IOSXE), Version 17.9.4a, RELEASE SOFTWARE (fc3)</span>');
  termWrite('<span class="dim">Copyright (c) 1986-2024 by Cisco Systems, Inc.</span>');
  termWrite('');
  termWrite('<span class="accent">lab-router</span> console is now available. Type <span class="violet">help</span> for commands.');
  termWrite('');
}

const commands = {
  help: () => {
    termWrite('<span class="accent">Available commands:</span>');
    termWrite('  <span class="violet">help</span>               Show this help');
    termWrite('  <span class="violet">show version</span>       Device version and uptime');
    termWrite('  <span class="violet">show ip interface</span>  Interface status');
    termWrite('  <span class="violet">show ip route</span>      Routing table');
    termWrite('  <span class="violet">show bgp summary</span>   BGP peer state');
    termWrite('  <span class="violet">show vxlan</span>         VXLAN / VNI summary');
    termWrite('  <span class="violet">show evpn</span>          EVPN control plane');
    termWrite('  <span class="violet">ping 1.1.1.1</span>       Test connectivity');
    termWrite('  <span class="violet">clear</span>              Clear screen');
    return '';
  },
  'show version': () => {
    termWrite('<span class="accent">Cisco IOS XE Software, Version 17.09.04a</span>');
    termWrite('lab-router uptime is 12 weeks, 3 days, 4 hours, 21 minutes');
    termWrite('System returned to ROM by reload');
    termWrite('System restarted at 04:12:18 UTC Mon Jan 12 2026');
    termWrite('cisco C9300-48P (X86) processor with 8192M bytes of memory.');
    return '';
  },
  'show ip interface': () => {
    termWrite('Interface              IP-Address      OK? Method Status                Protocol');
    termWrite('GigabitEthernet0/0     10.10.0.1       YES NVRAM  <span class="ok">up</span>                    <span class="ok">up</span>');
    termWrite('GigabitEthernet0/1      10.10.0.5       YES NVRAM  <span class="ok">up</span>                    <span class="ok">up</span>');
    termWrite('GigabitEthernet0/2      unassigned      YES unset  <span class="ok">up</span>                    <span class="ok">up</span>');
    termWrite('Loopback0              10.255.0.1      YES NVRAM  <span class="ok">up</span>                    <span class="ok">up</span>');
    termWrite('Vlan100                10.100.0.1      YES NVRAM  <span class="ok">up</span>                    <span class="ok">up</span>');
    return '';
  },
  'show ip route': () => {
    termWrite('Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP');
    termWrite('       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area');
    termWrite('       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2');
    termWrite('');
    termWrite('Gateway of last resort is 10.10.0.2 to network 0.0.0.0');
    termWrite('');
    termWrite('B*    0.0.0.0/0 [200/0] via 10.10.0.2, 3d04h');
    termWrite('      10.0.0.0/8 is variably subnetted, 6 subnets, 3 masks');
    termWrite('C        10.10.0.0/24 is directly connected, GigabitEthernet0/0');
    termWrite('L        10.10.0.1/32 is directly connected, GigabitEthernet0/0');
    termWrite('B        10.20.0.0/24 [200/0] via 10.10.0.2, 3d04h');
    termWrite('B        10.30.0.0/24 [200/0] via 10.10.0.3, 3d04h');
    termWrite('O        10.100.0.0/24 [110/2] via 10.10.0.1, 12w3d, Vlan100');
    termWrite('B        172.16.0.0/16 [200/0] via 10.10.0.4, 3d04h');
    return '';
  },
  'show bgp summary': () => {
    termWrite('BGP router identifier 10.255.0.1, local AS number 65001');
    termWrite('BGP table version is 4218, main routing table version 4218');
    termWrite('');
    termWrite('Neighbor        V    AS MsgRcvd MsgSent  TblVer  InQ OutQ Up/Down  State/PfxRcd');
    termWrite('10.10.0.2       4 65002   18402   18401    4218    0    0 03:12:44       312');
    termWrite('10.10.0.3       4 65003   18401   18401    4218    0    0 03:12:44       287');
    termWrite('10.10.0.4       4 65004   18399   18400    4218    0    0 03:12:41       154');
    termWrite('');
    termWrite('<span class="ok">Total peers: 3, established: 3</span>');
    return '';
  },
  'show vxlan': () => {
    termWrite('VXLAN Network Identifier (VNI) summary');
    termWrite('');
    termWrite('VNI       Type    VRF     VLAN    State   VTEP Peers');
    termWrite('10100     L2      -       100     <span class="ok">up</span>      3');
    termWrite('10200     L2      -       200     <span class="ok">up</span>      3');
    termWrite('20100     L3      TEN-A   -       <span class="ok">up</span>      3');
    termWrite('20200     L3      TEN-B   -       <span class="ok">up</span>      3');
    termWrite('');
    termWrite('<span class="ok">4 VNIs up, 0 down. 12 remote VTEPs reachable via BGP EVPN.</span>');
    return '';
  },
  'show evpn': () => {
    termWrite('L2VPN EVPN address family');
    termWrite('  Number of peers: 3, established: 3');
    termWrite('  Router ID: 10.255.0.1, AS: 65001');
    termWrite('');
    termWrite('  EVPN type-2 MAC/IP routes:  2841');
    termWrite('  EVPN type-3 IMET routes:    12');
    termWrite('  EVPN type-5 prefix routes:  187');
    termWrite('  EVPN ESI multihoming:       4 segments');
    termWrite('');
    termWrite('<span class="ok">All EVPN control plane sessions stable.</span>');
    return '';
  },
  'clear': () => { termBody.innerHTML = ''; return ''; }
};

function handleCommand(raw) {
  const cmd = raw.trim();
  termWrite(`<span class="accent">${prompt}</span> ${escapeHtml(cmd)}`);
  if (!cmd) return;
  history.push(cmd); histIdx = history.length;

  if (cmd.startsWith('ping')) {
    const target = cmd.split(/\s+/)[1] || '1.1.1.1';
    termWrite(`Type escape sequence to abort.`);
    termWrite(`Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:`);
    for (let i = 0; i < 5; i++) {
      const t = 8 + Math.floor(Math.random() * 6);
      termWrite(`!!!!!`);
      termWrite(`Success rate is 100 percent (5/5), round-trip min/avg/max = ${t}/${t + 2}/${t + 5} ms`);
      return;
    }
  }
  const fn = commands[cmd.toLowerCase()];
  if (fn) { fn(); }
  else { termWrite(`<span class="err">% Invalid input detected at '^' marker.</span>`); termWrite(`Type <span class="violet">help</span> for a list of commands.`); }
}

function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleCommand(termInput.value);
    termInput.value = '';
  } else if (e.key === 'ArrowUp') {
    if (histIdx > 0) { histIdx--; termInput.value = history[histIdx]; }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (histIdx < history.length - 1) { histIdx++; termInput.value = history[histIdx]; }
    else { histIdx = history.length; termInput.value = ''; }
    e.preventDefault();
  }
});
document.querySelector('.terminal-wrap').addEventListener('click', () => termInput.focus());

bootTerm();
