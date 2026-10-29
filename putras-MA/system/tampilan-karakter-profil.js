// ============================================================================
// SYSTEM JEMBATAN ASSET VISUAL UTAMA - putras-MA (AUTOMATIC KAMUS ROUTER)
// ============================================================================

/**
 * 1. WADAH DATABASE VISUAL (KAMUS KEY-VALUE MAPPING)
 * Tempat mendaftarkan nama file gambar/animasi kustom untuk setiap karakter.
 * Cukup tambahkan baris baru di bawah karakter Artup menggunakan tanda koma (,).
 */
const kamusAsetKarakter = {
    // id_karakter : "nama_file_di_folder_asset"
    "artup": "inra.png"
};

/**
 * 2. ENGINE PUSAT PENGARAH JALUR ASET VISUAL DETAIL
 * Dipicu otomatis saat pemain masuk ke dalam layar detail karakter dimiliki.
 * 
 * @param {string} idKarakter - ID dasar pahlawan (contoh: "artup", "raiu")
 * @returns {string} Jalur path lengkap yang mengarah ke folder asset proyek
 */
function ambilAsetVisualKarakterDetail(idKarakter) {
    // Amankan input: ubah menjadi huruf kecil semua dan hapus spasi samping
    const idBersih = idKarakter ? idKarakter.toLowerCase().trim() : "";

    // Deteksi apakah ID pahlawan terdaftar di dalam laci objek Kamus
    if (kamusAsetKarakter[idBersih]) {
        // Ambil nama file mentah dari kamus database visual
        const namaFileAset = kamusAsetKarakter[idBersih];
        
        // Rakit dan kembalikan jalur folder lengkap secara dinamis
        return "../../asset/" + namaFileAset;
    } else {
        // SABUK PENGAMAN (FALLBACK MULTIMEDIA)
        // Jika ada ID karakter gacha baru yang lupa Anda daftarkan di atas,
        // sistem akan otomatis meminjam visual Artup agar layar tidak blank/eror.
        console.warn(`Visual untuk ID pahlawan "${idKarakter}" belum didaftarkan di kamus. Mengaktifkan fallback.`);
        return "../../asset/inra.png";
    }
}
