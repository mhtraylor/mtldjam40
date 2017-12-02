import 'phaser'

export const WASD_KEYS = [
    ["up"   , Phaser.Keyboard.UP    ],
    ["down" , Phaser.Keyboard.DOWN  ],
    ["left" , Phaser.Keyboard.LEFT  ],
    ["right", Phaser.Keyboard.RIGHT ],
]

export const KeyEventFactory = (params, game) => {
    const keys = []
    const events = {}
    const ctrl = {}

    params.forEach(([name, key]) => {
        keys.push([name, game.input.keyboard.addKey(key)])

        const [u, d] = [`${name}UP`, `${name}DOWN`]
        events[u] = new Event(u)
        events[d] = new Event(d)

        ctrl[name] = (p, r) => {
            document.addEventListener(d, p)
            document.addEventListener(u, r)
        }
    })

    ctrl.update = () => {
        keys.forEach(([k, v]) => {
            const e = v.isDown ? `${k}DOWN` : (v.isUp ? `${k}UP` : null)
            if (e) document.dispatchEvent(events[e])
        })
    }

    return ctrl
}

