const express = require('express');
const routes = require('./routes/index');
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('./utils/session');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

app.use(
  session({
    secret: 'team pet locators',
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    saveUninitialized: false,
  })
);

app.use(express.static('public'));
app.use(express.static('dist'));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

(async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
      console.log('Server is running..');
    });
  } catch (error) {
    console.log(`Error ${error}`);
  }
})();
