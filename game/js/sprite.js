/* =========================================
   SISTEM ANIMASI SPRITE 2D
   ========================================= */
const SpriteSystem = (function() {
    
    // Cache memori untuk mencegah gambar berkedip (flicker)
    const preloadedImages = {};

    function resolvePath(path) {
        const p = window.location.pathname;
        const isRoot = p.endsWith('game.html') || (!p.includes('/game/') && !p.endsWith('game/index.html'));
        if (isRoot && !path.startsWith('game/')) {
            return 'game/' + path;
        }
        return path;
    }

    /**
     * Memuat gambar ke memori browser sebelum digunakan.
     * @param {string} basePath - Path folder (misal: 'assets/images/player/Idle')
     * @param {number} frameCount - Total gambar (misal: 10)
     */
    function preload(basePath, frameCount) {
        const resolved = resolvePath(basePath);
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `${resolved} (${i}).png`;
            preloadedImages[`${basePath}_${i}`] = img;
        }
    }

    /**
     * Memainkan animasi SATU KALI lalu berhenti (misal: Menembak, Mati).
     */
    function play(elementId, basePath, frameCount, speed, onComplete) {
        const el = document.getElementById(elementId);
        if (!el) return;

        let currentFrame = 1;
        const resolved = resolvePath(basePath);
        
        if (el.dataset.intervalId) {
            clearInterval(parseInt(el.dataset.intervalId));
        }

        const interval = setInterval(() => {
            el.src = `${resolved} (${currentFrame}).png`;
            
            if (currentFrame >= frameCount) {
                clearInterval(interval);
                el.dataset.intervalId = "";
                
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
     * Memainkan animasi BERULANG-ULANG (Looping, misal: Idle / Diam).
     */
    function loop(elementId, basePath, frameCount, speed) {
        const el = document.getElementById(elementId);
        if (!el) return;

        let currentFrame = 1;
        const resolved = resolvePath(basePath);
        
        if (el.dataset.intervalId) {
            clearInterval(parseInt(el.dataset.intervalId));
        }

        const interval = setInterval(() => {
            el.src = `${resolved} (${currentFrame}).png`;
            currentFrame = (currentFrame % frameCount) + 1;
        }, speed);

        el.dataset.intervalId = interval;
    }

    return { preload, play, loop };
})();