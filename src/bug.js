import { Entity } from "./entity";

export class Bug extends Entity {
    constructor(game, config) {
        super(game, config)

        let anim = [ 
            { name: 'walk', frames: [0, 1, 2, 3], fps: 8, loop: true }
        ]

        anim.forEach(x => this.addAnimation(x))
    }

    moveUp() {}

    moveDown() {}

    moveLeft() {
        this.scale.x = -1
        this.x -= this.config.speed.x
        this.play('walk')
    }

    moveRight() {
        this.scale.x = 1
        this.x += this.config.speed.x
        this.play('walk')
    }

    update() {
        this.play('walk');
    }
}