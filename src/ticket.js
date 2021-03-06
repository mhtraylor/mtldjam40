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
    constructor(gameCtrl, config) {
        super(gameCtrl.game, config.pos[0], config.pos[1], config.name)

        this.angle = config.angle
        this.anchor.setTo(config.anchor[0], config.anchor[1])
        this.config = config || {
            numSnippets: 4,
            name: 'default'
        }

        // CHANGE NUMBUGS TO ALGORITHM GENERATED BASED ON SNIPPETS COMPLETED
        this.gameCtrl = gameCtrl
        this.game = gameCtrl.game

        this.tint = this.config.tint || 0xffffff

        this.snippets = []
        this.bugs = []

        this.currentStatus = TicketStatus.TODO

        // Bug Spawn Timer
        this.bugSpawnTimer = this.gameCtrl.game.time.create(false)
        this.bugSpawnTimer.loop(5000, this.ChanceSpawnBug, this)
        this.bugSpawnTimer.start()

        
        // Board x offsets
        this.defaultXPos = this.position.x
        this.boardPositions = {
            TODO: this.defaultXPos,
            IN_PROGRESS: this.defaultXPos + 64,
            QA: this.defaultXPos + 128,
            DONE: this.defaultXPos + 192
        }

        this.anglePositions = {
            TODO: this.gameCtrl.game.rnd.realInRange(-5, 5),
            IN_PROGRESS: this.gameCtrl.game.rnd.realInRange(-10, 10),
            QA: this.gameCtrl.game.rnd.realInRange(-15, 15),
            DONE: this.gameCtrl.game.rnd.realInRange(-20, 20)
        }
    }


    init() {
        this.gameCtrl.game.add.existing(this)
        this.GenerateSnippets()
    }


    update() {
        // Check snippets if the ticket is in todo or in progress
        if (this.currentStatus == TicketStatus.TODO || this.currentStatus == TicketStatus.IN_PROGRESS) this.CheckSnippets()

        // check bugs if the ticket is in qa
        if (this.currentStatus == TicketStatus.QA) this.CheckBugs()
    }


    ShiftBoardPosition() {
        switch(this.currentStatus) {
            case TicketStatus.TODO:
                this.position.x = this.boardPositions.TODO
                this.angle = this.anglePositions.TODO
                break;
            case TicketStatus.IN_PROGRESS:
                this.position.x = this.boardPositions.IN_PROGRESS
                this.angle = this.anglePositions.IN_PROGRESS
                break;
            case TicketStatus.QA:
                this.position.x = this.boardPositions.QA
                this.angle = this.anglePositions.QA
                break;
            case TicketStatus.DONE:
                this.position.x = this.boardPositions.DONE
                this.angle = this.anglePositions.DONE
                break;
        }
    }



    AllSnippetsAreCollected() {
        let allSnippets = true
        
        this.snippets.forEach(snp => {
            if (!snp.isCollected) allSnippets = false
        })

        return allSnippets
    }


    GetCollectedSnippetsCount() {
        let count = 0

        this.snippets.forEach(snp => {
            if (snp.isCollected) count++
        })

        return count
    }


    AllBugsAreKilled() {
        let allBugs = true

        this.bugs.forEach(bug => {
            if (bug.alive) allBugs = false
        })
        
        return allBugs
    }


    CheckSnippets() {
        if (this.AllSnippetsAreCollected()) {
            this.currentStatus = TicketStatus.QA
            this.bugSpawnTimer.stop()
        } else {
            if (this.GetCollectedSnippetsCount() && this.currentStatus !== TicketStatus.IN_PROGRESS) this.currentStatus = TicketStatus.IN_PROGRESS
        }

        this.ShiftBoardPosition()
    }


    CheckBugs() {
        if (this.AllBugsAreKilled()) {
            this.currentStatus = TicketStatus.DONE
            this.ShiftBoardPosition()
            this.gameCtrl.scoreEvent.dispatch(this.gameCtrl.level.pointsPerTicket)
            // trigger a done event for ticket
        }
    }


    GenerateSnippets() {
        let x = CONFIG.WORLD.width / 2
        let y = 96

        let px = 0
        for (let s = 0; s < this.config.numSnippets; s++) {
            px = this.game.rnd.integerInRange(0, CONFIG.WORLD.width)

            let snip = new Snippet(this.gameCtrl, {
                pos   : [px, y],
                anchor: [0.5, 1],
                name  : 'snippet',
                tint  : this.tint
            })

            snip.init([19, 23, 6, 10])
            snip.addCollision(this.gameCtrl.layers.get('air-layer'))
            snip.addCollision(this.gameCtrl.layers.get('ground-layer'))
            snip.addOverlap(this.gameCtrl.entities.get('patrick'))

            this.snippets.push(snip)
        }
    }


    ChanceSpawnBug() {
        if (this.currentStatus !== TicketStatus.IN_PROGRESS) return

        // Use this to offset percentages for balance
        let offset = 0

        // ----------------- NEED BETTER ALGORITHM
        let chance = 100 * (this.GetCollectedSnippetsCount() / (this.snippets.length + offset))
        let randomNum = this.game.rnd.integerInRange(1, 100)
        if (chance > randomNum) {
            //console.log('passed generation')
            this.GenerateBug()
        } else {
            //console.log('failed generation')
        }
        // -----------------
    }


    GenerateBug() {
        let x = this.game.rnd.realInRange(32, CONFIG.WORLD.width - 32)
        let y = CONFIG.SCREEN.height - 100

        let bug = new Bug(this.gameCtrl, {
            pos   : [x, y],
            anchor: [0.5, 1],
            name  : 'bug',
            tint  : this.tint
        })

        bug.init()
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
    constructor(gameCtrl, config) {
        this.gameCtrl = gameCtrl

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

    spawn(cnt) {
        for (let i=0; i<cnt; i++) {
            let ix = (Math.floor((i / (cnt/2))) * 32) + this.config.TICKET_BASE_POS.x
            let iy = ((i % (cnt/2)) * 32) + this.config.TICKET_BASE_POS.y

            let ticket = new Ticket(this.gameCtrl, {
                anchor: [0.5, 0.5],
                angle: this.gameCtrl.game.rnd.realInRange(-5, 5),
                numSnippets: this.gameCtrl.game.rnd.realInRange(1, 8), // this should be based on level
                name: 'ticket',
                tint: this.getRandomAvailableColor(),
                pos: [ix, iy]
              })

            ticket.init()
            for (const [k, v] in this.tickets) {
                if (TicketStatus.TODO === k)
                    v.push(ticket)
            }
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