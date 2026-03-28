// ═══════════════════════════════════════════════
// SOLARIS ADMIN — admin.js
// Panel independiente exclusivo para administradores
// ═══════════════════════════════════════════════

const SUPABASE_URL      = 'https://vwcwqljwojstyxfrvxcf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Y3dxbGp3b2pzdHl4ZnJ2eGNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzQ3NTYsImV4cCI6MjA5MDA1MDc1Nn0.uMyit3TrGq9VjKl9a_mMwafSUkepymU4Fax15ZmscmM';

const CAT_EMOJI = {
  Streaming: '📺', Musica: '🎵', Gaming: '🎮', Software: '💻', Internet: '🌐',
};

// ─── Supabase ─────────────────────────────────
const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser    = null;
let currentProfile = null;

// ══════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  // Verificar sesión
  const { data: { session } } = await db.auth.getSession();

  if (!session) {
    redirectToLogin();
    return;
  }

  currentUser = session.user;

  // Verificar que sea admin
  const { data: profile, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  if (error || !profile?.is_admin) {
    redirectToLogin('No tienes acceso al panel de administración.');
    return;
  }

  currentProfile = profile;

  // Mostrar app
  fadeOut(document.getElementById('loader'));
  await sleep(400);
  document.getElementById('loader').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');

  // Mostrar usuario en header
  const label = profile.username ? '@' + profile.username : currentUser.email;
  document.getElementById('header-user-label').textContent = label;

  setupTabs();
  setupFilters();
  setupModal();

  await Promise.all([
    loadAdminProducts(),
    loadAdminUsers(),
  ]);
  loadStats(); // después de usuarios para tener _allUsers.length

  // ── Add product btn
  document.getElementById('add-product-btn').addEventListener('click', addProduct);
});

function redirectToLogin(msg) {
  if (msg) sessionStorage.setItem('admin_redirect_msg', msg);
  window.location.href = 'index.html';
}

// ══════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════
async function loadStats() {
  const [prodsRes, ordersRes, walletsRes] = await Promise.allSettled([
    db.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
    db.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    db.from('wallets').select('balance'),
  ]);

  // El conteo de usuarios lo sacamos de _allUsers (cargado por la RPC)
  // para evitar el bloqueo de RLS en profiles
  document.getElementById('stat-users').textContent = _allUsers.length || '—';

  if (prodsRes.status === 'fulfilled')
    document.getElementById('stat-products').textContent = prodsRes.value.count ?? '—';

  if (ordersRes.status === 'fulfilled')
    document.getElementById('stat-orders').textContent = ordersRes.value.count ?? '—';

  if (walletsRes.status === 'fulfilled' && walletsRes.value.data) {
    const total = walletsRes.value.data.reduce((s, w) => s + parseFloat(w.balance || 0), 0);
    document.getElementById('stat-balance').textContent = '$' + total.toFixed(2);
  }
}

// ══════════════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════════════
let _allProducts = [];

async function loadAdminProducts() {
  const { data } = await db
    .from('products').select('*')
    .order('created_at', { ascending: false });

  _allProducts = data || [];
  renderProducts();
}

function renderProducts() {
  const search   = document.getElementById('prod-search')?.value.toLowerCase() || '';
  const catFilter = document.getElementById('prod-cat-filter')?.value || '';
  const el = document.getElementById('admin-products-list');

  let list = _allProducts;
  if (catFilter) list = list.filter(p => p.category === catFilter);
  if (search)    list = list.filter(p =>
    p.name.toLowerCase().includes(search) ||
    (p.description || '').toLowerCase().includes(search)
  );

  if (!list.length) {
    el.innerHTML = '<div class="no-items">Sin productos que coincidan</div>';
    return;
  }

  el.innerHTML = list.map(p => `
    <div class="admin-item">
      <div class="admin-item-info">
        <div class="admin-item-name">
          ${CAT_EMOJI[p.category] || '⭐'} ${esc(p.name)}
          <span style="color:var(--gold);margin-left:6px">$${price(p.price)}</span>
        </div>
        <div class="admin-item-meta">
          ${esc(p.category)} · ${p.duration_days}d · ${p.is_active ? '✅ Activo' : '❌ Inactivo'}
          ${p.service ? ' · ' + esc(p.service) : ''}
        </div>
      </div>
      <div class="admin-item-actions">
        <button class="btn-toggle" onclick="toggleProduct('${p.id}', ${p.is_active})">
          ${p.is_active ? 'Desactivar' : 'Activar'}
        </button>
        <button class="btn btn-danger" onclick="deleteProduct('${p.id}', '${esc(p.name)}')">
          Eliminar
        </button>
      </div>
    </div>`
  ).join('');
}

async function toggleProduct(id, active) {
  await db.from('products').update({ is_active: !active }).eq('id', id);
  await loadAdminProducts();
  loadStats();
}

async function deleteProduct(id, name) {
  showModal(`Eliminar "${name}"`,
    `<p style="color:var(--text-dim);font-size:0.87rem;margin-bottom:16px">¿Confirmas que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
     <div class="modal-actions">
       <button class="btn btn-neutral" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-danger" onclick="confirmDelete('${id}')">Sí, eliminar</button>
     </div>`
  );
}

async function confirmDelete(id) {
  const { error } = await db.from('products').delete().eq('id', id);
  closeModal();
  if (error) { toast('Error al eliminar', 'error'); return; }
  toast('Producto eliminado ✓');
  loadAdminProducts();
  loadStats();
}

async function addProduct() {
  const name     = val('ap-name');
  const category = val('ap-category');
  const service  = val('ap-service');
  const desc     = val('ap-desc');
  const prc      = parseFloat(document.getElementById('ap-price').value);
  const days     = parseInt(document.getElementById('ap-duration').value) || 30;
  const account  = val('ap-account');

  if (!name || !category || !prc)
    return setMsg('ap-msg', 'Nombre, categoría y precio son requeridos', 'error');

  const btn = document.getElementById('add-product-btn');
  btn.disabled = true; btn.textContent = 'Guardando…';

  const { error } = await db.from('products').insert({
    name, category, service: service || null,
    description: desc || null, price: prc,
    duration_days: days, account_data: account || null,
    is_active: true,
  });

  btn.disabled = false; btn.textContent = 'Guardar producto';

  if (error) return setMsg('ap-msg', 'Error: ' + error.message, 'error');

  setMsg('ap-msg', '¡Guardado! ✓', 'success');
  ['ap-name','ap-desc','ap-account','ap-price'].forEach(id =>
    document.getElementById(id).value = ''
  );
  document.getElementById('ap-duration').value = '30';
  document.getElementById('ap-category').value = '';
  document.getElementById('ap-service').value  = '';
  loadAdminProducts();
  loadStats();
}

// ══════════════════════════════════════════════
//  USERS
// ══════════════════════════════════════════════
let _allUsers = [];

async function loadAdminUsers() {
  // Usamos una RPC SECURITY DEFINER para poder leer todos los perfiles
  // aunque RLS esté activo, y para obtener el email de auth.users
  const { data, error } = await db.rpc('get_all_profiles_admin');

  if (error) {
    console.error('Error cargando usuarios:', error.message);
    document.getElementById('admin-users-list').innerHTML =
      `<div class="no-items" style="color:var(--red)">Error: ${error.message}</div>`;
    return;
  }

  _allUsers = data || [];
  renderUsers();
}

function renderUsers() {
  const search = document.getElementById('user-search')?.value.toLowerCase() || '';
  const el = document.getElementById('admin-users-list');

  let list = _allUsers;
  if (search) list = list.filter(u =>
    (u.username || '').toLowerCase().includes(search) ||
    (u.email    || '').toLowerCase().includes(search)
  );

  if (!list.length) {
    el.innerHTML = '<div class="no-items">Sin usuarios que coincidan</div>';
    return;
  }

  el.innerHTML = list.map(u => {
    const displayName = u.username ? '@' + esc(u.username) : esc(u.email || '—');
    const isBlocked   = u.is_blocked === true;
    const isAdmin     = u.is_admin;
    return `
    <div class="admin-item ${isBlocked ? 'admin-item-blocked' : ''}">
      <div class="admin-item-info">
        <div class="admin-item-name">
          ${displayName}
          ${isAdmin   ? ' 👑' : ''}
          ${isBlocked ? ' <span class=\"badge-blocked\">BLOQUEADO</span>' : ''}
        </div>
        <div class="admin-item-meta">
          ${esc(u.email || '')} · Saldo: <strong style="color:var(--gold)">$${price(u.balance || 0)}</strong>
        </div>
      </div>
      <div class="user-pill-grid">
        <button class="upill upill-credit" onclick="openCreditModal('${u.id}', '${displayName}')">
          <span class="upill-icon">$+</span> Crédito
        </button>
        <button class="upill upill-orders" onclick="openOrdersModal('${u.id}', '${displayName}')">
          <span class="upill-icon">📋</span> Órdenes
        </button>
        ${!isAdmin ? `
        <button class="upill ${isBlocked ? 'upill-unblock' : 'upill-block'}"
          onclick="toggleBlock('${u.id}', ${isBlocked}, '${displayName}')">
          <span class="upill-icon">${isBlocked ? '🔓' : '🔒'}</span>
          ${isBlocked ? 'Desbloquear' : 'Bloquear'}
        </button>
        <button class="upill upill-delete"
          onclick="deleteUser('${u.id}', '${displayName}')">
          <span class="upill-icon">🗑️</span> Eliminar
        </button>` : '<div></div><div></div>'}
      </div>
    </div>`;
  }).join('');
}

function openCreditModal(userId, userName) {
  showModal(`Agregar crédito — ${userName}`,
    `<input type="number" id="credit-amount" placeholder="Monto en USD" class="input" step="0.01" min="0.01" style="margin-bottom:10px">
     <input type="text"   id="credit-note"   placeholder="Nota (ej: Pago WA #12)" class="input">
     <div class="modal-actions">
       <button class="btn btn-neutral" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-primary" onclick="addCredit('${userId}')">Confirmar</button>
     </div>`
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

  closeModal();
  toast(`+$${amount.toFixed(2)} agregado ✓`);
  loadAdminUsers();
  loadStats();
}

async function openOrdersModal(userId, userName) {
  showModal(`Órdenes de ${userName}`, '<div class="no-items">Cargando…</div>');

  const { data } = await db
    .from('orders')
    .select('*, products(name, price)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  const content = document.getElementById('modal-content');
  if (!data?.length) {
    content.innerHTML = `<h3>Órdenes de ${userName}</h3><div class="no-items">Sin órdenes aún</div>`;
    return;
  }

  const rows = data.map(o => `
    <div class="admin-item" style="margin-bottom:8px">
      <div class="admin-item-info">
        <div class="admin-item-name">${esc(o.products?.name || '—')}</div>
        <div class="admin-item-meta">${fmtDate(o.created_at)} · $${price(o.amount_paid)}</div>
      </div>
      <span style="font-size:0.78rem;color:${o.status==='completed'?'var(--green)':'var(--text-dim)'}">${o.status}</span>
    </div>`).join('');

  content.innerHTML = `<h3>Órdenes de ${userName}</h3>${rows}`;
}

// ══════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════
function setupTabs() {
  document.querySelectorAll('.admin-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
    });
  });
}

// ══════════════════════════════════════════════
//  FILTERS
// ══════════════════════════════════════════════
function setupFilters() {
  document.getElementById('prod-search')?.addEventListener('input', renderProducts);
  document.getElementById('prod-cat-filter')?.addEventListener('change', renderProducts);
  document.getElementById('user-search')?.addEventListener('input', renderUsers);
}

// ══════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════
function setupModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) closeModal();
  });
}
function showModal(title, html) {
  document.getElementById('modal-content').innerHTML = `<h3>${title}</h3>${html}`;
  document.getElementById('modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

// ══════════════════════════════════════════════
//  UTILS
// ══════════════════════════════════════════════
function val(id)   { return document.getElementById(id)?.value.trim() || ''; }
function price(n)  { return parseFloat(n || 0).toFixed(2); }
function esc(str)  {
  return String(str || '').replace(/[<>"'&]/g, c =>
    ({ '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;', '&':'&amp;' }[c])
  );
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fadeOut(el) { if (el) el.style.cssText += 'opacity:0;transition:opacity 0.4s'; }
function setMsg(id, msg, type) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.className = 'status-msg ' + type; }
}
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

let _toastTimer;
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { el.className = ''; }, 3000);
}

// ══════════════════════════════════════════════
//  BLOQUEAR / DESBLOQUEAR
// ══════════════════════════════════════════════
async function toggleBlock(userId, currentlyBlocked, userName) {
  const action = currentlyBlocked ? 'desbloquear' : 'bloquear';
  showModal(
    `${currentlyBlocked ? '✓ Desbloquear' : '🔒 Bloquear'} — ${userName}`,
    `<p style="color:var(--text-dim);font-size:0.87rem;margin-bottom:16px">
      ¿Confirmas que deseas <strong>${action}</strong> a ${userName}?
      ${!currentlyBlocked ? '<br><span style="font-size:0.8rem;opacity:0.7">El usuario no podrá iniciar sesión mientras esté bloqueado.</span>' : ''}
     </p>
     <div class="modal-actions">
       <button class="btn btn-neutral" onclick="closeModal()">Cancelar</button>
       <button class="btn ${currentlyBlocked ? 'btn-success' : 'btn-danger'}"
         onclick="confirmToggleBlock('${userId}', ${currentlyBlocked})">
         Sí, ${action}
       </button>
     </div>`
  );
}

async function confirmToggleBlock(userId, currentlyBlocked) {
  const { error } = await db.rpc('admin_set_blocked', {
    p_user_id: userId,
    p_blocked: !currentlyBlocked,
  });

  closeModal();

  if (error) {
    toast('Error: ' + error.message, 'error');
    return;
  }

  toast(currentlyBlocked ? 'Usuario desbloqueado ✓' : 'Usuario bloqueado ✓');
  loadAdminUsers();
}

// ══════════════════════════════════════════════
//  ELIMINAR USUARIO
// ══════════════════════════════════════════════
function deleteUser(userId, userName) {
  showModal(
    `🗑️ Eliminar cuenta — ${userName}`,
    `<p style="color:var(--text-dim);font-size:0.87rem;margin-bottom:8px">
      Esta acción es <strong style="color:var(--red)">permanente e irreversible</strong>.
     </p>
     <p style="color:var(--text-dim);font-size:0.82rem;margin-bottom:16px">
      Se borrarán la cuenta, wallet y todos los datos de ${userName}.
     </p>
     <div class="modal-actions">
       <button class="btn btn-neutral" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-danger" onclick="confirmDeleteUser('${userId}')">Sí, eliminar</button>
     </div>`
  );
}

async function confirmDeleteUser(userId) {
  const { error } = await db.rpc('admin_delete_user', { p_user_id: userId });
  closeModal();
  if (error) { toast('Error: ' + error.message, 'error'); return; }
  toast('Usuario eliminado ✓');
  loadAdminUsers();
  loadStats();
}
