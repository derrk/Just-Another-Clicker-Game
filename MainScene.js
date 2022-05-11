class MainScene extends Phaser.Scene {

    // This is where we define data members
    constructor() {
        super("MainScene");
         // player level text
         this.playerlvltxt = null;
         this.leveluptext = null;
        // Monster variables
        this.monsterImage = null;
        this.hp = 5;
        this.souls = 0;
        this.hpText = null;
        this.soulsText = null;
        // Levels in upgrades
        this.levels = {
            bolt: 0
        }
        // player level
        this.playerlvl = {
            level: 1,
            totalSouls: 0
        }
        // Status of monster
        this.alive = false;
    }

    // Runs before entering the scene, LOAD IMAGES AND SOUND HERE
    preload() {
        // load image for background of game scene
        this.load.image('gameBackground', './assets/mainsceneback.jpg');
        
        // Loop through monster configuration and load each image
        for (let i = 0; i < MONSTERS.length; i++) {
            this.load.image(MONSTERS[i].name, `./assets/${MONSTERS[i].image}`);
        }
        // load images for icons
        this.load.image('bolt', './assets/bolt.png');
        this.load.image('door', './assets/door.png');
        this.load.image('fire', './assets/1bitbowner.png');

        // Load sound effects
        this.load.audio('hit', './assets/punchsound.wav');
        this.load.audio('boltupgrade', './assets/boltupgrade.wav');
        this.load.audio('savesound', './assets/dooropen.wav');
        this.load.audio('arrowhit', './assets/arrowhit.wav');
    }

    // Runs when we first enter this scene
    create() {
        let backGround = this.add.image(0, 400, 'gameBackground');

        // Load game data
        this.loadGame();

        // Set the starting monster
        let index = Math.floor(Math.random() * MONSTERS.length);
        this.setMonster(MONSTERS[index]);
        // Create hp text
        this.hpText = this.add.text(225, 700, "");
        // Create the souls text
        this.soulsText = this.add.text(50, 50, "Souls: 0", {
            fontSize: '32px',
            color: 'red'
        });
        // create player level text
        this.playerlvltxt = this.add.text(50, 80, "Level: 0", {
            fontSize: '32px',
            color: 'green'
        });

        // Create an upgrade icon for the bolt upgrade
        let bolt = this.add.image(400, 50, 'bolt');
        bolt.setScale(3);
        bolt.setInteractive();
        bolt.on('pointerdown', () => {
            // If we have enough money
            if (this.souls >= 50) {
                // pay the money
                this.souls -= 50;
                // Play a hit sound
                this.sound.play('boltupgrade', {
                    volume: 0.5
                });
                // gain a level
                this.levels.bolt++;
                
            }
        });

        // create icon for ranged damage
        // clicking this icon fires a ranged arrow attack 
        // dealing 30 damage & instantly killing most monsters
        let fire = this.add.image(250, 750, 'fire');
        fire.setScale(1.75);
        fire.setInteractive();
        fire.on('pointerdown', () => {
            // if we have enough souls use arrow shot
            if(this.souls >= 50){
            this.souls -= 50;
            console.log("Fired an Arrow");
            this.sound.play('arrowhit', {
                volume: 0.5
            });
            this.hp -= 30;
        }
        })

        // Create an interval to use bolt damage
        let interval = setInterval(() => {
            this.damage(this.levels.bolt);
        }, 1000);

        // Save button
        let door = this.add.image(50, 750, 'door');
        door.setScale(3);
        door.setInteractive();
        door.on('pointerdown', () => {
            this.saveGame();
            // play door sound
            this.sound.play('savesound', {
                volume: 0.5
            });
            // reset interval for bolt damage
            clearInterval(interval);
            this.scene.start("TitleScene");
        });

        // Save every 60s
        setInterval(() => {
            this.saveGame();
        }, 60000);
        // Save once on startup, to set the time
        this.saveGame();
    }

    // Runs every frame
    update() {
        if (this.hp > 0) {
            this.hpText.setText(`${this.hp}`);
        } else {
            this.hpText.setText("0");
        }
        this.soulsText.setText(`Souls: ${this.souls}`);
        this.playerlvltxt.setText(`Level: ${this.playerlvl.level}`);
    }

    damage(amount) {
        // Lower the hp of the current monster
        this.hp -= amount;
        // Check if monster is dead
        if (this.hp <= 0 && this.alive) {
            console.log("You killed the monster!");
            // Set monster to no longer be alive
            this.alive = false;
            // Play a death animation
            this.tweens.add({
                // List of things to affect
                targets: [this.monsterImage],
                // Duration of animation in ms
                duration: 750,
                // Alpha is transparency, 0 means invisible
                alpha: 0,
                // Scale the image down during animation
                scale: 0.1,
                // Set the angle
                angle: 359,
                // Runs once the death animation is finsihed
                onComplete:
                    () => {
                        // Choose a random new monster to replace the dead one
                        let index = Math.floor(Math.random() * MONSTERS.length);
                        this.setMonster(MONSTERS[index]);
                        // Gain a soul
                        this.souls++;
                        // display the total amount of souls
                        console.log("Total Souls: " + ((this.playerlvl.totalSouls)+1));
                        this.playerlvl.totalSouls++;
                        //
                        if (this.playerlvl.totalSouls % 20 == 0) {
                            this.playerlvl.level++;
                            console.log("LEVEL UP");
                        }
                        // Save game (and soul gained)
                        this.saveGame();
                    }

            });
        }
    }

    loadGame() {
        let data = loadObjectFromLocal();
        if (data != null){
            this.souls = data.souls;
            this.level = data.levels;
            this.playerlvl = data.playerlevel
            // process progress since last played
            let lastPlayed = data.lastPlayed;
            let now = new Date().getTime();
            let s = (now - lastPlayed) / 1000;
            let damage = this.level.bolt * s;
            let avgHP = 15;
            this.souls += (damage / avgHP);
        }
    }

    saveGame() {
        const data = {
            lastPlayed: new Date().getTime(),
            souls: this.souls,
            levels: this.levels,
            playerlevel: this.playerlvl.level,
            totalsouls: this.playerlvl.totalSouls
        };
        saveObjectToLocal(data);
    }

    setMonster(monsterConfig) {
        // Destroy the old monster's game object
        if (this.monsterImage != null) this.monsterImage.destroy();
        // Reset hp of the monster
        this.hp = monsterConfig.hp;
        this.alive = true;

        // Create a image of monster at position x:225,y:400
        this.monsterImage = this.add.image(225, 400, monsterConfig.name);
        // Set the size of the monster
        this.monsterImage.setScale(0.5);
        // Make the monster clickable
        this.monsterImage.setInteractive();

        // Handler/callback for the 'pointer down' event
        this.monsterImage.on('pointerdown',
            () => {
                // Play a hit sound
                this.sound.play('hit', {
                    volume: 0.2
                });
                this.damage(1);
            });
    }
}