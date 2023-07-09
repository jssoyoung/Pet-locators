// Import Likes model:
const { Likes } = require('../models/index');

// Create postLike function:
exports.postOrDeleteLike = async (req, res) => {
  // Destructure pictureId and petId from request body:
  const { pictureId, petId } = req.body;
  // Grab the user id from the session:
  const userId = req.session.user.id;
  // Check if user has already liked the picture:
  const userLiked = await Likes.findOne({
    where: { user_id: userId, picture_id: pictureId },
  });
  // If user has not liked the picture, create a new like:
  if (!userLiked) {
    // Create a new like in the database; include the user_id and picture_id:
    await Likes.create({ user_id: userId, picture_id: pictureId });
  } else if (userLiked) {
    // If user has already liked the picture, delete the like from the database;
    // This will unlike the picture:
    await Likes.destroy({ where: { user_id: userId, picture_id: pictureId } });
  }
  // Redirect the user back to the pet's page which will display updated like count:
  res.redirect(`/pets/${petId}/${pictureId}`);
};
