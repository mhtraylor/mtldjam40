import { Entity } from "./entity";

export class Player extends Entity {
    constructor(game, config) {
        super(game, config)

        this.keys = {
            w: game.input.keyboard.addKey(Phaser.Keyboard.W),
            a: game.input.keyboard.addKey(Phaser.Keyboard.A),
            s: game.input.keyboard.addKey(Phaser.Keyboard.S),
            d: game.input.keyboard.addKey(Phaser.Keyboard.D),
        }
    }

    moveUp() {}

    moveDown() {}

    moveLeft(){
        this.x -= this.config.speed.x
    }

    moveRight() {
        this.x += this.config.speed.x
    }

    update() {
        if (this.keys.w.isDown) this.moveUp()
        if (this.keys.a.isDown) this.moveLeft()
        if (this.keys.s.isDown) this.moveDown()
        if (this.keys.d.isDown) this.moveRight()
    }
}