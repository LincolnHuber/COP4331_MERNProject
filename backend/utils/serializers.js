function serializeGame(game) {
  if (!game) {
    return null;
  }

  const source = typeof game.toObject === 'function' ? game.toObject() : game;
  const { _id, __v, ...rest } = source;

  return {
    id: _id.toString(),
    ...rest,
  };
}

module.exports = {
  serializeGame,
};
