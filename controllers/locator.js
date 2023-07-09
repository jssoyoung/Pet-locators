// Import User, Pictures, and Likes models:
const { User, Pictures, Likes } = require('../models/index');
// Import Op for query operators:
const { Op } = require('sequelize');
const sequelize = require('../config/connection');

exports.getLocator = async (req, res) => {
  // Grab the city and state of the user who is logged in:
  try {
    const { city, state } = await User.findOne({
      where: { id: req.session.user.id },
    });
    // Find all users who are in the same city and state as the user who is logged in:
    const sameCityUsers = await User.findAll({
      where: {
        // Exclude the user who is logged in from the results:
        id: { [Op.not]: req.session.user.id },
        city,
        state,
      },
    });

    // Find all pictures that have been liked by users; group by picture_id and order by the number of likes in descending order:
    const allLikes = await Likes.findAll({
      // Include the picture model to access the pictureUrl, pet_id, and picture_id:
      include: { model: Pictures, as: 'picture' },
      // Group by picture_id and count the number of likes for each picture:
      attributes: [
        'picture_id',
        [sequelize.fn('COUNT', sequelize.col('likes.user_id')), 'likesCount'],
      ],
      group: ['picture_id'],
      // Order by the number of likes in descending order:
      order: [[sequelize.literal('likesCount'), 'DESC']],
      // Limit the number of results to 5:
      limit: 10,
    });

    console.log(allLikes);
    // Map through the allLikes array to grab the pictureUrl, pet_id, and picture_id:
    // This will be used to display the trending pictures on the locator page:
    const trendingPictures = allLikes.map((like) => {
      return {
        pictureUrl: like.picture.pictureUrl,
        pet_id: like.picture.pet_id,
        picture_id: like.picture.id,
      };
    });

    // Render Locator page:
    res.render('locator', {
      trendingPictures,
      usersInTheSameCity: sameCityUsers,
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message });
  }
};
