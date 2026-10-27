document.addEventListener('DOMContentLoaded', function() {
    memuatDaftarRekapJurnal();
});

// Fungsi memuat riwayat data dengan urutan dari Terbaru hingga Terlama
function memuatDaftarRekapJurnal() {
    const kontainer = document.getElementById('kontenRekapAbsensi');
    if (!kontainer) return;
    kontainer.innerHTML = '';

    // Ambil daftar jurnal absensi lama dari localStorage
    let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];

    if (daftarJurnal.length === 0) {
        kontainer.innerHTML = `<p style="text-align:center; color:#999; font-style:italic; margin-top:20px;">Belum ada rekaman data jurnal absensi yang dibuat.</p>`;
        return;
    }

    // MEMBALIKKAN URUTAN DATA: Jurnal paling baru (Timestamp terbesar) otomatis pindah ke paling atas
    let jurnalTerurut = [...daftarJurnal].sort((a, b) => b.id - a.id);

    jurnalTerurut.forEach(function(jurnal) {
        const jumlahSiswa = jurnal.siswa ? jurnal.siswa.length : 0;
        
        const kartu = document.createElement('div');
        kartu.className = 'kartu-jurnal';
        kartu.innerHTML = `
            <div class="info-jurnal">
                <h4>${jurnal.hari}, ${jurnal.tanggal} ${jurnal.bulan} ${jurnal.tahun}</h4>
                <p>Total Absensi: ${jumlahSiswa} Siswa terdaftar</p>
            </div>
            <div>
                <button class="btn-detail" onclick="bukaModalDetail(${jurnal.id})">Detail</button>
            </div>
        `;
        kontainer.appendChild(kartu);
    });
}

// Fungsi membuka pop-up Modal Detail dan menampilkan data permanen (Tidak Bisa Diedit)
window.bukaModalDetail = function(id) {
    let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];
    const jurnal = daftarJurnal.find(item => item.id === id);

    if (!jurnal) return;

    // Set tulisan Kop Identitas Waktu Dokumen
    document.getElementById('pdfWaktuJurnal').textContent = `${jurnal.hari}, ${jurnal.tanggal} ${jurnal.bulan} ${jurnal.tahun}`;

    // Cetak daftar nama siswa ke dalam tabel detail
    const tbody = document.getElementById('tabelSiswaDetail');
    tbody.innerHTML = '';

    const listSiswa = jurnal.siswa || [];
    if (listSiswa.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#999;">Tidak ada data siswa di dalam jurnal ini.</td></tr>`;
    } else {
        listSiswa.forEach(function(siswa) {
            const tr = document.createElement('tr');
            // Murni disajikan berupa teks statis (polos permanen), tidak menggunakan select dropdown
            tr.innerHTML = `
                <td>${siswa.no}</td>
                <td>${siswa.nama}</td>
                <td style="font-weight: bold; color: ${siswa.status === 'Alpha' ? '#e74c3c' : (siswa.status === 'Hadir' ? '#2ecc71' : '#333')}">${siswa.status}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Tampilkan jendela pop-up ke layar
    document.getElementById('modalDetail').style.display = 'flex';
};

// Fungsi menutup pop-up modal
window.tutupModal = function() {
    document.getElementById('modalDetail').style.display = 'none';
};

// Fitur Utama: Mengunduh dan Menjadikan Dokumen Laporan Absensi Sebagai File PDF secara lokal
window.unduhPDF = function() {
    // Memicu pencetakan halaman browser menjadi PDF lokal
    window.print();
};
