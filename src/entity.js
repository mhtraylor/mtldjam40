import 'phaser'

export class Entity extends Phaser.Sprite {
    constructor(game, config) {
        super(game, config.pos[0], config.pos[1], config.name)
        this.anchor.setTo(config.anchor[0], config.anchor[1])
        this.config = config
    }

    init() {
        this.game.add.existing(this)
    }

}