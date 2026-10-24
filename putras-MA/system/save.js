// ==========================================
// SYSTEM SAVE GAME - putras-MA
// ==========================================

// 1. WADAH UTAMA DATA GAME (STATE GLOBAL)
// Ini adalah "kotak besar" dengan "rak-rak kosong" yang fleksibel
let dataGame = {
    // Laci Profil Pemain (Sekali Pakai saat Login)
    profil: {
        nama: "",
        umur: "",
        gender: "",
        fotoKustom: "" // Akan menyimpan teks format Base64 dari foto pemain
    },

    // Laci Karakter Utama (Level otomatis menjadi Level Akun Profil)
    karakterUtama: {
        namaKarakter: "", // Format otomatis: "Artup [Nama Pemain]"
        level: 1
    },

    // Laci Ekonomi / Mata Uang Game
    dompet: {
        star: 0, // Mata uang utama (Reguler)
        sky: 0   // Mata uang premium (Berbayar)
    },

    // Laci Progres Cerita Utama
    progresCerita: {
        stageAktif: 1 // Dimulai dari Stage 1
    },

    // Rak Kosong Dinamis (Akan diisi otomatis oleh system/inventory.js)
    inventory: [], 

    // Rak Kosong Dinamis (Akan diisi otomatis oleh system/gacha.js)
    daftarKarakterGacha: [], 

    // Rak Formasi Aktif (Maksimal 3 Karakter, akan diisi otomatis oleh system/formasi.js)
    formasiTim: [] 
};

// Kunci penyimpanan unik di LocalStorage browser
const KEY_STORAGE_GAME = "PUTRAS_MA_SAVE_DATA";

/**
 * 2. FUNGSI UNTUK MENYIMPAN DATA (SAVE)
 * Mengunci seluruh dataGame ke dalam LocalStorage
 */
function saveGame() {
    try {
        // Cek batasan formasi sebelum disimpan untuk memastikan keamanan data
        if (dataGame.formasiTim.length > 3) {
            console.error("Gagal Save: Anggota formasi melebihi batas maksimal 3 karakter!");
            return false;
        }

        // Mengubah objek JavaScript menjadi teks JSON agar bisa masuk LocalStorage
        const dataTeks = JSON.stringify(dataGame);
        localStorage.setItem(KEY_STORAGE_GAME, dataTeks);
        console.log("Game Berhasil Disimpan!");
        return true;
    } catch (error) {
        console.error("Gagal menyimpan data game:", error);
        return false;
    }
}

/**
 * 3. FUNGSI UNTUK MEMUAT DATA (LOAD)
 * Mengambil data dari LocalStorage saat game dibuka kembali
 */
function loadGame() {
    try {
        const dataTersimpan = localStorage.getItem(KEY_STORAGE_GAME);
        
        // Jika data ada di browser, salin isinya ke dataGame
        if (dataTersimpan) {
            dataGame = JSON.parse(dataTersimpan);
            console.log("Game Berhasil Dimuat!");
            return true;
        }
        
        console.log("Tidak ada data simpanan ditemukan. Memulai game baru.");
        return false;
    } catch (error) {
        console.error("Gagal memuat data game:", error);
        return false;
    }
}

/**
 * 4. FUNGSI UNTUK MENGHAPUS DATA (RESET)
 * Menghapus data dari memori browser jika pemain ingin mengulang
 */
function resetGame() {
    try {
        localStorage.removeItem(KEY_STORAGE_GAME);
        console.log("Data game berhasil di-reset.");
        // Muat ulang halaman untuk membersihkan state di memori
        window.location.reload();
        return true;
    } catch (error) {
        console.error("Gagal mereset data game:", error);
        return false;
    }
}

/**
 * 5. FUNGSI KHUSUS PEMBUATAN PROFIL AWAL
 * Dipicu sekali saja saat pemain mengisi form Nama, Umur, Gender di index.html
 */
function inisialisasiPemainBaru(namaInput, umurInput, genderInput, fotoBase64Input = "") {
    // Isi data profil dasar
    dataGame.profil.nama = namaInput;
    dataGame.profil.umur = umurInput;
    dataGame.profil.gender = genderInput;
    dataGame.profil.fotoKustom = fotoBase64Input;

    // Set otomatis Nama Karakter Utama sesuai aturan: "Artup [Nama Pemain]"
    dataGame.karakterUtama.namaKarakter = `Artup ${namaInput}`;
    dataGame.karakterUtama.level = 1;

    // Set modal awal mata uang secara default (Bisa Anda ubah nilainya nanti jika mau)
    dataGame.dompet.star = 100; 
    dataGame.dompet.sky = 0;

    // Masukkan Karakter Utama ke daftar karakter yang dimiliki untuk awalan
    dataGame.daftarKarakterGacha.push({
        nama: dataGame.karakterUtama.namaKarakter,
        level: dataGame.karakterUtama.level
    });

    // Masukkan Karakter Utama ke dalam Formasi Aktif sebagai slot pertama
    dataGame.formasiTim.push(dataGame.karakterUtama.namaKarakter);

    // Kunci data awal ke dalam penyimpanan browser
    saveGame();
}
