<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Materi Web Development - NgodingKuy</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* Tambahan style khusus halaman materi agar membaca lebih nyaman */
        .materi-body-card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 2.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
        }
        .materi-body-card h3 {
            margin: 1.5rem 0 0.5rem;
            color: var(--accent-color);
        }
        .materi-body-card ul {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
        }
        .code-block-display {
            background-color: var(--panel-top);
            padding: 1rem;
            border-left: 4px solid var(--accent-color);
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            margin: 1rem 0;
            color: var(--text-main);
            overflow-x: auto;
        }
        .materi-navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
        }
    </style>
</head>
<body>

    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo"><i class="fa-solid fa-code-branch"></i> NgodingKuy</div>
            
            <button id="burger-menu" class="burger-btn">
                <i class="fa-solid fa-bars"></i>
            </button>

            <ul id="nav-links" class="nav-links">
                <li><a href="index.php#hero"><i class="fa-solid fa-house"></i> Home</a></li>
                <li><a href="index.php#materi-section"><i class="fa-solid fa-book"></i> Materi</a></li>
                <li><a href="index.php#editor-section"><i class="fa-solid fa-laptop-code"></i> Live Editor</a></li>
                <li><a href="index.php#quiz-section"><i class="fa-solid fa-graduation-cap"></i> Kuis</a></li>
                <li><a href="index.php#testimoni-section"><i class="fa-solid fa-comments"></i> Testimoni</a></li>
            </ul>
            <button id="theme-toggle" class="btn-theme"><i class="fa-solid fa-moon"></i></button>
        </div>
    </nav>

    <header class="hero" style="padding: 3rem 2rem;">
        <div class="hero-content">
            <h1><i class="fa-brands fa-html5"></i> Dasar HTML5 & CSS3</h1>
            <p>Pahami konsep struktur dan penghias halaman web sebelum mulai mempraktikkannya.</p>
        </div>
    </header>

    <main class="container" style="max-width: 900px; padding-top: 2rem;">
        
        <article class="materi-body-card">
            <h2>Bab 1: Pengenalan HTML</h2>
            <p><strong>HTML (HyperText Markup Language)</strong> adalah bahasa markup standar yang digunakan untuk membuat kerangka dasar sebuah halaman web. HTML menentukan bagaimana konten terstruktur pada browser.</p>
            
            <h3>1. Struktur Dokumen Dasar HTML</h3>
            <p>Setiap berkas HTML wajib memiliki struktur kerangka standar seperti berikut:</p>
            
            <div class="code-block-display">
&lt;!DOCTYPE html&gt;<br>
&lt;html&gt;<br>
&lt;head&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;title&gt;Judul Halaman&lt;/title&gt;<br>
&lt;/head&gt;<br>
&lt;body&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Ini Judul Utama&lt;/h1&gt;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt;Ini adalah sebuah paragraf.&lt;/p&gt;<br>
&lt;/body&gt;<br>
&lt;/html&gt;
            </div>

            <h3>2. Elemen Penting HTML</h3>
            <ul>
                <li><strong>Heading (&lt;h1&gt; sampai &lt;h6&gt;):</strong> Digunakan untuk membuat judul atau sub-judul materi.</li>
                <li><strong>Paragraph (&lt;p&gt;):</strong> Digunakan untuk menulis teks paragraf biasa.</li>
                <li><strong>Style (&lt;style&gt;):</strong> Digunakan untuk menyisipkan aturan hiasan CSS langsung di dalam file HTML.</li>
            </ul>
        </article>

        <article class="materi-body-card">
            <h2>Bab 2: Pengenalan CSS Dasar</h2>
            <p><strong>CSS (Cascading Style Sheets)</strong> bertanggung jawab untuk mengatur tampilan visual halaman web, mulai dari warna teks, font, ukuran, hingga tata letak layout elemen HTML.</p>
            
            <h3>Contoh Penerapan Pewarnaan Elemen:</h3>
            <div class="code-block-display">
&lt;style&gt;<br>
&nbsp;&nbsp;h1 {<br>
&nbsp;&nbsp;&nbsp;&nbsp;color: #4f46e5; /* Mengubah warna teks judul */<br>
&nbsp;&nbsp;&nbsp;&nbsp;text-align: center; /* Membuat judul ke tengah */<br>
&nbsp;&nbsp;}<br>
&lt;/style&gt;
            </div>
        </article>

        <div class="materi-navigation">
            <a href="index.php#materi-section" class="btn-danger" style="text-decoration: none;"><i class="fa-solid fa-arrow-left"></i> Kembali ke Menu</a>
            <a href="index.php#editor-section" class="btn-success" style="text-decoration: none;">Praktik di Live Editor <i class="fa-solid fa-laptop-code"></i></a>
        </div>

    </main>

    <footer class="footer">
        <p>&copy; 2026 <strong>NgodingKuy</strong>. Semua materi disiapkan untuk menunjang pengerjaan tugas akhir.</p>
    </footer>

    <script src="assets/js/main-editor.js"></script>
</body>
</html>