var sceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneGameOver" });
    },

    init: function (data) {
        // Menerima data skor dari scene sebelumnya
        this.finalScore = data.score || 0;
    },

    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image('BGPlay', 'images/BGPlay.png');
        this.load.image('ButtonPlay', 'images/ButtonPlay.png');
        this.load.image('EfekLedakan', 'images/EfekLedakan.png'); // Untuk efek partikel
        this.load.audio('snd_gameover', 'audio/music_gameover.mp3');
        this.load.audio('snd_touchshooter', 'audio/fx_touch.mp3');
    },

    create: function () {
        // Background
        this.bgPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPlay');
        this.bgPlay.setDepth(0);
        
        // Overlay gelap untuk efek dramatis
        this.overlay = this.add.rectangle(X_POSITION.CENTER, Y_POSITION.CENTER, 
            game.canvas.width, game.canvas.height, 0x000000, 0.6);
        this.overlay.setDepth(1);

        // Efek partikel ledakan
        this.explosionParticles = this.add.particles('EfekLedakan');
        this.explosionParticles.setDepth(5);
        
        // Membuat emitter untuk partikel ledakan
        this.explosionEmitter = this.explosionParticles.createEmitter({
            x: X_POSITION.CENTER,
            y: Y_POSITION.CENTER - 50,
            speed: { min: 50, max: 150 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            quantity: 10,
            frequency: 100
        });

        // Teks "GAME OVER" dengan animasi dramatic
        this.gameOverText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER - 150, 'GAME OVER', {
            fontFamily: 'Verdana, Arial',
            fontSize: '50px',
            color: '#ff3333',
            stroke: '#ffffff',
            strokeThickness: 4,
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#000000',
                blur: 8,
                fill: true
            }
        });
        this.gameOverText.setOrigin(0.5);
        this.gameOverText.setDepth(10);
        this.gameOverText.setAlpha(0);
        this.gameOverText.setScale(0.5);

        // Animasi masuk untuk teks Game Over
        this.tweens.add({
            targets: this.gameOverText,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            ease: 'Back.easeOut',
            delay: 500
        });

        // Animasi bergoyang untuk teks Game Over
        this.tweens.add({
            targets: this.gameOverText,
            rotation: -0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1500
        });

        // Teks skor dengan animasi
        this.scoreText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER - 50, 
            'Score: ' + this.finalScore, {
            fontFamily: 'Verdana, Arial',
            fontSize: '32px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.scoreText.setOrigin(0.5);
        this.scoreText.setDepth(10);
        this.scoreText.setAlpha(0);

        // Animasi fade in untuk skor
        this.tweens.add({
            targets: this.scoreText,
            alpha: 1,
            y: this.scoreText.y,
            duration: 800,
            ease: 'Power2',
            delay: 1000
        });

        // Button Play Again
        this.buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 80, 'ButtonPlay');
        this.buttonPlay.setDepth(10);
        this.buttonPlay.setScale(0.8);
        this.buttonPlay.setAlpha(0);
        this.buttonPlay.setInteractive();

        // Animasi masuk untuk button
        this.tweens.add({
            targets: this.buttonPlay,
            alpha: 1,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 600,
            ease: 'Bounce.easeOut',
            delay: 1500
        });

        // Animasi hover untuk button
        this.buttonPlay.on('pointerover', function () {
            this.scene.tweens.add({
                targets: this.buttonPlay,
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 200,
                ease: 'Power2'
            });
        }, this);

        this.buttonPlay.on('pointerout', function () {
            this.scene.tweens.add({
                targets: this.buttonPlay,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 200,
                ease: 'Power2'
            });
        }, this);

        // Event click button
        this.buttonPlay.on('pointerdown', function () {
            this.playTouchSound();
            this.restartGame();
        }, this);

        // Teks instruksi tambahan
        this.instructionText = this.add.text(X_POSITION.CENTER, Y_POSITION.CENTER + 150, 
            'Tap button to play again', {
            fontFamily: 'Verdana, Arial',
            fontSize: '20px',
            color: '#ffff99',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.instructionText.setOrigin(0.5);
        this.instructionText.setDepth(10);
        this.instructionText.setAlpha(0);

        // Animasi fade in untuk instruksi
        this.tweens.add({
            targets: this.instructionText,
            alpha: 1,
            duration: 600,
            ease: 'Power2',
            delay: 2000
        });

        // Animasi berkedip untuk instruksi
        this.tweens.add({
            targets: this.instructionText,
            alpha: 0.4,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 2500
        });

        // Setup keyboard input (SPACE untuk restart)
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Play background music game over
        this.gameOverMusic = this.sound.add('snd_gameover', {
            volume: 0.6,
            loop: true
        });
        this.gameOverMusic.play();

        // Sound touch
        this.touchSound = this.sound.add('snd_touchshooter', {
            volume: 0.8
        });

        // Auto stop explosion setelah 5 detik
        this.time.delayedCall(5000, function () {
            this.explosionEmitter.stop();
        }, [], this);

        // Efek background animation (optional - membuat background bergerak pelan)
        this.tweens.add({
            targets: this.bgPlay,
            y: this.bgPlay.y + 20,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    },

    update: function () {
        // Check keyboard input untuk restart
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.playTouchSound();
            this.restartGame();
        }
    },

    playTouchSound: function () {
        this.touchSound.play();
    },

    restartGame: function () {
        // Stop musik game over
        this.gameOverMusic.stop();
        
        // Stop efek partikel
        this.explosionEmitter.stop();
        
        // Animasi fade out sebelum restart
        this.cameras.main.fadeOut(800, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', function () {
            // Restart ke scene play
            this.scene.start('scenePlay');
        }, this);
    }
});