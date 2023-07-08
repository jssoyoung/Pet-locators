// Import Conversation, Messages, and User models:
const { Conversation, Messages, User } = require('../models/index');
// Import Op for query operators:
const { Op } = require('sequelize');

// TODO: Replace this with Socket.io as it makes excessive calls to the database:
exports.displayMessages = async (req, res) => {
  try {
    // Grab the user who is logged in:
    const user = await User.findByPk(req.session.user.id);
    const userId = user.id;
    // Find all conversations that the user is a part of:
    const allConversations = await Conversation.findAll({
      where: { [Op.or]: [{ initiator_id: userId }, { recipient_id: userId }] },
      // Include the messages model to access the messages:
      include: [{ model: Messages }],
    });

    const messagesByConversationId = {};

    // Loop through all conversations and grab the messages:
    for (const conversation of allConversations) {
      const conversationId = conversation.id;
      const wholeConversation = await Conversation.findByPk(conversationId);
      // Grab initiator and recipient of the conversation:
      const initiatorId = wholeConversation.initiator_id;
      const initiator = await User.findByPk(initiatorId);
      const recipientId = wholeConversation.recipient_id;
      const recipient = await User.findByPk(recipientId);

      // Loop through all messages and push them to the messagesByConversationId object by conversation id:
      for (const message of conversation.messages) {
        // If the conversation id does not exist in the messagesByConversationId object, create a new object with the conversation id as the key:
        if (!messagesByConversationId[conversationId]) {
          // Define initiator and recipient based on if the user is the initiator or recipient of the conversation:
          messagesByConversationId[conversationId] = {
            conversation_id: conversationId,
            recipient:
              initiator.id === userId
                ? recipient.user_name
                : initiator.user_name,
            recipient_picture:
              initiator.id === userId
                ? recipient.userPicture
                : initiator.userPicture,
            user_picture: user.userPicture,
            recipient_id: initiator.id === userId ? recipient.id : initiator.id,
            messages: [],
          };
        }
        // If the user is the initiator of the conversation, add 'Sent' to the message string; otherwise, add 'Received' to the message string:
        // This will be used to render correct message styling on the messages page:
        if (message.user_id === userId) {
          message.message = `Sent: ${message.message}`;
          messagesByConversationId[conversationId].messages.push(
            message.message
          );
        } else {
          message.message = `Received: ${message.message}`;
          messagesByConversationId[conversationId].messages.push(
            message.message
          );
        }
      }
    }

    res.render('messages', {
      isLoggedIn: req.session.isLoggedIn,
      conversations: messagesByConversationId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  // Grab the user who is logged in, the recipient id from the request body, and the message from the request body:
  try {
    const initiatorId = req.session.user.id;
    const recipientId = req.body.userId;
    const message = req.body.message;
    // Find the conversation between the user who is logged in and the recipient:
    const existingConversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { initiator_id: initiatorId, recipient_id: recipientId },
          { initiator_id: recipientId, recipient_id: initiatorId },
        ],
      },
    });
    // If the conversation already exists, add the message to the conversation:
    if (existingConversation) {
      await Messages.create({
        conversation_id: existingConversation.id,
        user_id: initiatorId,
        message: message,
      });
      // If the conversation does not exist, create a new conversation and add the message to the conversation:
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
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message });
  }
};
