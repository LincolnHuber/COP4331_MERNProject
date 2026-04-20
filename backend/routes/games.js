const express = require('express');
const mongoose = require('mongoose');
const Game = require('../Models/games');
const { serializeGame } = require('../utils/serializers');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const games = await Game.find({ isActive: true }).sort({ title: 1 });
    res.status(200).json({ games: games.map(serializeGame) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:gameId', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.gameId)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }

    const game = await Game.findOne({
      _id: req.params.gameId,
      isActive: true,
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.status(200).json({ game: serializeGame(game) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
