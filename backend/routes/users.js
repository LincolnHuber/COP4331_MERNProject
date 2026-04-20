const express = require('express');
const mongoose = require('mongoose');
const User = require('../Models/users');
const Game = require('../Models/games');
const { serializeGame } = require('../utils/serializers');

const router = express.Router();

function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

async function loadUserLibrary(userId) {
  const user = await User.findById(userId).populate({
    path: 'gamesLibrary',
    match: { isActive: true },
  });

  if (!user) {
    return null;
  }

  return user.gamesLibrary.map(serializeGame);
}

router.get('/:userId/library', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const library = await loadUserLibrary(userId);

    if (!library) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ library });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:userId/library', async (req, res) => {
  try {
    const { userId } = req.params;
    const { gameIds } = req.body;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one game id' });
    }

    const uniqueGameIds = [...new Set(gameIds)];
    const invalidGameIds = uniqueGameIds.filter((gameId) => !isValidObjectId(gameId));

    if (invalidGameIds.length > 0) {
      return res.status(400).json({ error: 'One or more game ids are invalid' });
    }

    const validGames = await Game.find({
      _id: { $in: uniqueGameIds },
      isActive: true,
    }).select('_id');

    if (validGames.length !== uniqueGameIds.length) {
      return res.status(400).json({ error: 'One or more games were not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          gamesLibrary: {
            $each: validGames.map((game) => game._id),
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const library = await loadUserLibrary(userId);
    res.status(200).json({ library });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
