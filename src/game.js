import { CONFIG } from '../constants'
import { HealthDisplayController } from './player'
import { TicketController } from './ticket';
export class GameController {
    constructor(game, config) {
        this.game = game

        this.maps       = new Map()
        this.layers     = new Map()
        this.entities   = new Map()

        this.ticketDisplayManager
        this.healthDisplayManager =
            new HealthDisplayController(game, {following: 'patrick'})
    }

    addTileMap(name, image, layers) {
        const map = this.game.add.tilemap(name)

        if (image) map.addTilesetImage(image)
        if (Array.isArray(layers) && layers.length)
            layers.forEach(layer =>
                this.layers.set(layer, map.createLayer(layer)))

        this.maps.set(name, map)

        return this
    }

    addLayer(map, layer) {
        let _map = this.maps.get(map)
        this.layers.set(layer, _map.createLayer(layer))

        return this
    }

    addEntity(name, entity) {
        this.entities.set(name, entity)

        return this
    }

    initialize() {
        this.entities.forEach(e => {
            if (!e.initialized) e.init()
        })
    }

    start() {
        // let whiteboard = this.game.add.sprite(CONFIG.WORLD.width / 2, 16, 'jira_board')
        // whiteboard.anchor.setTo(0.5, 0)

        // this.ticketDisplayManager = new TicketController(this, {
        //     whiteboard: whiteboard
        // })
        this.ticketDisplayManager.spawn(4)

        this.healthDisplayManager.init(this.entities.get('patrick'))

        this.game.camera.x = CONFIG.SCREEN.width / 2
        this.game.camera.follow(this.entities.get('patrick'),
            Phaser.Camera.FOLLOW_PLATFORMER)
    }

    update() {
        this.entities.forEach(e => e.update())
        this.ticketDisplayManager.update()
        this.healthDisplayManager.update(this.entities.get('patrick'))
    }

    render() {
        this.healthDisplayManager.render()
    }
}