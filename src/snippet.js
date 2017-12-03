import { Entity, EntityFacingDirection } from "./entity";

export class Snippet extends Entity {
    constructor(game, config) {
        super(game, config)

        let anim = [
            { name: 'idle', frames: [6, 7, 8, 9], fps: 8, loop: true },
            { name: 'collect', frames: [0, 1, 2, 3, 4, 5], fps: 8, loop: false }
        ]

        anim.forEach(x => this.addAnimation(x))

        this.tint = this.config.tint
        this.play('idle')
    }

    update() {}
}