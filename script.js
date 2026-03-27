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

  // Mostrar UI inmediatamente sin esperar fetches
  ['nav-balance', 'nav-logout-btn', 'nav-cart-btn', 'nav-menu-btn', 'nav-account-btn'].forEach(id =>
    document.getElementById(id).classList.remove('hidden')
  );
  document.getElementById('bottom-nav').classList.remove('hidden');
  showView('catalog');
  loadProducts();

  // Cargar profile y wallet en paralelo en segundo plano
  [currentProfile, currentWallet] = await Promise.all([
    fetchProfile(user.id),
    fetchWallet(user.id),
  ]);

  // Actualizar UI con los datos ya cargados
  if (currentProfile?.is_admin)
    document.getElementById('nav-admin-btn').classList.remove('hidden');
  syncBalanceUI();
  syncCartCount();
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
  ['nav-balance','nav-logout-btn','nav-cart-btn','nav-admin-btn','nav-menu-btn','nav-account-btn'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );
  closeNavPanel();
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
    showView('admin');
    loadAdminProducts();
    loadAdminUsers();
  });

  // ── Close panel when clicking outside
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('nav-panel');
    const menuBtn = document.getElementById('nav-menu-btn');
    if (panel && menuBtn && !panel.contains(e.target) && !menuBtn.contains(e.target)) {
      closeNavPanel();
    }
  });

  // ── Service cards
  // Para añadir más: solo agrega el botón en HTML y la entrada en CAT_MAP
  document.querySelectorAll('.svc-card').forEach(card =>
    card.addEventListener('click', () => {
      if (window._triggerLogoPulse) window._triggerLogoPulse();
      const svcKey = card.dataset.cat;
      currentCat = svcKey;           // filtra por key del servicio
      const name = card.querySelector('.svc-name').textContent;
      document.getElementById('back-to-cats').textContent = '← ' + name;
      document.getElementById('cat-grid').classList.add('hidden');
      document.getElementById('products-panel').classList.remove('hidden');
      renderProducts();
    })
  );
  document.getElementById('back-to-cats').addEventListener('click', () => {
    document.getElementById('products-panel').classList.add('hidden');
    document.getElementById('cat-grid').classList.remove('hidden');
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
  // Filtra por clave de servicio usando CAT_MAP, o muestra todos
  const list = currentCat === 'all'
    ? allProducts
    : allProducts.filter(p => {
        // Coincidencia exacta por nombre de servicio (key)
        if (p.service === currentCat) return true;
        // Fallback: por categoría genérica
        const cat = CAT_MAP[currentCat];
        return cat ? p.category === cat && p.service === currentCat : false;
      });

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
  document.getElementById('navbar').style.display = '';
  if (name === 'cart') renderCart();
  if (name === 'catalog') {
    // Siempre volver a la grilla de categorías al entrar al catálogo
    document.getElementById('cat-grid')?.classList.remove('hidden');
    document.getElementById('products-panel')?.classList.add('hidden');
    currentCat = 'all';
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

function syncBalanceUI() {
  document.getElementById('balance-amount').textContent = price(currentWallet?.balance || 0);
  // Actualizar estado del botón transferir
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

  document.getElementById('acct-email-display').textContent = email;

  const uDisp = document.getElementById('acct-username-display');
  uDisp.textContent = username ? '@' + username : 'Sin username';

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
      document.getElementById('acct-hist-' + t.dataset.hist)?.classList.remove('hidden');
    });
  });

  loadAccountHistory();
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
  toast(`✓ Enviaste $${amount.toFixed(2)} a @${username}`);

  // Limpiar panel
  document.getElementById('acct-transfer-panel').classList.remove('open');
    document.getElementById('acct-transfer-trigger')?.classList.remove('active');
  document.getElementById('tr-username').value = '';
  document.getElementById('tr-amount').value   = '';
  fb.textContent = ''; fb.className = 'acct-user-feedback';

  renderAccountView();
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
        toast(`Puedes cambiar tu @usuario en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`, 'error');
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
async function loadAccountHistory() {
  if (!currentUser) return;

  // ── Compras ──
  const comprasEl = document.getElementById('acct-hist-compras');
  if (comprasEl) {
    comprasEl.innerHTML = '<div class="acct-hist-empty">Cargando...</div>';
    const { data: orders } = await db
      .from('orders')
      .select('*, products(name, price)')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!orders || orders.length === 0) {
      comprasEl.innerHTML = '<div class="acct-hist-empty">Aún no has realizado compras.</div>';
    } else {
      comprasEl.innerHTML = orders.slice(0, 20).map(o => {
        const pname = o.products?.name || 'Producto';
        const amt   = parseFloat(o.amount_paid || o.products?.price || 0).toFixed(2);
        const fecha = fmtDate(o.created_at);
        return `<div class="acct-hist-item">
          <div class="acct-hist-icon type-compra">${histIcon('compra')}</div>
          <div class="acct-hist-body">
            <div class="acct-hist-name">${esc(pname)}</div>
            <div class="acct-hist-date">${fecha}</div>
          </div>
          <div class="acct-hist-amount neg">-$${amt}</div>
        </div>`;
      }).join('');
    }
  }

  // ── Movimientos (recargas + transferencias) ──
  const recargasEl = document.getElementById('acct-hist-recargas');
  if (recargasEl) {
    recargasEl.innerHTML = '<div class="acct-hist-empty">Cargando...</div>';
    const { data: movs } = await db
      .from('wallet_topups')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!movs || movs.length === 0) {
      recargasEl.innerHTML = '<div class="acct-hist-empty">Sin movimientos registrados.</div>';
    } else {
      recargasEl.innerHTML = movs.slice(0, 20).map(m => {
        const amt   = parseFloat(m.amount || 0);
        const sign  = m.type === 'transfer_out' ? '-' : (amt >= 0 ? '+' : '');
        const fecha = fmtDate(m.created_at);
        const nota  = m.note || (m.type === 'transfer_in' ? 'Recibido' : m.type === 'transfer_out' ? 'Enviado' : 'Recarga');
        return `<div class="acct-hist-item">
          <div class="acct-hist-icon ${histIconClass(m.type)}">${histIcon(m.type)}</div>
          <div class="acct-hist-body">
            <div class="acct-hist-name">${esc(nota)}</div>
            <div class="acct-hist-date">${fecha}</div>
          </div>
          <div class="acct-hist-amount ${histAmountClass(m.type, amt)}">${sign}$${Math.abs(amt).toFixed(2)}</div>
        </div>`;
      }).join('');
    }
  }
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}
