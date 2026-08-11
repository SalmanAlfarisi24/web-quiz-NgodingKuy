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
                    setTimeout(() => {
                        splashScreen.classList.add('hidden');
                        checkUserSession();
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
    });
}

function applyUserSession(username) {
    if (currentUserName) currentUserName.textContent = username;
    if (dropdownUserName) dropdownUserName.textContent = username;
    if (lbUsernameDisplay) lbUsernameDisplay.textContent = username;
    if (inputNama) inputNama.value = username;
    if (userDisplay) userDisplay.style.display = 'inline-flex';
    
    document.querySelectorAll('.card-actions-mysql').forEach(el => {
        if (el.getAttribute('data-owner') === username) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
}

function logout() {
    localStorage.removeItem('ngodingkuy_username');
    location.reload();
}

if (btnLogoutTop) btnLogoutTop.addEventListener('click', logout);

// 3. Resilient Burger Menu Mobile (Buka, Tutup, & Auto-Close saat Pilihan Diklik)
if (sidebarToggle && mobileNavDropdown) {
    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Menghentikan event agar tidak langsung memicu penutupan dari document click
        mobileNavDropdown.classList.toggle('hidden');
    });

    // Otomatis langsung close/sembunyikan burger menu saat salah satu pilihan link ditekan
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

// 5. Tutup Semua Dropdown Saat Klik Luar Elemen (Aman & Tidak Bentrok)
document.addEventListener('click', (e) => {
    if (userDropdown && !dropdownTrigger.contains(e.target)) {
        userDropdown.classList.add('hidden');
    }
    if (mobileNavDropdown && !sidebarToggle.contains(e.target) && !mobileNavDropdown.contains(e.target)) {
        mobileNavDropdown.classList.add('hidden');
    }
});

// 6. Kompiler / Live Editor Code Run
if (btnRun && codeInput && outputView) {
    btnRun.addEventListener('click', () => {
        const userCode = codeInput.value;
        const iframeDoc = outputView.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(userCode);
        iframeDoc.close();
        showToast('Kode berhasil dieksekusi! 💻');
    });
}

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

// 8. Testimoni Slider Tunggal dengan Logika Indikator Titik (Dots)
(function initTestimoniSlider() {
    const slider = document.getElementById('testimoni-slider');
    const dotsContainer = document.getElementById('slider-dots');
    if (!slider || slider.children.length <= 1) return;
    
    let currentIndex = 0;
    const cards = slider.children;
    const total = cards.length;

    // Generate komponen titik indikator secara bersih
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < total; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        for (let i = 0; i < total; i++) {
            cards[i].style.transition = 'transform 0.5s ease-in-out';
            cards[i].style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Geser otomatis setiap 3 detik
    setInterval(() => {
        currentIndex++;
        if (currentIndex >= total) {
            currentIndex = 0;
        }
        updateSlider();
    }, 3000);
})();