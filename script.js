// ═══════════════════════════════════════════════
// SOLARIS — script.js
// ⚠️  Después de regenerar tus claves en Supabase,
//     actualiza SUPABASE_URL y SUPABASE_ANON_KEY
// ═══════════════════════════════════════════════

const SUPABASE_URL      = 'https://vwcwqljwojstyxfrvxcf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y3dxbGp3b2pzdHl4ZnJ2eGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzQ3NTYsImV4cCI6MjA5MDA1MDc1Nn0.uMyit3TrGq9VjKl9a_mMwafSUkepymU4Fax15ZmscmM';

// ⚠️ Reemplaza esto con tu Google Client ID (lo encuentras en Google Cloud Console)
const GOOGLE_CLIENT_ID  = 'GOOGLE_CLIENT_ID_PLACEHOLDER';

// ← Cambia esto por tu número de WhatsApp (con código de país, sin + ni espacios)
const WA_NUMBER = '521234567890';

// ─── Emojis por categoría ──────────────────────
const CAT_EMOJI = {
  Netflix:  '📺',
  HBO:      '🎬',
  Spotify:  '🎵',
  Internet: '📶',
  Office:   '💼',
  VPN:      '🔐',
  Otro:     '⭐',
};

// ─── Supabase client ───────────────────────────
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Google One Tap ────────────────────────────
// Callback global que Google llama cuando el usuario acepta el One Tap
window.handleOneTap = async (response) => {
  const { data, error } = await db.auth.signInWithIdToken({
    provider: 'google',
    token: response.credential,
  });
  if (error) {
    console.error('One Tap error:', error);
    setMsg('auth-msg', 'Error al iniciar sesión con Google', 'error');
  }
  // Si va bien, onAuthStateChange dispara SIGNED_IN automáticamente
};

function initOneTap() {
  if (!window.google?.accounts?.id) return;
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: window.handleOneTap,
    auto_select: true,
    cancel_on_tap_outside: false,
    context: 'signin',
  });
  google.accounts.id.prompt();
}

function cancelOneTap() {
  if (window.google?.accounts?.id) google.accounts.id.cancel();
}

// ─── State ─────────────────────────────────────
let currentUser    = null;
let currentProfile = null;
let currentWallet  = null;
let allProducts    = [];
let currentCat     = 'all';
let cart           = JSON.parse(localStorage.getItem('solaris_cart') || '[]');

// ══════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  // WhatsApp button
  const wa = Object.assign(document.createElement('a'), {
    href: `https://wa.me/${WA_NUMBER}`,
    target: '_blank',
    className: 'wa-float',
    title: 'Soporte por WhatsApp',
    textContent: '💬',
  });
  document.body.appendChild(wa);

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
});

// ══════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════
async function handleLogin(user) {
  cancelOneTap(); // cerrar el popup de One Tap si sigue visible
  currentUser    = user;
  currentProfile = await fetchProfile(user.id);
  currentWallet  = await fetchWallet(user.id);

  // Show authenticated UI
  ['nav-balance', 'nav-logout-btn', 'nav-cart-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );
  if (currentProfile?.is_admin)
    document.getElementById('nav-admin-btn').classList.remove('hidden');

  document.getElementById('bottom-nav').classList.remove('hidden');
  syncBalanceUI();
  syncCartCount();
  showView('catalog');
  loadProducts();
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
  currentUser = currentProfile = currentWallet = null;
  cart = []; saveCart();
  ['nav-balance','nav-logout-btn','nav-cart-btn','nav-admin-btn'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );
  document.getElementById('bottom-nav').classList.add('hidden');
  showAuthView();
}

async function fetchProfile(uid) {
  const { data } = await db.from('profiles').select('*').eq('id', uid).single();
  return data;
}
async function fetchWallet(uid) {
  const { data } = await db.from('wallets').select('*').eq('user_id', uid).single();
  return data;
}

// ══════════════════════════════════════════════════
//  EVENTS
// ══════════════════════════════════════════════════
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
    const name  = val('reg-name');
    const email = val('reg-email');
    const pass  = val('reg-password');
    if (!name || !email || !pass) return setMsg('auth-msg', 'Completa todos los campos', 'error');
    if (pass.length < 6) return setMsg('auth-msg', 'Mínimo 6 caracteres en contraseña', 'error');
    setBtn('register-btn', 'Creando...');
    const { error } = await db.auth.signUp({
      email, password: pass,
      options: { data: { full_name: name } }
    });
    setBtn('register-btn', 'Crear cuenta');
    if (error) setMsg('auth-msg', friendlyError(error.message), 'error');
    // Si no hay error, el onAuthStateChange se encarga de entrar automáticamente
  });

  // ── Logout
  document.getElementById('nav-logout-btn').addEventListener('click', async () => {
    window._manualLogout = true;
    showLogoutScreen();
    try { await db.auth.signOut(); } catch (e) { /* forzamos logout local si signOut falla */ }
    await new Promise(r => setTimeout(r, 1900));
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
    showModal('Mi cuenta',
      `<p><b>Nombre:</b> ${currentProfile?.full_name || '—'}</p>
       <p><b>Correo:</b> ${currentUser.email}</p>
       <p style="margin-top:8px;font-size:1.1rem;color:var(--gold)"><b>Saldo:</b> $${parseFloat(currentWallet?.balance||0).toFixed(2)} USD</p>
       <p style="font-size:0.78rem;color:var(--text-dim);margin-top:8px">¿Necesitas recargar? Contáctanos por WhatsApp.</p>`
    );
  });

  // ── Nav cart + admin
  document.getElementById('nav-cart-btn').addEventListener('click', () => showView('cart'));
  document.getElementById('nav-admin-btn').addEventListener('click', () => {
    showView('admin');
    loadAdminProducts();
    loadAdminUsers();
  });

  // ── Category filter
  document.querySelectorAll('.filter-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      renderProducts();
    })
  );

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
  const { data, error } = await db
    .from('products').select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }
  allProducts = data || [];
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const list = currentCat === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === currentCat);

  if (!list.length) {
    grid.innerHTML = '<div class="no-items">Sin productos en esta categoría</div>';
    return;
  }

  grid.innerHTML = list.map(p => {
    const emoji = CAT_EMOJI[p.category] || '⭐';
    return `
      <div class="product-card">
        <div class="product-emoji">${emoji}</div>
        <div class="product-cat">${p.category}</div>
        <div class="product-name">${esc(p.name)}</div>
        ${p.description ? `<div class="product-desc">${esc(p.description)}</div>` : ''}
        <div class="product-footer">
          <div class="product-price-block">
            <div class="product-price">$${price(p.price)}</div>
            <div class="product-days">${p.duration_days} días</div>
          </div>
          <button class="btn-add-cart" onclick="addToCart('${p.id}')">+ Carrito</button>
        </div>
      </div>`;
  }).join('');
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
  const total = items.reduce((s, p) => s + parseFloat(p.price), 0);
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

  elItems.innerHTML = items.map(p => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${esc(p.name)}</div>
        <div class="cart-item-sub">${p.category} · ${p.duration_days} días</div>
      </div>
      <div class="cart-item-price">$${price(p.price)}</div>
      <button class="btn-remove" onclick="removeFromCart('${p.id}')" title="Quitar">✕</button>
    </div>`
  ).join('');

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
  const total   = items.reduce((s, p) => s + parseFloat(p.price), 0);
  const balance = parseFloat(currentWallet?.balance || 0);

  if (balance < total) return toast('Saldo insuficiente', 'error');

  const btn = document.getElementById('checkout-btn');
  btn.disabled = true; btn.textContent = 'Procesando…';

  try {
    // 1. Deducir saldo
    const newBalance = balance - total;
    const { error: wErr } = await db.from('wallets')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', currentUser.id);
    if (wErr) throw wErr;

    // 2. Registrar órdenes
    const accounts = [];
    for (const p of items) {
      await db.from('orders').insert({
        user_id: currentUser.id, product_id: p.id,
        amount_paid: p.price, status: 'completed'
      });
      if (p.account_data) accounts.push({ name: p.name, data: p.account_data });
    }

    // 3. Actualizar estado local
    currentWallet.balance = newBalance;
    cart = []; saveCart(); syncBalanceUI(); syncCartCount();

    // 4. Mostrar credenciales (si las tiene)
    const accountsHTML = accounts.length
      ? accounts.map(a => `<b>${esc(a.name)}</b><code>${esc(a.data)}</code>`).join('')
      : `<p>Recibirás los datos de acceso por WhatsApp. Si tienes dudas, contáctanos.</p>`;

    showModal('¡Compra exitosa! 🎉', accountsHTML);
    renderCart();
  } catch (err) {
    console.error(err);
    toast('Error al procesar. Intenta de nuevo.', 'error');
    btn.disabled = false; btn.textContent = 'Confirmar compra';
  }
}

// ══════════════════════════════════════════════════
//  ADMIN — PRODUCTOS
// ══════════════════════════════════════════════════
async function loadAdminProducts() {
  if (!currentProfile?.is_admin) return;
  const { data } = await db.from('products').select('*').order('created_at', { ascending: false });
  const el = document.getElementById('admin-products-list');

  if (!data?.length) { el.innerHTML = '<div class="no-items">Sin productos aún</div>'; return; }

  el.innerHTML = data.map(p => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-name">${CAT_EMOJI[p.category]||'⭐'} ${esc(p.name)} — <span style="color:var(--gold)">$${price(p.price)}</span></div>
        <div class="admin-item-meta">${p.category} · ${p.duration_days}d · ${p.is_active ? '✅ Activo' : '❌ Inactivo'}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-toggle" onclick="toggleProduct('${p.id}', ${p.is_active})">
          ${p.is_active ? 'Desactivar' : 'Activar'}
        </button>
      </div>
    </div>`
  ).join('');
}

async function toggleProduct(id, active) {
  await db.from('products').update({ is_active: !active }).eq('id', id);
  loadAdminProducts(); loadProducts();
}

async function addProduct() {
  const name     = val('ap-name');
  const category = val('ap-category');
  const desc     = val('ap-desc');
  const prc      = parseFloat(document.getElementById('ap-price').value);
  const days     = parseInt(document.getElementById('ap-duration').value) || 30;
  const account  = val('ap-account');

  if (!name || !category || !prc) return setMsg('ap-msg', 'Nombre, categoría y precio son requeridos', 'error');

  const { error } = await db.from('products').insert({
    name, category, description: desc, price: prc,
    duration_days: days, account_data: account, is_active: true
  });

  if (error) return setMsg('ap-msg', 'Error al guardar: ' + error.message, 'error');

  setMsg('ap-msg', '¡Producto agregado! ✓', 'success');
  ['ap-name','ap-desc','ap-price','ap-account'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('ap-duration').value = '30';
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
        <div class="admin-item-name">${esc(u.full_name || 'Sin nombre')}${u.is_admin ? ' 👑' : ''}</div>
        <div class="admin-item-meta">${esc(u.email || '')} · Saldo: $${price(u.wallets?.balance || 0)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-credit" onclick="openCreditModal('${u.id}', '${esc(u.full_name || u.email)}')">
          + Crédito
        </button>
      </div>
    </div>`
  ).join('');
}

function openCreditModal(userId, userName) {
  showModal(`Agregar crédito a ${userName}`,
    `<input type="number" id="credit-amount" placeholder="Monto en USD" class="input" step="0.01" min="0.01">
     <input type="text"   id="credit-note"   placeholder="Nota (ej: Pago WA #12)" class="input">
     <button class="btn-primary" onclick="addCredit('${userId}')">Confirmar</button>`
  );
}

async function addCredit(userId) {
  const amount = parseFloat(document.getElementById('credit-amount')?.value || 0);
  const note   = document.getElementById('credit-note')?.value || '';
  if (!amount || amount <= 0) return toast('Monto inválido', 'error');

  const { data: w } = await db.from('wallets').select('balance').eq('user_id', userId).single();
  const newBal = parseFloat(w?.balance || 0) + amount;

  const { error } = await db.from('wallets')
    .update({ balance: newBal, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) return toast('Error al agregar crédito', 'error');

  await db.from('credit_logs').insert({ user_id: userId, amount, type: 'add', note });

  // Si es el usuario actual, actualizar UI
  if (userId === currentUser?.id) {
    currentWallet.balance = newBal;
    syncBalanceUI();
  }

  closeModal();
  toast(`+$${amount.toFixed(2)} agregado ✓`, 'success');
  loadAdminUsers();
}

// ══════════════════════════════════════════════════
//  UI HELPERS
// ══════════════════════════════════════════════════
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`)?.classList.add('active');
  document.querySelectorAll('.bottom-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.bottom-btn[data-view="${name}"]`)?.classList.add('active');
  if (name === 'cart') renderCart();
}

function showAuthView() {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-auth').classList.add('active');
  // Mostrar One Tap cuando la librería de Google esté lista
  if (window.google?.accounts?.id) {
    initOneTap();
  } else {
    // Si la librería aún no cargó (primera vez), esperar a que cargue
    window.onGoogleLibraryLoad = initOneTap;
  }
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

function syncBalanceUI() {
  document.getElementById('balance-amount').textContent = price(currentWallet?.balance || 0);
}
function syncCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

// ─── Tiny utils ────────────────────────────────
function val(id)         { return document.getElementById(id)?.value.trim() || ''; }
function price(n)        { return parseFloat(n||0).toFixed(2); }
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
