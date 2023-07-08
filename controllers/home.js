exports.getHome = (req, res) => {
  // Render the home page and pass isHomePage variable to the view for public script file:
  res.render('home', {
    isLoggedIn: req.session.isLoggedIn,
    isHomePage: true,
  });
};
