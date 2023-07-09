const { User } = require('../models/index');
const validator = require('validator');

exports.getSettings = async (req, res) => {
  const user = await User.findByPk(req.session.user.id);
  res.render('settings', {
    phone_number: user.phone_number * 1,
    pronouns: user.pronouns,
    city: user.city,
    state: user.state,
    twitter: user.twitter,
    facebook: user.facebook,
    instagram: user.instagram,
    isLoggedIn: req.session.isLoggedIn,
    isSettingsPage: true,
  });
};

exports.updateUser = async (req, res) => {
  const userId = req.session.user.id;
  const user = await User.findByPk(userId);
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword && (newPassword || newPasswordConfirm)) {
    return res.status(400).json({
      message: 'Must provide your current password to update your password.',
    });
  }

  if (currentPassword) {
    const isCorrectPassword = user.checkPassword(currentPassword);
    if (!isCorrectPassword) {
      return res.status(400).json({ message: 'Incorrect current password!' });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: `Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.`,
      });
    }

    if (newPassword !== newPasswordConfirm) {
      return res
        .status(400)
        .json({ message: 'New password and confirmation do not match!' });
    }

    await user.update({
      password: newPassword,
      phone_number: req.body.phone_number || user.phone_number,
      pronouns: req.body.pronoun || user.pronouns,
      city: req.body.city || user.city,
      state: req.body.state || user.state,
      twitter: req.body.twitter || user.twitter,
      facebook: req.body.facebook || user.facebook,
      instagram: req.body.instagram || user.instagram,
      userProfilePicture: user.userPicture,
    });

    return res.status(200).json({ message: 'User updated successfully' });
  }

  await user.update({
    phone_number: req.body.phone_number || user.phone_number,
    pronouns: req.body.pronoun || user.pronouns,
    city: req.body.city || user.city,
    state: req.body.state || user.state,
    twitter: req.body.twitter || user.twitter,
    facebook: req.body.facebook || user.facebook,
    instagram: req.body.instagram || user.instagram,
    userProfilePicture: user.userPicture,
  });

  return res.status(200).json({ message: 'User updated successfully' });
};
