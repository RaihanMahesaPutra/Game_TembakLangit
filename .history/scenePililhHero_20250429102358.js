var scenePilihHero = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function ()
    {
        Phaser.Scene.call(this, { key: "scenePilihHero" });
    },

    init: function () {},
    preload: function ()
    {
        this.load.setBaseURL('assets/');
        this.load.image('BGPilihPesawat', 'images/BGPilihPesawat.png');
        this.load.image('ButtonMenu', 'images/ButtonMenu.png');
        this.load.image('ButtonNext', 'images/ButtonNext.png');
        this.load.image('ButtonPrev', 'images/ButtonPrev.png');
        this.load.image('Pesawat1', 'images/Pesawat1.png');
        this.load.image('Pesawat2', 'images/Pesawat2.png');
    },
    create: function () {},
    update: function () {},
});