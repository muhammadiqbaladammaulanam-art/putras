// ===================================================
// SYSTEM MASTER DATABASE KARAKTER - putras-MA (UTUH)
// ===================================================

/**
 * 1. KAMUS MASTER DATA SELURUH KARAKTER GAME (STAT TETAP)
 */
const masterKarakter = [
    {
        id: "artup",
        namaLengkap: "Artup",
        statusKategori: "SPESIAL", // Kategori wajib: SPESIAL, RAIU, STARS, SKY
        levelAwal: 1,
        hpBase: 108,
        attackBase: 18,
        defBase: 8,
        gambar2d: "rifai.png", // Cukup tulis nama file gambarnya saja
        latarBelakangLore: "ini uji coba"
    },
    {
        id: "inra",
        namaLengkap: "Inra",
        statusKategori: "SPESIAL", // Kategori wajib: SPESIAL, RAIU, STARS, SKY
        levelAwal: 1,
        hpBase: 81,
        attackBase: 18,
        defBase: 1,
        gambar2d: "inra.png", // Cukup tulis nama file gambarnya saja
        latarBelakangLore: "ini uji coba"
    },
    //di sini nambah karakter
];

/**
 * Pengecekan otomatis saat dokumen HTML selesai dimuat di browser
 */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadGame === "function") {
        loadGame();
    }
    
    renderGaleriMasterKarakter();
    
    // Logika deteksi klik luar kartu agar gambar kembali terang
    document.addEventListener("click", (event) => {
        const isKartuKarakter = event.target.closest(".kartu-karakter-master");
        const isTombolLore = event.target.closest(".btn-buka-lore");
        const isPopUpBox = event.target.closest(".wrapper-pop-up-lore");

        if (!isKartuKarakter && !isTombolLore && !isPopUpBox) {
            resetSemuaEfekTransparanKartu();
        }
    });
});

/**
 * 2. FUNGSI UTAMA RENDER GALERI MASTER
 */
function renderGaleriMasterKarakter() {
    const containerGaleri = document.getElementById("area-galeri-kanan");
    if (!containerGaleri) return;

    containerGaleri.innerHTML = "";
    const listKategori = ["SPESIAL", "RAIU", "STARS", "SKY"];

    listKategori.forEach((kategori) => {
        const grupKarakter = masterKarakter.filter(char => char.statusKategori === kategori);

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
                
                itemKartu.addEventListener("click", (e) => {
                    if (e.target.classList.contains("btn-buka-lore")) return;
                    pemicuEfekKlikKartu(itemKartu, char);
                });

                // 🔥 LOGIKA OTOMATIS: Sistem merakit jalur folder "../asset/nama_gambar" secara benar
                const pathGambarBenar = `../asset/${char.gambar2d}`;

                itemKartu.innerHTML = `
                    <div class="box-gambar-2d">
                        <img src="${pathGambarBenar}" alt="${char.namaLengkap}" onerror="this.src='https://placehold.co'">
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
 */
function pemicuEfekKlikKartu(elemenKartu, dataChar) {
    resetSemuaEfekTransparanKartu();

    const boxGambar = elemenKartu.querySelector(".box-gambar-2d img");
    const overlayStat = elemenKartu.querySelector(".overlay-stat-dinamis");

    if (boxGambar && overlayStat) {
        boxGambar.classList.add("efek-gambar-transparan");
        overlayStat.classList.remove("hide-overlay-data");
    }
}

function resetSemuaEfekTransparanKartu() {
    const semuaGambar = document.querySelectorAll(".box-gambar-2d img");
    const semuaOverlay = document.querySelectorAll(".overlay-stat-dinamis");

    semuaGambar.forEach(img => img.classList.remove("efek-gambar-transparan"));
    semuaOverlay.forEach(ovr => ovr.classList.add("hide-overlay-data"));
}

/**
 * 4. LOGIKA POP-UP NOVEL LATAR BELAKANG (LORE)
 */
function bukaPopUpLoreKarakter(idKarakter) {
    const dataTerpilih = masterKarakter.find(char => char.id === idKarakter);
    if (!dataTerpilih) return;

    const elemenPopUp = document.getElementById("panel-pop-up-lore-global");
    const judulPopUp = document.getElementById("txt-judul-lore-char");
    const isiTeksPopUp = document.getElementById("txt-isi-novel-lore");

    if (elemenPopUp && judulPopUp && isiTeksPopUp) {
        judulPopUp.innerText = `LORE / LATAR BELAKANG: ${dataTerpilih.namaLengkap}`;
        isiTeksPopUp.innerText = dataTerpilih.latarBelakangLore;
        elemenPopUp.classList.remove("hide-pop-up-lore");
    }
}

function tutupPopUpLoreKarakter() {
    const elemenPopUp = document.getElementById("panel-pop-up-lore-global");
    if (elemenPopUp) {
        elemenPopUp.classList.add("hide-pop-up-lore");
    }
}

/**
 * 5. FUNGSI NAVIGASI GLOBAL
 */
function pindahHalamanProfil(namaFileTujuan) {
    window.location.href = namaFileTujuan;
}

function scrollToKategoriStatus(namaKategori) {
    const elemenTarget = document.querySelector(`.group-target-${namaKategori.toLowerCase()}`);
    if (elemenTarget) {
        elemenTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}
