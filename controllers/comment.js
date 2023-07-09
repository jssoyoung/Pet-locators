// Import Comments model:
const { Comments } = require('../models/index');

const postComment = async (req, res) => {
  try {
    // Grab the petId, pictureId, and comment text from the request body
    const { petId, pictureId, comment } = req.body;
    // Grab the user from the session
    const user = req.session.user;

    // Create a new comment in the database; include the petId, user_id, picture_id, and comment text
    await Comments.create({
      petId: petId,
      // This user.id is the user id from the session; it is the user who is logged in
      user_id: user.id,
      picture_id: pictureId,
      comment: comment,
    });

    // Redirect the user back to the pet's page which will display the newly created comment along with all other comments if they exist
    const redirectUrl = `/pets/${petId}/${pictureId}`;
    // Send a response back to the client if the comment was posted successfully
    res.status(200).json({
      message: 'Comment posted successfully',
      redirectUrl,
    });
  } catch (error) {
    // If an error occurs, send error message:
    res.status(500).json({ message: 'Failed to post the comment' });
  }
};

const deleteComment = async (req, res) => {
  try {
    // Grab the commentId from the request body
    const comment = await Comments.findByPk(req.body.commentId);
    // Grab the user from the session and check if the user is the owner of the comment
    const isUserComment = comment.user_id === req.session.user.id;
    // If the user is the owner of the comment:
    if (isUserComment) {
      // If the comment is not found, send error message:
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      // And if the comment is found, delete the comment
      await comment.destroy();
      // Send a response back to the client if the comment was deleted successfully
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      // If the user is not the owner of the comment, do not perform any action
      return;
    }
    // If an error occurs, send error message:
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete the comment' });
  }
};

// Export the postComment and deleteComment functions
module.exports = {
  postComment,
  deleteComment,
};
