// ════════════════════════════════════════════════════════
// ADSY CRM — Config
// Supabase project TERPISAH dari Botwa (CRM punya database sendiri,
// data masuk lewat /api/handoff.js saat order Botwa berstatus 'delivered')
// ════════════════════════════════════════════════════════
window.SUPABASE_URL = 'https://YOUR-CRM-PROJECT.supabase.co';
window.SUPABASE_ANON_KEY = 'YOUR-CRM-ANON-KEY';

// WA Gateway CRM (Baileys terpisah dari Botwa — nomor WA berbeda)
window.WA_PROXY_URL = '/api/baileys-crm-proxy';

// Mode: 'mock' pakai data dummy di js/mock-data.js (untuk dev/demo)
//       'live' baca dari Supabase CRM beneran
window.CRM_MODE = 'mock';
