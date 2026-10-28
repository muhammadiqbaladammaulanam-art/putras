// ==========================================
// SYSTEM KARAKTER - putras-MA (FINAL CLEAN)
// ==========================================

/**
 * 1. FUNGSI UNTUK MENGAMBIL DAFTAR KARAKTER AKTIF
 * Mengambil data karakter yang sudah didapatkan dari save state global
 */
function ambilDaftarKarakterDimiliki() {
    if (typeof dataGame !== 'undefined' && dataGame.daftarKarakterGacha) {
        return dataGame.daftarKarakterGacha;
    }
    console.error("Gagal Mengambil Data: State dataGame belum dimuat!");
    return [];
}

/**
 * 2. FUNGSI PETUGAS ADMINISTRASI GACHA (TAMBAH KARAKTER BARU)
 * Dipanggil oleh gacha.js untuk menyalin data master, memasang progres EXP, 
 * dan menyimpannya secara permanen ke dalam memori game.
 */
function tambahKarakterBaruKeDaftar(idKarakterMaster, dataKarakterMaster) {
    try {
        if (typeof dataGame === 'undefined' || !dataGame.daftarKarakterGacha) {
            console.error("Gagal menambah karakter: Sistem save game tidak terdeteksi.");
            return false;
        }

        // Proteksi Duplikat: Cek apakah ID karakter sudah dimiliki
        const karakterSudahAda = dataGame.daftarKarakterGacha.find(k => k.id === idKarakterMaster);

        if (karakterSudahAda) {
            console.log(`Karakter [${dataKarakterMaster.nama}] sudah dimiliki. Mengalihkan ke sistem duplikat.`);
            return "duplikat";
        }

        // PROSES KLONING & PENYUNTIKAN PROGRES EXP 0/100
        const karakterBaru = {
            id: idKarakterMaster,
            nama: dataKarakterMaster.nama,
            kategori: dataKarakterMaster.kategori,
            level: 1, 
            hp: dataKarakterMaster.hpBasis,
            attack: dataKarakterMaster.attackBasis,
            def: dataKarakterMaster.defBasis,
            
            // Pencatatan progres dinamis untuk dibaca halaman karakter-dimiliki
            exp: 0,
            expMaks: 100
        };

        dataGame.daftarKarakterGacha.push(karakterBaru);
        console.log(`Karakter Baru Terdaftar: ${karakterBaru.nama} (EXP: ${karakterBaru.exp}/${karakterBaru.expMaks})`);

        if (typeof saveGame === 'function') {
            saveGame();
        }

        return true;
    } catch (error) {
        console.error("Terjadi eror saat mendaftarkan karakter gacha baru:", error);
        return false;
    }
}

/**
 * 3. FUNGSI PENYELARAS DATA AWAL ARTUP (AKUN BARU)
 * Memastikan Artup yang dimasukkan oleh save.js di awal permainan 
 * langsung memiliki variabel exp & expMaks yang valid secara otomatis.
 */
function selaraskanDataAwalArtup() {
    try {
        if (typeof dataGame === 'undefined' || !dataGame.daftarKarakterGacha) return;

        // Cari data mentah Artup di dalam array simpanan
        const artup = dataGame.daftarKarakterGacha.find(k => k.nama.startsWith("Artup"));
        
        // Jika Artup ditemukan tetapi belum memiliki kolom EXP dinamis, kita suntikkan langsung
        if (artup && typeof artup.exp === 'undefined') {
            artup.id = "char_artup_utama"; // ID unik sistem untuk Artup Utama
            artup.kategori = "SPESIAL";
            artup.hp = 108;
            artup.attack = 18;
            artup.def = 8;
            artup.exp = 0;
            artup.expMaks = 100;
            
            console.log("Data awal Artup berhasil diselaraskan dengan variabel progres EXP!");
            if (typeof saveGame === 'function') saveGame();
        }
    } catch (error) {
        console.error("Gagal menyelaraskan data awal Artup:", error);
    }
}

/**
 * 4. FUNGSI PENCARIAN DATA SPESIFIK KARAKTER
 * Membantu system/levelingSystemKarakter.js mencari pahlawan tertentu untuk diberi EXP
 */
function cariKarakterDimilikiBerdasarkanId(idKarakter) {
    const daftar = ambilDaftarKarakterDimiliki();
    return daftar.find(k => k.id === idKarakter) || null;
}

// Otomatis jalankan pemeriksaan penyelarasan Artup saat berkas ini dimuat oleh browser
if (typeof dataGame !== 'undefined') {
    selaraskanDataAwalArtup();
}
