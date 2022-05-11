class Rules extends Phaser.Scene {
    constructor(){
        super("Rules")
    }

preload(){
    this.load.image('exitsign', './assets/exitsign.png');
    this.load.image('rulescreen', './assets/darules.png');
    }

create() {

   let rulesBack = this.add.image(320, 400, 'rulescreen'); 
   rulesBack.setScale(.65);

let closeRules = this.add.image(400, 50, 'exitsign');
        closeRules.setScale(0.5);
        closeRules.setInteractive();
        closeRules.on('pointerdown', () =>  {
            this.scene.start('TitleScene');
        });   
    }
        
    }