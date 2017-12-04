import 'phaser'

import { CONFIG } from '../constants'
import { Snippet } from './snippet'
import { Bug } from './bug'

export const TicketStatus = {
    TODO: 0,
    IN_PROGRESS: 1,
    QA: 2,
    DONE: 3
}


export class Ticket extends Phaser.Sprite {
    constructor(game, config) {
        super(game, config.pos[0], config.pos[1], config.name)
        
        this.anchor.setTo(config.anchor[0], config.anchor[1])
        this.config = config || {
            numSnippets: 4,
            name: 'default'
        }

        // CHANGE NUMBUGS TO ALGORITHM GENERATED BASED ON SNIPPETS COMPLETED

        this.game = game
    
        this.tint = Math.random() * 0xffffff

        this.snippets = []
        this.bugs = []

        this.currentStatus = TicketStatus.TODO
    }


    init(layer_ground, pt) {
        this.game.add.existing(this)

        this.GenerateSnippets(pt)
        this.GenerateBugs(layer_ground, pt)
    }


    update() {
        // Check snippets if the ticket is in todo or in progress
        if (this.currentStatus == TicketStatus.TODO || this.currentStatus == TicketStatus.IN_PROGRESS) this.CheckSnippets()

        // check bugs if the ticket is in qa
        if (this.currentStatus == TicketStatus.QA) this.CheckBugs()
    }



    CheckSnippets() {
        let allSnippets = true

        this.snippets.forEach(snp => {
            if (!snp.isCollected) allSnippets = false
        })

        if (allSnippets) {
            this.currentStatus = TicketStatus.QA
            console.log('all snippets collected --> move to qa')
        } else {
            if (this.currentStatus !== TicketStatus.IN_PROGRESS) this.currentStatus = TicketStatus.IN_PROGRESS
        }
    }


    CheckBugs() {
        let allBugs = true

        this.bugs.forEach(bug => {
            if (bug.alive) allBugs = false
        })

        if (allBugs) {
            this.currentStatus = TicketStatus.DONE
            console.log('all bugs killed --> move to done')
            // trigger a done event for ticket
        }
    }


    GenerateSnippets(pt) {
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
            snip.addOverlap(pt)
            this.snippets.push(snip)

            x += 60
            y += 60
        }
    }


    GenerateBugs(layer_ground, pt) {
        let x = CONFIG.SCREEN.width / 2 - 100
        let y = CONFIG.SCREEN.height - 100

        for (let b = 0; b < this.config.numBugs; b++) {
            let bug = new Bug(this.game, {
                pos   : [x, y],
                anchor: [0.5, 1],
                name  : 'bug',
                tint  : this.tint
            })

            bug.init([24, 17, 4, 9])
            bug.addCollision(layer_ground)
            bug.addCollision(pt)
            this.bugs.push(bug)

            x += 64
        }
    }
}