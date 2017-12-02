import 'phaser'
import { Some, None } from './functor'
import { CharacterController } from './character-controller';

export class Entity extends Phaser.Sprite {
    constructor(game, pos, ach, name) {
        super(game, pos[0], pos[1], name)
        game.add.existing(this)
        this.anchor.setTo(ach[0], ach[1])
        this.components = []
    }

    addComponent(comp) {
        this.components.push(comp(this))
        return this
    }

    update() {
        this.components.forEach(comp => comp.update())
    }
}