var sceneMenu = new Phaser.Class({
            Extends: Phaser.Scene,

            initialize: function () {
                Phaser.Scene.call(this, { key: "sceneMenu" });
            },

            init: function () { },
            preload: function () {
                this.load.setBaseURL('https://cdn.jsdelivr.net/gh/photonstorm/phaser3-examples@master/public/assets/');
                
                // Fallback images for demo
                this.load.image('BGPlay', 'skies/sky1.png');
                this.load.image('Title', 'sprites/phaser3-logo.png');
                this.load.image('ButtonPlay', 'sprites/block.png');
                this.load.image('ButtonSoundOn', 'sprites/diamond.png');
                this.load.image('ButtonSoundOff', 'sprites/diamond.png');
                this.load.image('ButtonMusicOn', 'sprites/diamond.png');
                this.load.image('ButtonMusicOff', 'sprites/diamond.png');
                
                // Audio files - using fallback sounds
                this.load.audio('snd_menu', 'audio/oedipus_wizball_highscore.ogg');
                this.load.audio('snd_touchshooter', 'audio/SoundEffects/blip.wav');
            },
            create: function () {
                // Set global positions
                X_POSITION = {
                    'LEFT': 0,
                    'CENTER': this.scale.width / 2,
                    'RIGHT': this.scale.width,
                };
            
                Y_POSITION = {
                    'TOP': 0,
                    'CENTER': this.scale.height / 2,
                    'BOTTOM': this.scale.height,
                };
            
                // Create background
                this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPlay').setDisplaySize(this.scale.width, this.scale.height);
            
                // Add title
                var titleGame = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, 'Title').setScale(0.5);
            
                // Add play button
                var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 50, 'ButtonPlay').setScale(0.5).setTint(0x00ff00);
                buttonPlay.setInteractive();
                
                // Add sound button
                var buttonSound = this.add.image(X_POSITION.RIGHT - 70, Y_POSITION.BOTTOM - 70, 'ButtonSoundOn').setScale(0.3);
                buttonSound.setInteractive();
                
                // Add button interactions
                this.input.on('gameobjectover', function (pointer, gameObject) {
                    if (gameObject === buttonPlay) {
                        buttonPlay.setTint(0x999999);
                    }
                    if (gameObject === buttonSound) {
                        buttonSound.setTint(0x999999);
                    }
                }, this);

                this.input.on('gameobjectout', function (pointer, gameObject) {
                    if (gameObject === buttonPlay) {
                        buttonPlay.setTint(0x00ff00);
                    }
                    if (gameObject === buttonSound) {
                        buttonSound.setTint(0xffffff);
                    }
                }, this);

                this.input.on('gameobjectup', function (pointer, gameObject) {
                    if (gameObject === buttonPlay) {
                        buttonPlay.setTint(0x00ff00);
                        if (snd_touch) snd_touch.play();
                        this.scene.start('scenePilihHero');
                    }
                    if (gameObject === buttonSound) {
                        buttonSound.setTint(0xffffff);
                    }
                }, this);

                this.input.on('gameobjectdown', function(pointer, gameObject){
                    if(gameObject === buttonSound){
                        buttonSound.setTint(0x999999);
                    }
                }, this);
                
                // Initialize sound effects
                if (!snd_touch) {
                    snd_touch = this.sound.add('snd_touchshooter');
                }
                
                // Background music
                try {
                    this.bgMusic = this.sound.add('snd_menu', {
                        volume: 0.3,
                        loop: true
                    });
                    this.bgMusic.play();
                } catch (e) {
                    console.log('Background music not available');
                }
            },    
            update: function () { }
        });