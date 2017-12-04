import { Entity, EntityFacingDirection } from "./entity";

export class Bug extends Entity {
    constructor(game, config) {
        super(game, config)

        let anim = [
            { name: 'walk', frames: [0, 1, 2, 3], fps: 8, loop: true },
            { name: 'die', frames: [4, 5, 6, 7, 8, 9], fps: 12, loop: false }
        ]

        this.tint = this.config.tint || 0xffffff

        this.config.MAX_SPEED_X = this.GetRandomSpeed()
        this.config.MAX_SPEED_Y = 999
        this.config.ACCELERATION = this.GetRandomAcceleration()
        this.config.DRAG_X = 300
        this.config.DRAG_Y = 0
        this.config.JUMP_SPEED = -4000
        this.config.BOUNCE_X = 0
        this.config.BOUNCE_Y = 0.5

        this.directionFacing = EntityFacingDirection.LEFT

        this.directionalChangeTimer = this.game.time.create(false)
        this.directionalChangeTimer.loop(1000, this.UpdateBugDirection, this)
        this.directionalChangeTimer.start()

        anim.forEach(x => this.addAnimation(x))

        this.play('walk')
    }

    moveUp() {}

    moveDown() {}

    moveLeft() {
        this.scale.x = 1
        this.body.acceleration.x = -this.config.ACCELERATION

        this.directionFacing = EntityFacingDirection.LEFT
    }

    moveRight() {
        this.scale.x = -1
        this.body.acceleration.x = this.config.ACCELERATION

        this.directionFacing = EntityFacingDirection.RIGHT
    }

    update() {
        this.collisions.forEach(col =>
            this.game.physics.arcade.collide(this, col,
                (bug, col) => {
                    if (col.key === 'patrick') {
                        if (bug.body.touching.up) {
                            col.moveUp()
                            this.kill()
                        } else if (bug.body.touching.left) {
                            col.body.velocity.x = -500
                            col.body.velocity.y = -250
                            col.TakeDamage()
                        } else if (bug.body.touching.right) {
                            col.body.velocity.x = 500
                            col.body.velocity.y = -250
                            col.TakeDamage()
                        }
                    }
                }
            ))
    }


    kill() {
        this.alive = false
        this.directionalChangeTimer.stop()
        this.body.acceleration.setTo(0,0)
        this.body.velocity.setTo(0,0)
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


    UpdateBugDirection() {
        if (this.ChanceMovementChange()) {
            this.GetNewDirection()
        }
    }

    GetRandomSpeed() {
        return this.game.rnd.realInRange(50, 100)
    }

    GetRandomAcceleration() {
        return this.game.rnd.realInRange(100, 200)
    }

    ChanceMovementChange() {
        let chance = 0

        // switch(this.directionFacing) {
        //     case EntityFacingDirection.LEFT:
        //         break;

        //     case EntityFacingDirection.RIGHT:
        //         break;
        // }

        chance = this.game.rnd.realInRange(1, 3)

        // 50% chance to change direction
        if (chance > 2) return true

        return false
    }

    GetNewDirection() {
        switch(this.directionFacing) {
            case EntityFacingDirection.LEFT:
                this.moveRight()
                break;

            case EntityFacingDirection.RIGHT:
                this.moveLeft()
                break;
        }
    }
}