exports.getHome = (req, res) => {
    res.render('home');
}

exports.getLocator = (req, res) => {
    res.render('locator');
}

exports.getUser = (req, res) => {
    res.render('user');
}

exports.getContact = (req, res) => {
    res.render('contact');
}

exports.postSearch = (req, res) => {
    console.log(req.search)
}