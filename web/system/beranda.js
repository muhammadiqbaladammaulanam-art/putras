document.addEventListener('DOMContentLoaded', function() {
    // Bersihkan sisa data edit lama setiap kali kembali ke beranda utama
    localStorage.removeItem('jurnalTerpilih');
    
    tampilkanDataBeranda();

    // Jalankan fungsi pencarian dinamis saat mengetik keyword
    const inputCari = document.getElementById('inputCariJurnal');
    if (inputCari) {
        inputCari.addEventListener('input', function() {
            const keyword = inputCari.value.toLowerCase();
            tampilkanDataBeranda(keyword);
        });
    }

    // Memastikan tombol navigasi Absen Masuk bersih dari sisa edit mode
    const linkAbsenMasuk = document.getElementById('linkAbsenMasuk');
    if (linkAbsenMasuk) {
        linkAbsenMasuk.addEventListener('click', function() {
            localStorage.removeItem('jurnalTerpilih');
        });
    }
});

function tampilkanDataBeranda(keyword = "") {
    const tabel = document.getElementById('tabelBeranda');
    if (!tabel) return;
    tabel.innerHTML = '';

    // Ambil database lokal
    let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];

    // Filter baris data jika user sedang mencari sesuatu
    if (keyword !== "") {
        daftarJurnal = daftarJurnal.filter(function(jurnal) {
            return jurnal.hari.toLowerCase().includes(keyword) ||
                   jurnal.tanggal.toString().includes(keyword) ||
                   jurnal.bulan.toLowerCase().includes(keyword) ||
                   jurnal.tahun.toString().includes(keyword);
        });
    }

    // Cetak baris tabel memanjang ke samping
    daftarJurnal.forEach(function(jurnal) {
        const baris = document.createElement('tr');
        baris.innerHTML = `
            <td>${jurnal.hari}</td>
            <td>${jurnal.tanggal}</td>
            <td>${jurnal.bulan}</td>
            <td>${jurnal.tahun}</td>
            <td>
                <button class="btn-lihat" onclick="bukaDetailJurnal(${jurnal.id})">Lihat</button>
                <button class="btn-hapus" onclick="hapusJurnal(${jurnal.id})">Hapus</button>
            </td>
        `;
        tabel.appendChild(baris);
    });
}

// Melempar ID dokumen ke memori untuk dibuka kembali di halaman baru
function bukaDetailJurnal(id) {
    localStorage.setItem('jurnalTerpilih', id);
    window.location.href = "absen-masuk.html";
}

function hapusJurnal(id) {
    if (confirm("Apakah kamu yakin ingin menghapus seluruh rekaman data jurnal absensi ini?")) {
        let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];
        daftarJurnal = daftarJurnal.filter(jurnal => jurnal.id !== id);
        localStorage.setItem('daftarJurnal', JSON.stringify(daftarJurnal));
        
        if (document.getElementById('inputCariJurnal')) {
            document.getElementById('inputCariJurnal').value = '';
        }
        tampilkanDataBeranda();
    }
}
