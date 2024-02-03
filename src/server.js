require('express-async-errors');
require('dotenv/config');

// TODO: import migrations
// TODO: import error handler
// TODO: import upload config

const cors = require('cors');
const express = require('express');
const routes = require('./routes');

// TODO: run migrations

const app = express();
app.use(cors());
app.use(express.json());

// TODO: use upload config

app.use(routes);

// TODO: use error handler

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));