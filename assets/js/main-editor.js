/* ==========================================================================
   assets/js/main-editor.js (Logika Kompilator, Navigasi, Sesi & CRUD Testimoni LocalStorage)
   ========================================================================== */

const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileNavDropdown = document.getElementById('mobile-nav-dropdown');
const dropdownTrigger = document.getElementById('profile-dropdown-trigger');
const userDropdown = document.getElementById('user-dropdown');
const btnLoginLocal = document.getElementById('btn-login-local');
const authModal = document.getElementById('auth-modal');
const authUsername = document.getElementById('auth-username');
const currentUserName = document.getElementById('current-user-name');
const dropdownUserName = document.getElementById('dropdown-user-name');
const lbUsernameDisplay = document.getElementById('lb-username-display');
const inputNama = document.getElementById('input-nama');
const userDisplay = document.getElementById('user-display');
const btnLogoutTop = document.getElementById('btn-logout-top');
const btnRun = document.getElementById('btn-run');
const codeInput = document.getElementById('code-input');
const outputView = document.getElementById('output-view');
const splashScreen = document.getElementById('splash-screen');
const loadPercentage = document.getElementById('load-percentage');
const progressLine = document.querySelector('.progress-line');

// Testimoni Local Elements
const testimoniFormLocal = document.getElementById('testimoni-form-local');
const testimoniIdInput = document.getElementById('testimoni-id');
const inputPesan = document.getElementById('input-pesan');
const btnSaveTestimoni = document.getElementById('btn-save-testimoni');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const formTitle = document.getElementById('form-title');
const testimoniSlider = document.getElementById('testimoni-slider');
const sliderDots = document.getElementById('slider-dots');

let currentUser = null;
let sliderInterval = null;

// Initial Default Testimonis (used if localStorage is empty)
const DEFAULT_TESTIMONIS = [
    { id: 1, nama: "Salman Alfarisi", pesan: "Web quiz & materi NgodingKuy sangat membantu memahami logika pemrograman dasar!" },
    { id: 2, nama: "Budi Santoso", pesan: "Ruang Kerja Live Editornya keren sekali, langsung kelihatan hasilnya!" },
    { id: 3, nama: "Siti Rahma", pesan: "Tampilan website modern dan gampang dipelajari untuk pemula." }
];

// 1. Splash Screen Loading
window.addEventListener('DOMContentLoaded', () => {
    let percent = 0;
    const interval = setInterval(() => {
        percent += 4;
        if (loadPercentage) loadPercentage.textContent = percent + '%';
        if (progressLine) progressLine.style.width = percent + '%';
        
        if (percent >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (splashScreen) {
                    splashScreen.style.opacity = '0';
                    splashScreen.style.transform = 'scale(1.02)';
                    splashScreen.style.pointerEvents = 'none';
                    setTimeout(() => {
                        splashScreen.classList.add('hidden');
                        checkUserSession();
                        initTestimonials();
                    }, 500);
                }
            }, 300);
        }
    }, 40);
});

// 2. Autentikasi / Sesi Pengguna Lokal
function checkUserSession() {
    const savedUser = localStorage.getItem('ngodingkuy_username');
    if (savedUser) {
        applyUserSession(savedUser);
    } else {
        if (authModal) authModal.classList.remove('hidden');
    }
}

if (btnLoginLocal) {
    btnLoginLocal.addEventListener('click', () => {
        if (!authUsername) return;
        const username = authUsername.value.trim();
        if (username === '') {
            alert('Nama tidak boleh kosong!');
            return;
        }
        localStorage.setItem('ngodingkuy_username', username);
        applyUserSession(username);
        if (authModal) authModal.classList.add('hidden');
        showToast('Selamat datang di Ngoding-Kuyy! 🚀');
        renderTestimonialSlider();
    });
}

function applyUserSession(username) {
    currentUser = username;
    if (currentUserName) currentUserName.textContent = username;
    if (dropdownUserName) dropdownUserName.textContent = username;
    if (lbUsernameDisplay) lbUsernameDisplay.textContent = username;
    if (inputNama) inputNama.value = username;
    if (userDisplay) userDisplay.style.display = 'inline-flex';
}

function logout() {
    localStorage.removeItem('ngodingkuy_username');
    location.reload();
}

if (btnLogoutTop) btnLogoutTop.addEventListener('click', logout);

// 3. Resilient Burger Menu Mobile
if (sidebarToggle && mobileNavDropdown) {
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNavDropdown.classList.toggle('hidden');
    });

    const mobileLinks = mobileNavDropdown.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavDropdown.classList.add('hidden');
        });
    });
}

// 4. Aksi Klik Dropdown Profil Desktop
if (dropdownTrigger && userDropdown) {
    dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });
}

// 5. Tutup Semua Dropdown Saat Klik Luar Elemen
document.addEventListener('click', (e) => {
    if (userDropdown && !dropdownTrigger.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
    if (mobileNavDropdown && !sidebarToggle.contains(e.target) && !mobileNavDropdown.contains(e.target)) {
        mobileNavDropdown.classList.add('hidden');
    }
});

// 6. Kompiler / Live Editor Code Run (Menggunakan HTML5 srcdoc secara aman & instan)
function runLiveEditorCode() {
    if (!outputView) return;
    const defaultCode = "<h1>Halo Dunia</h1>\n<style>\n  h1 { color: #38BDF8; text-align: center; font-family: sans-serif; padding-top: 20px; }\n</style>";
    const userCode = (codeInput && codeInput.value.trim() !== "") ? codeInput.value : defaultCode;
    
    outputView.srcdoc = userCode;
}

if (btnRun) {
    btnRun.addEventListener('click', () => {
        runLiveEditorCode();
        showToast('Kode berhasil dieksekusi! 💻');
    });
}

// Jalankan otomatis kode default saat halaman dimuat
window.addEventListener('load', () => {
    if (codeInput && !codeInput.value) {
        codeInput.value = "<h1>Halo Dunia</h1>\n<style>\n  h1 { color: #38BDF8; text-align: center; font-family: sans-serif; padding-top: 20px; }\n</style>";
    }
    runLiveEditorCode();
});

// 7. Notifikasi Toast
function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// 8. Logika CRUD Testimoni & Auto-Slider (LocalStorage)
function getStoredTestimonis() {
    const raw = localStorage.getItem('ngodingkuy_testimonis');
    if (!raw) {
        localStorage.setItem('ngodingkuy_testimonis', JSON.stringify(DEFAULT_TESTIMONIS));
        return DEFAULT_TESTIMONIS;
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return DEFAULT_TESTIMONIS;
    }
}

function saveStoredTestimonis(data) {
    localStorage.setItem('ngodingkuy_testimonis', JSON.stringify(data));
}

function initTestimonials() {
    renderTestimonialSlider();
}

if (testimoniFormLocal) {
    testimoniFormLocal.addEventListener('submit', (e) => {
        e.preventDefault();
        const savedUser = localStorage.getItem('ngodingkuy_username');
        if (!savedUser) {
            alert('Anda harus masuk terlebih dahulu!');
            if (authModal) authModal.classList.remove('hidden');
            return;
        }

        const pesan = inputPesan.value.trim();
        if (!pesan) return;

        let testimonis = getStoredTestimonis();
        const idVal = testimoniIdInput ? testimoniIdInput.value : '';

        if (idVal) {
            // Edit mode by ID
            testimonis = testimonis.map(item => {
                if (String(item.id) === String(idVal)) {
                    return { ...item, pesan: pesan, nama: savedUser };
                }
                return item;
            });
            showToast('Testimoni berhasil diperbarui! 📝');
        } else {
            // Check if user already submitted a testimony (matching original PHP update behavior)
            const existingIndex = testimonis.findIndex(item => item.nama.toLowerCase() === savedUser.toLowerCase());
            if (existingIndex !== -1) {
                testimonis[existingIndex].pesan = pesan;
                showToast('Testimoni berhasil diperbarui! 📝');
            } else {
                const newId = Date.now();
                testimonis.unshift({ id: newId, nama: savedUser, pesan: pesan });
                showToast('Testimoni berhasil dikirim! ✨');
            }
        }

        saveStoredTestimonis(testimonis);
        resetTestimoniForm();
        renderTestimonialSlider();
    });
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', resetTestimoniForm);
}

function resetTestimoniForm() {
    if (testimoniIdInput) testimoniIdInput.value = '';
    if (inputPesan) inputPesan.value = '';
    if (formTitle) formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Tulis Ulasan Anda`;
    if (btnSaveTestimoni) btnSaveTestimoni.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Kirim Ulasan`;
    if (btnCancelEdit) btnCancelEdit.style.display = 'none';
}

function renderTestimonialSlider() {
    if (!testimoniSlider) return;

    clearInterval(sliderInterval);
    const testimonis = getStoredTestimonis();
    const savedUser = localStorage.getItem('ngodingkuy_username') || '';

    testimoniSlider.innerHTML = '';

    if (testimonis.length === 0) {
        testimoniSlider.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-muted);">Belum ada testimoni.</p>`;
        if (sliderDots) sliderDots.innerHTML = '';
        return;
    }

    testimonis.forEach(item => {
        const isOwner = savedUser && (item.nama.toLowerCase() === savedUser.toLowerCase());
        const actionHtml = isOwner ? `
            <div class="card-actions-local">
                <button type="button" class="btn-edit-local-card" data-id="${item.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                <button type="button" class="btn-delete-local-card" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Hapus</button>
            </div>
        ` : '';

        const slideNode = document.createElement('div');
        slideNode.className = 'testi-slide-node';
        slideNode.innerHTML = `
            <div class="testi-bubble-card">
                <h5><i class="fa-solid fa-circle-user"></i> ${escapeHTML(item.nama)}</h5>
                <p>"${escapeHTML(item.pesan)}"</p>
                ${actionHtml}
            </div>
        `;
        testimoniSlider.appendChild(slideNode);
    });

    // Attach click events for edit & delete buttons
    testimoniSlider.querySelectorAll('.btn-edit-local-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            const item = testimonis.find(t => String(t.id) === String(id));
            if (item) {
                if (testimoniIdInput) testimoniIdInput.value = item.id;
                if (inputPesan) inputPesan.value = item.pesan;
                if (formTitle) formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Ulasan Anda`;
                if (btnSaveTestimoni) btnSaveTestimoni.innerHTML = `<i class="fa-solid fa-check"></i> Simpan Perubahan`;
                if (btnCancelEdit) btnCancelEdit.style.display = 'inline-flex';
            }
        });
    });

    testimoniSlider.querySelectorAll('.btn-delete-local-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (confirm('Hapus testimoni ini?')) {
                const filtered = getStoredTestimonis().filter(t => String(t.id) !== String(id));
                saveStoredTestimonis(filtered);
                showToast('Testimoni telah dihapus. 🗑️');
                resetTestimoniForm();
                renderTestimonialSlider();
            }
        });
    });

    // Setup Dots and Auto Slide
    setupSliderAnimation(testimonis.length);
}

function setupSliderAnimation(totalItems) {
    if (!testimoniSlider || !sliderDots) return;
    sliderDots.innerHTML = '';
    let currentIndex = 0;
    const cards = testimoniSlider.children;

    if (totalItems <= 1) return;

    for (let i = 0; i < totalItems; i++) {
        const dot = document.createElement('span');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSliderPosition();
        });
        sliderDots.appendChild(dot);
    }

    function updateSliderPosition() {
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.transition = 'transform 0.5s ease-in-out';
            cards[i].style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        const dots = sliderDots.querySelectorAll('.slider-dot');
        dots.forEach((d, idx) => {
            d.classList.toggle('active', idx === currentIndex);
        });
    }

    sliderInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateSliderPosition();
    }, 3500);
}

function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}