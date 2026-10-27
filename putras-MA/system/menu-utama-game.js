// ==========================================
// LOGIKA SYSTEM MENU UTAMA GAME - putras-MA
// ==========================================

// Pemicu otomatis saat sistem Menu Utama dibuka oleh browser
window.addEventListener("DOMContentLoaded", () => {
    
    // 1. SISTEM KEAMANAN OTOMATIS (PROTEKSI KICK BALIK JIKA DATA KOSONG)
    // Memanggil fungsi loadGame() bawaan asli dari save.js
    const dataAda = loadGame();

    // Verifikasi validasi isi laci profil pemain
    if (!dataAda || !dataGame.profil || !dataGame.profil.nama) {
        console.error("Akses Ditolak: Data profil kosong atau belum terdaftar!");
        alert("Anda belum terdaftar! Silakan isi profil terlebih dahulu.");
        
        // Mengusir paksa user iseng kembali ke gerbang index.html di luar folder
        window.location.href = "../../index.html";
        return; // Menghentikan seluruh proses script di bawahnya
    }

    // 2. PROSES SINKRONISASI DATA KE ELEMEN TAMPILAN (RENDER DATA)
    tampilkanDataLobiPemain();
});

/**
 * Menyuntikkan seluruh angka mata uang dan identitas dari save ke UI HTML
 */
function tampilkanDataLobiPemain() {
    // A. Menyuntik Data Profil Kiri Atas
    const elemenNama = document.getElementById("display-nama-lobi");
    const elemenFoto = document.getElementById("display-foto-lobi");

    elemenNama.innerText = dataGame.profil.nama;
    elemenFoto.src = dataGame.profil.fotoKustom; // Format Base64 string

    // B. Menyuntik Data Jumlah Mata Uang Kanan Atas
    const elemenStar = document.getElementById("display-star-lobi");
    const elemenSky = document.getElementById("display-sky-lobi");

    elemenStar.innerText = dataGame.dompet.star;
    elemenSky.innerText = dataGame.dompet.sky;
    
    console.log("Seluruh data profil, mata uang Star & Sky berhasil disinkronkan ke Menu Utama!");
}

/**
 * Fungsi Navigasi Global untuk berpindah halaman di dalam folder tampilan
 * @param {string} namaFileTujuan - Contoh: 'toko.html', 'gacha.html'
 */
function pindahKeHalaman(namaFileTujuan) {
    try {
        console.log(`Berpindah navigasi menuju halaman: ${namaFileTujuan}`);
        // Melakukan perpindahan url fisik halaman internal folder tampilan/
        window.location.href = namaFileTujuan;
    } catch (error) {
        console.error(`Gagal berpindah ke halaman ${namaFileTujuan}:`, error);
    }
}
