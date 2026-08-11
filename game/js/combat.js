const CombatLogic = (function() {
    
    const sfx = {
        shoot: new Audio('assets/sounds/sfx_shoot.mp3'),
        melee: new Audio('assets/sounds/sfx_melee.mp3'),
        correct: new Audio('assets/sounds/sfx_correct.mp3'),
        wrong: new Audio('assets/sounds/sfx_wrong.mp3'),
        menuBgm: new Audio('assets/sounds/sound_games.mp3'),       
        zombieAttack: new Audio('assets/sounds/zombie_attack.mp3') 
    };

    sfx.menuBgm.loop = true; 
    sfx.menuBgm.volume = 0.4; 

    /* Memasukkan seluruh aset gambar sprite ke dalam cache memori sebelum pertempuran dimulai */
    function initSprites() {
        SpriteSystem.preload('assets/images/player/Idle', 10);
        SpriteSystem.preload('assets/images/player/Shoot', 3);
        SpriteSystem.preload('assets/images/player/Melee', 7);
        SpriteSystem.preload('assets/images/player/Slide', 5);
        SpriteSystem.preload('assets/images/player/Dead', 10);
        
        SpriteSystem.preload('assets/images/zombie/Idle', 15);
        SpriteSystem.preload('assets/images/zombie/Attack', 10);
        SpriteSystem.preload('assets/images/zombie/Walk', 10);
        SpriteSystem.preload('assets/images/zombie/Dead', 10);

        resetToIdle();
    }

    /* Memutar musik latar belakang (BGM) utama di area menu pemilihan materi dan peta level */
    function playMenuBGM() {
        sfx.menuBgm.play().catch(e => {
            console.log("Menunggu interaksi user untuk memutar BGM menu...");
        });
    }

    /* Menghentikan pemutaran musik latar belakang menu secara total saat masuk ke layar pertempuran kuis */
    function stopMenuBGM() {
        sfx.menuBgm.pause();
        sfx.menuBgm.currentTime = 0;
    }

    /* Mengembalikan posisi koordinat, arah hadap, dan loop animasi default (Idle) bagi player maupun zombie */
    function resetToIdle() {
        const pImg = document.getElementById('player-img');
        const zImg = document.getElementById('zombie-img');

        if (pImg) {
            pImg.style.transition = "transform 0.5s ease-out";
            pImg.style.transform = "translateX(0) scaleX(1)";
            SpriteSystem.loop('player-img', 'assets/images/player/Idle', 10, 100);
        }
        if (zImg) {
            zImg.style.transition = "transform 0.5s ease-out";
            zImg.style.transform = "translateX(0) scaleX(-1)";
            SpriteSystem.loop('zombie-img', 'assets/images/zombie/Idle', 15, 100);
        }
    }

    /* Memicu aksi visual animasi menyerang bagi player, efek berkedip bagi zombie, serta memutar audio yang sesuai ketika jawaban benar */
    function triggerCorrectAnswer(comboCount, monsterHp, isDead, callbackNextQuestion) {
        sfx.correct.currentTime = 0;
        sfx.correct.play().catch(e => {});

        const pImg = document.getElementById('player-img');
        const isMelee = Math.random() > 0.5;

        if (isMelee) {
            if (pImg) pImg.style.transform = "translateX(140px) scaleX(1)";
            
            sfx.melee.currentTime = 0;
            sfx.melee.play().catch(e => {});
            
            SpriteSystem.play('player-img', 'assets/images/player/Slide', 5, 80, () => {
                SpriteSystem.play('player-img', 'assets/images/player/Melee', 7, 80, () => {
                    resetToIdle();
                });
            });
        } else {
            if (pImg) pImg.style.transform = "translateX(20px) scaleX(1)"; 
            
            sfx.shoot.currentTime = 0;
            sfx.shoot.play().catch(e => {});
            
            SpriteSystem.play('player-img', 'assets/images/player/Shoot', 3, 100, () => {
                resetToIdle();
            });
        }

        const zImg = document.getElementById('zombie-img');
        if (zImg) {
            zImg.classList.add('anim-damage');
            setTimeout(() => zImg.classList.remove('anim-damage'), 400);
        }

        if (isDead) {
            setTimeout(() => {
                SpriteSystem.play('zombie-img', 'assets/images/zombie/Dead', 10, 100, () => {
                    if (typeof callbackNextQuestion === "function") callbackNextQuestion();
                });
            }, 400);
        } else {
            if (typeof callbackNextQuestion === "function") setTimeout(callbackNextQuestion, 1200);
        }
    }

    /* Memicu pergerakan zombie mendekat, animasi mencakar, efek guncangan pada player, serta memutar audio gagal ketika jawaban salah */
    function triggerWrongAnswer(playerHp, isDead, callbackNextQuestion) {
        sfx.wrong.currentTime = 0;
        sfx.wrong.play().catch(e => {});

        const zImg = document.getElementById('zombie-img');
        if (zImg) zImg.style.transform = "translateX(-140px) scaleX(-1)";

        SpriteSystem.play('zombie-img', 'assets/images/zombie/Walk', 10, 80, () => {
            
            sfx.zombieAttack.currentTime = 0;
            sfx.zombieAttack.play().catch(e => {});

            SpriteSystem.play('zombie-img', 'assets/images/zombie/Attack', 10, 80, () => {
                
                const pImg = document.getElementById('player-img');
                if (pImg) pImg.classList.add('anim-damage');
                
                if (isDead) {
                    SpriteSystem.play('player-img', 'assets/images/player/Dead', 10, 100, () => {
                        if (typeof callbackNextQuestion === "function") callbackNextQuestion();
                    });
                } else {
                    resetToIdle();
                    if (typeof callbackNextQuestion === "function") setTimeout(callbackNextQuestion, 500);
                }
            });
        });
    }

    return { initSprites, triggerCorrectAnswer, triggerWrongAnswer, resetToIdle, playMenuBGM, stopMenuBGM };
})();