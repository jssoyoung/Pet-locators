const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');

exports.postLike = async (req, res) => {
  const { pictureId, petId } = req.body;
  const userId = req.session.user.id;
  const userLiked = await Likes.findOne({
    where: { user_id: userId, picture_id: pictureId },
  });
  if (!userLiked) {
    await Likes.create({ user_id: userId, picture_id: pictureId });
  } else if (userLiked) {
    await Likes.destroy({ where: { user_id: userId, picture_id: pictureId } });
  }
  res.redirect(`/pets/${petId}/${pictureId}`);
};
