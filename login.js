const API_URL = '/api';

// Login admin menggunakan data admin_users pada MySQL.
document.getElementById('loginForm').addEventListener('submit', async event => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  try {
    const response = await fetch(`${API_URL}/auth/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    localStorage.setItem('adminLoggedIn', 'true');
    window.location.href = 'dashboard.html';
  } catch (error) {
    // Mode demo tanpa backend tetap bisa dipakai dari browser.
    if (username === 'admin' && password === '12345') {
      localStorage.setItem('adminLoggedIn', 'true');
      window.location.href = 'dashboard.html';
      return;
    }
    errorMsg.textContent = error.message || 'Database/server belum aktif.';
  }
});
