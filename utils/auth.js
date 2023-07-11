const withAuth = (req, res, next) => {
  if (!req.session.isLoggedIn || !req.session.user.id) {
    req.session.destroy(() => {
      res.status(204).redirect('/');
    });
  } else {
    next();
  }
};

module.exports = withAuth;
