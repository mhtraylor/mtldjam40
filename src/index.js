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
  this.game.load.image('study', 'assets/img/study.png');
  this.game.load.image('dev_bkg', 'assets/img/dev_bkg_512x480.png')
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
      , game.world.centerY * 1.25
      , 'patrick' )
  ]

  dev_objs[0].anchor.setTo(0, 0)
  dev_objs[1].anchor.setTo(0.5, 0.5)
  dev_objs[1].animations.add('walk')
  dev_objs[1].animations.play('walk', 8, true)

  // const objects = [
  //   game.add.text(game.world.centerX, game.world.centerY * 0.8, `Welcome to Phaser ${pkg.dependencies.phaser.substr(1)}`, { font: "bold 19px Arial", fill: "#fff" }),
  //   game.add.sprite(game.world.centerX, game.world.centerY * 1.2, 'study')
  // ];

  // objects.forEach(obj => obj.anchor.setTo(0.5, 0.5));
}
