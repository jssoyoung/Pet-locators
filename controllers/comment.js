const { Comments } = require('../models/index');

const postComment = async (req, res) => {
  try {
    const { petId, pictureId, comment } = req.body;
    const user = req.session.user;

    await Comments.create({
      petId,
      user_id: user.id,
      picture_id: pictureId,
      comment,
    });

    const redirectUrl = `/pets/${petId}/${pictureId}`;
    res.status(200).json({
      message: 'Comment posted successfully',
      redirectUrl,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to post the comment' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comments.findByPk(req.body.commentId);
    const isUserComment = comment.user_id === req.session.user.id;
    if (isUserComment) {
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      await comment.destroy();
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      return;
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'An internal error!',
    });
  }
};

module.exports = {
  postComment,
  deleteComment,
};
