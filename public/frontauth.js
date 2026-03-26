const API = 'http://localhost:3000';

let session = null;

// ── Tab switching ──────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', (i === 0) === (tab === 'login')));
  document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'flex' : 'none';
  hideMsg();
}

// ── Messages ──────────────────────────────────────────────────
function showMsg(text, type) {
  const el = document.getElementById('msg');
  el.textContent = text;
  el.className = 'msg ' + type;
}
function hideMsg() {
  document.getElementById('msg').className = 'msg';
}

// ── Button loading state ───────────────────────────────────────
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  btn.disabled = loading;
  btn.textContent = loading
    ? 'Please wait…'
    : btnId === 'loginBtn' ? 'Log In' : 'Create Account';
}

// ── Login ──────────────────────────────────────────────────────
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  if (!email || !password) return showMsg('Please fill in all fields.', 'error');

  setLoading('loginBtn', true);
  hideMsg();
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Login failed');

    // Store session with the token returned from the server
    session = { token: data.token, firstName: data.firstName, email, id: data._id };
    showDashboard();
  } catch (e) {
    showMsg(e.message, 'error');
  } finally {
    setLoading('loginBtn', false);
  }
}

// ── Signup ─────────────────────────────────────────────────────
async function signup() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('signupEmail').value.trim();
  const password  = document.getElementById('signupPassword').value;
  if (!firstName || !lastName || !email || !password)
    return showMsg('Please fill in all fields.', 'error');

  setLoading('signupBtn', true);
  hideMsg();
  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ firstName, lastName, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.message || 'Signup failed');

    showMsg('Account created! You can now log in.', 'success');
    switchTab('login');
  } catch (e) {
    showMsg(e.message, 'error');
  } finally {
    setLoading('signupBtn', false);
  }
}

// ── Logout ─────────────────────────────────────────────────────
async function logout() {
  try {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (_) {}
  session = null;
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('authSection').style.display = 'block';
  switchTab('login');
  // Clear login fields
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
}

// ── Dashboard ──────────────────────────────────────────────────
function showDashboard() {
  document.getElementById('authSection').style.display = 'none';
  const dash = document.getElementById('dashboard');
  dash.style.display = 'flex';

  // Avatar initials
  const initials = session.firstName.charAt(0).toUpperCase();
  document.getElementById('avatarInitials').textContent = initials;

  document.getElementById('welcomeMsg').textContent = `Hello, ${session.firstName}!`;

  const loginTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('userInfo').innerHTML = `
    <div class="info-row"><span class="info-label">Email</span><span>${session.email}</span></div>
    <div class="info-row"><span class="info-label">User ID</span><span class="info-mono">${session.id}</span></div>
    <div class="info-row"><span class="info-label">Session</span><span class="info-badge">Active</span></div>
    <div class="info-row"><span class="info-label">Signed in at</span><span>${loginTime}</span></div>
    <div class="info-row"><span class="info-label">Expires</span><span>1 hour</span></div>
  `;
}

// ── Enter key support ──────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const loginVisible = document.getElementById('loginForm').style.display !== 'none';
  loginVisible ? login() : signup();
});
