import 'phaser'

export const EntityFacingDirection = { LEFT: 0, RIGHT: 1 }


export class Entity extends Phaser.Sprite {
    constructor(game, config) {
        super(game, config.pos[0], config.pos[1], config.name)

        this.anchor.setTo(config.anchor[0], config.anchor[1])
        this.config = config

        this.directionFacing = EntityFacingDirection.RIGHT

        this.collisions = []
        this.overlaps = []

        this.initialized = false
    }

    init(bodySize) {
        this.game.add.existing(this)
        this.game.physics.enable(this, Phaser.Physics.ARCADE)

        this.body.maxVelocity.setTo(this.config.MAX_SPEED_X || 0, this.config.MAX_SPEED_Y || 0) // x,y
        this.body.drag.setTo(this.config.DRAG_X || 0, this.config.DRAG_Y || 0) // x,y
        this.body.bounce.setTo(this.config.BOUNCE_X || 0, this.config.BOUNCE_Y || 0) //x,y

        if (bodySize) {
            this.body.setSize(bodySize[0], bodySize[1], bodySize[2], bodySize[3])
        }

        this.initialized = true
    }

    addAnimation(anim) {
        this.animations.add(
            anim.name, anim.frames, anim.fps, anim.loop
        )
    }

    addCollision(col) {
        this.collisions.push(col)
    }

    addOverlap(ov) {
        this.overlaps.push(ov)
    }

    play(name) {
        this.animations.play(name)
    }
}