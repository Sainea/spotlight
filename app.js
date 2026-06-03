// SPOTLIGHT - App Core Engine (SPA & State Controller)

class SpotlightApp {
  constructor() {
    this.initDatabase();
    this.state = {
      spaces: JSON.parse(localStorage.getItem('spotlight_spaces')),
      users: JSON.parse(localStorage.getItem('spotlight_users')),
      currentUser: JSON.parse(localStorage.getItem('spotlight_session')) || null,
      currentView: 'explore',
      currentLang: localStorage.getItem('spotlight_lang') || 'es',
      currentTheme: localStorage.getItem('spotlight_theme') || 'dark',
      currentDetailId: null,
      selectedPaymentMethod: 'nequi',
      currentSlideIndex: 0,
      activeCategoryFilter: 'all',
      transactions: JSON.parse(localStorage.getItem('spotlight_transactions')) || [
        { id: "TX-9001", client: "Juan Sebastián Pérez", space: "Estadio de Arena Camp Nou (Sintética F11)", amount: 240000, commission: 24000, date: "2026-06-01" },
        { id: "TX-9002", client: "Diana M.", space: "Rooftop 360 Miramar", amount: 900000, commission: 90000, date: "2026-06-02" }
      ],
      tickets: JSON.parse(localStorage.getItem('spotlight_tickets')) || [
        { id: "TKT-101", userEmail: "anfitrion@spotlight.com", userName: "Andrés Mendoza", subject: "Soporte de fotos profesionales", status: "open", messages: [
            { sender: "user", text: "Hola Sagan, me gustaría coordinar para que el equipo venga a tomar fotos de mi nueva cancha techada en Riomar.", date: "2026-06-02T14:30:00Z" }
          ]
        }
      ]
    };
    
    // Save defaults to localStorage for first run
    this.saveStateToStorage();
  }

  initDatabase() {
    if (!localStorage.getItem('spotlight_spaces')) {
      localStorage.setItem('spotlight_spaces', JSON.stringify(window.DEFAULT_SPACES));
    }
    if (!localStorage.getItem('spotlight_users')) {
      localStorage.setItem('spotlight_users', JSON.stringify(window.DEFAULT_USERS));
    }
    if (!localStorage.getItem('spotlight_transactions')) {
      localStorage.setItem('spotlight_transactions', JSON.stringify([
        { id: "TX-9001", client: "Juan Sebastián Pérez", space: "Estadio de Arena Camp Nou (Sintética F11)", amount: 240000, commission: 24000, date: "2026-06-01" },
        { id: "TX-9002", client: "Diana M.", space: "Rooftop 360 Miramar", amount: 900000, commission: 90000, date: "2026-06-02" }
      ]));
    }
  }

  saveStateToStorage() {
    localStorage.setItem('spotlight_spaces', JSON.stringify(this.state.spaces));
    localStorage.setItem('spotlight_users', JSON.stringify(this.state.users));
    localStorage.setItem('spotlight_session', JSON.stringify(this.state.currentUser));
    localStorage.setItem('spotlight_transactions', JSON.stringify(this.state.transactions));
    localStorage.setItem('spotlight_tickets', JSON.stringify(this.state.tickets));
  }

  init() {
    // Setup listeners, theme, lang, navigation UI
    this.applyTheme(this.state.currentTheme);
    this.changeLanguage(this.state.currentLang);
    this.updateAuthUI();
    this.renderSponsors();
    this.renderSpaceListings();
    this.renderSenaPresentation();
    
    // Router Initial view
    this.navigateTo(this.state.currentView);
  }

  // Toast System
  showToast(message, type = 'success') {
    const toast = document.getElementById('app-toast');
    const toastText = document.getElementById('toast-message');
    toastText.innerText = message;
    toast.className = `toast active ${type}`;
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }

  // Theme Toggler
  toggleTheme() {
    const newTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  applyTheme(theme) {
    this.state.currentTheme = theme;
    localStorage.setItem('spotlight_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Language Dictionary Handler
  changeLanguage(lang) {
    this.state.currentLang = lang;
    localStorage.setItem('spotlight_lang', lang);
    
    // Set selected attribute in UI dropdown selector
    const selectors = document.querySelectorAll('.lang-selector');
    selectors.forEach(sel => sel.value = lang);

    const dict = window.DICTIONARY[lang];
    if (!dict) return;

    // Translate all nodes that have data-translate attribute
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
      const key = el.getAttribute('data-translate');
      if (dict[key]) {
        if (el.tagName === 'INPUT' && el.placeholder) {
          el.placeholder = dict[key];
        } else {
          el.innerText = dict[key];
        }
      }
    });

    // Refresh dynamically loaded views with new language
    this.renderSpaceListings();
    this.updateAuthUI();
  }

  // SPA Router
  navigateTo(viewName) {
    // Guards
    if (viewName === 'dashboard' && !this.state.currentUser) {
      this.showToast('Inicia sesión para entrar al panel de anfitrión.', 'error');
      this.openModal('login');
      return;
    }
    if (viewName === 'admin') {
      if (!this.state.currentUser || this.state.currentUser.role !== 'admin') {
        this.showToast('Acceso restringido. Solo administradores (Sagan).', 'error');
        return;
      }
    }
    if (viewName === 'checkout' && !this.state.currentUser) {
      this.showToast('Inicia sesión para proceder a la reserva.', 'error');
      this.openModal('login');
      return;
    }

    this.state.currentView = viewName;

    // Switch visible containers
    const containers = document.querySelectorAll('.view-container');
    containers.forEach(box => box.classList.remove('active'));

    const activeView = document.getElementById(`view-${viewName}`);
    if (activeView) activeView.classList.add('active');

    // Update navbar links active styling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = document.getElementById(`nav-${viewName}`);
    if (activeLink) activeLink.classList.add('active');

    // Custom view trigger handlers
    if (viewName === 'dashboard') {
      this.renderHostDashboard();
    } else if (viewName === 'admin') {
      this.renderAdminPanel();
    } else if (viewName === 'favorites') {
      this.renderFavorites();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Auth Modals logic
  openModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(`modal-${modalId}`);
    if (modal) modal.classList.remove('active');
  }

  switchAuthModal(target) {
    if (target === 'login') {
      this.closeModal('register');
      this.openModal('login');
    } else {
      this.closeModal('login');
      this.openModal('register');
    }
  }

  openTermsModal() {
    this.openModal('terms');
  }

  quickLogin(userId) {
    const user = this.state.users.find(u => u.id === userId);
    if (user) {
      this.state.currentUser = user;
      this.saveStateToStorage();
      this.updateAuthUI();
      this.closeModal('login');
      this.showToast(`Sesión iniciada como ${user.name}`);
      
      // Auto routing based on role
      if (user.role === 'admin') {
        this.navigateTo('admin');
      } else if (user.role === 'host') {
        this.navigateTo('dashboard');
      } else {
        this.navigateTo('explore');
      }
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    const user = this.state.users.find(u => u.email === email && u.password === pass);
    if (user) {
      this.state.currentUser = user;
      this.saveStateToStorage();
      this.updateAuthUI();
      this.closeModal('login');
      this.showToast(`Bienvenido, ${user.name}`);
      
      if (user.role === 'admin') this.navigateTo('admin');
      else if (user.role === 'host') this.navigateTo('dashboard');
    } else {
      this.showToast('Correo o contraseña incorrectos.', 'error');
    }
  }

  handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const role = document.getElementById('reg-role').value;
    const password = document.getElementById('reg-password').value;

    if (this.state.users.some(u => u.email === email)) {
      this.showToast('El correo ya está registrado.', 'error');
      return;
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      name,
      role,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone: "+57 300 000 0000",
      favorites: [],
      balance: 1000000
    };

    this.state.users.push(newUser);
    this.state.currentUser = newUser;
    this.saveStateToStorage();
    this.updateAuthUI();
    this.closeModal('register');
    this.showToast(`Cuenta creada. Bienvenido ${name}!`);

    if (role === 'host') this.navigateTo('dashboard');
    else this.navigateTo('explore');
  }

  handleLogout() {
    this.state.currentUser = null;
    this.saveStateToStorage();
    this.updateAuthUI();
    this.showToast('Sesión cerrada correctamente.');
    this.navigateTo('explore');
  }

  updateAuthUI() {
    const authActions = document.getElementById('auth-actions');
    const navDashboard = document.getElementById('nav-dashboard');
    const navAdmin = document.getElementById('nav-admin');

    if (this.state.currentUser) {
      const user = this.state.currentUser;
      const dict = window.DICTIONARY[this.state.currentLang];
      
      authActions.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${user.avatar}" style="width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--accent-gold);" />
          <span style="font-weight: 600; font-size: 13px;">${user.name.split(' ')[0]}</span>
          <button class="btn btn-secondary btn-sm" onclick="app.handleLogout()" style="padding: 6px 12px; font-size: 11px;">${dict.logout}</button>
        </div>
      `;

      // Show/hide navigation based on roles
      if (user.role === 'host' || user.role === 'admin') {
        navDashboard.style.display = 'block';
      } else {
        navDashboard.style.display = 'none';
      }

      if (user.role === 'admin') {
        navAdmin.style.display = 'block';
      } else {
        navAdmin.style.display = 'none';
      }
    } else {
      const dict = window.DICTIONARY[this.state.currentLang];
      authActions.innerHTML = `
        <button class="btn btn-secondary" onclick="app.openModal('login')">${dict.login}</button>
      `;
      navDashboard.style.display = 'none';
      navAdmin.style.display = 'none';
    }
  }

  // Sponsors & Partners
  renderSponsors() {
    const container = document.getElementById('sponsors-container');
    if (!container) return;
    
    container.innerHTML = window.SPONSORS.map(sp => `
      <div class="sponsor-card">
        <div class="sponsor-logo">${sp.logo}</div>
        <div class="sponsor-name">${sp.name}</div>
        <div class="sponsor-desc">${sp.description}</div>
      </div>
    `).join('');
  }

  // Rendering Space Listings (with filters)
  renderSpaceListings() {
    const grid = document.getElementById('listings-grid-container');
    if (!grid) return;

    const query = document.getElementById('search-input').value.toLowerCase();
    const typeSelect = document.getElementById('search-type').value;
    const capacitySelect = parseInt(document.getElementById('search-capacity').value);

    let list = this.state.spaces.filter(sp => sp.status !== 'deleted');

    // Filter by category tab
    if (this.state.activeCategoryFilter !== 'all') {
      list = list.filter(sp => sp.type === this.state.activeCategoryFilter);
    }

    // Filter by search bar query
    if (query) {
      list = list.filter(sp => 
        sp.name.toLowerCase().includes(query) || 
        sp.address.toLowerCase().includes(query) ||
        sp.description.toLowerCase().includes(query)
      );
    }

    // Filter by type dropdown selector
    if (typeSelect !== 'all') {
      list = list.filter(sp => sp.type === typeSelect);
    }

    // Filter by capacity
    if (capacitySelect > 0) {
      list = list.filter(sp => sp.capacity >= capacitySelect);
    }

    // Render count
    document.getElementById('listings-count-title').innerText = `${list.length} ${list.length === 1 ? 'espacio disponible' : 'espacios disponibles'}`;

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-secondary);">
          <span style="font-size: 40px; display: block; margin-bottom: 12px;">🔍</span>
          <p>No encontramos espacios que coincidan con tu búsqueda. Intenta otros términos.</p>
        </div>
      `;
      return;
    }

    const dict = window.DICTIONARY[this.state.currentLang];
    grid.innerHTML = list.map(sp => {
      const isFav = this.state.currentUser && this.state.currentUser.favorites.includes(sp.id);
      return `
        <div class="space-card animate-fade">
          <div class="card-img-wrapper" onclick="app.showSpaceDetail('${sp.id}')">
            <img class="card-img" src="${sp.image}" alt="${sp.name}">
            <span class="card-category-badge">${sp.category}</span>
          </div>
          <button class="card-heart-btn ${isFav ? 'active' : ''}" onclick="app.toggleFavorite('${sp.id}', event)">
            ❤️
          </button>
          
          <div class="card-body">
            <div class="card-header-row">
              <h3 class="card-title" onclick="app.showSpaceDetail('${sp.id}')" style="cursor:pointer;">${sp.name}</h3>
              <span class="card-rating"><span class="card-rating-star">★</span> ${sp.rating}</span>
            </div>
            
            <div class="card-address">
              📍 ${sp.address.split(',')[1] || sp.address}
            </div>

            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; line-height: 1.4;">
              ${sp.description.substring(0, 100)}...
            </div>
            
            <div class="card-meta-info">
              <span class="card-price">$${sp.price.toLocaleString()} COP <span>/${dict.pricePerHour}</span></span>
              <span>•</span>
              <span>👥 Cap. ${sp.capacity}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  filterListings() {
    this.renderSpaceListings();
  }

  detectUserLocation() {
    const btnText = document.getElementById('location-btn-text');
    if (!btnText) return;

    if (!navigator.geolocation) {
      this.showToast('Geolocalización no soportada por el navegador.', 'error');
      return;
    }

    btnText.innerText = 'Detectando...';
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        btnText.innerText = 'Ubicación Detectada';
        this.showToast(`Coordenadas: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Buscando espacios cercanos...`);
        
        // Find closest space based on coordinates (approximation)
        let closestSpace = null;
        let minDistance = Infinity;
        
        this.state.spaces.forEach(sp => {
          if (sp.status === 'deleted') return;
          const dist = Math.sqrt(Math.pow(sp.lat - latitude, 2) + Math.pow(sp.lng - longitude, 2));
          if (dist < minDistance) {
            minDistance = dist;
            closestSpace = sp;
          }
        });

        if (closestSpace) {
          const neighborhood = closestSpace.address.split(',')[1]?.trim().split(' ')[1] || 'Alto Prado';
          document.getElementById('search-input').value = neighborhood;
          this.filterListings();
          this.showToast(`Te recomendamos "${closestSpace.name}" por ser el más cercano.`);
        }
      },
      (error) => {
        btnText.innerText = 'Barranquilla, CO';
        this.showToast('Usando ubicación por defecto: Barranquilla, Atlántico.');
        const defaultSpace = this.state.spaces.find(s => s.id === 'space-1');
        if (defaultSpace) {
          document.getElementById('search-input').value = 'Alto Prado';
          this.filterListings();
        }
      },
      { timeout: 5000 }
    );
  }

  setCategoryFilter(type) {
    this.state.activeCategoryFilter = type;
    
    // Toggle active class on tabs
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(t => t.classList.remove('active'));

    const activeTab = document.getElementById(`cat-${type}`);
    if (activeTab) activeTab.classList.add('active');

    this.renderSpaceListings();
  }

  toggleFavorite(spaceId, event) {
    if (event) event.stopPropagation();

    if (!this.state.currentUser) {
      this.showToast('Inicia sesión para guardar favoritos.', 'error');
      this.openModal('login');
      return;
    }

    const favorites = this.state.currentUser.favorites;
    const index = favorites.indexOf(spaceId);

    if (index === -1) {
      favorites.push(spaceId);
      this.showToast('Agregado a favoritos ❤️');
    } else {
      favorites.splice(index, 1);
      this.showToast('Eliminado de favoritos');
    }

    this.saveStateToStorage();
    this.renderSpaceListings();
    
    if (this.state.currentView === 'favorites') {
      this.renderFavorites();
    }
  }

  renderFavorites() {
    const container = document.getElementById('favorites-grid-container');
    if (!container) return;

    if (!this.state.currentUser) {
      container.innerHTML = `<p style="text-align:center;">Inicia sesión para ver tus favoritos.</p>`;
      return;
    }

    const favIds = this.state.currentUser.favorites;
    const list = this.state.spaces.filter(sp => favIds.includes(sp.id) && sp.status !== 'deleted');

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px 0; color: var(--text-secondary);">
          <span style="font-size: 40px;">💔</span>
          <p style="margin-top: 10px;">Aún no tienes lugares favoritos agregados.</p>
        </div>
      `;
      return;
    }

    const dict = window.DICTIONARY[this.state.currentLang];
    container.innerHTML = list.map(sp => `
      <div class="space-card animate-fade">
        <div class="card-img-wrapper" onclick="app.showSpaceDetail('${sp.id}')">
          <img class="card-img" src="${sp.image}" alt="${sp.name}">
          <span class="card-category-badge">${sp.category}</span>
        </div>
        <button class="card-heart-btn active" onclick="app.toggleFavorite('${sp.id}', event)">
          ❤️
        </button>
        
        <div class="card-body">
          <div class="card-header-row">
            <h3 class="card-title" onclick="app.showSpaceDetail('${sp.id}')" style="cursor:pointer;">${sp.name}</h3>
            <span class="card-rating"><span class="card-rating-star">★</span> ${sp.rating}</span>
          </div>
          
          <div class="card-address">📍 ${sp.address}</div>
          
          <div class="card-meta-info">
            <span class="card-price">$${sp.price.toLocaleString()} COP <span>/${dict.pricePerHour}</span></span>
            <span>👥 ${sp.capacity} max</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Space Details View
  showSpaceDetail(spaceId) {
    const sp = this.state.spaces.find(s => s.id === spaceId);
    if (!sp) return;

    this.state.currentDetailId = spaceId;
    this.navigateTo('detail');

    // Fill textual content
    document.getElementById('detail-title').innerText = sp.name;
    document.getElementById('detail-rating').innerText = sp.rating;
    document.getElementById('detail-reviews-count').innerText = sp.reviewsCount;
    document.getElementById('detail-address').innerText = sp.address;
    document.getElementById('detail-desc-text').innerText = sp.description;
    
    // Fill images
    document.getElementById('detail-img-main').src = sp.images[0] || sp.image;
    document.getElementById('detail-img-thumb1').src = sp.images[1] || sp.image;
    document.getElementById('detail-img-thumb2').src = sp.images[2] || sp.image;

    // Host details
    document.getElementById('detail-host-name').innerText = sp.host.name;
    document.getElementById('detail-host-avatar').src = sp.host.avatar;
    document.getElementById('detail-host-rating').innerText = `★ ${sp.host.rating}`;
    document.getElementById('detail-host-role').innerText = sp.host.role;

    // Logistics options warning
    const logisticsBadge = document.getElementById('detail-logistics-badge');
    const logisticsDesc = document.getElementById('detail-logistics-desc');
    const logisticsSelectorWrapper = document.getElementById('booking-logistic-selection-wrapper');

    if (sp.type === 'cancha') {
      logisticsSelectorWrapper.style.display = 'none';
      logisticsBadge.innerHTML = '⚽ Gramado Profesional & Directo';
      logisticsDesc.innerText = sp.logisticsDescription;
    } else {
      logisticsSelectorWrapper.style.display = 'flex';
      logisticsBadge.innerHTML = '💡 Servicio de Logística Integrada';
      logisticsDesc.innerText = sp.logisticsDescription;
    }

    // Direct WhatsApp bypass warning for sports fields
    const waField = document.getElementById('whatsapp-field-contact');
    if (sp.type === 'cancha') {
      waField.innerHTML = `
        <a href="https://wa.me/573017894512?text=Hola,%20vi%20tu%20cancha%20${encodeURIComponent(sp.name)}%20en%20Spotlight.%20¿Tienes%20disponible?" 
           target="_blank" 
           style="background: #25D366; color: white; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: bold; width:100%; padding:10px; border-radius:var(--radius-sm); font-size:12px; margin-top:8px;">
           💬 Escribir al WhatsApp del Dueño
        </a>
        <p style="font-size:10px; color:var(--text-muted); margin-top:6px;">Nota: Contacto directo disponible para consultas de disponibilidad rápida.</p>
      `;
    } else {
      waField.innerHTML = '';
    }

    // Amenities
    const amenitiesContainer = document.getElementById('detail-amenities-container');
    let amenHtml = sp.amenities.map(am => `
      <div class="amenity-item">
        <span class="amenity-icon">✅</span> <span>${am}</span>
      </div>
    `).join('');
    
    amenHtml += sp.missingAmenities.map(am => `
      <div class="amenity-item missing">
        <span class="amenity-icon">❌</span> <span data-translate="missing">${window.DICTIONARY[this.state.currentLang].missing}: ${am}</span>
      </div>
    `).join('');
    
    amenitiesContainer.innerHTML = amenHtml;

    // Reviews list
    const reviewsContainer = document.getElementById('detail-reviews-container');
    reviewsContainer.innerHTML = sp.reviews.map(rv => `
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <strong>${rv.user}</strong>
          <span style="color:var(--accent-gold);">★ ${rv.rating}</span>
        </div>
        <p style="font-size:13px; color:var(--text-secondary);">${rv.comment}</p>
        <span style="font-size:10px; color:var(--text-muted);">${rv.date}</span>
      </div>
    `).join('');

    // Setup Real Google Maps Embed
    const mapContainer = document.getElementById('detail-map-container');
    if (mapContainer) {
      mapContainer.innerHTML = `
        <iframe 
          width="100%" 
          height="100%" 
          frameborder="0" 
          style="border:0; display:block;" 
          src="https://maps.google.com/maps?q=${sp.lat},${sp.lng}&z=16&output=embed" 
          allowfullscreen>
        </iframe>
      `;
    }

    // Heart icon logic in detail view
    const isFav = this.state.currentUser && this.state.currentUser.favorites.includes(sp.id);
    const favBtn = document.getElementById('detail-fav-btn');
    if (favBtn) {
      favBtn.innerHTML = isFav ? '❤️ Guardado' : '🖤 Guardar';
      favBtn.className = isFav ? 'btn btn-secondary active' : 'btn btn-secondary';
    }

    // Price card info
    document.getElementById('detail-price-text').innerHTML = `$${sp.price.toLocaleString()} COP <span>/ hora</span>`;
    document.getElementById('detail-capacity-badge').innerText = `👥 Max: ${sp.capacity}`;

    // Reset dates and run calculations
    document.getElementById('book-date').value = "2026-06-15";
    document.getElementById('book-hours').value = "2";
    document.getElementById('book-logistics-select').value = "none";
    this.calculateTotalBooking();
  }

  toggleFavoriteDetail() {
    if (!this.state.currentDetailId) return;
    this.toggleFavorite(this.state.currentDetailId);
    
    // Refresh button styling in detail
    const spId = this.state.currentDetailId;
    const isFav = this.state.currentUser && this.state.currentUser.favorites.includes(spId);
    const favBtn = document.getElementById('detail-fav-btn');
    if (favBtn) {
      favBtn.innerHTML = isFav ? '❤️ Guardado' : '🖤 Guardar';
    }
  }

  // Cost calculation
  calculateTotalBooking() {
    const sp = this.state.spaces.find(s => s.id === this.state.currentDetailId);
    if (!sp) return;

    const hours = parseInt(document.getElementById('book-hours').value);
    const logisticsVal = document.getElementById('book-logistics-select').value;

    const baseCost = sp.price * hours;
    
    // Logistics fee is +10% of base cost if requested
    const logisticsCost = (sp.type !== 'cancha' && logisticsVal === 'spotlight') ? Math.round(baseCost * 0.1) : 0;
    
    // Commission is 10%
    const commissionCost = Math.round(baseCost * 0.1);
    
    const totalCost = baseCost + logisticsCost + commissionCost;

    // Render in UI invoice
    document.getElementById('invoice-hours-calc').innerText = `Alquiler básico (${hours} ${hours === 1 ? 'hora' : 'horas'})`;
    document.getElementById('invoice-base-cost').innerText = `$${baseCost.toLocaleString()} COP`;
    
    const logisticsRow = document.getElementById('invoice-logistics-row');
    if (logisticsCost > 0) {
      logisticsRow.style.display = 'flex';
      document.getElementById('invoice-logistics-cost').innerText = `$${logisticsCost.toLocaleString()} COP`;
    } else {
      logisticsRow.style.display = 'none';
    }

    document.getElementById('invoice-commission-cost').innerText = `$${commissionCost.toLocaleString()} COP`;
    document.getElementById('invoice-total-cost').innerText = `$${totalCost.toLocaleString()} COP`;

    // Cache calculation inside temp object
    this.currentBookingData = {
      spaceId: sp.id,
      hours,
      baseCost,
      logisticsCost,
      commissionCost,
      totalCost,
      date: document.getElementById('book-date').value || '2026-06-15'
    };
  }

  // Checkout redirect
  proceedToCheckout() {
    if (!this.state.currentUser) {
      this.showToast('Por favor, inicia sesión para completar la reserva.', 'error');
      this.openModal('login');
      return;
    }

    if (!this.currentBookingData) {
      this.calculateTotalBooking();
    }

    const sp = this.state.spaces.find(s => s.id === this.state.currentDetailId);
    if (!sp) return;

    // Navigate and fill checkout
    this.navigateTo('checkout');

    document.getElementById('checkout-space-name').innerText = sp.name;
    document.getElementById('checkout-date').innerText = this.currentBookingData.date;
    
    document.getElementById('checkout-base-price').innerText = `$${this.currentBookingData.baseCost.toLocaleString()} COP`;
    
    const logisticsRow = document.getElementById('checkout-logistics-row');
    if (this.currentBookingData.logisticsCost > 0) {
      logisticsRow.style.display = 'flex';
      document.getElementById('checkout-logistics-price').innerText = `$${this.currentBookingData.logisticsCost.toLocaleString()} COP`;
    } else {
      logisticsRow.style.display = 'none';
    }

    document.getElementById('checkout-commission-price').innerText = `$${this.currentBookingData.commissionCost.toLocaleString()} COP`;
    document.getElementById('checkout-total-price').innerText = `$${this.currentBookingData.totalCost.toLocaleString()} COP`;
    
    // Defaults inputs
    this.selectPaymentMethod('nequi');
  }

  selectPaymentMethod(method) {
    this.state.selectedPaymentMethod = method;
    
    // Style cards selection
    const cards = document.querySelectorAll('.payment-method-card');
    cards.forEach(c => c.classList.remove('selected'));
    
    document.getElementById(`pay-${method}`).classList.add('selected');

    // Toggle fields visibility
    const nequiGroup = document.getElementById('group-phone-nequi');
    const cardGroup = document.getElementById('group-card-details');

    if (method === 'nequi') {
      nequiGroup.style.display = 'block';
      cardGroup.style.display = 'none';
      document.getElementById('payment-phone').value = this.state.currentUser ? this.state.currentUser.phone : '';
    } else if (method === 'pse') {
      nequiGroup.style.display = 'block';
      cardGroup.style.display = 'none';
      document.getElementById('payment-phone').placeholder = "Número de Celular registrado en banco";
    } else {
      nequiGroup.style.display = 'none';
      cardGroup.style.display = 'block';
    }
  }

  // Pasarela simulated process
  processBookingPayment() {
    const data = this.currentBookingData;
    if (!data) return;

    const user = this.state.currentUser;
    if (!user) return;

    if (user.balance < data.totalCost) {
      this.showToast('Saldo insuficiente en tu cuenta simulada de pagos.', 'error');
      return;
    }

    // 1. Deduct money from client
    user.balance -= data.totalCost;

    // 2. Pay to host (90% of base rental cost)
    const hostPayout = data.baseCost; // Host receives the base cost. The user pays extra +10% logistics and 10% commission.
    const sp = this.state.spaces.find(s => s.id === data.spaceId);
    
    // Find the host user to deposit money
    const hostUser = this.state.users.find(u => u.name === sp.host.name) || this.state.users.find(u => u.role === 'host');
    if (hostUser) {
      hostUser.balance += hostPayout;
    }

    // 3. Register transaction
    const newTx = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      client: user.name,
      space: sp.name,
      amount: data.totalCost,
      commission: data.commissionCost,
      date: new Date().toISOString().split('T')[0]
    };
    this.state.transactions.unshift(newTx);

    // Save states
    this.saveStateToStorage();
    this.showToast('¡Pago Procesado de Forma Segura! Tu reserva está confirmada.');
    
    // Clean cache
    this.currentBookingData = null;

    // Navigate to respective dashboard or explorer
    if (user.role === 'host') {
      this.navigateTo('dashboard');
    } else {
      this.navigateTo('explore');
    }
  }

  // Host Dashboard controller
  renderHostDashboard() {
    const tableBody = document.getElementById('dashboard-spaces-tbody');
    if (!tableBody) return;

    const hostName = this.state.currentUser.name;
    document.getElementById('dashboard-host-welcome').innerText = `Panel de Control: Bienvenido de vuelta, ${hostName}`;

    // Filter host properties
    const hostSpaces = this.state.spaces.filter(sp => sp.host.name === hostName && sp.status !== 'deleted');

    if (hostSpaces.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
            Aún no has registrado ningún espacio. Registra uno con el botón superior.
          </td>
        </tr>
      `;
      
      // Zero stats
      document.getElementById('host-stat-views').innerText = "0";
      document.getElementById('host-stat-earnings').innerText = "$0 COP";
      document.getElementById('host-stat-bookings').innerText = "0";
      document.getElementById('host-stat-rating').innerText = "N/A";
      return;
    }

    // Calculate aggregated stats
    let totalViews = 0;
    let totalEarnings = this.state.currentUser.balance - 1500000; // Simulating base starting balance subtracted
    if (totalEarnings < 0) totalEarnings = 0;
    
    let totalBookings = 0;
    let totalRatings = 0;

    hostSpaces.forEach(sp => {
      totalViews += sp.views;
      totalBookings += sp.bookingsCount;
      totalRatings += sp.rating;
    });

    const averageRating = (totalRatings / hostSpaces.length).toFixed(2);

    // Fill UI metrics
    document.getElementById('host-stat-views').innerText = totalViews.toLocaleString();
    document.getElementById('host-stat-earnings').innerText = `$${totalEarnings.toLocaleString()} COP`;
    document.getElementById('host-stat-bookings').innerText = totalBookings;
    document.getElementById('host-stat-rating').innerText = `★ ${averageRating}`;

    // Render table rows
    tableBody.innerHTML = hostSpaces.map(sp => `
      <tr>
        <td style="font-weight: 700;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${sp.image}" style="width:40px; height:40px; object-fit:cover; border-radius:var(--radius-sm);" />
            <span>${sp.name}</span>
          </div>
        </td>
        <td><span class="badge-status active">${sp.category}</span></td>
        <td>$${sp.price.toLocaleString()} COP</td>
        <td>${sp.bookingsCount} reservas</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="app.openEditSpaceModal('${sp.id}')" style="padding:4px 8px; font-size:11px; margin-right:4px;">✏️ Editar</button>
          <button class="btn btn-secondary btn-sm" onclick="app.deleteSpace('${sp.id}')" style="padding:4px 8px; font-size:11px; color:var(--accent-red); border-color:rgba(230,57,70,0.2);">🗑️ Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  // Host CRUD Modal actions
  openCreateSpaceModal() {
    document.getElementById('space-modal-title').innerText = "Registrar Nuevo Espacio";
    document.getElementById('space-form-id').value = "";
    
    // Clear inputs
    document.getElementById('space-name').value = "";
    document.getElementById('space-price').value = "";
    document.getElementById('space-capacity').value = "";
    document.getElementById('space-image').value = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80";
    document.getElementById('space-address').value = "";
    document.getElementById('space-description').value = "";
    document.getElementById('space-logistics').value = "both";

    // Uncheck boxes
    const checks = document.querySelectorAll('.amenity-checkbox');
    checks.forEach(c => c.checked = false);

    this.openModal('space-crud');
  }

  openEditSpaceModal(id) {
    const sp = this.state.spaces.find(s => s.id === id);
    if (!sp) return;

    document.getElementById('space-modal-title').innerText = "Editar Espacio";
    document.getElementById('space-form-id').value = sp.id;
    
    document.getElementById('space-name').value = sp.name;
    document.getElementById('space-type').value = sp.type;
    document.getElementById('space-price').value = sp.price;
    document.getElementById('space-capacity').value = sp.capacity;
    document.getElementById('space-image').value = sp.image;
    document.getElementById('space-address').value = sp.address;
    document.getElementById('space-description').value = sp.description;
    document.getElementById('space-logistics').value = sp.logisticsOption;

    // Check appropriate boxes
    const checks = document.querySelectorAll('.amenity-checkbox');
    checks.forEach(c => {
      c.checked = sp.amenities.includes(c.value);
    });

    this.openModal('space-crud');
  }

  closeSpaceModal() {
    this.closeModal('space-crud');
  }

  handleSpaceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('space-form-id').value;
    const name = document.getElementById('space-name').value;
    const type = document.getElementById('space-type').value;
    const price = parseInt(document.getElementById('space-price').value);
    const capacity = parseInt(document.getElementById('space-capacity').value);
    const image = document.getElementById('space-image').value;
    const address = document.getElementById('space-address').value;
    const description = document.getElementById('space-description').value;
    const logisticsOption = document.getElementById('space-logistics').value;

    // Collect checked amenities
    const checkedAmenities = [];
    const checks = document.querySelectorAll('.amenity-checkbox');
    checks.forEach(c => {
      if (c.checked) checkedAmenities.push(c.value);
    });

    const allPossibleAmenities = ["Vista al río", "Cocina", "Wifi", "Piscina", "Se permiten mascotas", "TV", "Lavadora", "Aire acondicionado"];
    const missingAmenities = allPossibleAmenities.filter(am => !checkedAmenities.includes(am));

    let category = "Eventos & Salones";
    if (type === 'cancha') category = "Deportes & Canchas";

    if (id) {
      // Edit mode
      const index = this.state.spaces.findIndex(s => s.id === id);
      if (index !== -1) {
        this.state.spaces[index] = {
          ...this.state.spaces[index],
          name, type, category, price, capacity, image, address, description, logisticsOption,
          amenities: checkedAmenities,
          missingAmenities
        };
        this.showToast('Espacio actualizado con éxito.');
      }
    } else {
      // Create mode
      const newSpace = {
        id: `space-${Date.now()}`,
        name, type, category, price, capacity, image, address, description, logisticsOption,
        currency: "COP",
        rating: 5.0,
        reviewsCount: 0,
        images: [image, image, image],
        amenities: checkedAmenities,
        missingAmenities,
        host: {
          name: this.state.currentUser.name,
          avatar: this.state.currentUser.avatar,
          role: "Anfitrión Verificado",
          phone: this.state.currentUser.phone,
          rating: 5.0
        },
        logisticsDescription: logisticsOption === 'spotlight' 
          ? "Exclusivo Spotlight Events Logistics." 
          : "Servicios integrados opcionales disponibles.",
        reviews: [],
        views: 0,
        bookingsCount: 0,
        status: "active"
      };
      this.state.spaces.unshift(newSpace);
      this.showToast('¡Nueva propiedad registrada con éxito en Barranquilla!');
    }

    this.saveStateToStorage();
    this.closeSpaceModal();
    this.renderSpaceListings();
    this.renderHostDashboard();
  }

  deleteSpace(id) {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente este espacio?')) {
      const index = this.state.spaces.findIndex(s => s.id === id);
      if (index !== -1) {
        this.state.spaces[index].status = 'deleted';
        this.saveStateToStorage();
        this.showToast('Espacio eliminado del listado.');
        this.renderSpaceListings();
        this.renderHostDashboard();
      }
    }
  }

  // Admin Dashboard Panel
  renderAdminPanel() {
    // Totals
    let totalComm = 0;
    this.state.transactions.forEach(t => totalComm += t.commission);

    document.getElementById('admin-stat-commissions').innerText = `$${totalComm.toLocaleString()} COP`;
    document.getElementById('admin-stat-users').innerText = this.state.users.length;
    document.getElementById('admin-stat-spaces').innerText = this.state.spaces.filter(s => s.status !== 'deleted').length;
    document.getElementById('admin-stat-bookings').innerText = this.state.transactions.length;

    // Render transactions tbody
    const tbody = document.getElementById('admin-transactions-tbody');
    tbody.innerHTML = this.state.transactions.map(t => `
      <tr>
        <td style="font-family:monospace; font-weight:bold;">${t.id}</td>
        <td>${t.client}</td>
        <td>${t.space}</td>
        <td style="font-weight:bold;">$${t.amount.toLocaleString()} COP</td>
        <td style="color:var(--accent-gold); font-weight:bold;">$${t.commission.toLocaleString()} COP</td>
      </tr>
    `).join('');

    // Render support ticket alerts
    const tktContainer = document.getElementById('admin-tickets-container');
    tktContainer.innerHTML = this.state.tickets.map(tkt => `
      <div style="border: 1px solid var(--border-color); padding: 14px; border-radius: var(--radius-sm); background: var(--bg-primary); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="display:block;">${tkt.userName}</strong>
          <span style="font-size:12px; color:var(--text-secondary);">${tkt.subject}</span>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="app.openAdminTicketChat('${tkt.id}')" style="padding:4px 10px; font-size:11px;">Responder 💬</button>
      </div>
    `).join('');
  }

  openAdminTicketChat(tktId) {
    const tkt = this.state.tickets.find(t => t.id === tktId);
    if (!tkt) return;

    // Switch view to support, set active chat context to simulate admin responses
    this.navigateTo('support');
    
    const body = document.getElementById('chat-body-container');
    body.innerHTML = `
      <div class="chat-bubble support">
        [Soporte Admin] Estás respondiendo el ticket de <strong>${tkt.userName}</strong>: "${tkt.messages[0].text}"
      </div>
    `;

    tkt.messages.forEach(msg => {
      const bubbleClass = msg.sender === 'user' ? 'user' : 'support';
      body.innerHTML += `
        <div class="chat-bubble ${bubbleClass}">
          ${msg.text}
        </div>
      `;
    });
    
    this.activeAdminTicketId = tktId;
  }

  // Chat client Support view
  handleChatKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendChatMessage();
    }
  }

  sendChatMessage() {
    const input = document.getElementById('chat-user-input');
    const text = input.value.trim();
    if (!text) return;

    const body = document.getElementById('chat-body-container');
    
    // Add user bubble
    body.innerHTML += `
      <div class="chat-bubble user">
        ${text}
      </div>
    `;
    input.value = "";
    
    // Auto-scroll chat body
    body.scrollTop = body.scrollHeight;

    // Simulated Support Response
    setTimeout(() => {
      let reply = "Entendido. Recibimos tu mensaje, en breve nuestro equipo te contactará directamente.";
      
      const lower = text.toLowerCase();
      if (lower.includes('hola') || lower.includes('buenos')) {
        reply = "¡Hola! ¿En qué puedo ayudarte? Cuéntame si tienes dudas de comisiones, pagos o publicación de espacios.";
      } else if (lower.includes('comision') || lower.includes('pago')) {
        reply = "Manejamos una comisión fija del 10% para salones y eventos. Para canchas deportivas, a partir del 2do mes puedes optar por una suscripción fija para reservas por WhatsApp.";
      } else if (lower.includes('cancha') || lower.includes('whatsapp')) {
        reply = "Para las canchas de fútbol incluimos el botón de WhatsApp directo del propietario. El primer mes de publicación es gratuito; del segundo en adelante se cobra un costo fijo de pauta.";
      } else if (lower.includes('sena')) {
        reply = "¡Excelente! Este proyecto está desarrollado en Barranquilla integrando aprendices tecnólogos del SENA en desarrollo y logística de eventos.";
      }

      body.innerHTML += `
        <div class="chat-bubble support">
          ${reply}
        </div>
      `;
      body.scrollTop = body.scrollHeight;
    }, 1000);
  }

  // Logistics request form submit
  submitLogisticsRequest(e) {
    e.preventDefault();
    const name = document.getElementById('log-name').value;
    const phone = document.getElementById('log-phone').value;
    const eventType = document.getElementById('log-event-type').value;

    this.showToast(`¡Solicitud enviada! Nos comunicaremos al número ${phone} en menos de 24 horas.`);
    
    // Clear form
    document.getElementById('logistics-request-form').reset();
    this.navigateTo('explore');
  }

  // SENA presentation slideshow controller
  renderSenaPresentation() {
    const slide = window.SENA_PRESENTATION[this.state.currentSlideIndex];
    if (!slide) return;

    // Render contents
    document.getElementById('slide-title').innerText = slide.title;
    document.getElementById('slide-subtitle').innerText = slide.subtitle;
    document.getElementById('slide-num').innerText = `0${slide.id} / 05`;
    document.getElementById('slide-highlight').innerText = slide.highlight;

    // Slide bullets rendering
    const ul = document.getElementById('slide-bullets');
    ul.innerHTML = slide.bullets.map(b => {
      // Parse basic bold markdown **text**
      const formatted = b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return `<li>${formatted}</li>`;
    }).join('');

    // Setup dots
    const dotsContainer = document.getElementById('presentation-dots');
    dotsContainer.innerHTML = window.SENA_PRESENTATION.map((s, idx) => `
      <div class="presentation-dot ${idx === this.state.currentSlideIndex ? 'active' : ''}" onclick="app.setSlide(${idx})"></div>
    `).join('');
  }

  nextSlide() {
    this.state.currentSlideIndex = (this.state.currentSlideIndex + 1) % window.SENA_PRESENTATION.length;
    
    // Simple slide transition effect
    const deck = document.getElementById('presentation-slide-deck');
    deck.style.opacity = 0.5;
    setTimeout(() => {
      this.renderSenaPresentation();
      deck.style.opacity = 1;
    }, 150);
  }

  prevSlide() {
    this.state.currentSlideIndex = (this.state.currentSlideIndex - 1 + window.SENA_PRESENTATION.length) % window.SENA_PRESENTATION.length;
    
    const deck = document.getElementById('presentation-slide-deck');
    deck.style.opacity = 0.5;
    setTimeout(() => {
      this.renderSenaPresentation();
      deck.style.opacity = 1;
    }, 150);
  }

  setSlide(idx) {
    this.state.currentSlideIndex = idx;
    this.renderSenaPresentation();
  }
}

// Instantiate and launch the app
const app = new SpotlightApp();
window.app = app;

window.addEventListener('DOMContentLoaded', () => {
  app.init();
});
