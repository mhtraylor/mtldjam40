import { Entity, EntityFacingDirection } from "./entity";

export class Snippet extends Entity {
    constructor(game, config) {
        super(game, config)

        this.config.MAX_SPEED_Y = 400

        let anim = [
            { name: 'idle', frames: [7, 8, 9, 10], fps: 8, loop: true },
            { name: 'collect', frames: [0, 1, 2, 3, 4, 5, 6], fps: 8, loop: false }
        ]

        anim.forEach(x => this.addAnimation(x))

        this.isCollected = false;

        this.tint = this.config.tint
        this.play('idle')
    }

    
    update() {
        this.overlaps.forEach( (ov, index) =>
            this.game.physics.arcade.overlap(this, ov, (snp, plr) => {
                this.overlaps.splice(index, 1)
                this.CollectSnippet()
            }), null)
        this.collisions.forEach(col =>
            this.game.physics.arcade.collide(this, col))
    }


    CollectSnippet() {
        this.isCollected = true
        this.play('collect')

        // trigger event to update the ticket snippet quantity
    }
}