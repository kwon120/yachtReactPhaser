// src/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

const PhaserGame = () => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      scene: {
        preload: preload,
        create: create,
        update: update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload() {
      this.load.image('sky', 'path/to/sky.png');
    }

    function create() {
      this.add.image(400, 300, 'sky');
    }

    function update() {}

    // Cleanup on component unmount
    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" ref={containerRef} />;
};

export default PhaserGame;
