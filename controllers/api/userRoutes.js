const router = require('express').Router();

router.post('/', async (req, res) => {
});

router.post('/login', async (req, res) => {
    try {
    } catch (err) {
      res.status(400).json(err);
    }
  });

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
  module.exports = router;