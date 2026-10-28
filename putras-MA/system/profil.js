// ==========================================
// SYSTEM LOGIKA PROFIL - putras-MA (UTUH & AMAN)
// ==========================================

let intervalWaktuBermain;
let cooldownFotoAktif = false;

document.addEventListener("DOMContentLoaded", () => {
    if (loadGame() && dataGame.profil && dataGame.profil.nama) {
        inisialisasiTampilanProfil();
        mulaiPenghitungWaktuBermain();
    } else {
        alert("Akses ditolak: Profil belum terdaftar!");
        window.location.href = "../../index.html";
    }
});

/**
 * 1. RENDERING DATA KE LAYAR UI
 */
function inisialisasiTampilanProfil() {
    document.getElementById("val-nama").innerText = dataGame.profil.nama;
    document.getElementById("val-umur").innerText = dataGame.profil.umur;
    document.getElementById("val-gender").innerText = dataGame.profil.gender;
    document.getElementById("foto-profil-besar").src = dataGame.profil.fotoKustom || "";

    if (dataGame.profil.catatanKecil) {
        document.getElementById("txt-catatan-pemain").innerText = `"${dataGame.profil.catatanKecil}"`;
    }

    const levelAkun = dataGame.karakterUtama.level || 1;
    document.getElementById("txt-level-akun").innerText = `Lv. ${levelAkun}`;
    
    const artupDinamis = dataGame.daftarKarakterGacha.find(k => k.nama.startsWith("Artup"));
    let expSekarang = 0, expMaksimal = 100;
    
    if (artupDinamis) {
        expSekarang = artupDinamis.exp || 0;
        expMaksimal = artupDinamis.expMaks || 100;
    }
    
    const persenExp = Math.min((expSekarang / expMaksimal) * 100, 100);
    document.getElementById("bar-level-fill").style.width = `${persenExp}%`;
    document.getElementById("txt-angka-exp").innerText = `${expSekarang} / ${expMaksimal} EXP`;

    perbaruiVisualPajanganProfil();
    periksaStatusCooldownSemuaKolom();
}

/**
 * 2. FITUR TRACKER TOTAL WAKTU BERMAIN
 */
function mulaiPenghitungWaktuBermain() {
    if (!dataGame.profil.totalWaktuDetik) dataGame.profil.totalWaktuDetik = 0;

    intervalWaktuBermain = setInterval(() => {
        dataGame.profil.totalWaktuDetik++;
        const totalDetik = dataGame.profil.totalWaktuDetik;
        
        const jam = Math.floor(totalDetik / 3600).toString().padStart(2, '0');
        const menit = Math.floor((totalDetik % 3600) / 60).toString().padStart(2, '0');
        const detik = (totalDetik % 60).toString().padStart(2, '0');

        document.getElementById("display-playtime").innerText = `${jam}:${menit}:${detik}`;

        if (totalDetik % 10 === 0) saveGame();
    }, 1000);
}

/**
 * 3. FITUR EDIT FOTO PROFIL (JEDA 10 DETIK)
 */
function prosesGantiFoto(event) {
    if (cooldownFotoAktif) return;
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dataGame.profil.fotoKustom = e.target.result;
            document.getElementById("foto-profil-besar").src = e.target.result;
            saveGame();

            cooldownFotoAktif = true;
            const labelTombol = document.getElementById("label-ganti-foto");
            const teksCooldown = document.getElementById("cooldown-foto-teks");
            labelTombol.style.opacity = "0.5";
            labelTombol.style.pointerEvents = "none";

            let sisaWaktuFoto = 10;
            teksCooldown.innerText = `Jeda ganti foto: ${sisaWaktuFoto}s`;

            const hitungMundurFoto = setInterval(() => {
                sisaWaktuFoto--;
                teksCooldown.innerText = `Jeda ganti foto: ${sisaWaktuFoto}s`;
                if (sisaWaktuFoto <= 0) {
                    clearInterval(hitungMundurFoto);
                    cooldownFotoAktif = false;
                    teksCooldown.innerText = "";
                    labelTombol.style.opacity = "1";
                    labelTombol.style.pointerEvents = "auto";
                }
            }, 1000);
        };
        reader.readAsDataURL(file);
    }
}

/**
 * 4. SYSTEM EDIT IDENTITAS DENGAN COOLDOWN 30 HARI MANDIRI
 */
function periksaStatusCooldownSemuaKolom() {
    if (!dataGame.profil.waktuEditTerakhir) {
        dataGame.profil.waktuEditTerakhir = { nama: 0, umur: 0, gender: 0 };
    }
    const waktuSekarang = Date.now();
    const durasi30Hari = 30 * 24 * 60 * 60 * 1000;

    ['nama', 'umur', 'gender'].forEach(kolom => {
        const waktuTerakhir = dataGame.profil.waktuEditTerakhir[kolom] || 0;
        const selisihWaktu = waktuSekarang - waktuTerakhir;
        const tombol = document.getElementById(`btn-edit-${kolom}`);

        if (selisihWaktu < durasi30Hari) {
            const sisaHari = Math.ceil((durasi30Hari - selisihWaktu) / (1000 * 60 * 60 * 24));
            tombol.innerText = `${sisaHari} HARI`;
            tombol.style.background = "#331111";
            tombol.style.color = "#ff5555";
            tombol.disabled = true;
        } else {
            tombol.innerText = "EDIT";
            tombol.style.background = "";
            tombol.style.color = "";
            tombol.disabled = false;
        }
    });
}

function mintaEditField(kolom) {
    let inputBaru = prompt(`Masukkan ${kolom} baru Anda:`, dataGame.profil[kolom]);
    if (inputBaru === null) return;
    inputBaru = inputBaru.trim();

    if (!inputBaru) return alert("Input tidak boleh kosong!");
    if (kolom === 'umur') {
        const cekAngka = parseInt(inputBaru);
        if (isNaN(cekAngka) || cekAngka < 1 || cekAngka > 99) return alert("Umur tidak valid!");
        inputBaru = cekAngka;
    }

    dataGame.profil[kolom] = inputBaru;
    dataGame.profil.waktuEditTerakhir[kolom] = Date.now();
    
    if (kolom === 'nama') {
        dataGame.karakterUtama.namaKarakter = `Artup ${inputBaru}`;
        const artup = dataGame.daftarKarakterGacha.find(k => k.id === "char_artup_utama");
        if (artup) artup.nama = `Artup ${inputBaru}`;
    }

    saveGame();
    inisialisasiTampilanProfil();
    alert(`Data ${kolom} berhasil diubah! Cooldown 30 hari berjalan.`);
}

/**
 * 5. FITUR EDIT CATATAN KECIL (MEMO)
 */
function editCatatanMemo() {
    const memoBaru = prompt("Tulis catatan biodata baru Anda:", dataGame.profil.catatanKecil || "");
    if (memoBaru === null) return;
    dataGame.profil.catatanKecil = memoBaru.trim();
    saveGame();
    inisialisasiTampilanProfil();
}

/**
 * 6. SYSTEM PAJANGAN KARAKTER FAVORIT
 */
function perbaruiVisualPajanganProfil() {
    const placeholder = document.getElementById("wrapper-gambar-pajangan");
    if (dataGame.profil.karakterFavoritTerpajang) {
        placeholder.innerText = `[ ${dataGame.profil.karakterFavoritTerpajang.toUpperCase()} ]`;
    } else {
        placeholder.innerText = "Belum Ada Pajangan";
    }
}

function bukaModalPajangan() {
    const modal = document.getElementById("modal-pajangan-karakter");
    const containerDaftar = document.getElementById("daftar-opsi-karakter");
    containerDaftar.innerHTML = "";

    const karakterDimiliki = dataGame.daftarKarakterGacha || [];
    if (karakterDimiliki.length === 0) {
        containerDaftar.innerHTML = "<p style='grid-column:span 3; color:#666;'>Kosong</p>";
    } else {
        karakterDimiliki.forEach(char => {
            const kartu = document.createElement("div");
            kartu.className = "kartu-opsi-char";
            kartu.innerHTML = `<strong>${char.nama.split(' ')[0]}</strong><br><span style='color:#ffd700'>Lv.${char.level}</span>`;
            kartu.onclick = () => {
                dataGame.profil.karakterFavoritTerpajang = char.nama;
                saveGame();
                perbaruiVisualPajanganProfil();
                tutupModalPajangan();
            };
            containerDaftar.appendChild(kartu);
        });
    }
    modal.classList.remove("hide-element");
}

function tutupModalPajangan() {
    document.getElementById("modal-pajangan-karakter").classList.add("hide-element");
}

/**
 * 7. FITUR KUNCI PENGAMAN RESET DATA GAME (3 VERIFIKASI)
 */
function pemicuResetBerlapis() {
    if (!confirm("⚠️ PERINGATAN 1/3: Hapus seluruh progres data game putras-MA Anda?")) return;
    if (!confirm("⚠️ PERINGATAN 2/3: Semua karakter gacha dan aset mata uang akan lenyap permanen!")) return;
    if (prompt("⚠️ KONFIRMASI FINAL 3/3:\nKetik 'RESET' untuk menghapus data:") === "RESET") {
        clearInterval(intervalWaktuBermain);
        resetGame();
    } else {
        alert("Reset digagalkan! Teks konfirmasi salah.");
    }
}
