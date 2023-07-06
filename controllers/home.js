exports.getHome = (req, res) => {
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
    isHomePage: true,
  });
};
