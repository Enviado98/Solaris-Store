// ═══════════════════════════════════════════════
// SOLARIS — script.js
// ⚠️  Después de regenerar tus claves en Supabase,
//     actualiza SUPABASE_URL y SUPABASE_ANON_KEY
// ═══════════════════════════════════════════════

const SUPABASE_URL      = 'https://vwcwqljwojstyxfrvxcf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y3dxbGp3b2pzdHl4ZnJ2eGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzQ3NTYsImV4cCI6MjA5MDA1MDc1Nn0.uMyit3TrGq9VjKl9a_mMwafSUkepymU4Fax15ZmscmM';



// ← Cambia esto por tu número de WhatsApp (con código de país, sin + ni espacios)
const WA_NUMBER = '521234567890';

// ─── Mapa de servicios → categoría DB ──────────
// Para añadir un servicio: agrega aquí key: 'Categoria'
// y añade el botón correspondiente en index.html
const CAT_MAP = {
  // Streaming
  Netflix:        'Streaming',
  Vix:            'Streaming',
  HBO:            'Streaming',
  Disney:         'Streaming',
  Paramount:      'Streaming',
  PrimeVideo:     'Streaming',
  Crunchyroll:    'Streaming',
  OleadaTV:       'Streaming',
  UniversalPlus:  'Streaming',
  Mubi:           'Streaming',
  FoxOne:         'Streaming',
  IPTVSmarters:   'Streaming',
  // Música
  Spotify:        'Musica',
  YouTubePremium: 'Musica',
  AmazonMusic:    'Musica',
  // Gaming
  GamepassCore:   'Gaming',
  GamepassUlt:    'Gaming',
  // Software
  ChatGPT:        'Software',
  Canva:          'Software',
  Office:         'Software',
  Windows11:      'Software',
  Windows10:      'Software',
};

// Emoji por categoría (admin y fallback)
const CAT_EMOJI = {
  Streaming: '📺', Musica: '🎵', Gaming: '🎮', Software: '💻', Internet: '🌐',
};

// Iconify icon + color por servicio (para las product cards)
const SVC_ICON = {
  Netflix:       { icon: 'simple-icons:netflix',        color: '#E50914' },
  HBO:           { icon: 'simple-icons:hbo',            color: '#9900FF' },
  Disney:        { icon: 'simple-icons:disneyplus',     color: '#113CCF' },
  PrimeVideo:    { icon: 'simple-icons:primevideo',     color: '#00A8E1' },
  Paramount:     { icon: 'simple-icons:paramountplus',  color: '#0064FF' },
  Crunchyroll:   { icon: 'simple-icons:crunchyroll',    color: '#F47521' },
  Vix:           { icon: 'simple-icons:univision',      color: '#FF6B00' },
  Mubi:          { icon: 'simple-icons:mubi',           color: '#222222' },
  FoxOne:        { icon: 'simple-icons:fox',            color: '#FF6600' },
  UniversalPlus: { icon: 'material-symbols:movie-outline-rounded', color: '#000000' },
  OleadaTV:      { icon: 'material-symbols:live-tv-outline-rounded', color: '#E50914' },
  IPTVSmarters:  { icon: 'material-symbols:play-circle-outline-rounded', color: '#7C3AED' },
  Spotify:       { icon: 'simple-icons:spotify',        color: '#1DB954' },
  YouTubePremium:{ icon: 'simple-icons:youtube',        color: '#FF0000' },
  AmazonMusic:   { icon: 'simple-icons:amazonmusic',    color: '#00A8E1' },
  GamepassCore:  { icon: 'simple-icons:xbox',           color: '#107C10' },
  GamepassUlt:   { icon: 'simple-icons:xbox',           color: '#52B043' },
  ChatGPT:       { icon: 'simple-icons:openai',         color: '#10A37F' },
  Canva:         { icon: 'simple-icons:canva',          color: '#00C4CC' },
  Office:        { icon: 'simple-icons:microsoftoffice',color: '#D83B01' },
  Windows11:     { icon: 'simple-icons:windows11',      color: '#0078D4' },
  Windows10:     { icon: 'simple-icons:windows',        color: '#0078D4' },
};

// Gradiente y color accent por categoría
const CAT_STYLE = {
  Streaming: { grad: 'linear-gradient(135deg,#E50914 0%,#ff6b35 100%)', accent: '#E50914', icon: 'material-symbols:tv-play-outline-rounded' },
  Musica:    { grad: 'linear-gradient(135deg,#1DB954 0%,#00d4ff 100%)', accent: '#1DB954', icon: 'material-symbols:music-note-rounded' },
  Gaming:    { grad: 'linear-gradient(135deg,#107C10 0%,#52B043 100%)', accent: '#107C10', icon: 'material-symbols:sports-esports-outline-rounded' },
  Software:  { grad: 'linear-gradient(135deg,#0078D4 0%,#7C3AED 100%)', accent: '#0078D4', icon: 'material-symbols:deployed-code-outline' },
  Internet:  { grad: 'linear-gradient(135deg,#00C4CC 0%,#0078D4 100%)', accent: '#00C4CC', icon: 'material-symbols:wifi-rounded' },
};

// Nombre bonito de categoría por svc key
const SVC_CAT_LABEL = {
  Netflix:'Streaming', Vix:'Streaming', HBO:'Streaming', Disney:'Streaming',
  Paramount:'Streaming', PrimeVideo:'Streaming', Crunchyroll:'Streaming',
  OleadaTV:'Streaming', UniversalPlus:'Streaming', Mubi:'Streaming',
  FoxOne:'Streaming', IPTVSmarters:'Streaming',
  Spotify:'Música', YouTubePremium:'Música', AmazonMusic:'Música',
  GamepassCore:'Gaming', GamepassUlt:'Gaming',
  ChatGPT:'Software', Canva:'Software', Office:'Software',
  Windows11:'Software', Windows10:'Software',
  InternetGratis:'Internet',
};


// ─── Supabase client ───────────────────────────
if (!window.supabase) {
  document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.innerHTML = '<div style="color:#c8860a;font-family:sans-serif;text-align:center;padding:40px"><p style="font-size:1.1rem;font-weight:600">Error de conexión</p><p style="font-size:0.85rem;opacity:0.7;margin-top:8px">Verifica tu internet y recarga la página</p><button onclick="location.reload()" style="margin-top:20px;padding:10px 24px;background:#c8860a;color:#fff;border:none;border-radius:10px;font-size:0.9rem;cursor:pointer">Reintentar</button></div>';
  });
  throw new Error('Supabase no cargó');
}
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ─── State ─────────────────────────────────────
let currentUser    = null;
let currentProfile = null;
let currentWallet  = null;
let allProducts    = [];

// ── Local cache (stale-while-revalidate) ─────────
const CACHE = {
  get(key)      { try { return JSON.parse(localStorage.getItem('sl_' + key)); } catch { return null; } },
  set(key, val) { try { localStorage.setItem('sl_' + key, JSON.stringify(val)); } catch {} },
  clear(key)    { try { localStorage.removeItem('sl_' + key); } catch {} },
};
let currentCat     = 'all';
let cart           = JSON.parse(localStorage.getItem('solaris_cart') || '[]');

// ─── Precio proporcional por días restantes ─────
function daysRemaining(p) {
  if (!p.expires_at) return p.duration_days || 30;
  return Math.max(0, Math.ceil((new Date(p.expires_at) - Date.now()) / 86400000));
}
function calcPrice(p) {
  if (!p.expires_at || !p.base_price) return parseFloat(p.price || 0);
  const days = daysRemaining(p);
  if (days <= 0) return 0;
  return Math.round((days / 30) * parseFloat(p.base_price) * 100) / 100;
}
function daysLabel(days) {
  if (days <= 0) return 'Expirado';
  if (days === 1) return '1 día';
  return `${days} días`;
}
function daysPercent(days) {
  return Math.min(100, Math.round((days / 30) * 100));
}

// ─── Caché del historial ────────────────────────
// Se carga una vez y se reutiliza. Se invalida solo al hacer una compra.
const _histCache = { orders: null, movs: null };

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Resolve session before showing any UI (prevents flash of login screen)
    const { data: { session } } = await db.auth.getSession();

    // Boot animation
    await sleep(1350);
    fadeOut(document.getElementById('loader'));
    await sleep(420);
    document.getElementById('loader').style.display = 'none';

    // Now show app with the correct view already determined
    if (session) await handleLogin(session.user);
    else showAuthView();
    document.getElementById('app').classList.remove('hidden');

    db.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN')  await handleLogin(session.user);
      if (event === 'SIGNED_OUT' && !window._manualLogout) handleLogout();
    });

    setupEvents();
  } catch (err) {
    // Si algo falla, ocultar loader y mostrar login de todas formas
    console.error('Boot error:', err);
    document.getElementById('loader').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    showAuthView();
    setupEvents();
  }
});

// ══════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════
async function handleLogin(user) {
  currentUser = user;

  ['nav-balance', 'nav-logout-btn', 'nav-cart-btn', 'nav-menu-btn', 'nav-account-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );
  document.getElementById('bottom-nav').classList.remove('hidden');

  const savedView = sessionStorage.getItem('solaris_view') || 'catalog';
  showView(savedView);

  // ── Mostrar caché inmediatamente (stale-while-revalidate) ──
  const cachedWallet  = CACHE.get('wallet_'  + user.id);
  const cachedProfile = CACHE.get('profile_' + user.id);
  const cachedProducts = CACHE.get('products');

  if (cachedWallet)  { currentWallet  = cachedWallet;  syncBalanceUI(); }
  if (cachedProfile) { currentProfile = cachedProfile; }
  if (cachedProducts && cachedProducts.length) {
    allProducts = cachedProducts;
    renderProducts();
  }
  if (savedView === 'account' && cachedWallet && cachedProfile) {
    renderAccountView();
  }
  // Si no hay caché completo, simplemente no mostramos skeleton —
  // los datos llegan en < 1s y renderAccountView se llama cuando ambos estén listos

  if (cachedProfile?.is_admin)
    document.getElementById('nav-admin-btn').classList.remove('hidden');

  // ── Cargar datos frescos en paralelo ──
  loadProducts(); // productos siempre frescos

  // Wallet y perfil en paralelo — renderizar cuenta solo cuando AMBOS estén listos
  Promise.all([
    fetchWallet(user.id),
    fetchProfile(user.id)
  ]).then(async ([wallet, profile]) => {
    // ── Verificar bloqueo ──
    if (profile?.is_blocked) {
      await db.auth.signOut();
      handleLogout();
      setTimeout(() => {
        setMsg('auth-msg', 'Tu cuenta ha sido bloqueada. Contacta al soporte.', 'error');
      }, 300);
      return;
    }

    if (wallet) {
      currentWallet = wallet;
      CACHE.set('wallet_' + user.id, wallet);
    }
    if (profile) {
      currentProfile = profile;
      CACHE.set('profile_' + user.id, profile);
      if (profile?.is_admin)
        document.getElementById('nav-admin-btn').classList.remove('hidden');
    }

    syncBalanceUI();
    if (savedView === 'account') renderAccountView();

    // ── Verificar perfil completo (nombre, apellido, username) ──
    const needsProfile = !profile?.first_name || !profile?.last_name || !profile?.username;
    if (needsProfile) showCompleteProfileModal();
  });
}

// ══════════════════════════════════════════════════
//  COMPLETE PROFILE MODAL (bloqueante, primer login)
// ══════════════════════════════════════════════════
let _cpUsernameTimer = null;

function showCompleteProfileModal() {
  // Crear overlay bloqueante independiente del modal genérico
  let overlay = document.getElementById('cp-overlay');
  if (overlay) return; // ya visible

  overlay = document.createElement('div');
  overlay.id = 'cp-overlay';
  overlay.innerHTML = `
    <div class="cp-box">
      <div class="cp-header">
        <span class="cp-emoji">👤</span>
        <h3 class="cp-title">Completa tu perfil</h3>
        <p class="cp-sub">Solo se hace una vez. Necesitamos tus datos para identificarte.</p>
      </div>

      <div class="cp-fields">
        <div class="cp-row">
          <div class="cp-field">
            <label class="cp-label">Nombre</label>
            <input id="cp-first" class="input" type="text" maxlength="40"
              placeholder="Ej. Ana" autocomplete="given-name"/>
          </div>
          <div class="cp-field">
            <label class="cp-label">Apellido</label>
            <input id="cp-last" class="input" type="text" maxlength="40"
              placeholder="Ej. López" autocomplete="family-name"/>
          </div>
        </div>

        <div class="cp-field">
          <label class="cp-label">@usuario</label>
          <input id="cp-username" class="input" type="text" maxlength="20"
            placeholder="letras, números, puntos y _" autocomplete="off" spellcheck="false"/>
          <span id="cp-username-fb" class="acct-user-feedback"></span>
        </div>
      </div>

      <div id="cp-error" class="dep-error" style="display:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span id="cp-error-text"></span>
      </div>

      <button id="cp-save-btn" class="dep-pay-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Guardar y continuar</span>
      </button>
    </div>`;
  document.body.appendChild(overlay);

  // Pre-rellenar si ya hay datos parciales
  if (currentProfile?.first_name)
    document.getElementById('cp-first').value = currentProfile.first_name;
  if (currentProfile?.last_name)
    document.getElementById('cp-last').value = currentProfile.last_name;
  if (currentProfile?.username)
    document.getElementById('cp-username').value = currentProfile.username;

  // Validación en tiempo real del @usuario (reutiliza lógica existente)
  document.getElementById('cp-username').addEventListener('input', () => {
    const fb  = document.getElementById('cp-username-fb');
    const val = document.getElementById('cp-username').value.trim().toLowerCase();
    clearTimeout(_cpUsernameTimer);
    if (!val) { fb.textContent = ''; fb.className = 'acct-user-feedback'; return; }
    if (val === (currentProfile?.username || '').toLowerCase()) {
      fb.textContent = '✓ Tu username actual'; fb.className = 'acct-user-feedback ok'; return;
    }
    if (!/^[a-z0-9._]{3,20}$/.test(val)) {
      fb.textContent = 'Solo letras, números, puntos y _ (3-20 caracteres)';
      fb.className = 'acct-user-feedback error'; return;
    }
    fb.textContent = 'Verificando...'; fb.className = 'acct-user-feedback checking';
    _cpUsernameTimer = setTimeout(() => checkUsernameAvailable(val, fb), 500);
  });

  document.getElementById('cp-save-btn').addEventListener('click', _saveCompleteProfile);
}

async function _saveCompleteProfile() {
  const firstName = document.getElementById('cp-first').value.trim();
  const lastName  = document.getElementById('cp-last').value.trim();
  const username  = document.getElementById('cp-username').value.trim().toLowerCase();
  const fb        = document.getElementById('cp-username-fb');
  const errEl     = document.getElementById('cp-error');
  const errText   = document.getElementById('cp-error-text');
  const btn       = document.getElementById('cp-save-btn');

  function showErr(msg) {
    errText.textContent = msg;
    errEl.style.display = 'flex';
  }
  errEl.style.display = 'none';

  // Validar nombre y apellido
  if (firstName.length < 2) return showErr('El nombre debe tener al menos 2 caracteres.');
  if (lastName.length < 2)  return showErr('El apellido debe tener al menos 2 caracteres.');
  if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]{2,40}$/.test(firstName))
    return showErr('El nombre solo puede contener letras.');
  if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s'-]{2,40}$/.test(lastName))
    return showErr('El apellido solo puede contener letras.');

  // Validar username
  if (!username) return showErr('Elige un @usuario.');
  if (!/^[a-z0-9._]{3,20}$/.test(username))
    return showErr('Username: solo letras, números, puntos y _ (3-20 caracteres).');

  // Verificar disponibilidad si cambió
  const currentUsername = (currentProfile?.username || '').toLowerCase();
  if (username !== currentUsername) {
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Verificando...';
    try {
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 6000));
      const res = await Promise.race([db.rpc('check_username', { p_username: username }), timeout]);
      if (!res.data?.available) {
        showErr('Ese @usuario ya está en uso, elige otro.');
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Guardar y continuar';
        return;
      }
    } catch {
      showErr('Sin conexión — intenta de nuevo.');
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Guardar y continuar';
      return;
    }
  }

  btn.disabled = true;
  btn.querySelector('span').textContent = 'Guardando...';

  const payload = {
    first_name: firstName,
    last_name:  lastName,
    username,
  };
  if (username !== currentUsername) payload.username_changed_at = new Date().toISOString();

  const { error } = await db.from('profiles').update(payload).eq('id', currentUser.id);

  if (error) {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Guardar y continuar';
    const msg = error.message?.includes('idx_profiles_username')
      ? 'Ese @usuario ya está en uso, elige otro.'
      : 'Error al guardar. Intenta de nuevo.';
    showErr(msg);
    return;
  }

  // Actualizar perfil en memoria y caché
  if (currentProfile) {
    currentProfile.first_name = firstName;
    currentProfile.last_name  = lastName;
    currentProfile.username   = username;
    if (payload.username_changed_at) currentProfile.username_changed_at = payload.username_changed_at;
    CACHE.set('profile_' + currentUser.id, currentProfile);
  }

  // Cerrar overlay y refrescar vista
  document.getElementById('cp-overlay')?.remove();
  renderAccountView();
  toast('¡Perfil completado! Bienvenido/a 🎉', 'success');
}

// ── Logout screen helpers
function showLogoutScreen() {
  let screen = document.getElementById('logout-screen');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'logout-screen';
    screen.innerHTML = `
      <div class="logout-inner">
        <div class="logout-hex-wrap">
          <svg class="logout-hex" viewBox="0 0 24 24"><use href="#ico-hex"/></svg>
        </div>
        <div class="logout-label">Cerrando sesión...</div>
      </div>`;
    document.body.appendChild(screen);
  }
  // Marcar botón de logout en rojo
  const btn = document.getElementById('nav-logout-btn');
  if (btn) btn.classList.add('logout-active');
  // Mostrar pantalla
  requestAnimationFrame(() => {
    screen.classList.remove('hidden');
    screen.classList.add('visible');
  });
}

function hideLogoutScreen() {
  const screen = document.getElementById('logout-screen');
  if (screen) { screen.classList.remove('visible'); screen.classList.add('hidden'); }
  const btn = document.getElementById('nav-logout-btn');
  if (btn) btn.classList.remove('logout-active');
}

function handleLogout() {
  if (currentUser) {
    CACHE.clear('wallet_'  + currentUser.id);
    CACHE.clear('profile_' + currentUser.id);
  }
  CACHE.clear('products');
  currentUser = currentProfile = currentWallet = null;
  cart = []; saveCart();
  if (_histPollInterval) { clearInterval(_histPollInterval); _histPollInterval = null; }
  _pendingNotif = null;
  try { localStorage.removeItem(_notifStateKey()); } catch {}
  ['nav-balance','nav-logout-btn','nav-cart-btn','nav-admin-btn','nav-menu-btn','nav-account-btn','nav-balance-pill'].forEach(id =>
    document.getElementById(id)?.classList.add('hidden')
  );
  closeNavPanel();
  document.getElementById('bottom-nav').classList.add('hidden');
  showAuthView();
}

async function fetchWithRetry(fn, retries = 3, delay = 1200) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (e) { /* seguir reintentando */ }
    if (i < retries - 1) await sleep(delay);
  }
  return null;
}
async function fetchProfile(uid) {
  return fetchWithRetry(async () => {
    const { data, error } = await db.from('profiles').select('*').eq('id', uid).single();
    if (error) throw error;
    return data;
  });
}
async function fetchWallet(uid) {
  return fetchWithRetry(async () => {
    const { data, error } = await db.from('wallets').select('*').eq('user_id', uid).single();
    if (error) throw error;
    return data;
  });
}

// ══════════════════════════════════════════════════
//  EVENTS
// ══════════════════════════════════════════════════
// ── Nav panel helpers ─────────────────────────
function openNavPanel() {
  document.getElementById('nav-panel').classList.add('open');
  document.getElementById('nav-menu-btn').classList.add('open');
}
function closeNavPanel() {
  document.getElementById('nav-panel').classList.remove('open');
  const btn = document.getElementById('nav-menu-btn');
  if (btn) btn.classList.remove('open');
}
function toggleNavPanel() {
  const panel = document.getElementById('nav-panel');
  panel.classList.contains('open') ? closeNavPanel() : openNavPanel();
}

function setupEvents() {
  // ── Auth tabs
  document.querySelectorAll('.auth-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab('.auth-tabs', '.auth-container .tab-content', btn.dataset.tab, 'tab-');
      clearMsg('auth-msg');
    });
  });

  // ── Login
  document.getElementById('login-btn').addEventListener('click', async () => {
    const email = val('login-email');
    const pass  = val('login-password');
    if (!email || !pass) return setMsg('auth-msg', 'Completa todos los campos', 'error');
    setBtn('login-btn', 'Entrando...');
    const { error } = await db.auth.signInWithPassword({ email, password: pass });
    setBtn('login-btn', 'Entrar');
    if (error) setMsg('auth-msg', friendlyError(error.message), 'error');
  });

  // ── Register
  document.getElementById('register-btn').addEventListener('click', async () => {
    const email = val('reg-email');
    const pass  = val('reg-password');
    if (!email || !pass) return setMsg('auth-msg', 'Completa todos los campos', 'error');
    if (pass.length < 6) return setMsg('auth-msg', 'Mínimo 6 caracteres en contraseña', 'error');
    setBtn('register-btn', 'Creando...');
    const { error } = await db.auth.signUp({ email, password: pass });
    setBtn('register-btn', 'Crear cuenta');
    if (error) setMsg('auth-msg', friendlyError(error.message), 'error');
    // Si no hay error, el onAuthStateChange se encarga de entrar automáticamente
  });

  // ── Logout
  document.getElementById('nav-logout-btn').addEventListener('click', async () => {
    closeNavPanel();
    window._manualLogout = true;
    showLogoutScreen();
    // Timeout de 4s: si Supabase no responde, logout local forzado
    await Promise.race([
      db.auth.signOut(),
      new Promise(r => setTimeout(r, 4000)),
    ]).catch(() => {});
    await new Promise(r => setTimeout(r, 600));
    hideLogoutScreen();
    window._manualLogout = false;
    handleLogout();
  });

  // ── Google sign-in
  document.getElementById('google-btn').addEventListener('click', async () => {
    const { error } = await db.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://solaris-store.onrender.com/' }
    });
    if (error) setMsg('auth-msg', 'Error al conectar con Google', 'error');
  });

  // ── Bottom nav
  document.querySelectorAll('.bottom-btn[data-view]').forEach(btn =>
    btn.addEventListener('click', () => showView(btn.dataset.view))
  );

  // ── Account button (shows info)
  document.getElementById('account-btn').addEventListener('click', () => {
    if (!currentUser) return;
    showView('account');
    renderAccountView();
  });

  // ── Hamburger menu
  document.getElementById('nav-menu-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNavPanel();
  });

  // ── Nav panel: Mi Cuenta
  document.getElementById('nav-account-btn').addEventListener('click', () => {
    closeNavPanel();
    showView('account');
    renderAccountView();
  });

  // ── Nav cart + admin (close panel on navigate)
  document.getElementById('nav-cart-btn').addEventListener('click', () => {
    closeNavPanel();
    showView('cart');
  });
  document.getElementById('nav-admin-btn').addEventListener('click', () => {
    closeNavPanel();
  });

  // ── Close panel when clicking outside
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('nav-panel');
    const menuBtn = document.getElementById('nav-menu-btn');
    if (panel && menuBtn && !panel.contains(e.target) && !menuBtn.contains(e.target)) {
      closeNavPanel();
    }
  });

  // ── Chips de servicio (filtran por svc key)
  document.querySelectorAll('.svc-chip').forEach(chip =>
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window._triggerLogoPulse) window._triggerLogoPulse();
      currentCat = chip.dataset.cat;
      const label = SVC_CAT_LABEL[currentCat] || currentCat;
      document.getElementById('products-panel-title').textContent = chip.textContent.trim();
      openProductsPanel();
    })
  );

  // ── Carrusel: CTA "Ver todos" por categoría
  document.querySelectorAll('.cat-card-cta').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (window._triggerLogoPulse) window._triggerLogoPulse();
      const catMap = {
        'Streaming': { cat: 'Streaming', title: '📺 Streaming' },
        'Musica':    { cat: 'Musica',    title: '🎵 Música' },
        'Gaming':    { cat: 'Gaming',    title: '🎮 Gaming' },
        'Software':  { cat: 'Software',  title: '💻 Software' },
        'Internet':  { cat: 'Internet',  title: '🌐 Internet Gratis' },
      };
      const key = btn.dataset.catTrigger;
      const info = catMap[key] || { cat: key, title: key };
      currentCat = info.cat;
      document.getElementById('products-panel-title').textContent = info.title;
      openProductsPanel();
    })
  );

  // ── Carrusel: dots + fondo ambiente animado
  (function initCarousel() {
    const carousel = document.getElementById('cat-carousel');
    const dots = document.querySelectorAll('.cdot');
    const cards = document.querySelectorAll('.cat-card');
    const ambient = document.getElementById('store-ambient');
    if (!carousel || !cards.length) return;

    function updateAmbient(color) {
      if (!ambient || !color) return;
      const r = parseInt(color.slice(1,3), 16);
      const g = parseInt(color.slice(3,5), 16);
      const b = parseInt(color.slice(5,7), 16);
      ambient.style.background = `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${r},${g},${b},0.09) 0%, transparent 70%)`;
    }

    function getActiveIndex() {
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      return closest;
    }

    function syncDots(idx) {
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      const card = cards[idx];
      if (card) updateAmbient(card.dataset.color);
    }

    let scrollTimer;
    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => syncDots(getActiveIndex()), 60);
    }, { passive: true });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        cards[i]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        syncDots(i);
      });
    });

    syncDots(0);
  })();

  document.getElementById('back-to-cats').addEventListener('click', () => {
    document.getElementById('products-panel').classList.add('hidden');
    document.querySelector('.store-layout')?.classList.remove('hidden');
    currentCat = 'all';
  });

  // ── Checkout
  document.getElementById('checkout-btn').addEventListener('click', doCheckout);

  // ── Admin tabs
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      switchTab('.admin-tabs', '.admin-tab', btn.dataset.adminTab, 'admin-tab-');
    })
  );

  // ── Add product
  document.getElementById('add-product-btn').addEventListener('click', addProduct);

  // ── Modal
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) closeModal();
  });
}

// ══════════════════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════════════════
async function loadProducts() {
  if (!allProducts.length) showProductsSkeleton();

  const { data, error } = await db
    .from('products').select('*')
    .eq('is_active', true)
    .order('expires_at', { ascending: true, nullsFirst: false });

  if (error) { console.error(error); return; }
  allProducts = data || [];
  CACHE.set('products', allProducts);
  renderProducts();
}

function openProductsPanel() {
  document.querySelector('.store-layout').classList.add('hidden');
  document.getElementById('products-panel').classList.remove('hidden');

  // Pintar cabecera según categoría activa
  const genericCats = ['Streaming', 'Musica', 'Gaming', 'Software', 'Internet'];
  const cat = genericCats.includes(currentCat)
    ? currentCat
    : (Object.entries(SVC_CAT_LABEL).find(([k]) => k === currentCat)?.[1] || 'Streaming');
  const style = CAT_STYLE[cat] || CAT_STYLE.Streaming;

  const hero    = document.getElementById('panel-hero');
  const iconEl  = document.getElementById('panel-hero-icon');
  const divider = document.getElementById('panel-divider');
  const subEl   = document.getElementById('panel-hero-sub');
  const subs    = { Streaming:'Series, películas y más', Musica:'Audio sin límites', Gaming:'Juega sin parar', Software:'Apps y herramientas', Internet:'Navega sin gastar datos' };

  if (hero)    hero.style.background = style.grad;
  if (divider) divider.style.background = style.grad;
  if (subEl)   subEl.textContent = subs[cat] || '';
  if (iconEl) {
    iconEl.setAttribute('data-icon', style.icon);
    if (window.Iconify) Iconify.scan(iconEl.parentElement);
  }

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const genericCats = ['Streaming', 'Musica', 'Gaming', 'Software', 'Internet'];
  const list = currentCat === 'all'
    ? allProducts
    : genericCats.includes(currentCat)
      ? allProducts.filter(p => p.category === currentCat)
      : allProducts.filter(p => p.service === currentCat);

  if (!list.length) {
    grid.innerHTML = '<div class="no-items">Sin productos disponibles</div>';
    return;
  }

  grid.innerHTML = list.map(p => {
    const svcIcon  = SVC_ICON[p.service];
    const catStyle = CAT_STYLE[p.category] || CAT_STYLE.Streaming;
    const iconHtml = svcIcon
      ? `<span class="iconify product-svc-icon" data-icon="${svcIcon.icon}" style="color:${svcIcon.color}"></span>`
      : `<span class="iconify product-svc-icon" data-icon="${catStyle.icon}" style="color:${catStyle.accent}"></span>`;

    const days     = daysRemaining(p);
    const dynPrice = calcPrice(p);
    const pct      = p.expires_at ? daysPercent(days) : 100;
    const barColor = pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444';

    return `
      <div class="product-card" data-id="${p.id}">
        <div class="product-card-top" style="--cat-accent:${catStyle.accent}">
          <div class="product-icon-wrap" style="--cat-accent:${catStyle.accent}">
            ${iconHtml}
          </div>
          <div class="product-badge-days" style="background:${barColor}22;color:${barColor}">
            ${daysLabel(days)}
          </div>
        </div>
        <div class="product-name">${esc(p.name)}</div>
        ${p.description ? `<div class="product-desc">${esc(p.description)}</div>` : ''}
        <div class="product-progress-wrap">
          <div class="product-progress-track">
            <div class="product-progress-bar" style="width:${pct}%;background:${barColor}"></div>
          </div>
        </div>
        <div class="product-footer">
          <div class="product-price-block">
            <div class="product-price">$${price(dynPrice)}</div>
            ${p.base_price ? `<div class="product-days">Base $${price(p.base_price)}/30d</div>` : `<div class="product-days">${days}d</div>`}
          </div>
          <button class="btn-add-cart" onclick="addToCart('${p.id}')">+ Carrito</button>
        </div>
      </div>`;
  }).join('');
  if (window.Iconify) Iconify.scan(grid);
}

// ══════════════════════════════════════════════════
//  CART
// ══════════════════════════════════════════════════
function addToCart(id) {
  if (cart.find(i => i.id === id)) { toast('Ya está en el carrito', 'error'); return; }
  cart.push({ id });
  saveCart(); syncCartCount();
  toast('Agregado ✓', 'success');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); syncCartCount(); renderCart();
}

function saveCart() { localStorage.setItem('solaris_cart', JSON.stringify(cart)); }

function renderCart() {
  const items = cart.map(c => allProducts.find(p => p.id === c.id)).filter(Boolean);
  const total = items.reduce((s, p) => s + calcPrice(p), 0);
  const balance = parseFloat(currentWallet?.balance || 0);

  const elItems   = document.getElementById('cart-items');
  const elSummary = document.getElementById('cart-summary');
  const elEmpty   = document.getElementById('cart-empty');

  if (!items.length) {
    elItems.innerHTML = '';
    elSummary.classList.add('hidden');
    elEmpty.classList.remove('hidden');
    return;
  }

  elEmpty.classList.add('hidden');
  elSummary.classList.remove('hidden');

  elItems.innerHTML = items.map(p => {
    const days     = daysRemaining(p);
    const dynPrice = calcPrice(p);
    return `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${esc(p.name)}</div>
        <div class="cart-item-sub">${esc(p.category)} · ${days} días</div>
      </div>
      <div class="cart-item-price">$${price(dynPrice)}</div>
      <button class="btn-remove" onclick="removeFromCart('${p.id}')" title="Quitar">✕</button>
    </div>`;
  }).join('');

  const remaining = balance - total;
  document.getElementById('summary-balance').textContent   = `$${price(balance)}`;
  document.getElementById('summary-total').textContent     = `$${price(total)}`;
  document.getElementById('summary-remaining').textContent = `$${price(Math.max(0, remaining))}`;

  const btn = document.getElementById('checkout-btn');
  if (balance < total) {
    btn.textContent = 'Saldo insuficiente — contacta soporte';
    btn.disabled = true;
  } else {
    btn.textContent = 'Confirmar compra';
    btn.disabled = false;
  }
}

async function doCheckout() {
  const items   = cart.map(c => allProducts.find(p => p.id === c.id)).filter(Boolean);
  const total   = items.reduce((s, p) => s + calcPrice(p), 0);
  const balance = parseFloat(currentWallet?.balance || 0);

  if (balance < total) return toast('Saldo insuficiente', 'error');

  const btn = document.getElementById('checkout-btn');
  btn.disabled = true; btn.textContent = 'Procesando…';

  try {
    // Procesar compra via RPC segura — precio y descuento ocurren en la base de datos
    const productIds = items.map(p => p.id);
    const { data, error } = await db.rpc('process_purchase', { p_product_ids: productIds });
    if (error) throw error;

    // Actualizar saldo local con el total real devuelto por la RPC
    const totalReal = parseFloat(data?.total || total);
    currentWallet.balance = balance - totalReal;
    syncBalanceUI();

    // Mostrar credenciales (si las tiene)
    const accounts = items.filter(p => p.account_data).map(p => ({ name: p.name, data: p.account_data }));
    const accountsHTML = accounts.length
      ? accounts.map(a => `<b>${esc(a.name)}</b><code>${esc(a.data)}</code>`).join('')
      : `<p>Recibirás los datos de acceso por WhatsApp. Si tienes dudas, contáctanos.</p>`;

    cart = []; saveCart(); syncCartCount();
    invalidateHistoryCache();
    showModal('¡Compra exitosa! 🎉', accountsHTML);
    renderCart();
  } catch (err) {
    console.error(err);
    toast(err.message || 'Error al procesar. Intenta de nuevo.', 'error');
    btn.disabled = false; btn.textContent = 'Confirmar compra';
  }
}

// ══════════════════════════════════════════════════
//  ADMIN — PRODUCTOS
// ══════════════════════════════════════════════════
async function loadAdminProducts() {
  if (!currentProfile?.is_admin) return;
  const { data, error } = await db.from('accounts').select('*').order('expires_at', { ascending: true });

  // Fallback to products table if accounts doesn't exist yet
  if (error) {
    const { data: fallback } = await db.from('products').select('*').order('created_at', { ascending: false });
    renderAdminProductsList(fallback || [], true);
    return;
  }
  renderAdminProductsList(data || [], false);
}

function renderAdminProductsList(data, legacy) {
  const el = document.getElementById('admin-products-list');
  if (!data?.length) { el.innerHTML = '<div class="no-items">Sin cuentas aún</div>'; return; }

  el.innerHTML = data.map(p => {
    const days = legacy ? (p.duration_days || 30) : daysRemaining(p.expires_at);
    const dynPrice = legacy ? parseFloat(p.price) : calcPrice(p.base_price, p.expires_at);
    const pct = legacy ? 100 : daysPercent(days);
    const barColor = pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444';
    const expiryStr = legacy ? `${days}d` : `${daysLabel(days)} restantes`;
    return `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-name">${CAT_EMOJI[p.category]||'⭐'} ${esc(p.name)} — <span style="color:${barColor}">$${price(dynPrice)}</span></div>
        <div class="admin-item-meta">${esc(p.category)} · ${expiryStr} · ${p.is_active ? '✅ Activo' : '❌ Inactivo'}</div>
        <div style="margin-top:4px;height:4px;background:#eee;border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${barColor};border-radius:2px;transition:width 0.4s"></div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-toggle" onclick="toggleProduct('${p.id}', ${p.is_active}, ${legacy})">
          ${p.is_active ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>`;
  }).join('');
}

async function toggleProduct(id, active, legacy = false) {
  const table = legacy ? 'products' : 'accounts';
  await db.from(table).update({ is_active: !active }).eq('id', id);
  loadAdminProducts(); loadProducts();
}

async function addProduct() {
  const name     = val('ap-name');
  const category = val('ap-category');
  const service  = val('ap-service') || null;
  const desc     = val('ap-desc');
  const prc      = parseFloat(document.getElementById('ap-price').value);
  const expires  = document.getElementById('ap-expires').value;
  const account  = val('ap-account');

  if (!name || !category || !prc) return setMsg('ap-msg', 'Nombre, categoría y precio son requeridos', 'error');
  if (!expires) return setMsg('ap-msg', 'La fecha de expiración es requerida', 'error');

  const expiresISO = new Date(expires).toISOString();

  const { error } = await db.from('accounts').insert({
    name, category, service, description: desc,
    base_price: prc, expires_at: expiresISO,
    account_data: account, is_active: true
  });

  if (error) return setMsg('ap-msg', 'Error al guardar: ' + error.message, 'error');

  setMsg('ap-msg', '¡Cuenta agregada! ✓', 'success');
  ['ap-name','ap-desc','ap-account'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('ap-price').value = '';
  document.getElementById('ap-expires').value = '';
  loadProducts(); loadAdminProducts();
}

// ══════════════════════════════════════════════════
//  ADMIN — USUARIOS
// ══════════════════════════════════════════════════
async function loadAdminUsers() {
  if (!currentProfile?.is_admin) return;
  const { data } = await db.from('profiles').select('*, wallets(balance)').order('created_at', { ascending: false });
  const el = document.getElementById('admin-users-list');

  if (!data?.length) { el.innerHTML = '<div class="no-items">Sin usuarios aún</div>'; return; }

  el.innerHTML = data.map(u => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-name">${u.username ? '@' + esc(u.username) : esc(u.email)}${u.is_admin ? ' 👑' : ''}</div>
        <div class="admin-item-meta">${esc(u.email || '')} · Saldo: $${price(u.wallets?.balance || 0)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-credit" onclick="openCreditModal('${u.id}', '${esc(u.username ? '@' + u.username : u.email)}')">
          + Crédito
        </button>
      </div>
    </div>`
  ).join('');
}

function openCreditModal(userId, userName) {
  showModal(`Agregar crédito a ${userName}`,
    `<input type="number" id="credit-amount" placeholder="Monto en MXN" class="input" step="0.01" min="0.01">
     <input type="text"   id="credit-note"   placeholder="Nota (ej: Pago WA #12)" class="input">
     <button class="btn-primary" onclick="addCredit('${userId}')">Confirmar</button>`
  );
}

async function addCredit(userId) {
  const amount = parseFloat(document.getElementById('credit-amount')?.value || 0);
  const note   = (document.getElementById('credit-note')?.value || '').trim();

  if (!amount || amount <= 0) return toast('Monto inválido', 'error');

  const btn = document.querySelector('#modal-content .btn-primary');
  if (btn) { btn.disabled = true; btn.textContent = 'Guardando...'; }

  const { data, error } = await db.rpc('admin_add_credit', {
    p_user_id: userId,
    p_amount:  amount,
    p_note:    note,
  });

  if (btn) { btn.disabled = false; btn.textContent = 'Confirmar'; }

  if (error || data?.error) {
    toast(data?.error || 'Error al agregar crédito', 'error');
    return;
  }

  // Si es el usuario actual, actualizar saldo en UI
  if (userId === currentUser?.id && data?.balance !== undefined) {
    currentWallet.balance = data.balance;
    syncBalanceUI();
  }

  closeModal();
  toast(`+$${amount.toFixed(2)} MXN agregado ✓`, 'success');
  loadAdminUsers();
}

// ══════════════════════════════════════════════════
//  UI HELPERS
// ══════════════════════════════════════════════════
function moveBottomSlider(name, instant = false) {
  // El slider se posiciona por CSS según el botón con clase .active
  // No se necesita JS aquí
}

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
  document.querySelectorAll('.bottom-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.bottom-btn[data-view="${name}"]`)?.classList.add('active');
  document.getElementById('navbar').style.display = '';
  moveBottomSlider(name);
  sessionStorage.setItem('solaris_view', name);
  if (name === 'cart') renderCart();
  if (name === 'account') {
    initTicker();
    // Disparar animación pendiente de transfer/recarga si la hay
    if (_pendingNotif) {
      const fn = _pendingNotif;
      _pendingNotif = null;
      fn();
    }
  }
  if (name === 'catalog') {
    document.querySelector('.store-layout')?.classList.remove('hidden');
    document.getElementById('products-panel')?.classList.add('hidden');
    currentCat = 'all';
  }
  // Píldora: ocultar en Cuenta, mostrar en el resto
  const pill = document.getElementById('nav-balance-pill');
  if (pill && currentWallet) {
    if (name === 'account') {
      pill.classList.add('pill-hide');
      setTimeout(() => {
        pill.classList.add('hidden');
        pill.classList.remove('pill-hide');
      }, 220);
    } else {
      pill.classList.remove('hidden');
      pill.classList.remove('pill-hide');
    }
  }
}

function showAuthView() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-auth').classList.add('active');
  document.getElementById('navbar').style.display = 'none';
  // One Tap desactivado — se usa solo el botón OAuth manual
}

function switchTab(tabsSelector, contentsSelector, tabId, prefix = '') {
  document.querySelectorAll(`${tabsSelector} .tab-btn`).forEach(b => b.classList.remove('active'));
  document.querySelector(`${tabsSelector} .tab-btn[data-tab="${tabId}"], ${tabsSelector} .tab-btn[data-admin-tab="${tabId}"]`)
    ?.classList.add('active');
  document.querySelectorAll(contentsSelector).forEach(c => c.classList.remove('active'));
  document.getElementById(`${prefix}${tabId}`)?.classList.add('active');
}

function showModal(title, html) {
  document.getElementById('modal-content').innerHTML = `<h3>${title}</h3>${html}`;
  document.getElementById('modal').classList.remove('hidden');
}
function closeModal() { document.getElementById('modal').classList.add('hidden'); }

let _toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = ''; }, 3000);
}


// ══════════════════════════════════════════════════
//  NOTIFICACIÓN DE MOVIMIENTO — tarjeta de saldo
// ══════════════════════════════════════════════════
let _notifTimer = null;

/**
 * Muestra una notificación en la tarjeta dorada.
 * type: 'in' | 'out' | 'pending'
 * Llamar con datos reales cuando llegue Mercado Pago.
 */
// SVG icons for card notifications
const _notifSVGs = {
  out: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
  in:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
  pending: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
};

const NOTIF_DURATION = 35000;
const _notifStateKey = () => `solaris_notif_${currentUser?.id}`;

function showCardNotif(type, amount, label, onComplete) {
  const el   = document.getElementById('acct-notif');
  const icon = document.getElementById('acct-notif-icon');
  const text = document.getElementById('acct-notif-text');
  if (!el) return;

  el._onComplete = onComplete || null;

  const fmt = `$${parseFloat(amount).toFixed(2)}`;

  let phase1, phase2, colorClass, iconSvg;

  if (type === 'in') {
    iconSvg = _notifSVGs.in;
    colorClass = 'notif-color-in';
    phase1 = `Procesando pago...`;
    phase2 = `Recibiendo <span class="notif-amt">${fmt}</span>${label ? ' de ' + label : ''}`;
  } else if (type === 'out') {
    iconSvg = _notifSVGs.out;
    colorClass = 'notif-color-out';
    phase1 = `Procesando transferencia...`;
    const dest = label ? label.replace(/^Enviado a /, '') : '';
    phase2 = `Enviando <span class="notif-amt">${fmt}</span>${dest ? ' a ' + dest : ''}`;
  } else if (type === 'pending') {
    iconSvg = _notifSVGs.pending;
    colorClass = 'notif-color-pending';
    phase1 = `Procesando pago...`;
    phase2 = `<span class="notif-amt">+${fmt}</span> · Se acreditará en breve`;
  }

  // Persistir en localStorage para sobrevivir recargas
  const startedAt = Date.now();
  try {
    localStorage.setItem(_notifStateKey(), JSON.stringify({
      type, amount, label, startedAt,
      hasCallback: !!onComplete
    }));
  } catch {}

  _startNotifAnimation({ el, icon, text, iconSvg, colorClass, phase1, phase2, startedAt, elapsed: 0 });
}

function _startNotifAnimation({ el, icon, text, iconSvg, colorClass, phase1, phase2, startedAt, elapsed }) {
  icon.innerHTML = iconSvg;
  icon.className = `acct-notif-icon ${colorClass}`;

  clearTimeout(_notifTimer);
  if (el._cycleInterval) { clearInterval(el._cycleInterval); el._cycleInterval = null; }

  const phases = [phase1, phase2];
  const remaining = NOTIF_DURATION - elapsed;

  // Calcular en qué fase estamos según el tiempo transcurrido
  let currentPhase = Math.floor(elapsed / 3000) % 2;

  function setPhase(p) {
    text.classList.remove('notif-text-visible');
    text.classList.add('notif-text-exit');
    setTimeout(() => {
      text.innerHTML = `<span class="notif-shimmer">${phases[p]}</span>`;
      text.classList.remove('notif-text-exit');
      text.classList.add('notif-text-enter');
      void text.offsetWidth;
      text.classList.add('notif-text-visible');
    }, 280);
  }

  // Mostrar la fase correcta inmediatamente
  text.innerHTML = `<span class="notif-shimmer">${phases[currentPhase]}</span>`;
  text.className = 'acct-notif-text notif-text-enter notif-text-visible';

  el.className = `acct-notif ${colorClass} notif-enter`;
  void el.offsetWidth;
  el.classList.add('notif-visible');

  // Tiempo hasta el siguiente cambio de fase
  const timeInCurrentPhase = elapsed % 3000;
  const msUntilNextPhase = 3000 - timeInCurrentPhase;

  setTimeout(() => {
    currentPhase = (currentPhase + 1) % 2;
    setPhase(currentPhase);
    el._cycleInterval = setInterval(() => {
      currentPhase = (currentPhase + 1) % 2;
      setPhase(currentPhase);
    }, 3000);
  }, msUntilNextPhase);

  // Ocultar al terminar el tiempo restante
  _notifTimer = setTimeout(() => {
    if (el._cycleInterval) { clearInterval(el._cycleInterval); el._cycleInterval = null; }
    try { localStorage.removeItem(_notifStateKey()); } catch {}
    el.classList.remove('notif-visible');
    el.classList.add('notif-exit');
    setTimeout(() => {
      el.className = 'acct-notif';
      text.className = 'acct-notif-text';
      if (typeof el._onComplete === 'function') {
        el._onComplete();
        el._onComplete = null;
      }
    }, 450);
  }, remaining);
}

// Llamar esto al entrar a la vista account — reanuda si hay animación activa
function _resumeNotifIfActive(onComplete) {
  try {
    const raw = localStorage.getItem(_notifStateKey());
    if (!raw) return false;
    const state = JSON.parse(raw);
    const elapsed = Date.now() - state.startedAt;
    if (elapsed >= NOTIF_DURATION) {
      localStorage.removeItem(_notifStateKey());
      return false;
    }

    const el   = document.getElementById('acct-notif');
    const icon = document.getElementById('acct-notif-icon');
    const text = document.getElementById('acct-notif-text');
    if (!el) return false;

    const fmt = `$${parseFloat(state.amount).toFixed(2)}`;
    let phase1, phase2, colorClass, iconSvg;

    if (state.type === 'in') {
      iconSvg = _notifSVGs.in; colorClass = 'notif-color-in';
      phase1 = `Procesando pago...`;
      phase2 = `Recibiendo <span class="notif-amt">${fmt}</span>${state.label ? ' de ' + state.label : ''}`;
    } else if (state.type === 'out') {
      iconSvg = _notifSVGs.out; colorClass = 'notif-color-out';
      phase1 = `Procesando transferencia...`;
      const dest = state.label ? state.label.replace(/^Enviado a /, '') : '';
      phase2 = `Enviando <span class="notif-amt">${fmt}</span>${dest ? ' a ' + dest : ''}`;
    } else if (state.type === 'pending') {
      iconSvg = _notifSVGs.pending; colorClass = 'notif-color-pending';
      phase1 = `Procesando pago...`;
      phase2 = `<span class="notif-amt">+${fmt}</span> · Se acreditará en breve`;
    }

    el._onComplete = state.hasCallback ? onComplete : null;
    _startNotifAnimation({ el, icon, text, iconSvg, colorClass, phase1, phase2,
      startedAt: state.startedAt, elapsed });
    return true;
  } catch { return false; }
}

// TODO: cuando integres Mercado Pago, llama así al confirmar pago:
// showCardNotif('pending', monto, 'Recarga');
// Y cuando el webhook confirme:
// showCardNotif('in', monto, 'Recarga');

function initTicker() {
  // Reservado para datos reales — no muestra nada hasta que haya un movimiento real
}

function syncBalanceUI() {
  const bal = price(currentWallet?.balance || 0);
  document.getElementById('balance-amount').textContent = bal;
  // Actualizar píldora del navbar
  const pill = document.getElementById('nav-balance-pill');
  const pillAmt = document.getElementById('nav-pill-amount');
  if (pill) pill.classList.remove('hidden');
  if (pillAmt) pillAmt.textContent = '$' + bal;
  const transferBtn = document.getElementById('acct-transfer-trigger');
  if (transferBtn) {
    const hasBalance = parseFloat(currentWallet?.balance || 0) > 0;
    transferBtn.classList.toggle('frozen', !hasBalance);
    transferBtn.title = hasBalance ? 'Transferir balance' : 'Sin balance para transferir';
  }
}
function syncCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

// ─── Tiny utils ────────────────────────────────
function val(id)         { return document.getElementById(id)?.value.trim() || ''; }
function price(n)        { return parseFloat(n||0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function esc(str)        { return String(str||'').replace(/[<>"'&]/g,c=>({'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','&':'&amp;'}[c])); }
function sleep(ms)       { return new Promise(r => setTimeout(r, ms)); }
function fadeOut(el)     { el.style.cssText += 'opacity:0;transition:opacity 0.4s'; }
function setBtn(id, txt) { const b = document.getElementById(id); if(b){ b.textContent=txt; b.disabled=txt!=='Entrar'&&txt!=='Crear cuenta'; } }
function setMsg(id, msg, type) { const el = document.getElementById(id); if(el){ el.textContent=msg; el.className=`auth-msg ${type}`; } }
function clearMsg(id)          { setMsg(id, '', ''); }

function friendlyError(msg) {
  if (msg.includes('Invalid login')) return 'Correo o contraseña incorrectos';
  if (msg.includes('Email not confirmed')) return 'Confirma tu correo antes de entrar';
  if (msg.includes('User already registered')) return 'Este correo ya está registrado';
  return msg;
}

// ─── Logo pulse on card tap (no scroll rotation) ───
(function () {
  let pulsing = false;

  const logoSvg = () => document.querySelector('.nav-logo svg');

  function triggerPulse() {
    const el = logoSvg();
    if (!el || pulsing) return;
    pulsing = true;
    el.classList.remove('logo-pulse');
    void el.offsetWidth;
    el.classList.add('logo-pulse');
    setTimeout(() => {
      el.classList.remove('logo-pulse');
      pulsing = false;
    }, 460);
  }

  // Expose for card tap usage
  window._triggerLogoPulse = triggerPulse;
})();

// ─── SOLARIS wave animation every 17s ───────────────
(function () {
  const INTERVAL_MS = 17000;
  const LETTER_DELAY = 140; // ms between each letter — smooth wave flow

  function runWave() {
    const letters = document.querySelectorAll('.solaris-brand span');
    if (!letters.length) return;
    letters.forEach((span, i) => {
      setTimeout(() => {
        span.classList.remove('wave-pop');
        void span.offsetWidth;
        span.classList.add('wave-pop');
        setTimeout(() => span.classList.remove('wave-pop'), 400);
      }, i * LETTER_DELAY);
    });
  }

  // Start after a short initial delay, then every 17s
  setTimeout(() => {
    runWave();
    setInterval(runWave, INTERVAL_MS);
  }, 3000);
})();


// ══════════════════════════════════════════════════
//  VISTA CUENTA
// ══════════════════════════════════════════════════

let _usernameCheckTimer = null;
let _accountListenersInit = false;

function renderAccountView() {
  // Registrar listeners una sola vez
  if (!_accountListenersInit) {
    initAccountListeners();
    _accountListenersInit = true;
  }
  // Balance
  const bal = parseFloat(currentWallet?.balance || 0).toFixed(2);
  document.getElementById('acct-balance-val').textContent = '$' + bal;

  // Perfil
  const username = currentProfile?.username || '';
  const email    = currentUser?.email || '';

  const uDisp  = document.getElementById('acct-username-display');
  const editBtn = document.getElementById('acct-edit-btn');
  if (username) {
    uDisp.innerHTML = '@' + username;
    uDisp.classList.remove('acct-username-placeholder');
    uDisp.onclick = null;
    // Mostrar botón editar solo cuando ya hay usuario configurado
    if (editBtn) editBtn.style.display = '';
  } else {
    uDisp.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Configurar usuario`;
    uDisp.classList.add('acct-username-placeholder');
    uDisp.onclick = () => {
      document.getElementById('acct-edit-form').classList.add('open');
      document.getElementById('acct-username-input')?.focus();
    };
    // Ocultar botón editar: el contorno "Configurar usuario" ya cumple esa función
    if (editBtn) editBtn.style.display = 'none';
  }

  const avatarEl = document.getElementById('acct-avatar-initials');
  avatarEl.textContent = (username[0] || email[0] || '?').toUpperCase();

  // Sincronizar estado del botón
  syncBalanceUI();

  // ── Historial tabs ──
  document.querySelectorAll('.acct-hist-tab').forEach(tab => {
    const t = _rebind(tab);
    t.addEventListener('click', () => {
      document.querySelectorAll('.acct-hist-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.querySelectorAll('.acct-hist-panel').forEach(p => p.classList.add('hidden'));
      const panel = document.getElementById('acct-hist-' + t.dataset.hist);
      if (panel) {
        panel.classList.remove('hidden', 'anim-in');
        void panel.offsetWidth; // fuerza reflow para reiniciar la animación
        panel.classList.add('anim-in');
      }
    });
  });

  loadAccountHistory();

  // Reanudar animación si se recargó dentro de los 35s
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      _resumeNotifIfActive();
    });
  });
}

// Reemplazar un elemento por clon para limpiar listeners
function _rebind(el) {
  const clone = el.cloneNode(true);
  el.parentNode.replaceChild(clone, el);
  return clone;
}
function _bindOnce(id, event, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  const fresh = _rebind(el);
  fresh.addEventListener(event, fn);
}

function initAccountListeners() {
  // ── Transferir toggle ──
  document.getElementById('acct-transfer-trigger')?.addEventListener('click', () => {
    if (!currentProfile?.username) {
      toast('Configura tu @usuario antes de transferir', 'error');
      document.getElementById('acct-edit-form').classList.add('open');
      document.getElementById('acct-edit-btn')?.classList.add('active');
      document.getElementById('acct-username-input')?.focus();
      return;
    }
    const panel = document.getElementById('acct-transfer-panel');
    const trigger = document.getElementById('acct-transfer-trigger');
    const isOpen = panel.classList.toggle('open');
    trigger.classList.toggle('active', isOpen);
    document.getElementById('acct-edit-form').classList.remove('open');
    document.getElementById('acct-edit-btn')?.classList.remove('active');
  });

  // ── STRIPE — México (MXN) ───────────────────────────────────
  const STRIPE_PK = 'pk_live_51TGAI3JweVr0KEoV8uHvCnWwwoORIsxKMSgglJJ5sO8W7LwCSqWswNdRhpDBkKN50a1HtIXukH3rdlTZhEuWMNWx00qEtUduFg';
  let _stripe          = null;
  let _stripeCard      = null;
  let _stripeElements  = null;
  let _depMethod       = 'card';   // 'card' | 'oxxo'
  let _depAmount       = 100;      // MXN

  const DEP_PRESETS = [50, 100, 200, 500];

  function getStripe() {
    if (!_stripe) _stripe = Stripe(STRIPE_PK);
    return _stripe;
  }

  // ── Mostrar modal de depósito ─────────────────────────────
  function showDepositModal() {
    _depMethod = 'card';
    _depAmount = 100;
    showModal('💰 Depositar saldo', _buildDepositHTML());
    setTimeout(() => {
      _setupDepositEvents();
      _mountCard();
    }, 50);
  }

  function _buildDepositHTML() {
    const presets = DEP_PRESETS.map(a =>
      `<button class="dep-amt-btn${a === _depAmount ? ' active' : ''}" data-amount="${a}">$${a}</button>`
    ).join('');

    return `<div class="dep-wrap">

      <!-- Tabs de método -->
      <div class="dep-tabs">
        <button class="dep-tab active" data-method="card">
          <div class="dep-tab-dot"></div>
          Tarjeta
        </button>
        <button class="dep-tab" data-method="oxxo">
          <div class="dep-tab-dot"></div>
          OXXO Pay
        </button>
      </div>

      <!-- Monto -->
      <div class="dep-amount-section">
        <span class="dep-section-label">Monto a depositar</span>
        <div class="dep-amounts">${presets}</div>
        <div class="dep-custom-wrap">
          <span class="dep-currency">$</span>
          <input id="dep-custom" type="number" min="20" max="50000"
            placeholder="Otro monto (mín. $20)" class="dep-custom-input"/>
          <span class="dep-currency-label">MXN</span>
        </div>
      </div>

      <!-- Panel método — altura fija para evitar saltos -->
      <div class="dep-panel">

        <!-- Tarjeta -->
        <div id="dep-card-section" class="dep-panel-inner dep-visible">
          <span class="dep-card-label">Datos de la tarjeta</span>
          <div id="dep-stripe-card"></div>
        </div>

        <!-- OXXO -->
        <div id="dep-oxxo-section" class="dep-panel-inner">
          <div class="dep-oxxo-box">
            <div class="dep-oxxo-row">
              <div class="dep-oxxo-num">1</div>
              <span>Confirma y genera tu <strong>cupón de pago</strong></span>
            </div>
            <div class="dep-oxxo-row">
              <div class="dep-oxxo-num">2</div>
              <span>Preséntalo en <strong>cualquier OXXO</strong> y paga en caja</span>
            </div>
            <div class="dep-oxxo-row">
              <div class="dep-oxxo-num">3</div>
              <span>Tu saldo se acredita en <strong>~1 hora</strong> automáticamente</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Error -->
      <div id="dep-error" class="dep-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span id="dep-error-text"></span>
      </div>

      <!-- Botón -->
      <button id="dep-pay-btn" class="dep-pay-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
        <span id="dep-pay-label">Pagar $100 MXN</span>
      </button>

      <!-- Seguridad -->
      <p class="dep-secure">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Pago seguro procesado por Stripe
      </p>

    </div>`;
  }

  function _setupDepositEvents() {
    // Tabs de método
    document.querySelectorAll('.dep-tab').forEach(tab =>
      tab.addEventListener('click', () => {
        document.querySelectorAll('.dep-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        _depMethod = tab.dataset.method;
        const isCard = _depMethod === 'card';

        const cardSec = document.getElementById('dep-card-section');
        const oxxoSec = document.getElementById('dep-oxxo-section');

        // Transición suave sin saltos
        if (isCard) {
          oxxoSec.classList.remove('dep-visible');
          setTimeout(() => {
            oxxoSec.style.display = 'none';
            cardSec.style.display = '';
            _mountCard();
            requestAnimationFrame(() => cardSec.classList.add('dep-visible'));
          }, 180);
        } else {
          cardSec.classList.remove('dep-visible');
          setTimeout(() => {
            cardSec.style.display = 'none';
            oxxoSec.style.display = '';
            requestAnimationFrame(() => oxxoSec.classList.add('dep-visible'));
          }, 180);
        }
        _updateDepBtn();
      })
    );

    // Montos preset
    document.querySelectorAll('.dep-amt-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        document.querySelectorAll('.dep-amt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _depAmount = parseInt(btn.dataset.amount);
        const custom = document.getElementById('dep-custom');
        if (custom) custom.value = '';
        _updateDepBtn();
      })
    );

    // Monto custom
    document.getElementById('dep-custom')?.addEventListener('input', e => {
      const v = parseFloat(e.target.value);
      document.querySelectorAll('.dep-amt-btn').forEach(b => b.classList.remove('active'));
      _depAmount = v >= 20 ? v : 0;
      _updateDepBtn();
    });

    document.getElementById('dep-pay-btn')?.addEventListener('click', _handlePay);
  }

  function _updateDepBtn() {
    const lbl = document.getElementById('dep-pay-label');
    if (!lbl) return;
    if (_depAmount >= 20) {
      const action = _depMethod === 'oxxo' ? 'Generar cupón OXXO' : 'Pagar';
      lbl.textContent = `${action} · $${_depAmount} MXN`;
    } else {
      lbl.textContent = 'Ingresa un monto válido';
    }
  }

  function _mountCard() {
    if (_stripeCard) {
      try { _stripeCard.unmount(); } catch {}
      _stripeCard = null; _stripeElements = null;
    }
    const el = document.getElementById('dep-stripe-card');
    if (!el) return;
    _stripeCard = getStripe().elements({ locale: 'es' }).create('card', {
      hidePostalCode: true,
      style: {
        base: {
          fontSize: '15px',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          color: '#1a1a2e',
          fontWeight: '500',
          letterSpacing: '0.01em',
          '::placeholder': { color: '#9ca3af' },
        },
        invalid: { color: '#dc2626', iconColor: '#dc2626' },
      }
    });
    _stripeCard.mount(el);
  }

  async function _handlePay() {
    if (!currentUser)      return toast('Inicia sesión primero', 'error');
    if (_depAmount < 20)   return toast('Monto mínimo: $20 MXN', 'error');

    const btn   = document.getElementById('dep-pay-btn');
    const errEl = document.getElementById('dep-error');
    btn.disabled = true;
    btn.innerHTML = '<span class="dep-spinner"></span> Procesando...';
    errEl.style.display = 'none';

    try {
      // 1. Crear PaymentIntent en Supabase Edge Function
      const controller = new AbortController();
      const timeoutId  = setTimeout(() => controller.abort(), 12000);

      let res;
      try {
        res = await fetch(`${SUPABASE_URL}/functions/v1/create-payment`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            amount:  _depAmount,
            method:  _depMethod,
            user_id: currentUser.id,
            email:   currentUser.email,
          }),
        });
      } catch (fetchErr) {
        if (fetchErr.name === 'AbortError') throw new Error('Sin respuesta del servidor — verifica tu conexión e intenta de nuevo.');
        throw new Error('Error de conexión — intenta de nuevo.');
      } finally {
        clearTimeout(timeoutId);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const stripe = getStripe();

      if (_depMethod === 'card') {
        // 2a. Pago con tarjeta
        const { error, paymentIntent } = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: { card: _stripeCard }
        });
        if (error) throw new Error(error.message);
        if (paymentIntent.status === 'succeeded') {
          closeModal();
          showCardNotif('pending', _depAmount, 'Depósito');
          toast('✅ ¡Pago recibido! Tu saldo se acreditará en breve.', 'success');
          setTimeout(() => fetchWallet(currentUser.id).then(w => {
            if (w) { currentWallet = w; syncBalanceUI(); }
          }), 4000);
        }

      } else {
        // 2b. OXXO — genera cupón y muestra en pantalla
        const { error, paymentIntent } = await stripe.confirmOxxoPayment(data.client_secret, {
          payment_method: {
            billing_details: {
              name: (() => {
                const first = (currentProfile?.first_name || '').trim();
                const last  = (currentProfile?.last_name  || '').trim();
                if (first.length >= 2 && last.length >= 2) return `${first} ${last}`;
                const raw = (currentProfile?.username || '').trim();
                if (raw.length >= 2) return `${raw} MX`;
                return 'Cliente Solaris';
              })(),
              email: currentUser.email,
            }
          }
        });
        if (error && error.type !== 'payment_intent_unexpected_state') {
          throw new Error(error.message);
        }

        // Obtener URL del voucher desde el paymentIntent
        const voucherUrl = paymentIntent?.next_action?.oxxo_display_details?.hosted_voucher_url || null;

        closeModal();
        _showOxxoVoucher(_depAmount, voucherUrl);
      }

    } catch (err) {
      const errText = document.getElementById('dep-error-text');
      if (errText) errText.textContent = err.message || 'Error al procesar el pago';
      errEl.style.display = 'flex';
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg><span id="dep-pay-label">Pagar $${_depAmount} MXN</span>`;
    }
  }

  function _showOxxoVoucher(amount, voucherUrl) {
    const html = `<div class="oxxo-voucher-wrap">
      <div class="oxxo-voucher-icon">🏪</div>
      <p class="oxxo-voucher-title">¡Cupón generado!</p>
      <p class="oxxo-voucher-sub">Paga <strong>$${amount} MXN</strong> en cualquier OXXO antes de <strong>3 días</strong>.<br>Tu saldo se acreditará en ~1 hora tras el pago.</p>
      ${voucherUrl
        ? `<a href="${voucherUrl}" target="_blank" rel="noopener" class="oxxo-voucher-btn">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
             Ver cupón de pago
           </a>`
        : `<p class="oxxo-voucher-email">El cupón fue enviado a <strong>${currentUser?.email || 'tu correo'}</strong>.</p>`
      }
      <p class="oxxo-voucher-note">También recibirás el cupón por correo electrónico.</p>
      <button class="oxxo-voucher-close" onclick="closeModal()">Entendido</button>
    </div>`;
    showModal('Pago OXXO', html);
  }

  document.getElementById('acct-deposit-btn')?.addEventListener('click', showDepositModal);
  document.getElementById('nav-deposit-btn')?.addEventListener('click', showDepositModal);

  document.getElementById('tr-cancel-btn')?.addEventListener('click', () => {
    document.getElementById('acct-transfer-panel').classList.remove('open');
    document.getElementById('acct-transfer-trigger')?.classList.remove('active');
    document.getElementById('tr-username').value = '';
    document.getElementById('tr-amount').value   = '';
    document.getElementById('tr-user-feedback').textContent = '';
    document.getElementById('tr-user-feedback').className = 'acct-user-feedback';
  });

  document.getElementById('tr-username')?.addEventListener('input', () => {
    const fb    = document.getElementById('tr-user-feedback');
    const input = document.getElementById('tr-username');

    // Strip @ silenciosamente si el usuario lo escribe
    if (input.value.startsWith('@')) {
      const cursor = input.selectionStart;
      input.value = input.value.replace(/^@+/, '');
      input.setSelectionRange(Math.max(0, cursor - 1), Math.max(0, cursor - 1));
    }

    const val = input.value.trim().toLowerCase();
    clearTimeout(_usernameCheckTimer);

    // Campo vacío → limpiar feedback
    if (!val) { fb.textContent = ''; fb.className = 'acct-user-feedback'; return; }

    // Validación local ANTES de tocar la red
    if (!/^[a-z0-9._]{1,20}$/.test(val)) {
      fb.textContent = 'Solo letras, números, puntos y _';
      fb.className = 'acct-user-feedback error';
      return;
    }

    fb.textContent = 'Buscando...';
    fb.className = 'acct-user-feedback checking';
    _usernameCheckTimer = setTimeout(() => checkTransferUser(val, fb), 500);
  });

  document.getElementById('tr-send-btn')?.addEventListener('click', doTransfer);

  // ── Edit perfil toggle ──
  document.getElementById('acct-edit-btn')?.addEventListener('click', () => {
    const form    = document.getElementById('acct-edit-form');
    const editBtn = document.getElementById('acct-edit-btn');
    const isOpen  = form.classList.toggle('open');
    editBtn.classList.toggle('active', isOpen);
    if (isOpen) {
      document.getElementById('acct-username-input').value = currentProfile?.username || '';
      document.getElementById('acct-username-feedback').textContent = '';
      document.getElementById('acct-transfer-panel').classList.remove('open');
      document.getElementById('acct-transfer-trigger')?.classList.remove('active');
    }
  });

  document.getElementById('acct-cancel-name')?.addEventListener('click', () => {
    document.getElementById('acct-edit-form').classList.remove('open');
    document.getElementById('acct-edit-btn')?.classList.remove('active');
  });

  document.getElementById('acct-username-input')?.addEventListener('input', () => {
    const fb  = document.getElementById('acct-username-feedback');
    const val = document.getElementById('acct-username-input').value.trim().toLowerCase();
    clearTimeout(_usernameCheckTimer);
    if (!val) { fb.textContent = ''; fb.className = 'acct-user-feedback'; return; }
    if (val === (currentProfile?.username || '').toLowerCase()) {
      fb.textContent = 'Ese es tu username actual';
      fb.className = 'acct-user-feedback ok';
      return;
    }
    if (!/^[a-z0-9._]{3,20}$/.test(val)) {
      fb.textContent = 'Solo letras, números, puntos y _ (3-20 caracteres)';
      fb.className = 'acct-user-feedback error';
      return;
    }
    fb.textContent = 'Verificando...';
    fb.className = 'acct-user-feedback checking';
    _usernameCheckTimer = setTimeout(() => checkUsernameAvailable(val, fb), 500);
  });

  document.getElementById('acct-save-name')?.addEventListener('click', doSaveProfile);
}

async function checkTransferUser(username, fb) {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 6000)
    );
    const res = await Promise.race([
      db.rpc('check_username', { p_username: username }),
      timeout,
    ]);

    if (!res.data) {
      fb.textContent = 'Error buscando usuario';
      fb.className = 'acct-user-feedback error';
      return;
    }

    if (res.data.reason === 'formato_invalido') {
      fb.textContent = 'Usuario inválido';
      fb.className = 'acct-user-feedback error';
    } else if (res.data.available === false) {
      fb.textContent = '✓ Usuario encontrado';
      fb.className = 'acct-user-feedback ok';
    } else {
      fb.textContent = 'Usuario no encontrado';
      fb.className = 'acct-user-feedback error';
    }
  } catch (err) {
    fb.textContent = err.message === 'timeout' ? 'Sin respuesta — verifica tu conexión' : 'Error buscando usuario';
    fb.className = 'acct-user-feedback error';
  }
}

async function checkUsernameAvailable(username, fb) {
  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 6000)
    );
    const res = await Promise.race([
      db.rpc('check_username', { p_username: username }),
      timeout,
    ]);

    if (!res.data) {
      fb.textContent = 'Error verificando';
      fb.className = 'acct-user-feedback error';
      return;
    }

    if (res.data.reason === 'formato_invalido') {
      fb.textContent = 'Formato inválido';
      fb.className = 'acct-user-feedback error';
    } else if (res.data.available) {
      fb.textContent = '✓ Disponible';
      fb.className = 'acct-user-feedback ok';
    } else {
      fb.textContent = 'Ya está en uso';
      fb.className = 'acct-user-feedback error';
    }
  } catch (err) {
    fb.textContent = err.message === 'timeout' ? 'Sin respuesta — verifica tu conexión' : 'Error verificando';
    fb.className = 'acct-user-feedback error';
  }
}

async function doTransfer() {
  const btn      = document.getElementById('tr-send-btn');
  const username = document.getElementById('tr-username').value.trim().toLowerCase();
  const amount   = parseFloat(document.getElementById('tr-amount').value);
  const fb       = document.getElementById('tr-user-feedback');

  if (!username) { toast('Escribe el usuario destino', 'error'); return; }
  if (!amount || amount <= 0) { toast('Escribe un monto válido', 'error'); return; }
  if (amount > parseFloat(currentWallet?.balance || 0)) {
    toast('Saldo insuficiente', 'error'); return;
  }

  btn.disabled = true; btn.textContent = 'Enviando...';
  const { data, error } = await db.rpc('transfer_balance', {
    p_to_username: username,
    p_amount:      amount
  });
  btn.disabled = false; btn.textContent = 'Enviar';

  if (error || !data?.ok) {
    const msg = data?.error || error?.message || 'Error en la transferencia';
    toast(msg, 'error');
    fb.textContent = msg;
    fb.className = 'acct-user-feedback error';
    return;
  }

  // Actualizar balance local
  currentWallet.balance = data.balance;
  syncBalanceUI();
  invalidateHistoryCache();

  // Limpiar panel
  document.getElementById('acct-transfer-panel').classList.remove('open');
  document.getElementById('acct-transfer-trigger')?.classList.remove('active');
  document.getElementById('tr-username').value = '';
  document.getElementById('tr-amount').value   = '';
  fb.textContent = ''; fb.className = 'acct-user-feedback';

  renderAccountView();

  // Asegurar que la vista account esté visible antes de animar la tarjeta.
  // El #acct-notif vive dentro de .view que es display:none cuando no está activa,
  // y las transiciones CSS no funcionan en elementos ocultos.
  showView('account');

  // Dos rAF: primero el browser aplica display, segundo ya puede calcular layout
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Notificación en tarjeta — showTransferSuccess se dispara al terminar los 35s
      showCardNotif('out', amount, `Enviado a @${username}`, () => {
        showTransferSuccess(amount, username);
      });
    });
  });
}

function showTransferSuccess(amount, username) {
  const overlay = document.createElement('div');
  overlay.className = 'transfer-success-overlay';
  overlay.innerHTML = `
    <div class="transfer-success-card">
      <div class="transfer-success-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="transfer-success-title">¡Transferencia exitosa!</div>
      <div class="transfer-success-amount">$${parseFloat(amount).toFixed(2)}</div>
      <div class="transfer-success-to">enviado a @${username}</div>
      <button class="transfer-success-btn" onclick="this.closest('.transfer-success-overlay').remove()">
        Listo
      </button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Auto-cerrar si no toca nada en 6 segundos
  setTimeout(() => overlay.remove(), 6000);
}

async function doSaveProfile() {
  const btn     = document.getElementById('acct-save-name');
  const newUser = document.getElementById('acct-username-input').value.trim().toLowerCase();
  const fb      = document.getElementById('acct-username-feedback');

  if (!newUser) { toast('Escribe un username', 'error'); return; }

  // Validar formato siempre
  if (!/^[a-z0-9._]{3,20}$/.test(newUser)) {
    toast('Solo letras, números, puntos y _ (3-20 caracteres)', 'error'); return;
  }

  // Solo verificar disponibilidad si el username cambió
  const currentUsername = (currentProfile?.username || '').toLowerCase();
  if (newUser !== currentUsername) {
    // Verificar cooldown de 7 días
    if (currentProfile?.username_changed_at) {
      const lastChange = new Date(currentProfile.username_changed_at);
      const daysSince  = (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        const daysLeft = Math.ceil(7 - daysSince);
        const fb = document.getElementById('acct-username-feedback');
        if (fb) {
          fb.textContent = `⏳ Puedes cambiarlo 1 vez cada 7 días (faltan ${daysLeft} día${daysLeft !== 1 ? 's' : ''})`;
          fb.className = 'acct-user-feedback error';
        }
        return;
      }
    }
    const check = await db.rpc('check_username', { p_username: newUser });
    if (check.error) { toast('Error al verificar username', 'error'); return; }
    if (!check.data?.available) {
      fb.textContent = 'Ya está en uso, elige otro';
      fb.className = 'acct-user-feedback error';
      return;
    }
  }

  btn.disabled = true; btn.textContent = 'Guardando...';
  const updatePayload = { username: newUser };
  if (newUser !== currentUsername) updatePayload.username_changed_at = new Date().toISOString();

  const { error } = await db.from('profiles')
    .update(updatePayload)
    .eq('id', currentUser.id);

  btn.disabled = false; btn.textContent = 'Guardar';

  if (error) {
    const msg = error.message?.includes('idx_profiles_username')
      ? 'Ese username ya está en uso'
      : (error.message || 'Error al guardar');
    toast(msg, 'error');
    fb.textContent = msg; fb.className = 'acct-user-feedback error';
    return;
  }

  currentProfile.username = newUser;
  if (updatePayload.username_changed_at) currentProfile.username_changed_at = updatePayload.username_changed_at;
  toast('Username actualizado ✓');
  document.getElementById('acct-edit-form').classList.remove('open');
    document.getElementById('acct-edit-btn')?.classList.remove('active');
  renderAccountView();
}




// ─── Historia: SVG icons por tipo ──────────────────
function histIcon(type) {
  const icons = {
    compra: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/>
    </svg>`,
    topup: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>`,
    transfer_in: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/>
      <polyline points="5 12 12 19 19 12"/>
    </svg>`,
    transfer_out: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <polyline points="19 12 12 5 5 12"/>
    </svg>`,
  };
  return icons[type] || icons.topup;
}

function histIconClass(type) {
  if (type === 'compra')       return 'type-compra';
  if (type === 'topup')        return 'type-topup';
  if (type === 'transfer_in')  return 'type-in';
  if (type === 'transfer_out') return 'type-out';
  return 'type-topup';
}

function histAmountClass(type, amt) {
  if (type === 'transfer_out') return 'out';
  return amt >= 0 ? 'pos' : 'neg';
}
// ══════════════════════════════════════════════════
//  HISTORIAL — caché en memoria
//  La primera vez carga desde Supabase y guarda en _histCache.
//  Al volver a la vista (minimizar/restaurar) renderiza desde caché
//  instantáneamente — sin red, sin "Cargando..." perpetuo.
//  Solo se invalida cuando el usuario hace una compra (doCheckout).
// ══════════════════════════════════════════════════

function _renderHistory() {
  const comprasEl  = document.getElementById('acct-hist-compras');
  const recargasEl = document.getElementById('acct-hist-recargas');

  if (comprasEl) {
    const orders = _histCache.orders;
    if (orders === null) {
      comprasEl.innerHTML = '<div class="acct-hist-empty">Cargando...</div>';
    } else if (orders.length === 0) {
      comprasEl.innerHTML = '<div class="acct-hist-empty">Aún no has realizado compras.</div>';
    } else {
      comprasEl.innerHTML = orders.map(o => {
        const pname = o.products?.name || 'Producto';
        const amt   = parseFloat(o.amount_paid || o.products?.price || 0).toFixed(2);
        return `<div class="acct-hist-item">
          <div class="acct-hist-icon type-compra">${histIcon('compra')}</div>
          <div class="acct-hist-body">
            <div class="acct-hist-name">${esc(pname)}</div>
            <div class="acct-hist-date">${fmtDate(o.created_at)}</div>
          </div>
          <div class="acct-hist-amount neg">-$${amt}</div>
        </div>`;
      }).join('');
    }
  }

  if (recargasEl) {
    const movs = _histCache.movs;
    if (movs === null) {
      recargasEl.innerHTML = '<div class="acct-hist-empty">Cargando...</div>';
    } else if (movs.length === 0) {
      recargasEl.innerHTML = '<div class="acct-hist-empty">Sin movimientos registrados.</div>';
    } else {
      recargasEl.innerHTML = movs.map(m => {
        const amt  = parseFloat(m.amount || 0);
        const sign = m.type === 'transfer_out' ? '-' : (amt >= 0 ? '+' : '');
        const nota = m.note || (m.type === 'transfer_in' ? 'Recibido' : m.type === 'transfer_out' ? 'Enviado' : 'Recarga');
        return `<div class="acct-hist-item">
          <div class="acct-hist-icon ${histIconClass(m.type)}">${histIcon(m.type)}</div>
          <div class="acct-hist-body">
            <div class="acct-hist-name">${esc(nota)}</div>
            <div class="acct-hist-date">${fmtDate(m.created_at)}</div>
          </div>
          <div class="acct-hist-amount ${histAmountClass(m.type, amt)}">${sign}$${Math.abs(amt).toFixed(2)}</div>
        </div>`;
      }).join('');
    }
  }

}

async function loadAccountHistory() {
  if (!currentUser) return;

  // Si ya hay caché, renderizar al instante — sin tocar la red.
  if (_histCache.orders !== null && _histCache.movs !== null) {
    _renderHistory();
    return;
  }

  // Primera carga: ir a la red
  const uid = currentUser.id;

  const [ordersResult, movsResult] = await Promise.allSettled([
    db.from('orders')
      .select('*, products(name, price)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20),
    db.from('wallet_topups')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  if (ordersResult.status === 'fulfilled' && !ordersResult.value.error) {
    _histCache.orders = ordersResult.value.data || [];
  } else {
    _histCache.orders = [];
  }

  if (movsResult.status === 'fulfilled' && !movsResult.value.error) {
    const newMovs = movsResult.value.data || [];
    _histCache.movs = newMovs;
    _checkNewMovement(newMovs);
  } else {
    _histCache.movs = [];
  }

  _renderHistory();

  // Arrancar polling cada 8s para detectar transfers entrantes en tiempo real
  if (!_histPollInterval) {
    _histPollInterval = setInterval(_pollMovements, 8000);
  }
}

let _histPollInterval = null;

// Clave en localStorage para el último movimiento visto por este usuario
function _lastSeenKey() { return `solaris_last_mov_${currentUser?.id}`; }

async function _pollMovements() {
  if (!currentUser) return;

  // Solo pedir el registro más reciente — únicamente para saber si hubo cambio
  const { data, error } = await db.from('wallet_topups')
    .select('id, created_at, type, amount, note, balance')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return;

  const lastSeen = localStorage.getItem(_lastSeenKey()) || '';
  if (data.id === lastSeen) return; // Nada nuevo

  // Hay un movimiento nuevo — animar y refrescar historial completo
  _checkNewMovement([data]);

  const { data: full, error: err } = await db.from('wallet_topups')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending: false })
    .limit(20);
  if (!err && full) {
    _histCache.movs = full;
    _renderHistory();
  }
}

function _checkNewMovement(movs) {
  if (!movs?.length) return;
  const latest    = movs[0];
  const lastKey   = _lastSeenKey();
  const lastSeen  = localStorage.getItem(lastKey) || '';

  // Ya se mostró esta animación antes
  if (latest.id === lastSeen) return;

  // Marcar como visto ANTES de animar para evitar dobles
  localStorage.setItem(lastKey, latest.id);

  // Solo animar transfers entrantes y recargas — no las salientes
  if (latest.type !== 'transfer_in' && latest.type !== 'topup') return;

  // Si el movimiento tiene más de 5 minutos, no animar (ya es viejo)
  const age = Date.now() - new Date(latest.created_at).getTime();
  if (age > 5 * 60 * 1000) return;

  const pendingBalance = latest.balance ?? null;
  const rawNote = latest.note || '';
  const usernameMatch = rawNote.match(/@([\w.]+)/);
  const sender = usernameMatch ? '@' + usernameMatch[1] : null;
  const label = latest.type === 'transfer_in' ? sender : null;

  // Animar en la vista actual si es account, o al entrar a account
  function _triggerNotif() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showCardNotif('in', latest.amount, label, () => {
          if (pendingBalance !== null && currentWallet) {
            currentWallet.balance = pendingBalance;
          }
          syncBalanceUI();
        });
      });
    });
  }

  const currentView = sessionStorage.getItem('solaris_view');
  if (currentView === 'account') {
    _triggerNotif();
  } else {
    // Mostrar cuando el usuario entre a la vista account
    _pendingNotif = _triggerNotif;
  }
}

// Notif pendiente para disparar al entrar a account
let _pendingNotif = null;



// Llamar esto después de una compra para que el historial se refresque
function invalidateHistoryCache() {
  _histCache.orders = null;
  _histCache.movs   = null;
}

// ─── Al volver a la pestaña: renderizar desde caché sin red ────────
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (!currentUser) return;

  const saved = sessionStorage.getItem('solaris_view');
  if (saved) showView(saved);

  // Refrescar wallet silenciosamente — por si cambió en background
  fetchWallet(currentUser.id).then(w => {
    if (!w) return;
    currentWallet = w;
    syncBalanceUI();
    if (saved === 'account') renderAccountView();
  });
});


function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ══════════════════════════════════════════════════
//  SKELETON HELPERS
// ══════════════════════════════════════════════════
function showProductsSkeleton() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = Array(6).fill(`
    <div class="skel-product-card">
      <div class="skel skel-prod-emoji"></div>
      <div class="skel skel-prod-cat"></div>
      <div class="skel skel-prod-name"></div>
      <div class="skel skel-prod-price"></div>
    </div>`).join('');
}

// ── SWIPE ENTRE VISTAS: eliminado (conflicto con carrusel de tienda) ──
