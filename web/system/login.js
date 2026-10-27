document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah halaman refresh saat submit

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const pesanError = document.getElementById('pesanError');

    // Validasi kecocokan username dan password
    if (usernameInput === 'admin' && passwordInput === '1234') {
        pesanError.textContent = "";
        alert("Login Berhasil!");
        
        // Mengarahkan ke index.html yang ada di dalam folder tampilan
        window.location.href = "web/tampilan/index.html";
    } else {
        pesanError.textContent = "Username atau password salah!";
    }
});