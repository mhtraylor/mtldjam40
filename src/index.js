import 'pixi';
import 'p2';
import 'phaser';

import pkg from '../package.json';
import { CONFIG } from '../constants'

// This is the entry point of your game.

const config = {
  width: CONFIG.SCREEN.width,
  height: CONFIG.SCREEN.height,
  renderer: Phaser.AUTO,
  parent: '',
  state: {
    preload,
    create,
  },
  transparent: false,
  antialias: true,
  physicsConfig: { arcade: true },
};

const game = new Phaser.Game(config);

function preload() {
  this.game.load.image('dev_bkg', 'assets/img/dev_lvl_1536x480.png')
  this.game.load.spritesheet
    ( 'patrick'
    , 'assets/img/patrick-walk_64x64.png'
    , 64, 64, 4)
}

function create() {
  const { game } = this;

  const dev_objs = [
    game.add.sprite(0, 0, 'dev_bkg'),
    game.add.sprite
      ( game.world.centerX
      , CONFIG.SCREEN.height - 110
      , 'patrick' )
  ]

  dev_objs[0].anchor.setTo(0, 0)
  dev_objs[1].anchor.setTo(0.5, 0.5)
  dev_objs[1].animations.add('walk')
  dev_objs[1].animations.play('walk', 8, true)

}
