require('express-async-errors');
require('dotenv/config');

// TODO: import migrations
const AppError = require('./utils/AppError');
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

app.use((error, request, response, next) => {
    if (error instanceof AppError) {
        return response.status(error.status).json({
            message: error.message,
            status: 'error'
        });
    }

    console.error(error);

    return response.status(500).json({
        message: 'Internal server error',
        status: 'error'
    });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));