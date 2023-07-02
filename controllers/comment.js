const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');

const postComment = async (req, res) => {
  const { petId, pictureId, comment } = req.body;
  const user = req.session.user;
  await Comments.create({
    petId,
    user_id: user.id,
    picture_id: pictureId,
    comment,
  });
  res.redirect(`/pets/${petId}/${pictureId}`);
};

module.exports = {
  postComment,
};
