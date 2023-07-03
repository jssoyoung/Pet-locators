const { Messages,User } = require('../models/index');

exports.displayMessages = async (req, res) => {
  const userId = req.session.user.id;
  const receivedMessages = await Messages.findAll({
    raw: true,
    where: {
      receiver_id: userId,
    },
    include:{model:User,as:"receiver",include:{
      model:Messages,as:"sender"
    }}
  });
  console.log(receivedMessages)
  const sentMessages = await Messages.findAll({
    raw: true,
    where: {
      sender_id: userId,
    },
  });
  const allMessages =[]
  
   receivedMessages.reduce((allMessages,receivedMessage) => {
   const  {sender_id,receiver_id,message,createdAt} = receivedMessage
   
     console.log(receivedMessage)
     allMessages.push({
      "sender": sender_id,
      "receiver" :receiver_id ,
      "message": `${message}`,
      "createdAt":createdAt
     })
     
     return allMessages
   },allMessages)
   console.log(allMessages)
  
  
  // const sender = await User.findOne(
  //   {where :{ id: receivedMessages }}
  // )
  res.render('messages', {
    receivedMessages: allMessages,
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
