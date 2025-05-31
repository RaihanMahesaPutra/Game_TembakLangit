var scenePilihHero = new Phaser.Class({
            Extends: Phaser.Scene,

            initialize: function () {
                Phaser.Scene.call(this, { key: "scenePilihHero" });
            },

            init: function () { },
            preload: function () {
                this.load.setBaseURL('https://cdn.jsdelivr.net/gh/photonstorm/phaser3-examples@master/public/assets/');

                this.load.image('BGPilihPesawat', 'skies/sky2.png');
                this.load.image('ButtonMenu', 'sprites/block.png');
                this.load.image('ButtonNext', 'sprites/arrow-right.png');
                this.load.image('ButtonPrev', 'sprites/arrow-left.png');
                this.load.image('Pesawat1', 'sprites/ship.png');
                this.load.image('Pesawat2', 'sprites/ship2.png');
            },
            create: function () {
                // Background
                this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPilihPesawat').setDisplaySize(this.scale.width, this.scale.height);
                
                // Buttons
                var buttonMenu = this.add.image(50, 50, 'ButtonMenu').setScale(0.3).setTint(0xff0000);
                var buttonNext = this.add.image(X_POSITION.CENTER + 150, Y_POSITION.CENTER, 'ButtonNext').setScale(0.5);
                var buttonPrevious = this.add.image(X_POSITION.CENTER - 150, Y_POSITION.CENTER, 'ButtonPrev').setScale(0.5);
                var heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'Pesawat' + (currentHero + 1)).setScale(0.5);
                
                // Make interactive
                buttonMenu.setInteractive();
                buttonNext.setInteractive();
                buttonPrevious.setInteractive();
                heroShip.setInteractive();

                // Event listeners
                this.input.on('gameobjectover', function (pointer, gameObject) {
                    if (gameObject === buttonMenu) buttonMenu.setTint(0x999999);
                    if (gameObject === buttonNext) buttonNext.setTint(0x999999);
                    if (gameObject === buttonPrevious) buttonPrevious.setTint(0x999999);
                    if (gameObject === heroShip) heroShip.setTint(0x999999);
                }, this);

                this.input.on('gameobjectout', function (pointer, gameObject) {
                    if (gameObject === buttonMenu) buttonMenu.setTint(0xff0000);
                    if (gameObject === buttonNext) buttonNext.setTint(0xffffff);
                    if (gameObject === buttonPrevious) buttonPrevious.setTint(0xffffff);
                    if (gameObject === heroShip) heroShip.setTint(0xffffff);
                }, this);

                this.input.on('gameobjectup', function (pointer, gameObject) {
                    if (gameObject === buttonMenu) {
                        buttonMenu.setTint(0xff0000);
                        if (snd_touch) snd_touch.play();
                        this.scene.start('sceneMenu');
                    }
                    if (gameObject === buttonNext) {
                        buttonNext.setTint(0xffffff);
                        currentHero++;
                        if (currentHero >= countHero) currentHero = 0;
                        heroShip.setTexture('Pesawat' + (currentHero + 1));
                    }
                    if (gameObject === buttonPrevious) {
                        buttonPrevious.setTint(0xffffff);
                        currentHero--;
                        if (currentHero < 0) currentHero = (countHero - 1);
                        heroShip.setTexture('Pesawat' + (currentHero + 1));
                    }
                    if (gameObject === heroShip) {
                        heroShip.setTint(0xffffff);
                        this.scene.start('scenePlay');
                    }
                }, this);
            }
        });