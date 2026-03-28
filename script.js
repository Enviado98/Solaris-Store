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
  } else if (savedView === 'account') {
    showAccountSkeleton();
  }
  if (cachedProfile?.is_admin)
    document.getElementById('nav-admin-btn').classList.remove('hidden');

  // ── Cargar datos frescos en paralelo ──
  loadProducts(); // productos siempre frescos

  fetchWallet(user.id).then(wallet => {
    if (!wallet) return;
    currentWallet = wallet;
    CACHE.set('wallet_' + user.id, wallet);
    syncBalanceUI();
    if (savedView === 'account') renderAccountView();
  });

  fetchProfile(user.id).then(profile => {
    if (!profile) return;
    currentProfile = profile;
    CACHE.set('profile_' + user.id, profile);
    if (profile?.is_admin)
      document.getElementById('nav-admin-btn').classList.remove('hidden');
    if (savedView === 'account') renderAccountView();
  });
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
  // Mostrar skeleton solo si no hay productos en memoria
  if (!allProducts.length) showProductsSkeleton();

  const { data, error } = await db
    .from('products').select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

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
  // currentCat puede ser: svc key (ej "Netflix"), categoría genérica (ej "Streaming"), o "all"
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
    const svcIcon = SVC_ICON[p.service];
    const catStyle = CAT_STYLE[p.category] || CAT_STYLE.Streaming;
    const iconHtml = svcIcon
      ? `<span class="iconify product-svc-icon" data-icon="${svcIcon.icon}" style="color:${svcIcon.color}"></span>`
      : `<span class="iconify product-svc-icon" data-icon="${catStyle.icon}" style="color:${catStyle.accent}"></span>`;
    return `
      <div class="product-card">
        <div class="product-icon-wrap" style="--cat-accent:${catStyle.accent}">
          ${iconHtml}
        </div>
        <div class="product-name">${esc(p.name)}</div>
        ${p.description ? `<div class="product-desc">${esc(p.description)}</div>` : ''}
        <div class="product-footer">
          <div class="product-price-block">
            <div class="product-price">$${price(p.price)}</div>
            <div class="product-days">${p.duration_days}d</div>
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
    invalidateHistoryCache(); // la compra aparecerá en el historial en la próxima visita

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

  function showDepositModal() {
    showModal('💰 Depositar saldo',
      `<div style="text-align:center;padding:8px 0 4px">
        <div style="width:56px;height:56px;background:linear-gradient(135deg,#16a34a,#22c55e);border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;box-shadow:0 6px 20px rgba(22,163,74,0.4)">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        </div>
        <p style="font-size:0.9rem;color:var(--text-dim);line-height:1.5;margin-bottom:18px">Para agregar saldo a tu cuenta,<br>contacta a un administrador.</p>
        <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;text-align:left;font-size:0.82rem;color:var(--text-dim);line-height:1.7">
          <div>📱 <strong style="color:var(--text)">WhatsApp</strong> · Disponible 9am–9pm</div>
          <div>📧 <strong style="color:var(--text)">Email</strong> · soporte@solaris.store</div>
        </div>
        <p style="font-size:0.75rem;color:var(--text-dim);margin-top:14px;opacity:0.7">El saldo se refleja en minutos ✓</p>
      </div>`
    );
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
  invalidateHistoryCache(); // la transferencia aparecerá en movimientos
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
  // Esto cubre el caso de minimizar/restaurar: el usuario ve sus datos
  // inmediatamente, igual que una app nativa.
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
    _histCache.movs = movsResult.value.data || [];
  } else {
    _histCache.movs = [];
  }

  _renderHistory();
}

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
function _skelRow() {
  return `<div class="skel-hist-row">
    <div class="skel skel-hist-icon"></div>
    <div class="skel-hist-body">
      <div class="skel skel-hist-line1"></div>
      <div class="skel skel-hist-line2"></div>
    </div>
    <div class="skel skel-hist-amt"></div>
  </div>`;
}

function showAccountSkeleton() {
  // Balance skeleton (dentro de la tarjeta dorada)
  const balVal = document.getElementById('acct-balance-val');
  if (balVal) balVal.innerHTML = '<span class="skel-balance-amount"></span>';

  // Perfil skeleton
  const profileCard = document.getElementById('acct-profile-card');
  if (profileCard) {
    profileCard.innerHTML = `
      <div class="skel skel-avatar"></div>
      <div class="acct-profile-info">
        <div class="skel skel-username"></div>
      </div>`;
  }

  // Historial skeleton
  const skelRows = [_skelRow(), _skelRow(), _skelRow()].join('');
  const compras = document.getElementById('acct-hist-compras');
  const recargas = document.getElementById('acct-hist-recargas');
  if (compras)  compras.innerHTML  = skelRows;
  if (recargas) recargas.innerHTML = skelRows;
}

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
