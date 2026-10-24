// ==========================================
// LOGICA SYSTEM LOGIN & TITLE SCREEN - putras-MA
// ==========================================

// Global variable penampung string Base64 foto kustom
let stringFotoBase64 = "";

// Pengecekan otomatis status pemain saat halaman berhasil dibuka
window.addEventListener("DOMContentLoaded", () => {
    // Memanggil fungsi loadGame() bawaan dari save.js
    const dataDitemukan = loadGame();

    // Jalur Logika Penentuan Kondisi Elemen Tampilan
    if (dataDitemukan && dataGame.profil && dataGame.profil.nama) {
        // KONDISI B: Jika data pemain sudah terdaftar di browser
        const sectionTitle = document.getElementById("title-screen-section");
        const elemenFoto = document.getElementById("foto-profil-lingkaran");

        // Suntik data foto kustom Base64 dari save ke tag img
        elemenFoto.src = dataGame.profil.fotoKustom;
        
        // Munculkan Title screen bersih (Foto lingkaran + Tombol Start)
        sectionTitle.classList.remove("hide-element");
    } else {
        // KONDISI A: Pemain Baru, tampilkan formulir pendaftaran
        const sectionDaftar = document.getElementById("form-daftar-section");
        sectionDaftar.classList.remove("hide-element");
    }
});

/**
 * Membaca file gambar upload dari device, diubah jadi Base64 String
 */
function previewDanKonversiFoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            stringFotoBase64 = e.target.result; // Hasil teks base64 gambar
            
            // Tampilkan preview kecil bulat di halaman form pendaftaran
            const imgPreview = document.getElementById("preview-foto-daftar");
            const wrapperPreview = document.getElementById("wrapper-preview-input");
            imgPreview.src = stringFotoBase64;
            wrapperPreview.classList.remove("hide-element");
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Memproses submit formulir pendaftaran pemain baru
 */
function prosesPendaftaran(event) {
    event.preventDefault(); // Cegah reload form bawaan HTML

    const nama = document.getElementById("input-nama").value.trim();
    const umur = document.getElementById("input-umur").value;
    const gender = document.getElementById("select-gender").value;

    if (!stringFotoBase64) {
        alert("Silakan pilih dan unggah foto profil Anda terlebih dahulu!");
        return;
    }

    // Memicu fungsi inisialisasi awal di save.js untuk mengunci data game
    inisialisasiPemainBaru(nama, umur, gender, stringFotoBase64);

    // Sembunyikan form pendaftaran (Kondisi A)
    document.getElementById("form-daftar-section").classList.add("hide-element");

    // Otomatis ubah UI ke Kondisi B (Title Screen) memakai data terdaftar baru
    document.getElementById("foto-profil-lingkaran").src = dataGame.profil.fotoKustom;
    document.getElementById("title-screen-section").classList.remove("hide-element");
}

/**
 * Efek Layar Loading Pengecekan Progress & Berpindah ke Menu Utama Game
 */
function mulaiLoadingGame() {
    // Sembunyikan elemen title screen agar bersih
    document.getElementById("title-screen-section").classList.add("hide-element");
    
    // Tampilkan panel loading screen penuh
    const loadingSection = document.getElementById("loading-screen-section");
    loadingSection.classList.remove("hide-element");

    const barIsi = document.getElementById("progress-bar-fill");
    const angkaPersen = document.getElementById("loading-percentage");
    
    let persen = 0;
    
    // Kecepatan interval per 20 milidetik agar simulasi berjalan mulus di 60fps
    const intervalLoading = setInterval(() => {
        persen += 2; // Menambah progress loading secara konsisten
        
        // Update visual render bar dan angka teks ke layar
        barIsi.style.width = persen + "%";
        angkaPersen.innerText = persen + "%";

        // Simulasi pemeriksaan data game di memori saat persentase tertentu berjalan
        if (persen === 20) {
            console.log("Checking player file save safety...");
        } else if (persen === 50) {
            console.log(`Checking currencies... Star: ${dataGame.dompet.star}, Sky: ${dataGame.dompet.sky}`);
        } else if (persen === 80) {
            console.log(`Checking battle formation active slots: ${dataGame.formasiTim.length}/3`);
        }

        // Loading selesai (Menyentuh angka 100%)
        if (persen >= 100) {
            clearInterval(intervalLoading);
            console.log("Pengecekan selesai! Mengalihkan ke menu utama game...");
            
            // Gerbang Akhir: Mengalihkan browser fisik ke halaman Menu Utama Game
            window.location.href = "putras-MA/tampilan/menu-utama-game.html";
        }
    }, 20);
}
