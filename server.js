const express = require('express');
const routes = require('./routes/user');
const sequelize = require('./config/connection');
const session = require('express-session');
const SequelizeStore = require('./utils/session');
const handlebars = require('express-handlebars');

const app = express();

app.use(
  session({
    secret: 'team pet locators',
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
    saveUninitialized: false,
  })
);

app.use(express.static('public'));
app.use(express.static('dist'));

app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
  })
);

app.set('view engine', 'handlebars');
app.set('views', 'views');
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(routes);

sequelize
  .sync({
    force: false,
  })
  .then(() => {
    app.listen(3001, () => {
      console.log('Server running on port 3001');
    });
  })
  .catch((error) => {
    console.log(`Error ${error}`);
  });
