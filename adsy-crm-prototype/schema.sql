-- ═══════════════════════════════════════════════════════════
-- Adsy CRM — Schema (Supabase Project TERPISAH dari Botwa)
-- Jalankan di: Supabase Dashboard (project CRM baru) → SQL Editor
--
-- Data masuk lewat /api/handoff.js (webhook dari Supabase Botwa),
-- BUKAN lewat foreign key langsung — karena beda database.
-- ═══════════════════════════════════════════════════════════

-- CRM_CONTACTS — snapshot kontak, di-copy saat handoff pertama kali
-- source_contact_id menyimpan id aslinya di Botwa untuk referensi/debug
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_contact_id UUID, -- id contact di Supabase Botwa (referensi saja, bukan FK)
  nama TEXT,
  phone TEXT UNIQUE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRM_PIPELINE — satu row per order yang sudah handoff
-- Multi-card per order (bukan per kontak) — satu kontak bisa
-- punya beberapa row aktif kalau ada repeat order paralel.
CREATE TABLE IF NOT EXISTS crm_pipeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crm_contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  source_order_id UUID, -- id order asal di Botwa (referensi saja)
  stage TEXT DEFAULT 'baru', -- baru | followup | nurture | hotlead | closing | dormant
  product_name TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  repeat_count INTEGER DEFAULT 1,
  is_escalated BOOLEAN DEFAULT false,
  next_followup_at TIMESTAMP WITH TIME ZONE,
  dormant_threshold_days INTEGER DEFAULT 14, -- custom per produk, diatur nanti
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRM_FOLLOWUPS — log setiap pesan follow-up (in/out) per pipeline
CREATE TABLE IF NOT EXISTS crm_followups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID REFERENCES crm_pipeline(id) ON DELETE CASCADE,
  direction TEXT NOT NULL, -- out (AI->customer) | in (customer->AI)
  message TEXT,
  sentiment TEXT, -- positif | netral | negatif (hasil analisis AI, utk pesan 'in' saja)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CRM_WA_SESSIONS — status koneksi Baileys gateway #2 (nomor terpisah dari Botwa)
CREATE TABLE IF NOT EXISTS crm_wa_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT,
  status TEXT DEFAULT 'disconnected', -- connected | disconnected | scanning
  last_connected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ORDERS (repeat order) — dibuat sendiri oleh CRM saat closing repeat,
-- TIDAK ditulis balik ke Supabase Botwa. Fulfillment repeat selamanya
-- jadi tanggung jawab CRM (lihat diskusi alur sebelumnya).
CREATE TABLE IF NOT EXISTS crm_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  crm_contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE,
  pipeline_id UUID REFERENCES crm_pipeline(id) ON DELETE SET NULL,
  product_name TEXT,
  total BIGINT DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending | diproses | dikirim | sampai
  resi TEXT,
  courier TEXT,
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS crm_contacts_phone_idx ON crm_contacts(phone);
CREATE INDEX IF NOT EXISTS crm_pipeline_contact_idx ON crm_pipeline(crm_contact_id);
CREATE INDEX IF NOT EXISTS crm_pipeline_stage_idx ON crm_pipeline(stage);
CREATE INDEX IF NOT EXISTS crm_followups_pipeline_idx ON crm_followups(pipeline_id);
CREATE INDEX IF NOT EXISTS crm_orders_contact_idx ON crm_orders(crm_contact_id);
