require('express-async-errors');
require('dotenv/config');

const AppError = require('./utils/AppError');
const upload = require('./configs/upload');

const cors = require('cors');
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/files', express.static(upload.UPLOADS_FOLDER));

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