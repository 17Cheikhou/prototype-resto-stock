/* ── DATA ── */
const products = [
  { id:1,  emoji:'🐟', name:'Thiof entier',        cat:'poisson', unit:'kg',    qty:4.5,  max:20,  prix:3500,  status:'low' },
  { id:2,  emoji:'🥩', name:'Agneau (mouton)',      cat:'viande',  unit:'kg',    qty:8.2,  max:25,  prix:4200,  status:'ok' },
  { id:3,  emoji:'🍚', name:'Riz brisé parfumé',    cat:'riz',     unit:'kg',    qty:12,   max:100, prix:450,   status:'low' },
  { id:4,  emoji:'🐔', name:'Poulet de chair',      cat:'viande',  unit:'pièce', qty:15,   max:30,  prix:3800,  status:'ok' },
  { id:5,  emoji:'🫙', name:'Huile de palme',       cat:'huile',   unit:'litre', qty:0,    max:20,  prix:900,   status:'critical' },
  { id:6,  emoji:'🥬', name:'Oignons violets',      cat:'legume',  unit:'kg',    qty:22,   max:40,  prix:350,   status:'ok' },
  { id:7,  emoji:'🌶️', name:'Piment dem',          cat:'epice',   unit:'kg',    qty:3.5,  max:10,  prix:600,   status:'ok' },
  { id:8,  emoji:'🐟', name:'Guedj (poisson séché)',cat:'poisson', unit:'kg',    qty:2,    max:15,  prix:5000,  status:'critical' },
  { id:9,  emoji:'🍅', name:'Tomates fraîches',     cat:'legume',  unit:'kg',    qty:18,   max:30,  prix:400,   status:'ok' },
  { id:10, emoji:'🫙', name:'Huile d\'arachide',    cat:'huile',   unit:'litre', qty:14,   max:30,  prix:750,   status:'ok' },
  { id:11, emoji:'🥤', name:'Jus de bissap',        cat:'boisson', unit:'litre', qty:8,    max:20,  prix:800,   status:'ok' },
  { id:12, emoji:'🌿', name:'Yété (nébédaye)',      cat:'epice',   unit:'kg',    qty:1.5,  max:8,   prix:1200,  status:'low' },
];

const venteRapide = [
  { emoji:'🍛', name:'Thiéboudienne', prix:2500 },
  { emoji:'🍲', name:'Yassa Poulet',  prix:2000 },
  { emoji:'🥣', name:'Mafé',          prix:1800 },
  { emoji:'🍢', name:'Thiou Bœuf',   prix:2200 },
  { emoji:'🥤', name:'Jus Bissap',    prix:500  },
  { emoji:'🍱', name:'Pastels (6)',   prix:1200 },
];

const chartData = [
  {lbl:'Lun', v:82000},
  {lbl:'Mar', v:115000},
  {lbl:'Mer', v:74000},
  {lbl:'Jeu', v:138000},
  {lbl:'Ven', v:167000},
  {lbl:'Sam', v:201000},
  {lbl:'Dim', v:145000},
];

const orders = [
  { id:1, supplier:'Marché Sandaga', status:'pending', date:'22 mars', amount:84000 },
  { id:2, supplier:'Fournisseur Viandes Dakar', status:'done', date:'19 mars', amount:142500 },
  { id:3, supplier:'Épicerie Tilène', status:'pending', date:'22 mars', amount:37000 },
];

const team = [
  { id:1, name:'Aminata Diallo', role:'gérant', phone:'+221 77 123 4567', salary:25000, present:true, hours:'9h - 18h' },
  { id:2, name:'Malick Sy', role:'cuisinier', phone:'+221 78 234 5678', salary:18000, present:true, hours:'10h - 19h' },
  { id:3, name:'Fatou Ba', role:'serveur', phone:'+221 76 345 6789', salary:12000, present:false, hours:'11h - 20h' },
  { id:4, name:'Moussa Kane', role:'aide', phone:'+221 79 456 7890', salary:10000, present:true, hours:'8h - 16h' },
  { id:5, name:'Aïssatou Ndiaye', role:'caissier', phone:'+221 77 567 8901', salary:14000, present:true, hours:'9h - 18h' },
];

let currentCat = 'all';
let currentSearch = '';
let currentProduct = null;
let currentOp = 'add';
let currentView = 'dashboard';
let currentTeamMember = null;
let salesHistory = [];
let cart = [];
let dailySales = 87500;

/* ── VIEW SWITCHING ── */
function switchView(view) {
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(view).classList.add('active');
  currentView = view;
  const titles = {
    dashboard: 'Tableau de <em>bord</em>',
    inventory: 'Inventaire',
    sales: 'Ventes <em>rapides</em>',
    orders: 'Commandes',
    reports: 'Rapports',
    team: 'Équipe',
    settings: 'Paramètres'
  };
  document.querySelector('.topbar-title').innerHTML = titles[view] || 'RestoStock';
  // Render specific
  if (view === 'inventory') renderInventory();
  if (view === 'sales') renderSales();
  if (view === 'orders') renderOrders();
  if (view === 'reports') renderReports();
}

/* ── RENDER FUNCTIONS ── */
function renderTable() {
  const list = getFiltered();
  const tbody = document.getElementById('product-tbody');
  tbody.innerHTML = list.map(p => {
    const pct = Math.round((p.qty / p.max) * 100);
    const sc = p.status === 'ok' ? 'sv-ok' : p.status === 'low' ? 'sv-low' : 'sv-critical';
    const pc = p.status === 'ok' ? 'pf-ok' : p.status === 'low' ? 'pf-low' : 'pf-critical';
    const bc = p.status === 'ok' ? 'badge-ok' : p.status === 'low' ? 'badge-low' : 'badge-critical';
    const bl = p.status === 'ok' ? '✓ OK' : p.status === 'low' ? '⚠ Bas' : '⚡ Critique';
    const prixFmt = p.prix.toLocaleString('fr-FR') + ' F/' + p.unit;
    return `<tr onclick="openModal(${p.id})">
      <td><div class="prod-info">
        <div class="prod-emoji">${p.emoji}</div>
        <div><div class="prod-name">${p.name}</div><div class="prod-cat">${catLabel(p.cat)}</div></div>
      </div></td>
      <td><span class="price-tag">${prixFmt}</span></td>
      <td><span class="stock-val ${sc}">${p.qty} ${p.unit}</span></td>
      <td><div class="stock-progress"><div class="prog-bg"><div class="prog-fill ${pc}" style="width:${pct}%"></div></div></div></td>
      <td><span class="badge ${bc}">${bl}</span></td>
      <td><button class="action-btn" onclick="event.stopPropagation();openModal(${p.id})">Modifier</button></td>
    </tr>`;
  }).join('');
  updateKPIs();
}

function renderInventory() {
  const list = getFiltered();
  const tbody = document.getElementById('inventory-tbody');
  tbody.innerHTML = list.map(p => {
    const pct = Math.round((p.qty / p.max) * 100);
    const sc = p.status === 'ok' ? 'sv-ok' : p.status === 'low' ? 'sv-low' : 'sv-critical';
    const pc = p.status === 'ok' ? 'pf-ok' : p.status === 'low' ? 'pf-low' : 'pf-critical';
    const bc = p.status === 'ok' ? 'badge-ok' : p.status === 'low' ? 'badge-low' : 'badge-critical';
    const bl = p.status === 'ok' ? '✓ OK' : p.status === 'low' ? '⚠ Bas' : '⚡ Critique';
    const prixFmt = p.prix.toLocaleString('fr-FR') + ' F/' + p.unit;
    return `<tr>
      <td><div class="prod-info">
        <div class="prod-emoji">${p.emoji}</div>
        <div><div class="prod-name">${p.name}</div><div class="prod-cat">${catLabel(p.cat)}</div></div>
      </div></td>
      <td><span class="price-tag">${prixFmt}</span></td>
      <td><span class="stock-val ${sc}">${p.qty} ${p.unit}</span></td>
      <td><div class="stock-progress"><div class="prog-bg"><div class="prog-fill ${pc}" style="width:${pct}%"></div></div></div></td>
      <td><span class="badge ${bc}">${bl}</span></td>
      <td>
        <button class="action-btn" onclick="openModal(${p.id})">Modifier</button>
        <button class="action-btn" onclick="deleteProduct(${p.id})" style="margin-left:4px;">Suppr</button>
      </td>
    </tr>`;
  }).join('');
}

function renderSales() {
  renderVenteFull();
  renderCart();
  renderSalesHistory();
}

function renderVente() {
  document.getElementById('vente-grid').innerHTML = venteRapide.map(v =>
    `<div class="vente-card" onclick="recordSale('${v.name}', ${v.prix})">
      <span class="vc-emoji">${v.emoji}</span>
      <div class="vc-name">${v.name}</div>
      <div class="vc-price">${v.prix.toLocaleString()} F</div>
    </div>`
  ).join('');
}

function renderVenteFull() {
  document.getElementById('vente-grid-full').innerHTML = venteRapide.map(v =>
    `<div class="vente-card" onclick="addToCart(${JSON.stringify(v).replace(/"/g, '&quot;')})">
      <span class="vc-emoji">${v.emoji}</span>
      <div class="vc-name">${v.name}</div>
      <div class="vc-price">${v.prix.toLocaleString()} F</div>
    </div>`
  ).join('');
}

function renderCart() {
  const html = cart.map(c => `<div class="cart-item">${c.emoji} ${c.name} x${c.qty} - ${(c.prix * c.qty).toLocaleString()} F</div>`).join('');
  document.getElementById('cart-items').innerHTML = html;
  const total = cart.reduce((sum, c) => sum + c.prix * c.qty, 0);
  document.getElementById('cart-total').textContent = `Total: ${total.toLocaleString()} FCFA`;
}

function renderSalesHistory() {
  const tbody = document.getElementById('sales-history');
  tbody.innerHTML = salesHistory.map(s =>
    `<tr>
      <td>${s.date}</td>
      <td>${s.items}</td>
      <td>${s.total.toLocaleString()} F</td>
      <td><button class="action-btn" onclick="printReceipt(${salesHistory.indexOf(s)})">Imprimer</button></td>
    </tr>`
  ).join('');
}

function renderOrders() {
  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = orders.map(o =>
    `<tr>
      <td>${o.supplier}</td>
      <td><span class="badge ${o.status === 'done' ? 'badge-ok' : 'badge-low'}">${o.status === 'done' ? 'Livré' : 'En attente'}</span></td>
      <td>${o.date}</td>
      <td>${o.amount.toLocaleString()} F</td>
      <td><button class="action-btn" onclick="viewOrder(${o.id})">Voir</button></td>
    </tr>`
  ).join('');
}

function renderReports() {
  renderChart();
}

/* ── CART & SALES ── */
function addToCart(item) {
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
  toast(`${item.name} ajouté au panier`);
}

function clearCart() {
  cart = [];
  renderCart();
  toast('Panier vidé');
}

function checkout() {
  if (cart.length === 0) return toast('Panier vide');
  const total = cart.reduce((sum, c) => sum + c.prix * c.qty, 0);
  salesHistory.push({
    date: new Date().toLocaleString('fr-FR'),
    items: cart.map(c => `${c.name} x${c.qty}`).join(', '),
    total
  });
  dailySales += total;
  updateKPIs();
  renderSalesHistory();
  cart = [];
  renderCart();
  toast(`Vente validée: ${total.toLocaleString()} FCFA`);
}

function recordSale(name, price) {
  dailySales += price;
  updateKPIs();
  toast(`🧾 ${name} — ${price.toLocaleString()} FCFA enregistré`);
}

function printReceipt(index) {
  const sale = salesHistory[index];
  const receipt = `Reçu RestoStock\nDate: ${sale.date}\nArticles: ${sale.items}\nTotal: ${sale.total.toLocaleString()} FCFA\nMerci !`;
  alert(receipt); // Placeholder for print
}

/* ── INVENTORY ── */
function deleteProduct(id) {
  if (confirm('Supprimer ce produit ?')) {
    const idx = products.findIndex(p => p.id === id);
    products.splice(idx, 1);
    renderInventory();
    renderTable();
    toast('Produit supprimé');
  }
}

/* ── ORDERS ── */
function viewOrder(id) {
  const order = orders.find(o => o.id === id);
  toast(`Commande ${order.supplier}: ${order.amount.toLocaleString()} F`);
}

/* ── FILTERS ── */
function getFiltered() {
  return products.filter(p => {
    const catOk = currentCat === 'all' || p.cat === currentCat;
    const searchOk = !currentSearch || p.name.toLowerCase().includes(currentSearch.toLowerCase());
    return catOk && searchOk;
  });
}

function catLabel(c) {
  const map = {viande:'Viandes',poisson:'Poissons',riz:'Riz & Céréales',legume:'Légumes',epice:'Épices & Aromates',boisson:'Boissons',huile:'Huiles'};
  return map[c] || c;
}

function filterCat(el, cat) {
  currentCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  if (currentView === 'dashboard') renderTable();
  if (currentView === 'inventory') renderInventory();
}

function filterSearch(q) {
  currentSearch = q;
  if (currentView === 'dashboard') renderTable();
  if (currentView === 'inventory') renderInventory();
}

function openOrderModal() {
  toast('Nouvelle commande — bientôt disponible');
}

/* ── CHART ── */
function renderChart() {
  const maxV = Math.max(...chartData.map(d => d.v));
  document.getElementById('chart-bars').innerHTML = chartData.map(d =>
    `<div class="c-bar-col">
      <div class="c-bar" style="height:${Math.round((d.v/maxV)*90)}px" data-v="${(d.v/1000).toFixed(0)}k FCFA"></div>
      <div class="c-lbl">${d.lbl}</div>
    </div>`
  ).join('');
  document.getElementById('chart-bars-full').innerHTML = document.getElementById('chart-bars').innerHTML;
}

/* ── MODAL ── */
function openModal(id) {
  currentProduct = products.find(p => p.id === id);
  if (!currentProduct) return;
  document.getElementById('m-emoji').textContent = currentProduct.emoji;
  document.getElementById('m-name').textContent = currentProduct.name;
  document.getElementById('m-cat').textContent = catLabel(currentProduct.cat) + ' · ' + currentProduct.prix.toLocaleString() + ' F/' + currentProduct.unit;
  document.getElementById('m-stock').textContent = currentProduct.qty;
  document.getElementById('m-unit').textContent = ' ' + currentProduct.unit;
  updatePrice();
  document.getElementById('qty-field').value = 1;
  setOp('add');
  document.getElementById('modal').classList.add('open');
}

function openAddModal() {
  // Placeholder for add new product
  toast('Ajout de produit — bientôt disponible');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

function backdropClose(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}

function updatePrice() {
  if (!currentProduct) return;
  const val = currentProduct.qty * currentProduct.prix;
  document.getElementById('m-price').textContent = 'Valeur : ' + val.toLocaleString('fr-FR') + ' FCFA';
}

function setOp(op) {
  currentOp = op;
  document.getElementById('tab-add').className = 'op-tab' + (op==='add' ? ' active-add' : '');
  document.getElementById('tab-remove').className = 'op-tab' + (op==='remove' ? ' active-remove' : '');
  document.getElementById('qty-unit-lbl').textContent = currentProduct
    ? (currentProduct.unit + (op==='add' ? ' à ajouter' : ' à retirer'))
    : '';
}

function adjustQ(delta) {
  const f = document.getElementById('qty-field');
  const v = parseFloat(f.value) || 0;
  f.value = Math.max(0.5, Math.round((v + delta * 0.5) * 10) / 10);
}

function saveStock() {
  if (!currentProduct) return;
  const qty = parseFloat(document.getElementById('qty-field').value) || 0;
  const p = products.find(pr => pr.id === currentProduct.id);
  if (currentOp === 'add') {
    p.qty = Math.round((p.qty + qty) * 10) / 10;
  } else {
    p.qty = Math.max(0, Math.round((p.qty - qty) * 10) / 10);
  }
  const pct = p.qty / p.max;
  p.status = pct > 0.35 ? 'ok' : pct > 0.1 ? 'low' : 'critical';
  closeModal();
  renderTable();
  if (currentView === 'inventory') renderInventory();
  toast(currentOp === 'add'
    ? `✅ +${qty} ${p.unit} ajouté — ${p.name}`
    : `📤 -${qty} ${p.unit} retiré — ${p.name}`);
}

/* ── SIDEBAR (mobile) ── */
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

/* ── RESTO SWITCH ── */
let restoIdx = 0;
const restos = [
  {name:'Le Baobab Gourmand', color:'#1a7a4a'},
  {name:'La Terrasse du Plateau', color:'#c8860a'},
];
function switchResto() {
  restoIdx = (restoIdx + 1) % restos.length;
  document.getElementById('rs-name').textContent = restos[restoIdx].name;
  document.getElementById('rs-dot').style.background = restos[restoIdx].color;
  document.getElementById('rs-dot').style.boxShadow = '0 0 8px ' + restos[restoIdx].color;
  toast('🏪 Basculé : ' + restos[restoIdx].name);
}

/* ── NAV ── */
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  closeSidebar();
}

/* ── TOAST ── */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── TEAM MANAGEMENT ── */
function renderTeamGrid() {
  const html = team.map(m => `
    <div class="team-card">
      <div class="tc-avatar">${m.name.split(' ').map(n => n[0]).join('')}</div>
      <div class="tc-info">
        <div class="tc-name">${m.name}</div>
        <div class="tc-role">${m.role}</div>
        <div class="tc-phone" style="font-size:11px;color:var(--text3);">${m.phone}</div>
      </div>
      <div class="tc-status">
        <div class="tc-badge ${m.present ? 'badge-present' : 'badge-absent'}">${m.present ? '✓ Présent' : 'Absent'}</div>
        <div class="tc-salary">${m.salary.toLocaleString()} F/jour</div>
      </div>
      <div class="tc-actions">
        <button class="action-btn" onclick="editTeamMember(${m.id})">Modifier</button>
        <button class="action-btn" onclick="deleteTeamMember(${m.id})" style="color:var(--red);">Suppr</button>
      </div>
    </div>
  `).join('');
  document.getElementById('team-grid').innerHTML = html;
  renderTeamSchedule();
}

function renderTeamSchedule() {
  const tbody = document.getElementById('team-schedule-tbody');
  tbody.innerHTML = team.map(m => `
    <tr>
      <td>
        <div class="prod-info" style="gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">${m.name.split(' ').map(n => n[0]).join('')}</div>
          <div>
            <div class="prod-name">${m.name}</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-ok">${m.role}</span></td>
      <td>${m.hours}</td>
      <td>
        <input type="checkbox" ${m.present ? 'checked' : ''} onchange="togglePresence(${m.id}, this.checked)" style="width:18px;height:18px;cursor:pointer;">
      </td>
      <td>
        <button class="action-btn" onclick="editTeamMember(${m.id})">Modifier</button>
      </td>
    </tr>
  `).join('');
}

function openTeamModal() {
  currentTeamMember = null;
  document.getElementById('tm-title').textContent = 'Ajouter membre';
  document.getElementById('tm-name').value = '';
  document.getElementById('tm-role').value = 'cuisinier';
  document.getElementById('tm-phone').value = '';
  document.getElementById('tm-salary').value = '';
  document.getElementById('team-modal').classList.add('open');
}

function editTeamMember(id) {
  const member = team.find(m => m.id === id);
  if (!member) return;
  currentTeamMember = member;
  document.getElementById('tm-title').textContent = 'Modifier membre';
  document.getElementById('tm-name').value = member.name;
  document.getElementById('tm-role').value = member.role;
  document.getElementById('tm-phone').value = member.phone;
  document.getElementById('tm-salary').value = member.salary;
  document.getElementById('team-modal').classList.add('open');
}

function closeTeamModal() {
  document.getElementById('team-modal').classList.remove('open');
  currentTeamMember = null;
}

function backdropCloseTeam(e) {
  if (e.target === document.getElementById('team-modal')) closeTeamModal();
}

function saveTeamMember() {
  const name = document.getElementById('tm-name').value.trim();
  const role = document.getElementById('tm-role').value;
  const phone = document.getElementById('tm-phone').value.trim();
  const salary = parseInt(document.getElementById('tm-salary').value) || 0;
  
  if (!name || !phone || !salary) return toast('⚠️ Remplissez tous les champs');
  
  if (currentTeamMember) {
    currentTeamMember.name = name;
    currentTeamMember.role = role;
    currentTeamMember.phone = phone;
    currentTeamMember.salary = salary;
    toast(`✅ ${name} modifié`);
  } else {
    const newId = Math.max(...team.map(m => m.id), 0) + 1;
    team.push({
      id: newId,
      name,
      role,
      phone,
      salary,
      present: false,
      hours: '10h - 18h'
    });
    toast(`✅ ${name} ajouté à l'équipe`);
  }
  
  renderTeamGrid();
  closeTeamModal();
}

function deleteTeamMember(id) {
  const member = team.find(m => m.id === id);
  if (!member) return;
  if (confirm(`Supprimer ${member.name} de l'équipe ?`)) {
    const idx = team.findIndex(m => m.id === id);
    team.splice(idx, 1);
    renderTeamGrid();
    toast(`🗑️ ${member.name} supprimé`);
  }
}

function togglePresence(id, present) {
  const member = team.find(m => m.id === id);
  if (member) {
    member.present = present;
    toast(present ? `✓ ${member.name} marqué présent` : `✗ ${member.name} marqué absent`);
  }
}

/* ── KPIs ── */
function updateKPIs() {
  const totalValue = products.reduce((sum, p) => sum + (p.qty * p.prix), 0);
  document.getElementById('kpi-val').textContent = totalValue.toLocaleString();
  document.getElementById('kpi-count').textContent = products.length;
  document.getElementById('kpi-sales').textContent = dailySales.toLocaleString();
  const criticalCount = products.filter(p => p.status === 'critical').length;
  document.querySelector('.kpi-red .kpi-val').textContent = criticalCount;
}

/* ── INIT ── */
renderTable();
renderVente();
renderChart();
renderTeamGrid();
switchView('dashboard');

/* ── ADD PRODUCT ── */
function openProductModal() {
  document.getElementById('p-name').value = '';
  document.getElementById('p-emoji').value = '';
  document.getElementById('p-prix').value = '';
  document.getElementById('product-modal').classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('open');
}

function backdropCloseProduct(e) {
  if (e.target === document.getElementById('product-modal')) closeProductModal();
}

function saveProduct() {
  const name = document.getElementById('p-name').value.trim();
  const emoji = document.getElementById('p-emoji').value.trim() || '🍽️';
  const prix = parseInt(document.getElementById('p-prix').value) || 1000;
  if (!name) {
    toast('Nom requis');
    return;
  }
  const newId = venteRapide.length + 1;
  venteRapide.push({ emoji, name, prix, id: newId });
  renderVente();
  if (currentView === 'sales') renderVenteFull();
  closeProductModal();
  toast('Produit ajouté : ' + name);
}