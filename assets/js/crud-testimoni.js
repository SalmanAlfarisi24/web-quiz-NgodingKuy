/* ==========================================================================
   assets/js/crud-testimoni.js (Logika CRUD & Login Nama via MySQL/PHP)
   ========================================================================== */

const API_AUTH = "api/auth.php";
const API_TESTIMONI = "api/testimoni.php";
const POLL_INTERVAL_MS = 8000; // refresh data testimoni berkala agar terasa real-time

// Selektor Elemen HTML
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authUsernameInput = document.getElementById("auth-username");

const userDisplay = document.getElementById("user-display");
const currentUserName = document.getElementById("current-user-name");
const userDisplayMobile = document.getElementById("user-display-mobile");
const currentUserNameMobile = document.querySelector(".current-user-name-mobile");

const testimoniForm = document.getElementById("testimoni-form");
const testimoniIdInput = document.getElementById("testimoni-id");
const inputNama = document.getElementById("input-nama");
const inputPesan = document.getElementById("input-pesan");
const testimoniSlider = document.getElementById("testimoni-slider");
const formTitle = document.getElementById("form-title");
const btnSaveTestimoni = document.getElementById("btn-save-testimoni");
const btnCancelEdit = document.getElementById("btn-cancel-edit");

let currentUser = null;
let sliderInterval = null;
let pollInterval = null;
let latestData = [];

// ==========================================================================
// 1. LOGIKA LOGIN / DAFTAR OTOMATIS (HANYA NAMA, TANPA PASSWORD)
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("ngodingkuy_user");
    if (savedUser) {
        setLoggedInUser(savedUser);
        loadTestimoni();
        startPolling();
    } else {
        if (authModal) authModal.classList.remove("hidden");
    }
});

if (authForm) {
    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!authUsernameInput) return;

        const namaInput = authUsernameInput.value.trim();
        if (!namaInput) return;

        try {
            const res = await fetch(API_AUTH, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama: namaInput })
            });
            const result = await res.json();

            if (result.success) {
                triggerToast(result.message + (result.mode === "register" ? " 🚀" : " 🎉"));
                setLoggedInUser(result.nama);
                loadTestimoni();
                startPolling();
            } else {
                alert(result.message || "Gagal masuk. Silakan coba lagi.");
            }
        } catch (err) {
            console.error("Auth Error:", err);
            alert("Tidak dapat terhubung ke server. Pastikan backend PHP & MySQL aktif.");
        }
    });
}

function setLoggedInUser(nama) {
    currentUser = nama;
    localStorage.setItem("ngodingkuy_user", nama);

    if (authModal) authModal.classList.add("hidden");

    if (currentUserName) currentUserName.textContent = nama;
    if (userDisplay) userDisplay.style.display = "inline-flex";

    if (currentUserNameMobile) currentUserNameMobile.textContent = nama;
    if (userDisplayMobile) userDisplayMobile.style.display = "flex";

    if (inputNama) inputNama.value = nama;
}

// ==========================================================================
// 2. LOGIKA CRUD TESTIMONI (FETCH KE api/testimoni.php)
// ==========================================================================
if (testimoniForm) {
    testimoniForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Anda harus masuk terlebih dahulu!");
            return;
        }
        if (!inputPesan || !testimoniIdInput) return;

        const id = testimoniIdInput.value;
        const pesan = inputPesan.value.trim();
        if (!pesan) return;

        try {
            if (id === "") {
                const res = await fetch(API_TESTIMONI, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nama: currentUser, pesan })
                });
                const result = await res.json();
                if (result.success) {
                    triggerToast("Testimoni berhasil dikirim! ✨");
                    inputPesan.value = "";
                    loadTestimoni();
                } else {
                    alert(result.message || "Gagal mengirim testimoni.");
                }
            } else {
                const res = await fetch(API_TESTIMONI, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, nama: currentUser, pesan })
                });
                const result = await res.json();
                if (result.success) {
                    triggerToast("Testimoni berhasil diperbarui! 📝");
                    resetFormMode();
                    loadTestimoni();
                } else {
                    alert(result.message || "Gagal memperbarui testimoni.");
                }
            }
        } catch (err) {
            console.error("CRUD Error:", err);
            alert("Tidak dapat terhubung ke server.");
        }
    });
}

// ==========================================================================
// 3. READ DATA & SLIDER GESER KANAN 2 DETIK KONTINU
// ==========================================================================
async function loadTestimoni() {
    if (!testimoniSlider) return;
    try {
        const res = await fetch(API_TESTIMONI);
        const result = await res.json();
        if (result.success) {
            latestData = result.data;
            renderSlider(latestData);
        }
    } catch (err) {
        console.error("Load Error:", err);
        testimoniSlider.innerHTML = `<p style="text-align:center; width:100%;">Gagal memuat testimoni. Periksa koneksi server.</p>`;
    }
}

function startPolling() {
    clearInterval(pollInterval);
    pollInterval = setInterval(loadTestimoni, POLL_INTERVAL_MS);
}

function renderSlider(rows) {
    clearInterval(sliderInterval);
    testimoniSlider.innerHTML = "";

    if (rows && rows.length > 0) {
        rows.forEach((item) => {
            const slideCard = document.createElement("div");
            slideCard.className = "testi-slider-card";

            const actionButtons = (item.nama === currentUser) ? `
                <div class="card-actions">
                    <button class="btn-edit-sm" data-id="${item.id}"><i class="fa-solid fa-pen"></i> Edit</button>
                    <button class="btn-delete-sm" data-id="${item.id}"><i class="fa-solid fa-trash"></i> Hapus</button>
                </div>
            ` : '';

            slideCard.innerHTML = `
                <div class="testi-bubble">
                    <h4><i class="fa-solid fa-user-tie"></i> ${escapeHTML(item.nama)}</h4>
                    <p>"${escapeHTML(item.pesan)}"</p>
                    ${actionButtons}
                </div>
            `;
            testimoniSlider.appendChild(slideCard);
        });

        if (rows.length > 1) {
            const firstCardClone = testimoniSlider.children[0].cloneNode(true);
            testimoniSlider.appendChild(firstCardClone);
            startSliderAnimation(rows.length);
        }

        attachCardEvents(rows);
    } else {
        testimoniSlider.innerHTML = `<p style="text-align:center; width:100%;">Belum ada testimoni.</p>`;
    }
}

function startSliderAnimation(totalDataReal) {
    if (!testimoniSlider) return;
    let currentIndex = 0;
    const cards = testimoniSlider.children;

    sliderInterval = setInterval(() => {
        currentIndex++;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i]) {
                cards[i].style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
                cards[i].style.transform = `translateX(-${currentIndex * 100}%)`;
            }
        }

        if (currentIndex === totalDataReal) {
            setTimeout(() => {
                currentIndex = 0;
                for (let i = 0; i < cards.length; i++) {
                    if (cards[i]) {
                        cards[i].style.transition = "none";
                        cards[i].style.transform = `translateX(0%)`;
                    }
                }
            }, 500);
        }
    }, 2000);
}

// ==========================================================================
// 4. UPDATE & DELETE CONTROLLER
// ==========================================================================
function attachCardEvents(rows) {
    document.querySelectorAll(".btn-edit-sm").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            if (!testimoniIdInput || !inputPesan || !formTitle || !btnSaveTestimoni || !btnCancelEdit) return;

            const id = e.currentTarget.getAttribute("data-id");
            const item = rows.find((r) => String(r.id) === String(id));
            if (!item) return;

            testimoniIdInput.value = id;
            inputPesan.value = item.pesan;

            formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Ulasan Anda`;
            btnSaveTestimoni.innerHTML = `<i class="fa-solid fa-check"></i> Simpan Perubahan`;
            btnCancelEdit.style.display = "inline-flex";
        });
    });

    document.querySelectorAll(".btn-delete-sm").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.currentTarget.getAttribute("data-id");
            if (!confirm("Hapus testimoni ini?")) return;

            try {
                const res = await fetch(API_TESTIMONI, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, nama: currentUser })
                });
                const result = await res.json();
                if (result.success) {
                    triggerToast("Testimoni telah dihapus. 🗑️");
                    if (testimoniIdInput && testimoniIdInput.value === id) resetFormMode();
                    loadTestimoni();
                } else {
                    alert(result.message || "Gagal menghapus testimoni.");
                }
            } catch (err) {
                console.error("Delete Error:", err);
                alert("Tidak dapat terhubung ke server.");
            }
        });
    });
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener("click", resetFormMode);
}

function resetFormMode() {
    if (!testimoniIdInput || !inputPesan || !formTitle || !btnSaveTestimoni || !btnCancelEdit) return;
    testimoniIdInput.value = "";
    inputPesan.value = "";
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Tulis Ulasan Anda`;
    btnSaveTestimoni.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Kirim`;
    btnCancelEdit.style.display = "none";
}

function triggerToast(message) {
    if (typeof window.showToast === "function") window.showToast(message);
}

function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}