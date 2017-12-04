export class GameController {
    constructor(game, config) {
        this.game = game

        this.maps       = new Map()
        this.layers     = new Map()
        this.entities   = new Map()
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
        this.entities.get('ticket-ctrl').spawn(4)
        this.game.camera.follow(this.entities.get('patrick'),
            Phaser.Camera.FOLLOW_PLATFORMER)
    }

    update() {
        this.entities.forEach(e => e.update())
    }
}