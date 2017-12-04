import { CONFIG } from '../constants'
import { HealthDisplayController } from './player'
import { TicketController } from './ticket';
export class GameController {
    constructor(game, config) {
        this.game = game

        this.maps       = new Map()
        this.layers     = new Map()
        this.entities   = new Map()
        this.images     = new Map()

        this.ticketDisplayManager
        this.healthDisplayManager =
            new HealthDisplayController(game, {following: 'patrick'})

        this.keys = {
            p: this.game.input.keyboard.addKey(Phaser.Keyboard.P)
        }

        this.level = CONFIG.LEVELS[0]
        this.score = 0
        this.scoreTxt

        this.scoreEvent = new Phaser.Signal()
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

    addImage(name, pos, anchor) {
        let image = this.game.add.image(pos[0], pos[1], name)
        image.renderable = false
        if (anchor) image.anchor.setTo(anchor[0], anchor[1])
        this.images.set(name, image)
    }

    initialize() {
        this.entities.forEach(e => {
            if (!e.initialized) e.init()
        })
    }

    togglePause() {
        this.game.paused = !this.game.paused
        let img = this.images.get('pause')
        let pat = this.entities.get('patrick')
        let px  = pat.position.x
        let py  = CONFIG.SCREEN.height / 2
        img.position.setTo(px, py)
        img.bringToTop()
        img.renderable = this.game.paused
    }

    updateScore(amt) {
        this.score += amt
        this.score = this.game.math.clamp(this.score, 0, 999999)
    }

    start() {
        this.keys.p.onUp.add(() => this.togglePause())
        this.scoreEvent.add((amt) => this.updateScore(amt))

        this.scoreTxt = this.game.add.text(
            CONFIG.SCREEN.width,
            CONFIG.SCREEN.height - 32,
            "0",
            { font: "24px Arial", fill: "#ffffff", align: "right" }
        )
        this.scoreTxt.anchor.setTo(1, 0.5)
        this.scoreTxt.fixedToCamera = true
        this.scoreTxt.cameraOffset.setTo(CONFIG.SCREEN.width - 16, CONFIG.SCREEN.height - 24)

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
        this.scoreTxt.setText(`${this.score}`)
    }

    render() {
        this.healthDisplayManager.render()
    }
}