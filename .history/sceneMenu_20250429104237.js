// Global position variables
var X_POSITION;
var Y_POSITION;

// Menu Scene
var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function ()
    {
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init: function () {},
    preload: function ()
    {
        // Show loading progress
        let loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            'Loading...',
            { font: '20px Arial', fill: '#ffffff' }
        ).setOrigin(0.5);
        
        // Loading progress events
        this.load.on('progress', function (value) {
            loadingText.setText('Loading: ' + parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', function () {
            loadingText.destroy();
        });
        
        this.load.setBaseURL('assets/');
        this.load.image('BGPlay', 'images/BGPlay.png');
        this.load.image('Title', 'images/Title.png');
        this.load.image('ButtonPlay', 'images/ButtonPlay.png');
        this.load.image('ButtonSoundOn', 'images/ButtonSoundOn.png');
        this.load.image('ButtonSoundOff', 'images/ButtonSoundOff.png');
        this.load.image('ButtonMusicOn', 'images/ButtonMusicOn.png');
        this.load.image('ButtonMusicOff', 'images/ButtonMusicOff.png');
        this.load.audio('snd_menu', 'audio/music_menu.mp3');
        this.load.audio('snd_touchshooter', 'audio/fx_touch.mp3');
    },
    create: function () {
        // Set values for global variables
        X_POSITION = {
            'LEFT': 0,
            'CENTER': this.cameras.main.width / 2,
            'RIGHT': this.cameras.main.width,
        };
        
        Y_POSITION = {
            'TOP': 0,
            'CENTER': this.cameras.main.height / 2,
            'BOTTOM': this.cameras.main.height,
        };
        
        console.log("Creating menu scene");
        console.log("Canvas width:", this.cameras.main.width);
        console.log("Canvas height:", this.cameras.main.height);
        
        // Create UI elements
        try {
            // Add backdrop
            this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPlay');
            // Add game title
            var titleGame = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, 'Title');
            // Add play button
            var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 150, 'ButtonPlay');
            // Make play button interactive
            buttonPlay.setInteractive();
            
            console.log("UI elements created");
        } catch (error) {
            console.error("Error creating UI elements:", error);
        }

        // Add mouse interaction detection
        this.input.on('gameobjectover', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0x999999);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0xffffff);
            }
        }, this);

        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0xffffff);
                // Start play scene
                this.scene.start("scenePlay");
            }
        }, this);
        
        // Play menu music
        try {
            this.sound.play('snd_menu', { loop: true });
        } catch (e) {
            console.error("Error playing menu music:", e);
        }
    },
    update: function () {},
});