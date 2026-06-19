# Adsy CRM — Post-Purchase Engine

Prototype frontend. Sister project ke **Botwa**, tapi pakai **Supabase project sendiri** (terpisah) supaya CRM bebas dikembangkan tanpa menyentuh database Botwa yang sudah produksi.

## Arsitektur

```
[BOTWA]  Supabase project A              [CRM]  Supabase project B (project ini)
Lead Baru → Closing → Proses → Kirim
                              │
                    status = 'delivered'
                              │
                    Database Webhook (Botwa)
                              ▼
                    POST /api/handoff.js  ──insert──▶  crm_contacts + crm_pipeline
                                                              │
                                              Follow-up → Nurture → Hot Lead → Closing Repeat
                                                              │
                                              crm_orders: Proses → Kirim (resi) → Sampai → (loop)
```

Botwa: lead baru sampai barang diterima — pegang database & WA gateway sendiri.
CRM: barang diterima sampai repeat order seterusnya, selamanya — pegang database & WA gateway (Baileys nomor #2) sendiri.

Dua sistem cuma "ngobrol" lewat satu titik: webhook handoff saat status order jadi `delivered`.

## Struktur

```
/index.html          → Ringkasan (overview pipeline)
/pipeline.html        → Kanban board (drag-drop antar stage)
/conversations.html   → Inbox + viewer percakapan AI (observer mode + ambil alih saat eskalasi)
/css/style.css        → Shared stylesheet (token desain disamakan dengan Botwa)
/js/config.js         → Kredensial Supabase CRM + WA gateway (ISI INI sebelum deploy)
/js/mock-data.js      → Data dummy untuk prototype — GANTI dengan query Supabase asli
/js/app.js            → Sidebar renderer & shared utils
/api/handoff.js        → Endpoint penerima webhook dari Supabase Botwa
/schema.sql            → Schema standalone untuk Supabase CRM (crm_contacts, crm_pipeline, crm_followups, crm_orders, crm_wa_sessions)
/vercel.json           → Config deploy
```

## Status saat ini

🟡 **Prototype murni UI, data masih mock** (`js/mock-data.js`). Belum terhubung ke Supabase atau Baileys beneran.

## Langkah berikutnya (saat siap build sungguhan)

1. **Bikin Supabase project baru** khusus CRM (terpisah dari project Botwa)
2. Jalankan `schema.sql` di project CRM yang baru itu
3. Isi `js/config.js` dengan SUPABASE_URL & ANON_KEY dari project CRM (bukan punya Botwa)
4. Deploy project ini ke Vercel, catat domain-nya
5. Di **Supabase project Botwa**: Database → Webhooks → buat webhook baru
   - Table: `orders`, Event: `UPDATE`
   - URL: `https://<domain-crm-kamu>.vercel.app/api/handoff`
   - Header: `x-handoff-secret: <isi sesuai env HANDOFF_SECRET>`
6. Di Vercel project CRM, set environment variables:
   - `HANDOFF_SECRET` (samain dengan header webhook di atas)
   - `CRM_SUPABASE_URL`
   - `CRM_SUPABASE_SERVICE_KEY` (service_role key, dari project CRM — dipakai `/api/handoff.js` untuk insert)
7. Ganti pemanggilan `MOCK_PIPELINE` / `MOCK_CHATS` di `pipeline.html` & `conversations.html` dengan fetch ke Supabase REST API project CRM
8. Setup Baileys gateway kedua (nomor WA terpisah dari Botwa) sebagai serverless function tambahan di `/api/`
9. Hubungkan Anthropic API untuk: compose follow-up message, sentiment analysis dari balasan customer, deteksi sinyal repeat order
10. Build logic dormant threshold per produk (kolom `dormant_threshold_days` di `crm_pipeline` sudah disiapkan di schema)

## Deploy

```
git init
git add .
git commit -m "Initial CRM prototype"
git remote add origin <repo-baru-kamu>
git push -u origin main
```

Lalu import ke Vercel seperti project Botwa biasanya.
