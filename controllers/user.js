const { User, Pets, Likes, Comments, Pictures } = require('../models/index');

exports.getUser = async (req, res) => {
  const currentUser = await User.findByPk(req.session.user.id, {
    include: {
      model: Pets,
      as: 'pets',
      include: { model: Pictures, as: 'pictures' },
    },
  });

  const hasAccess = req.session.user.id === currentUser.id;

  const petData = currentUser.pets.reduce((data, pet) => {
    const { name: petName, id: petId, pictures } = pet;
    if (pictures.length > 0) {
      const latestPicture = pictures[pictures.length - 1];
      const latestPictureId = latestPicture.id;
      const profilePicture = pet.profile_picture;
      const isOwner = currentUser.id === req.session.user.id;
      data.push({ petName, petId, latestPictureId, profilePicture, isOwner });
    }
    return data;
  }, []);

  res.render('user', {
    hasAccess: hasAccess,
    isUserPage: true,
    petData: petData.length > 0 ? petData : null,
    userId: currentUser.id,
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

  const hasAccess = req.session.user.id === otherUser.id;

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
    hasAccess: hasAccess,
    isUserPage: true,
    petData: petData.length > 0 ? petData : null,
    userPicture: otherUser.userPicture,
    userId: otherUser.id,
    username: otherUser.user_name,
    email: otherUser.email,
    city: otherUser.city,
    state: otherUser.state,
    pronouns: otherUser.pronouns,
    phone_number: otherUser.phone_number,
    twitter: otherUser.twitter,
    facebook: otherUser.facebook,
    instagram: otherUser.instagram,
    isLoggedIn: req.session.isLoggedIn,
  });
};
