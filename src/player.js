import { Entity, EntityFacingDirection } from "./entity";
import { CONFIG } from '../constants'

export class Player extends Entity {
    constructor(gameCtrl, config) {
        super(gameCtrl.game, config)
        this.gameCtrl = gameCtrl

        this.keys = {
            w: gameCtrl.game.input.keyboard.addKey(Phaser.Keyboard.W),
            a: gameCtrl.game.input.keyboard.addKey(Phaser.Keyboard.A),
            s: gameCtrl.game.input.keyboard.addKey(Phaser.Keyboard.S),
            d: gameCtrl.game.input.keyboard.addKey(Phaser.Keyboard.D),
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

    init() {
        super.init([18, 25, 23, 26])
        this.addCollision(this.gameCtrl.layers.get('air-layer'))
        this.addCollision(this.gameCtrl.layers.get('ground-layer'))
        this.body.collideWorldBounds = true
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
        this.gameCtrl.scoreEvent.dispatch(-this.gameCtrl.level.pointsPerBug)
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




export class HealthDisplayController {
    constructor(game) {
        this.game = game

        this.playerHealth = 0
        this.healthContainer = null
    }

    init(player) {
        this.playerHealth = player.health

        this.healthContainer = this.game.add.group()

        let x = 0
        for (let h = 0; h < this.playerHealth; h++) {
            this.healthContainer.create(x, 0, 'patrick_head')
            x += 32
        }

        this.healthContainer.fixedToCamera = true
        this.healthContainer.cameraOffset.setTo(16, CONFIG.SCREEN.height - 40)
    }

    update(player) {
        this.playerHealth == player.health ? null : this.UpdateHealthDisplay(player.health)
    }

    render() {
    }

    UpdateHealthDisplay(amt) {
        if (this.playerHealth > amt) {
            this.healthContainer.removeChildAt(this.playerHealth - 1)
        } else {
            // just in case we add health packs
        }

        this.playerHealth = amt
    }
}