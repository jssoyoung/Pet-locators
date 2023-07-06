const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./routes/index');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'team pet locators',
  cookie: {
    maxAge: 7200000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// app.use(
//   session({
//     secret: 'team pet locators',
//     cookie: {
//       maxAge: 3600000,
//       httpOnly: true,
//       secure: false,
//       sameSite: 'strict',
//     },
//     store: new SequelizeStore({
//       db: sequelize,
//     }),
//     resave: false,
//     saveUninitialized: true,
//   })
// );

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

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
