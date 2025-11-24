// Username dan password admin
const adminUser = 'admin';
const adminPass = '12345';

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  if (user === adminUser && pass === adminPass) {
    document.getElementById('errorMsg').textContent = '';
    alert('Login berhasil! Selamat datang, Admin.');
    // Redirect ke dashboard
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('errorMsg').textContent = 'Username atau password salah!';
  }
});
