class TitleScene extends Phaser.Scene{
    constructor(){
        super("TitleScene");
    }

    preload(){
        // loads the title screen image
        this.load.image('titlebackground', './assets/titlebackgrnd.png');
        // load image for rules
        this.load.image('rules', './assets/rulebook.png');
        // load sound for press play button
        this.load.audio('pressplay', './assets/playbuttonsound.wav');
        this.load.audio('openrules', './assets/openbook.wav');
    }

    create(){
        let titleBack = this.add.image(275, 400, 'titlebackground');
        titleBack.setScale(0.35);

        let text = this.add.text(225, 500, "PLAY NOW", {
            fontSize: '54px'
        });
        text.setOrigin(0.5, 0.5);
        text.setInteractive();
        text.on('pointerdown', ()=>{
            this.sound.play('pressplay', {
                volume: 0.5
            });
            this.scene.start('MainScene');
        });
        this.tweens.add({
            targets: [text],
            duration: 500,
            alpha: 0,
            yoyo: true,
            repeat: -1
        });

        let openRules = this.add.image(50, 750, 'rules');
        openRules.setScale(0.5);
        openRules.setInteractive();
        openRules.on('pointerdown', () =>  {
            this.sound.play('openrules', {
                volume: 0.5
            });
            this.scene.start('Rules');
        
        });    
    }
}