// ════════════════════════════════════════════════════════
// ADSY CRM — Shared App Logic
// ════════════════════════════════════════════════════════

const NAV_ITEMS = [
  { href:'index.html',         label:'Ringkasan',      icon:`<line x1='18' y1='20' x2='18' y2='10'/><line x1='12' y1='20' x2='12' y2='4'/><line x1='6' y1='20' x2='6' y2='14'/>` },
  { href:'pipeline.html',      label:'Pipeline',       icon:`<rect x='3' y='5' width='6' height='6' rx='1'/><path d='m3 17 2 2 4-4'/><path d='M13 6h8'/><path d='M13 12h8'/><path d='M13 18h8'/>`, badgeId:'hotleadBadge' },
  { href:'conversations.html', label:'Percakapan',     icon:`<path d='M7.9 20A9 9 0 1 0 4 16.1L2 22Z'/>` },
  { href:'contacts.html',      label:'Pelanggan',      icon:`<path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M22 21v-2a4 4 0 0 0-3-3.87'/><path d='M16 3.13a4 4 0 0 1 0 7.75'/>` },
  { href:'insights.html',      label:'AI Insights',    icon:`<path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'/>` },
  { href:'repeat-orders.html', label:'Repeat Orders',  icon:`<polyline points='22 7 13.5 15.5 8.5 10.5 2 17'/><polyline points='16 7 22 7 22 13'/>` },
];

const SETTINGS_ITEM = { href:'settings.html', label:'Pengaturan', icon:`<path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'/><circle cx='12' cy='12' r='3'/>` };

function renderSidebar(activePage){
  const hot = MOCK_PIPELINE.filter(c=>c.stage==='hotlead').length;
  const navHTML = NAV_ITEMS.map(item => {
    const isActive = item.href === activePage;
    const badge = item.badgeId ? `<span class="sbadge" id="${item.badgeId}" style="${hot?'':'display:none'}">${hot}</span>` : '';
    return `<a class="sb-item${isActive?' active':''}" href="${item.href}">
      <span class="si"><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'>${item.icon}</svg></span>
      ${item.label}${badge}
    </a>`;
  }).join('');

  const handoffToday = MOCK_PIPELINE.filter(c=>c.stage==='baru').length;
  const closingToday = MOCK_PIPELINE.filter(c=>c.stage==='closing').length;

  document.getElementById('sidebar').innerHTML = `
    <div class="sb-brand">
      <div class="sb-logo">CRM</div>
      <div>
        <div class="sb-title">Adsy CRM</div>
        <div class="sb-subtitle">Post-Purchase Engine</div>
      </div>
    </div>
    <div class="sb-wa" id="sb-wa-status"><div class="bot-dot"></div> WA Gateway #2 — Online</div>
    <div class="sb-nav">
      ${navHTML}
      <div class="sb-divider"></div>
      <div class="sb-section">Akun</div>
      <a class="sb-item${activePage===SETTINGS_ITEM.href?' active':''}" href="${SETTINGS_ITEM.href}">
        <span class="si"><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'>${SETTINGS_ITEM.icon}</svg></span>
        ${SETTINGS_ITEM.label}
      </a>
    </div>
    <div class="sb-stats">
      <div class="sb-stats-title">Hari Ini</div>
      <div class="sb-stat-row"><span>Handoff Baru</span><span>${handoffToday}</span></div>
      <div class="sb-stat-row"><span>Follow-up Terkirim</span><span>14</span></div>
      <div class="sb-stat-row"><span>Closing Repeat</span><span>${closingToday}</span></div>
    </div>
    <div class="sb-user">
      <div class="sb-avatar">A</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12px;font-weight:500;color:#e2e8f0">Alam</div>
        <div style="font-size:11px;color:#475569">CEO</div>
      </div>
    </div>
  `;
}

function initials(n){ return (n||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(); }
function avatarColor(n){
  const colors=['#8b5cf6','#3b82f6','#0ea5e9','#10b981','#f59e0b','#ef4444','#6366f1','#ec4899'];
  let h=0; for(const c of (n||'')) h=(h*31+c.charCodeAt(0))%colors.length;
  return colors[Math.abs(h)];
}
function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
