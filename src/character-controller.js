import 'phaser'
import { KeyEventFactory } from './input';

export const PlayerController = (game, keySet, config) => {
    let keys = KeyEventFactory(keySet, game)
    return (sprite) => {
        keys.right(() => sprite.x += config.speedX)
        keys.left(() => sprite.x -= config.speedX)
        return {
            update: () => keys.update()
        }
    }
}