# 🧠 PROJECT MEMORY & LOGS PERUBAHAN - WEB QUIZ NGODINGKUY

File memory ini mencatat secara lengkap seluruh riwayat perubahan kode, arsitektur proyek, serta aturan acuan posisi terkunci agar selalu terekam dengan jelas dan tidak berubah.

---

## 🔒 ATURAN BASELINE TERKUNCI (LOCKED COMBAT POSITIONS)

> [!IMPORTANT]
> **DILARANG MENGUBAH / DIKUNCI MATI (LOCKED BASELINE)**:
> Koordinat dan aturan tata letak arena combat di bawah ini adalah acuan baku yang **TIDAK BOLEH diubah-ubah lagi** saat melakukan penyesuaian/pengembangan fitur lain (seperti Boss scaling, Aura, dll) di masa mendatang:

1. **Wadah Entitas Arena (`.entity`)**:
   - `.entity { height: 190px; justify-content: flex-end; display: flex; flex-direction: column; align-items: center; }`

2. **Ketinggian Pijakan Rumput Karakter (`.sprite`)**:
   - `#player-img { position: relative; top: -14px; }` (Sepatu boots player berdiri pas di atas garis rumput).
   - `#zombie-img { position: relative; top: -26px; }` (Sepatu sneakers monster berdiri pas & sejajar lurus mendatar dengan sepatu player di atas rumput).

3. **Urutan & Ketinggian HUD (Nama & Bar HP)**:
   - `.entity-name { order: -2; margin-bottom: 4px; }` (**Label Nama berada di paling atas**).
   - `.hp-container { order: -1; }` (**Bar HP berada di bawah nama, melayang di atas kepala karakter**).
   - `#player-entity .hp-container { margin-bottom: 26px; }` (**Bar HP & Nama Player melayang di langit**).
   - `#monster-entity .hp-container { margin-bottom: 38px; }` (**Bar HP & Nama Monster melayang di langit, sejajar lurus horizontal dengan HP Player**).

---

## 📌 1. Informasi Proyek
- **Nama Proyek**: Code Journey - Arena Game (web-quiz-NgodingKuy)
- **Teknologi**: HTML5, Vanilla CSS3, JavaScript (ES6+), FontAwesome 6, Custom Audio SFX.
- **Struktur Materi & Level**: 
  - 5 Modul Materi: **HTML5**, **CSS3**, **JavaScript**, **PHP**, **MySQL Database**.
  - Total Level: **15 Level per Materi** ($5 \times 15 = 75$ Level Keseluruhan).
  - Pembagian Level:
    - **Level 1–4**: Normal (Fundamental)
    - **Level 5**: 👑 **MINI BOSS** (Mini Milestone)
    - **Level 6–9**: Normal (Intermediate)
    - **Level 10**: 👑 **MINI BOSS** (Major Milestone)
    - **Level 11–14**: Normal (Advanced)
    - **Level 15**: ☠️ **MASTER BOSS** (Full Expert)

---

## 📝 2. Riwayat Lengkap Perubahan Kode (Change Logs)

### 🔹 A. Penyesuaian Posisi Karakter di Area Combat (`game/css/layout.css`)
- **`#player-img` (Karakter Player)**:
  - Mengubah `top: 6px` menjadi `position: relative; top: -14px;`.
  - **Hasil**: Karakter player terangkat naik sekitar 20px, sepatu boots berada pas di atas garis rumput hijau (tidak amblas ke bebatuan).
- **`#zombie-img` (Karakter Monster)**:
  - Mengubah `top: -14px` menjadi `position: relative; top: -26px;`.
  - **Hasil**: Karakter zombie terangkat naik sekitar 26px, sepatu sneakers monster sejajar lurus mendatar dengan pijakan player di atas rumput.

### 🔹 B. Penyesuaian HUD (Nama Karakter & Bar HP) (`game/css/layout.css`)
- **Struktur Flexbox Entitas (`.entity`)**:
  - Ditambahkan `height: 190px; justify-content: flex-end; display: flex; flex-direction: column; align-items: center;`.
- **Urutan Elemen (Reordering)**:
  - `.entity-name` (Label Nama): Diatur `order: -2;` (**Berada di paling atas**).
  - `.hp-container` (Bar HP): Diatur `order: -1;` (**Berada di bawah nama, di atas kepala karakter**).
- **Pemisahan Aturan CSS Independen (Player vs Monster)**:
  - Dipisahkan menjadi selector CSS terpisah agar dapat diatur sendiri-sendiri:
    ```css
    #player-entity .hp-container {
      margin-bottom: 26px;
    }

    #monster-entity .hp-container {
      margin-bottom: 38px;
    }
    ```
  - **Hasil**: Bar HP dan Nama untuk **Kamu (Player)** dan **Monster** kini melayang di area langit dengan lega (tidak menempel di kepala/topi) dan posisinya **berada dalam 1 garis lurus horizontal yang sempurna**.

---

## 🗺️ 3. Rencana Fitur & Pengembangan Mendatang (Roadmap & Plans)

### 🎯 Plan 1: Kustomisasi Visual & Efek Mini Boss / Master Boss
- **Tipe 1: Efek Visual CSS (Aura, Scaling & Glow)**
  - **Mini Boss (Level 5 & 10)**:
    - Ukuran sprite diperbesar $+25\%$ (Tampak lebih tegap & perkasa).
    - Aura Crimson/Oranye berpijar (`drop-shadow` / glowing pulsing animation).
    - Label Nama bertuliskan `👑 MINI BOSS (HP)`.
  - **Master Boss (Level 15)**:
    - Ukuran sprite raksasa $+50\%$ (Memenuhi arena).
    - Aura Kegelapan/Ungu Kegelapan berpijar (`Dark Energy Aura`).
    - Label Nama bertuliskan `☠️ MASTER BOSS (HP)` dengan bar HP emas/ungu menyala.
    - Efek guncangan layar (*Screen Shake*) saat menyerang.

- **Tipe 2: Custom Sprite & SFX Khusus**
  - Membuat folder sprite terpisah di `game/assets/images/boss_mini/` dan `game/assets/images/boss_master/`.
  - Menambahkan atribut `"sprite"` pada `questions.json`.
  - Menyesuaikan `game/js/combat.js` untuk me-load sprite dan efek suara (*roar*) khusus Boss saat level Boss dimulai.

---

*File memory ini telah dikunci (LOCKED) untuk parameter posisi baseline karakter & HUD.*
