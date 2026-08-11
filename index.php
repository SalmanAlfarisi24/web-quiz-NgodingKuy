<?php
session_start();

$host = "localhost";
$user = "root";
$pass = "";
$db_name = "ngodingkuy_db";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] == 'create_testimoni') {
        $nama = htmlspecialchars($_POST['nama']);
        $pesan = htmlspecialchars($_POST['pesan']);
        $timestamp = time();
        
        // 1. Logika Perbaikan: Cek apakah user dengan nama ini sudah pernah mengirim ulasan
        $check_stmt = $conn->prepare("SELECT id FROM testimonis WHERE nama = ?");
        $check_stmt->bind_param("s", $nama);
        $check_stmt->execute();
        $check_stmt->store_result();
        
        if ($check_stmt->num_rows > 0) {
            // Jika sudah ada, ubah aksi menjadi UPDATE pesan & waktu terbaru
            $check_stmt->close();
            $stmt = $conn->prepare("UPDATE testimonis SET pesan = ?, timestamp = ? WHERE nama = ?");
            $stmt->bind_param("sis", $pesan, $timestamp, $nama);
            $stmt->execute();
            $stmt->close();
        } else {
            // Jika belum ada, lakukan INSERT seperti biasa
            $check_stmt->close();
            $stmt = $conn->prepare("INSERT INTO testimonis (nama, pesan, timestamp) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $nama, $pesan, $timestamp);
            $stmt->execute();
            $stmt->close();
        }
    } elseif ($_POST['action'] == 'delete_testimoni') {
        $id = intval($_POST['id']);
        $stmt = $conn->prepare("DELETE FROM testimonis WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
    }
    header("Location: index.php");
    exit();
}

$result_testi = $conn->query("SELECT * FROM testimonis ORDER BY id DESC");
$testimonis = [];
if ($result_testi && $result_testi->num_rows > 0) {
    while($row = $result_testi->fetch_assoc()) {
        $testimonis[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="id" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ngoding-Kuyy - Pusat Belajar Pemrograman</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;600;700&display=swap">
    <link rel="stylesheet" href="assets/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
    .hero-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        width: 100%;
    }

    .card-actions-mysql {
        margin-top: 8px;
        display: flex;
        gap: 5px;
    }

    .hidden {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
    }
    </style>
</head>

<body>

    <div id="splash-screen" class="splash-container">
        <div class="splash-content">
            <div class="splash-logo-box">
                <i class="fa-solid fa-code-branch splash-icon"></i>
            </div>
            <h1 class="splash-title">NGODING-KUYY</h1>
            <p class="splash-subtitle">Belajar Pemrograman Dasar</p>
            <div class="progress-bar-loader">
                <div class="progress-line"></div>
            </div>
            <div class="splash-loading-text">Loading... <span id="load-percentage">0%</span></div>
        </div>
    </div>

    <div id="auth-modal" class="modal-overlay hidden">
        <div class="modal-card">
            <div class="modal-header-box">
                <h3><i class="fa-solid fa-user-lock"></i> Masuk ke Ngoding-Kuyy</h3>
                <p>Masukkan Nama untuk mulai belajar dan mengakses seluruh fitur.</p>
            </div>
            <div class="form-group-box">
                <label for="auth-username">Username</label>
                <div class="input-with-icon">
                    <i class="fa-solid fa-user"></i>
                    <input type="text" id="auth-username" required placeholder="Contoh: salman_farisi">
                </div>
            </div>
            <button id="btn-login-local" class="btn-submit-auth">
                <i class="fa-solid fa-right-to-bracket"></i> Masuk ke Dashboard
            </button>
        </div>
    </div>

    <div id="toast-notification" class="toast hidden">
        <i class="fa-solid fa-circle-check"></i> <span id="toast-message">Aksi berhasil!</span>
    </div>

    <nav class="navbar navbar-transparent" id="navbar">
        <div class="nav-left">
            <div class="nav-logo">
                <i class="fa-solid fa-code-branch"></i> Ngoding-Kuyy
            </div>
            <div class="nav-links-desktop">
                <a href="#hero" class="active-nav">Dashboard</a>
                <a href="#materi-section">Materi Belajar</a>
                <a href="game/index.html">Game Arena</a>
                <a href="#testimoni-section">Ulasan</a>
            </div>
        </div>
        <div class="nav-right">
            <div class="nav-user-profile" id="profile-dropdown-trigger">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User Profile" class="avatar-img">
                <div class="user-dropdown-menu hidden" id="user-dropdown">
                    <div class="dropdown-header">
                        <p class="dropdown-name" id="dropdown-user-name">Guest</p>
                        <p class="dropdown-role">Siswa Pemula</p>
                    </div>
                    <hr>
                    <a href="#editor-section"><i class="fa-solid fa-laptop-code"></i> Ruang Kerja</a>
                    <a href="#testimoni-section"><i class="fa-solid fa-comments"></i> Testimoni</a>
                    <hr>
                    <button class="btn-logout-dropdown" id="btn-logout-top"><i class="fa-solid fa-right-from-bracket"></i> Keluar</button>
                </div>
            </div>
            <button id="sidebar-toggle" class="sidebar-toggle-btn" aria-label="Buka menu">
                <i class="fa-solid fa-bars"></i>
            </button>
        </div>
    </nav>

    <div class="mobile-nav-dropdown hidden" id="mobile-nav-dropdown">
        <a href="#hero"><i class="fa-solid fa-house"></i> <span>Dashboard</span></a>
        <a href="#materi-section"><i class="fa-solid fa-book"></i> <span>Materi</span></a>
        <a href="game/index.html"><i class="fa-solid fa-gamepad"></i> <span>Game</span></a>
        <a href="#testimoni-section"><i class="fa-solid fa-comments"></i> <span>Ulasan</span></a>
    </div>

    <main class="dashboard-content full-width-content">

        <section id="hero" class="hero-card hero-video-card">
            <video class="hero-bg-video" autoplay muted loop playsinline poster="assets/img/hero-poster.jpg">
                <source src="assets/video/hero-bg.mp4" type="video/mp4">
            </video>
            <div class="hero-video-overlay"></div>
            <div class="hero-left-info">
                <h2>Halo, <span id="current-user-name">Guest</span> 👋</h2>
                <p class="hero-subtitle">Selamat datang di ruang eksplorasi coding.</p>
                <p class="hero-desc">Asah logika pemrogramanmu melalui modul interaktif dan mini game edukasi yang menyenangkan.</p>
                <div class="hero-action-buttons">
                    <a href="#materi-section" class="btn-hero-primary"><i class="fa-solid fa-play"></i> Mulai Belajar</a>
                    <a href="game/index.html" class="btn-hero-secondary"><i class="fa-solid fa-gamepad"></i> Main Game</a>
                </div>
            </div>
        </section>

        <section id="materi-section" class="dashboard-block-card">
            <div class="block-header">
                <h3><i class="fa-solid fa-graduation-cap"></i> Pilihan Pembelajaran</h3>
            </div>
            <div class="materi-grid-dashboard">
                <div class="materi-card-box border-purple">
                    <i class="fa-solid fa-gamepad icon-purple"></i>
                    <h4>Coding Game Arena</h4>
                    <p>Uji ketangkasan logika menembus labirin kode di arena bermain interaktif berbasis grafis 2D Canvas.</p>
                    <a href="game/index.html" class="btn-block-link">Masuk Arena Game</a>
                </div>
                <div class="materi-card-box border-blue">
                    <i class="fa-brands fa-html5 icon-orange"></i>
                    <h4>Web Development</h4>
                    <p>Pelajari fondasi utama perancangan layout website semantik terstruktur menggunakan HTML5, CSS3, dan JS.</p>
                    <a href="materi-web.php" class="btn-block-link">Buka Materi Web</a>
                </div>
                <div class="materi-card-box border-muted">
                    <i class="fa-solid fa-mobile-screen-button icon-muted"></i>
                    <h4>Mobile App Dev</h4>
                    <p>Langkah awal merakit aplikasi Android berskala performa menggunakan dasar framework native XML.</p>
                    <button class="btn-block-link btn-disabled" disabled>Segera Hadir</button>
                </div>
            </div>
        </section>

        <section id="editor-section" class="dashboard-block-card">
            <div class="block-header">
                <h3><i class="fa-solid fa-laptop-code"></i> Ruang Kerja Interaktif</h3>
            </div>
            <div class="editor-grid-box">
                <div class="editor-left-cheatsheet">
                    <h4>Contekan Kode</h4>
                    <div class="cheat-node"><small>Judul Utama</small><code>&lt;h1&gt;Teks&lt;/h1&gt;</code></div>
                    <div class="cheat-node"><small>Paragraf</small><code>&lt;p&gt;Teks&lt;/p&gt;</code></div>
                    <div class="cheat-node"><small>Layout</small><code>display: flex;</code></div>
                </div>
                <div class="editor-right-workspace">
                    <div class="workspace-panel-header">
                        <span>index.html</span>
                        <button id="btn-run" class="btn-compiler-run"><i class="fa-solid fa-play"></i> Run Code</button>
                    </div>
                    <textarea id="code-input" placeholder="<h1>Halo Dunia</h1>&#10;<style>&#10;  h1 { color: #2563EB; text-align: center; }&#10;</style>"></textarea>
                    <div class="workspace-panel-header margin-top-10"><span>Live Preview</span></div>
                    <iframe id="output-view" sandbox="allow-scripts"></iframe>
                </div>
            </div>
        </section>

        <section id="testimoni-section" class="dashboard-block-card margin-top-20">
            <div class="block-header">
                <h3><i class="fa-solid fa-comments"></i> Dinding Testimoni</h3>
            </div>
            <div class="testimoni-grid-box">
                <div class="testimoni-form-wrapper">
                    <form id="testimoni-form-mysql" method="POST" action="index.php">
                        <input type="hidden" name="action" value="create_testimoni">
                        <div class="form-group-box">
                            <label>Nama Anda</label>
                            <input type="text" id="input-nama" name="nama" readonly required class="input-readonly">
                        </div>
                        <div class="form-group-box">
                            <label for="input-pesan">Pesan & Kesan</label>
                            <textarea id="input-pesan" name="pesan" required placeholder="Bagikan pengalaman serumu di Ngoding-Kuyy..."></textarea>
                        </div>
                        <button type="submit" class="btn-send-testi"><i class="fa-solid fa-paper-plane"></i> Kirim Ulasan</button>
                    </form>
                </div>
                <div class="testimoni-slider-wrapper">
                    <div class="slider-viewport-box">
                        <div id="testimoni-slider" class="slider-track-box">
                            <?php if (empty($testimonis)): ?>
                                <p class="no-testi-msg">Belum ada testimoni.</p>
                            <?php else: ?>
                                <?php foreach ($testimonis as $testi): ?>
                                    <div class="testi-slide-node">
                                        <div class="testi-bubble-card">
                                            <h5><i class="fa-solid fa-circle-user"></i> <?php echo $testi['nama']; ?></h5>
                                            <p>"<?php echo $testi['pesan']; ?>"</p>
                                            <div class="card-actions-mysql" data-owner="<?php echo $testi['nama']; ?>" style="display:none;">
                                                <form method="POST" action="index.php" onsubmit="return confirm('Hapus testimoni ini?');">
                                                    <input type="hidden" name="action" value="delete_testimoni">
                                                    <input type="hidden" name="id" value="<?php echo $testi['id']; ?>">
                                                    <button type="submit" class="btn-delete-mysql-card"><i class="fa-solid fa-trash"></i> Hapus</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div id="slider-dots" class="slider-dots-container"></div>
                </div>
            </div>
        </section>

    </main>

    <footer class="dashboard-footer full-width-footer">
        <div class="footer-left-logo"><strong>Ngoding-Kuyy</strong></div>
        <div class="footer-center-copy">Copyright &copy; 2026 Universitas Hamzanwadi</div>
        <div class="footer-right-version">Version 2.0</div>
    </footer>

    <script src="assets/js/main-editor.js"></script>
</body>

</html>