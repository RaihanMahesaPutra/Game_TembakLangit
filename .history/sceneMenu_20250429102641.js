var sceneMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function ()
    {
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init: function () {},
    preload: function ()
    {
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
        // melakukan pengisian nilai untuk variabel global
        X_POSITION = {
            'LEFT': 0,
            'CENTER': game.canvas.width / 2,
            'RIGHT': game.canvas.width,
        };
    
        Y_POSITION = {
            'TOP': 0,
            'CENTER': game.canvas.height / 2,
            'BOTTOM': game.canvas.height,
        };
    
        // membuat tampilan
        // menambahkan backdrop
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPlay');
        // menambahkan judul game
        var titleGame = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, 'Title');
        // menambahkan tombol play
        var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 150, 'ButtonPlay');
        // menjadikan tombol play bisa dikenai interaksi (klik, hover mouse)
        buttonPlay.setInteractive();
    },
    update: function () {},
});