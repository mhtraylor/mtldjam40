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
            { name: 'idle', frames: [4, 5, 6, 7], fps: 4, loop: true },
            { name: 'hit', frames: [9], fps: 1, loop: false },
            { name: 'die', frames: [10, 11, 12, 13, 14, 15, 16], fps: 5, loop: false }
        ]

        this.health = 5

        this.directionFacing = EntityFacingDirection.RIGHT
        this.isJumping = false
        this.isTouchingGround = false

        this.config.MAX_SPEED_X = 175
        this.config.MAX_SPEED_Y = 1000
        this.config.ACCELERATION = 400
        this.config.DRAG_X = 600
        this.config.DRAG_Y = 0
        this.config.JUMP_SPEED = -500
        this.config.BOUNCE_X = 0
        this.config.BOUNCE_Y = 0


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

        if (!this.alive) return


        // Horizontal movement
        if (this.keys.a.isDown) {
            this.moveLeft()
        } else if (this.keys.d.isDown) {
            this.moveRight()
        } else {
            this.body.acceleration.x = 0

            if (!this.isJumping)
                this.play('idle')
        }


        // Vertical movement
        // this.isTouchingGround = true

        if (this.isTouchingGround && this.isUpAllowed(100)) {
            this.moveUp()
        }
    }


    isUpAllowed(duration) {
        let isActive = this.game.input.keyboard.downDuration(Phaser.Keyboard.W, duration)
        return isActive
    }


    TakeDamage() {
        this.health--

        if (this.health < 1) {
            this.kill()
        }
    }


    kill() {
        this.alive = false
        this.body.enable = false
        this.animations.play('die')
        this.events.onAnimationComplete.addOnce(function() {
            this.exists = true
            this.visible = true
            this.events.destroy()
        }, this)
    
        if (this.events) {
            this.events.onKilled$dispatch(this)
        }
    
        return this
    }
}