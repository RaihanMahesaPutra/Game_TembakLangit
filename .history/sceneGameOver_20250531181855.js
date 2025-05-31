 var sceneGameOver = new Phaser.Class({
            Extends: Phaser.Scene,

            initialize: function () {
                Phaser.Scene.call(this, { key: "sceneGameOver" });
            },

            init: function (data) {
                this.score = data.score || 0;
                this.newRecord = false;
                console.log("Score received:", this.score);
            },

            preload: function () {
                this.load.setBaseURL('https://cdn.jsdelivr.net/gh/photonstorm/phaser3-examples@master/public/assets/');
                this.load.image("BGPlay", "skies/sky1.png");
                this.load.image("ButtonPlay", "sprites/block.png");
            },

            create: function () {
                const centerX = this.scale.width / 2;
                const centerY = this.scale.height / 2;

                // Background
                const bg = this.add.image(centerX, centerY, "BGPlay");
                bg.setDisplaySize(this.scale.width, this.scale.height);
                bg.setTint(0x666666);

                // Dark overlay
                const overlay = this.add.graphics();
                overlay.fillStyle(0x000000, 0.6);
                overlay.fillRect(0, 0, this.scale.width, this.scale.height);

                // Check for new record (using variables instead of localStorage)
                if (typeof window.bestScore === 'undefined') {
                    window.bestScore = 0;
                }

                let bestScore = window.bestScore;
                if (this.score > 0 && this.score > bestScore) {
                    this.newRecord = true;
                    bestScore = this.score;
                    window.bestScore = bestScore;
                }

                // Title
                const titleText = this.newRecord ? "NEW RECORD!" : "GAME OVER";
                const titleColor = this.newRecord ? "#00ff00" : "#ff4444";

                const title = this.add.text(centerX, centerY - 150, titleText, {
                    font: "bold 36px Arial",
                    fill: titleColor,
                    stroke: "#ffffff",
                    strokeThickness: 4
                }).setOrigin(0.5);

                // Score display
                this.add.text(centerX, centerY - 50, "SCORE", {
                    font: "bold 20px Arial",
                    fill: "#ffffff"
                }).setOrigin(0.5);

                this.add.text(centerX, centerY - 20, this.score.toString(), {
                    font: "bold 28px Arial",
                    fill: "#ffff00"
                }).setOrigin(0.5);

                this.add.text(centerX, centerY + 30, "BEST SCORE", {
                    font: "bold 16px Arial",
                    fill: "#cccccc"
                }).setOrigin(0.5);

                this.add.text(centerX, centerY + 60, bestScore.toString(), {
                    font: "bold 24px Arial",
                    fill: this.newRecord ? "#00ff00" : "#ffffff"
                }).setOrigin(0.5);

                // Play again button
                const btnPlay = this.add.image(centerX, centerY + 120, "ButtonPlay")
                    .setInteractive()
                    .setScale(0.5)
                    .setTint(0x00ff00);

                this.add.text(centerX, centerY + 120, "PLAY AGAIN", {
                    font: "bold 16px Arial",
                    fill: "#ffffff"
                }).setOrigin(0.5);

                btnPlay.on('pointerover', () => {
                    btnPlay.setTint(0x999999);
                });
                btnPlay.on('pointerout', () => {
                    btnPlay.setTint(0x00ff00);
                });
                btnPlay.on("pointerdown", () => {
                    this.scene.start("sceneMenu");
                });

                // Menu button
                const btnMenu = this.add.text(centerX, centerY + 180, "MAIN MENU", {
                    font: "bold 20px Arial",
                    fill: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 2,
                    backgroundColor: "#333333",
                    padding: { x: 15, y: 8 }
                }).setOrigin(0.5).setInteractive();

                btnMenu.on('pointerover', () => {
                    btnMenu.setFill("#ffff00");
                });
                btnMenu.on('pointerout', () => {
                    btnMenu.setFill("#ffffff");
                });
                btnMenu.on("pointerdown", () => {
                    this.scene.start("sceneMenu");
                });
            }
        });