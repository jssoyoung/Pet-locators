const { User, Pets, Likes, Comments, Pictures } = require('../models/index');
const { Op } = require('sequelize');

exports.getUser = async (req, res) => {
  const currentUser = await User.findByPk(req.session.user.id, {
    include: {
      model: Pets,
      as: 'pets',
      include: { model: Pictures, as: 'pictures' },
    },
  });

  const petData = currentUser.pets.reduce((data, pet) => {
    const { name: petName, id: petId, pictures } = pet;
    if (pictures.length > 0) {
      const latestPicture = pictures[pictures.length - 1];
      const latestPictureId = latestPicture.id;
      const profilePicture = pet.profile_picture;
      data.push({ petName, petId, latestPictureId, profilePicture });
    }
    return data;
  }, []);

  console.log(petData);

  res.render('user', {
    isUserPage: true,
    petData: petData.length > 0 ? petData : null,
    username: currentUser.user_name,
    userPicture: currentUser.userPicture,
    email: currentUser.email,
    city: currentUser.city,
    state: currentUser.state,
    pronouns: currentUser.pronouns,
    phone_number: currentUser.phone_number,
    twitter: currentUser.twitter,
    facebook: currentUser.facebook,
    instagram: currentUser.instagram,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.getOtherUser = async (req, res) => {
  const otherUser = await User.findByPk(req.params.id, {
    include: {
      model: Pets,
      as: 'pets',
      include: { model: Pictures, as: 'pictures' },
    },
  });

 const petData = otherUser.pets.reduce((data, pet) => {
   const { name: petName, id: petId, pictures } = pet;
   if (pictures.length > 0) {
     const latestPicture = pictures[pictures.length - 1];
     const latestPictureId = latestPicture.id;
     const profilePicture = pet.profile_picture;
     data.push({ petName, petId, latestPictureId, profilePicture });
   }
   return data;
 }, []);

  res.render('user', {
    isUserPage: true,
    petData: petData.length > 0 ? petData : null,
    userPicture: otherUser.userPicture,
    username: otherUser.user_name,
    email: otherUser.email,
    city: otherUser.city,
    state: otherUser.state,
    pronouns: otherUser.pronouns,
    isLoggedIn: req.session.isLoggedIn,
  });
};
