let listSiswaTerinput = [];
// Menangkap ID jika masuk dalam mode Edit/Lihat
let idJurnalTerpilih = localStorage.getItem('jurnalTerpilih');

const namaHariIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const namaBulanIndo = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

document.addEventListener('DOMContentLoaded', function() {
    // Jika mendeteksi ID jurnal lama, aktifkan mode edit dan kunci siswa lama
    if (idJurnalTerpilih) {
        memuatDataUntukDiedit();
    }

    // Tambah Siswa ke Tabel Sementara
    document.getElementById('btnTambahSiswa').addEventListener('click', function() {
        const noAbsen = document.getElementById('noAbsen').value;
        const namaSiswa = document.getElementById('namaSiswa').value;
        const statusKeterangan = document.getElementById('statusKeterangan').value;

        if (!noAbsen || !namaSiswa) {
            alert("Nomor absen dan nama siswa wajib diisi!");
            return;
        }

        const sudahAda = listSiswaTerinput.some(siswa => siswa.no === noAbsen);
        if (sudahAda) {
            alert("Nomor absen tersebut sudah terdaftar!");
            return;
        }

        listSiswaTerinput.push({
            no: noAbsen,
            nama: namaSiswa,
            status: statusKeterangan
        });

        listSiswaTerinput.sort((a, b) => parseInt(a.no) - parseInt(b.no));
        tampilkanListSiswa();
        
        document.getElementById('noAbsen').value = '';
        document.getElementById('namaSiswa').value = '';
        document.getElementById('statusKeterangan').value = 'Belum Diketahui';
    });

    // Submit Form Final (Fiks Jalur URL Kembali ke Beranda Utama)
    document.getElementById('formJurnalAbsensi').addEventListener('submit', function(event) {
        event.preventDefault();

        let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];

        if (idJurnalTerpilih) {
            // EKSEKUSI REVISI EDIT ULANG: Update list data siswa pada jurnal lama
            daftarJurnal = daftarJurnal.map(function(jurnal) {
                if (jurnal.id === parseInt(idJurnalTerpilih)) {
                    return {
                        id: jurnal.id,
                        hari: jurnal.hari,
                        tanggal: jurnal.tanggal,
                        bulan: jurnal.bulan,
                        tahun: jurnal.tahun,
                        siswa: listSiswaTerinput
                    };
                }
                return jurnal;
            });
            localStorage.removeItem('jurnalTerpilih');
        } else {
            // EKSEKUSI BUAT BARU: Dapatkan penanggalan otomatis komputer
            const waktuSekarang = new Date();
            const hariOtomatis = namaHariIndo[waktuSekarang.getDay()];
            const tanggalOtomatis = waktuSekarang.getDate();
            const bulanOtomatis = namaBulanIndo[waktuSekarang.getMonth()];
            const tahunOtomatis = waktuSekarang.getFullYear();

            const jurnalBaru = {
                id: Date.now(),
                hari: hariOtomatis,
                tanggal: tanggalOtomatis,
                bulan: bulanOtomatis,
                tahun: tahunOtomatis,
                siswa: listSiswaTerinput
            };
            daftarJurnal.push(jurnalBaru);
        }

        localStorage.setItem('daftarJurnal', JSON.stringify(daftarJurnal));
        alert("Seluruh data jurnal absensi berhasil disimpan!");
        
        // Fiks Navigasi: Kembali ke Beranda Utama dengan aman
        window.location.href = "index.html";
    });
});

function tampilkanListSiswa() {
    const tbody = document.getElementById('listSiswaSementara');
    if (!tbody) return;
    tbody.innerHTML = '';

    listSiswaTerinput.forEach(function(siswa, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${siswa.no}</td>
            <td>${siswa.nama}</td>
            <td>
                <select class="select-tabel" onchange="ubahStatusSiswaDiTabel(${index}, this.value)">
                    <option value="Belum Diketahui" ${siswa.status === 'Belum Diketahui' ? 'selected' : ''}>Belum Diketahui</option>
                    <option value="Hadir" ${siswa.status === 'Hadir' ? 'selected' : ''}>Hadir</option>
                    <option value="Alpha" ${siswa.status === 'Alpha' ? 'selected' : ''}>Alpha</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.ubahStatusSiswaDiTabel = function(index, statusBaru) {
    if (listSiswaTerinput[index]) {
        listSiswaTerinput[index].status = statusBaru;
    }
};

function memuatDataUntukDiedit() {
    const judulForm = document.getElementById('judulForm');
    if (judulForm) {
        judulForm.textContent = "Lihat & Edit Jurnal Absensi";
    }
    
    let daftarJurnal = JSON.parse(localStorage.getItem('daftarJurnal')) || [];
    const jurnalDitemukan = daftarJurnal.find(jurnal => jurnal.id === parseInt(idJurnalTerpilih));

    if (jurnalDitemukan) {
        // Mengembalikan daftar nama siswa lama ke dalam tabel pengeditan
        listSiswaTerinput = jurnalDitemukan.siswa || [];
        tampilkanListSiswa();
    }
}
