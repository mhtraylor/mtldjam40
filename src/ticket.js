import 'phaser'

import { CONFIG } from '../constants'
import { Snippet } from './snippet'
import { Bug } from './bug'

export class Ticket {
    constructor(game, config) {
        this.config = config || {
            numSnippets: 4,
            name: 'default'
        }
        // CHANGE NUMBUGS TO ALGORITHM GENERATED BASED ON SNIPPETS COMPLETED

        this.game = game
    
        this.tint = Math.random() * 0xffffff
        this.snippets = []
        this.bugs = []
    }


    init(layer_ground) {
        this.GenerateSnippets()
        this.GenerateBugs(layer_ground)
    }


    GenerateSnippets() {
        let x = CONFIG.SCREEN.width / 2 - 100
        let y = CONFIG.SCREEN.height / 2 - 100

        for (let s = 0; s < this.config.numSnippets; s++) {
            let snip = new Snippet(this.game, {
                pos   : [x, y],
                anchor: [0.5, 1],
                name  : 'snippet',
                tint  : this.tint
            })

            snip.init()
            this.snippets.push(snip);

            x += 60
            y += 60
        }
    }


    GenerateBugs(layer_ground) {
        let x = CONFIG.SCREEN.width / 2 - 100
        let y = CONFIG.SCREEN.height - 100

        for (let b = 0; b < this.config.numBugs; b++) {
            let bug = new Bug(this.game, {
                pos   : [x, y],
                anchor: [0.5, 1],
                name  : 'bug',
                tint  : this.tint
            })

            bug.init()
            bug.addCollision(layer_ground);
            this.bugs.push(bug);

            x += 64
        }
    }
}