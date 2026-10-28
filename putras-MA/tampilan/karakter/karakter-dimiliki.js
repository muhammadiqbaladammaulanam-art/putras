// ===================================================
// LOGIKA ENGINE KARAKTER DIMILIKI - putras-MA (TOTAL AUTOMATIC & COMPLETE)
// ===================================================

let filterKategoriAktif = "SEMUA";

document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadGame === "function") {
        loadGame();
    }
    renderDaftarKarakterAktif();
});

function renderDaftarKarakterAktif() {
    const containerGaleri = document.getElementById("area-galeri-aktif");
    if (!containerGaleri) return;

    containerGaleri.innerHTML = "";
    const karakterMilikPemain = dataGame.daftarKarakterGacha || [];

    if (karakterMilikPemain.length === 0) {
        containerGaleri.innerHTML = `<div class="judul-grup-kategori">Belum ada karakter yang didapatkan dari Gacha.</div>`;
        return;
    }

    const listKategori = filterKategoriAktif === "SEMUA" ? ["SPESIAL", "RAIU", "STARS", "SKY"] : [filterKategoriAktif];

    listKategori.forEach((kategori) => {
        const grupKarakterTersaring = karakterMilikPemain.filter(charSaves => {
            const idDasar = charSaves.nama.startsWith("Artup ") ? "artup" : charSaves.nama.toLowerCase().replace(/\s+/g, "_");
            const dataMaster = (typeof masterKarakter !== "undefined") ? masterKarakter.find(m => m.id === idDasar) : null;
            if (!dataMaster && idDasar === "artup" && kategori === "SPESIAL") return true;
            return dataMaster && dataMaster.statusKategori === kategori;
        });

        if (grupKarakterTersaring.length > 0) {
            const sectionJudul = document.createElement("div");
            sectionJudul.className = "judul-grup-kategori";
            sectionJudul.innerText = `STATUS: ${kategori}`;
            containerGaleri.appendChild(sectionJudul);

            const gridFlex = document.createElement("div");
            gridFlex.className = "grid-wrapper-karakter";

            grupKarakterTersaring.forEach((charSaves) => {
                const idDasar = charSaves.nama.startsWith("Artup ") ? "artup" : charSaves.nama.toLowerCase().replace(/\s+/g, "_");
                const dataMaster = (typeof masterKarakter !== "undefined") ? masterKarakter.find(m => m.id === idDasar) : null;
                const pathGambar = dataMaster ? dataMaster.gambar2d : "https://unsplash.com";

                const itemKartu = document.createElement("div");
                itemKartu.className = "kartu-karakter-master";
                
                itemKartu.addEventListener("click", () => {
                    bukaLayarDetailKarakter(charSaves, dataMaster, kategori, idDasar);
                });

                itemKartu.innerHTML = `
                    <div class="box-gambar-2d">
                        <img src="${pathGambar}" alt="${charSaves.nama}">
                    </div>
                    <div class="label-nama-bawah-kartu">${charSaves.nama}</div>
                `;

                gridFlex.appendChild(itemKartu);
            });

            containerGaleri.appendChild(gridFlex);
        }
    });

    if (containerGaleri.innerHTML === "") {
        containerGaleri.innerHTML = `<div class="judul-grup-kategori">Tidak ada karakter dimiliki dengan status ${filterKategoriAktif}.</div>`;
    }
}

function bukaLayarDetailKarakter(dataSaveChar, dataMasterChar, kategoriStatus, idDasarKarakter) {
    const panelDaftarUtama = document.getElementById("panel-utama-daftar");
    const panelLayarDetail = document.getElementById("panel-layar-detail-baru");

    const txtNama = document.getElementById("detail-txt-nama");
    const txtStatus = document.getElementById("detail-txt-status");
    const txtLevel = document.getElementById("detail-txt-level");
    const txtHp = document.getElementById("detail-txt-hp");
    const txtAttack = document.getElementById("detail-txt-attack");
    const txtDef = document.getElementById("detail-txt-def");
    const wadahVisualBerdiri = document.getElementById("wadah-visual-berdiri");
    const containerSkill = document.getElementById("list-box-skill-dinamis");
    const areaLoreLokal = document.getElementById("detail-box-lore-lokal");
    const barFill = document.getElementById("level-bar-fill-dinamis");

    if (!panelLayarDetail || !panelDaftarUtama) return;

    // 1. Suntik Data Angka Stat Dinamis Terbaru dari Save / Karakter JS
    txtNama.innerText = dataSaveChar.nama;
    txtStatus.innerText = kategoriStatus;
    txtLevel.innerText = dataSaveChar.level;

    // ANIMASI GERAKAN FILL BAR LEVEL (Maksimal Level Akun Game Anda adalah 99 sesuai form login)
    if (barFill) {
        const persentaseBar = (dataSaveChar.level / 99) * 100;
        barFill.style.width = persentaseBar + "%";
    }

    const hpDinamis = dataSaveChar.hp || (dataMasterChar ? dataMasterChar.hpBase : 108);
    const attackDinamis = dataSaveChar.attack || (dataMasterChar ? dataMasterChar.attackBase : 18);
    const defDinamis = dataSaveChar.def || (dataMasterChar ? dataMasterChar.defBase : 8);

    txtHp.innerText = hpDinamis;
    txtAttack.innerText = attackDinamis;
    txtDef.innerText = defDinamis;

    // 2. Suntik Aset Visual Karakter Berdiri Menginjak Lantai
    const pathGambarBesar = dataMasterChar ? dataMasterChar.gambar2d : "https://unsplash.com";
    wadahVisualBerdiri.innerHTML = `<img src="${pathGambarBesar}" alt="${dataSaveChar.nama}">`;

    // 3. SUNTIK GAMBAR IKON, NAMA, DAN TEKS PENJELASAN SKILL DARI skill.js
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
            containerSkill.innerHTML = `<div style="font-size:0.85rem; color:#aaa;">Skill belum dikonfigurasi di skill.js</div>`;
        }
    } else {
        containerSkill.innerHTML = `<div style="font-size:0.85rem; color:#aaa;">Skill belum dikonfigurasi di skill.js</div>`;
    }

    // 4. SUNTIK NOVEL LATAR BELAKANG DARI FILE MASTER profil
    if (areaLoreLokal) {
        const teksLoreAsli = dataMasterChar ? dataMasterChar.latarBelakangLore : "Kisah latar belakang belum diisi di profil master.";
        areaLoreLokal.innerHTML = `
            <h3 style="color: var(--biru-muda-tech); font-size: 1.1rem; letter-spacing: 1px; margin-top: 2rem; margin-bottom: 0.5rem; text-transform: uppercase; border-top: 1px dashed #444; padding-top: 1rem;">DETAIL LATAR BELAKANG</h3>
            <p style="font-size: 0.85rem; color: #aaa; line-height: 1.5; text-align: justify;">${teksLoreAsli}</p>
        `;
    }

    panelDaftarUtama.classList.add("hide-element");
    panelLayarDetail.classList.remove("hide-layar-detail");
}

function tutupLayarDetailKarakter() {
    const panelDaftarUtama = document.getElementById("panel-utama-daftar");
    const panelLayarDetail = document.getElementById("panel-layar-detail-baru");

    if (panelLayarDetail && panelDaftarUtama) {
        panelLayarDetail.classList.add("hide-layar-detail");
        panelDaftarUtama.classList.remove("hide-element");
        renderDaftarKarakterAktif();
    }
}

function filterKategoriDimiliki(namaKategori) {
    if (filterKategoriAktif === namaKategori) {
        filterKategoriAktif = "SEMUA";
    } else {
        filterKategoriAktif = namaKategori;
    }
    renderDaftarKarakterAktif();
}

function pindahHalamanDimiliki(urlTujuan) {
    window.location.href = urlTujuan;
}
