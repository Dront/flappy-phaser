import Phaser from 'phaser';

class MyGame extends Phaser.Scene {
    constructor() {
        super();
        this.maxSpeed = 300;
    }

    create() {
        this.player = this.add.circle(400, 300, 50, 0xff8800);
        this.physics.add.existing(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.body.setBounce(0.2);
        this.player.body.velocity.y = -100;
        this.input.on("pointerdown", this.jump, this);
    }

    jump() {
        const curSpeed = this.player.body.velocity.y;
        this.player.body.velocity.y = Math.max(-this.maxSpeed, curSpeed - 100);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#5DACD8",
    scene: MyGame,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
        },
    },
};

const game = new Phaser.Game(config);
