// ════════════════════════════════════════════════════════
// ADSY CRM — Mock Data
// Bentuk data ini meniru struktur tabel Supabase (crm_pipeline + crm_followups + contacts).
// Saat CRM disambungkan ke Supabase asli, file ini diganti oleh query sungguhan
// di app.js (lihat fungsi loadPipeline / loadConversation yang tinggal di-swap).
// ════════════════════════════════════════════════════════

const STAGES = [
  { id:'baru',     label:'Baru Diterima',                color:'#3b82f6' },
  { id:'followup', label:'Follow-up Pemakaian',           color:'#22c55e' },
  { id:'nurture',  label:'Nurture',                       color:'#f59e0b' },
  { id:'hotlead',  label:'Hot Lead Repeat',               color:'#ef4444' },
  { id:'closing',  label:'Closing Repeat → Fulfillment',  color:'#8b5cf6' },
  { id:'dormant',  label:'Dormant',                       color:'#64748b' },
];

const MOCK_PIPELINE = [
  { id:1, name:'Budi Santoso', phone:'+62 812-3456-7890', product:'Herbapil 30g', stage:'baru', delivered:'17 Jun', repeat:1, address:'Jl. Kaliurang KM 8, Sleman, Yogyakarta', escalated:false, timeline:[
    {out:true, text:'AI mengirim pesan ucapan terima kasih & cek kondisi paket.', time:'17 Jun, 14:02'},
  ]},
  { id:2, name:'Siti Aminah', phone:'+62 813-2211-9087', product:'Youzhi 50g', stage:'baru', delivered:'18 Jun', repeat:2, address:'Jl. Diponegoro No. 12, Solo', escalated:false, timeline:[
    {out:true, text:'AI mengirim pesan ucapan terima kasih & cek kondisi paket.', time:'18 Jun, 09:14'},
  ]},
  { id:3, name:'Andi Wijaya', phone:'+62 851-7765-4432', product:'Numata Eye Care', stage:'followup', delivered:'12 Jun', repeat:1, address:'Jl. Veteran No. 45, Malang', escalated:false, timeline:[
    {out:true, text:'Menanyakan apakah produk sudah mulai digunakan.', time:'13 Jun, 10:00'},
    {out:false, text:'"udah gan, baru 2 hari sih"', time:'13 Jun, 19:22'},
    {out:true, text:'AI memberi tips pemakaian & jadwal reminder di hari ke-7.', time:'13 Jun, 19:24'},
  ]},
  { id:4, name:'Rina Kartika', phone:'+62 822-9098-1123', product:'Primagold Vanilla', stage:'nurture', delivered:'02 Jun', repeat:1, address:'Jl. Gajah Mada No. 7, Surabaya', escalated:false, timeline:[
    {out:true, text:'Mengirim konten edukasi manfaat rutin konsumsi.', time:'10 Jun, 08:00'},
    {out:false, text:'"oke kak, makasih infonya"', time:'10 Jun, 20:11'},
  ]},
  { id:5, name:'Tono Saputra', phone:'+62 877-1230-9988', product:'Herbapil 30g', stage:'nurture', delivered:'28 Mei', repeat:1, address:'Jl. Malioboro No. 102, Yogyakarta', escalated:false, timeline:[
    {out:true, text:'Reminder estimasi stok mulai menipis (hari ke-25 dari 30 hari pakai).', time:'16 Jun, 09:00'},
  ]},
  { id:6, name:'Joko Prasetyo', phone:'+62 815-6671-2298', product:'Youzhi 50g', stage:'hotlead', delivered:'20 Mei', repeat:2, address:'Jl. Sudirman No. 88, Semarang', escalated:false, timeline:[
    {out:true, text:'Reminder stok habis + tanya minat lanjut.', time:'15 Jun, 10:00'},
    {out:false, text:'"ada promo gak kak buat yang udah pernah beli?"', time:'15 Jun, 16:40'},
    {out:true, text:'Sinyal repeat terdeteksi (sentiment: tertarik). Kartu dipindah ke Hot Lead.', time:'15 Jun, 16:41'},
  ]},
  { id:7, name:'Maya Lestari', phone:'+62 819-4432-7765', product:'Numata Eye Care', stage:'hotlead', delivered:'25 Mei', repeat:1, address:'Jl. Ahmad Yani No. 23, Bandung', escalated:false, timeline:[
    {out:true, text:'Menanyakan hasil pemakaian setelah 3 minggu.', time:'14 Jun, 11:00'},
    {out:false, text:'"lumayan kak matanya gak gampang capek lagi, mau beli lagi"', time:'14 Jun, 18:05'},
  ]},
  { id:8, name:'Wawan Setiadi', phone:'+62 838-2290-1145', product:'Primagold Coklat', stage:'closing', delivered:'—', repeat:3, address:'Jl. Pemuda No. 56, Semarang', escalated:false, timeline:[
    {out:false, text:'"oke deal kak, alamat masih sama ya"', time:'17 Jun, 13:10'},
    {out:true, text:'Order baru dibuat otomatis. Menunggu input resi.', time:'17 Jun, 13:11'},
  ]},
  { id:9, name:'Lina Marlina', phone:'+62 856-1123-9087', product:'Herbapil 30g', stage:'dormant', delivered:'02 Mei', repeat:1, address:'Jl. Pahlawan No. 19, Jember', escalated:false, timeline:[
    {out:true, text:'3x follow-up terkirim tanpa respon (14 hari). Ditandai dormant.', time:'16 Jun, 09:00'},
  ]},
  { id:10, name:'Dedi Kurniawan', phone:'+62 821-7765-3321', product:'Youzhi 50g', stage:'dormant', delivered:'28 Apr', repeat:1, address:'Jl. Diponegoro No. 3, Kediri', escalated:false, timeline:[
    {out:true, text:'Tidak ada respon sejak follow-up terakhir. Masuk antrian re-engage campaign.', time:'12 Jun, 09:00'},
  ]},
  { id:11, name:'Fitri Handayani', phone:'+62 882-3321-9087', product:'Numata Eye Care', stage:'followup', delivered:'14 Jun', repeat:1, address:'Jl. Sultan Agung No. 8, Yogyakarta', escalated:false, timeline:[
    {out:true, text:'Menanyakan apakah produk sudah mulai digunakan.', time:'15 Jun, 10:00'},
  ]},
  { id:12, name:'Hendro Wibowo', phone:'+62 813-7788-2233', product:'Herbapil 30g', stage:'hotlead', delivered:'19 Mei', repeat:1, address:'Jl. Brigjen Katamso No. 5, Yogyakarta', escalated:true, timeline:[
    {out:true, text:'Follow-up rutin hari ke-21.', time:'09 Jun, 10:00'},
    {out:false, text:'"barangnya kemarin sampe rusak kak, isinya tumpah semua. saya kecewa banget"', time:'09 Jun, 14:12'},
    {out:true, text:'Sentiment: negatif (komplain). Eskalasi ke manusia, AI berhenti membalas.', time:'09 Jun, 14:13'},
  ]},
];

// Full chat transcript per pipeline id — dipakai di halaman Percakapan
const MOCK_CHATS = {
  3: [
    {role:'bot', text:'Halo Kak Andi, terima kasih sudah order Numata Eye Care ya! Semoga bermanfaat 🙏', time:'12 Jun, 10:15'},
    {role:'bot', text:'Boleh tau, sudah mulai dipakai belum kak?', time:'13 Jun, 10:00'},
    {role:'customer', text:'udah gan, baru 2 hari sih', time:'13 Jun, 19:22'},
    {role:'bot', text:'Mantap! Untuk hasil maksimal, dikonsumsi rutin 2x sehari ya kak, pagi & malam. Saya ingetin lagi di hari ke-7 buat cek perkembangannya 😊', time:'13 Jun, 19:24'},
  ],
  6: [
    {role:'bot', text:'Halo Kak Joko! Gimana kabarnya, produk Youzhi-nya sudah habis belum?', time:'15 Jun, 10:00'},
    {role:'customer', text:'ada promo gak kak buat yang udah pernah beli?', time:'15 Jun, 16:40'},
    {role:'bot', text:'Wah pas banget kak, untuk pelanggan repeat ada diskon 15% + free ongkir nih. Mau saya bantu prosesin?', time:'15 Jun, 16:42'},
  ],
  12: [
    {role:'bot', text:'Halo Kak Hendro, sudah 3 minggu nih pakai Herbapil-nya. Gimana hasilnya?', time:'09 Jun, 10:00'},
    {role:'customer', text:'barangnya kemarin sampe rusak kak, isinya tumpah semua. saya kecewa banget', time:'09 Jun, 14:12'},
    {role:'bot', text:'Mohon maaf banget atas ketidaknyamanannya kak 🙏 Kasus ini saya eskalasi ke tim kami ya supaya bisa dibantu langsung.', time:'09 Jun, 14:13'},
  ],
};
