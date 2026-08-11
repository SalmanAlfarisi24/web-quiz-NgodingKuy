/* =========================================
   SISTEM ANIMASI SPRITE 2D
   ========================================= */
const SpriteSystem = (function() {
    
    // Cache memori untuk mencegah gambar berkedip (flicker)
    const preloadedImages = {};

    /**
     * Memuat gambar ke memori browser sebelum digunakan.
     * @param {string} basePath - Path folder (misal: 'assets/images/player/Idle')
     * @param {number} frameCount - Total gambar (misal: 10)
     */
    function preload(basePath, frameCount) {
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `${basePath} (${i}).png`;
            preloadedImages[`${basePath}_${i}`] = img;
        }
        console.log(`Preloaded: ${basePath} (${frameCount} frames)`);
    }

    /**
     * Memainkan animasi SATU KALI lalu berhenti (misal: Menembak, Mati).
     * @param {string} elementId - ID dari tag <img> di HTML
     * @param {string} basePath - Path gambar tanpa angka
     * @param {number} frameCount - Total frame
     * @param {number} speed - Kecepatan tiap frame dalam milidetik
     * @param {function} onComplete - Fungsi yang dipanggil setelah animasi selesai
     */
    function play(elementId, basePath, frameCount, speed, onComplete) {
        const el = document.getElementById(elementId);
        if (!el) return;

        let currentFrame = 1;
        
        // Hentikan animasi sebelumnya jika ada agar tidak bentrok
        if (el.dataset.intervalId) {
            clearInterval(parseInt(el.dataset.intervalId));
        }

        const interval = setInterval(() => {
            el.src = `${basePath} (${currentFrame}).png`;
            
            if (currentFrame >= frameCount) {
                // Hentikan interval saat mencapai frame terakhir
                clearInterval(interval);
                el.dataset.intervalId = "";
                
                // Panggil callback (misal: kembali ke pose Idle)
                if (typeof onComplete === "function") {
                    onComplete();
                }
            } else {
                currentFrame++;
            }
        }, speed);

        el.dataset.intervalId = interval;
    }

    /**
     * Memainkan animasi BERULANG-ULANG (misal: Idle, Walk, Run).
     * @param {string} elementId - ID dari tag <img> di HTML
     * @param {string} basePath - Path gambar tanpa angka
     * @param {number} frameCount - Total frame
     * @param {number} speed - Kecepatan tiap frame dalam milidetik
     */
    function loop(elementId, basePath, frameCount, speed) {
        const el = document.getElementById(elementId);
        if (!el) return;

        let currentFrame = 1;

        if (el.dataset.intervalId) {
            clearInterval(parseInt(el.dataset.intervalId));
        }

        const interval = setInterval(() => {
            el.src = `${basePath} (${currentFrame}).png`;
            currentFrame = currentFrame >= frameCount ? 1 : currentFrame + 1;
        }, speed);

        el.dataset.intervalId = interval;
    }

    // Mengekspos fungsi agar bisa dipanggil dari file JS lain
    return { preload, play, loop };
})();