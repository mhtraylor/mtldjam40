import 'phaser'

export class Entity extends Phaser.Sprite {
    constructor(game, config) {
        super(game, config.pos[0], config.pos[1], config.name)

        this.anchor.setTo(config.anchor[0], config.anchor[1])
        this.config = config
    }

    init() {
        this.game.add.existing(this)
        this.game.physics.enable(this, Phaser.Physics.ARCADE)

        this.body.maxVelocity.setTo(this.config.MAX_SPEED, this.config.MAX_SPEED) // x,y
        this.body.drag.setTo(this.config.DRAG, this.config.DRAG) // x,y
    }

    addAnimation(anim) {
        this.animations.add(
            anim.name, anim.frames, anim.fps, anim.loop
        )
    }

    play(name) {
        this.animations.play(name)
    }

}