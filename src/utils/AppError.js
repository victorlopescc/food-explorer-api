class AppError {
    message;
    status;

    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}

module.exports = AppError;