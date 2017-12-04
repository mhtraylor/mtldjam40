import 'phaser'

import { CONFIG } from '../constants'
import { Snippet } from './snippet'
import { Bug } from './bug'
import { Entity } from './entity'

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


    init(layer_air, layer_ground, pt) {
        this.game.add.existing(this)

        this.GenerateSnippets(layer_air, layer_ground, pt)
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


    GenerateSnippets(layer_air, layer_ground, pt) {
        let x = CONFIG.WORLD.width / 2
        let y = CONFIG.WORLD.height / 3

        let px = 0
        for (let s = 0; s < this.config.numSnippets; s++) {
            px = this.game.rnd.integerInRange(0, CONFIG.WORLD.width)

            let snip = new Snippet(this.game, {
                pos   : [px, y],
                anchor: [0.5, 1],
                name  : 'snippet',
                tint  : this.tint
            })

            snip.init([19, 23, 6, 10])
            snip.addCollision(layer_air)
            snip.addCollision(layer_ground)
            snip.addOverlap(pt)

            this.snippets.push(snip)
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

export class TicketController {
    constructor(game) {
        this.game = game

        this.tickets = new Map()
        this.tickets.set(TicketStatus.TODO, [])
        this.tickets.set(TicketStatus.IN_PROGRESS, [])
        this.tickets.set(TicketStatus.QA, [])
        this.tickets.set(TicketStatus.DONE, [])

        this.config = {}
        this.config.TICKET_BASE_POS = {
            x: 16, y: 16
        }
    }

    ticketInitializer(initializer) {
        this.initializer = initializer
    }

    spawn(cnt) {
        for (let i=0; i<cnt; i++) {
            let ix = (Math.floor((i / (cnt/2))) * 32) + this.config.TICKET_BASE_POS.x
            let iy = ((i % (cnt/2)) * 32) + this.config.TICKET_BASE_POS.y
            let ticket = new Ticket(this.game, {
                anchor: [0.5, 0.5],
                numSnippets: 4,
                name: 'ticket',
                numBugs: 2,
                pos: [ix, iy]
              })

            this.initializer(ticket)
        }
    }

    update() {
        for (const [s, ts] in this.tickets) {
            ts.forEach(t => t.update())
        }
    }

}