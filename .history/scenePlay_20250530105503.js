var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePlay" });
    },

    init: function () { },
    preload: function () {
        this.load.setBaseURL('assets/');

        this.load.image('BG1', 'images/BG1.png');
        this.load.image('BG2', 'images/BG2.png');
        this.load.image('BG3', 'images/BG3.png');
        this.load.image('GroundTransisi', 'images/Transisi.png');
        this.load.image('Pesawat1', 'images/Pesawat1.png');
        this.load.image('Pesawat2', 'images/Pesawat2.png');
        this.load.image('Peluru', 'images/Peluru.png');
        this.load.image('EfekLedakan', 'images/EfekLedakan.png');
        this.load.image('cloud', 'images/cloud.png');
        this.load.image('Musuh1', 'images/Musuh1.png');
        this.load.image('Musuh2', 'images/Musuh2.png');
        this.load.image('Musuh3', 'images/Musuh3.png');
        this.load.image('MusuhBos', 'images/MusuhBos.png');
        this.load.audio('snd_shoot', 'audio/fx_shoot.mp3');
        this.load.audio('snd_explode', 'audio/fx_explode.mp3');
        this.load.audio('snd_play', 'audio/music_play.mp3');
    },
    create: function () {
        // menentukan index atau tekstur/gambar background secara acak dari 1 sampai 3
        this.currentBgIndex = Phaser.Math.Between(1, 3);
        this.nextBgIndex = this.currentBgIndex;

        // membuat penampung data ukuran gambar background pada lapisan paling bawah sendiri
        this.bgBottomSize = { 'width': 768, 'height': 1664 };

        // array untuk menampung semua background lapisan bawah
        this.arrBgBottom = [];

        // fungsi untuk membuat background pada lapisan paling bawah sendiri
        this.createBgBottom = function (xPos, yPos, bgIndex, needTransition) {
            let container = this.add.container(xPos, yPos);
            container.setDepth(1);

            // Background utama
            let bgBottom = this.add.image(0, 0, 'BG' + bgIndex);
            bgBottom.setOrigin(0.5, 0.5);
            bgBottom.setDisplaySize(this.bgBottomSize.width, this.bgBottomSize.height);
            bgBottom.flipX = Phaser.Math.Between(0, 1) === 1;
            container.add(bgBottom);

            // Tambahkan transisi jika diperlukan
            if (needTransition) {
                let bgTransisi = this.add.image(0, -this.bgBottomSize.height / 2, 'GroundTransisi');
                bgTransisi.setOrigin(0.5, 0.5);
                bgTransisi.setDisplaySize(this.bgBottomSize.width, 128);
                bgTransisi.flipX = Phaser.Math.Between(0, 1) === 1;
                container.add(bgTransisi);
            }

            container.setData('kecepatan', 3);
            this.arrBgBottom.push(container);
            
            return container;
        };

        // fungsi untuk menambahkan background baru
        this.addBGBottom = function () {
            let yPos;
            let needTransition = false;
            
            if (this.arrBgBottom.length === 0) {
                // Background pertama - posisi di tengah layar
                yPos = game.canvas.height / 2;
            } else {
                // Background selanjutnya - posisi berdasarkan background terakhir
                let lastBG = this.arrBgBottom[this.arrBgBottom.length - 1];
                yPos = lastBG.y - this.bgBottomSize.height;
                
                // Tentukan apakah perlu transisi (ganti background)
                let newBgIndex = Phaser.Math.Between(1, 3);
                if (newBgIndex !== this.currentBgIndex) {
                    needTransition = true;
                    this.currentBgIndex = newBgIndex;
                }
            }

            this.createBgBottom(game.canvas.width / 2, yPos, this.currentBgIndex, needTransition);
        };

        // membuat background awal - cukup untuk menutupi layar dan sedikit lebih
        this.addBGBottom(); // Background pertama (di tengah layar)
        this.addBGBottom(); // Background kedua (di atas background pertama)
        this.addBGBottom(); // Background ketiga (cadangan)

        // membuat background pada lapisan bagian atas (awan)
        this.bgCloudSize = { 'width': 768, 'height': 1962 };
        this.arrBgTop = [];

        this.createBgTop = function (xPos, yPos) {
            var bgTop = this.add.image(xPos, yPos, 'cloud');
            bgTop.setData('kecepatan', 6);
            bgTop.setDepth(5);
            bgTop.flipX = Phaser.Math.Between(0, 1) === 1;
            bgTop.setAlpha(Phaser.Math.Between(4, 7) / 10);
            this.arrBgTop.push(bgTop);
        };

        this.addBGTop = function () {
            if (this.arrBgTop.length > 0) {
                let lastBG = this.arrBgTop[this.arrBgTop.length - 1];
                this.createBgTop(game.canvas.width / 2, lastBG.y - this.bgCloudSize.height * Phaser.Math.Between(1, 4));
            } else {
                this.createBgTop(game.canvas.width / 2, -this.bgCloudSize.height / 2);
            }
        };

        this.addBGTop();

        // membuat tampilan skor
        this.scoreLabel = this.add.text(X_POSITION.CENTER, Y_POSITION.TOP + 80, '0', {
            fontFamily: 'Verdana, Arial',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#5c5c5c',
            strokeThickness: 2
        });
        this.scoreLabel.setOrigin(0.5);
        this.scoreLabel.setDepth(100);

        // menambahkan pesawat hero ke dalam game
        this.heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.BOTTOM - 200, 'Pesawat' + (currentHero + 1));
        this.heroShip.setDepth(4);
        this.heroShip.setScale(0.35);
        
        // menyiapkan pendeteksi event untuk tombol arah keyboard
        this.cursorKeyListener = this.input.keyboard.createCursorKeys();

        // mengaktifkan deteksi pergerakan mouse atau touch pada layar
        this.input.on('pointermove', function (pointer, currentlyOver) {
            let movementX = this.heroShip.x;
            let movementY = this.heroShip.y;
            
            if (pointer.x > 70 && pointer.x < (X_POSITION.RIGHT - 70)) {
                movementX = pointer.x;
            } else {
                if (pointer.x <= 70) {
                    movementX = 70;
                } else {
                    movementX = (X_POSITION.RIGHT - 70);
                }
            }
            
            if (pointer.y > 70 && pointer.y < (Y_POSITION.BOTTOM - 70)) {
                movementY = pointer.y;
            } else {
                if (pointer.y <= 70) {
                    movementY = 70;
                } else {
                    movementY = (Y_POSITION.BOTTOM - 70);
                }
            }

            this.heroShip.x = movementX;
            this.heroShip.y = movementY;

            let a = this.heroShip.x - movementX;
            let b = this.heroShip.y - movementY;
            let durationToMove = Math.sqrt(a * a + b * b) * 0.8;
            
            this.tweens.add({
                targets: this.heroShip,
                x: movementX,
                y: movementY,
                duration: durationToMove,
            });
        }, this);

        // pola pergerakan musuh
        let pointA = [];
        pointA.push(new Phaser.Math.Vector2(-200, 100));
        pointA.push(new Phaser.Math.Vector2(250, 200));
        pointA.push(new Phaser.Math.Vector2(200, (Y_POSITION.BOTTOM + 200) / 2));
        pointA.push(new Phaser.Math.Vector2(200, Y_POSITION.BOTTOM + 200));

        let pointB = [];
        pointB.push(new Phaser.Math.Vector2(900, 100));
        pointB.push(new Phaser.Math.Vector2(550, 200));
        pointB.push(new Phaser.Math.Vector2(500, (Y_POSITION.BOTTOM + 200) / 2));
        pointB.push(new Phaser.Math.Vector2(500, Y_POSITION.BOTTOM + 200));

        let pointC = [];
        pointC.push(new Phaser.Math.Vector2(900, 100));
        pointC.push(new Phaser.Math.Vector2(550, 200));
        pointC.push(new Phaser.Math.Vector2(400, (Y_POSITION.BOTTOM + 200) / 2));
        pointC.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

        let pointD = [];
        pointD.push(new Phaser.Math.Vector2(-200, 100));
        pointD.push(new Phaser.Math.Vector2(550, 200));
        pointD.push(new Phaser.Math.Vector2(650, (Y_POSITION.BOTTOM + 200) / 2));
        pointD.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

        var points = [];
        points.push(pointA);
        points.push(pointB);
        points.push(pointC);
        points.push(pointD);

        this.arrEnemies = [];

        var Enemy = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize:
            function Enemy(scene, idxPath) {
                Phaser.GameObjects.Image.call(this, scene);
                this.setTexture('Musuh' + Phaser.Math.Between(1, 3));
                this.setDepth(4);
                this.setScale(0.35);
                this.curve = new Phaser.Curves.Spline(points[idxPath]);

                let lastEnemyCreated = this;
                this.path = { t: 0, vec: new Phaser.Math.Vector2() };
                scene.tweens.add({
                    targets: this.path,
                    t: 1,
                    duration: 3000,
                    onComplete: function () {
                        if (lastEnemyCreated) {
                            lastEnemyCreated.setActive(false);
                        }
                    }
                });
            },

            move: function () {
                this.curve.getPoint(this.path.t, this.path.vec);
                this.x = this.path.vec.x;
                this.y = this.path.vec.y;
            }
        });

        this.time.addEvent({
            delay: 250,
            callback: function () {
                if (this.arrEnemies.length < 3) {
                    let enemy = new Enemy(this, Phaser.Math.Between(0, points.length - 1));
                    this.arrEnemies.push(enemy);
                    this.children.add(enemy);
                }
            },
            callbackScope: this,
            loop: true
        });

        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,

            initialize:
            function Bullet(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Peluru');
                this.setDepth(3);
                this.setPosition(x, y);
                this.setScale(0.5);
                this.speed = Phaser.Math.GetSpeed(20000, 1);
            },
            
            move: function () {
                this.y -= this.speed;
                if (this.y < -50) {
                    this.setActive(false);
                }
            }
        });

        this.arrBullets = [];

        this.time.addEvent({
            delay: 250, 
            callback: function () {
                let bullet = new Bullet(this, this.heroShip.x, this.heroShip.y - 30);
                this.arrBullets.push(bullet);
                this.children.add(bullet);
                this.snd_shoot.play();
            },
            callbackScope: this, 
            loop: true
        });

        this.scoreValue = 0;

        let partikelExplode = this.add.particles('EfekLedakan');
        partikelExplode.setDepth(4);

        this.snd_shoot = this.sound.add('snd_shoot');
        this.snd_explode = this.sound.add('snd_explode');
        
        this.bgMusic = this.sound.add('snd_play', {
            volume: 0.5,
            loop: true
        });
        this.bgMusic.play();
    },
    
    update: function () {
        // Update background bottom dengan perbaikan
        for (let i = 0; i < this.arrBgBottom.length; i++) {
            let bg = this.arrBgBottom[i];
            bg.y += bg.getData('kecepatan');

            // Hapus background yang sudah keluar dari layar dan tambahkan yang baru
            if (bg.y > game.canvas.height + this.bgBottomSize.height / 2) {
                // Tambahkan background baru sebelum menghapus yang lama
                this.addBGBottom();
                bg.destroy();
                this.arrBgBottom.splice(i, 1);
                i--; // Kurangi index karena array berkurang
            }
        }

        // Update background top
        for (let i = 0; i < this.arrBgTop.length; i++) {
            this.arrBgTop[i].y += this.arrBgTop[i].getData('kecepatan');
            if (this.arrBgTop[i].y > game.canvas.height + this.bgCloudSize.height / 2) {
                this.arrBgTop[i].destroy();
                this.arrBgTop.splice(i, 1);
                this.addBGTop();
                i--; // Kurangi index karena array berkurang
            }
        }

        // kontrol keyboard
        if (this.cursorKeyListener.left.isDown && this.heroShip.x > 70) {
            this.heroShip.x -= 7;
        }

        if (this.cursorKeyListener.right.isDown && this.heroShip.x < (X_POSITION.RIGHT - 70)) {
            this.heroShip.x += 7;
        }

        if (this.cursorKeyListener.up.isDown && this.heroShip.y > 70) {
            this.heroShip.y -= 7;
        }

        if (this.cursorKeyListener.down.isDown && this.heroShip.y < (Y_POSITION.BOTTOM - 70)) {
            this.heroShip.y += 7;
        }

        // update pergerakan musuh
        for (let i = 0; i < this.arrEnemies.length; i++) {
            this.arrEnemies[i].move();
        }

        // hapus musuh yang tidak aktif
        for (let i = 0; i < this.arrEnemies.length; i++) {
            if (!this.arrEnemies[i].active) {
                this.arrEnemies[i].destroy();
                this.arrEnemies.splice(i, 1);
                i--;
            }
        }

        // update pergerakan peluru
        for (let i = 0; i < this.arrBullets.length; i++) {
            this.arrBullets[i].move();
        }

        // hapus peluru yang tidak aktif
        for (let i = 0; i < this.arrBullets.length; i++) {
            if (!this.arrBullets[i].active) {
                this.arrBullets[i].destroy();
                this.arrBullets.splice(i, 1);
                i--;
            }
        }

        // deteksi tabrakan peluru dengan musuh
        for (let i = 0; i < this.arrEnemies.length; i++) {
            for (let j = 0; j < this.arrBullets.length; j++) {
                if (this.arrEnemies[i].getBounds().contains(this.arrBullets[j].x, this.arrBullets[j].y)) {
                    this.arrEnemies[i].setActive(false);
                    this.arrBullets[j].setActive(false);
                    this.scoreValue++;
                    this.scoreLabel.setText(this.scoreValue);
                    this.snd_explode.play();
                    break;
                }
            }
        }

        // deteksi tabrakan hero dengan musuh
        for (let i = 0; i < this.arrEnemies.length; i++) {
            let enemy = this.arrEnemies[i];
            if (enemy.active) {
                if (Phaser.Geom.Intersects.RectangleToRectangle(
                    this.heroShip.getBounds(),
                    enemy.getBounds()
                )) {
                    this.heroShip.setActive(false);
                    this.heroShip.setVisible(false);

                    if (this.bgMusic) {
                        this.bgMusic.stop();
                    }

                    this.scene.start("sceneGameOver", { score: this.scoreValue });
                    break;
                }
            }
        }
    }
});