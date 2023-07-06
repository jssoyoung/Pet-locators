const { User, Pictures, Likes } = require('../models/index');
const { Op } = require('sequelize');

exports.getLocator = async (req, res) => {
  const { city, state } = await User.findOne({
    where: { id: req.session.user.id },
  });
  const sameCityUsers = await User.findAll({
    where: {
      id: { [Op.not]: req.session.user.id },
      city,
      state,
    },
  });

  // const allPictures = await Pictures.findAll({
  //   include: {
  //     model: Likes,
  //   },
  // });
  const likedPictures = [];
  for (const picture of allPictures) {
    const pictureLikeCount = await Likes.findAndCountAll({
      where: {
        picture_id: picture.id,
      },
    });
    if (picture.pet_id && picture.pictureUrl !== '/images/image__welcome.png') {
      likedPictures.push({
        likesCount: pictureLikeCount.count,
        picture_id: picture.id,
        pictureUrl: picture.pictureUrl,
        pet_id: picture.pet_id,
      });
    }
  }

  const sortedLikedPictures = likedPictures.sort(
    (a, b) => b.likesCount - a.likesCount
  );

  res.render('locator', {
    trendingPictures: sortedLikedPictures,
    usersInTheSameCity: sameCityUsers,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postSearch = (req, res) => {
  console.log(req.body.userSearch);
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
  });
};
