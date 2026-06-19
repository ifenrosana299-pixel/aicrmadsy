// ════════════════════════════════════════════════════════
// /api/handoff.js
// Endpoint dipanggil oleh Supabase Database Webhook (project BOTWA)
// saat orders.status berubah jadi 'delivered'.
// Tugasnya: copy snapshot contact + order ke Supabase CRM (project terpisah),
// lalu insert row baru ke crm_pipeline (stage awal: 'baru').
//
// Setup di Supabase Botwa:
//   Database → Webhooks → Create new webhook
//   Table: orders | Event: UPDATE
//   Condition: status = delivered (atau filter di kode bawah)
//   URL: https://<domain-crm-kamu>.vercel.app/api/handoff
// ════════════════════════════════════════════════════════

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verifikasi sederhana — ganti dengan secret token kalau mau lebih aman
  const secret = req.headers['x-handoff-secret'];
  if (secret !== process.env.HANDOFF_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = req.body; // bentuk payload Supabase Database Webhook
    const order = payload.record;

    // Hanya proses kalau status memang baru berubah jadi delivered
    if (order.status !== 'delivered') {
      return res.status(200).json({ skipped: true, reason: 'status bukan delivered' });
    }

    const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
    const CRM_SERVICE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY; // service_role key, bukan anon

    const sbHeaders = {
      'Content-Type': 'application/json',
      'apikey': CRM_SERVICE_KEY,
      'Authorization': `Bearer ${CRM_SERVICE_KEY}`,
      'Prefer': 'return=representation',
    };

    // 1. Cek/insert contact snapshot di Supabase CRM
    //    (payload webhook Botwa idealnya sudah include data contact —
    //     kalau belum, tambahkan join/fetch tambahan ke Botwa di sini)
    const contactRes = await fetch(`${CRM_SUPABASE_URL}/rest/v1/crm_contacts`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify({
        source_contact_id: order.contact_id, // simpan id asal dari Botwa untuk referensi
        nama: order.contact_nama || null,
        phone: order.contact_phone || null,
        address: order.shipping_address || null,
      }),
    });
    const [contact] = await contactRes.json();

    // 2. Insert ke crm_pipeline
    const pipelineRes = await fetch(`${CRM_SUPABASE_URL}/rest/v1/crm_pipeline`, {
      method: 'POST',
      headers: sbHeaders,
      body: JSON.stringify({
        crm_contact_id: contact?.id,
        source_order_id: order.id,
        stage: 'baru',
        product_name: order.items || null,
        delivered_at: new Date().toISOString(),
        shipping_address: order.shipping_address || null,
        repeat_count: 1, // dihitung ulang oleh logic terpisah kalau kontak sudah pernah ada
      }),
    });
    const [pipeline] = await pipelineRes.json();

    return res.status(200).json({ success: true, pipeline_id: pipeline?.id });
  } catch (err) {
    console.error('Handoff error:', err);
    return res.status(500).json({ error: 'Internal error', detail: String(err) });
  }
}
