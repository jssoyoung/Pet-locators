const express = require('express');
//const routes = require('./routes/user');
const sequelize = require('./config/connection');
const session = require("express-session");
const handlebars = require("express-handlebars");

const app = express();
app.engine(
  "handlebars", handlebars({
    defaultLayout: 'layout',
  })
)
app.set(
  "view engine","handlebars")

app.set("views","views")


app.use(express.json())

app.use(express.urlencoded({
  extended: false
}));

//app.use(routes)





sequelize.sync({
  force: true
})
.then(() => {app.listen(3001, () => {
  console.log('Server running on port 3001');
})}).catch(error => {
  console.log(`Error ${error}`);
}) 



