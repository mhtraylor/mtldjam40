import { Entity, EntityFacingDirection } from "./entity";

export class Bug extends Entity {
    constructor(game, config) {
        super(game, config)

        let anim = [
            { name: 'walk', frames: [0, 1, 2, 3], fps: 8, loop: true }
        ]

        this.tint = this.config.tint || 0xFFFFFF;

        this.config.MAX_SPEED = this.GetRandomSpeed()
        this.config.ACCELERATION = this.GetRandomAcceleration()
        this.config.DRAG = 300
        this.config.JUMP_SPEED = -4000

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
            this.game.physics.arcade.collide(this, col))
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
        if (chance > 2) return false

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