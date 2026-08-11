window.Game = (function() {
    
    let usernameSession = localStorage.getItem("ngodingkuy_username") || "guest_" + Math.floor(Math.random() * 1000);
    
    const FallbackGameData = {
        worlds: [
            { id: "html", name: "HTML Dasar", icon: "🌐", color: "#E44D26" },
            { id: "css", name: "CSS Styling", icon: "🎨", color: "#264DE4" },
            { id: "php", name: "PHP Scripting", icon: "🐘", color: "#777BB4" },
            { id: "database", name: "MySQL Database", icon: "💾", color: "#00758F" }
        ],
        levels: {
            "html": [{ id: 1, hp: 50 }, { id: 2, hp: 80 }, { id: 3, hp: 120 }],
            "css": [{ id: 1, hp: 60 }, { id: 2, hp: 90 }, { id: 3, hp: 130 }],
            "php": [{ id: 1, hp: 70 }, { id: 2, hp: 100 }, { id: 3, hp: 140 }],
            "database": [{ id: 1, hp: 80 }, { id: 2, hp: 110 }, { id: 3, hp: 150 }]
        },
        questions: {
            "html": [
                { "q": "Tag apa yang digunakan untuk membuat paragraf?", "options": ["<p>", "<h1>", "<a>", "<div>"], "a": 0 }
            ],
            "css": [
                { "q": "Properti CSS mana yang digunakan untuk mengubah warna teks?", "options": ["text-color", "font-color", "color", "background-color"], "a": 2 }
            ],
            "php": [
                { "q": "Karakter mana yang digunakan untuk memulai variabel di PHP?", "options": ["&", "!", "$", "#"], "a": 2 }
            ],
            "database": [
                { "q": "Perintah SQL mana yang digunakan untuk mengambil data dari database?", "options": ["GET", "OPEN", "SELECT", "EXTRACT"], "a": 2 }
            ]
        }
    };

    let player = {
        level: 1, xp: 0, coins: 100, gems: 10,
        hp: 100, maxHp: 100,
        progress: { 'html': 1, 'css': 1, 'php': 1, 'database': 1 }
    };

    let combatState = {
        active: false, worldId: '', levelId: 0,
        monsterHp: 0, monsterMaxHp: 0,
        questions: [], currentQ: 0, combo: 0,
        timeLeft: 15, timerInterval: null
    };

    /* Menghubungkan sistem game dengan asset sprite dan memuat data lokal */
    function init() {
        CombatLogic.initSprites();
        if (!window.GameData || !window.GameData.worlds) {
            window.GameData = FallbackGameData;
        }
        loadUserData();
        listenLeaderboard();
    }

    /* Mengambil data progres, level, koin, dan gem pengguna dari localStorage */
    function loadUserData() {
        try {
            const storageKey = `ngodingkuy_gamedata_${usernameSession}`;
            const saved = localStorage.getItem(storageKey) || localStorage.getItem("ngodingkuy_gamedata");
            if (saved) {
                const data = JSON.parse(saved);
                player.level = parseInt(data.level) || 1;
                player.xp = parseInt(data.xp) || 0;
                player.coins = parseInt(data.coins) || 100;
                player.gems = parseInt(data.gems) || 10;
                player.progress = typeof data.progress === 'object' ? data.progress : JSON.parse(data.progress || '{}');
                player.maxHp = 100 + (player.level * 20);
            } else {
                saveUserData();
            }
        } catch (e) {
            console.error("Gagal memuat data game dari localStorage, menggunakan profil default.", e);
        }
        updateHUD();
        renderWorlds();
    }

    /* Menyimpan kondisi state data game terbaru milik pengguna ke localStorage */
    function saveUserData() {
        try {
            const storageKey = `ngodingkuy_gamedata_${usernameSession}`;
            const gameObj = {
                level: player.level,
                xp: player.xp,
                coins: player.coins,
                gems: player.gems,
                progress: player.progress
            };
            localStorage.setItem(storageKey, JSON.stringify(gameObj));
            localStorage.setItem("ngodingkuy_gamedata", JSON.stringify(gameObj));
            updateLeaderboardStorage();
        } catch (err) {
            console.error("Gagal menyimpan pembaharuan data progres ke localStorage:", err);
        }
    }

    /* Memperbarui & membaca data papan peringkat berkala dari localStorage */
    function updateLeaderboardStorage() {
        try {
            const raw = localStorage.getItem("ngodingkuy_game_leaderboard");
            let list = [];
            if (raw) {
                try { list = JSON.parse(raw); } catch(e) { list = []; }
            }
            if (!Array.isArray(list) || list.length === 0) {
                list = [
                    { username: "Salman Alfarisi", level: 5, xp: 450 },
                    { username: "Budi Santoso", level: 3, xp: 280 },
                    { username: "Siti Rahma", level: 2, xp: 150 }
                ];
            }
            const idx = list.findIndex(u => u.username.toLowerCase() === usernameSession.toLowerCase());
            if (idx !== -1) {
                list[idx].level = player.level;
                list[idx].xp = player.xp;
            } else {
                list.push({ username: usernameSession, level: player.level, xp: player.xp });
            }
            list.sort((a, b) => b.xp - a.xp);
            localStorage.setItem("ngodingkuy_game_leaderboard", JSON.stringify(list));
        } catch (e) {
            console.error("Gagal memperbarui leaderboard:", e);
        }
    }

    function listenLeaderboard() {
        updateLeaderboardStorage();
        try {
            const raw = localStorage.getItem("ngodingkuy_game_leaderboard");
            let rankList = raw ? JSON.parse(raw) : [];
            const tbody = document.getElementById("leaderboard-body");
            if (!tbody) return;
            tbody.innerHTML = "";

            if (rankList && rankList.length > 0) {
                rankList.forEach((u, idx) => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${idx + 1}</td>
                        <td style="font-weight:bold; color:${u.username === usernameSession ? '#F5A623' : 'inherit'}">
                            ${escapeHTML(u.username)} ${u.username === usernameSession ? '(Kamu)' : ''}
                        </td>
                        <td>Lvl ${u.level}</td>
                        <td>${u.xp} XP</td>
                    `;
                    tbody.appendChild(row);
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data peringkat.</td></tr>`;
            }
        } catch (err) {
            console.error("Gagal memuat papan peringkat:", err);
        }
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
    }

    /* Menyinkronkan variabel nilai pada elemen penanda status di bar bagian atas dashboard */
    function updateHUD() {
        const newLevel = Math.floor(player.xp / 100) + 1;
        if(newLevel > player.level) {
            player.level = newLevel;
            player.maxHp = 100 + (player.level * 20);
            saveUserData();
        }

        document.getElementById('hud-level').innerText = player.level;
        document.getElementById('hud-xp').innerText = player.xp;
        document.getElementById('hud-coins').innerText = player.coins;
        document.getElementById('hud-gems').innerText = player.gems;
    }

    /* Mengatur sistem perpindahan kelas aktif pada elemen kontainer layar utama game */
    function showScreen(screenId, navBtn = null) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(`screen-${screenId}`).classList.add('active');
        
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            navBtn.classList.add('active');
        }
    }

    /* Merender daftar pilihan kategori materi pemrograman pada halaman utama game */
    function renderWorlds() {
        const container = document.getElementById('worlds-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (!window.GameData || !window.GameData.worlds) return;

        window.GameData.worlds.forEach(w => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span style="font-size:1.5rem">${w.icon}</span> ${w.name}`;
            btn.style.borderLeft = `5px solid ${w.color}`;
            btn.onclick = () => openWorld(w.id);
            container.appendChild(btn);
        });
    }

    /* Membuka sub-peta tingkat kesulitan level berbasis zigzag winding path */
    function openWorld(worldId) {
        if (!window.GameData) return;

        const world = window.GameData.worlds.find(w => w.id === worldId);
        document.getElementById('current-world-title').innerText = world.name;
        
        const container = document.getElementById('nodes-container');
        if (!container) return;
        container.innerHTML = '';
        
        const levels = window.GameData.levels[worldId] || [];
        const playerMaxLevel = player.progress[worldId] || 1;

        // Pattern offset horizontal untuk menciptakan rute berkelok-kelok (zigzag winding map)
        const offsets = [0, -60, -95, -55, 0, 55, 95, 60, 0, -60, -95, -55, 0, 55, 95];

        levels.forEach((lvl, idx) => {
            const btn = document.createElement('button');
            const isBoss = lvl.type === 'boss';
            const isCompleted = lvl.id < playerMaxLevel;
            const isCurrent = lvl.id === playerMaxLevel;
            const isLocked = lvl.id > playerMaxLevel;

            btn.className = `node-btn ${isBoss ? 'boss' : ''} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`;
            
            const offsetPx = isBoss ? 0 : (offsets[idx % offsets.length] || 0);
            btn.style.transform = `translateX(${offsetPx}px)`;

            let iconHtml = '';
            if (isLocked) {
                btn.disabled = true;
                iconHtml = `<span class="node-icon">🔒</span><span class="node-num">Lvl ${lvl.id}</span>`;
            } else if (isBoss) {
                iconHtml = `<span class="node-icon">👑</span><span class="node-num">BOSS ${lvl.id}</span>`;
                btn.onclick = () => prepareCombat(worldId, lvl);
            } else if (isCompleted) {
                iconHtml = `<span class="node-icon">⭐</span><span class="node-num">Lvl ${lvl.id}</span>`;
                btn.onclick = () => prepareCombat(worldId, lvl);
            } else {
                iconHtml = `<span class="node-icon">⚔️</span><span class="node-num">Lvl ${lvl.id}</span>`;
                btn.onclick = () => prepareCombat(worldId, lvl);
            }

            btn.innerHTML = iconHtml;
            btn.title = `${lvl.name} (HP Monster: ${lvl.hp})`;
            container.appendChild(btn);
        });

        showScreen('map');
    }

    /* Mempersiapkan parameter awal state pertempuran, mereset audio, serta mengacak urutan soal kuis */
    function prepareCombat(worldId, levelData) {
        player.hp = player.maxHp;
        
        let shuffledQs = [...window.GameData.questions[worldId]].sort(() => Math.random() - 0.5);

        combatState = {
            active: true, worldId: worldId, levelId: levelData.id,
            monsterHp: levelData.hp, monsterMaxHp: levelData.hp,
            questions: shuffledQs, currentQ: 0, combo: 0, timeLeft: 15
        };

        CombatLogic.resetToIdle();
        CombatLogic.stopMenuBGM();

        document.getElementById('player-hp-txt').innerText = player.hp;
        document.getElementById('monster-hp-txt').innerText = levelData.hp;
        
        updateHealthBars();
        updateCombatHUD();
        showScreen('combat');
        nextQuestion();
    }

    /* Mengambil dan menampilkan komponen pertanyaan serta pilihan jawaban ke dalam panel kuis */
    function nextQuestion() {
        if (!combatState.active) return;
        
        if (combatState.monsterHp <= 0) { endCombat(true); return; }
        if (player.hp <= 0) { endCombat(false); return; }
        
        if (combatState.currentQ >= combatState.questions.length) {
            combatState.currentQ = 0;
        }

        const q = combatState.questions[combatState.currentQ];
        document.getElementById('question-text').innerText = q.q;
        
        const optContainer = document.getElementById('options-container');
        optContainer.innerHTML = '';
        
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => handleAnswer(btn, idx, q.a);
            optContainer.appendChild(btn);
        });

        document.getElementById('btn-hint').disabled = false;
        resetTimer();
    }

    /* Perbaikan Inti: Eksekusi penentuan menang/kalah mandiri menggunakan jeda waktu aman (Anti-Stuck) */
    function handleAnswer(btnElement, selectedIdx, correctIdx) {
        clearInterval(combatState.timerInterval);
        
        const options = document.querySelectorAll('#options-container .option-btn');
        options.forEach(b => b.disabled = true); 

        if (selectedIdx === correctIdx) {
            if (btnElement) btnElement.classList.add('correct');
            combatState.combo++;
            
            let damage = 15 + (combatState.combo * 2);
            combatState.monsterHp = Math.max(0, combatState.monsterHp - damage);
            let isDead = combatState.monsterHp <= 0;
            
            updateHealthBars();
            updateCombatHUD();

            // Pemicu aksi visual animasi (tidak mengikat jalannya kelangsungan logika game)
            CombatLogic.triggerCorrectAnswer(combatState.combo, combatState.monsterHp, isDead, () => {});

            // Perpindahan state terproteksi jaminan waktu pasti muncul popup
            if (isDead) {
                setTimeout(() => {
                    endCombat(true);
                }, 1200);
            } else {
                setTimeout(() => {
                    combatState.currentQ++;
                    nextQuestion();
                }, 1200);
            }

        } else {
            if (btnElement) btnElement.classList.add('wrong');
            if (correctIdx !== -1 && options[correctIdx]) options[correctIdx].classList.add('correct');
            
            combatState.combo = 0;
            let damage = 20;
            player.hp = Math.max(0, player.hp - damage);
            let isDead = player.hp <= 0;

            updateHealthBars();
            updateCombatHUD();

            // Pemicu aksi visual monster menyerang balik
            CombatLogic.triggerWrongAnswer(player.hp, isDead, () => {});

            // Perpindahan state terproteksi jaminan waktu pasti muncul popup
            if (isDead) {
                setTimeout(() => {
                    endCombat(false);
                }, 1500);
            } else {
                setTimeout(() => {
                    combatState.currentQ++;
                    nextQuestion();
                }, 1500);
            }
        }
    }

    /* Menyinkronkan persentase lebar bar nyawa visual karakter berdasarkan sisa poin kesehatan */
    function updateHealthBars() {
        const pPct = (player.hp / player.maxHp) * 100;
        const mPct = (combatState.monsterHp / combatState.monsterMaxHp) * 100;
        
        document.getElementById('player-hp-bar').style.width = `${pPct}%`;
        document.getElementById('player-hp-txt').innerText = player.hp;
        
        document.getElementById('monster-hp-bar').style.width = `${mPct}%`;
        document.getElementById('monster-hp-txt').innerText = Math.floor(combatState.monsterHp);
    }

    /* Memperbarui tampilan angka combo hit beserta hitungan mundur sisa waktu berpikir */
    function updateCombatHUD() {
        document.getElementById('combo-count').innerText = combatState.combo;
        document.getElementById('time-left').innerText = combatState.timeLeft;
    }

    /* Menghentikan interval lama dan memicu ulang hitungan mundur 15 detik batas menjawab kuis */
    function resetTimer() {
        clearInterval(combatState.timerInterval);
        combatState.timeLeft = 15;
        updateCombatHUD();
        
        combatState.timerInterval = setInterval(() => {
            combatState.timeLeft--;
            updateCombatHUD();
            
            if (combatState.timeLeft <= 0) {
                handleAnswer(null, -1, combatState.questions[combatState.currentQ].a);
            }
        }, 1000);
    }

    /* Menghentikan jalannya pertempuran dan mengalkulasi penambahan perolehan reward koin serta tingkat XP */
    function endCombat(isVictory) {
        combatState.active = false;
        clearInterval(combatState.timerInterval);

        const overlay = document.getElementById('reward-popup');
        const title = document.getElementById('popup-title');
        const stats = document.getElementById('reward-stats');

        if (!overlay) return;
        overlay.classList.add('show');
        title.innerText = isVictory ? "Level Selesai! 🎉" : "Game Over! 💀";
        title.style.color = isVictory ? "var(--hp-green)" : "var(--hp-red)";
        
        if (isVictory) {
            if (stats) stats.style.display = "grid";
            let rewardXp = 30 + (combatState.levelId * 10);
            let rewardCoins = 10 + (combatState.levelId * 5);
            
            player.xp += rewardXp;
            player.coins += rewardCoins;
            
            document.getElementById('reward-xp').innerText = rewardXp;
            document.getElementById('reward-coins').innerText = rewardCoins;

            if (player.progress[combatState.worldId] === combatState.levelId) {
                player.progress[combatState.worldId]++;
            }
        } else {
            if (stats) stats.style.display = "none";
        }
        updateHUD();
        saveUserData();
    }

    /* Menutup kotak pop-up pengumuman kelulusan level dan mengarahkan user kembali ke peta materi */
    function closePopup() {
        document.getElementById('reward-popup').classList.remove('show');
        CombatLogic.resetToIdle();
        CombatLogic.playMenuBGM();
        openWorld(combatState.worldId);
    }

    /* Mengurangi saldo koin pemain untuk menyembunyikan dua opsi jawaban kuis yang salah */
    function useHint() {
        if (player.coins >= 10) {
            player.coins -= 10;
            updateHUD();
            saveUserData();
            
            const q = combatState.questions[combatState.currentQ];
            const options = document.querySelectorAll('#options-container .option-btn');
            let removed = 0;
            
            options.forEach((btn, idx) => {
                if (idx !== q.a && removed < 2) {
                    btn.style.opacity = '0.3';
                    btn.disabled = true;
                    removed++;
                }
            });
            document.getElementById('btn-hint').disabled = true;
        }
    }

    /* Membatalkan jalannya pertempuran secara paksa ditengah jalan atas keinginan pengguna */
    function fleeBattle() {
        if(confirm("Yakin ingin kabur?")) {
            combatState.active = false;
            clearInterval(combatState.timerInterval);
            CombatLogic.resetToIdle();
            CombatLogic.playMenuBGM();
            openWorld(combatState.worldId);
        }
    }

    return {
        init, showScreen, useHint, fleeBattle, closePopup
    };
})();

document.addEventListener('DOMContentLoaded', Game.init);