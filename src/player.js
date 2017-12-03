import { Entity, EntityFacingDirection } from "./entity";

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
            { name: 'jump', frames: [8], fps: 1, loop: false },
            { name: 'walk', frames: [0, 1, 2, 3], fps: 8, loop: false },
            { name: 'idle', frames: [4, 5, 6, 7], fps: 4, loop: true }
        ]

        this.directionFacing = EntityFacingDirection.RIGHT
        this.isJumping = false
        this.isTouchingGround = false

        this.config.MAX_SPEED = 175
        this.config.ACCELERATION = 400
        this.config.DRAG = 300
        this.config.JUMP_SPEED = -1000

        anim.forEach(x => this.addAnimation(x))
    }

    moveUp() {
        this.isJumping = true
        this.body.velocity.y = this.config.JUMP_SPEED

        this.play('jump')
    }

    moveDown() {}

    moveLeft() {
        this.scale.x = -1
        this.body.acceleration.x = -this.config.ACCELERATION

        this.directionFacing = EntityFacingDirection.LEFT

        if (!this.isJumping)
            this.play('walk')
    }

    moveRight() {
        this.scale.x = 1
        this.body.acceleration.x = this.config.ACCELERATION

        this.directionFacing = EntityFacingDirection.RIGHT

        if (!this.isJumping)
            this.play('walk')
    }

    update() {
        this.collisions.forEach(col =>
            this.game.physics.arcade.collide(this, col,
                (plr, col) => {
                    let isground = col.layer && col.layer.name === 'ground-layer'
                    let isair    = col.layer && col.layer.name === 'air-layer'
                    if (isground || isair) {
                        plr.isTouchingGround = true
                        plr.isJumping = false
                    }
                },
                (plr, col) => {
                if (col.layer && col.layer.name === 'air-layer') {
                    return plr.body.deltaY() >= 0
                }
                return true
            }))


        // Horizontal movement
        if (this.keys.a.isDown) {
            this.moveLeft()
        } else if (this.keys.d.isDown) {
            this.moveRight()
        } else {
            this.body.acceleration.x = 0
            this.play('idle')
        }


        // Vertical movement
        // this.isTouchingGround = true

        if (this.isTouchingGround && this.isUpAllowed(500)) {
            this.moveUp()
        } else {
            this.play('idle')
        }
    }


    isUpAllowed(duration) {
        let isActive = this.game.input.keyboard.downDuration(Phaser.Keyboard.W, duration)
        return isActive
    }
}