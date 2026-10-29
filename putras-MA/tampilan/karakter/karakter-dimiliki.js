// ============================================================================
// LOGICAL ENGINE KARAKTER DIMILIKI - putras-MA (SUPER EXTENDED AUTOMATIC VERSION)
// ============================================================================

// State Global Filter Tab Kategori aktif di halaman lobi
let filterKategoriAktif = "SEMUA";

/**
 * Pemicu awal saat browser selesai memuat seluruh struktur dokumen HTML
 */
document.addEventListener("DOMContentLoaded", () => {
    // Memastikan modul save data browser termuat dengan aman
    if (typeof loadGame === "function") {
        loadGame();
    } else {
        console.warn("Sistem Save (save.js) tidak terdeteksi di memori halaman.");
    }
    
    // Jalankan render visual utama ke layar lobi galeri aktif
    renderDaftarKarakterAktif();
});

/**
 * 1. TAMPILAN SEBELUM DIPENCET (DAFTAR GALERI UTAMA)
 * Berfungsi memajang seluruh pahlawan aktif hasil gacha secara otomatis
 */
function renderDaftarKarakterAktif() {
    const containerGaleri = document.getElementById("area-galeri-aktif");
    if (!containerGaleri) {
        console.error("EROR VITAL: Elemen HTML dengan id 'area-galeri-aktif' tidak ditemukan!");
        return;
    }

    // Bersihkan kontainer dari sisa render atau kedap-kedip sebelumnya
    containerGaleri.innerHTML = "";
    
    // Ambil data array karakter aktif milik pemain dari LocalStorage dataGame
    const karakterMilikPemain = dataGame.daftarKarakterGacha || [];

    // Sabuk pengaman jika pemain belum memiliki karakter apa pun di memori browser
    if (karakterMilikPemain.length === 0) {
        containerGaleri.innerHTML = `<div class="judul-grup-kategori">Belum ada karakter aktif yang terdaftar di akun Anda.</div>`;
        return;
    }

    // Daftar sekuensial kelompok status kategori yang akan di-render ke layar
    const listKategori = filterKategoriAktif === "SEMUA" ? ["SPESIAL", "RAIU", "STARS", "SKY"] : [filterKategoriAktif];

    listKategori.forEach((kategori) => {
        // Proses filtering kepemilikan karakter berdasarkan id atau teks nama
        const grupKarakterTersaring = karakterMilikPemain.filter(charSaves => {
            let idCari = charSaves.id;
            if (!idCari && charSaves.nama) {
                idCari = charSaves.nama.toLowerCase().includes("artup") ? "artup" : charSaves.nama.toLowerCase().replace(/\s+/g, "_");
            }

            const dataMaster = (typeof masterKarakter !== "undefined") ? masterKarakter.find(m => m.id === idCari) : null;
            
            // Aturan Fallback: Jika ini Artup Utama, otomatis kunci masuk ke golongan SPESIAL
            if (!dataMaster && idCari === "artup" && kategori === "SPESIAL") return true;
            return dataMaster && dataMaster.statusKategori === kategori;
        });

        // Jika faksi kategori memiliki pahlawan, buat struktur pembatas kelompok
        if (grupKarakterTersaring.length > 0) {
            const sectionJudul = document.createElement("div");
            sectionJudul.className = "judul-grup-kategori";
            sectionJudul.innerText = `STATUS: ${kategori}`;
            containerGaleri.appendChild(sectionJudul);

            const gridFlex = document.createElement("div");
            gridFlex.className = "grid-wrapper-karakter";

            grupKarakterTersaring.forEach((charSaves) => {
                let idCari = charSaves.id;
                if (!idCari && charSaves.nama) {
                    idCari = charSaves.nama.toLowerCase().includes("artup") ? "artup" : charSaves.nama.toLowerCase().replace(/\s+/g, "_");
                }

                const dataMaster = (typeof masterKarakter !== "undefined") ? masterKarakter.find(m => m.id === idCari) : null;
                
                // JIPLAK PATH ASLI DARI PROFIL MASTER
                let pathGambarMentah = dataMaster ? dataMaster.gambar2d : "../asset/inra.png";
                let pathGambarFix = pathGambarMentah;

                // 🔥 SISTEM AUTO-KOREKSI JALUR FOLDER (ANTI-TERSESAT OFFLINE)
                if (pathGambarMentah.startsWith("../asset/")) {
                    pathGambarFix = "../../asset/" + pathGambarMentah.substring(9);
                } else if (!pathGambarMentah.startsWith("../") && !pathGambarMentah.startsWith("http")) {
                    pathGambarFix = "../../asset/" + pathGambarMentah;
                }

                const itemKartu = document.createElement("div");
                itemKartu.className = "kartu-karakter-master";
                
                // Daftarkan event handler klik kartu pahlawan menuju layar detail penuh
                itemKartu.addEventListener("click", () => {
                    bukaLayarDetailKarakter(charSaves, dataMaster, kategori, idCari, pathGambarFix);
                });

                // Suntik struktur HTML kartu (onerror dikunci total dengan null agar mutlak anti-kedap-kedip)
                itemKartu.innerHTML = `
                    <div class="box-gambar-2d">
                        <img src="${pathGambarFix}" alt="${charSaves.nama}" onerror="this.onerror=null; this.src='../../asset/inra.png';">
                    </div>
                    <div class="label-nama-bawah-kartu">${charSaves.nama}</div>
                `;

                gridFlex.appendChild(itemKartu);
            });

            containerGaleri.appendChild(gridFlex);
        }
    });

    // Validasi akhir jika hasil filter tab menu kosong
    if (containerGaleri.innerHTML === "") {
        containerGaleri.innerHTML = `<div class="judul-grup-kategori">Tidak ada karakter dimiliki dengan faksi status ${filterKategoriAktif}.</div>`;
    }
}
/**
 * 2. TAMPILAN SETELAH DIPENCET (MASUK LAYAR DETAIL FULL RPG 2 KOLOM)
 */
function bukaLayarDetailKarakter(dataSaveChar, dataMasterChar, kategoriStatus, idDasarKarakter, pathGambarSudahKoreksi) {
    const panelDaftarUtama = document.getElementById("panel-utama-daftar");
    const panelLayarDetail = document.getElementById("panel-layar-detail-baru");

    // Inisialisasi komponen penampung teks di layar kanan
    const txtNama = document.getElementById("detail-txt-nama");
    const txtStatus = document.getElementById("detail-txt-status");
    const txtLevel = document.getElementById("detail-txt-level");
    const txtHp = document.getElementById("detail-txt-hp");
    const txtAttack = document.getElementById("detail-txt-attack");
    const txtDef = document.getElementById("detail-txt-def");
    
    // Inisialisasi wadah visual besar sisi kiri dan slot bawah
    const wadahVisualBerdiri = document.getElementById("wadah-visual-berdiri");
    const containerSkill = document.getElementById("list-box-skill-dinamis");
    const areaLoreLokal = document.getElementById("detail-box-lore-lokal");
    const barFill = document.getElementById("level-bar-fill-dinamis");

    if (!panelLayarDetail || !panelDaftarUtama) return;

    // Suntik Nilai Angka Stat Dinamis Terbaru dari data simpanan aktif pemain
    txtNama.innerText = dataSaveChar.nama;
    txtStatus.innerText = kategoriStatus;
    txtLevel.innerText = dataSaveChar.level;

    // Hitung visualisasi pengisian bar level aktif (Batas maks level akun = 99)
    if (barFill) {
        const persentaseBar = (dataSaveChar.level / 99) * 100;
        barFill.style.width = persentaseBar + "%";
    }

    // Set nilai stat tempur dinamis (Gunakan data master jika data dinamis kosong)
    txtHp.innerText = dataSaveChar.hp || (dataMasterChar ? dataMasterChar.hpBase : 108);
    txtAttack.innerText = dataSaveChar.attack || (dataMasterChar ? dataMasterChar.attackBase : 18);
    txtDef.innerText = dataSaveChar.def || (dataMasterChar ? dataMasterChar.defBase : 8);

    // 🛠️ TAMPILAN MENGAJAK TANAH: Gunakan jalur gambar yang sudah berhasil dikoreksi otomatis di atas
    wadahVisualBerdiri.innerHTML = `<img src="${pathGambarSudahKoreksi}" alt="${dataSaveChar.nama}" onerror="this.onerror=null; this.src='../../asset/inra.png';">`;

    // 🛠️ SUNTIK DATA DETAIL SKILL: Seluruh komponen (Ikon, Nama, Deskripsi) ditarik utuh dari skill.js
    containerSkill.innerHTML = "";
    if (typeof databaseSkill !== "undefined" && Array.isArray(databaseSkill)) {
        const skillDitemukan = databaseSkill.find(s => s.pemilikId === idDasarKarakter);

        if (skillDitemukan) {
            containerSkill.innerHTML = `
                <div class="skill-item-slot" style="display: flex; gap: 1rem; align-items: center; width: 100%;">
                    <div class="box-ikon-skill" style="width: 50px; height: 50px; border: 2px solid var(--biru-muda-tech); border-radius: 4px; overflow: hidden; flex-shrink: 0; background: #000;">
                        <img src="${skillDitemukan.gambarIkonSkill}" alt="${skillDitemukan.namaSkill}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="info-teks-skill">
                        <div class="nama-skill" style="font-weight: bold; color: #fff; font-size: 0.95rem; margin-bottom: 0.2rem;">${skillDitemukan.namaSkill}</div>
                        <div class="deskripsi-skill" style="font-size: 0.75rem; color: #aaa; line-height: 1.3;">${skillDitemukan.deskripsiTeks}</div>
                    </div>
                </div>
            `;
        } else {
            containerSkill.innerHTML = `<div style="font-size:0.85rem; color:#aaa;">Skill pahlawan belum dikonfigurasi di berkas database skill.js</div>`;
        }
    } else {
        containerSkill.innerHTML = `<div style="font-size:0.85rem; color:#aaa;">Database kemampuan (skill.js) belum terhubung atau tidak terdeteksi.</div>`;
    }

    // Suntik Teks Narasi Novel Latar Belakang Tetap yang disalin dari master profil
    if (areaLoreLokal) {
        const teksLoreAsli = dataMasterChar ? dataMasterChar.latarBelakangLore : "Kisah latar belakang pahlawan belum ditulis di profil master.";
        areaLoreLokal.innerHTML = `
            <h3 style="color: var(--biru-muda-tech); font-size: 1.1rem; letter-spacing: 1px; margin-top: 2rem; margin-bottom: 0.5rem; text-transform: uppercase; border-top: 1px dashed #444; padding-top: 1rem;">DETAIL LATAR BELAKANG</h3>
            <p style="font-size: 0.85rem; color: #aaa; line-height: 1.5; text-align: justify;">${teksLoreAsli}</p>
        `;
    }

    // Jalankan animasi transisi pergantian panel layar lobi ke lobi detail penuh
    panelDaftarUtama.classList.add("hide-element");
    panelLayarDetail.classList.remove("hide-layar-detail");
}

/**
 * Keluar dari lobi detail penuh menuju daftar galeri awal
 */
function tutupLayarDetailKarakter() {
    const panelDaftarUtama = document.getElementById("panel-utama-daftar");
    const panelLayarDetail = document.getElementById("panel-layar-detail-baru");

    if (panelLayarDetail && panelDaftarUtama) {
        panelLayarDetail.classList.add("hide-layar-detail");
        panelDaftarUtama.classList.remove("hide-element");
        renderDaftarKarakterAktif();
    }
}

/**
 * Filter barisan list kartu pahlawan berdasarkan tab menu faksi status kiri
 */
function filterKategoriDimiliki(namaKategori) {
    filterKategoriAktif = filterKategoriAktif === namaKategori ? "SEMUA" : namaKategori;
    renderDaftarKarakterAktif();
}

/**
 * Pengatur kembalinya rute halaman menuju menu utama game
 */
function pindahHalamanDimiliki(urlTujuan) {
    window.location.href = urlTujuan;
}
