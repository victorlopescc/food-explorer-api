const fs = require('fs');
const path = require('path');
const upload = require('../configs/upload');
const AppError = require('../utils/AppError');

class Storage {
    async save(file) {
        await fs.promises.rename(
            path.resolve(upload.TMP_FOLDER, file),
            path.resolve(upload.UPLOADS_FOLDER, file)
        );

        return file;
    }

    async delete(file) {
        const filePath = path.resolve(upload.UPLOADS_FOLDER, file);

        try {
            await fs.promises.stat(filePath);
        } catch {
            return new AppError('File not found', 404);
        }

        await fs.promises.unlink(filePath);
    }
}

module.exports = Storage;