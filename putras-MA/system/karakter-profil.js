// ===================================================
// SYSTEM MASTER DATABASE KARAKTER - putras-MA
// ===================================================

/**
 * 1. KAMUS MASTER DATA SELURUH KARAKTER GAME (STAT TETAP / BASE STAT)
 * Jika Anda ingin menambahkan karakter baru di masa depan, cukup duplikasi 
 * struktur objek di bawah ini dan sambung ke dalam array masterKarakter.
 */
const masterKarakter = [
    {
        id: "artup",
        namaLengkap: "Artup",
        statusKategori: "SPESIAL", // Pilihan wajib: SPESIAL, RAIU, STARS, SKY
        levelAwal: 1,
        hpBase: 108,
        attackBase: 18,
        defBase: 8,
        // Tautan gambar internet sementara (Silakan ganti dengan file lokal Anda di folder asset nanti)
        // COMMENT UNTUK GANTI GAMBAR: Ganti url di bawah dengan '../asset/nama-file-gambar.png'
        gambar2d: "https://unsplash.com",
        // Teks penanda cerita latar belakang kosong yang bisa Anda ubah/ketik sendiri dengan bebas
        latarBelakangLore: "ini uji coba"
    }
    // <-- Anda bisa menambahkan karakter baru (kedua, ketiga, dst.) tepat di bawah sini menggunakan koma
];

/**
 * Pengecekan otomatis saat dokumen HTML selesai dimuat di browser
 */
document.addEventListener("DOMContentLoaded", () => {
    // Jalankan fungsi load data game dari save.js terlebih dahulu agar tahu karakter mana yang sudah dibeli/didapatkan
    if (typeof loadGame === "function") {
        loadGame();
    }
    
    // Pemicu awal render seluruh daftar kartu karakter ke layar sisi kanan
    renderGaleriMasterKarakter();
    
    // Pasang logika event listener untuk mendeteksi klik di area luar kartu agar gambar bisa kembali normal
    document.addEventListener("click", (event) => {
        const isKartuKarakter = event.target.closest(".kartu-karakter-master");
        const isTombolLore = event.target.closest(".btn-buka-lore");
        const isPopUpBox = event.target.closest(".wrapper-pop-up-lore");

        // Jika pemain mengklik area kosong (bukan kartu, bukan tombol lore, bukan kotak pop-up)
        if (!isKartuKarakter && !isTombolLore && !isPopUpBox) {
            resetSemuaEfekTransparanKartu();
        }
    });
});

/**
 * 2. FUNGSI UTAMA RENDER GALERI MASTER
 * Membaca data array masterKarakter dan menyuntikkannya ke grid HTML berdasarkan urutan status
 */
function renderGaleriMasterKarakter() {
    const containerGaleri = document.getElementById("area-galeri-kanan");
    if (!containerGaleri) return;

    // Bersihkan kontainer sebelum merender ulang
    containerGaleri.innerHTML = "";

    // Daftar pengelompokan status kategori agar berjejer urut sesuai tipe
    const listKategori = ["SPESIAL", "RAIU", "STARS", "SKY"];

    listKategori.forEach((kategori) => {
        // Filter karakter yang memiliki kategori status yang sama
        const grupKarakter = masterKarakter.filter(char => char.statusKategori === kategori);

        // Jika dalam kategori tersebut ada karakternya, buatkan penanda judul kelompok
        if (grupKarakter.length > 0) {
            const sectionJudul = document.createElement("div");
            sectionJudul.className = `judul-grup-kategori group-target-${kategori.toLowerCase()}`;
            sectionJudul.innerText = `KATEGORI STATUS: ${kategori}`;
            containerGaleri.appendChild(sectionJudul);

            const gridFlex = document.createElement("div");
            gridFlex.className = "grid-wrapper-karakter";

            grupKarakter.forEach((char) => {
                const itemKartu = document.createElement("div");
                itemKartu.className = "kartu-karakter-master";
                itemKartu.setAttribute("data-id-char", char.id);
                
                // Set handler klik pada kartu gambar
                itemKartu.addEventListener("click", (e) => {
                    // Mencegah trigger ganda jika yang diklik ternyata adalah tombol lore
                    if (e.target.classList.contains("btn-buka-lore")) return;
                    pemicuEfekKlikKartu(itemKartu, char);
                });

                // Bungkus struktur HTML kartu (Gambar utuh di awal + overlay teks stat tersembunyi)
                itemKartu.innerHTML = `
                    <div class="box-gambar-2d">
                        <img src="${char.gambar2d}" alt="${char.namaLengkap}">
                    </div>
                    <div class="overlay-stat-dinamis hide-overlay-data">
                        <p class="txt-nama">NAMA: ${char.namaLengkap}</p>
                        <p>STATUS: ${char.statusKategori}</p>
                        <p>HP: ${char.hpBase}</p>
                        <p>ATTACK: ${char.attackBase}</p>
                        <p>DEF: ${char.defBase}</p>
                        <p>LEVEL: ${char.levelAwal}</p>
                        <button class="btn-buka-lore" onclick="bukaPopUpLoreKarakter('${char.id}')">DETAIL LATAR BELAKANG</button>
                    </div>
                `;

                gridFlex.appendChild(itemKartu);
            });

            containerGaleri.appendChild(gridFlex);
        }
    });
}

/**
 * 3. LOGIKA TOGGLE EFEK TRANSPARAN & TEKS STAT
 * Mengubah gambar yang diklik menjadi redup transparan dan memunculkan teks data di atasnya
 */
function pemicuEfekKlikKartu(elemenKartu, dataChar) {
    // Reset kartu lain terlebih dahulu agar hanya ada 1 kartu aktif yang transparan
    resetSemuaEfekTransparanKartu();

    const boxGambar = elemenKartu.querySelector(".box-gambar-2d img");
    const overlayStat = elemenKartu.querySelector(".overlay-stat-dinamis");

    if (boxGambar && overlayStat) {
        // Tambahkan class css transparan pada gambar asli
        boxGambar.classList.add("efek-gambar-transparan");
        // Munculkan overlay teks status lengkap di atasnya
        overlayStat.classList.remove("hide-overlay-data");
    }
}

/**
 * Mengembalikan seluruh kondisi kartu gambar di galeri menjadi terang/normal kembali
 */
function resetSemuaEfekTransparanKartu() {
    const semuaGambar = document.querySelectorAll(".box-gambar-2d img");
    const semuaOverlay = document.querySelectorAll(".overlay-stat-dinamis");

    semuaGambar.forEach(img => img.classList.remove("efek-gambar-transparan"));
    semuaOverlay.forEach(ovr => ovr.classList.add("hide-overlay-data"));
}

/**
 * 4. LOGIKA POP-UP NOVEL LATAR BELAKANG (LORE)
 * Membuka kotak pop-up penuh di tengah layar untuk membaca deskripsi latar belakang karakter
 */
function bukaPopUpLoreKarakter(idKarakter) {
    const dataTerpilih = masterKarakter.find(char => char.id === idKarakter);
    if (!dataTerpilih) return;

    const elemenPopUp = document.getElementById("panel-pop-up-lore-global");
    const judulPopUp = document.getElementById("txt-judul-lore-char");
    const isiTeksPopUp = document.getElementById("txt-isi-novel-lore");

    if (elemenPopUp && judulPopUp && isiTeksPopUp) {
        // Suntik data judul nama dan isi cerita novel ke dalam panel pop-up
        judulPopUp.innerText = `LORE / LATAR BELAKANG: ${dataTerpilih.namaLengkap}`;
        isiTeksPopUp.innerText = dataTerpilih.latarBelakangLore;

        // Hilangkan class sembunyi agar pop-up tampil di layar utama
        elemenPopUp.classList.remove("hide-pop-up-lore");
    }
}

/**
 * Menutup panel pop-up novel cerita latar belakang (Dipicu oleh tombol X)
 */
function tutupPopUpLoreKarakter() {
    const elemenPopUp = document.getElementById("panel-pop-up-lore-global");
    if (elemenPopUp) {
        elemenPopUp.classList.add("hide-pop-up-lore");
    }
}

/**
 * 5. FUNGSI NAVIGASI GLOBAL
 * Mengatur pergerakan halaman browser menuju lobi utama atau daftar karakter aktif
 */
function pindahHalamanProfil(namaFileTujuan) {
    // Jika tujuannya kembali ke lobi utama, kita harus keluar dari folder tampilan ke menu-utama-game.html
    if (namaFileTujuan === "menu-utama-game.html") {
        window.location.href = "menu-utama-game.html";
    } else {
        // Mengalihkan rute menuju file internal lainnya
        window.location.href = namaFileTujuan;
    }
}

/**
 * Logika scroll otomatis halus ke target kelompok status saat tombol menu di sisi kiri ditekan
 */
function scrollToKategoriStatus(namaKategori) {
    const elemenTarget = document.querySelector(`.group-target-${namaKategori.toLowerCase()}`);
    if (elemenTarget) {
        elemenTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
