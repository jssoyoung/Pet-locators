const { Messages } = require('../models/index');

exports.displayMessages = async (req, res) => {
  const userId = req.session.user.id;
  const receivedMessages = await Messages.findAll({
    raw: true,
    where: {
      receiver_id: userId,
    },
  });
  const sentMessages = await Messages.findAll({
    raw: true,
    where: {
      sender_id: userId,
    },
  });
  res.render('messages', {
    receivedMessages: receivedMessages,
    sentMessages: sentMessages,
  });
};``

exports.sendMessage = async (req, res) => {
  const senderId = req.session.user.id * 1;
  const receiverId = req.body.userId * 1;
  const message = req.body.message;
  await Messages.create({
    sender_id: senderId,
    receiver_id: receiverId,
    message: message,
  });
  res.redirect('/messages');
};
