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

        this.tint = this.config.tint || 0xffffff

        this.snippets = []
        this.bugs = []

        this.currentStatus = TicketStatus.TODO

        // Bug Spawn Timer
        this.bugSpawnTimer = this.game.time.create(false)
        this.bugSpawnTimer.loop(3000, this.ChanceSpawnBug, this)
        this.bugSpawnTimer.start()
    }


    init(layer_air, layer_ground, pt) {
        this.game.add.existing(this)

        this.GenerateSnippets(layer_air, layer_ground, pt)
        this.GenerateBug(layer_ground, pt)
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
            this.bugSpawnTimer.stop()
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
        let y = 96

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


    ChanceSpawnBug() {
        // need better algorithm
        
    }


    GenerateBug(layer_ground, pt) {
        let x = this.game.rnd.realInRange(32, CONFIG.WORLD.width - 32)
        let y = CONFIG.SCREEN.height - 100

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
    }
}

export const TicketColors = [
    { color: 0xff684e, inUse: false }, // orange
    { color: 0xf93e7d, inUse: false }, // pink
    { color: 0xc2ea00, inUse: false }, // lime
    { color: 0x0fbb65, inUse: false }, // green/teal
    { color: 0xccffff, inUse: false }  // ice blue
]

export class TicketController {
    constructor(game, config) {
        this.game = game

        this.tickets = new Map()
        this.tickets.set(TicketStatus.TODO, [])
        this.tickets.set(TicketStatus.IN_PROGRESS, [])
        this.tickets.set(TicketStatus.QA, [])
        this.tickets.set(TicketStatus.DONE, [])

        this.config = config || {}

        let wx = this.config.whiteboard.world.x - (this.config.whiteboard.texture.width / 2) + 16
        let wy = this.config.whiteboard.world.y + 38

        this.config.TICKET_BASE_POS = {
            x: wx, y: wy
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
                numSnippets: this.game.rnd.realInRange(1, 8), // this should be based on level
                name: 'ticket',
                tint: this.getRandomAvailableColor(),
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

    getRandomAvailableColor() {
        let ticketColors = TicketColors

        for (let i = 0; ticketColors.length; i++) {
            let index = Math.floor(Math.random() * ticketColors.length)
            
            if (ticketColors[index].inUse) {
                ticketColors.splice(index, 1)
            } else {
                TicketColors[index].inUse = true
                return TicketColors[index].color
            }
        }
    }

}