const {
  UserConversation,
  Conversation,
  Messages,
  User,
} = require('../models/index');
const { Op } = require('sequelize');

exports.displayMessages = async (req, res) => {
  const userId = req.session.user.id;
  const allConversations = await Conversation.findAll({
    where: { [Op.or]: [{ initiator_id: userId }, { recipient_id: userId }] },
    include: [
      {
        model: Messages,
      },
    ],
  });

  const messagesByConversationId = {};

  for (const conversation of allConversations) {
    const conversationId = conversation.id;
    const wholeConversation = await Conversation.findByPk(conversationId);
    const initiatorId = wholeConversation.initiator_id;
    const initiator = await User.findByPk(initiatorId);
    const recipientId = wholeConversation.recipient_id;
    const recipient = await User.findByPk(recipientId);
    const user = await User.findByPk(userId);

    for (const message of conversation.messages) {
      if (!messagesByConversationId[conversationId]) {
        messagesByConversationId[conversationId] = {
          conversation_id: conversationId,
          recipient:
            initiator.id === userId ? recipient.user_name : initiator.user_name,
          recipient_picture:
            initiator.id === userId
              ? recipient.userPicture
              : initiator.userPicture,
          user_picture: user.userPicture,
          recipient_id: initiator.id === userId ? recipient.id : initiator.id,
          messages: [],
        };
      }
      if (message.user_id === userId) {
        message.message = `Sent: ${message.message}`;
        messagesByConversationId[conversationId].messages.push(message.message);
      } else {
        message.message = `Received: ${message.message}`;
        messagesByConversationId[conversationId].messages.push(message.message);
      }
    }
  }

  res.render('messages', {
    isLoggedIn: req.session.isLoggedIn,
    conversations: messagesByConversationId,
  });
};

exports.sendMessage = async (req, res) => {
  const initiatorId = req.session.user.id;
  const recipientId = req.body.userId;
  const message = req.body.message;
  const existingConversation = await Conversation.findOne({
    where: {
      [Op.or]: [
        { initiator_id: initiatorId, recipient_id: recipientId },
        { initiator_id: recipientId, recipient_id: initiatorId },
      ],
    },
  });
  if (existingConversation) {
    await Messages.create({
      conversation_id: existingConversation.id,
      user_id: initiatorId,
      message: message,
    });
  } else {
    const newConversation = await Conversation.create({
      initiator_id: initiatorId,
      recipient_id: recipientId,
    });
    await Messages.create({
      conversation_id: newConversation.id,
      user_id: initiatorId,
      message: message,
    });
  }

  res.redirect('/messages');
};
