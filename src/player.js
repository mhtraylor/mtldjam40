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

        let anim = [ { name: 'walk', frames: [0, 1, 2, 3], fps: 8, loop: false } ]
        anim.forEach(x => this.addAnimation(x))
    }

    moveUp() {}

    moveDown() {}

    moveLeft(){
        this.scale.x = -1
        this.x -= this.config.speed.x
        this.play('walk')
    }

    moveRight() {
        this.scale.x = 1
        this.x += this.config.speed.x
        this.play('walk')
    }

    update() {
        if (this.keys.w.isDown) this.moveUp()
        if (this.keys.a.isDown) this.moveLeft()
        if (this.keys.s.isDown) this.moveDown()
        if (this.keys.d.isDown) this.moveRight()
    }
}