const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');
const app = express();

app.get('/', (req, res) => {
  res.sendFile('index.html');
});
app.listen(3001, () => {
    console.log('Server running on port 3001');
  });
