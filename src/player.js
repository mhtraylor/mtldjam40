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

        let anim = [
            { name: 'walk', frames: [0, 1, 2, 3], fps: 8, loop: false },
            { name: 'idle', frames: [5, 6, 7, 8], fps: 4, loop: true }
        ]

        this.config.MAX_SPEED = 175
        this.config.ACCELERATION = 400
        this.config.DRAG = 300
        this.config.JUMP_SPEED = -4000

        anim.forEach(x => this.addAnimation(x))
    }

    moveUp() {
        this.body.velocity.y = this.config.JUMP_SPEED
    }

    moveDown() {}

    moveLeft() {
        this.scale.x = -1
        this.body.acceleration.x = -this.config.ACCELERATION

        this.play('walk')
    }

    moveRight() {
        this.scale.x = 1
        this.body.acceleration.x = this.config.ACCELERATION

        this.play('walk')
    }

    update() {
        this.collisions.forEach(col =>
            this.game.physics.arcade.collide(this, col))

        if (this.keys.w.isDown) {
            this.moveUp()
        } else if (this.keys.a.isDown) {
            this.moveLeft()
        } else if (this.keys.s.isDown) {
            this.moveDown()
        } else if (this.keys.d.isDown) {
            this.moveRight()
        } else {
            this.body.acceleration.x = 0
            this.play('idle')
        }
    }
}